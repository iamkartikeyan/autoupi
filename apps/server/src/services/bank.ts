import { BankAccount, BankLedgerEntry, SupportedCurrency } from '@auto-upi/shared';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';

export class SimulatedBankService {
  private ledger: BankLedgerEntry[] = [
    {
      id: 'led_init_01',
      accountId: 'acc_chase_usd_01',
      userId: 'usr_auto_889210',
      type: 'DEPOSIT',
      amount: 14850.50,
      currency: 'USD',
      availableBalanceAfter: 14850.50,
      reservedBalanceAfter: 0,
      referenceId: 'DEP-INIT-001',
      description: 'Initial institutional reserve custody deposit via FedNow',
      timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
    },
    {
      id: 'led_init_02',
      accountId: 'acc_chase_usd_01',
      userId: 'usr_auto_889210',
      type: 'DEBIT_RESERVE',
      amount: 350.00,
      currency: 'USD',
      availableBalanceAfter: 14500.50,
      reservedBalanceAfter: 350.00,
      referenceId: 'UPI-XB-8921820',
      description: 'Escrow lock for cross-border transfer to Priya Sharma (India)',
      timestamp: new Date(Date.now() - 24 * 3600000).toISOString(),
    },
    {
      id: 'led_init_03',
      accountId: 'acc_chase_usd_01',
      userId: 'usr_auto_889210',
      type: 'SETTLEMENT_DEBIT',
      amount: 350.00,
      currency: 'USD',
      availableBalanceAfter: 14500.50,
      reservedBalanceAfter: 0,
      referenceId: 'UPI-XB-8921820',
      description: 'Atomic settlement finality confirmed on EVM Block #194829',
      timestamp: new Date(Date.now() - 24 * 3600000 + 4800).toISOString(),
    }
  ];

  // Map of account reserved balances
  private reservedBalances: Map<string, number> = new Map([
    ['acc_chase_usd_01', 1500.00],
    ['acc_hdfc_inr_02', 25000.00],
    ['acc_deutsche_eur_03', 600.00],
  ]);

  // Map of account settled balances
  private settledBalances: Map<string, number> = new Map([
    ['acc_chase_usd_01', 28500.00],
  ]);

  public getAccount(accountId: string): BankAccount | undefined {
    return db.bankAccounts.find((a) => a.id === accountId);
  }

  public getAccountSummary(accountId: string) {
    const account = this.getAccount(accountId);
    if (!account) throw new Error(`Bank account ${accountId} not found`);

    const reserved = this.reservedBalances.get(accountId) || 0;
    const settled = this.settledBalances.get(accountId) || 0;

    return {
      account,
      availableBalance: account.balance,
      reservedBalance: reserved,
      settledBalance: settled,
      totalUsableBalance: account.balance + reserved,
      accountStatus: account.status,
      isReserveBacked: account.isReserveBacked,
    };
  }

  public getLedger(accountId?: string): BankLedgerEntry[] {
    if (accountId) {
      return this.ledger.filter((l) => l.accountId === accountId);
    }
    return this.ledger;
  }

