import { PaymentTransaction, PaymentReconciliationReport, ReconciliationStatus } from '@auto-upi/shared';
import { bankService } from './bank';
import { tokenEngine } from './tokenEngine';

export class ReconciliationEngine {
  public reconcilePayment(tx: PaymentTransaction): PaymentReconciliationReport {
    // 1. Bank reserve check
    const bankLedger = bankService.getLedger(tx.senderBankAccountId);
    const hasReserveDebit = bankLedger.some(
      (l) => l.referenceId === tx.referenceNumber && (l.type === 'DEBIT_RESERVE' || l.type === 'SETTLEMENT_DEBIT')
    );

    // 2. Token backing check
    const tokenLedger = tokenEngine.getLedger();
    const hasTokenMint = tokenLedger.some((t) => t.transactionId === tx.id && t.type === 'MINT');

    // 3. Blockchain confirmation
    const blockchainConfirmed = !!tx.blockchainSettlement?.txHash && tx.blockchainSettlement.blockNumber > 0;

    // 4. FX rate verification
    const expectedTarget = Number((tx.sourceAmount * tx.exchangeRate).toFixed(2));
    const fxRateMatch = Math.abs(expectedTarget - tx.targetAmount) < 0.05;

    // 5. Payout credited check
    const payoutCreditedMatch = tx.status === 'COMPLETED' || tx.status === 'RECIPIENT_CREDITED';

    const varianceAmount = 0.0;
    let status: ReconciliationStatus = 'MATCHED';
    let auditNotes = 'All financial vectors (Bank Custody, EVM Token Mint, On-Chain Block, FX Conversion, Payout) 100% reconciled.';

    if (!hasReserveDebit || !hasTokenMint || !blockchainConfirmed || !fxRateMatch || !payoutCreditedMatch) {
      if (tx.status.includes('FAILED') || tx.status.includes('CANCELLED')) {
        status = 'MATCHED';
        auditNotes = 'Reconciled as aborted transfer. Escrow reserve released back to available balance.';
      } else {
        status = 'PENDING_REVIEW';
        auditNotes = 'Variance or pending confirmation detected across settlement rails.';
      }
    }

    const report: PaymentReconciliationReport = {
      status,
      checkedAt: new Date().toISOString(),
      bankReserveMatch: hasReserveDebit,
      tokenBackingMatch: hasTokenMint,
      blockchainConfirmed,
      fxRateMatch,
      payoutCreditedMatch,
      varianceAmount,
      auditNotes,
    };

    tx.reconciliation = report;
    return report;
  }
}

export const reconciliationEngine = new ReconciliationEngine();
