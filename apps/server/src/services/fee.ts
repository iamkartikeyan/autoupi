import { FeeConfiguration, FXFeeBreakdown, SupportedCurrency } from '@auto-upi/shared';

export class FeeEngine {
  private config: FeeConfiguration = {
    platformFeePercentage: 0.0, // Promotional zero platform fee
    fixedFee: 1.50, // in USD base
    fxSpreadPercentage: 0.20, // 0.20% interbank spread
    minimumFee: 1.00,
    corridorFees: {
      'INR_USD': { fixedFee: 100, platformFeePercentage: 0.0 }, // ₹100 fixed fee
      'INR_GBP': { fixedFee: 120, platformFeePercentage: 0.0 },
      'INR_EUR': { fixedFee: 120, platformFeePercentage: 0.0 },
      'USD_INR': { fixedFee: 1.50, platformFeePercentage: 0.0 },
      'EUR_SGD': { fixedFee: 1.20, platformFeePercentage: 0.0 },
      'GBP_INR': { fixedFee: 1.00, platformFeePercentage: 0.0 },
    },
  };

  public getConfig(): FeeConfiguration {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<FeeConfiguration>) {
    this.config = {
      ...this.config,
      ...newConfig,
      corridorFees: {
        ...this.config.corridorFees,
        ...(newConfig.corridorFees || {}),
      },
    };
  }

  public calculateFee(
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
    sourceAmount: number,
    marketRate: number
  ): FXFeeBreakdown {
    const corridorKey = `${sourceCurrency}_${targetCurrency}`;
    const corridorOverride = this.config.corridorFees[corridorKey];

    // Currency fixed fee multiplier
    const fixedFee = corridorOverride
      ? corridorOverride.fixedFee
      : sourceCurrency === 'INR'
      ? 100
      : this.config.fixedFee;

    const platformFeeRate = corridorOverride
      ? corridorOverride.platformFeePercentage
      : this.config.platformFeePercentage;

    const platformFee = Number(((sourceAmount * platformFeeRate) / 100).toFixed(2));
    const networkSettlementFee = fixedFee;

    const totalFees = Math.max(
      sourceCurrency === 'INR' ? 50 : this.config.minimumFee,
      Number((networkSettlementFee + platformFee).toFixed(2))
    );

    const fxSpreadPercentage = this.config.fxSpreadPercentage;
    const effectiveRate = Number((marketRate * (1 - fxSpreadPercentage / 100)).toFixed(4));

    return {
      networkSettlementFee,
      platformFee,
      fxSpreadPercentage,
      totalFees,
      effectiveRate,
      marketRate: Number(marketRate.toFixed(4)),
    };
  }
}

export const feeEngine = new FeeEngine();
