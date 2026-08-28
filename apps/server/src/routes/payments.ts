import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { fxService } from '../services/fx';
import { otpService } from '../services/otp';
import { settlementEngine } from '../services/settlement';
import { PaymentTransaction, SupportedCurrency } from '@auto-upi/shared';

const router = Router();

// In-memory idempotency cache
const idempotencyMap: Map<string, { transaction: PaymentTransaction; createdAt: number }> = new Map();

const FXQuoteQuerySchema = z.object({
  sourceCurrency: z.enum(['USD', 'EUR', 'INR', 'SGD', 'GBP', 'AED', 'JPY']),
  targetCurrency: z.enum(['USD', 'EUR', 'INR', 'SGD', 'GBP', 'AED', 'JPY']),
  sourceAmount: z.coerce.number().positive(),
});

const InitiatePaymentSchema = z.object({
  beneficiaryId: z.string(),
  senderBankAccountId: z.string(),
  sourceCurrency: z.enum(['USD', 'EUR', 'INR', 'SGD', 'GBP', 'AED', 'JPY']),
  sourceAmount: z.number().positive(),
  targetCurrency: z.enum(['USD', 'EUR', 'INR', 'SGD', 'GBP', 'AED', 'JPY']),
  quoteId: z.string().optional(),
  note: z.string().optional(),
  purpose: z.enum(['FAMILY_SUPPORT', 'BUSINESS', 'SERVICES', 'TRAVEL', 'EDUCATION']).default('FAMILY_SUPPORT'),
});

const ConfirmPaymentSchema = z.object({
  transactionId: z.string(),
  otpCode: z.string().length(6),
});

// 1. GET FX QUOTE (Authoritative 30s Rate Lock)
router.get('/quote', (req: Request, res: Response) => {
  try {
    const { sourceCurrency, targetCurrency, sourceAmount } = FXQuoteQuerySchema.parse(req.query);
    const quote = fxService.createQuote(sourceCurrency, targetCurrency, sourceAmount);
    return res.json(quote);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Invalid quote parameters' });
  }
});

