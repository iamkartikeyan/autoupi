import { FXQuote, SupportedCurrency } from '@auto-upi/shared';
import { v4 as uuidv4 } from 'uuid';
import { feeEngine } from './fee';

const BASE_RATES_TO_USD: Record<SupportedCurrency, number> = {
  USD: 1.0,
  EUR: 1.087,   // 1 EUR = 1.087 USD => 1 USD = 0.9200 EUR
  GBP: 1.266,   // 1 GBP = 1.266 USD => 1 USD = 0.7898 GBP
  SGD: 0.746,   // 1 SGD = 0.746 USD => 1 USD = 1.3404 SGD
  INR: 0.01198, // 1 INR = 0.01198 USD => 1 USD = 83.5000 INR
  AED: 0.2723,  // 1 AED = 0.2723 USD => 1 USD = 3.6724 AED
  JPY: 0.00649, // 1 JPY = 0.00649 USD => 1 USD = 154.0832 JPY
};

export class FXService {
  private activeQuotes: Map<string, FXQuote> = new Map();
  private rateCache: Map<string, { rate: number; expiresAt: number }> = new Map();

  public getRate(sourceCurrency: SupportedCurrency, targetCurrency: SupportedCurrency): number {
    if (sourceCurrency === targetCurrency) return 1.0;

    const cacheKey = `${sourceCurrency}_${targetCurrency}`;
    const cached = this.rateCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.rate;
    }

    const sourceInUsd = BASE_RATES_TO_USD[sourceCurrency];
    const targetInUsd = BASE_RATES_TO_USD[targetCurrency];
    const rate = sourceInUsd / targetInUsd;

    // Cache rate for 5 minutes
    this.rateCache.set(cacheKey, { rate, expiresAt: Date.now() + 5 * 60 * 1000 });
    return rate;
  }

  public createQuote(
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
    sourceAmount: number
  ): FXQuote {
    const marketRate = this.getRate(sourceCurrency, targetCurrency);
    const feeBreakdown = feeEngine.calculateFee(sourceCurrency, targetCurrency, sourceAmount, marketRate);

    const targetAmount = Number((sourceAmount * feeBreakdown.effectiveRate).toFixed(2));
    const totalDebitAmount = Number((sourceAmount + feeBreakdown.totalFees).toFixed(2));

    const quoteId = `quo_${uuidv4().substring(0, 10)}`;
    const now = new Date();
    const expiresInSeconds = 30; // 30 seconds rate lock window
    const guaranteedUntil = new Date(now.getTime() + expiresInSeconds * 1000).toISOString();

    const quote: FXQuote = {
      quoteId,
      sourceCurrency,
      targetCurrency,
      sourceAmount,
      targetAmount,
      totalDebitAmount,
      exchangeRate: feeBreakdown.effectiveRate,
      inverseRate: Number((1 / feeBreakdown.effectiveRate).toFixed(4)),
      feeBreakdown,
      guaranteedUntil,
      expiresInSeconds,
      estimatedSettlementTime: '~60 sec target',
      isExpired: false,
      createdAt: now.toISOString(),
    };

    this.activeQuotes.set(quoteId, quote);
    return quote;
  }

  public getQuote(quoteId: string): FXQuote | undefined {
    const quote = this.activeQuotes.get(quoteId);
    if (!quote) return undefined;

    const isExpired = Date.now() > new Date(quote.guaranteedUntil).getTime();
    if (isExpired) {
      quote.isExpired = true;
    }
    return quote;
  }

  public validateAndLockQuote(quoteId: string): { valid: boolean; quote?: FXQuote; reason?: string } {
    const quote = this.getQuote(quoteId);
    if (!quote) {
      return { valid: false, reason: 'Quote not found. Please refresh for a live rate.' };
    }

    if (quote.isExpired || Date.now() > new Date(quote.guaranteedUntil).getTime()) {
      return { valid: false, quote, reason: 'Quote has expired (30s lock exceeded). Rate refreshed.' };
    }

    return { valid: true, quote };
  }
}

export const fxService = new FXService();
