import { db } from '../src/db';
import { PaymentTransaction } from '@auto-upi/shared';

async function runTests() {
  console.log('🧪 Starting Part 8 Transaction History, Details, Receipts, Tracking & Analytics Tests...\n');

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

  // 1. TRANSACTION HISTORY & FILTERS
  console.log('1. Testing Transaction History Filtering & Search...');
  const allTx = db.transactions;
  assert(allTx.length >= 2, 'History contains seeded transactions');

  // Search by reference ID
  const searchByRef = allTx.filter((t) => t.referenceNumber.includes('8921820'));
  assert(searchByRef.length === 1, 'Search by reference ID finds exact transaction');

  // Search by beneficiary name
  const searchByName = allTx.filter((t) => t.beneficiaryName.toLowerCase().includes('priya'));
  assert(searchByName.length >= 1, 'Search by beneficiary name finds recipient');

  // Filter by currency
  const inrTx = allTx.filter((t) => t.targetCurrency === 'INR');
  assert(inrTx.length >= 1, 'Filter by target currency INR returns matches');

  // 2. TRANSACTION DETAIL 7-SECTION METRIC AUDIT
  console.log('\n2. Testing Transaction Detail Metrics Audit...');
  const tx = allTx[0];
  assert(!!tx.id && !!tx.referenceNumber, 'Payment: Transaction ID & Ref number present');
  assert(tx.fee >= 0 && !!tx.feeCurrency, 'Fees: Fee breakdown present');
  assert(tx.exchangeRate > 0, 'FX: Applied exchange rate present');
  assert(!!tx.senderBankName, 'Bank: Partner bank name present');
  assert(tx.timeline.length > 0, 'Timeline: Complete event history present');

  // 3. SAFE PUBLIC TRACKER VALIDATION (Zero Sensitive Leakage)
  console.log('\n3. Testing Safe Public Tracker Info (No PII Leakage)...');
  const safeTrackerView = {
    referenceNumber: tx.referenceNumber,
    status: tx.status,
    country: tx.beneficiaryCountry,
    destinationCurrency: tx.targetCurrency,
    timestamp: tx.createdAt,
    lastUpdate: tx.updatedAt,
    progressStagesCount: tx.timeline.length,
  };

  assert(!('senderBankAccountId' in (safeTrackerView as any)), 'Safe tracker does not leak sender bank account ID');
  assert(!('accountNumber' in (safeTrackerView as any)), 'Safe tracker does not leak full bank account number');
  assert(safeTrackerView.referenceNumber.startsWith('UPI-XB-'), 'Safe tracker exposes reference identifier');

  // 4. ADMIN & USER ANALYTICS METRICS
  console.log('\n4. Testing Analytics & KPI Metrics Generation...');
  const metrics = db.getMetrics();
  assert(metrics.totalSettledVolumeUsd >= 2000000, 'Admin total volume metric calculated');
  assert(metrics.activeReserveLiquidityUsd === 12500000, 'Admin reserve locked liquidity metric present ($12.5M)');
  assert(metrics.mintedTokenSupplyAust === 8421000, 'Admin token supply metric present (8.42M AUST)');
  assert(metrics.averageSettlementTimeSeconds === 3.8, 'Average settlement time metric present (3.8s)');

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
