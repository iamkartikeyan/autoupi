'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  BankAccount,
  Beneficiary,
  PaymentTransaction,
  OfferOrReward,
  FXQuote,
  SupportedCurrency,
  SettlementTimelineStep,
  PaymentStatus,
  ReferralData,
  NotificationItem,
  EducationalArticle,
} from '@auto-upi/shared';
import apiClient from '../lib/api';
import { getSocket } from '../lib/socket';
import { useToast } from './ToastContext';

interface PaymentContextType {
  bankAccounts: BankAccount[];
  beneficiaries: Beneficiary[];
  transactions: PaymentTransaction[];
  offers: OfferOrReward[];
  referralData: ReferralData;
  notifications: NotificationItem[];
  unreadNotificationsCount: number;
  educationalArticles: EducationalArticle[];
  activeTransaction: PaymentTransaction | null;
  isSettling: boolean;
  getFXQuote: (sourceCurrency: SupportedCurrency, targetCurrency: SupportedCurrency, amount: number) => Promise<FXQuote>;
  initiatePayment: (payload: {
    beneficiaryId: string;
    senderBankAccountId: string;
    sourceCurrency: SupportedCurrency;
    sourceAmount: number;
    targetCurrency: SupportedCurrency;
    note?: string;
    purpose?: any;
  }) => Promise<{ transaction: PaymentTransaction; otpRequired: boolean; demoOtpCode?: string }>;
  confirmPaymentWithOtp: (transactionId: string, otpCode: string) => Promise<PaymentTransaction>;
  addBeneficiary: (beneficiaryData: any) => Promise<Beneficiary>;
  updateBeneficiary: (id: string, beneficiaryData: any) => Promise<Beneficiary>;
  deleteBeneficiary: (id: string) => Promise<void>;
  claimOffer: (offerId: string) => Promise<void>;
  claimReward: (rewardId: string) => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  receivePaymentToQr: (amount: number, senderName?: string, senderUpi?: string) => Promise<PaymentTransaction>;
  setActiveTransaction: (tx: PaymentTransaction | null) => void;
  refreshData: () => Promise<void>;
}

// Initial fallback mock bank accounts
const INITIAL_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'acc_chase_usd_01',
    userId: 'usr_auto_889210',
    bankName: 'JPMorgan Chase Bank',
    accountNumberMasked: '•••• 4829',
    routingOrIfsc: '021000021',
    accountType: 'CHECKING',
    currency: 'USD',
    balance: 14850.50,
    isPrimary: true,
    isReserveBacked: true,
    status: 'ACTIVE',
  },
  {
    id: 'acc_hdfc_inr_02',
    userId: 'usr_auto_889210',
    bankName: 'HDFC Bank India',
    accountNumberMasked: '•••• 7712',
    routingOrIfsc: 'HDFC0000128',
    accountType: 'SAVINGS',
    currency: 'INR',
    balance: 482500.00,
    isPrimary: false,
    isReserveBacked: true,
    status: 'ACTIVE',
  },
  {
    id: 'acc_deutsche_eur_03',
    userId: 'usr_auto_889210',
    bankName: 'Deutsche Bank Custody',
    accountNumberMasked: '•••• 9104',
    routingOrIfsc: 'DEUTDEFFXXX',
    accountType: 'RESERVE_CUSTODY',
    currency: 'EUR',
    balance: 8400.00,
    isPrimary: false,
    isReserveBacked: true,
    status: 'ACTIVE',
  }
];

