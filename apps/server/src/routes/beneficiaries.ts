import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { Beneficiary } from '@auto-upi/shared';

const router = Router();

const BeneficiarySchema = z.object({
  name: z.string().min(2),
  upiIdOrHandle: z.string().min(3),
  country: z.string(),
  countryCode: z.string(),
  flagEmoji: z.string(),
  currency: z.enum(['USD', 'EUR', 'INR', 'SGD', 'GBP', 'AED', 'JPY']),
  bankName: z.string(),
  accountNumberMasked: z.string().optional(),
  routingIdentifier: z.string().optional(),
  phoneOrEmail: z.string().optional(),
  isFavorite: z.boolean().optional(),
});

// 1. LIST & SEARCH BENEFICIARIES
router.get('/', (req: Request, res: Response) => {
  const { search, country, favorite } = req.query;
  let list = [...db.beneficiaries];

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.upiIdOrHandle.toLowerCase().includes(q) ||
        b.bankName.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q)
    );
  }

  if (country && typeof country === 'string' && country !== 'ALL') {
    list = list.filter((b) => b.countryCode === country || b.country === country);
  }

  if (favorite === 'true') {
    list = list.filter((b) => b.isFavorite);
  }

  return res.json({ beneficiaries: list });
});

// 2. RECENT BENEFICIARIES
router.get('/recent', (req: Request, res: Response) => {
  const recent = [...db.beneficiaries]
    .sort((a, b) => {
      const dateA = a.lastTransferDate ? new Date(a.lastTransferDate).getTime() : 0;
      const dateB = b.lastTransferDate ? new Date(b.lastTransferDate).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return res.json({ recentBeneficiaries: recent });
});

// 3. ADD BENEFICIARY
router.post('/', (req: Request, res: Response) => {
  try {
    const data = BeneficiarySchema.parse(req.body);
    const initials = data.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const maskedAcc = data.accountNumberMasked?.startsWith('•')
      ? data.accountNumberMasked
      : `•••• ${data.accountNumberMasked ? data.accountNumberMasked.slice(-4) : Math.floor(1000 + Math.random() * 9000)}`;

    const newBeneficiary: Beneficiary = {
      id: `ben_${uuidv4().substring(0, 8)}`,
      userId: db.currentUser.id,
      name: data.name,
      upiIdOrHandle: data.upiIdOrHandle,
      initials,
      country: data.country,
      countryCode: data.countryCode,
      flagEmoji: data.flagEmoji,
      currency: data.currency,
      bankName: data.bankName,
      accountNumberMasked: maskedAcc,
      routingIdentifier: data.routingIdentifier || `${data.countryCode}000${Math.floor(1000 + Math.random() * 9000)}`,
      phoneOrEmail: data.phoneOrEmail || '',
      verificationState: 'VERIFIED',
      isFavorite: data.isFavorite || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.beneficiaries.unshift(newBeneficiary);

    return res.status(201).json({
      success: true,
      message: 'Beneficiary added successfully',
      beneficiary: newBeneficiary,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to add beneficiary' });
  }
});

// 4. EDIT BENEFICIARY
router.put('/:id', (req: Request, res: Response) => {
  try {
    const ben = db.beneficiaries.find((b) => b.id === req.params.id);
    if (!ben) return res.status(404).json({ error: 'Beneficiary not found' });

    const data = BeneficiarySchema.partial().parse(req.body);
    Object.assign(ben, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    return res.json({
      success: true,
      message: 'Beneficiary updated successfully',
      beneficiary: ben,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to update beneficiary' });
  }
});

// 5. DELETE BENEFICIARY
router.delete('/:id', (req: Request, res: Response) => {
  const index = db.beneficiaries.findIndex((b) => b.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Beneficiary not found' });

  const removed = db.beneficiaries.splice(index, 1)[0];
  return res.json({
    success: true,
    message: `Beneficiary ${removed.name} removed successfully`,
  });
});

export default router;
