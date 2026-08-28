import { amlEngine } from '../src/services/aml';
import { corridorManager } from '../src/services/corridorManager';
import { feeEngine } from '../src/services/fee';
import { auditLogger } from '../src/services/auditLogger';
import { db } from '../src/db';
import { PaymentTransaction, UserProfile } from '@auto-upi/shared';

async function runTests() {
  console.log('🧪 Starting Part 9 Admin, Compliance, AML, Corridors & Audit Tests...\n');

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

  // 1. AML ENGINE EVALUATION
  console.log('1. Testing AML Risk Assessment & Rules...');
  const normalTx: PaymentTransaction = {
    id: 'tx_aml_norm_01',
    referenceNumber: 'UPI-XB-AML-01',
    userId: db.currentUser.id,
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

  const normalEval = amlEngine.evaluateTransaction(normalTx, db.currentUser);
  assert(normalEval.status === 'CLEAR', 'Standard $200 remittance marked CLEAR');
  assert(normalEval.riskScore < 50, 'Standard remittance has low risk score (<50)');

  // Flagged High-Value Transfer
  const flaggedTx: PaymentTransaction = {
    ...normalTx,
    id: 'tx_aml_flag_01',
    sourceAmount: 25000, // exceeds $10k threshold
  };

  const flaggedEval = amlEngine.evaluateTransaction(flaggedTx, { ...db.currentUser, kycTier: 1 });
  assert(flaggedEval.status === 'REVIEW_REQUIRED', 'High value transfer flagged as REVIEW_REQUIRED');
  assert(flaggedEval.triggeredRules.some((r) => r.includes('HIGH_VALUE_THRESHOLD')), 'Rule triggered: HIGH_VALUE_THRESHOLD');

  // Review AML Alert
  const reviewed = amlEngine.reviewAlert(flaggedEval.id, 'APPROVED', 'Source of funds verified', 'admin@autoupi');
  assert(reviewed.reviewDecision === 'APPROVED', 'AML Alert successfully approved by admin');

  // 2. CORRIDOR MANAGER
  console.log('\n2. Testing Payment Corridor Manager...');
  const initialCorridors = corridorManager.getCorridors();
  assert(initialCorridors.length >= 4, 'Corridors configured');

  corridorManager.toggleCorridor('corr_jp', false);
  const jpCorridor = corridorManager.getCorridors().find((c) => c.id === 'corr_jp')!;
  assert(jpCorridor.enabled === false, 'Corridor disabled successfully');

  corridorManager.toggleCorridor('corr_jp', true);
  assert(jpCorridor.enabled === true, 'Corridor re-enabled successfully');

  // 3. AUDIT LOGGING & OBSERVABILITY
  console.log('\n3. Testing Audit Logging & Observability...');
  const auditEntry = auditLogger.log({
    actor: 'admin@autoupi',
    action: 'TEST_AUDIT_EVENT',
    transactionId: 'tx_test_aud_01',
    result: 'SUCCESS',
    metadata: { testKey: 'testValue' },
  });

  assert(!!auditEntry.id, 'Audit log ID generated');
  const queriedLogs = auditLogger.getLogs(10, 'TEST_AUDIT_EVENT');
  assert(queriedLogs.length >= 1, 'Audit log searchable by action');

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
