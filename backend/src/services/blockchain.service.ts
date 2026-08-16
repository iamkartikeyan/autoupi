import crypto from 'crypto';
import { supabase } from '../config/supabase';

// ============== TYPES ==============

export interface Wallet {
  id: string;
  user_id: string;
  address: string;
  balance: number;
  created_at: string;
}

export interface Block {
  id: string;
  block_number: number;
  previous_hash: string;
  block_hash: string;
  nonce: number;
  miner_address: string | null;
  timestamp: string;
  transactions_count: number;
}

export interface BlockchainTransaction {
  id: string;
  block_id: string;
  from_wallet: string;
  to_wallet: string;
  amount: number;
  fee: number;
  transaction_hash: string;
  timestamp: string;
}

// Helper to check if tables exist
async function checkTableExists(tableName: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    return !error || (error && error.code !== '42P01');
  } catch {
    return false;
  }
}

// ============== CRYPTO UTILITIES ==============

/**
 * Generate SHA-256 hash
 */
function generateHash(data: string): string {
  return '0x' + crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate random blockchain address
 */
export function generateWalletAddress(): string {
  return '0x' + crypto.randomBytes(20).toString('hex');
}

/**
 * Generate transaction hash
 */
export function generateTransactionHash(
  from: string,
  to: string,
  amount: number,
  timestamp: string
): string {
  const data = `${from}${to}${amount}${timestamp}${Date.now()}`;
  return generateHash(data);
}

// ============== WALLET MANAGEMENT ==============

/**
 * Create a new blockchain wallet for a user
 */
export async function createWallet(userId: string): Promise<Wallet> {
  // Check if wallet already exists
  const { data: existing } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    return existing as Wallet;
  }

  // Create new wallet
  const address = generateWalletAddress();
  const { data, error } = await supabase
    .from('wallets')
    .insert({
      user_id: userId,
      address,
      balance: 10000, // Starting balance
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create wallet: ${error.message}`);
  }

  return data as Wallet;
}

/**
 * Get wallet by address
 */
export async function getWalletByAddress(address: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('address', address)
    .single();

  if (error) return null;
  return data as Wallet;
}

/**
 * Get wallet by user ID
 */
export async function getWalletByUserId(userId: string): Promise<Wallet | null> {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data as Wallet;
}

/**
 * Get wallet balance
 */
export async function getBalance(address: string): Promise<number> {
  const wallet = await getWalletByAddress(address);
  return wallet?.balance || 0;
}

// ============== BLOCK OPERATIONS ==============

/**
 * Get the latest block
 */
export async function getLatestBlock(): Promise<Block | null> {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .order('block_number', { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Block;
}

/**
 * Get genesis block (first block)
 */
export async function getGenesisBlock(): Promise<Block | null> {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('block_number', 0)
    .single();

  if (error) return null;
  return data as Block;
}

/**
 * Calculate block hash
 */
function calculateBlockHash(
  blockNumber: number,
  previousHash: string,
  timestamp: string,
  transactions: any[],
  nonce: number
): string {
  const data = `${blockNumber}${previousHash}${timestamp}${JSON.stringify(transactions)}${nonce}`;
  return generateHash(data);
}

/**
 * Mine a new block (simplified proof-of-work)
 */
async function mineBlock(
  blockNumber: number,
  previousHash: string,
  transactions: any[]
): Promise<{ hash: string; nonce: number }> {
  const timestamp = new Date().toISOString();
  let nonce = 0;
  let hash = '';

  // Simplified mining - find hash starting with specific pattern
  // In real blockchain, this is much more complex
  do {
    hash = calculateBlockHash(blockNumber, previousHash, timestamp, transactions, nonce);
    nonce++;
  } while (!hash.startsWith('0x0000') && nonce < 100000); // Difficulty target

  return { hash, nonce };
}

/**
 * Create and add a new block to the blockchain
 */
export async function createBlock(
  transactions: Array<{
    from_wallet: string;
    to_wallet: string;
    amount: number;
    fee: number;
    transaction_hash: string;
  }>
): Promise<Block> {
  // Get latest block
  const latestBlock = await getLatestBlock();
  const blockNumber = latestBlock ? latestBlock.block_number + 1 : 0;
  const previousHash = latestBlock ? latestBlock.block_hash : '0x' + '0'.repeat(64);

  // Mine the block
  const { hash, nonce } = await mineBlock(blockNumber, previousHash, transactions);

  // Insert block
  const { data: block, error: blockError } = await supabase
    .from('blocks')
    .insert({
      block_number: blockNumber,
      previous_hash: previousHash,
      block_hash: hash,
      nonce,
      miner_address: '0x0000000000000000000000000000000000000000', // System miner
      transactions_count: transactions.length,
    })
    .select()
    .single();

  if (blockError) {
    throw new Error(`Failed to create block: ${blockError.message}`);
  }

  // Insert transactions
  const txnsToInsert = transactions.map(txn => ({
    block_id: block.id,
    from_wallet: txn.from_wallet,
    to_wallet: txn.to_wallet,
    amount: txn.amount,
    fee: txn.fee,
    transaction_hash: txn.transaction_hash,
  }));

  const { error: txnError } = await supabase
    .from('blockchain_transactions')
    .insert(txnsToInsert);

  if (txnError) {
    throw new Error(`Failed to insert transactions: ${txnError.message}`);
  }

  return block as Block;
}

// ============== TRANSACTION OPERATIONS ==============

/**
 * Transfer funds between wallets
 */
export async function transferFunds(
  fromAddress: string,
  toAddress: string,
  amount: number,
  feePercent: number = 0.02 // 2% fee
): Promise<{
  success: boolean;
  transaction: BlockchainTransaction;
  block: Block;
  fromBalance: number;
  toBalance: number;
}> {
  // Validate addresses
  if (!fromAddress.startsWith('0x') || !toAddress.startsWith('0x')) {
    throw new Error('Invalid wallet addresses');
  }

  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Get wallets
  const fromWallet = await getWalletByAddress(fromAddress);
  const toWallet = await getWalletByAddress(toAddress);

  if (!fromWallet) {
    throw new Error('Sender wallet not found');
  }

  if (!toWallet) {
    throw new Error('Receiver wallet not found');
  }

  // Calculate fee
  const fee = Math.round(amount * feePercent * 100) / 100;
  const totalDeduction = amount + fee;

  // Check balance
  if (fromWallet.balance < totalDeduction) {
    throw new Error(`Insufficient balance. Required: ₹${totalDeduction}, Available: ₹${fromWallet.balance}`);
  }

  // Deduct from sender
  const { error: deductError } = await supabase
    .from('wallets')
    .update({ balance: fromWallet.balance - totalDeduction })
    .eq('id', fromWallet.id);

  if (deductError) {
    throw new Error(`Failed to deduct balance: ${deductError.message}`);
  }

  // Add to receiver
  const { error: addError } = await supabase
    .from('wallets')
    .update({ balance: toWallet.balance + amount })
    .eq('id', toWallet.id);

  if (addError) {
    // Rollback sender's balance
    await supabase
      .from('wallets')
      .update({ balance: fromWallet.balance })
      .eq('id', fromWallet.id);
    throw new Error(`Failed to add balance: ${addError.message}`);
  }

  // Create transaction record
  const timestamp = new Date().toISOString();
  const transactionHash = generateTransactionHash(fromAddress, toAddress, amount, timestamp);

  // Create block with this transaction
  const block = await createBlock([{
    from_wallet: fromAddress,
    to_wallet: toAddress,
    amount,
    fee,
    transaction_hash: transactionHash,
  }]);

  // Get the transaction
  const { data: transaction, error: txnError } = await supabase
    .from('blockchain_transactions')
    .select('*')
    .eq('transaction_hash', transactionHash)
    .single();

  if (txnError || !transaction) {
    throw new Error('Failed to retrieve transaction');
  }

  // Get updated balances
  const updatedFromWallet = await getWalletByAddress(fromAddress);
  const updatedToWallet = await getWalletByAddress(toAddress);

  return {
    success: true,
    transaction: transaction as BlockchainTransaction,
    block,
    fromBalance: updatedFromWallet!.balance,
    toBalance: updatedToWallet!.balance,
  };
}

// ============== QUERY OPERATIONS ==============

/**
 * Get all blocks (with pagination)
 */
export async function getBlocks(page: number = 1, limit: number = 20): Promise<{
  blocks: Block[];
  total: number;
}> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('blocks')
    .select('*', { count: 'exact' })
    .order('block_number', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch blocks: ${error.message}`);
  }

  return { blocks: data as Block[], total: count || 0 };
}

