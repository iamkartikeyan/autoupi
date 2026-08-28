import assert from 'assert';
import { paymentProvider, DevelopmentPaymentProvider } from '../src/services/paymentProvider';
import { qrService } from '../src/services/qr';
import { rewardsService } from '../src/services/rewards';
import { referralService } from '../src/services/referral';
import { notificationService } from '../src/services/notifications';
import { db } from '../src/db';
import { PaymentTransaction } from '@auto-upi/shared';

async function runPhase4Tests() {
  console.log('🧪 Starting Phase 4 Backend Integration, Provider Abstraction & Security Tests...\n');
  let passed = 0;
  let failed = 0;

  function pass(msg: string) {
    console.log(`  ✅ PASS: ${msg}`);
    passed++;
  }

  function fail(msg: string, err: any) {
    console.error(`  ❌ FAIL: ${msg}`, err);
    failed++;
  }

  // =========================================================================
  // 1. PAYMENT PROVIDER ABSTRACTION TESTS
  // =========================================================================
  console.log('1. Testing Payment Provider Abstraction & Clearing Rails...');
  try {
    const devProvider = new DevelopmentPaymentProvider();
    const inrValidation = await devProvider.validateRecipient('priya.sharma@okaxis', 'INR');
    assert.strictEqual(inrValidation.valid, true);
    assert.strictEqual(inrValidation.clearingRail, 'NPCI UPI 2.0');
    assert.strictEqual(inrValidation.bankName, 'State Bank of India');
    pass('INR corridor validates against NPCI UPI 2.0 rail');

    const gbpValidation = await devProvider.validateRecipient('alex.j@payuk', 'GBP');
    assert.strictEqual(gbpValidation.valid, true);
    assert.strictEqual(gbpValidation.clearingRail, 'UK Faster Payments Service (FPS)');
    pass('GBP corridor validates against UK Faster Payments Service');

    const invalidValidation = await devProvider.validateRecipient('', 'INR');
    assert.strictEqual(invalidValidation.valid, false);
    pass('Empty recipient handle correctly rejected by provider validation');

    const paymentResult = await devProvider.createPayment({
      transactionId: 'tx_test_prov_01',
      senderBankAccountId: 'acc_chase_usd_01',
      senderName: 'Aarav Patel',
      recipientId: 'ben_priya_in',
      recipientName: 'Priya Sharma',
      recipientUpiId: 'priya.sharma@okaxis',
      sourceAmount: 100,
      sourceCurrency: 'USD',
      destinationAmount: 8350,
      destinationCurrency: 'INR',
      exchangeRate: 83.5,
      purpose: 'FAMILY_SUPPORT',
    });
    assert(paymentResult.providerReference.startsWith('PROV-CLEAR-'));
    assert.strictEqual(paymentResult.status, 'PROCESSING');
    pass('Provider payment created with unique clearing reference');
  } catch (err: any) {
    fail('Payment provider abstraction failed', err);
  }

  // =========================================================================
  // 2. QR SERVICE & SECURITY VALIDATION TESTS
  // =========================================================================
  console.log('\n2. Testing QR Service, URI Scheme Generation & Security Sanitization...');
  try {
    const qrResult = qrService.generatePaymentQR({
      upiId: 'aarav@autoupi',
      name: 'Aarav Patel',
      amount: 250,
      currency: 'USD',
      note: 'Family remittance',
    });
    assert(qrResult.qrString.startsWith('upi://pay?pa=aarav@autoupi'));
    assert(qrResult.qrString.includes('am=250.00'));
    assert(qrResult.qrString.includes('cu=USD'));
    pass('Standard UPI QR URI generated with valid scheme parameters');

    const parseResult = qrService.parsePaymentQR(qrResult.qrString);
    assert.strictEqual(parseResult.valid, true);
    assert.strictEqual(parseResult.payeeAddress, 'aarav@autoupi');
    assert.strictEqual(parseResult.amount, 250);
    assert.strictEqual(parseResult.currency, 'USD');
    pass('Scanned QR URI parsed successfully');

    // Security: Malicious scheme rejection
    const invalidScheme = qrService.parsePaymentQR('javascript:alert("hacked")');
    assert.strictEqual(invalidScheme.valid, false);
    pass('Malicious javascript: protocol payload rejected');

    // Security: Malformed payload rejection
    const malformed = qrService.parsePaymentQR('upi://pay?invalid=params');
    assert.strictEqual(malformed.valid, false);
    pass('Malformed QR payload without payee address rejected');
  } catch (err: any) {
    fail('QR service tests failed', err);
  }

  // =========================================================================
  // 3. REWARDS ENGINE & BANK BALANCE CREDITING TESTS
  // =========================================================================
  console.log('\n3. Testing Rewards Engine, Post-Settlement Evaluation & Bank Credits...');
  try {
    const mockTx: PaymentTransaction = {
      id: 'tx_rew_test_99',
      referenceNumber: 'UPI-XB-9999999',
      userId: db.currentUser.id,
      beneficiaryId: 'ben_priya_in',
      beneficiaryName: 'Priya Sharma',
      beneficiaryUpiId: 'priya.sharma@okaxis',
      beneficiaryCountry: 'India',
      beneficiaryFlag: '🇮🇳',
      senderBankAccountId: 'acc_chase_usd_01',
      senderBankName: 'JPMorgan Chase Bank',
      senderUpiId: 'aarav@autoupi',
      sourceCurrency: 'USD',
      sourceAmount: 300,
      targetCurrency: 'INR',
      targetAmount: 25050,
      exchangeRate: 83.5,
      fee: 1.5,
      feeCurrency: 'USD',
      status: 'COMPLETED',
      purpose: 'FAMILY_SUPPORT',
      note: 'Milestone test',
      timeline: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const evaluatedReward = rewardsService.evaluateTransactionReward(mockTx);
    assert(evaluatedReward !== null);
    assert.strictEqual(evaluatedReward?.type, 'SCRATCH_CARD');
    pass('Milestone reward evaluated and issued for transaction >= $200 USD');

    const initialBankBal = db.bankAccounts[0].balance;
    const claimRes = rewardsService.claimReward(evaluatedReward!.id);
    assert.strictEqual(claimRes.success, true);
    assert.strictEqual(db.bankAccounts[0].balance, initialBankBal + 15.00);
    pass('Claiming reward credits $15.00 USD directly to primary bank account balance');
  } catch (err: any) {
    fail('Rewards engine tests failed', err);
  }

  // =========================================================================
  // 4. REFERRAL SYSTEM & ANTI-FRAUD QUALIFICATION TESTS
  // =========================================================================
  console.log('\n4. Testing Referral System & Anti-Fraud Server Safeguards...');
  try {
    const refData = referralService.getReferralData();
    assert.strictEqual(refData.referralCode, 'AARAV88');
    pass('Referral data retrieved with personal code');

    // Anti-fraud 1: Self referral prevention
    assert.throws(
      () => {
        referralService.qualifyReferral({
          referrerCode: 'AARAV88',
          friendUserId: db.currentUser.id, // self referral
          friendName: 'Aarav Patel',
          friendPhoneMasked: '+1 555••••01',
          transferAmountUsd: 150,
          transactionId: 'tx_fraud_01',
        });
      },
      /Self-referrals are strictly prohibited/,
      'Self referral correctly blocked by anti-fraud rule'
    );
    pass('Self referral attempt rejected by server-side anti-fraud rules');

    // Anti-fraud 2: Minimum volume qualification
    assert.throws(
      () => {
        referralService.qualifyReferral({
          referrerCode: 'AARAV88',
          friendUserId: 'usr_friend_low_vol',
          friendName: 'Test Low Volume',
          friendPhoneMasked: '+1 555••••99',
          transferAmountUsd: 25, // less than $100
          transactionId: 'tx_low_vol',
        });
      },
      /Minimum cross-border transfer volume of \$100 USD required/,
      'Under-threshold transfer blocked'
    );
    pass('Under-threshold transfer rejected from referral reward qualification');

    // Valid referral qualification
    const validQual = referralService.qualifyReferral({
      referrerCode: 'AARAV88',
      friendUserId: 'usr_friend_vikram',
      friendName: 'Vikram Malhotra',
      friendPhoneMasked: '+91 99••••1289',
      transferAmountUsd: 250,
      transactionId: 'tx_qual_valid_01',
    });
    assert.strictEqual(validQual.success, true);
    assert.strictEqual(validQual.rewardAmount, '₹500 INR');
    pass('Valid friend transfer qualifies referral and credits ₹500 INR bonus');
  } catch (err: any) {
    fail('Referral system tests failed', err);
  }

  // =========================================================================
  // 5. NOTIFICATION SYSTEM & EVENT EMISSIONS
  // =========================================================================
  console.log('\n5. Testing Notification System & Read State Management...');
  try {
    const notif = notificationService.createNotification({
      type: 'PAYMENT',
      title: 'Test Settlement Alert',
      message: 'USD 500.00 sent to Alex Johnson (UK Faster Payments)',
      referenceId: 'tx_notif_test',
    });
    assert.strictEqual(notif.isRead, false);
    pass('Event notification created with unread state');

    notificationService.markAsRead(notif.id);
    const updated = notificationService.getNotifications().find((n) => n.id === notif.id);
    assert.strictEqual(updated?.isRead, true);
    pass('Notification marked as read');
  } catch (err: any) {
    fail('Notification system tests failed', err);
  }

  console.log('\n========================================');
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runPhase4Tests().catch((err) => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
