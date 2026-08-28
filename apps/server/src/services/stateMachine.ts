import { PaymentStatus, PaymentTransaction, SettlementTimelineStep } from '@auto-upi/shared';

// Legal Transition Matrix
export const LEGAL_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  CREATED: ['AUTHENTICATING', 'CANCELLED', 'INITIATED'],
  INITIATED: ['AUTHENTICATING', 'KYC_CHECK', 'BANK_AUTHORIZED', 'CANCELLED'],
  AUTHENTICATING: ['KYC_CHECK', 'BANK_AUTHORIZED', 'BANK_DECLINED', 'CANCELLED'],
  KYC_CHECK: ['AML_CHECK', 'BANK_AUTHORIZED', 'KYC_FAILED'],
  AML_CHECK: ['BANK_AUTHORIZED', 'AML_REVIEW', 'CANCELLED'],
  BANK_AUTHORIZED: ['RESERVE_LOCKED', 'RESERVE_FAILED', 'CANCELLED'],
  RESERVE_LOCKED: ['TOKEN_MINTING', 'TOKEN_MINTED', 'FX_LOCKED', 'RESERVE_FAILED', 'REFUND_PENDING', 'CANCELLED'],
  TOKEN_MINTING: ['TOKEN_MINTED', 'TOKEN_MINT_FAILED'],
  TOKEN_MINTED: ['BLOCKCHAIN_SETTLEMENT', 'BLOCKCHAIN_SETTLED', 'BLOCKCHAIN_FAILED'],
  BLOCKCHAIN_SETTLEMENT: ['BLOCKCHAIN_SETTLED', 'FX_LOCKED', 'LOCAL_SETTLEMENT', 'BLOCKCHAIN_FAILED'],
  BLOCKCHAIN_SETTLED: ['FX_LOCKED', 'LOCAL_SETTLEMENT', 'RECIPIENT_CREDITED', 'BLOCKCHAIN_FAILED'],
  FX_LOCKED: ['FX_CONVERTED', 'LOCAL_SETTLEMENT', 'FX_EXPIRED'],
  FX_CONVERTED: ['LOCAL_SETTLEMENT', 'RECIPIENT_CREDITED', 'PAYOUT_FAILED'],
  LOCAL_SETTLEMENT: ['RECIPIENT_CREDITED', 'PAYOUT_FAILED'],
  RECIPIENT_CREDITED: ['COMPLETED'],
  COMPLETED: [],

  // Failure & Refund Transitions
  KYC_FAILED: ['REFUND_PENDING', 'REFUNDED', 'CANCELLED'],
  AML_REVIEW: ['BANK_AUTHORIZED', 'REFUND_PENDING', 'REFUNDED', 'CANCELLED'],
  BANK_DECLINED: ['CANCELLED'],
  RESERVE_FAILED: ['REFUND_PENDING', 'REFUNDED', 'CANCELLED'],
  TOKEN_MINT_FAILED: ['REFUND_PENDING', 'REFUNDED', 'CANCELLED'],
  BLOCKCHAIN_FAILED: ['REFUND_PENDING', 'REFUNDED', 'CANCELLED'],
  FX_EXPIRED: ['REFUND_PENDING', 'REFUNDED', 'CANCELLED'],
  PAYOUT_FAILED: ['REFUND_PENDING', 'REFUNDED'],
  REFUND_PENDING: ['REFUNDED'],
  REFUNDED: [],
  CANCELLED: [],
  FAILED: ['REFUND_PENDING', 'REFUNDED'],
  PROCESSING: ['RECIPIENT_CREDITED', 'COMPLETED', 'PAYOUT_FAILED', 'REFUNDED', 'FAILED'],
};

