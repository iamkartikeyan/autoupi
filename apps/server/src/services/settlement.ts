import { PaymentTransaction, PaymentStatus, SettlementTimelineStep, Beneficiary } from '@auto-upi/shared';
import { db } from '../db';
import { PaymentStateMachine } from './stateMachine';
import { bankService } from './bank';
import { tokenEngine } from './tokenEngine';
import { blockchainService } from './blockchain';
import { localSettlementService } from './localSettlement';
import { reconciliationEngine } from './reconciliation';
import { rewardsService } from './rewards';
import { notificationService } from './notifications';

export class SettlementEngine {
  private io: any = null;

  public setSocketServer(io: any) {
    this.io = io;
  }

  private emitStatusEvent(eventName: string, tx: PaymentTransaction, extra: Record<string, any> = {}) {
    if (this.io) {
      this.io.emit(eventName, {
        transactionId: tx.id,
        referenceNumber: tx.referenceNumber,
        status: tx.status,
        timestamp: new Date().toISOString(),
        transaction: tx,
        ...extra,
      });

      // Also emit generic settlement:step event for frontend timeline component
      this.io.emit('settlement:step', {
        transactionId: tx.id,
        status: tx.status,
        step: tx.timeline[tx.timeline.length - 1],
        transaction: tx,
        ...extra,
      });
    }
  }

