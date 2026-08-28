import { OfferOrReward, PaymentTransaction } from '@auto-upi/shared';
import { db } from '../db';
import { bankEscrowService } from './bank';
import { auditLogger } from './auditLogger';

export class RewardsService {
  /**
   * Evaluates and issues rewards upon authoritative transaction completion
   */
  public evaluateTransactionReward(transaction: PaymentTransaction): OfferOrReward | null {
    if (transaction.status !== 'RECIPIENT_CREDITED' && transaction.status !== 'COMPLETED') {
      return null;
    }

    // High volume milestone reward: Amount >= $200 USD
    if (transaction.sourceAmount >= 200) {
      const rewardId = `rew_auto_${Date.now()}`;
      const newReward: OfferOrReward = {
        id: rewardId,
        type: 'SCRATCH_CARD',
        merchantName: 'Auto-UPI Vaults',
        title: 'Settlement Milestone Cashback',
        headline: 'Guaranteed Cashback',
        description: `Unlocked by your ${transaction.sourceCurrency} ${transaction.sourceAmount} remittance to ${transaction.beneficiaryName}`,
        amountOrPercent: '$15.00 USD',
        minTransaction: 200,
        currency: 'USD',
        isFeatured: false,
        expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
        isUnlocked: false,
        isClaimed: false,
        bgGradient: 'from-violet-600/30 via-purple-600/20 to-surface border-violet-500/40',
        ctaText: 'Scratch to Reveal',
        ctaAction: 'CLAIM',
      };

      db.offersAndRewards.unshift(newReward);
      return newReward;
    }

    return null;
  }

  /**
   * Claims and credits unlocked reward yield to user's bank custody balance
   */
  public claimReward(rewardId: string, userId: string = db.currentUser.id): { success: boolean; reward: OfferOrReward; message: string } {
    const reward = db.offersAndRewards.find((r) => r.id === rewardId);
    if (!reward) {
      throw new Error('Reward not found');
    }

    if (reward.isClaimed) {
      return {
        success: true,
        reward,
        message: 'Reward was already credited to bank custody reserve',
      };
    }

    reward.isUnlocked = true;
    reward.isClaimed = true;

    // Credit $15 USD or ₹500 equivalent to primary bank account
    const primaryBank = db.bankAccounts[0];
    if (primaryBank) {
      const creditAmount = reward.currency === 'USD' ? 15.00 : 500.00;
      primaryBank.balance += creditAmount;

      auditLogger.logEvent({
        action: 'REWARD_CLAIMED',
        userId,
        details: {
          rewardId: reward.id,
          title: reward.title,
          creditAmount,
          currency: primaryBank.currency,
          newBalance: primaryBank.balance,
        },
      });
    }

    return {
      success: true,
      reward,
      message: 'Cashback reward successfully credited to your linked bank account',
    };
  }

  public getAllOffersAndRewards(): OfferOrReward[] {
    return db.offersAndRewards;
  }
}

export const rewardsService = new RewardsService();
