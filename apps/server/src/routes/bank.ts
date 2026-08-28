import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { bankService } from '../services/bank';
import { db } from '../db';

const router = Router();

const ReserveActionSchema = z.object({
  accountId: z.string(),
  amount: z.number().positive(),
  referenceId: z.string(),
  description: z.string().optional(),
});

const RefundActionSchema = z.object({
  accountId: z.string(),
  amount: z.number().positive(),
  referenceId: z.string(),
  reason: z.string(),
});

// Get Account Summary
router.get('/summary/:accountId', (req: Request, res: Response) => {
  try {
    const summary = bankService.getAccountSummary(req.params.accountId);
    return res.json(summary);
  } catch (err: any) {
    return res.status(404).json({ error: err.message || 'Account not found' });
  }
});

// Lock Reserve (Debit Available, Increase Reserved)
router.post('/reserve/lock', (req: Request, res: Response) => {
  try {
    const { accountId, amount, referenceId, description } = ReserveActionSchema.parse(req.body);
    const entry = bankService.debitReserve(accountId, amount, referenceId, description || 'Reserve locked');
    return res.json({ success: true, ledgerEntry: entry });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Reserve lock failed' });
  }
});

// Release Reserve (Decrease Reserved, Increase Available)
router.post('/reserve/release', (req: Request, res: Response) => {
  try {
    const { accountId, amount, referenceId, description } = ReserveActionSchema.parse(req.body);
    const entry = bankService.releaseReserve(accountId, amount, referenceId, description || 'Reserve released');
    return res.json({ success: true, ledgerEntry: entry });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Reserve release failed' });
  }
});

// Final Settlement Debit
router.post('/settlement/debit', (req: Request, res: Response) => {
  try {
    const { accountId, amount, referenceId } = ReserveActionSchema.parse(req.body);
    const entry = bankService.settlementDebit(accountId, amount, referenceId);
    return res.json({ success: true, ledgerEntry: entry });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Settlement debit failed' });
  }
});

// Refund Action
router.post('/refund', (req: Request, res: Response) => {
  try {
    const { accountId, amount, referenceId, reason } = RefundActionSchema.parse(req.body);
    const entry = bankService.refund(accountId, amount, referenceId, reason);
    return res.json({ success: true, ledgerEntry: entry });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Refund failed' });
  }
});

// Query Bank Ledger
router.get('/ledger', (req: Request, res: Response) => {
  const accountId = req.query.accountId as string | undefined;
  const ledger = bankService.getLedger(accountId);
  return res.json({ ledger });
});

export default router;
