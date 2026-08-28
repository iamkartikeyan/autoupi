import { SupportedCurrency } from '@auto-upi/shared';

export interface RecipientIncomingPayment {
  id: string;
  transactionReference: string;
  senderName: string;
  senderUpiId: string;
  sourceAmount: number;
  sourceCurrency: SupportedCurrency;
  creditedAmount: number;
  creditedCurrency: SupportedCurrency;
  clearingRail: string;
  bankName: string;
  accountNumberMasked: string;
  timestamp: string;
}

export interface RecipientAccount {
  beneficiaryId: string;
  name: string;
  country: string;
  currency: SupportedCurrency;
  bankName: string;
  accountNumberMasked: string;
  routingIdentifier: string;
  balance: number;
  status: 'ACTIVE' | 'BLOCKED' | 'RESTRICTED';
  incomingPayments: RecipientIncomingPayment[];
}

export class RecipientSimulatorService {
  private accounts: Map<string, RecipientAccount> = new Map([
    [
      'ben_priya_in',
      {
        beneficiaryId: 'ben_priya_in',
        name: 'Priya Sharma',
        country: 'India',
        currency: 'INR',
        bankName: 'State Bank of India',
        accountNumberMasked: '•••• 3819',
        routingIdentifier: 'SBIN0004829',
        balance: 45000.0,
        status: 'ACTIVE',
        incomingPayments: [],
      },
    ],
    [
      'ben_alex_gb',
      {
        beneficiaryId: 'ben_alex_gb',
        name: 'Alex Johnson',
        country: 'United Kingdom',
        currency: 'GBP',
        bankName: 'Barclays Bank',
        accountNumberMasked: '•••• 8820',
        routingIdentifier: '20-04-15',
        balance: 1250.0,
        status: 'ACTIVE',
        incomingPayments: [],
      },
    ],
    [
      'ben_wei_sg',
      {
        beneficiaryId: 'ben_wei_sg',
        name: 'Wei Chen',
        country: 'Singapore',
        currency: 'SGD',
        bankName: 'DBS Bank Singapore',
        accountNumberMasked: '•••• 6621',
        routingIdentifier: 'DBSSSGSG',
        balance: 3800.0,
        status: 'ACTIVE',
        incomingPayments: [],
      },
    ],
    [
      'ben_mateo_eu',
      {
        beneficiaryId: 'ben_mateo_eu',
        name: 'Mateo Silva',
        country: 'Germany',
        currency: 'EUR',
        bankName: 'BNP Paribas',
        accountNumberMasked: '•••• 1044',
        routingIdentifier: 'DEUTDEFFXXX',
        balance: 2100.0,
        status: 'ACTIVE',
        incomingPayments: [],
      },
    ],
    [
      'ben_blocked_demo',
      {
        beneficiaryId: 'ben_blocked_demo',
        name: 'Blocked Sanctioned Account (Demo)',
        country: 'India',
        currency: 'INR',
        bankName: 'Restricted Bank Corp',
        accountNumberMasked: '•••• 9999',
        routingIdentifier: 'REST0009999',
        balance: 0.0,
        status: 'BLOCKED',
        incomingPayments: [],
      },
    ],
  ]);

  public getAccount(beneficiaryId: string): RecipientAccount | undefined {
    return this.accounts.get(beneficiaryId);
  }

  public getAllAccounts(): RecipientAccount[] {
    return Array.from(this.accounts.values());
  }

  /**
   * Credit recipient account in destination domestic currency
   */
  public creditRecipient(
    beneficiaryId: string,
    amount: number,
    currency: SupportedCurrency,
    txReference: string,
    senderName: string,
    senderUpiId: string,
    clearingRail: string
  ): { previousBalance: number; newBalance: number; paymentRecord: RecipientIncomingPayment } {
    let account = this.accounts.get(beneficiaryId);

    if (!account) {
      account = {
        beneficiaryId,
        name: 'Cross-Border Recipient',
        country: 'India',
        currency,
        bankName: 'Destination Partner Bank',
        accountNumberMasked: '•••• 4829',
        routingIdentifier: 'CORR0004829',
        balance: 1000.0,
        status: 'ACTIVE',
        incomingPayments: [],
      };
      this.accounts.set(beneficiaryId, account);
    }

    if (account.status === 'BLOCKED') {
      throw new Error(`Payout Rejected: Recipient account ${account.accountNumberMasked} is flagged or blocked by compliance`);
    }

    const previousBalance = account.balance;
    account.balance += amount;

    const paymentRecord: RecipientIncomingPayment = {
      id: `rcp_pay_${Date.now()}`,
      transactionReference: txReference,
      senderName,
      senderUpiId,
      sourceAmount: amount,
      sourceCurrency: currency,
      creditedAmount: amount,
      creditedCurrency: currency,
      clearingRail,
      bankName: account.bankName,
      accountNumberMasked: account.accountNumberMasked,
      timestamp: new Date().toISOString(),
    };

    account.incomingPayments.unshift(paymentRecord);

    return {
      previousBalance,
      newBalance: account.balance,
      paymentRecord,
    };
  }
}

export const recipientSimulator = new RecipientSimulatorService();