// Initial fallback beneficiaries
const INITIAL_BENEFICIARIES: Beneficiary[] = [
  {
    id: 'ben_priya_in',
    userId: 'usr_auto_889210',
    name: 'Priya Sharma',
    upiIdOrHandle: 'priya.sharma@okaxis',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    initials: 'PS',
    country: 'India',
    countryCode: 'IN',
    flagEmoji: '🇮🇳',
    currency: 'INR',
    bankName: 'State Bank of India',
    accountNumberMasked: '•••• 3819',
    routingIdentifier: 'SBIN0004829',
    verificationState: 'VERIFIED',
    isFavorite: true,
    lastTransferDate: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'ben_alex_gb',
    userId: 'usr_auto_889210',
    name: 'Alex Johnson',
    upiIdOrHandle: 'alex.j@payuk',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    initials: 'AJ',
    country: 'United Kingdom',
    countryCode: 'GB',
    flagEmoji: '🇬🇧',
    currency: 'GBP',
    bankName: 'Barclays Bank',
    accountNumberMasked: '•••• 8820',
    routingIdentifier: '20-04-15',
    verificationState: 'VERIFIED',
    isFavorite: true,
    lastTransferDate: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'ben_wei_sg',
    userId: 'usr_auto_889210',
    name: 'Wei Chen',
    upiIdOrHandle: 'wei.chen@paynow',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    initials: 'WC',
    country: 'Singapore',
    countryCode: 'SG',
    flagEmoji: '🇸🇬',
    currency: 'SGD',
    bankName: 'DBS Bank Singapore',
    accountNumberMasked: '•••• 6621',
    routingIdentifier: 'DBSSSGSG',
    verificationState: 'VERIFIED',
    isFavorite: true,
    lastTransferDate: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'ben_mateo_eu',
    userId: 'usr_auto_889210',
    name: 'Mateo Silva',
    upiIdOrHandle: 'mateo.s@sepa',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    initials: 'MS',
    country: 'Germany',
    countryCode: 'DE',
    flagEmoji: '🇪🇺',
    currency: 'EUR',
    bankName: 'BNP Paribas',
    accountNumberMasked: '•••• 1044',
    routingIdentifier: 'DEUTDEFFXXX',
    verificationState: 'VERIFIED',
    isFavorite: false,
  },
  {
    id: 'ben_kenji_jp',
    userId: 'usr_auto_889210',
    name: 'Kenji Sato',
    upiIdOrHandle: 'kenji.sato@zengin',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    initials: 'KS',
    country: 'Japan',
    countryCode: 'JP',
    flagEmoji: '🇯🇵',
    currency: 'JPY',
    bankName: 'MUFG Bank Tokyo',
    accountNumberMasked: '•••• 5529',
    routingIdentifier: 'BOTKJPJTXXX',
    verificationState: 'VERIFIED',
    isFavorite: false,
  }
];

// Rich Type A & Type B Offers
const INITIAL_OFFERS: OfferOrReward[] = [
  {
    id: 'off_feat_01',
    type: 'CASHBACK',
    merchantName: 'Auto-UPI Direct',
    title: 'Zero-Fee Transfer Milestone',
    headline: '100% FX Fee Rebate',
    description: 'Get 100% network settlement fee rebate on your next corridor transfer above $150 USD equivalent.',
    amountOrPercent: '$15.00 USD Rebate',
    minTransaction: 150,
    maxReward: 25,
    currency: 'USD',
    eligibility: 'All verified Tier 1 & Tier 2 users across INR, GBP, SGD corridors.',
    redemptionInstructions: [
      'Tap Activate & Send to open the payment screen.',
      'Enter an amount equal to or greater than $150 USD.',
      'Zero fee voucher is automatically deducted at confirmation.'
    ],
    termsAndConditions: [
      'Valid once per user account.',
      'Applied instantly to bank escrow deduction.',
      'Cannot be combined with external merchant promo codes.'
    ],
    isFeatured: true,
    expiresAt: new Date(Date.now() + 15 * 86400000).toISOString(),
    isUnlocked: true,
    isClaimed: false,
    code: 'ZEROXB2026',
    bgGradient: 'from-blue-600/30 to-indigo-600/30 border-blue-500/40',
    ctaText: 'Activate & Send',
    ctaAction: 'PAY'
  },
  {
    id: 'rew_scratch_02',
    type: 'SCRATCH_CARD',
    merchantName: 'Auto-UPI Vaults',
    title: 'Global Corridors Mystery Reward',
    headline: 'Cashback Scratch Card',
    description: 'Tap to scratch & unlock guaranteed cash yield credited straight to your bank custody.',
    amountOrPercent: 'Up to ₹1,500 INR',
    minTransaction: 50,
    isFeatured: false,
    expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    isUnlocked: false,
    isClaimed: false,
    bgGradient: 'from-violet-600/30 to-fuchsia-600/30 border-violet-500/40',
    ctaText: 'Scratch to Reveal',
    ctaAction: 'CLAIM'
  },
  {
    id: 'off_sg_boost_03',
    type: 'FX_DISCOUNT',
    merchantName: 'Singapore PayNow Rail',
    title: 'SG PayNow Corridor Boost',
    headline: '+0.45% Better FX Rate',
    description: 'Get +0.45% above interbank mid-market rate on USD to SGD cross-border conversion.',
    amountOrPercent: '+0.45% FX Boost',
    minTransaction: 100,
    isFeatured: false,
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    isUnlocked: true,
    isClaimed: false,
    code: 'SGBOOST',
    bgGradient: 'from-emerald-600/30 to-teal-600/30 border-emerald-500/40',
    ctaText: 'Apply SG Boost',
    ctaAction: 'PAY'
  },
  {
    id: 'off_eur_04',
    type: 'VOUCHER',
    merchantName: 'Eurozone SEPA Rail',
    title: 'Eurozone Settlement Rebate',
    headline: '€10.00 Transfer Credit',
    description: 'Instant €10.00 settlement discount when remitting to German or French IBANs.',
    amountOrPercent: '€10.00 EUR Credit',
    minTransaction: 120,
    isFeatured: false,
    expiresAt: new Date(Date.now() + 20 * 86400000).toISOString(),
    isUnlocked: true,
    isClaimed: false,
    code: 'EUR10VIP',
    bgGradient: 'from-amber-600/30 to-orange-600/30 border-amber-500/40',
    ctaText: 'Remit to Europe',
    ctaAction: 'PAY'
  }
];

