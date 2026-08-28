import { SupportedCurrency } from '@auto-upi/shared';

export interface PaymentCorridorConfig {
  id: string;
  country: string;
  countryCode: string;
  flag: string;
  currency: SupportedCurrency;
  domesticRail: string;
  fixedFee: number;
  platformFeePercentage: number;
  minAmount: number;
  maxAmount: number;
  estimatedSettlement: string;
  enabled: boolean;
}

export interface FXRateConfig {
  pair: string; // e.g. "USD/INR"
  sourceCurrency: SupportedCurrency;
  targetCurrency: SupportedCurrency;
  rate: number;
  spread: number;
  source: 'DEMO' | 'EXTERNAL_PROVIDER';
  providerName?: string;
  lastUpdated: string;
}

export class CorridorManagerService {
  private corridors: PaymentCorridorConfig[] = [
    {
      id: 'corr_in',
      country: 'India',
      countryCode: 'IN',
      flag: '🇮🇳',
      currency: 'INR',
      domesticRail: 'UPI 2.0 (NPCI)',
      fixedFee: 1.50,
      platformFeePercentage: 0.0,
      minAmount: 10,
      maxAmount: 25000,
      estimatedSettlement: '~3.8s target',
      enabled: true,
    },
    {
      id: 'corr_gb',
      country: 'United Kingdom',
      countryCode: 'GB',
      flag: '🇬🇧',
      currency: 'GBP',
      domesticRail: 'Faster Payments (FPS)',
      fixedFee: 2.00,
      platformFeePercentage: 0.0,
      minAmount: 10,
      maxAmount: 50000,
      estimatedSettlement: '~5.1s target',
      enabled: true,
    },
    {
      id: 'corr_sg',
      country: 'Singapore',
      countryCode: 'SG',
      flag: '🇸🇬',
      currency: 'SGD',
      domesticRail: 'PayNow (MAS)',
      fixedFee: 1.20,
      platformFeePercentage: 0.0,
      minAmount: 5,
      maxAmount: 30000,
      estimatedSettlement: '~4.0s target',
      enabled: true,
    },
    {
      id: 'corr_de',
      country: 'Germany / Eurozone',
      countryCode: 'DE',
      flag: '🇪🇺',
      currency: 'EUR',
      domesticRail: 'SEPA Instant (TIPS)',
      fixedFee: 1.50,
      platformFeePercentage: 0.0,
      minAmount: 10,
      maxAmount: 45000,
      estimatedSettlement: '~4.5s target',
      enabled: true,
    },
    {
      id: 'corr_jp',
      country: 'Japan',
      countryCode: 'JP',
      flag: '🇯🇵',
      currency: 'JPY',
      domesticRail: 'Zengin System',
      fixedFee: 2.50,
      platformFeePercentage: 0.0,
      minAmount: 50,
      maxAmount: 20000,
      estimatedSettlement: '~8.0s target',
      enabled: true,
    },
  ];

  private fxRates: FXRateConfig[] = [
    {
      pair: 'USD/INR',
      sourceCurrency: 'USD',
      targetCurrency: 'INR',
      rate: 83.50,
      spread: 0.20,
      source: 'DEMO',
      providerName: 'Auto-UPI Interbank Liquidity Sandbox',
      lastUpdated: new Date().toISOString(),
    },
    {
      pair: 'USD/GBP',
      sourceCurrency: 'USD',
      targetCurrency: 'GBP',
      rate: 0.788,
      spread: 0.20,
      source: 'DEMO',
      providerName: 'Auto-UPI Interbank Liquidity Sandbox',
      lastUpdated: new Date().toISOString(),
    },
    {
      pair: 'USD/EUR',
      sourceCurrency: 'USD',
      targetCurrency: 'EUR',
      rate: 0.920,
      spread: 0.20,
      source: 'DEMO',
      providerName: 'Auto-UPI Interbank Liquidity Sandbox',
      lastUpdated: new Date().toISOString(),
    },
    {
      pair: 'USD/SGD',
      sourceCurrency: 'USD',
      targetCurrency: 'SGD',
      rate: 1.340,
      spread: 0.20,
      source: 'DEMO',
      providerName: 'Auto-UPI Interbank Liquidity Sandbox',
      lastUpdated: new Date().toISOString(),
    },
    {
      pair: 'USD/AED',
      sourceCurrency: 'USD',
      targetCurrency: 'AED',
      rate: 3.672,
      spread: 0.15,
      source: 'DEMO',
      providerName: 'Auto-UPI Interbank Liquidity Sandbox',
      lastUpdated: new Date().toISOString(),
    },
    {
      pair: 'USD/JPY',
      sourceCurrency: 'USD',
      targetCurrency: 'JPY',
      rate: 154.20,
      spread: 0.25,
      source: 'DEMO',
      providerName: 'Auto-UPI Interbank Liquidity Sandbox',
      lastUpdated: new Date().toISOString(),
    },
  ];

  public getCorridors(): PaymentCorridorConfig[] {
    return this.corridors;
  }

  public toggleCorridor(corridorId: string, enabled: boolean): PaymentCorridorConfig {
    const corridor = this.corridors.find((c) => c.id === corridorId);
    if (!corridor) throw new Error('Corridor not found');
    corridor.enabled = enabled;
    return corridor;
  }

  public getFxRates(): FXRateConfig[] {
    return this.fxRates;
  }

  public updateFxRate(pair: string, newRate: number, source: 'DEMO' | 'EXTERNAL_PROVIDER'): FXRateConfig {
    const rateItem = this.fxRates.find((r) => r.pair === pair);
    if (!rateItem) throw new Error('Rate pair not found');
    rateItem.rate = newRate;
    rateItem.source = source;
    rateItem.lastUpdated = new Date().toISOString();
    return rateItem;
  }
}

export const corridorManager = new CorridorManagerService();