  public async executeCrossBorderSettlement(
    transactionId: string,
    simulatedFailureMode?: string
  ): Promise<PaymentTransaction> {
    const tx = db.transactions.find((t) => t.id === transactionId);
    if (!tx) throw new Error(`Transaction ${transactionId} not found`);

    const beneficiary = db.beneficiaries.find((b) => b.id === tx.beneficiaryId) || {
      id: tx.beneficiaryId,
      userId: tx.userId,
      name: tx.beneficiaryName,
      upiIdOrHandle: tx.beneficiaryUpiId,
      initials: tx.beneficiaryName.slice(0, 2).toUpperCase(),
      country: tx.beneficiaryCountry,
      countryCode: 'IN',
      flagEmoji: tx.beneficiaryFlag,
      currency: tx.targetCurrency,
      bankName: 'State Bank of India',
      accountNumberMasked: '•••• 3819',
      routingIdentifier: 'SBIN0004829',
      verificationState: 'VERIFIED',
      isFavorite: false,
    } as Beneficiary;

    try {
      // Step 1: User & Authentication
      PaymentStateMachine.transition(tx, 'AUTHENTICATING', {
        customDesc: '2FA Biometric and OTP verification cleared',
      });
      this.emitStatusEvent('payment.created', tx);
      await new Promise((r) => setTimeout(r, 350));

      // Step 2: KYC Check
      if (simulatedFailureMode === 'KYC_INCOMPLETE') {
        throw new Error('KYC Incomplete: Sender identification documents require Level 2 compliance upgrade');
      }
      PaymentStateMachine.transition(tx, 'KYC_CHECK', {
        customDesc: 'Identity verified against regulatory sanction registries',
      });
      this.emitStatusEvent('payment.kyc_verified', tx);
      await new Promise((r) => setTimeout(r, 350));

      // Step 3: AML Compliance
      if (simulatedFailureMode === 'AML_REVIEW') {
        throw new Error('AML Alert: Transaction triggered corridor velocity rules and requires compliance review');
      }
      PaymentStateMachine.transition(tx, 'AML_CHECK', {
        customDesc: 'Anti-money laundering velocity check passed (Risk Score: 8/100 - Low)',
      });
      this.emitStatusEvent('payment.aml_cleared', tx);
      await new Promise((r) => setTimeout(r, 350));

      // Step 4: Bank Authorized
      if (simulatedFailureMode === 'BANK_REJECTION') {
        throw new Error('Bank Declined: Partner bank authorization failed due to daily card limit');
      }
      PaymentStateMachine.transition(tx, 'BANK_AUTHORIZED', {
        customDesc: `${tx.senderBankName} custody debit authorized`,
      });
      await new Promise((r) => setTimeout(r, 350));

      // Step 5: Bank Reserve Escrow Lock
      const totalDebit = tx.sourceAmount + tx.fee;
      if (simulatedFailureMode === 'RESERVE_FAILURE') {
        throw new Error('Reserve Lock Failed: Partner bank custody account lock timed out');
      }
      const reserveEntry = bankService.debitReserve(
        tx.senderBankAccountId,
        totalDebit,
        tx.referenceNumber,
        `Escrow lock for cross-border remittance ${tx.referenceNumber}`
      );
      tx.reserveLockId = reserveEntry.id;
      PaymentStateMachine.transition(tx, 'RESERVE_LOCKED', {
        customDesc: `${tx.sourceCurrency} ${totalDebit.toFixed(2)} locked in ${tx.senderBankName} custody vault (Lock ID: ${reserveEntry.id})`,
      });
      this.emitStatusEvent('payment.reserve_locked', tx, { reserveLockId: reserveEntry.id });
      await new Promise((r) => setTimeout(r, 450));

      // Step 6: Settlement Token Minting
      PaymentStateMachine.transition(tx, 'TOKEN_MINTING', {
        customDesc: 'Submitting 1:1 backed TBD settlement token mint order to EVM testnet',
      });
      await new Promise((r) => setTimeout(r, 400));

      const tokenEntry = tokenEngine.mint(
        tx.id,
        tx.sourceAmount,
        tx.referenceNumber,
        '0xSettlementPool_Corridor'
      );
      PaymentStateMachine.transition(tx, 'TOKEN_MINTED', {
        txHash: tokenEntry.txHash,
        customDesc: `${tx.sourceAmount.toFixed(2)} TBD settlement tokens minted on Auto-UPI EVM Testnet`,
      });
      this.emitStatusEvent('payment.token_minted', tx, { tokenTxHash: tokenEntry.txHash });
      await new Promise((r) => setTimeout(r, 500));

      // Step 7: Blockchain Settlement Block Confirmation
      if (simulatedFailureMode === 'BLOCKCHAIN_FAILURE') {
        throw new Error('Blockchain Reverted: Smart contract liquidity transfer reverted on-chain');
      }
      const blockchainReceipt = await blockchainService.submitReserveLockAndMint(
        reserveEntry.id,
        tx.id,
        `${tx.sourceCurrency}_${tx.targetCurrency}`,
        tx.sourceAmount,
        tx.targetAmount
      );
      tx.blockchainSettlement = blockchainReceipt;

      PaymentStateMachine.transition(tx, 'BLOCKCHAIN_SETTLEMENT', {
        txHash: blockchainReceipt.txHash,
        customDesc: `Atomic liquidity transfer confirmed in Block #${blockchainReceipt.blockNumber}`,
      });
      this.emitStatusEvent('payment.blockchain_confirmed', tx, {
        blockNumber: blockchainReceipt.blockNumber,
        txHash: blockchainReceipt.txHash,
      });
      await new Promise((r) => setTimeout(r, 500));

      // Step 8: FX Rate Lock & Currency Conversion
      if (simulatedFailureMode === 'FX_QUOTE_EXPIRATION') {
        throw new Error('FX Quote Expired: Guaranteed 30-second rate lock window exceeded before local conversion');
      }
      PaymentStateMachine.transition(tx, 'FX_LOCKED', {
        customDesc: `Guaranteed rate locked: 1 ${tx.sourceCurrency} = ${tx.exchangeRate} ${tx.targetCurrency}`,
      });
      this.emitStatusEvent('payment.fx_locked', tx);
      await new Promise((r) => setTimeout(r, 350));

      PaymentStateMachine.transition(tx, 'FX_CONVERTED', {
        customDesc: `Converted to ${tx.targetCurrency} ${tx.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      });
      this.emitStatusEvent('payment.fx_converted', tx);
      await new Promise((r) => setTimeout(r, 400));

      // Step 9: Local Currency Settlement Dispatch
      if (simulatedFailureMode === 'PAYOUT_FAILURE') {
        throw new Error('Payout Failed: Destination domestic payment clearing rail rejected payout');
      }
      PaymentStateMachine.transition(tx, 'LOCAL_SETTLEMENT', {
        customDesc: `Dispatched to domestic instant clearing rail`,
      });
      this.emitStatusEvent('payment.payout_started', tx);

      const localResult = await localSettlementService.executeLocalSettlement(
        tx.referenceNumber,
        beneficiary,
        tx.sourceAmount,
        tx.sourceCurrency,
        tx.targetAmount,
        tx.targetCurrency,
        db.currentUser.name,
        db.currentUser.upiId
      );

      // Finalize token burn and bank debit
      bankService.settlementDebit(tx.senderBankAccountId, totalDebit, tx.referenceNumber);
      tokenEngine.redeemAndBurn(tx.id, tx.sourceAmount, '0xDomesticPayoutGateway', tx.referenceNumber);
      await blockchainService.submitFinalizeSettlement(tx.id, tx.sourceAmount);

      // Step 10: Recipient Credited
      PaymentStateMachine.transition(tx, 'RECIPIENT_CREDITED', {
        customDesc: `${tx.targetCurrency} ${tx.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} credited instantly to ${beneficiary.name} via ${localResult.clearingRail}`,
      });
      this.emitStatusEvent('payment.recipient_credited', tx, {
        recipientBalanceAfter: localResult.recipientBalanceAfter,
      });

      // Step 11: Completed & Reconciled
      reconciliationEngine.reconcilePayment(tx);
      PaymentStateMachine.transition(tx, 'COMPLETED', {
        customDesc: 'End-to-end atomic cross-border settlement complete and 100% reconciled across all rails',
      });
      this.emitStatusEvent('payment.completed', tx);

      // Trigger Rewards Engine
      rewardsService.evaluateTransactionReward(tx);

      // Trigger Notification
      notificationService.createNotification({
        type: 'PAYMENT',
        title: 'Remittance Credited Successfully',
        message: `${tx.targetCurrency} ${tx.targetAmount.toFixed(2)} credited to ${beneficiary.name} via ${localResult.clearingRail}`,
        referenceId: tx.id,
      });

      if (this.io) {
        this.io.emit('transaction:settled', tx);
        this.io.emit('metrics:update', db.getMetrics());
      }

      return tx;
    } catch (err: any) {
      console.error(`[Settlement Engine Error] Tx ${tx.id}:`, err.message);

      // Execute Automated Refund & Recovery Flow
      if (tx.reserveLockId) {
        const totalDebit = tx.sourceAmount + tx.fee;
        // 1. Release bank reserve back to available balance (restores available balance and unfreezes escrow)
        bankService.releaseReserve(
          tx.senderBankAccountId,
          totalDebit,
          tx.referenceNumber,
          `Automated escrow release: ${err.message}`
        );

        // 2. Update state machine
        if (PaymentStateMachine.canTransition(tx.status, 'REFUND_PENDING')) {
          PaymentStateMachine.transition(tx, 'REFUND_PENDING', { failureReason: err.message });
          PaymentStateMachine.transition(tx, 'REFUNDED', {
            customDesc: `${tx.sourceCurrency} ${totalDebit.toFixed(2)} released from escrow and restored to available bank balance`,
            failureReason: err.message,
          });
        } else {
          tx.status = 'REFUNDED';
          tx.failureReason = err.message;
        }

        reconciliationEngine.reconcilePayment(tx);
        this.emitStatusEvent('payment.failed', tx, { error: err.message });
        this.emitStatusEvent('payment.refunded', tx, {
          refundAmount: totalDebit,
          currency: tx.sourceCurrency,
          reason: err.message,
        });
      } else {
        if (PaymentStateMachine.canTransition(tx.status, 'BANK_DECLINED')) {
          PaymentStateMachine.transition(tx, 'BANK_DECLINED', { failureReason: err.message });
        } else if (PaymentStateMachine.canTransition(tx.status, 'KYC_FAILED')) {
          PaymentStateMachine.transition(tx, 'KYC_FAILED', { failureReason: err.message });
        } else {
          tx.status = 'FAILED';
          tx.failureReason = err.message;
        }
        this.emitStatusEvent('payment.failed', tx, { error: err.message });
      }

      throw err;
    }
  }
}

export const settlementEngine = new SettlementEngine();