  /**
   * 1. Debit Reserve: Locks available balance into escrow
   * Example: Available ₹100,000, Reserved ₹0 -> Available ₹90,000, Reserved ₹10,000
   */
  public debitReserve(accountId: string, amount: number, referenceId: string, description: string): BankLedgerEntry {
    const account = this.getAccount(accountId);
    if (!account) throw new Error('Bank account not found');
    if (account.balance < amount) throw new Error('Insufficient available balance for reserve lock');

    account.balance -= amount;
    const currentReserved = this.reservedBalances.get(accountId) || 0;
    const newReserved = currentReserved + amount;
    this.reservedBalances.set(accountId, newReserved);

    const entry: BankLedgerEntry = {
      id: `led_${uuidv4().substring(0, 10)}`,
      accountId,
      userId: account.userId,
      type: 'DEBIT_RESERVE',
      amount,
      currency: account.currency,
      availableBalanceAfter: account.balance,
      reservedBalanceAfter: newReserved,
      referenceId,
      description: description || `Escrow lock of ${account.currency} ${amount} for remittance ${referenceId}`,
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }

  /**
   * 2. Release Reserve: Unlocks reserved balance back to available balance (upon failure/cancellation)
   * Example: Reserved ₹10,000 -> Released back -> Available increases by ₹10,000
   */
  public releaseReserve(accountId: string, amount: number, referenceId: string, reason: string): BankLedgerEntry {
    const account = this.getAccount(accountId);
    if (!account) throw new Error('Bank account not found');

    const currentReserved = this.reservedBalances.get(accountId) || 0;
    const newReserved = Math.max(0, currentReserved - amount);
    this.reservedBalances.set(accountId, newReserved);
    account.balance += amount;

    const entry: BankLedgerEntry = {
      id: `led_${uuidv4().substring(0, 10)}`,
      accountId,
      userId: account.userId,
      type: 'RELEASE_RESERVE',
      amount,
      currency: account.currency,
      availableBalanceAfter: account.balance,
      reservedBalanceAfter: newReserved,
      referenceId,
      description: `Reserve released back to available balance: ${reason}`,
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }

  /**
   * 3. Settlement Debit: When payment succeeds, reserve becomes settled
   * Example: Reserved ₹10,000 -> Settled ₹10,000 (dispatched to recipient clearing rail)
   */
  public settlementDebit(accountId: string, amount: number, referenceId: string): BankLedgerEntry {
    const account = this.getAccount(accountId);
    if (!account) throw new Error('Bank account not found');

    const currentReserved = this.reservedBalances.get(accountId) || 0;
    const newReserved = Math.max(0, currentReserved - amount);
    this.reservedBalances.set(accountId, newReserved);

    const currentSettled = this.settledBalances.get(accountId) || 0;
    this.settledBalances.set(accountId, currentSettled + amount);

    const entry: BankLedgerEntry = {
      id: `led_${uuidv4().substring(0, 10)}`,
      accountId,
      userId: account.userId,
      type: 'SETTLEMENT_DEBIT',
      amount,
      currency: account.currency,
      availableBalanceAfter: account.balance,
      reservedBalanceAfter: newReserved,
      referenceId,
      description: `Cross-border settlement finalized. Reserve settled on-chain for ${referenceId}`,
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }

  /**
   * 4. Refund: Restores user balance and creates immutable refund record
   */
  public refund(accountId: string, amount: number, referenceId: string, reason: string): BankLedgerEntry {
    const account = this.getAccount(accountId);
    if (!account) throw new Error('Bank account not found');

    account.balance += amount;
    const currentReserved = this.reservedBalances.get(accountId) || 0;

    const entry: BankLedgerEntry = {
      id: `led_${uuidv4().substring(0, 10)}`,
      accountId,
      userId: account.userId,
      type: 'REFUND',
      amount,
      currency: account.currency,
      availableBalanceAfter: account.balance,
      reservedBalanceAfter: currentReserved,
      referenceId,
      description: `Settlement refund of ${account.currency} ${amount}: ${reason}`,
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }

  /**
   * 5. Recipient Credit: Credits destination beneficiary account
   */
  public recipientCredit(recipientAccountId: string, amount: number, currency: SupportedCurrency, referenceId: string): BankLedgerEntry {
    const entry: BankLedgerEntry = {
      id: `led_${uuidv4().substring(0, 10)}`,
      accountId: recipientAccountId,
      userId: 'beneficiary_dest',
      type: 'RECIPIENT_CREDIT',
      amount,
      currency,
      availableBalanceAfter: amount,
      reservedBalanceAfter: 0,
      referenceId,
      description: `Instant domestic rail payout credit of ${currency} ${amount} (Ref: ${referenceId})`,
      timestamp: new Date().toISOString(),
    };

    this.ledger.unshift(entry);
    return entry;
  }
}

export const bankService = new SimulatedBankService();
