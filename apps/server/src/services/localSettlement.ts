import { SupportedCurrency, FXQuote, Beneficiary } from '@auto-upi/shared';
import { recipientSimulator } from './recipientSimulator';

export interface LocalSettlementResult {
  settlementReference: string;
  clearingRail: string;
  sourceAmount: number;
  sourceCurrency: SupportedCurrency;
  destinationAmount: number;
  destinationCurrency: SupportedCurrency;
  recipientName: string;
  recipientAccountMasked: string;
  recipientBank: string;
  status: 'DISPATCHED' | 'CREDITED' | 'FAILED';
  payoutTimestamp: string;
  recipientBalanceAfter: number;
}

export class LocalCurrencySettlementService {
  private getClearingRail(currency: SupportedCurrency): string {
    switch (currency) {
      case 'INR':
        return 'UPI 2.0 (NPCI Instant Settlement)';
      case 'SGD':
        return 'PayNow FAST (MAS Clearing Rail)';
      case 'GBP':
        return 'Faster Payments (Bank of England RTGS)';
      case 'EUR':
        return 'SEPA Instant Credit Transfer (TIPS / ECB)';
      case 'JPY':
        return 'Zengin System Real-Time Clearing';
      default:
        return 'Domestic Instant Clearing Rail';
    }
  }

  public async executeLocalSettlement(
    txReference: string,
    beneficiary: Beneficiary,
    sourceAmount: number,
    sourceCurrency: SupportedCurrency,
    destinationAmount: number,
    destinationCurrency: SupportedCurrency,
    senderName: string,
    senderUpiId: string
  ): Promise<LocalSettlementResult> {
    const clearingRail = this.getClearingRail(destinationCurrency);

    // Simulate domestic clearing rail latency
    await new Promise((resolve) => setTimeout(resolve, 350));

    // Credit recipient account in destination domestic currency
    const creditResult = recipientSimulator.creditRecipient(
      beneficiary.id,
      destinationAmount,
      destinationCurrency,
      txReference,
      senderName,
      senderUpiId,
      clearingRail
    );

    return {
      settlementReference: `SETTLE-DOM-${Math.floor(100000 + Math.random() * 900000)}`,
      clearingRail,
      sourceAmount,
      sourceCurrency,
      destinationAmount,
      destinationCurrency,
      recipientName: beneficiary.name,
      recipientAccountMasked: beneficiary.accountNumberMasked,
      recipientBank: beneficiary.bankName,
      status: 'CREDITED',
      payoutTimestamp: new Date().toISOString(),
      recipientBalanceAfter: creditResult.newBalance,
    };
  }
}

export const localSettlementService = new LocalCurrencySettlementService();
