import { ReferralData, ReferralProgressItem } from '@auto-upi/shared';
import { db } from '../db';
import { auditLogger } from './auditLogger';

export class ReferralService {
  private userReferralMap: Map<string, ReferralData> = new Map();

  constructor() {
    // Seed initial referral data for default user
    this.userReferralMap.set(db.currentUser.id, {
      referralCode: 'AARAV88',
      referralLink: 'https://autoupi.io/r/AARAV88',
      totalEarnedUsd: 60.00,
      totalEarnedInr: 5000.00,
      successfulCount: 2,
      pendingCount: 1,
      referralBonusDescription: 'Give 100% free transfer fees, get ₹500 credited to bank custody reserve',
      friendBonusDescription: '100% free transfer fees on first remittance + ₹500 cashback',
      progressList: [
        {
          id: 'ref_1',
          friendName: 'Rohan Mehta',
          friendEmailOrPhoneMasked: 'rohan.m••••@gmail.com',
          status: 'REWARD_CREDITED',
          rewardAmount: '₹500 INR',
          date: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
        {
          id: 'ref_2',
          friendName: 'Ananya Deshmukh',
          friendEmailOrPhoneMasked: '+91 98••••4412',
          status: 'REWARD_CREDITED',
          rewardAmount: '₹500 INR',
          date: new Date(Date.now() - 8 * 86400000).toISOString(),
        },
        {
          id: 'ref_3',
          friendName: 'Kunal Singhania',
          friendEmailOrPhoneMasked: 'kunal.s••••@corp.in',
          status: 'QUALIFICATION_PENDING',
          rewardAmount: '₹500 Pending',
          date: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
      ],
    });
  }

  public getReferralData(userId: string = db.currentUser.id): ReferralData {
    let data = this.userReferralMap.get(userId);
    if (!data) {
      const code = `${userId.substring(0, 5).toUpperCase()}${Math.floor(10 + Math.random() * 90)}`;
      data = {
        referralCode: code,
        referralLink: `https://autoupi.io/r/${code}`,
        totalEarnedUsd: 0,
        totalEarnedInr: 0,
        successfulCount: 0,
        pendingCount: 0,
        referralBonusDescription: 'Give 100% free fees, get ₹500 credited to bank custody',
        friendBonusDescription: '100% free fees on first transfer + ₹500 cashback',
        progressList: [],
      };
      this.userReferralMap.set(userId, data);
    }
    return data;
  }

  /**
   * Qualifies a referral with strict server-side anti-fraud checks
   */
  public qualifyReferral(params: {
    referrerCode: string;
    friendUserId: string;
    friendName: string;
    friendPhoneMasked: string;
    transferAmountUsd: number;
    transactionId: string;
  }): { success: boolean; rewardAmount: string; message: string } {
    // 1. Anti-fraud: Anti-self referral check
    const referrerId = db.currentUser.id; // In multi-user, looked up by code
    if (params.friendUserId === referrerId) {
      throw new Error('Self-referrals are strictly prohibited under compliance guidelines.');
    }

    // 2. Minimum transfer qualification check ($100 USD min)
    if (params.transferAmountUsd < 100) {
      throw new Error('Minimum cross-border transfer volume of $100 USD required for referral qualification.');
    }

    const data = this.getReferralData(referrerId);

    // 3. Duplicate claim prevention
    const existing = data.progressList.find((p) => p.friendName.toLowerCase() === params.friendName.toLowerCase());
    if (existing && existing.status === 'REWARD_CREDITED') {
      throw new Error('Referral reward already credited for this user account.');
    }

    // Award dual ₹500 INR credit
    data.totalEarnedInr += 500;
    data.totalEarnedUsd += 6.00;
    data.successfulCount += 1;

    const newItem: ReferralProgressItem = {
      id: `ref_${Date.now()}`,
      friendName: params.friendName,
      friendEmailOrPhoneMasked: params.friendPhoneMasked,
      status: 'REWARD_CREDITED',
      rewardAmount: '₹500 INR',
      date: new Date().toISOString(),
    };

    data.progressList.unshift(newItem);

    // Credit referrer primary bank balance
    const primaryBank = db.bankAccounts[0];
    if (primaryBank) {
      primaryBank.balance += 6.00;
    }

    auditLogger.logEvent({
      action: 'REFERRAL_QUALIFIED',
      userId: referrerId,
      details: {
        friendUserId: params.friendUserId,
        friendName: params.friendName,
        transactionId: params.transactionId,
        rewardAmount: '₹500 INR ($6.00 USD)',
      },
    });

    return {
      success: true,
      rewardAmount: '₹500 INR',
      message: 'Referral reward successfully verified and credited to bank custody reserve.',
    };
  }
}

export const referralService = new ReferralService();
