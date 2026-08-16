-- ==========================================
-- BLOCKCHAIN DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- ==========================================

-- WALLET TABLE (stores user balances)
CREATE TABLE IF NOT EXISTS wallets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  address VARCHAR(66) UNIQUE NOT NULL,
  balance NUMERIC(15, 2) NOT NULL DEFAULT 10000.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BLOCKS TABLE (stores blockchain blocks)
CREATE TABLE IF NOT EXISTS blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_number INTEGER NOT NULL UNIQUE,
  previous_hash VARCHAR(66) NOT NULL,
  block_hash VARCHAR(66) NOT NULL UNIQUE,
  nonce INTEGER NOT NULL DEFAULT 0,
  miner_address VARCHAR(66),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transactions_count INTEGER DEFAULT 0
);

-- BLOCKCHAIN TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS blockchain_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  block_id UUID NOT NULL REFERENCES blocks(id),
  from_wallet VARCHAR(66) NOT NULL,
  to_wallet VARCHAR(66) NOT NULL,
  amount NUMERIC(15, 2) NOT NULL,
  fee NUMERIC(15, 2) DEFAULT 0,
  transaction_hash VARCHAR(66) UNIQUE NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallets_address ON wallets(address);
CREATE INDEX IF NOT EXISTS idx_blocks_number ON blocks(block_number DESC);
CREATE INDEX IF NOT EXISTS idx_txn_hash ON blockchain_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_txn_from ON blockchain_transactions(from_wallet);
CREATE INDEX IF NOT EXISTS idx_txn_to ON blockchain_transactions(to_wallet);

-- Row Level Security
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blockchain_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own wallet
CREATE POLICY "Users view own wallet" ON wallets
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own wallet (for balance changes)
CREATE POLICY "Users update own wallet" ON wallets
  FOR UPDATE USING (user_id = auth.uid());

-- Everyone can view blocks (public blockchain)
CREATE POLICY "Blocks are public" ON blocks
  FOR SELECT USING (true);

-- Everyone can view blockchain transactions
CREATE POLICY "Transactions are public" ON blockchain_transactions
  FOR SELECT USING (true);

-- Service role can insert blocks and transactions (bypass RLS)
-- This is handled in backend using service key

-- ==========================================
-- GENESIS BLOCK (Optional - backend creates it)
-- ==========================================
-- Uncomment below to manually create genesis block
-- INSERT INTO blocks (block_number, previous_hash, block_hash, nonce, miner_address, transactions_count)
-- VALUES (0, '0x0000000000000000000000000000000000000000000000000000000000000000', '0xGENESIS', 0, '0x0000000000000000000000000000000000000000', 0);
