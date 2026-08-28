import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { UserProfile, PaymentTransaction, SupportedCurrency } from '@auto-upi/shared';

export default function App() {
  const [activeTab, setActiveTab] = useState<'HOME' | 'MONEY' | 'PAY' | 'ACTIVITY' | 'YOU'>('HOME');
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Send Form State
  const [sendAmount, setSendAmount] = useState('100');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState({
    name: 'Priya Sharma',
    upiId: 'priya@okaxis',
    flag: '🇮🇳',
    country: 'India',
    currency: 'INR',
    rate: 83.50,
  });
  const [otpValue, setOtpValue] = useState('');
  const [settlementStep, setSettlementStep] = useState(0);

  const user: UserProfile = {
    id: 'usr_auto_889210',
    name: 'Aarav Patel',
    email: 'aarav.patel@example.com',
    phone: '+1 (555) 234-8901',
    upiId: 'aarav@autoupi',
    role: 'USER',
    kycStatus: 'TIER_2_VERIFIED',
    kycTier: 2,
    dailyLimitUsd: 25000,
    remainingDailyLimitUsd: 21850,
    country: 'United States',
    defaultCurrency: 'USD',
    createdAt: new Date().toISOString(),
  };

  const beneficiaries = [
    { name: 'Priya Sharma', handle: 'priya@okaxis', flag: '🇮🇳', country: 'India', currency: 'INR', rate: 83.50 },
    { name: 'Alex Johnson', handle: 'alex@barclays', flag: '🇬🇧', country: 'UK', currency: 'GBP', rate: 0.788 },
    { name: 'Wei Chen', handle: 'wei@dbs', flag: '🇸🇬', country: 'Singapore', currency: 'SGD', rate: 1.340 },
    { name: 'Mateo Silva', handle: 'mateo@bnp', flag: '🇪🇺', country: 'Germany', currency: 'EUR', rate: 0.920 },
  ];

  const recentTransactions = [
    { id: '1', ref: 'UPI-XB-8921820', name: 'Priya Sharma', flag: '🇮🇳', amount: '$350.00', inr: '₹29,225', status: 'Completed' },
    { id: '2', ref: 'UPI-XB-8921821', name: 'Alex Johnson', flag: '🇬🇧', amount: '$120.00', inr: '£94.56', status: 'Completed' },
    { id: '3', ref: 'UPI-XB-8921822', name: 'Wei Chen', flag: '🇸🇬', amount: '$50.00', inr: 'S$67.00', status: 'Completed' },
  ];

  const parsedAmount = parseFloat(sendAmount) || 0;
  const targetCalculated = (parsedAmount * selectedBeneficiary.rate).toFixed(2);

  const startPaymentFlow = () => {
    setIsSendModalOpen(false);
    setIsOtpOpen(true);
  };

  const verifyOtpAndSettle = () => {
    setIsOtpOpen(false);
    setIsTimelineOpen(true);
    setSettlementStep(1);

    // Simulate fast sequential settlement stages
    setTimeout(() => setSettlementStep(2), 700);
    setTimeout(() => setSettlementStep(3), 1400);
    setTimeout(() => setSettlementStep(4), 2100);
    setTimeout(() => setSettlementStep(5), 2800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Main Content Area */}
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* Top Header Profile & Search */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AP</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.userName}>{user.name}</Text>
            </View>
          </View>
          <View style={styles.badgePill}>
            <Text style={styles.badgePillText}>⚡ Chain 31337</Text>
          </View>
        </View>

        {/* Search Field */}
        <View style={styles.searchBar}>
          <Text style={styles.searchPlaceholder}>🔍 Pay by name, UPI ID, or phone</Text>
        </View>

        {/* Hero Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>AVAILABLE CHECKING BALANCE</Text>
            <Text style={styles.bankName}>Chase Bank • 8492</Text>
          </View>
          <Text style={styles.balanceAmount}>$14,850.50 USD</Text>
          <View style={styles.balanceFooter}>
            <Text style={styles.balanceUpi}>aarav@autoupi</Text>
            <Text style={styles.tierPill}>Tier 2 Verified ✓</Text>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.actionTile}
            onPress={() => setIsSendModalOpen(true)}
          >
            <Text style={styles.actionIcon}>🌍</Text>
            <Text style={styles.actionTitle}>International</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionTile} onPress={() => setIsSendModalOpen(true)}>
            <Text style={styles.actionIcon}>📱</Text>
            <Text style={styles.actionTitle}>Scan / Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionTile}>
            <Text style={styles.actionIcon}>🏦</Text>
            <Text style={styles.actionTitle}>Bank Transfer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionTile}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionTitle}>Track Transfer</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Beneficiaries Carousel */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>People & Recipients</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>Explore</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.peopleCarousel}>
            {beneficiaries.map((b, i) => (
              <TouchableOpacity
                key={i}
                style={styles.personItem}
                onPress={() => {
                  setSelectedBeneficiary(b);
                  setIsSendModalOpen(true);
                }}
              >
                <View style={styles.personAvatar}>
                  <Text style={styles.personFlag}>{b.flag}</Text>
                </View>
                <Text style={styles.personName} numberOfLines={1}>{b.name}</Text>
                <Text style={styles.personCurrency}>{b.currency}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Cross-Border Banner CTA */}
        <TouchableOpacity style={styles.promoBanner} onPress={() => setIsSendModalOpen(true)}>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Send Money to India (UPI)</Text>
            <Text style={styles.promoSubtitle}>Zero platform fee • 1 USD = ₹83.50 • ~3.8s settlement</Text>
          </View>
          <Text style={styles.promoArrow}>→</Text>
        </TouchableOpacity>

        {/* Recent Activity List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity><Text style={styles.seeAllText}>View All</Text></TouchableOpacity>
          </View>

          {recentTransactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={styles.txRow}
              onPress={() => setIsReceiptOpen(true)}
            >
              <View style={styles.txLeft}>
                <Text style={styles.txFlag}>{tx.flag}</Text>
                <View>
                  <Text style={styles.txName}>{tx.name}</Text>
                  <Text style={styles.txRef}>{tx.ref}</Text>
                </View>
              </View>
              <View style={styles.txRight}>
                <Text style={styles.txAmount}>{tx.amount}</Text>
                <Text style={styles.txTarget}>{tx.inr}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Rewards & Offers Card */}
        <View style={styles.rewardsCard}>
          <Text style={styles.rewardsEmoji}>🎁</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.rewardsTitle}>$10 Remittance Cashback</Text>
            <Text style={styles.rewardsSubtitle}>Unlocked on your next international transfer</Text>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { key: 'HOME', label: 'Home', icon: '🏠' },
          { key: 'MONEY', label: 'Money', icon: '💳' },
          { key: 'PAY', label: 'Pay', icon: '⚡' },
          { key: 'ACTIVITY', label: 'Activity', icon: '📜' },
          { key: 'YOU', label: 'You', icon: '👤' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navItem}
            onPress={() => {
              if (tab.key === 'PAY') setIsSendModalOpen(true);
              else setActiveTab(tab.key as any);
            }}
          >
            <Text style={[styles.navIcon, activeTab === tab.key && styles.navIconActive]}>{tab.icon}</Text>
            <Text style={[styles.navLabel, activeTab === tab.key && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 1. SEND INTERNATIONAL MONEY MODAL */}
      <Modal visible={isSendModalOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Money Internationally</Text>
              <TouchableOpacity onPress={() => setIsSendModalOpen(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Recipient Selector Card */}
            <View style={styles.recipientCard}>
              <Text style={styles.recipientFlag}>{selectedBeneficiary.flag}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.recipientName}>{selectedBeneficiary.name}</Text>
                <Text style={styles.recipientHandle}>{selectedBeneficiary.upiId}</Text>
              </View>
            </View>

            {/* Amount Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>ENTER SEND AMOUNT (USD)</Text>
              <TextInput
                style={styles.amountInput}
                keyboardType="numeric"
                value={sendAmount}
                onChangeText={setSendAmount}
                placeholder="100"
                placeholderTextColor="#6B7280"
              />
            </View>

            {/* Live FX Calculation Card */}
            <View style={styles.quoteCard}>
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Exchange Rate (30s Lock):</Text>
                <Text style={styles.quoteValue}>1 USD = {selectedBeneficiary.rate} {selectedBeneficiary.currency}</Text>
              </View>
              <View style={styles.quoteRow}>
                <Text style={styles.quoteLabel}>Platform Fee (0.0%):</Text>
                <Text style={styles.quoteValue}>$0.00 USD</Text>
              </View>
              <View style={[styles.quoteRow, { borderTopWidth: 1, borderColor: '#30363D', paddingTop: 8, marginTop: 4 }]}>
                <Text style={styles.recipientGetsLabel}>Recipient Gets Instantly:</Text>
                <Text style={styles.recipientGetsValue}>{selectedBeneficiary.currency} {targetCalculated}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={startPaymentFlow}>
              <Text style={styles.primaryButtonText}>Continue to 2FA PIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 2. 2FA OTP MODAL */}
      <Modal visible={isOtpOpen} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Auto-UPI 2FA PIN</Text>
            <Text style={styles.otpSubtitle}>Enter your 6-digit payment PIN or biometric demo code (123456)</Text>

            <TextInput
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={6}
              value={otpValue}
              onChangeText={setOtpValue}
              placeholder="1 2 3 4 5 6"
              placeholderTextColor="#6B7280"
            />

            <TouchableOpacity style={styles.primaryButton} onPress={verifyOtpAndSettle}>
              <Text style={styles.primaryButtonText}>Authorize & Settle (${sendAmount})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3. LIVE SETTLEMENT TIMELINE MODAL */}
      <Modal visible={isTimelineOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>⚡ Auto-UPI Atomic Settlement</Text>
            <Text style={styles.timelineSubtitle}>EVM Smart Contract Chain 31337</Text>

            <View style={styles.timelineList}>
              <View style={styles.timelineStep}>
                <Text style={styles.stepDot}>{settlementStep >= 1 ? '✓' : '○'}</Text>
                <Text style={styles.stepText}>1. Bank Custody Escrow Locked ($100.00)</Text>
              </View>
              <View style={styles.timelineStep}>
                <Text style={styles.stepDot}>{settlementStep >= 2 ? '✓' : '○'}</Text>
                <Text style={styles.stepText}>2. 1:1 TBD Settlement Token Minted</Text>
              </View>
              <View style={styles.timelineStep}>
                <Text style={styles.stepDot}>{settlementStep >= 3 ? '✓' : '○'}</Text>
                <Text style={styles.stepText}>3. EVM On-Chain Settlement (Block #195042)</Text>
              </View>
              <View style={styles.timelineStep}>
                <Text style={styles.stepDot}>{settlementStep >= 4 ? '✓' : '○'}</Text>
                <Text style={styles.stepText}>4. FX Converted (Zero Slippage)</Text>
              </View>
              <View style={styles.timelineStep}>
                <Text style={styles.stepDot}>{settlementStep >= 5 ? '✓' : '○'}</Text>
                <Text style={[styles.stepText, settlementStep >= 5 && { color: '#10B981', fontWeight: 'bold' }]}>
                  5. Recipient Credited: ₹{targetCalculated}
                </Text>
              </View>
            </View>

            {settlementStep >= 5 && (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setIsTimelineOpen(false);
                  setIsReceiptOpen(true);
                }}
              >
                <Text style={styles.primaryButtonText}>View Official Receipt</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>

      {/* 4. RECEIPT MODAL */}
      <Modal visible={isReceiptOpen} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.receiptBrand}>Auto-UPI Official Receipt</Text>
            <Text style={styles.receiptRef}>Ref: UPI-XB-8921820</Text>

            <View style={styles.receiptAmountBox}>
              <Text style={styles.receiptLabel}>AMOUNT TRANSFERRED</Text>
              <Text style={styles.receiptAmountBig}>$100.00 USD</Text>
              <Text style={styles.receiptCredited}>Credited: ₹8,350.00 INR</Text>
            </View>

            <View style={styles.receiptDetails}>
              <Text style={styles.receiptRow}>Recipient: Priya Sharma (priya@okaxis)</Text>
              <Text style={styles.receiptRow}>Rate: 1 USD = 83.50 INR</Text>
              <Text style={styles.receiptRow}>Network Fee: $1.50 USD</Text>
              <Text style={styles.receiptRow}>EVM Block: #195042 (Chain 31337)</Text>
            </View>

            <TouchableOpacity style={styles.primaryButton} onPress={() => setIsReceiptOpen(false)}>
              <Text style={styles.primaryButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090C10',
  },
  scrollArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  avatarText: {
    color: '#60A5FA',
    fontWeight: 'bold',
    fontSize: 14,
  },
  greeting: {
    color: '#9CA3AF',
    fontSize: 11,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  badgePill: {
    backgroundColor: '#1E2430',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  badgePillText: {
    color: '#60A5FA',
    fontSize: 11,
    fontWeight: 'bold',
  },
  searchBar: {
    backgroundColor: '#161B22',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  searchPlaceholder: {
    color: '#8B949E',
    fontSize: 13,
  },
  balanceCard: {
    backgroundColor: '#161B22',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#30363D',
    marginBottom: 16,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    color: '#8B949E',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bankName: {
    color: '#60A5FA',
    fontSize: 11,
  },
  balanceAmount: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    marginVertical: 8,
  },
  balanceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceUpi: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Courier',
  },
  tierPill: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: 'bold',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionTile: {
    backgroundColor: '#161B22',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    width: '23%',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  actionIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  actionTitle: {
    color: '#E5E7EB',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: '#3B82F6',
    fontSize: 12,
    fontWeight: '600',
  },
  peopleCarousel: {
    flexDirection: 'row',
  },
  personItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 65,
  },
  personAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E2430',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
    marginBottom: 6,
  },
  personFlag: {
    fontSize: 22,
  },
  personName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  personCurrency: {
    color: '#60A5FA',
    fontSize: 10,
  },
  promoBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  promoTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  promoSubtitle: {
    color: '#93C5FD',
    fontSize: 11,
    marginTop: 2,
  },
  promoArrow: {
    color: '#60A5FA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  txRow: {
    backgroundColor: '#161B22',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  txLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  txFlag: {
    fontSize: 20,
  },
  txName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  txRef: {
    color: '#8B949E',
    fontSize: 10,
    fontFamily: 'Courier',
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  txTarget: {
    color: '#10B981',
    fontSize: 11,
  },
  rewardsCard: {
    backgroundColor: '#1C1917',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  rewardsEmoji: {
    fontSize: 24,
  },
  rewardsTitle: {
    color: '#FCD34D',
    fontSize: 13,
    fontWeight: 'bold',
  },
  rewardsSubtitle: {
    color: '#D1D5DB',
    fontSize: 11,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#161B22',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#30363D',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
    color: '#8B949E',
  },
  navIconActive: {
    color: '#3B82F6',
  },
  navLabel: {
    color: '#8B949E',
    fontSize: 10,
    marginTop: 2,
  },
  navLabelActive: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#161B22',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalClose: {
    color: '#8B949E',
    fontSize: 18,
  },
  recipientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0D1117',
    padding: 12,
    borderRadius: 16,
    marginBottom: 16,
    gap: 10,
  },
  recipientFlag: {
    fontSize: 24,
  },
  recipientName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  recipientHandle: {
    color: '#60A5FA',
    fontSize: 11,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#8B949E',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  amountInput: {
    backgroundColor: '#0D1117',
    borderRadius: 16,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  quoteCard: {
    backgroundColor: '#0D1117',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
  },
  quoteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  quoteLabel: {
    color: '#8B949E',
    fontSize: 11,
  },
  quoteValue: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  recipientGetsLabel: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recipientGetsValue: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: 'black',
  },
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  otpSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    marginVertical: 12,
  },
  otpInput: {
    backgroundColor: '#0D1117',
    borderRadius: 16,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 28,
    letterSpacing: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginBottom: 20,
  },
  timelineSubtitle: {
    color: '#60A5FA',
    fontSize: 11,
    marginBottom: 16,
  },
  timelineList: {
    backgroundColor: '#0D1117',
    padding: 16,
    borderRadius: 20,
    marginBottom: 20,
    gap: 12,
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  stepDot: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 14,
  },
  stepText: {
    color: '#D1D5DB',
    fontSize: 12,
  },
  receiptBrand: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: 'black',
    textAlign: 'center',
  },
  receiptRef: {
    color: '#8B949E',
    fontSize: 11,
    textAlign: 'center',
    fontFamily: 'Courier',
    marginBottom: 16,
  },
  receiptAmountBox: {
    backgroundColor: '#0D1117',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptLabel: {
    color: '#8B949E',
    fontSize: 10,
  },
  receiptAmountBig: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'black',
    marginVertical: 4,
  },
  receiptCredited: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: 'bold',
  },
  receiptDetails: {
    backgroundColor: '#0D1117',
    padding: 14,
    borderRadius: 16,
    marginBottom: 20,
    gap: 6,
  },
  receiptRow: {
    color: '#D1D5DB',
    fontSize: 11,
  },
});