/**
 * Get block by number
 */
export async function getBlockByNumber(blockNumber: number): Promise<Block | null> {
  const { data, error } = await supabase
    .from('blocks')
    .select('*')
    .eq('block_number', blockNumber)
    .single();

  if (error) return null;
  return data as Block;
}

/**
 * Get transactions in a block
 */
export async function getBlockTransactions(blockId: string): Promise<BlockchainTransaction[]> {
  const { data, error } = await supabase
    .from('blockchain_transactions')
    .select('*')
    .eq('block_id', blockId)
    .order('timestamp', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return data as BlockchainTransaction[];
}

/**
 * Get all blockchain transactions (with pagination)
 */
export async function getAllTransactions(page: number = 1, limit: number = 20): Promise<{
  transactions: BlockchainTransaction[];
  total: number;
}> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('blockchain_transactions')
    .select('*', { count: 'exact' })
    .order('timestamp', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  return { transactions: data as BlockchainTransaction[], total: count || 0 };
}

/**
 * Get transaction by hash
 */
export async function getTransactionByHash(hash: string): Promise<BlockchainTransaction | null> {
  const { data, error } = await supabase
    .from('blockchain_transactions')
    .select('*')
    .eq('transaction_hash', hash)
    .single();

  if (error) return null;
  return data as BlockchainTransaction;
}

/**
 * Get transactions by wallet address
 */
export async function getWalletTransactions(
  address: string,
  page: number = 1,
  limit: number = 20
): Promise<{
  transactions: BlockchainTransaction[];
  total: number;
}> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('blockchain_transactions')
    .select('*', { count: 'exact' })
    .or(`from_wallet.eq.${address},to_wallet.eq.${address}`)
    .order('timestamp', { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch wallet transactions: ${error.message}`);
  }

  return { transactions: data as BlockchainTransaction[], total: count || 0 };
}

/**
 * Get blockchain statistics
 */
export async function getBlockchainStats(): Promise<{
  totalBlocks: number;
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  latestBlock: number;
  averageBlockSize: number;
}> {
  // Get total blocks
  const { count: totalBlocks } = await supabase
    .from('blocks')
    .select('*', { count: 'exact', head: true });

  // Get total transactions
  const { count: totalTransactions } = await supabase
    .from('blockchain_transactions')
    .select('*', { count: 'exact', head: true });

  // Get total volume
  const { data: volumeData } = await supabase
    .from('blockchain_transactions')
    .select('amount')
    .eq('block_id', 'IS NOT NULL', { count: 'exact' });

  const totalVolume = volumeData?.reduce((sum, txn) => sum + Number(txn.amount), 0) || 0;

  // Get total fees
  const { data: feesData } = await supabase
    .from('blockchain_transactions')
    .select('fee');

  const totalFees = feesData?.reduce((sum, txn) => sum + Number(txn.fee), 0) || 0;

  // Get latest block number
  const { data: latestBlockData } = await supabase
    .from('blocks')
    .select('block_number')
    .order('block_number', { ascending: false })
    .limit(1);

  const latestBlock = latestBlockData?.[0]?.block_number || 0;

  // Calculate average block size
  const averageBlockSize = totalBlocks! > 0 ? totalTransactions! / totalBlocks! : 0;

  return {
    totalBlocks: totalBlocks || 0,
    totalTransactions: totalTransactions || 0,
    totalVolume,
    totalFees,
    latestBlock,
    averageBlockSize,
  };
}

// ============== INITIALIZATION ==============

/**
 * Initialize blockchain with genesis block
 */
export async function initializeBlockchain(): Promise<void> {
  try {
    // Check if blocks table exists
    const tableExists = await checkTableExists('blocks');
    
    if (!tableExists) {
      console.log('⚠️  Blockchain tables not found. Please run blockchain-schema.sql in Supabase.');
      console.log('   Blockchain features will be disabled until schema is loaded.');
      return;
    }

    const genesisBlock = await getGenesisBlock();
    
    if (!genesisBlock) {
      // Create genesis block
      const genesisHash = generateHash('genesis-block-0');
      
      await supabase.from('blocks').insert({
        block_number: 0,
        previous_hash: '0x' + '0'.repeat(64),
        block_hash: genesisHash,
        nonce: 0,
        miner_address: '0x0000000000000000000000000000000000000000',
        transactions_count: 0,
      });

      console.log('✅ Genesis block created');
    } else {
      console.log('✅ Blockchain initialized (genesis block exists)');
    }
  } catch (error) {
    console.log('⚠️  Blockchain initialization skipped (tables may not exist yet)');
  }
}
