import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { qrService } from '../services/qr';
import { db } from '../db';

const router = Router();

const GenerateQRSchema = z.object({
  upiId: z.string().optional(),
  name: z.string().optional(),
  amount: z.coerce.number().positive().optional(),
  currency: z.enum(['USD', 'EUR', 'INR', 'SGD', 'GBP', 'AED', 'JPY']).optional(),
  note: z.string().optional(),
});

const ParseQRSchema = z.object({
  qrString: z.string().min(3),
});

// GET /api/qr/generate
router.get('/generate', (req: Request, res: Response) => {
  try {
    const params = GenerateQRSchema.parse(req.query);
    const result = qrService.generatePaymentQR({
      upiId: params.upiId || db.currentUser.upiId,
      name: params.name || db.currentUser.name,
      amount: params.amount,
      currency: params.currency || 'USD',
      note: params.note,
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Invalid QR parameters' });
  }
});

// POST /api/qr/parse
router.post('/parse', (req: Request, res: Response) => {
  try {
    const { qrString } = ParseQRSchema.parse(req.body);
    const result = qrService.parsePaymentQR(qrString);
    if (!result.valid) {
      return res.status(400).json({
        valid: false,
        error: result.error || 'Invalid payment QR payload',
      });
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Malformed QR parsing request' });
  }
});

export default router;
