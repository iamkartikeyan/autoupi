import { bankService } from '../src/services/bank';
import { otpService } from '../src/services/otp';
import { db } from '../src/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

async function runTests() {
  console.log('🧪 Starting Part 3 Security, Auth & Bank Unit Tests...\n');

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

  // 1. Password Hashing with bcrypt
  console.log('1. Testing Password Security...');
  const password = 'TestSecretPassword2026!';
  const hash = await bcrypt.hash(password, 10);
  assert(hash !== password, 'Password is never stored in plain text');
  assert(await bcrypt.compare(password, hash), 'Bcrypt verifies hashed password correctly');
  assert(!(await bcrypt.compare('WrongPassword', hash)), 'Bcrypt rejects incorrect passwords');

  // 2. JWT Authentication & Role authorization
  console.log('\n2. Testing JWT & Roles...');
  const token = jwt.sign({ userId: 'usr_1', role: 'USER' }, 'test_secret', { expiresIn: '1h' });
  const decoded: any = jwt.verify(token, 'test_secret');
  assert(decoded.userId === 'usr_1', 'JWT payload preserves userId');
  assert(decoded.role === 'USER', 'JWT payload preserves role');

  // 3. OTP Service & Lockout
  console.log('\n3. Testing OTP Cooldown & Attempt Limits...');
  const testPhone = '+15550001111';
  const otpRes = await otpService.sendOTP(testPhone);
  assert(otpRes.success === true, 'OTP dispatched successfully');
  assert(otpRes.demoCode === '123456', 'Demo OTP is 123456');

  // Resend cooldown check
  try {
    await otpService.sendOTP(testPhone);
    assert(false, 'Should prevent instant resend within cooldown');
  } catch (err: any) {
    assert(err.message.includes('seconds before requesting'), 'Resend cooldown enforced');
  }

  // Failed attempts tracking
  const badVerify = otpService.verifyOTP(testPhone, '999999');
  assert(!badVerify.valid, 'Rejects invalid OTP');

  // Valid verification
  const goodVerify = otpService.verifyOTP(testPhone, '123456');
  assert(goodVerify.valid, 'Validates correct OTP');

  // 4. Simulated Bank Service & Reserves
  console.log('\n4. Testing Simulated Bank Reserve Engine...');
  const testAccId = 'acc_chase_usd_01';
  const account = bankService.getAccount(testAccId)!;
  const initialAvailable = account.balance;

  // Step A: Debit Reserve
  const reserveEntry = bankService.debitReserve(testAccId, 500, 'TEST-REF-01', 'Test reserve lock');
  assert(account.balance === initialAvailable - 500, 'Available balance reduced by reserve amount');
  assert(reserveEntry.type === 'DEBIT_RESERVE', 'Ledger entry recorded for reserve lock');

  // Step B: Settlement Debit (Payment success)
  const settleEntry = bankService.settlementDebit(testAccId, 500, 'TEST-REF-01');
  assert(settleEntry.type === 'SETTLEMENT_DEBIT', 'Ledger entry recorded for settlement debit');

  // Step C: Release Reserve (Payment failure scenario)
  const initialForRelease = account.balance;
  bankService.debitReserve(testAccId, 200, 'TEST-REF-02', 'Test temporary lock');
  bankService.releaseReserve(testAccId, 200, 'TEST-REF-02', 'Corridor timeout');
  assert(account.balance === initialForRelease, 'Available balance fully restored upon reserve release');

  // Step D: Refund
  const refundEntry = bankService.refund(testAccId, 100, 'TEST-REF-03', 'Overpayment correction');
  assert(refundEntry.type === 'REFUND', 'Ledger entry recorded for refund');

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
