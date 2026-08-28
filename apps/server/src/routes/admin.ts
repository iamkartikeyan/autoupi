import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../db';
import { amlEngine } from '../services/aml';
import { corridorManager } from '../services/corridorManager';
import { feeEngine } from '../services/fee';
import { bankService } from '../services/bank';
import { tokenEngine } from '../services/tokenEngine';
import { auditLogger } from '../services/auditLogger';
import { blockchainService } from '../services/blockchain';
import { UserProfile, KYCStatus } from '@auto-upi/shared';

const router = Router();

// 1. ADMIN OVERVIEW METRICS
router.get('/overview', (req: Request, res: Response) => {
  const metrics = db.getMetrics();
  const tokenSupply = tokenEngine.getSupplySummary();
  const amlAlerts = amlEngine.getAlerts();
  const pendingAmlCount = amlAlerts.filter((a) => a.status === 'REVIEW_REQUIRED').length;

  return res.json({
    metrics: {
      ...metrics,
      pendingAmlCount,
      tokenSupply: tokenSupply.outstandingSupply,
      reserveBackingUsd: tokenSupply.backingReserveTotalUsd,
      backingRatio: tokenSupply.backingRatio,
      successRatePercentage: 98.4,
      failureRatePercentage: 1.6,
    },
    corridorVolumes: metrics.corridorVolumes,
    recentEvents: metrics.recentSettlementEvents,
    blockchainLogs: blockchainService.getRecentEvents(10),
  });
});

// 2. USER MANAGEMENT
router.get('/users', (req: Request, res: Response) => {
  const search = req.query.search as string | undefined;
  let users: UserProfile[] = [
    db.currentUser,
    {
      id: 'usr_sarah_9921',
      name: 'Sarah Connor',
      email: 'sarah.c@cyberdyne.io',
      phone: '+1 (555) 881-2940',
      upiId: 'sarah@autoupi',
      role: 'USER',
      kycStatus: 'TIER_1_VERIFIED',
      kycTier: 1,
      dailyLimitUsd: 10000,
      remainingDailyLimitUsd: 8500,
      country: 'United States',
      defaultCurrency: 'USD',
      createdAt: new Date(Date.now() - 3600000 * 200).toISOString(),
    },
    {
      id: 'usr_flagged_demo',
      name: 'Restricted Entity Demo',
      email: 'restricted@flagged.org',
      phone: '+1 (555) 000-9999',
      upiId: 'restricted@autoupi',
      role: 'USER',
      kycStatus: 'REJECTED',
      kycTier: 0,
      dailyLimitUsd: 0,
      remainingDailyLimitUsd: 0,
      country: 'North Korea',
      defaultCurrency: 'USD',
      createdAt: new Date(Date.now() - 3600000 * 500).toISOString(),
    },
  ];

  if (search) {
    const q = search.toLowerCase();
    users = users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.upiId.toLowerCase().includes(q)
    );
  }

  return res.json({ users });
});

// Suspend / Reactivate User
router.post('/users/:id/status', (req: Request, res: Response) => {
  const { isSuspended, reason } = req.body;
  auditLogger.log({
    actor: 'admin@autoupi',
    action: isSuspended ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
    result: 'SUCCESS',
    metadata: { userId: req.params.id, reason },
  });
  return res.json({ success: true, message: `User status updated` });
});

// 3. KYC MANAGEMENT
router.post('/kyc/review', (req: Request, res: Response) => {
  const { userId, decision, reason } = req.body;
  // Update currentUser if matched
  if (db.currentUser.id === userId) {
    db.currentUser.kycStatus = decision === 'APPROVE' ? 'VERIFIED' : decision === 'REJECT' ? 'REJECTED' : 'NEEDS_REVIEW';
    db.currentUser.kycTier = decision === 'APPROVE' ? 2 : 0;
  }

  auditLogger.log({
    actor: 'admin@autoupi',
    action: 'KYC_DECISION',
    result: 'SUCCESS',
    metadata: { userId, decision, reason, timestamp: new Date().toISOString() },
  });

  return res.json({
    success: true,
    message: `KYC review recorded: ${decision}`,
    kycStatus: decision === 'APPROVE' ? 'VERIFIED' : 'REJECTED',
  });
});

// 4. AML MANAGEMENT
router.get('/aml/alerts', (req: Request, res: Response) => {
  return res.json({ alerts: amlEngine.getAlerts() });
});

router.post('/aml/review', (req: Request, res: Response) => {
  try {
    const { alertId, decision, notes } = req.body;
    const reviewedAlert = amlEngine.reviewAlert(alertId, decision, notes, 'admin@autoupi');

    auditLogger.log({
      actor: 'admin@autoupi',
      action: 'AML_ALERT_REVIEW',
      result: 'SUCCESS',
      metadata: { alertId, decision, notes },
    });

    return res.json({ success: true, alert: reviewedAlert });
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// 5. FEE CONFIGURATION
router.get('/fees', (req: Request, res: Response) => {
  return res.json({ config: feeEngine.getConfig() });
});

router.post('/fees', (req: Request, res: Response) => {
  feeEngine.updateConfig(req.body);
  auditLogger.log({
    actor: 'admin@autoupi',
    action: 'FEE_CONFIG_UPDATED',
    result: 'SUCCESS',
    metadata: req.body,
  });
  return res.json({ success: true, config: feeEngine.getConfig() });
});

// 6. FX CONFIGURATION
router.get('/fx/rates', (req: Request, res: Response) => {
  return res.json({ fxRates: corridorManager.getFxRates() });
});

router.post('/fx/rates', (req: Request, res: Response) => {
  const { pair, rate, source } = req.body;
  const updated = corridorManager.updateFxRate(pair, rate, source);
  auditLogger.log({
    actor: 'admin@autoupi',
    action: 'FX_RATE_OVERRIDE',
    result: 'SUCCESS',
    metadata: { pair, rate, source },
  });
  return res.json({ success: true, rateConfig: updated });
});

// 7. CORRIDORS
router.get('/corridors', (req: Request, res: Response) => {
  return res.json({ corridors: corridorManager.getCorridors() });
});

router.post('/corridors/:id/toggle', (req: Request, res: Response) => {
  const { enabled } = req.body;
  const updated = corridorManager.toggleCorridor(req.params.id, enabled);
  auditLogger.log({
    actor: 'admin@autoupi',
    action: 'CORRIDOR_TOGGLE',
    result: 'SUCCESS',
    metadata: { corridorId: req.params.id, enabled },
  });
  return res.json({ success: true, corridor: updated });
});

// 8. RESERVES & TOKEN DASHBOARD
router.get('/reserves', (req: Request, res: Response) => {
  const ledger = bankService.getLedger();
  const totalReservesUsd = 12500000;
  const lockedReservesUsd = 1500000;
  const availableReservesUsd = totalReservesUsd - lockedReservesUsd;
  const settledTotalUsd = 8421000;

  return res.json({
    totalReservesUsd,
    availableReservesUsd,
    lockedReservesUsd,
    settledTotalUsd,
    backingRatio: 1.0,
    ledger,
  });
});

router.get('/tokens', (req: Request, res: Response) => {
  const summary = tokenEngine.getSupplySummary();
  const ledger = tokenEngine.getLedger();
  return res.json({ summary, ledger });
});

// 9. AUDIT LOGS
router.get('/audit-logs', (req: Request, res: Response) => {
  const logs = auditLogger.getLogs();
  return res.json({ logs });
});

export default router;
