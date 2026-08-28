export type SupportedCurrency = 'USD' | 'EUR' | 'INR' | 'SGD' | 'GBP' | 'AED' | 'JPY';

export type UserRole = 'USER' | 'ADMIN';

export type KYCStatus = 'NOT_STARTED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NEEDS_REVIEW' | 'TIER_1_VERIFIED' | 'TIER_2_VERIFIED';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  upiId: string;
  avatarUrl?: string;
  role: UserRole;
  kycStatus: KYCStatus;
  kycTier: number; // 0, 1, 2
  dailyLimitUsd: number;
  remainingDailyLimitUsd: number;
  country: string;
  defaultCurrency: SupportedCurrency;
  createdAt: string;
}

export interface KYCSubmissionPayload {
  fullName: string;
  dob: string;
  nationality: string;
  documentType: 'PASSPORT' | 'NATIONAL_ID' | 'DRIVERS_LICENSE';
  documentNumberMasked: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  country: string;
  remittancePurpose: 'FAMILY_SUPPORT' | 'BUSINESS' | 'SERVICES' | 'EDUCATION' | 'TRAVEL';
}

export interface BankLedgerEntry {
  id: string;
  accountId: string;
  userId: string;
  type: 'DEBIT_RESERVE' | 'RELEASE_RESERVE' | 'SETTLEMENT_DEBIT' | 'REFUND' | 'RECIPIENT_CREDIT' | 'DEPOSIT';
  amount: number;
  currency: SupportedCurrency;
  availableBalanceAfter: number;
  reservedBalanceAfter: number;
  referenceId: string;
  description: string;
  timestamp: string;
}

export interface BankAccount {
  id: string;
  userId: string;
  bankName: string;
  accountNumberMasked: string; // e.g. "•••• 4829"
  routingOrIfsc: string;
  accountType: 'CHECKING' | 'SAVINGS' | 'RESERVE_CUSTODY';
  currency: SupportedCurrency;
  balance: number;
  isPrimary: boolean;
  isReserveBacked: boolean;
  status: 'ACTIVE' | 'FROZEN' | 'REQUIRES_REAUTH';
}

export interface Beneficiary {
  id: string;
  userId: string;
  name: string;
  upiIdOrHandle: string;
  avatarUrl?: string;
  initials: string;
  country: string;
  countryCode: string; // e.g. "IN", "SG", "GB", "EU", "US"
  flagEmoji: string;
  currency: SupportedCurrency;
  bankName: string;
  accountNumberMasked: string;
  routingIdentifier: string; // IFSC / Sort Code / SWIFT / Routing No / PayNow Proxy
  phoneOrEmail?: string;
  verificationState: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  isFavorite: boolean;
  lastTransferDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FeeConfiguration {
  platformFeePercentage: number;
  fixedFee: number;
  fxSpreadPercentage: number;
  minimumFee: number;
  corridorFees: Record<string, { fixedFee: number; platformFeePercentage: number }>;
}

export interface FXFeeBreakdown {
  networkSettlementFee: number; // in source currency
  platformFee: number;
  fxSpreadPercentage: number;
  totalFees: number;
  effectiveRate: number;
  marketRate: number;
}

export interface FXQuote {
  quoteId: string;
  sourceCurrency: SupportedCurrency;
  targetCurrency: SupportedCurrency;
  sourceAmount: number;
  targetAmount: number;
  totalDebitAmount: number; // sourceAmount + totalFees
  exchangeRate: number; // 1 source = X target
  inverseRate: number;
  feeBreakdown: FXFeeBreakdown;
  guaranteedUntil: string;
  expiresInSeconds: number;
  estimatedSettlementTime: string; // e.g. "~60 sec target"
  isExpired?: boolean;
  createdAt: string;
}

export type PaymentStatus = 
  | 'CREATED'
  | 'AUTHENTICATING'
  | 'KYC_CHECK'
  | 'AML_CHECK'
  | 'BANK_AUTHORIZED'
  | 'RESERVE_LOCKED'
  | 'TOKEN_MINTING'
  | 'TOKEN_MINTED'
  | 'BLOCKCHAIN_SETTLEMENT'
  | 'FX_LOCKED'
  | 'FX_CONVERTED'
  | 'LOCAL_SETTLEMENT'
  | 'RECIPIENT_CREDITED'
  | 'COMPLETED'
  // Failure / Review States
  | 'KYC_FAILED'
  | 'AML_REVIEW'
  | 'BANK_DECLINED'
  | 'RESERVE_FAILED'
  | 'TOKEN_MINT_FAILED'
  | 'BLOCKCHAIN_FAILED'
  | 'FX_EXPIRED'
  | 'PAYOUT_FAILED'
  | 'REFUND_PENDING'
  | 'REFUNDED'
  | 'CANCELLED'
  // Legacy / UI Aliases
  | 'INITIATED'
  | 'BLOCKCHAIN_SETTLED'
  | 'FAILED';

export interface TokenLedgerEntry {
  id: string;
  transactionId: string;
  type: 'MINT' | 'TRANSFER' | 'SETTLE' | 'REDEEM_BURN';
  tokenSymbol: 'TBD' | 'AUST';
  amount: number;
  fromAddress: string;
  toAddress: string;
  backingReserveReference: string;
  txHash?: string;
  blockNumber?: number;
  timestamp: string;
}

export interface TokenSupplySummary {
  tokenSymbol: 'TBD' | 'AUST';
  totalMinted: number;
  totalTransferred: number;
  totalRedeemed: number;
  outstandingSupply: number;
  backingReserveTotalUsd: number;
  backingRatio: number; // 1.0 = 100%
  lastUpdated: string;
}

export type ReconciliationStatus = 'MATCHED' | 'MISMATCH' | 'PENDING_REVIEW';

export interface PaymentReconciliationReport {
  status: ReconciliationStatus;
  checkedAt: string;
  bankReserveMatch: boolean;
  tokenBackingMatch: boolean;
  blockchainConfirmed: boolean;
  fxRateMatch: boolean;
  payoutCreditedMatch: boolean;
  varianceAmount: number;
  auditNotes: string;
}

export interface SettlementTimelineStep {
  step: PaymentStatus;
  title: string;
  description: string;
  timestamp?: string;
  isCompleted: boolean;
  isCurrent: boolean;
  isFailed: boolean;
  txHash?: string;
  metadata?: Record<string, any>;
}

export interface BlockchainSettlementInfo {
  tokenSymbol: string; // e.g. "TBD" / "AUST"
  contractAddress: string;
  tokenAmount: string;
  txHash: string;
  blockNumber: number;
  network: string; // e.g. "Auto-UPI EVM Testnet (Chain 31337)"
  gasUsed: string;
  settlementTimestamp: string;
  explorerUrl?: string;
}

export interface PaymentTransaction {
  id: string;
  referenceNumber: string; // e.g. "UPI-XB-8921820"
  userId: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryUpiId: string;
  beneficiaryCountry: string;
  beneficiaryFlag: string;
  senderBankAccountId: string;
  senderBankName: string;
  senderUpiId: string;
  
