import { settlementEngine } from '../src/services/settlement';
import { recipientSimulator } from '../src/services/recipientSimulator';
import { bankService } from '../src/services/bank';
import { db } from '../src/db';
import { PaymentTransaction } from '@auto-upi/shared';

async function runTests() {
  console.log('🧪 Starting Part 7 Full Pipeline, Recipient Simulator & Automated Refund Tests...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. RECIPIENT SIMULATOR BEFORE CREDIT
  console.log('1. Testing Recipient Account Simulator State...');
  const priyaAccount = recipientSimulator.getAccount('ben_priya_in')!;
  const initialPriyaBalance = priyaAccount.balance;
  assert(initialPriyaBalance === 45000, 'Initial recipient balance is ₹45,000');

  // 2. FULL SUCCESS PIPELINE EXECUTION
  console.log('\n2. Testing Full Success Pipeline & Recipient Crediting...');
  const successTx: PaymentTransaction = {
    id: `tx_p7_succ_${Date.now()}`,
    referenceNumber: `UPI-XB-P7-01`,
    userId: 'usr_auto_889210',
    beneficiaryId: 'ben_priya_in',
    beneficiaryName: 'Priya Sharma',
    beneficiaryUpiId: 'priya.sharma@okaxis',
    beneficiaryCountry: 'India',
    beneficiaryFlag: '🇮🇳',
    senderBankAccountId: 'acc_chase_usd_01',
    senderBankName: 'JPMorgan Chase Bank',
    senderUpiId: 'aarav@autoupi',
    sourceCurrency: 'USD',
    sourceAmount: 100,
    targetCurrency: 'INR',
    targetAmount: 8350,
    exchangeRate: 83.50,
    fee: 1.50,
    feeCurrency: 'USD',
    status: 'CREATED',
    purpose: 'FAMILY_SUPPORT',
    timeline: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.transactions.unshift(successTx);

  await settlementEngine.executeCrossBorderSettlement(successTx.id);

  assert(successTx.status === 'COMPLETED', 'Pipeline achieved final status: COMPLETED');
  assert(priyaAccount.balance === initialPriyaBalance + 8350, 'Recipient balance credited by exact destination amount (₹8,350)');
  assert(priyaAccount.incomingPayments.length > 0, 'Incoming payment record logged in recipient account history');

  // 3. FAILURE HANDLING & AUTOMATED REFUND ENGINE
  console.log('\n3. Testing Failure Handling & Automated Bank Refund Engine...');
  const bankAccount = bankService.getAccount('acc_chase_usd_01')!;
  const availableBeforeFail = bankAccount.balance;

  const failTx: PaymentTransaction = {
    id: `tx_p7_fail_${Date.now()}`,
    referenceNumber: `UPI-XB-P7-FAIL`,
    userId: 'usr_auto_889210',
    beneficiaryId: 'ben_priya_in',
    beneficiaryName: 'Priya Sharma',
    beneficiaryUpiId: 'priya.sharma@okaxis',
    beneficiaryCountry: 'India',
    beneficiaryFlag: '🇮🇳',
    senderBankAccountId: 'acc_chase_usd_01',
    senderBankName: 'JPMorgan Chase Bank',
    senderUpiId: 'aarav@autoupi',
    sourceCurrency: 'USD',
    sourceAmount: 200,
    targetCurrency: 'INR',
    targetAmount: 16700,
    exchangeRate: 83.50,
    fee: 1.50,
    feeCurrency: 'USD',
    status: 'CREATED',
    purpose: 'FAMILY_SUPPORT',
    timeline: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.transactions.unshift(failTx);

  try {
    // Simulate destination payout rejection after reserve has been locked
    await settlementEngine.executeCrossBorderSettlement(failTx.id, 'PAYOUT_FAILURE');
  } catch (err: any) {
    assert(err.message.includes('Payout Failed'), 'Caught simulated domestic payout failure');
  }

  assert(failTx.status === 'REFUNDED', 'Transaction status transitioned to REFUNDED');
  assert(bankAccount.balance === availableBeforeFail, 'Bank available balance fully restored by automated refund engine');

  const refundLedgerEntry = bankService.getLedger('acc_chase_usd_01').find((l) => l.referenceId === failTx.referenceNumber && (l.type === 'RELEASE_RESERVE' || l.type === 'REFUND'));
  assert(!!refundLedgerEntry, 'Immutable RELEASE_RESERVE bank ledger entry generated with timestamp');

  console.log(`\n========================================`);
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
