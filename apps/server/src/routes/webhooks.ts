import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { paymentProvider } from '../services/paymentProvider';
import { db } from '../db';
import { auditLogger } from '../services/auditLogger';
import { notificationService } from '../services/notifications';

const router = Router();

// In-memory processed webhook event deduplication set
const processedWebhookIds: Set<string> = new Set();

const WebhookPayloadSchema = z.object({
  eventId: z.string(),
  eventType: z.enum([
    'payment.cleared',
    'payment.failed',
    'payment.reversed',
    'payout.settled',
    'payout.rejected',
  ]),
  providerReference: z.string(),
  transactionReference: z.string(),
  timestamp: z.string(),
  data: z.record(z.any()),
});

// POST /api/webhooks/provider
router.post('/provider', async (req: Request, res: Response) => {
  const signature = (req.headers['x-provider-signature'] as string) || (req.headers['x-signature'] as string) || '';

  // 1. Authenticate Provider Signature
  if (!signature || !paymentProvider.verifyWebhook(signature, req.body)) {
    return res.status(401).json({ error: 'Unauthorized: Invalid provider signature' });
  }

  try {
    const payload = WebhookPayloadSchema.parse(req.body);

    // 2. Idempotency check: Ignore duplicate webhook deliveries
    if (processedWebhookIds.has(payload.eventId)) {
      return res.status(200).json({
        received: true,
        isDuplicate: true,
        message: 'Webhook event already processed',
      });
    }

    processedWebhookIds.add(payload.eventId);

    // 3. Match transaction
    const tx = db.transactions.find(
      (t) => t.referenceNumber === payload.transactionReference || t.id === payload.transactionReference
    );

    if (tx) {
      if (payload.eventType === 'payout.settled' || payload.eventType === 'payment.cleared') {
        tx.status = 'RECIPIENT_CREDITED';
        notificationService.createNotification({
          type: 'PAYMENT',
          title: 'Webhook: Recipient Credited',
          message: `Provider confirmed ${tx.targetCurrency} ${tx.targetAmount} credited to ${tx.beneficiaryName}`,
          referenceId: tx.id,
        });
      } else if (payload.eventType === 'payout.rejected' || payload.eventType === 'payment.failed') {
        tx.status = 'REFUNDED';
        tx.failureReason = payload.data.reason || 'Domestic clearing rail rejected payout';
        notificationService.createNotification({
          type: 'PAYMENT',
          title: 'Webhook: Payout Rejected',
          message: `Payout rejected: ${tx.failureReason}. Escrow released.`,
          referenceId: tx.id,
        });
      }
    }

    auditLogger.logEvent({
      action: 'WEBHOOK_PROCESSED',
      userId: tx?.userId || 'SYSTEM_PROVIDER',
      details: {
        eventId: payload.eventId,
        eventType: payload.eventType,
        providerReference: payload.providerReference,
        transactionReference: payload.transactionReference,
      },
    });

    return res.json({
      received: true,
      processed: true,
      eventId: payload.eventId,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Webhook processing failed' });
  }
});

export default router;
