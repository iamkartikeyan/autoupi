import { execSync } from 'child_process';
import path from 'path';

async function runMasterTestSuite() {
  console.log('================================================================');
  console.log('🚀 AUTO-UPI MASTER TEST RUNNER — ALL TEST SUITES (PARTS 3 - 10)');
  console.log('================================================================\n');

  const testScripts = [
    { name: 'Part 3: Identity, Auth, KYC & Partner-Bank Custody', script: 'scripts/test-part3.ts' },
    { name: 'Part 4: Beneficiaries, FX Engine & Fee Schedules', script: 'scripts/test-part4.ts' },
    { name: 'Part 5: State Machine, Token Engine & Multi-Vector Reconciliation', script: 'scripts/test-part5.ts' },
    { name: 'Part 6: Solidity Smart Contract, ABI & On-Chain Event Subscriptions', script: 'scripts/test-part6.ts' },
    { name: 'Part 7: Real-Time Pipeline, Recipient Simulator & Automated Refunds', script: 'scripts/test-part7.ts' },
    { name: 'Part 8: Transaction History, Details, Receipts, Tracking & Analytics', script: 'scripts/test-part8.ts' },
    { name: 'Part 9: Admin Console, AML Compliance, Corridors & Audit Trails', script: 'scripts/test-part9.ts' },
    { name: 'Phase 4: Payment Provider, QR Security, Rewards & Anti-Fraud Referrals', script: 'scripts/test-phase4.ts' },
  ];

  let totalSuitesPassed = 0;
  const startTime = Date.now();

  for (const suite of testScripts) {
    console.log(`▶️ Running Suite: ${suite.name}...`);
    try {
      execSync(`npx tsx ${suite.script}`, {
        cwd: path.resolve(__dirname, '..'),
        stdio: 'inherit',
      });
      totalSuitesPassed++;
      console.log(`✅ Suite Passed: ${suite.name}\n`);
    } catch (err: any) {
      console.error(`❌ Suite Failed: ${suite.name}\n`);
      process.exit(1);
    }
  }

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log('================================================================');
  console.log(`🎉 ALL ${totalSuitesPassed} TEST SUITES PASSED CLEANLY IN ${durationSec}s!`);
  console.log('================================================================\n');
}

runMasterTestSuite().catch((err) => {
  console.error('Master test runner error:', err);
  process.exit(1);
});