const INITIAL_REFERRAL_DATA: ReferralData = {
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
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    type: 'PAYMENT',
    title: 'Remittance Credited Successfully',
    message: '₹29,225.00 INR has been deposited into Priya Sharma\'s SBI account via domestic UPI rail.',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    isRead: false,
    referenceId: 'tx_upi_992810',
  },
  {
    id: 'notif_2',
    type: 'REWARD',
    title: 'Cashback Credited to Bank Escrow',
    message: '₹500.00 referral bonus from Rohan Mehta\'s transfer credited to JPMorgan Chase custody vault.',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    isRead: false,
  },
  {
    id: 'notif_3',
    type: 'SECURITY',
    title: 'Tier 2 KYC Upgraded',
    message: 'Your institutional daily remittance limit is now active at $50,000.00 USD.',
    timestamp: new Date(Date.now() - 3600000 * 50).toISOString(),
    isRead: true,
  },
];

const INITIAL_EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'art_1',
    title: 'How Auto-UPI Settles in ~3.8 Seconds',
    shortDescription: 'From UPI PIN authorization to instant domestic clearing rail payout.',
    readTime: '2 min read',
    category: 'SETTLEMENT',
    badge: 'Instant Clearing',
    content: [
      'Traditional international wire transfers travel through multiple correspondent banks, taking 2 to 5 business days with hidden fees at each hop.',
      'Auto-UPI connects source bank liquidity corridors directly with destination domestic instant clearing networks (NPCI UPI, PayNow, FPS, and SEPA). The instant your transfer is authorized, destination domestic rails immediately disburse local currency to the recipient account.',
      'This eliminates intermediary delays and guarantees that recipient accounts are credited in seconds.'
    ],
  },
  {
    id: 'art_2',
    title: 'Partner Bank Security and Consumer Protection',
    shortDescription: 'Understanding the safety guarantees behind institutional banking rails.',
    readTime: '3 min read',
    category: 'RESERVES',
    badge: 'Security',
    content: [
      'Every payment is processed through regulated institutional banking channels at Tier-1 partner banks.',
      'If a destination domestic payment rail ever fails, our automated reconciliation engine immediately releases the reserved funds and restores your available balance within seconds.',
      'Full regulatory compliance and transparency reports are audited in real time.'
    ],
  },
  {
    id: 'art_3',
    title: 'Zero Hidden FX Spread Guarantee',
    shortDescription: 'How our 30-second rate lock protects your transfer from currency volatility.',
    readTime: '1 min read',
    category: 'FX_RATES',
    badge: 'Zero Slippage',
    content: [
      'When you request an exchange rate on Auto-UPI, we lock the authoritative interbank rate for a full 30-second window.',
      'Even if market volatility moves during your 2FA authentication, your recipient is guaranteed the exact quote amount calculated at initiation.',
      'No surprise deduction charges, no post-settlement slippage, and zero hidden exchange markups.'
    ],
  },
];

