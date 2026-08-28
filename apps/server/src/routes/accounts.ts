import { Router, Request, Response } from 'express';
import { db } from '../db';

const router = Router();

// Get all linked bank accounts & balances
router.get('/', (req: Request, res: Response) => {
  const totalBalanceUsd = db.bankAccounts.reduce((acc, bank) => {
    // simplified normalization to USD for display
    if (bank.currency === 'USD') return acc + bank.balance;
    if (bank.currency === 'EUR') return acc + bank.balance * 1.087;
    if (bank.currency === 'INR') return acc + bank.balance * 0.01198;
    return acc + bank.balance;
  }, 0);

  return res.json({
    accounts: db.bankAccounts,
    totalBalanceUsd: Number(totalBalanceUsd.toFixed(2)),
    reserveBackingRatio: 1.0, // 100% full reserve backed
    settlementTokenPoolAust: 14850.50,
  });
});

export default router;
