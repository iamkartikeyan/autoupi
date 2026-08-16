import { Request, Response } from 'express';
import * as blockchainService from '../services/blockchain.service';

// ============== WALLET CONTROLLERS ==============

/**
 * Create or get user's wallet
 */
export async function createWallet(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Unauthorized' 
      });
    }

    const wallet = await blockchainService.createWallet(userId);
    
    res.status(201).json({
      success: true,
      data: wallet,
      message: 'Wallet created successfully'
    });
  } catch (error: any) {
    console.error('Create wallet error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create wallet'
    });
  }
}

/**
 * Get wallet information
 */
export async function getWallet(req: Request, res: Response) {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({
        success: false,
        error: 'Wallet address required'
      });
    }

    const wallet = await blockchainService.getWalletByAddress(address);
    
    if (!wallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      data: wallet
    });
  } catch (error: any) {
    console.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get wallet'
    });
  }
}

/**
 * Get current user's wallet
 */
export async function getMyWallet(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    let wallet = await blockchainService.getWalletByUserId(userId);
    
    // Auto-create wallet if doesn't exist
    if (!wallet) {
      wallet = await blockchainService.createWallet(userId);
    }

    res.json({
      success: true,
      data: wallet
    });
  } catch (error: any) {
    console.error('Get my wallet error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get wallet'
    });
  }
}

// ============== TRANSFER CONTROLLERS ==============

/**
 * Transfer funds between wallets
 */
export async function transfer(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }

    const { to_address, amount, fee_percent } = req.body;

    if (!to_address || !amount) {
      return res.status(400).json({
        success: false,
        error: 'Receiver address and amount required'
      });
    }

    // Get user's wallet
    const userWallet = await blockchainService.getWalletByUserId(userId);
    
    if (!userWallet) {
      return res.status(404).json({
        success: false,
        error: 'Wallet not found. Please create a wallet first.'
      });
    }

    // Perform transfer
    const result = await blockchainService.transferFunds(
      userWallet.address,
      to_address,
      parseFloat(amount),
      fee_percent || 0.02
    );

    res.status(200).json({
      success: true,
      data: {
        transaction: result.transaction,
        block: result.block,
        balances: {
          from: {
            address: userWallet.address,
            balance: result.fromBalance
          },
          to: {
            address: to_address,
            balance: result.toBalance
          }
        }
      },
      message: 'Transfer successful'
    });
  } catch (error: any) {
    console.error('Transfer error:', error);
    res.status(400).json({
      success: false,
      error: error.message || 'Transfer failed'
    });
  }
}

// ============== BLOCK CONTROLLERS ==============

/**
 * Get all blocks
 */
export async function getBlocks(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await blockchainService.getBlocks(page, limit);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Get blocks error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch blocks'
    });
  }
}

/**
 * Get block by number
 */
export async function getBlock(req: Request, res: Response) {
  try {
    const { number } = req.params;

    const block = await blockchainService.getBlockByNumber(parseInt(number));

    if (!block) {
      return res.status(404).json({
        success: false,
        error: 'Block not found'
      });
    }

    // Get transactions in this block
    const transactions = await blockchainService.getBlockTransactions(block.id);

    res.json({
      success: true,
      data: {
        ...block,
        transactions
      }
    });
  } catch (error: any) {
    console.error('Get block error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch block'
    });
  }
}

// ============== TRANSACTION CONTROLLERS ==============

/**
 * Get all blockchain transactions
 */
export async function getTransactions(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await blockchainService.getAllTransactions(page, limit);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transactions'
    });
  }
}

/**
 * Get transaction by hash
 */
export async function getTransaction(req: Request, res: Response) {
  try {
    const { hash } = req.params;

    const transaction = await blockchainService.getTransactionByHash(hash);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error: any) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch transaction'
    });
  }
}

/**
 * Get wallet's transactions
 */
export async function getWalletTransactions(req: Request, res: Response) {
  try {
    const { address } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const result = await blockchainService.getWalletTransactions(address, page, limit);

    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    console.error('Get wallet transactions error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch wallet transactions'
    });
  }
}

// ============== STATS CONTROLLER ==============

/**
 * Get blockchain statistics
 */
export async function getStats(req: Request, res: Response) {
  try {
    const stats = await blockchainService.getBlockchainStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch stats'
    });
  }
}
