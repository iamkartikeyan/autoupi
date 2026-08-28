import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { referralService } from '../services/referral';
import { db } from '../db';

const router = Router();

const QualifyReferralSchema = z.object({
  referrerCode: z.string(),
  friendUserId: z.string(),
  friendName: z.string(),
  friendPhoneMasked: z.string(),
  transferAmountUsd: z.number().positive(),
  transactionId: z.string(),
});

// GET /api/referrals
router.get('/', (req: Request, res: Response) => {
  const data = referralService.getReferralData(db.currentUser.id);
  return res.json({ referralData: data });
});

// POST /api/referrals/qualify
router.post('/qualify', (req: Request, res: Response) => {
  try {
    const params = QualifyReferralSchema.parse(req.body);
    const result = referralService.qualifyReferral(params);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Referral qualification failed' });
  }
});

export default router;