export const STEP_DESCRIPTIONS: Record<PaymentStatus, { title: string; desc: string }> = {
  CREATED: { title: 'Payment Created', desc: 'Order initialized and awaiting authentication' },
  INITIATED: { title: 'Payment Initiated', desc: 'Payment order registered' },
  PROCESSING: { title: 'Payment Processing', desc: 'Clearing and settlement in progress' },
  AUTHENTICATING: { title: 'Authenticating 2FA', desc: 'Verifying user credentials and device integrity' },
  KYC_CHECK: { title: 'KYC Compliance Verified', desc: 'Sender identity checked against global sanctions' },
  AML_CHECK: { title: 'AML Rules Evaluated', desc: 'Anti-money laundering risk assessment completed' },
  BANK_AUTHORIZED: { title: 'Bank Custody Authorized', desc: 'Partner bank debit authorization approved' },
  RESERVE_LOCKED: { title: 'Bank Reserve Escrow Locked', desc: 'Available balance moved to segregated custody' },
  TOKEN_MINTING: { title: 'Token Minting In-Flight', desc: 'Submitting mint transaction to EVM testnet' },
  TOKEN_MINTED: { title: 'Settlement Token Minted', desc: '1:1 Fiat-backed TBD settlement token created' },
  BLOCKCHAIN_SETTLEMENT: { title: 'EVM On-Chain Settlement', desc: 'Atomic cross-border liquidity transfer' },
  BLOCKCHAIN_SETTLED: { title: 'On-Chain Block Confirmed', desc: 'Atomic transfer confirmed with block finality' },
  FX_LOCKED: { title: 'FX Rate Guaranteed', desc: 'Exchange rate locked with zero spread slippage' },
  FX_CONVERTED: { title: 'Corridor FX Converted', desc: 'Liquidity swapped to destination corridor currency' },
  LOCAL_SETTLEMENT: { title: 'Local Rail Dispatch', desc: 'Dispatching funds to destination domestic clearing house' },
  RECIPIENT_CREDITED: { title: 'Recipient Credited', desc: 'Beneficiary domestic bank account credited' },
  COMPLETED: { title: 'Remittance Finalized', desc: 'End-to-end atomic cross-border settlement complete' },

  // Failures
  KYC_FAILED: { title: 'KYC Verification Failed', desc: 'Identity checks could not be cleared' },
  AML_REVIEW: { title: 'AML Review Required', desc: 'Transaction flagged for manual compliance review' },
  BANK_DECLINED: { title: 'Bank Authorization Declined', desc: 'Insufficient funds or bank decline' },
  RESERVE_FAILED: { title: 'Reserve Lock Failed', desc: 'Could not lock required custody balance' },
  TOKEN_MINT_FAILED: { title: 'Token Mint Failed', desc: 'Smart contract mint call reverted' },
  BLOCKCHAIN_FAILED: { title: 'Blockchain Settlement Failed', desc: 'EVM transaction failed on-chain' },
  FX_EXPIRED: { title: 'FX Quote Expired', desc: '30s rate lock window exceeded before confirmation' },
  PAYOUT_FAILED: { title: 'Destination Payout Failed', desc: 'Destination domestic rail rejected payout' },
  REFUND_PENDING: { title: 'Refund Processing', desc: 'Releasing reserved custody back to sender' },
  REFUNDED: { title: 'Funds Fully Refunded', desc: 'Reserve funds released back to available balance' },
  CANCELLED: { title: 'Payment Cancelled', desc: 'Transfer cancelled by user or operator' },
  FAILED: { title: 'Settlement Failed', desc: 'An error occurred during transaction processing' },
};

export class PaymentStateMachine {
  public static canTransition(currentStatus: PaymentStatus, targetStatus: PaymentStatus): boolean {
    const allowed = LEGAL_TRANSITIONS[currentStatus];
    if (!allowed) return false;
    return allowed.includes(targetStatus);
  }

  public static transition(
    tx: PaymentTransaction,
    targetStatus: PaymentStatus,
    options?: {
      txHash?: string;
      customDesc?: string;
      metadata?: Record<string, any>;
      failureReason?: string;
    }
  ): PaymentTransaction {
    if (!this.canTransition(tx.status, targetStatus)) {
      throw new Error(
        `Illegal State Transition: Cannot transition payment ${tx.id} from ${tx.status} to ${targetStatus}`
      );
    }

    const previousStatus = tx.status;
    tx.status = targetStatus;
    tx.updatedAt = new Date().toISOString();

    if (options?.failureReason) {
      tx.failureReason = options.failureReason;
    }

    // Mark previous timeline items as completed and current false
    tx.timeline.forEach((step) => {
      if (step.isCurrent) step.isCurrent = false;
    });

    const isFailure = targetStatus.includes('FAILED') || targetStatus.includes('DECLINED') || targetStatus.includes('EXPIRED') || targetStatus === 'CANCELLED';
    const info = STEP_DESCRIPTIONS[targetStatus] || { title: targetStatus, desc: options?.customDesc || '' };

    const newStep: SettlementTimelineStep = {
      step: targetStatus,
      title: info.title,
      description: options?.customDesc || info.desc,
      timestamp: new Date().toISOString(),
      isCompleted: !isFailure,
      isCurrent: true,
      isFailed: isFailure,
      txHash: options?.txHash,
      metadata: options?.metadata,
    };

    tx.timeline.push(newStep);

    if (targetStatus === 'COMPLETED' || targetStatus === 'RECIPIENT_CREDITED') {
      tx.settledAt = new Date().toISOString();
    }

    return tx;
  }
}
