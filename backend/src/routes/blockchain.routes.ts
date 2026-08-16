import { Router } from 'express';
import * as blockchainController from '../controllers/blockchain.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// ============== WALLET ROUTES ==============
// Get current user's wallet (auto-creates if doesn't exist)
router.get('/wallet/my-wallet', authMiddleware, blockchainController.getMyWallet);

// Create new wallet
router.post('/wallet/create', authMiddleware, blockchainController.createWallet);

// Get wallet by address (public)
router.get('/wallet/:address', blockchainController.getWallet);

// ============== TRANSFER ROUTES ==============
// Transfer funds between wallets
router.post('/transfer', authMiddleware, blockchainController.transfer);

// ============== BLOCK ROUTES ==============
// Get all blocks
router.get('/blocks', blockchainController.getBlocks);

// Get block by number
router.get('/blocks/:number', blockchainController.getBlock);

// ============== TRANSACTION ROUTES ==============
// Get all blockchain transactions
router.get('/transactions', blockchainController.getTransactions);

// Get transaction by hash
router.get('/transactions/:hash', blockchainController.getTransaction);

// Get wallet's transactions
router.get('/wallet/:address/transactions', blockchainController.getWalletTransactions);

// ============== STATS ROUTE ==============
// Get blockchain statistics
router.get('/stats', blockchainController.getStats);

export default router;
