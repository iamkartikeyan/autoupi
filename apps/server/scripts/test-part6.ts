import { blockchainService, SETTLEMENT_TOKEN_ABI } from '../src/services/blockchain';

async function runTests() {
  console.log('🧪 Starting Part 6 Real Blockchain, Smart Contract & Event Listener Tests...\n');

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

  // 1. SMART CONTRACT ABI & METHODS
  console.log('1. Testing Smart Contract ABI Specifications...');
  assert(SETTLEMENT_TOKEN_ABI.some((sig) => sig.includes('lockReserveAndMint')), 'ABI contains lockReserveAndMint method');
  assert(SETTLEMENT_TOKEN_ABI.some((sig) => sig.includes('finalizeSettlement')), 'ABI contains finalizeSettlement method');
  assert(SETTLEMENT_TOKEN_ABI.some((sig) => sig.includes('event TokenMinted')), 'ABI emits TokenMinted event');
  assert(SETTLEMENT_TOKEN_ABI.some((sig) => sig.includes('event SettlementCompleted')), 'ABI emits SettlementCompleted event');

  // 2. NETWORK & CONTRACT CONFIGURATION
  console.log('\n2. Testing Blockchain Network Configuration...');
  const netInfo = blockchainService.getNetworkInfo();
  assert(netInfo.chainId === 31337, 'EVM Chain ID configured for development (31337)');
  assert(netInfo.tokenSymbol === 'AUST', 'Settlement token symbol is AUST');
  assert(netInfo.contractAddress.startsWith('0x'), 'Contract address is valid EVM hex');

  // 3. TRANSACTION SUBMISSION & EVENT LISTENER
  console.log('\n3. Testing On-Chain Event Dispatch & Listener Pipeline...');
  let eventReceived = false;
  blockchainService.onBlockchainEvent((evt) => {
    if (evt.eventType === 'TokenMinted' && evt.transactionId === 'tx_test_bc_01') {
      eventReceived = true;
    }
  });

  const mintReceipt = await blockchainService.submitReserveLockAndMint(
    'res_test_lock_01',
    'tx_test_bc_01',
    'USD_INR',
    500,
    41750
  );

  assert(mintReceipt.txHash.startsWith('0x'), 'Mint transaction hash generated');
  assert(mintReceipt.blockNumber >= 195000, 'Block number assigned');
  assert(eventReceived === true, 'Blockchain event listener received real-time event');

  // Finalize settlement
  const settleReceipt = await blockchainService.submitFinalizeSettlement('tx_test_bc_01', 500);
  assert(settleReceipt.txHash.startsWith('0x'), 'Settlement finalize transaction hash generated');
  assert(blockchainService.getRecentEvents().length >= 2, 'Event history recorded on-chain logs');

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
