import { PaymentStateMachine } from '../src/services/stateMachine';
import { tokenEngine } from '../src/services/tokenEngine';
import { bankService } from '../src/services/bank';
import { reconciliationEngine } from '../src/services/reconciliation';
import { settlementEngine } from '../src/services/settlement';
import { db } from '../src/db';
import { PaymentTransaction } from '@auto-upi/shared';

async function runTests() {
  console.log('🧪 Starting Part 5 State Machine, Token Engine, Reserve & Reconciliation Tests...\n');

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

  // 1. STATE MACHINE LEGAL & ILLEGAL TRANSITIONS
  console.log('1. Testing State Machine Legal Transitions & Safeguards...');
  assert(PaymentStateMachine.canTransition('CREATED', 'AUTHENTICATING'), 'CREATED -> AUTHENTICATING is legal');
  assert(PaymentStateMachine.canTransition('AUTHENTICATING', 'KYC_CHECK'), 'AUTHENTICATING -> KYC_CHECK is legal');
  assert(!PaymentStateMachine.canTransition('CREATED', 'COMPLETED'), 'Illegal jump: CREATED -> COMPLETED is prevented');
  assert(!PaymentStateMachine.canTransition('CREATED', 'RECIPIENT_CREDITED'), 'Illegal jump: CREATED -> RECIPIENT_CREDITED is prevented');

  const mockTx: PaymentTransaction = {
    id: 'tx_test_sm_01',
    referenceNumber: 'UPI-XB-TEST-01',
    userId: 'usr_auto_889210',
    beneficiaryId: 'ben_priya_in',
    beneficiaryName: 'Priya Sharma',
    beneficiaryUpiId: 'priya@okaxis',
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

  PaymentStateMachine.transition(mockTx, 'AUTHENTICATING');
  assert(mockTx.status === 'AUTHENTICATING', 'State machine transitioned to AUTHENTICATING');
  assert(mockTx.timeline.length === 1, 'Timeline entry recorded');

  // Attempt illegal transition
  try {
    PaymentStateMachine.transition(mockTx, 'COMPLETED');
    assert(false, 'Should throw error on illegal transition');
  } catch (err: any) {
    assert(err.message.includes('Illegal State Transition'), 'Illegal transition correctly rejected');
  }

  // 2. TBD SETTLEMENT TOKEN ENGINE & INVARIANTS
  console.log('\n2. Testing TBD Settlement Token Engine & Invariants...');
  const initialSupply = tokenEngine.getSupplySummary().outstandingSupply;
  const mintEntry = tokenEngine.mint('tx_test_token_01', 500, 'REF-RES-01');
  assert(mintEntry.amount === 500, '500 TBD minted successfully');
  assert(tokenEngine.getSupplySummary().outstandingSupply === initialSupply + 500, 'Outstanding supply increased by 500');

  // Duplicate mint invariant check
  try {
    tokenEngine.mint('tx_test_token_01', 500, 'REF-RES-01');
    assert(false, 'Should prevent duplicate mint for same tx ID');
  } catch (err: any) {
    assert(err.message.includes('Duplicate mint attempted'), 'Duplicate mint prevented by invariant check');
  }

  // Redeem & Burn
  const burnEntry = tokenEngine.redeemAndBurn('tx_test_token_01', 500, '0xGateway', 'REF-RES-01');
  assert(burnEntry.type === 'REDEEM_BURN', 'Token burned successfully');
  assert(tokenEngine.getSupplySummary().outstandingSupply === initialSupply, 'Supply restored after burn');

  // Negative supply protection
  try {
    tokenEngine.redeemAndBurn('tx_fake', 9999999999, '0xGateway', 'REF-RES-01');
    assert(false, 'Should prevent excessive burn');
  } catch (err: any) {
    assert(err.message.includes('exceeds outstanding supply'), 'Negative supply prevented by invariant');
  }

  // 3. DETERMINISTIC FULL PIPELINE EXECUTION
  console.log('\n3. Testing Full Deterministic Settlement Pipeline Execution...');
  const liveTx: PaymentTransaction = {
    id: `tx_det_${Date.now()}`,
    referenceNumber: `UPI-XB-${Math.floor(1000000 + Math.random() * 9000000)}`,
    userId: 'usr_auto_889210',
    beneficiaryId: 'ben_priya_in',
    beneficiaryName: 'Priya Sharma',
    beneficiaryUpiId: 'priya@okaxis',
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

  db.transactions.unshift(liveTx);

  const completedTx = await settlementEngine.executeCrossBorderSettlement(liveTx.id);
  assert(completedTx.status === 'COMPLETED', 'Deterministic pipeline settled transaction to COMPLETED');
  assert(completedTx.timeline.length >= 10, 'All 10+ financial orchestration pipeline stages recorded');
  assert(completedTx.reconciliation?.status === 'MATCHED', 'Final multi-vector reconciliation MATCHED');

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