  sourceCurrency: SupportedCurrency;
  sourceAmount: number;
  targetCurrency: SupportedCurrency;
  targetAmount: number;
  exchangeRate: number;
  
  fee: number;
  feeCurrency: SupportedCurrency;
  
  status: PaymentStatus;
  note?: string;
  purpose: 'FAMILY_SUPPORT' | 'BUSINESS' | 'SERVICES' | 'TRAVEL' | 'EDUCATION';
  
  timeline: SettlementTimelineStep[];
  blockchainSettlement?: BlockchainSettlementInfo;
  
  reserveLockId?: string;
  failureReason?: string;
  refundTxId?: string;
  reconciliation?: PaymentReconciliationReport;
  
  createdAt: string;
  updatedAt: string;
  settledAt?: string;
}

export interface OfferOrReward {
  id: string;
  type: 'CASHBACK' | 'FX_DISCOUNT' | 'SCRATCH_CARD' | 'VOUCHER';
  merchantName?: string;
  merchantLogo?: string;
  title: string;
  headline?: string;
  description: string;
  amountOrPercent: string;
  minTransaction?: number;
  maxReward?: number;
  currency?: SupportedCurrency;
  eligibility?: string;
  redemptionInstructions?: string[];
  termsAndConditions?: string[];
  isFeatured?: boolean;
  expiresAt: string;
  isUnlocked: boolean;
  isClaimed?: boolean;
  code?: string;
  bgGradient: string;
  ctaText?: string;
  ctaAction?: 'PAY' | 'ACTIVATE' | 'CLAIM' | 'SHOP';
}

export type RewardStatus = 'NEW' | 'PENDING' | 'EARNED' | 'REDEEMED' | 'EXPIRED' | 'FAILED';

export interface RewardItem {
  id: string;
  merchantName: string;
  title: string;
  rewardAmountDisplay: string;
  rewardAmountNumeric: number;
  currency: SupportedCurrency;
  status: RewardStatus;
  earnedDate: string;
  expiresDate?: string;
  scratchPattern?: 'STARS' | 'COINS' | 'GEOMETRIC' | 'CONFETTI';
  isScratched: boolean;
  description: string;
}

export type ReferralStatus = 
  | 'INVITATION_SENT' 
  | 'FRIEND_JOINED' 
  | 'QUALIFICATION_PENDING' 
  | 'REWARD_PENDING'
  | 'REWARD_CREDITED' 
  | 'REFERRAL_EXPIRED';

export interface ReferralProgressItem {
  id: string;
  friendName: string;
  friendEmailOrPhoneMasked: string;
  status: ReferralStatus;
  rewardAmount: string;
  date: string;
}

export interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalEarnedUsd: number;
  totalEarnedInr: number;
  successfulCount: number;
  pendingCount: number;
  referralBonusDescription: string;
  friendBonusDescription: string;
  progressList: ReferralProgressItem[];
}

export interface NotificationItem {
  id: string;
  type: 'PAYMENT' | 'REWARD' | 'OFFER' | 'SECURITY' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  referenceId?: string;
}

export interface EducationalArticle {
  id: string;
  title: string;
  shortDescription: string;
  readTime: string;
  category: 'SETTLEMENT' | 'SECURITY' | 'FX_RATES' | 'RESERVES';
  badge: string;
  content: string[];
}

export interface AdminSystemMetrics {
  totalSettledVolumeUsd: number;
  totalTransactionsCount: number;
  activeReserveLiquidityUsd: number;
  mintedTokenSupplyAust: number;
  averageSettlementTimeSeconds: number;
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'MAINTENANCE';
  recentSettlementEvents: {
    id: string;
    timestamp: string;
    type: 'MINT' | 'BURN' | 'RESERVE_LOCK' | 'DISPATCH';
    amountAust: number;
    corridor: string;
    status: 'CONFIRMED' | 'PENDING';
    txHash: string;
  }[];
  corridorVolumes: {
    corridor: string;
    volumeUsd: number;
    percentage: number;
  }[];
}
