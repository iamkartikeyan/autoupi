import { PaymentTransaction, UserProfile } from '@auto-upi/shared';
import { v4 as uuidv4 } from 'uuid';

export type AMLStatus = 'CLEAR' | 'REVIEW_REQUIRED' | 'BLOCKED';

export interface AMLAlert {
  id: string;
  transactionId: string;
  referenceNumber: string;
  userId: string;
  userName: string;
  amount: number;
  currency: string;
  corridor: string;
  riskScore: number; // 0-100
  status: AMLStatus;
  triggeredRules: string[];
  reviewedBy?: string;
  reviewDecision?: 'APPROVED' | 'REJECTED' | 'ESCALATED';
  reviewNotes?: string;
  timestamp: string;
  updatedAt?: string;
}

export interface AMLRuleConfig {
  highValueThresholdUsd: number;
  velocityLimitPerHour: number;
  blockedCountries: string[];
  sanctionedKeywords: string[];
}

export class AMLEngine {
  private config: AMLRuleConfig = {
    highValueThresholdUsd: 10000,
    velocityLimitPerHour: 5,
    blockedCountries: ['North Korea', 'Iran', 'Syria'],
    sanctionedKeywords: ['sanction', 'embargo', 'blocked_entity', 'arms', 'illicit'],
  };

  private alerts: AMLAlert[] = [
    {
      id: 'aml_alt_101',
      transactionId: 'tx_demo_aml_01',
      referenceNumber: 'UPI-XB-9481023',
      userId: 'usr_auto_889210',
      userName: 'Aarav Patel',
      amount: 15000,
      currency: 'USD',
      corridor: 'USD -> INR',
      riskScore: 78,
      status: 'REVIEW_REQUIRED',
      triggeredRules: [
        'HIGH_VALUE_THRESHOLD: Transfer of $15,000 exceeds standard single limit ($10,000)',
        'VELOCITY_CHECK: 3 transfers initiated within 10 minutes',
      ],
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'aml_alt_102',
      transactionId: 'tx_demo_aml_02',
      referenceNumber: 'UPI-XB-9481024',
      userId: 'usr_demo_flagged',
      userName: 'Restricted Entity LLC',
      amount: 50000,
      currency: 'USD',
      corridor: 'USD -> JPY',
      riskScore: 95,
      status: 'BLOCKED',
      triggeredRules: [
        'SANCTIONS_REGISTRY_MATCH: Entity name flagged in OFAC / Global Watchlist',
        'KYC_TIER_MISMATCH: Unverified account attempting Tier 2 volume transfer',
      ],
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];

  public getConfig(): AMLRuleConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<AMLRuleConfig>) {
    this.config = { ...this.config, ...newConfig };
  }

  public evaluateTransaction(tx: PaymentTransaction, user: UserProfile): AMLAlert {
    const triggeredRules: string[] = [];
    let riskScore = 5; // baseline low risk

    // 1. High value threshold check
    if (tx.sourceAmount > this.config.highValueThresholdUsd) {
      triggeredRules.push(
        `HIGH_VALUE_THRESHOLD: Transfer of ${tx.sourceCurrency} ${tx.sourceAmount} exceeds threshold of $${this.config.highValueThresholdUsd}`
      );
      riskScore += 45;
    }

    // 2. Blocked country check
    if (this.config.blockedCountries.includes(tx.beneficiaryCountry)) {
      triggeredRules.push(`BLOCKED_DESTINATION: Corridor to ${tx.beneficiaryCountry} is restricted`);
      riskScore += 70;
    }

    // 3. KYC mismatch check
    if (user.kycTier < 2 && tx.sourceAmount > 10000) {
      triggeredRules.push('KYC_MISMATCH: Level 1 user attempting high-limit transfer');
      riskScore += 35;
    }

    // 4. Sanctioned keywords check
    const noteLower = (tx.note || '').toLowerCase();
    const hasSanctionedWord = this.config.sanctionedKeywords.some((kw) => noteLower.includes(kw));
    if (hasSanctionedWord) {
      triggeredRules.push('SANCTIONED_KEYWORD: Note field contains flagged compliance terms');
      riskScore += 50;
    }

    let status: AMLStatus = 'CLEAR';
    if (riskScore >= 75) {
      status = riskScore >= 90 ? 'BLOCKED' : 'REVIEW_REQUIRED';
    }

    const alert: AMLAlert = {
      id: `aml_${uuidv4().substring(0, 8)}`,
      transactionId: tx.id,
      referenceNumber: tx.referenceNumber,
      userId: user.id,
      userName: user.name,
      amount: tx.sourceAmount,
      currency: tx.sourceCurrency,
      corridor: `${tx.sourceCurrency} -> ${tx.targetCurrency}`,
      riskScore: Math.min(100, riskScore),
      status,
      triggeredRules,
      timestamp: new Date().toISOString(),
    };

    if (status !== 'CLEAR') {
      this.alerts.unshift(alert);
    }

    return alert;
  }

  public getAlerts(): AMLAlert[] {
    return this.alerts;
  }

  public reviewAlert(
    alertId: string,
    decision: 'APPROVED' | 'REJECTED' | 'ESCALATED',
    notes: string,
    adminActor: string = 'admin@autoupi'
  ): AMLAlert {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (!alert) throw new Error('AML Alert not found');

    alert.reviewDecision = decision;
    alert.reviewedBy = adminActor;
    alert.reviewNotes = notes;
    alert.status = decision === 'APPROVED' ? 'CLEAR' : decision === 'REJECTED' ? 'BLOCKED' : 'REVIEW_REQUIRED';
    alert.updatedAt = new Date().toISOString();

    return alert;
  }
}

export const amlEngine = new AMLEngine();