// 2. INITIATE PAYMENT (With Idempotency & Rate Lock Validation)
router.post('/initiate', (req: Request, res: Response) => {
  try {
    const idempotencyKey = (req.headers['idempotency-key'] as string) || (req.body.idempotencyKey as string);
    if (idempotencyKey && idempotencyMap.has(idempotencyKey)) {
      const existing = idempotencyMap.get(idempotencyKey)!;
      return res.status(200).json({
        success: true,
        transaction: existing.transaction,
        isIdempotentReplay: true,
        message: 'Returning existing transaction for idempotency key',
      });
    }

    const data = InitiatePaymentSchema.parse(req.body);
    const beneficiary = db.beneficiaries.find((b) => b.id === data.beneficiaryId);
    if (!beneficiary) return res.status(404).json({ error: 'Beneficiary not found' });

    const bank = db.bankAccounts.find((b) => b.id === data.senderBankAccountId);
    if (!bank) return res.status(404).json({ error: 'Bank account not found' });

    // Validate quote or generate fresh authoritative quote
    let quote = data.quoteId ? fxService.getQuote(data.quoteId) : undefined;
    if (quote && quote.isExpired) {
      return res.status(400).json({
        error: 'FX rate lock has expired (30s limit exceeded). Please refresh quote to continue.',
        code: 'FX_QUOTE_EXPIRED',
      });
    }

    if (!quote) {
      quote = fxService.createQuote(data.sourceCurrency, data.targetCurrency, data.sourceAmount);
    }

    const totalDebit = quote.totalDebitAmount || data.sourceAmount + quote.feeBreakdown.totalFees;
    if (bank.balance < totalDebit) {
      return res.status(400).json({
        error: `Insufficient balance. Available: ${data.sourceCurrency} ${bank.balance}, Required: ${data.sourceCurrency} ${totalDebit}`,
      });
    }

    const referenceNumber = `UPI-XB-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const txId = `tx_${uuidv4().substring(0, 12)}`;

    const newTx: PaymentTransaction = {
      id: txId,
      referenceNumber,
      userId: db.currentUser.id,
      beneficiaryId: beneficiary.id,
      beneficiaryName: beneficiary.name,
      beneficiaryUpiId: beneficiary.upiIdOrHandle,
      beneficiaryCountry: beneficiary.country,
      beneficiaryFlag: beneficiary.flagEmoji,
      senderBankAccountId: bank.id,
      senderBankName: bank.bankName,
      senderUpiId: db.currentUser.upiId,
      sourceCurrency: data.sourceCurrency,
      sourceAmount: data.sourceAmount,
      targetCurrency: data.targetCurrency,
      targetAmount: quote.targetAmount,
      exchangeRate: quote.exchangeRate,
      fee: quote.feeBreakdown.totalFees,
      feeCurrency: data.sourceCurrency,
      status: 'INITIATED',
      purpose: data.purpose,
      note: data.note || 'Cross-border instant transfer',
      timeline: [
        {
          step: 'INITIATED',
          title: 'Payment Authorization Pending',
          description: 'Awaiting 2FA OTP verification to execute reserve lock and minting',
          timestamp: new Date().toISOString(),
          isCompleted: true,
          isCurrent: true,
          isFailed: false,
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.transactions.unshift(newTx);

    if (idempotencyKey) {
      idempotencyMap.set(idempotencyKey, { transaction: newTx, createdAt: Date.now() });
    }

    // Dispatch security OTP
    otpService.sendOTP(db.currentUser.phone);

    return res.status(201).json({
      success: true,
      transaction: newTx,
      quote,
      otpRequired: true,
      demoOtpCode: '123456',
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Payment initiation failed' });
  }
});

// 3. CONFIRM PAYMENT WITH OTP
router.post('/confirm', async (req: Request, res: Response) => {
  try {
    const { transactionId, otpCode } = ConfirmPaymentSchema.parse(req.body);
    const tx = db.transactions.find((t) => t.id === transactionId);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    const verification = otpService.verifyOTP(db.currentUser.phone, otpCode);
    if (!verification.valid) {
      return res.status(400).json({ error: verification.reason || 'Invalid or expired OTP code' });
    }

    // Execute asynchronous settlement engine in background
    settlementEngine.executeCrossBorderSettlement(tx.id).catch((err) => {
      console.error('Settlement execution error:', err);
    });

    return res.json({
      success: true,
      message: 'Payment authorized. Real-time settlement in progress.',
      transaction: tx,
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Payment confirmation failed' });
  }
});

// 4. GET TRANSACTIONS LIST
router.get('/transactions', (req: Request, res: Response) => {
  const { status, currency, search } = req.query;
  let list = [...db.transactions];

  if (status && typeof status === 'string' && status !== 'ALL') {
    list = list.filter((t) => t.status === status);
  }

  if (currency && typeof currency === 'string' && currency !== 'ALL') {
    list = list.filter((t) => t.targetCurrency === currency || t.sourceCurrency === currency);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    list = list.filter(
      (t) =>
        t.beneficiaryName.toLowerCase().includes(q) ||
        t.referenceNumber.toLowerCase().includes(q) ||
        t.beneficiaryUpiId.toLowerCase().includes(q)
    );
  }

  return res.json({ transactions: list });
});

// 5. GET TRANSACTION DETAIL
router.get('/transactions/:id', (req: Request, res: Response) => {
  const tx = db.transactions.find((t) => t.id === req.params.id);
  if (!tx) return res.status(404).json({ error: 'Transaction not found' });
  return res.json({ transaction: tx });
});

// 6. OFFERS
router.get('/offers', (req: Request, res: Response) => {
  return res.json({ offers: db.offersAndRewards });
});

// 7. GET RECIPIENT ACCOUNTS & BALANCES
router.get('/recipients', (req: Request, res: Response) => {
  const { recipientSimulator } = require('../services/recipientSimulator');
  return res.json({ recipients: recipientSimulator.getAllAccounts() });
});

router.get('/recipients/:id', (req: Request, res: Response) => {
  const { recipientSimulator } = require('../services/recipientSimulator');
  const account = recipientSimulator.getAccount(req.params.id);
  if (!account) return res.status(404).json({ error: 'Recipient account not found' });
  return res.json({ account });
});

// 8. SIMULATE FAILURE & AUTOMATED REFUND TEST
router.post('/simulate-failure', async (req: Request, res: Response) => {
  try {
    const { transactionId, failureMode } = req.body;
    const tx = db.transactions.find((t) => t.id === transactionId);
    if (!tx) return res.status(404).json({ error: 'Transaction not found' });

    try {
      await settlementEngine.executeCrossBorderSettlement(tx.id, failureMode);
      return res.json({ success: true, transaction: tx });
    } catch (err: any) {
      return res.json({
        success: false,
        failureHandled: true,
        transaction: tx,
        error: err.message,
        message: 'Settlement failure triggered automated escrow reserve release and refund.',
      });
    }
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

export default router;
