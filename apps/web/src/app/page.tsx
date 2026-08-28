'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PeopleSheet } from '../components/ui/PeopleSheet';
import { ReceiptModal } from '../components/ui/ReceiptModal';
import { OfferDetailModal } from '../components/ui/OfferDetailModal';
import { ReferralShareSheet } from '../components/ui/ReferralShareSheet';
import { Beneficiary, PaymentTransaction, OfferOrReward } from '@auto-upi/shared';
import { 
  Search, 
  QrCode, 
  Building2, 
  Smartphone, 
  Zap, 
  ChevronDown, 
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Trophy,
  Rocket,
  ShieldCheck,
  CheckCircle2,
  X,
  CreditCard,
  Tag,
  Users,
  History,
  TrendingUp,
  Receipt,
  Tv,
  Lightbulb,
  FileText,
  Lock,
  Eye,
  EyeOff,
  Flame,
  Plus
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { 
    bankAccounts, 
    beneficiaries, 
    transactions, 
    offers, 
    referralData, 
    claimOffer 
  } = usePayment();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [isPeopleSheetOpen, setIsPeopleSheetOpen] = useState(false);
  const [isLiteModalOpen, setIsLiteModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  const [isBillPayModalOpen, setIsBillPayModalOpen] = useState(false);
  const [selectedBillType, setSelectedBillType] = useState('Electricity');
  const [isCheckBalanceOpen, setIsCheckBalanceOpen] = useState(false);
  const [upiPin, setUpiPin] = useState('');
  const [isBalanceRevealed, setIsBalanceRevealed] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<OfferOrReward | null>(null);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isReferralSheetOpen, setIsReferralSheetOpen] = useState(false);

  const [rechargePhone, setRechargePhone] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('299');

  const primaryAccount = bankAccounts.find((b) => b.isPrimary) || bankAccounts[0];
  const userUpiId = user?.upiId || 'kk20140158570@oksbi';

  const copyUpiId = () => {
    navigator.clipboard.writeText(userUpiId);
    showToast('UPI ID Copied', `${userUpiId} copied to clipboard`, 'success');
  };

  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rechargePhone) return;
    setIsRechargeModalOpen(false);
    showToast('Recharge Successful', `₹${rechargeAmount} mobile recharge applied to ${rechargePhone}`, 'success');
  };

  const handleVerifyPinAndShowBalance = () => {
    if (upiPin.length < 4) {
      showToast('Invalid PIN', 'Please enter your 4 or 6 digit UPI PIN', 'error');
      return;
    }
    setIsBalanceRevealed(true);
    showToast('Balance Fetched', `Available balance: ₹${(primaryAccount?.balance || 84250).toLocaleString('en-IN')}.00`, 'success');
  };

  // 8 Exact Contacts matching Google Pay Theme
  const PEOPLE_LIST = [
    {
      id: 'ben_kartikeyan',
      name: 'kartikeyan sahani',
      displayName: 'kartikeyan\nsahani',
      initial: 'K',
      bg: 'bg-[#7B1FA2]',
      hasBadge: true,
      phone: '+91 77039 16321',
      upi: 'kartikeyan@oksbi',
    },
    {
      id: 'ben_rahul',
      name: 'Mr RAHUL SATYENDRA KUMAR',
      displayName: 'Mr RAHUL\nSATYENDR...',
      initial: 'M',
      bg: 'bg-[#00796B]',
      phone: '+91 95823 20234',
      upi: '9582320234@slc',
    },
    {
      id: 'ben_praveen',
      name: 'Praveen',
      displayName: 'Praveen',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+91 93158 96154',
      upi: '9315896154@ptaxis',
    },
    {
      id: 'ben_rahulk',
      name: 'Rahul Kumar',
      displayName: 'Rahul\nKumar',
      initial: 'R',
      bg: 'bg-[#1565C0]',
      phone: '+91 98101 23456',
      upi: 'rahulk@oksbi',
    },
    {
      id: 'ben_abhishek',
      name: 'ABHISHEK',
      displayName: 'ABHISHEK',
      initial: 'A',
      bg: 'bg-[#C2185B]',
      phone: '+91 76785 73087',
      upi: '7678573087@axl',
    },
    {
      id: 'ben_neerendra',
      name: 'Neerendra.',
      displayName: 'Neerendra.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      phone: '+91 88001 98234',
      upi: 'neerendra@okaxis',
    },
    {
      id: 'ben_nitin',
      name: 'Mr NITIN',
      displayName: 'Mr NITIN\n...',
      initial: 'M',
      bg: 'bg-[#6D4C41]',
      phone: '+91 99112 34567',
      upi: 'nitin@okicici',
    },
  ];

  // Businesses & Bills List
  const BUSINESS_LIST = [
    { id: 'b1', name: 'Jio Prepaid', initial: 'J', bg: 'bg-[#0B57D0]', icon: Smartphone },
    { id: 'b2', name: 'Airtel', initial: 'A', bg: 'bg-[#E53935]', icon: Smartphone },
    { id: 'b3', name: 'Electricity', initial: '⚡', bg: 'bg-[#F57C00]', icon: Lightbulb },
    { id: 'b4', name: 'Tata Play', initial: 'T', bg: 'bg-[#8E24AA]', icon: Tv },
    { id: 'b5', name: 'Google Play', initial: 'G', bg: 'bg-[#00897B]', icon: Flame },
    { id: 'b6', name: 'FASTag', initial: 'F', bg: 'bg-[#1E88E5]', icon: CreditCard },
    { id: 'b7', name: 'Zomato', initial: 'Z', bg: 'bg-[#C2185B]', icon: Sparkles },
  ];

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] pb-24 select-none relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. SCENIC GOOGLE PAY DARK VECTOR HEADER BACKGROUND */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0A140F] via-[#0E1B14] to-[#0E0F12] pt-3 pb-8 px-4">
        {/* Landscape Vector SVG Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="absolute bottom-0 inset-x-0 w-full h-44 text-[#07130D]" viewBox="0 0 500 160" preserveAspectRatio="none">
            <path d="M0,80 C150,140 320,30 500,90 L500,160 L0,160 Z" fill="#0C1F16" opacity="0.9" />
            <path d="M0,110 C200,60 360,130 500,105 L500,160 L0,160 Z" fill="#07130D" opacity="1" />
          </svg>

          {/* Bank Building on the Left Hill */}
          <div className="absolute top-12 left-4 opacity-75">
            <svg viewBox="0 0 80 60" className="w-16 h-12 text-[#1B5E50]">
              <polygon points="40,5 5,22 75,22" fill="currentColor" />
              <rect x="12" y="24" width="8" height="26" rx="2" fill="currentColor" />
              <rect x="28" y="24" width="8" height="26" rx="2" fill="currentColor" />
              <rect x="44" y="24" width="8" height="26" rx="2" fill="currentColor" />
              <rect x="60" y="24" width="8" height="26" rx="2" fill="currentColor" />
              <rect x="2" y="50" width="76" height="6" rx="2" fill="currentColor" />
            </svg>
          </div>

          {/* Night City Buildings with Lit Windows */}
          <div className="absolute top-10 right-4 opacity-80 flex items-end gap-1.5">
            <div className="w-12 h-20 bg-[#161B1E] rounded-t-md p-1 grid grid-cols-2 gap-1">
              <div className="w-2 h-2 bg-[#FBC02D] rounded-sm opacity-90 shadow-[0_0_6px_#FBC02D]" />
              <div className="w-2 h-2 bg-[#20272B] rounded-sm" />
              <div className="w-2 h-2 bg-[#20272B] rounded-sm" />
              <div className="w-2 h-2 bg-[#FBC02D] rounded-sm opacity-90 shadow-[0_0_6px_#FBC02D]" />
              <div className="w-2 h-2 bg-[#FBC02D] rounded-sm opacity-90" />
              <div className="w-2 h-2 bg-[#20272B] rounded-sm" />
            </div>

            <div className="w-14 h-24 bg-[#121619] rounded-t-md p-1.5 grid grid-cols-3 gap-1">
              <div className="w-1.5 h-1.5 bg-[#FFA000] rounded-sm opacity-80" />
              <div className="w-1.5 h-1.5 bg-[#1F2529] rounded-sm" />
              <div className="w-1.5 h-1.5 bg-[#FFA000] rounded-sm opacity-90 shadow-[0_0_6px_#FFA000]" />
              <div className="w-1.5 h-1.5 bg-[#1F2529] rounded-sm" />
              <div className="w-1.5 h-1.5 bg-[#FFA000] rounded-sm opacity-80" />
              <div className="w-1.5 h-1.5 bg-[#1F2529] rounded-sm" />
            </div>
          </div>

          {/* Tea/Food Cart on Right */}
          <div className="absolute bottom-2 right-4 flex items-end gap-2">
            <div className="relative">
              <div className="w-14 h-4 bg-[#FFB300] rounded-t-md border-b-2 border-[#E65100]" />
              <div className="w-14 h-8 bg-[#FFCA28] flex items-center justify-center">
                <span className="text-[8px] font-bold text-[#E65100]">TEA</span>
              </div>
              <div className="flex justify-between px-1 -mt-1.5">
                <div className="w-4 h-4 rounded-full bg-[#37474F] border-2 border-[#78909C]" />
                <div className="w-4 h-4 rounded-full bg-[#37474F] border-2 border-[#78909C]" />
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full bg-[#FFCCBC]" />
              <div className="w-4 h-6 bg-[#1E88E5] rounded-t-sm" />
              <div className="w-3.5 h-6 bg-[#263238]" />
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. TOP SEARCH BAR */}
        {/* ===================================================================== */}
        <div className="relative z-10 max-w-lg mx-auto mb-6">
          <div
            onClick={() => router.push('/pay')}
            className="flex items-center justify-between gap-3 bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] rounded-full px-4 py-2.5 shadow-md cursor-pointer transition-all active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <Search className="w-5 h-5 text-[#8E918F] shrink-0" />
              <span className="text-sm font-normal text-[#8E918F] truncate">
                Pay by name or phone number
              </span>
            </div>

            <Link
              href="/you"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0"
            >
              <div className="w-8 h-8 rounded-full bg-[#1E1F24] border border-[#444746] overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="You" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0) || 'K'
                )}
              </div>
            </Link>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 3. 4 PRIMARY ROYAL BLUE SQUIRCLES */}
        {/* ===================================================================== */}
        <div className="relative z-10 max-w-lg mx-auto grid grid-cols-4 gap-2 text-center pt-2">
          {/* Action 1: Scan any QR code */}
          <div
            onClick={() => router.push('/qr')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-[22px] bg-[#0B57D0] hover:bg-[#1A73E8] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95">
              <QrCode className="w-7 h-7" />
            </div>
            <span className="text-xs font-normal text-[#E3E3E3] mt-2.5 leading-snug">
              Scan any<br />QR code
            </span>
          </div>

          {/* Action 2: Pay anyone */}
          <div
            onClick={() => router.push('/pay')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-[22px] bg-[#0B57D0] hover:bg-[#1A73E8] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95">
              <div className="relative flex items-center justify-center">
                <div className="w-6 h-7 rounded-[4px] border-2 border-white flex flex-col items-center justify-center text-[11px] font-bold">
                  ₹
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-white absolute -top-1 -right-1 stroke-[3]" />
              </div>
            </div>
            <span className="text-xs font-normal text-[#E3E3E3] mt-2.5 leading-snug">
              Pay<br />anyone
            </span>
          </div>

          {/* Action 3: Bank transfer */}
          <div
            onClick={() => router.push('/transfer')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-[22px] bg-[#0B57D0] hover:bg-[#1A73E8] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95">
              <Building2 className="w-7 h-7" />
            </div>
            <span className="text-xs font-normal text-[#E3E3E3] mt-2.5 leading-snug">
              Bank<br />transfer
            </span>
          </div>

          {/* Action 4: Mobile recharge */}
          <div
            onClick={() => setIsRechargeModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-16 h-16 rounded-[22px] bg-[#0B57D0] hover:bg-[#1A73E8] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95">
              <div className="relative flex items-center justify-center">
                <Smartphone className="w-7 h-7" />
                <Zap className="w-3.5 h-3.5 text-white fill-white absolute inset-0 m-auto" />
              </div>
            </div>
            <span className="text-xs font-normal text-[#E3E3E3] mt-2.5 leading-snug">
              Mobile<br />recharge
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. 3 CAPSULE PILLS ROW (UPI Lite, Rewards, UPI ID) */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 -mt-3 mb-6">
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          <div
            onClick={() => setIsLiteModalOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] cursor-pointer shrink-0 transition-colors shadow-sm"
          >
            <div className="w-7 h-7 rounded-full bg-[#202124] flex items-center justify-center text-[#A8C7FA]">
              <Rocket className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-normal text-white leading-tight">UPI Lite</p>
              <p className="text-[11px] font-semibold text-[#A8C7FA]">Activate</p>
            </div>
          </div>

          <Link
            href="/rewards"
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] cursor-pointer shrink-0 transition-colors shadow-sm"
          >
            <div className="w-7 h-7 rounded-full bg-[#202124] flex items-center justify-center text-[#FBBC04]">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-left">
              <p className="text-xs font-normal text-white leading-tight">Rewards</p>
              <p className="text-[11px] text-[#8E918F]">New</p>
            </div>
          </Link>

          <div
            onClick={copyUpiId}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] cursor-pointer shrink-0 transition-colors shadow-sm"
          >
            <div className="w-7 h-7 rounded-full bg-[#202124] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <polygon points="12,2 22,22 2,22" fill="#E65100" />
                <polygon points="12,7 19,21 5,21" fill="#00C853" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-xs font-normal text-white leading-tight">UPI ID</p>
              <p className="text-[11px] text-[#8E918F] max-w-[90px] truncate">{userUpiId}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. "PEOPLE" SECTION (Matching 8-Item Contact Directory) */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 space-y-4 mb-8">
        <h2 className="text-xl font-normal text-white px-1">People</h2>

        <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center">
          {PEOPLE_LIST.map((person) => (
            <div
              key={person.id}
              onClick={() => router.push(`/pay/chat/${person.id}`)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative">
                {person.avatarUrl ? (
                  <div className="w-14 h-14 rounded-full overflow-hidden border border-[#35383F] bg-[#1E1F24] group-hover:scale-105 transition-transform shadow-md">
                    <img src={person.avatarUrl} alt={person.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className={`w-14 h-14 rounded-full ${person.bg} text-white flex items-center justify-center font-normal text-2xl group-hover:scale-105 transition-transform shadow-md`}>
                    {person.initial}
                  </div>
                )}
                {person.hasBadge && (
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#A8C7FA] border-2 border-[#0E0F12] shadow-sm" />
                )}
              </div>
              <span className="text-xs font-normal text-[#E3E3E3] mt-2 leading-tight whitespace-pre-line truncate max-w-[80px]">
                {person.displayName}
              </span>
            </div>
          ))}

          {/* Item 8: More */}
          <div
            onClick={() => router.push('/pay')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md">
              <ChevronDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-normal text-[#E3E3E3] mt-2 leading-tight">
              More
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. "BUSINESSES & BILLS" SECTION (Google Pay Merchant & Recharges) */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 space-y-4 mb-8">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-normal text-white">Businesses</h2>
          <button 
            onClick={() => router.push('/pay')}
            className="text-xs font-medium text-[#A8C7FA] hover:underline flex items-center gap-0.5"
          >
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-y-6 gap-x-2 text-center">
          {BUSINESS_LIST.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.id}
                onClick={() => {
                  setSelectedBillType(b.name);
                  setIsBillPayModalOpen(true);
                }}
                className="flex flex-col items-center group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full ${b.bg} text-white flex items-center justify-center text-lg font-bold shadow-md group-hover:scale-105 transition-transform`}>
                  {b.initial}
                </div>
                <span className="text-xs font-normal text-[#E3E3E3] mt-2 leading-tight truncate max-w-[76px]">
                  {b.name}
                </span>
              </div>
            );
          })}

          <div
            onClick={() => setIsBillPayModalOpen(true)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-md">
              <ChevronDown className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-normal text-[#E3E3E3] mt-2 leading-tight">
              More
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. "OFFERS & REWARDS" PROMO TILES */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 space-y-4 mb-8">
        <h2 className="text-xl font-normal text-white px-1">Offers & rewards</h2>

        <div className="grid grid-cols-3 gap-3">
          {/* Tile 1: Rewards */}
          <Link
            href="/rewards"
            className="p-3.5 rounded-[24px] bg-[#2D1E3A] hover:bg-[#382649] transition-all flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-full bg-purple-900/60 flex items-center justify-center text-[#D0BCFF] mb-3">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white">Rewards</p>
              <p className="text-[11px] text-[#D0BCFF] mt-0.5 font-semibold">₹1,248 won</p>
            </div>
          </Link>

          {/* Tile 2: Offers */}
          <Link
            href="/offers"
            className="p-3.5 rounded-[24px] bg-[#162E33] hover:bg-[#1E3E45] transition-all flex flex-col justify-between group"
          >
            <div className="w-10 h-10 rounded-full bg-teal-900/60 flex items-center justify-center text-[#A8C7FA] mb-3">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white">Offers</p>
              <p className="text-[11px] text-[#A8C7FA] mt-0.5 font-semibold">32 active</p>
            </div>
          </Link>

          {/* Tile 3: Referrals */}
          <div
            onClick={() => setIsReferralSheetOpen(true)}
            className="p-3.5 rounded-[24px] bg-[#1E2530] hover:bg-[#262F3D] transition-all flex flex-col justify-between group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-blue-900/60 flex items-center justify-center text-[#A8C7FA] mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-white">Referrals</p>
              <p className="text-[11px] text-[#A8C7FA] mt-0.5 font-semibold">Get ₹121</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. "MANAGE YOUR MONEY" (Check Balance, CIBIL Score, Transaction History) */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 space-y-4 mb-8">
        <h2 className="text-xl font-normal text-white px-1">Manage your money</h2>

        <div className="divide-y divide-[#23252B] bg-[#16171B] border border-[#2D3039] rounded-[28px] overflow-hidden">
          {/* Row 1: Check Bank Balance */}
          <div
            onClick={() => {
              setIsBalanceRevealed(false);
              setUpiPin('');
              setIsCheckBalanceOpen(true);
            }}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1E1F24] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#1E1F24] flex items-center justify-center text-[#A8C7FA]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-normal text-white">Check bank balance</span>
                <p className="text-xs text-[#8E918F]">
                  State Bank of India ••••6492
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8E918F]" />
          </div>

          {/* Row 2: CIBIL Score */}
          <div
            onClick={() => showToast('Credit Score', 'Your CIBIL score is 769 (Excellent) • Updated today', 'info')}
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1E1F24] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#1E1F24] flex items-center justify-center text-[#34D399]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-normal text-white">Check your CIBIL score for free</span>
                <p className="text-xs text-[#34D399] font-medium">
                  769 • Excellent
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8E918F]" />
          </div>

          {/* Row 3: Transaction History */}
          <Link
            href="/activity"
            className="flex items-center justify-between p-4 cursor-pointer hover:bg-[#1E1F24] transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-[#1E1F24] flex items-center justify-center text-[#A8C7FA]">
                <History className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-normal text-white">See transaction history</span>
                <p className="text-xs text-[#8E918F]">
                  View all debits, credits and receipts
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8E918F]" />
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 9. BOTTOM FOOTER (Showing all accounts linked to UPI) */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 text-center py-6 space-y-2 text-xs text-[#8E918F]">
        <p>Showing all accounts linked to <span className="text-white font-mono">{userUpiId}</span></p>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8E918F]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>POWERED BY UPI 2.0 • NPCI SECURE</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: CHECK BANK BALANCE WITH PIN */}
      {/* ========================================================================= */}
      {isCheckBalanceOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex justify-between items-center pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <Building2 className="w-5 h-5 text-[#A8C7FA]" />
                <h3 className="text-base font-normal text-white">State Bank of India</h3>
              </div>
              <button onClick={() => setIsCheckBalanceOpen(false)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-xs text-[#8E918F]">
                Savings Account ••••6492 (IFSC: SBIN0006492)
              </p>

              {!isBalanceRevealed ? (
                <div className="space-y-3">
                  <label className="text-xs text-[#8E918F]">Enter 4-Digit UPI PIN to View Balance</label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••"
                    value={upiPin}
                    onChange={(e) => setUpiPin(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-center text-2xl tracking-widest text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPinAndShowBalance}
                    className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-colors mt-2"
                  >
                    Check Balance
                  </button>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-[#16171B] border border-emerald-500/30 text-center space-y-2 animate-in zoom-in-95">
                  <p className="text-xs text-emerald-400 font-medium">Available Account Balance</p>
                  <h3 className="text-3xl font-normal text-white font-mono">
                    ₹{(primaryAccount?.balance || 84250).toLocaleString('en-IN')}.00
                  </h3>
                  <p className="text-[11px] text-[#8E918F]">Verified live from NPCI clearing switch</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BILL PAYMENT */}
      {/* ========================================================================= */}
      {isBillPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex justify-between items-center pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <Receipt className="w-5 h-5 text-[#A8C7FA]" />
                <h3 className="text-base font-normal text-white">Pay {selectedBillType} Bill</h3>
              </div>
              <button onClick={() => setIsBillPayModalOpen(false)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <label className="text-xs text-[#8E918F]">Consumer Number / Account ID</label>
                <input
                  type="text"
                  placeholder="e.g. 1029384756"
                  className="w-full mt-1 px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#8E918F]">Amount to Pay</label>
                <input
                  type="number"
                  defaultValue="1450"
                  className="w-full mt-1 px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-sm text-white focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsBillPayModalOpen(false);
                  showToast('Bill Paid', `₹1,450 paid for ${selectedBillType} bill`, 'success');
                }}
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-colors mt-2"
              >
                Pay Bill & Get ₹25 Cashback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referral Share Sheet */}
      <ReferralShareSheet
        isOpen={isReferralSheetOpen}
        onClose={() => setIsReferralSheetOpen(false)}
        referralCode="AUTOUPI2026"
      />
    </div>
  );
}