const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx_upi_992810',
    referenceNumber: 'UPI-XB-8921820',
    userId: 'usr_auto_889210',
    beneficiaryId: 'ben_priya_in',
    beneficiaryName: 'Priya Sharma',
    beneficiaryUpiId: 'priya.sharma@okaxis',
    beneficiaryCountry: 'India',
    beneficiaryFlag: '🇮🇳',
    senderBankAccountId: 'acc_chase_usd_01',
    senderBankName: 'JPMorgan Chase Bank',
    senderUpiId: 'aarav@autoupi',
    sourceCurrency: 'USD',
    sourceAmount: 350.00,
    targetCurrency: 'INR',
    targetAmount: 29225.00,
    exchangeRate: 83.50,
    fee: 1.50,
    feeCurrency: 'USD',
    status: 'RECIPIENT_CREDITED',
    purpose: 'FAMILY_SUPPORT',
    note: 'Birthday gift & family expenses',
    timeline: [
      {
        step: 'INITIATED',
        title: 'Payment Initiated',
        description: 'Payment authorized via 2FA OTP verification',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      },
      {
        step: 'FX_LOCKED',
        title: 'FX Rate Guaranteed',
        description: 'Locked 1 USD = 83.50 INR with zero spread slippage',
        timestamp: new Date(Date.now() - 3600000 * 24 + 1000).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      },
      {
        step: 'RESERVE_LOCKED',
        title: 'Bank Reserve Escrow Locked',
        description: 'USD 350.00 locked in JPMorgan Chase custody vault',
        timestamp: new Date(Date.now() - 3600000 * 24 + 2000).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      },
      {
        step: 'LOCAL_SETTLEMENT',
        title: 'Domestic Rail Dispatch',
        description: 'Dispatched to NPCI UPI 2.0 Domestic Clearing Rail',
        timestamp: new Date(Date.now() - 3600000 * 24 + 3200).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      },
      {
        step: 'RECIPIENT_CREDITED',
        title: 'Recipient Credited via UPI',
        description: '₹29,225.00 credited instantly to State Bank of India account',
        timestamp: new Date(Date.now() - 3600000 * 24 + 4800).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      }
    ],
    blockchainSettlement: {
      tokenSymbol: 'AUST',
      contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
      tokenAmount: '350.00 AUST',
      txHash: '0x3c91a8e104f2d7a984bc19d678e0293847f9810427acde84792bce9812401f82',
      blockNumber: 194829,
      network: 'Auto-UPI EVM Testnet (Chain 31337)',
      gasUsed: '42,108 Gas',
      settlementTimestamp: new Date(Date.now() - 3600000 * 24 + 4100).toISOString(),
      explorerUrl: 'https://testnet.auto-upi.io/tx/0x3c91a8e104f2d7a984bc19d678e0293847f9810427acde84792bce9812401f82'
    },
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 + 4800).toISOString(),
    settledAt: new Date(Date.now() - 3600000 * 24 + 4800).toISOString(),
  },
  {
    id: 'tx_upi_992811',
    referenceNumber: 'UPI-XB-8921821',
    userId: 'usr_auto_889210',
    beneficiaryId: 'ben_alex_gb',
    beneficiaryName: 'Alex Johnson',
    beneficiaryUpiId: 'alex.j@payuk',
    beneficiaryCountry: 'United Kingdom',
    beneficiaryFlag: '🇬🇧',
    senderBankAccountId: 'acc_chase_usd_01',
    senderBankName: 'JPMorgan Chase Bank',
    senderUpiId: 'aarav@autoupi',
    sourceCurrency: 'USD',
    sourceAmount: 600.00,
    targetCurrency: 'GBP',
    targetAmount: 472.80,
    exchangeRate: 0.788,
    fee: 2.00,
    feeCurrency: 'USD',
    status: 'RECIPIENT_CREDITED',
    purpose: 'SERVICES',
    note: 'UI Design consulting retainer',
    timeline: [
      {
        step: 'INITIATED',
        title: 'Payment Initiated',
        description: 'Payment authorized via biometric confirmation',
        timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      },
      {
        step: 'FX_LOCKED',
        title: 'FX Rate Guaranteed',
        description: 'Locked 1 USD = 0.788 GBP',
        timestamp: new Date(Date.now() - 3600000 * 72 + 1200).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      },
      {
        step: 'RESERVE_LOCKED',
        title: 'Bank Reserve Escrow Locked',
        description: 'USD 600.00 locked in JPMorgan Chase custody vault',
        timestamp: new Date(Date.now() - 3600000 * 72 + 2100).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      },
      {
        step: 'LOCAL_SETTLEMENT',
        title: 'Domestic Rail Dispatch',
        description: 'Dispatched to UK Faster Payments Clearing Rail',
        timestamp: new Date(Date.now() - 3600000 * 72 + 3400).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      },
      {
        step: 'RECIPIENT_CREDITED',
        title: 'Recipient Credited via UK Faster Payments',
        description: '£472.80 credited instantly to Barclays Bank account',
        timestamp: new Date(Date.now() - 3600000 * 72 + 5100).toISOString(),
        isCompleted: true,
        isCurrent: false,
        isFailed: false,
      }
    ],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 72 + 5100).toISOString(),
    settledAt: new Date(Date.now() - 3600000 * 72 + 5100).toISOString(),
  }
];

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children?: any }) => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(INITIAL_BANK_ACCOUNTS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [offers, setOffers] = useState<OfferOrReward[]>(INITIAL_OFFERS);
  const [referralData, setReferralData] = useState<ReferralData>(INITIAL_REFERRAL_DATA);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [educationalArticles] = useState<EducationalArticle[]>(INITIAL_EDUCATIONAL_ARTICLES);
  const [activeTransaction, setActiveTransaction] = useState<PaymentTransaction | null>(null);
  const [isSettling, setIsSettling] = useState<boolean>(false);
  const { showToast } = useToast();

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const refreshData = useCallback(async () => {
    try {
      const [accRes, benRes, txRes, offRes] = await Promise.allSettled([
        apiClient.get('/accounts'),
        apiClient.get('/beneficiaries'),
        apiClient.get('/payments/transactions'),
        apiClient.get('/payments/offers'),
      ]);

      if (accRes.status === 'fulfilled' && accRes.value.data?.accounts) {
        setBankAccounts(accRes.value.data.accounts);
      }
      if (benRes.status === 'fulfilled' && benRes.value.data?.beneficiaries) {
        setBeneficiaries(benRes.value.data.beneficiaries);
      }
      if (txRes.status === 'fulfilled' && txRes.value.data?.transactions) {
        setTransactions(txRes.value.data.transactions);
      }
      if (offRes.status === 'fulfilled' && offRes.value.data?.offers) {
        setOffers(offRes.value.data.offers);
      }
    } catch (err) {
      console.warn('Backend offline - using local store');
    }
  }, []);

  useEffect(() => {
    refreshData();

    // Socket.io event listeners for real-time settlement
    const socket = getSocket();
    if (socket) {
      const handleSettlementStep = (payload: { transactionId: string; step: SettlementTimelineStep; transaction: PaymentTransaction }) => {
        setTransactions((prev) =>
          prev.map((t) => (t.id === payload.transactionId ? payload.transaction : t))
        );
        setActiveTransaction((curr) => {
          if (curr && curr.id === payload.transactionId) {
            return payload.transaction;
          }
          return curr;
        });
      };

      const handleTransactionSettled = (settledTx: PaymentTransaction) => {
        setIsSettling(false);
        setTransactions((prev) =>
          prev.map((t) => (t.id === settledTx.id ? settledTx : t))
        );
        setActiveTransaction((curr) => (curr?.id === settledTx.id ? settledTx : curr));
        
        // Add new notification
        const newNotif: NotificationItem = {
          id: `notif_${Date.now()}`,
          type: 'PAYMENT',
          title: 'Remittance Credited',
          message: `${settledTx.targetCurrency} ${settledTx.targetAmount.toFixed(2)} sent to ${settledTx.beneficiaryName}`,
          timestamp: new Date().toISOString(),
          isRead: false,
          referenceId: settledTx.id,
        };
        setNotifications((prev) => [newNotif, ...prev]);
        showToast('Transfer Completed!', `${settledTx.targetCurrency} ${settledTx.targetAmount.toFixed(2)} sent to ${settledTx.beneficiaryName}`, 'success');
      };

      socket.on('settlement:step', handleSettlementStep);
      socket.on('transaction:settled', handleTransactionSettled);

      return () => {
        socket.off('settlement:step', handleSettlementStep);
        socket.off('transaction:settled', handleTransactionSettled);
      };
    }
  }, [refreshData, showToast]);

  const getFXQuote = async (
    sourceCurrency: SupportedCurrency,
    targetCurrency: SupportedCurrency,
    amount: number
  ): Promise<FXQuote> => {
    try {
      const res = await apiClient.get('/payments/quote', {
        params: { sourceCurrency, targetCurrency, sourceAmount: amount },
      });
      return res.data;
    } catch (err) {
      // Local high fidelity fallback calculator
      const rates: Record<string, number> = {
        'USD_INR': 83.50,
        'USD_GBP': 0.788,
        'USD_EUR': 0.920,
        'USD_SGD': 1.340,
        'USD_AED': 3.672,
        'USD_JPY': 154.20,
        'EUR_INR': 90.75,
        'EUR_SGD': 1.456,
        'GBP_INR': 105.80,
      };
      const key = `${sourceCurrency}_${targetCurrency}`;
      const rate = rates[key] || (sourceCurrency === targetCurrency ? 1.0 : 83.5);
      const networkSettlementFee = sourceCurrency === 'INR' ? 50 : 1.5;
      const netAmount = Math.max(0, amount - networkSettlementFee);
      const targetAmount = Number((netAmount * rate).toFixed(2));

      return {
        quoteId: `quo_local_${Date.now()}`,
        sourceCurrency,
        targetCurrency,
        sourceAmount: amount,
        targetAmount,
        exchangeRate: rate,
        inverseRate: Number((1 / rate).toFixed(4)),
        totalDebitAmount: amount + networkSettlementFee,
        estimatedSettlementTime: '~3.8s target',
        feeBreakdown: {
          networkSettlementFee,
          platformFee: 0,
          fxSpreadPercentage: 0.2,
          totalFees: networkSettlementFee,
          effectiveRate: rate,
          marketRate: rate * 1.002,
        },
        guaranteedUntil: new Date(Date.now() + 60000).toISOString(),
        expiresInSeconds: 60,
        createdAt: new Date().toISOString(),
      };
    }
  };

  const initiatePayment = async (payload: {
    beneficiaryId: string;
    senderBankAccountId: string;
    sourceCurrency: SupportedCurrency;
    sourceAmount: number;
    targetCurrency: SupportedCurrency;
    note?: string;
    purpose?: any;
  }) => {
    try {
      const res = await apiClient.post('/payments/initiate', payload);
      const createdTx = res.data.transaction;
      setActiveTransaction(createdTx);
      setTransactions((prev) => [createdTx, ...prev.filter((t) => t.id !== createdTx.id)]);
      return {
        transaction: createdTx,
        otpRequired: true,
        demoOtpCode: res.data.demoOtpCode || '123456',
      };
    } catch (err) {
      // Local fallback initiation
      const ben = beneficiaries.find((b) => b.id === payload.beneficiaryId) || beneficiaries[0];
      const bank = bankAccounts.find((b) => b.id === payload.senderBankAccountId) || bankAccounts[0];
      const quote = await getFXQuote(payload.sourceCurrency, payload.targetCurrency, payload.sourceAmount);

      const localTx: PaymentTransaction = {
        id: `tx_local_${Date.now()}`,
        referenceNumber: `UPI-XB-${Math.floor(1000000 + Math.random() * 9000000)}`,
        userId: 'usr_auto_889210',
        beneficiaryId: ben.id,
        beneficiaryName: ben.name,
        beneficiaryUpiId: ben.upiIdOrHandle,
        beneficiaryCountry: ben.country,
        beneficiaryFlag: ben.flagEmoji,
        senderBankAccountId: bank.id,
        senderBankName: bank.bankName,
        senderUpiId: 'aarav@autoupi',
        sourceCurrency: payload.sourceCurrency,
        sourceAmount: payload.sourceAmount,
        targetCurrency: payload.targetCurrency,
        targetAmount: quote.targetAmount,
        exchangeRate: quote.exchangeRate,
        fee: quote.feeBreakdown.totalFees,
        feeCurrency: payload.sourceCurrency,
        status: 'INITIATED',
        purpose: payload.purpose || 'FAMILY_SUPPORT',
        note: payload.note || 'Cross-border transfer',
        timeline: [
          {
            step: 'INITIATED',
            title: 'Payment Authorization Pending',
            description: 'Awaiting 2FA OTP verification to execute reserve lock and minting',
            timestamp: new Date().toISOString(),
            isCompleted: true,
            isCurrent: true,
            isFailed: false,
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setActiveTransaction(localTx);
      setTransactions((prev) => [localTx, ...prev]);
      return {
        transaction: localTx,
        otpRequired: true,
        demoOtpCode: '123456',
      };
    }
  };

  const confirmPaymentWithOtp = async (transactionId: string, otpCode: string): Promise<PaymentTransaction> => {
    setIsSettling(true);
    try {
      const res = await apiClient.post('/payments/confirm', { transactionId, otpCode });
      showToast('Payment Authorized', 'Live settlement initiated...', 'info');
      return res.data.transaction;
    } catch (err) {
      // Local fallback simulation with realistic timers
      const tx = transactions.find((t) => t.id === transactionId) || activeTransaction;
      if (!tx) throw new Error('Transaction not found');

      // Animate steps locally
      const runLocalSettlement = async () => {
        const steps: { step: PaymentStatus; title: string; desc: string; delay: number }[] = [
          { step: 'FX_LOCKED', title: 'FX Rate Guaranteed', desc: `Locked 1 ${tx.sourceCurrency} = ${tx.exchangeRate} ${tx.targetCurrency}`, delay: 600 },
          { step: 'RESERVE_LOCKED', title: 'Bank Funds Reserved', desc: `${tx.sourceCurrency} ${tx.sourceAmount} authorized in ${tx.senderBankName} account`, delay: 700 },
          { step: 'LOCAL_SETTLEMENT', title: 'Domestic Rail Dispatch', desc: `Dispatched to domestic clearing rail for ${tx.beneficiaryCountry}`, delay: 800 },
          { step: 'RECIPIENT_CREDITED', title: 'Recipient Credited', desc: `${tx.targetCurrency} ${tx.targetAmount} credited to ${tx.beneficiaryName}`, delay: 600 },
        ];

        for (const s of steps) {
          await new Promise((r) => setTimeout(r, s.delay));
          tx.status = s.step;
          tx.timeline.push({
            step: s.step,
            title: s.title,
            description: s.desc,
            timestamp: new Date().toISOString(),
            isCompleted: true,
            isCurrent: false,
            isFailed: false,
          });
          setActiveTransaction({ ...tx });
          setTransactions((prev) => prev.map((t) => (t.id === tx.id ? { ...tx } : t)));
        }

        setIsSettling(false);
        showToast('Transfer Completed!', `${tx.targetCurrency} ${tx.targetAmount} sent to ${tx.beneficiaryName}`, 'success');
      };

      runLocalSettlement();
      return tx;
    }
  };

  const addBeneficiary = async (beneficiaryData: any): Promise<Beneficiary> => {
    try {
      const res = await apiClient.post('/beneficiaries', beneficiaryData);
      const newBen = res.data.beneficiary;
      setBeneficiaries((prev) => [newBen, ...prev]);
      showToast('Beneficiary Added', `${newBen.name} added to quick contacts`, 'success');
      return newBen;
    } catch (err) {
      const initials = beneficiaryData.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

      const localBen: Beneficiary = {
        id: `ben_${Date.now()}`,
        userId: 'usr_auto_889210',
        name: beneficiaryData.name,
        upiIdOrHandle: beneficiaryData.upiIdOrHandle,
        initials,
        country: beneficiaryData.country,
        countryCode: beneficiaryData.countryCode || 'IN',
        flagEmoji: beneficiaryData.flagEmoji || '🇮🇳',
        currency: beneficiaryData.currency || 'INR',
        bankName: beneficiaryData.bankName || 'Bank of India',
        accountNumberMasked: `•••• ${Math.floor(1000 + Math.random() * 9000)}`,
        routingIdentifier: beneficiaryData.routingIdentifier || 'SBIN0004829',
        verificationState: 'VERIFIED',
        isFavorite: false,
      };

      setBeneficiaries((prev) => [localBen, ...prev]);
      showToast('Beneficiary Added', `${localBen.name} added to quick contacts`, 'success');
      return localBen;
    }
  };

  const updateBeneficiary = async (id: string, beneficiaryData: any): Promise<Beneficiary> => {
    try {
      const res = await apiClient.put(`/beneficiaries/${id}`, beneficiaryData);
      const updated = res.data.beneficiary;
      setBeneficiaries((prev) => prev.map((b) => (b.id === id ? updated : b)));
      showToast('Beneficiary Updated', `${updated.name} details updated`, 'success');
      return updated;
    } catch (err) {
      setBeneficiaries((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...beneficiaryData } : b))
      );
      showToast('Beneficiary Updated (Local)', 'Changes saved', 'success');
      return beneficiaryData;
    }
  };

  const deleteBeneficiary = async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/beneficiaries/${id}`);
      setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
      showToast('Beneficiary Removed', 'Contact deleted from list', 'info');
    } catch (err) {
      setBeneficiaries((prev) => prev.filter((b) => b.id !== id));
      showToast('Beneficiary Removed (Local)', 'Contact deleted', 'info');
    }
  };

  const claimOffer = async (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, isClaimed: true } : o))
    );
    showToast('Offer Activated', 'Discount will be auto-applied on your next remittance', 'success');
  };

  const claimReward = async (rewardId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === rewardId ? { ...o, isUnlocked: true } : o))
    );
    showToast('Mystery Reward Unlocked!', '+₹1,500 INR credited to bank custody', 'success');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    showToast('Notifications Marked Read', 'All alerts marked as read', 'info');
  };

  const receivePaymentToQr = async (amount: number, senderName?: string, senderUpi?: string): Promise<PaymentTransaction> => {
    const sName = senderName || 'Praveen Kumar';
    const sUpi = senderUpi || '9315896154@ptaxis';
    const refNum = `UPI-IN-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const incomingTx: PaymentTransaction = {
      id: `tx_in_${Date.now()}`,
      referenceNumber: refNum,
      userId: 'usr_auto_889210',
      beneficiaryId: 'usr_auto_889210',
      beneficiaryName: 'Kartik Kumar',
      beneficiaryUpiId: 'kk20140158570@oksbi',
      beneficiaryCountry: 'India',
      beneficiaryFlag: '🇮🇳',
      senderBankAccountId: 'acc_hdfc_inr_02',
      senderBankName: 'State Bank of India',
      senderUpiId: sUpi,
      sourceCurrency: 'INR',
      sourceAmount: amount,
      targetCurrency: 'INR',
      targetAmount: amount,
      exchangeRate: 1.0,
      fee: 0,
      feeCurrency: 'INR',
      status: 'COMPLETED',
      purpose: 'FAMILY_SUPPORT',
      note: `Received via UPI QR from ${sName}`,
      timeline: [
        {
          step: 'INITIATED',
          title: 'QR Code Scanned',
          description: `Payer scanned UPI QR at ${new Date().toLocaleTimeString()}`,
          timestamp: new Date().toISOString(),
          isCompleted: true,
          isCurrent: false,
          isFailed: false,
        },
        {
          step: 'LOCAL_SETTLEMENT',
          title: 'Instant Domestic Rail Payout',
          description: `Disbursed ₹${amount.toFixed(2)} via NPCI UPI 2.0 Instant Rail`,
          timestamp: new Date().toISOString(),
          isCompleted: true,
          isCurrent: false,
          isFailed: false,
        },
        {
          step: 'RECIPIENT_CREDITED',
          title: 'Credited to Bank Account',
          description: `₹${amount.toFixed(2)} deposited into State Bank of India ••••6492`,
          timestamp: new Date().toISOString(),
          isCompleted: true,
          isCurrent: false,
          isFailed: false,
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settledAt: new Date().toISOString(),
    };

    // 1. Credit bank account balance
    setBankAccounts((prev) =>
      prev.map((acc) =>
        acc.isPrimary || acc.currency === 'INR'
          ? { ...acc, balance: acc.balance + amount }
          : acc
      )
    );

    // 2. Add to transaction list
    setTransactions((prev) => [incomingTx, ...prev]);

    // 3. Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      type: 'PAYMENT',
      title: 'Payment Received!',
      message: `₹${amount.toFixed(2)} received from ${sName} on State Bank of India (••••6492)`,
      timestamp: new Date().toISOString(),
      isRead: false,
      referenceId: incomingTx.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 4. Toast celebration
    showToast('Payment Received!', `₹${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} received from ${sName}`, 'success');

    return incomingTx;
  };

  return (
    <PaymentContext.Provider
      value={{
        bankAccounts,
        beneficiaries,
        transactions,
        offers,
        referralData,
        notifications,
        unreadNotificationsCount,
        educationalArticles,
        activeTransaction,
        isSettling,
        getFXQuote,
        initiatePayment,
        confirmPaymentWithOtp,
        addBeneficiary,
        updateBeneficiary,
        deleteBeneficiary,
        claimOffer,
        claimReward,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        receivePaymentToQr,
        setActiveTransaction,
        refreshData,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
