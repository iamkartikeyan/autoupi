'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ReferralShareSheet } from '../components/ui/ReferralShareSheet';
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
  CircleDollarSign,
  Gauge,
  Landmark
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

  const [isLiteModalOpen, setIsLiteModalOpen] = useState(false);
  const [isRechargeModalOpen, setIsRechargeModalOpen] = useState(false);
  
  // Modals from screenshot
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [isFlexCardModalOpen, setIsFlexCardModalOpen] = useState(false);
  const [isCibilModalOpen, setIsCibilModalOpen] = useState(false);
  const [isCheckBalanceOpen, setIsCheckBalanceOpen] = useState(false);
  const [upiPin, setUpiPin] = useState('');
  const [isBalanceRevealed, setIsBalanceRevealed] = useState(false);
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

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] pb-28 select-none relative overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. SCENIC GOOGLE PAY DARK VECTOR HEADER BACKGROUND */}
      {/* ========================================================================= */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#0A140F] via-[#0E1B14] to-[#0E0F12] pt-4 pb-6 px-4">
        {/* Landscape Vector SVG Elements (Positioned safely in top background) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-70">
          <svg className="absolute top-0 inset-x-0 w-full h-36 text-[#07130D]" viewBox="0 0 500 120" preserveAspectRatio="none">
            <path d="M0,60 C150,110 320,20 500,70 L500,120 L0,120 Z" fill="#0C1F16" opacity="0.8" />
            <path d="M0,85 C200,45 360,95 500,80 L500,120 L0,120 Z" fill="#07130D" opacity="0.9" />
          </svg>

          {/* Bank Building on Top Left */}
          <div className="absolute top-3 left-4 opacity-50">
            <svg viewBox="0 0 80 60" className="w-12 h-9 text-[#1B5E50]">
              <polygon points="40,5 5,22 75,22" fill="currentColor" />
              <rect x="12" y="24" width="8" height="26" rx="2" fill="currentColor" />
              <rect x="28" y="24" width="8" height="26" rx="2" fill="currentColor" />
              <rect x="44" y="24" width="8" height="26" rx="2" fill="currentColor" />
              <rect x="60" y="24" width="8" height="26" rx="2" fill="currentColor" />
              <rect x="2" y="50" width="76" height="6" rx="2" fill="currentColor" />
            </svg>
          </div>

          {/* Night City Buildings on Top Right */}
          <div className="absolute top-2 right-4 opacity-60 flex items-end gap-1">
            <div className="w-9 h-14 bg-[#161B1E] rounded-t-md p-1 grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-[#FBC02D] rounded-sm" />
              <div className="w-1.5 h-1.5 bg-[#20272B] rounded-sm" />
              <div className="w-1.5 h-1.5 bg-[#20272B] rounded-sm" />
              <div className="w-1.5 h-1.5 bg-[#FBC02D] rounded-sm" />
            </div>
            <div className="w-10 h-16 bg-[#121619] rounded-t-md p-1 grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-[#FFA000] rounded-sm" />
              <div className="w-1.5 h-1.5 bg-[#1F2529] rounded-sm" />
              <div className="w-1.5 h-1.5 bg-[#FFA000] rounded-sm" />
              <div className="w-1.5 h-1.5 bg-[#1F2529] rounded-sm" />
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* 2. TOP SEARCH BAR */}
        {/* ===================================================================== */}
        <div className="relative z-10 max-w-lg mx-auto mb-5">
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
        <div className="relative z-10 max-w-lg mx-auto grid grid-cols-4 gap-2 text-center pt-1 pb-1">
          {/* Action 1: Scan any QR code */}
          <div
            onClick={() => router.push('/qr')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[22px] bg-[#0B57D0] hover:bg-[#1A73E8] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95">
              <QrCode className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[11px] sm:text-xs font-normal text-[#E3E3E3] mt-2 leading-tight">
              Scan any<br />QR code
            </span>
          </div>

          {/* Action 2: Pay anyone */}
          <div
            onClick={() => router.push('/pay')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[22px] bg-[#0B57D0] hover:bg-[#1A73E8] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95">
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-6 sm:w-6 sm:h-7 rounded-[4px] border-2 border-white flex flex-col items-center justify-center text-[10px] sm:text-[11px] font-bold">
                  ₹
                </div>
                <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white absolute -top-1 -right-1 stroke-[3]" />
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-normal text-[#E3E3E3] mt-2 leading-tight">
              Pay<br />anyone
            </span>
          </div>

          {/* Action 3: Bank transfer */}
          <div
            onClick={() => router.push('/transfer')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[22px] bg-[#0B57D0] hover:bg-[#1A73E8] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <span className="text-[11px] sm:text-xs font-normal text-[#E3E3E3] mt-2 leading-tight">
              Bank<br />transfer
            </span>
          </div>

          {/* Action 4: Mobile recharge */}
          <div
            onClick={() => router.push('/recharge')}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[22px] bg-[#0B57D0] hover:bg-[#1A73E8] flex items-center justify-center text-white shadow-lg transition-transform active:scale-95">
              <div className="relative flex items-center justify-center">
                <Smartphone className="w-6 h-6 sm:w-7 sm:h-7" />
                <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white fill-white absolute inset-0 m-auto" />
              </div>
            </div>
            <span className="text-[11px] sm:text-xs font-normal text-[#E3E3E3] mt-2 leading-tight">
              Mobile<br />recharge
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. 3 CAPSULE PILLS ROW (UPI Lite, Rewards, UPI ID) */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 mt-3 mb-6">
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
      {/* 6. "OFFERS & REWARDS" (3 Gradient Badges + Loan Card) */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 space-y-4 mb-8">
        <h2 className="text-xl font-normal text-white px-1">Offers & rewards</h2>

        {/* 3 Circular Badges (Rewards, Offers, Referrals) */}
        <div className="flex items-center gap-6 px-2">
          {/* Rewards Badge (Gold) */}
          <Link href="/rewards" className="flex flex-col items-center group select-none">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD54F] via-[#FFA000] to-[#FF8F00] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFA726] to-[#FB8C00] flex items-center justify-center text-white">
                <Trophy className="w-8 h-8 fill-yellow-200 text-yellow-100" />
              </div>
            </div>
            <span className="text-xs font-normal text-white mt-2">Rewards</span>
          </Link>

          {/* Offers Badge (Pink/Red Tag) */}
          <Link href="/offers" className="flex flex-col items-center group select-none">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF4081] via-[#E91E63] to-[#C2185B] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#EC407A] to-[#D81B60] flex items-center justify-center text-white">
                <Tag className="w-8 h-8 fill-pink-100 text-white" />
              </div>
            </div>
            <span className="text-xs font-normal text-white mt-2">Offers</span>
          </Link>

          {/* Referrals Badge (Blue Dual Phones) */}
          <div
            onClick={() => setIsReferralSheetOpen(true)}
            className="flex flex-col items-center group cursor-pointer select-none"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#42A5F5] via-[#1E88E5] to-[#1565C0] p-0.5 shadow-lg group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-gradient-to-b from-[#29B6F6] to-[#0288D1] flex items-center justify-center text-white">
                <Users className="w-8 h-8 fill-blue-100 text-white" />
              </div>
            </div>
            <span className="text-xs font-normal text-white mt-2">Referrals</span>
          </div>
        </div>

        {/* Instant Loan Banner Card (Clean Non-Overlapping Layout) */}
        <div
          onClick={() => setIsLoanModalOpen(true)}
          className="w-full bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] rounded-[28px] p-5 shadow-lg flex items-center justify-between cursor-pointer transition-all duration-200 group gap-3"
        >
          <div className="space-y-1 min-w-0 flex-1">
            <h3 className="text-base font-normal text-white leading-snug">
              Instant loan up to ₹40 lakh
            </h3>
            <p className="text-xs text-[#8E918F]">
              Interest rate starting at 9.99%
            </p>
            <div className="pt-2">
              <span className="text-sm font-semibold text-[#A8C7FA] group-hover:underline">
                Apply now
              </span>
            </div>
          </div>

          {/* Card Vector Art Container */}
          <div className="w-28 h-20 shrink-0 pointer-events-none flex items-center justify-end">
            <svg viewBox="0 0 120 90" className="w-full h-full">
              <rect x="10" y="55" width="40" height="15" rx="5" fill="#1E88E5" />
              <path d="M18,55 L25,45 L40,45 L46,55 Z" fill="#64B5F6" />
              <circle cx="20" cy="70" r="4" fill="#212121" />
              <circle cx="42" cy="70" r="4" fill="#212121" />
              <rect x="65" y="15" width="42" height="65" rx="8" fill="#ECEFF1" stroke="#37474F" strokeWidth="2.5" />
              <rect x="70" y="24" width="32" height="35" rx="3" fill="#FFFFFF" />
              <circle cx="86" cy="42" r="8" fill="#E3F2FD" />
              <polygon points="86,36 80,40 92,40" fill="#1976D2" />
              <rect x="82" y="40" width="2.5" height="5" fill="#1976D2" />
              <rect x="85" y="40" width="2.5" height="5" fill="#1976D2" />
              <rect x="88" y="40" width="2.5" height="5" fill="#1976D2" />
              <rect x="72" y="63" width="28" height="10" rx="2" fill="#00C853" />
            </svg>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. "MANAGE YOUR MONEY" (2 Cards + 3 Action Rows) */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 space-y-4 mb-8">
        <h2 className="text-xl font-normal text-white px-1">Manage your money</h2>

        {/* 2 Side-by-Side Cards (Flex by Auto-UPI & Personal Loan) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: Flex by Auto-UPI */}
          <div
            onClick={() => setIsFlexCardModalOpen(true)}
            className="bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] rounded-[28px] p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 group min-h-[160px]"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-[#20272B] flex items-center justify-center text-[#A8C7FA] mb-2.5">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-normal text-white leading-tight">
                Flex by Auto-UPI
              </h3>
              <p className="text-xs text-[#8E918F] mt-1 leading-snug">
                UPI credit card made simple
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-[#A8C7FA] group-hover:underline">
                Check details
              </span>
            </div>
          </div>

          {/* Card 2: Personal loan */}
          <div
            onClick={() => setIsLoanModalOpen(true)}
            className="bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] rounded-[28px] p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-200 group min-h-[160px]"
          >
            <div>
              <div className="w-8 h-8 rounded-full bg-[#20272B] flex items-center justify-center text-[#A8C7FA] mb-2.5">
                <CircleDollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-normal text-white leading-tight">
                Personal loan
              </h3>
              <p className="text-xs text-[#8E918F] mt-1 leading-snug">
                Up to ₹40 lakh, instant approval
              </p>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-[#A8C7FA] group-hover:underline">
                Check details
              </span>
            </div>
          </div>
        </div>

        {/* 3 Clean Flat Action Rows */}
        <div className="divide-y divide-[#23252B]/80 pt-1">
          {/* Row 1: Check your CIBIL score for free */}
          <div
            onClick={() => setIsCibilModalOpen(true)}
            className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <Gauge className="w-5 h-5 text-[#C4C7C5]" />
              <span className="text-sm sm:text-base font-normal text-white">Check your CIBIL score for free</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8E918F]" />
          </div>

          {/* Row 2: See transaction history */}
          <Link
            href="/activity"
            className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <History className="w-5 h-5 text-[#C4C7C5]" />
              <span className="text-sm sm:text-base font-normal text-white">See transaction history</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8E918F]" />
          </Link>

          {/* Row 3: Check bank balance */}
          <div
            onClick={() => {
              setIsBalanceRevealed(false);
              setUpiPin('');
              setIsCheckBalanceOpen(true);
            }}
            className="flex items-center justify-between py-3.5 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-3.5">
              <Landmark className="w-5 h-5 text-[#C4C7C5]" />
              <span className="text-sm sm:text-base font-normal text-white">Check bank balance</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8E918F]" />
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 8. BOTTOM FOOTER */}
      {/* ========================================================================= */}
      <div className="max-w-lg mx-auto px-4 text-center py-4 space-y-2 text-xs text-[#8E918F]">
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
      {/* MODAL: PERSONAL LOAN APPLICATION */}
      {/* ========================================================================= */}
      {isLoanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex justify-between items-center pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <CircleDollarSign className="w-5 h-5 text-[#A8C7FA]" />
                <h3 className="text-base font-normal text-white">Instant Personal Loan</h3>
              </div>
              <button onClick={() => setIsLoanModalOpen(false)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-[#C4C7C5]">
              <div className="p-4 rounded-2xl bg-[#16171B] border border-[#2D3039] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#8E918F]">Pre-approved Limit</span>
                  <span className="text-white font-bold text-sm">Up to ₹40,00,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E918F]">Interest Rate</span>
                  <span className="text-emerald-400 font-semibold">9.99% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E918F]">Disbursal Time</span>
                  <span className="text-white font-medium">Under 2 minutes via UPI</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsLoanModalOpen(false);
                  showToast('Application Submitted', 'Your pre-approved ₹5,00,000 loan offer is ready for disbursement', 'success');
                }}
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-colors"
              >
                Apply & Disburse in 2 Mins
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FLEX CREDIT CARD */}
      {/* ========================================================================= */}
      {isFlexCardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex justify-between items-center pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-5 h-5 text-[#A8C7FA]" />
                <h3 className="text-base font-normal text-white">Flex by Auto-UPI</h3>
              </div>
              <button onClick={() => setIsFlexCardModalOpen(false)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-[#C4C7C5]">
              <p>Link your RuPay Credit Card to UPI and pay anywhere with zero merchant surcharge.</p>
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#004A77] to-[#0B57D0] text-white p-4 space-y-3 shadow-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm tracking-wider">RuPay UPI Credit</span>
                  <Zap className="w-4 h-4 fill-white" />
                </div>
                <div className="font-mono text-base tracking-widest">•••• •••• •••• 9921</div>
                <div className="flex justify-between text-[11px] opacity-80">
                  <span>LIMIT: ₹1,50,000</span>
                  <span>EXP: 09/29</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsFlexCardModalOpen(false);
                  showToast('Card Linked', 'RuPay Flex Credit line activated on your UPI ID', 'success');
                }}
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-colors"
              >
                Link Card to UPI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: FREE CIBIL SCORE REPORT */}
      {/* ========================================================================= */}
      {isCibilModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex justify-between items-center pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <Gauge className="w-5 h-5 text-[#34D399]" />
                <h3 className="text-base font-normal text-white">Your CIBIL Credit Score</h3>
              </div>
              <button onClick={() => setIsCibilModalOpen(false)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 text-center space-y-4">
              <div className="inline-block p-6 rounded-full bg-[#16171B] border-4 border-emerald-500/40">
                <span className="text-4xl font-extrabold text-emerald-400 font-mono">769</span>
                <p className="text-xs text-[#8E918F] mt-1 font-medium">EXCELLENT</p>
              </div>

              <div className="text-xs text-[#C4C7C5] space-y-2 text-left bg-[#16171B] p-4 rounded-2xl border border-[#2D3039]">
                <div className="flex justify-between">
                  <span className="text-[#8E918F]">On-Time Payments:</span>
                  <span className="text-white font-semibold">100%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E918F]">Credit Utilization:</span>
                  <span className="text-white font-semibold">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E918F]">Credit Age:</span>
                  <span className="text-white font-semibold">4 yrs 2 mos</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCibilModalOpen(false)}
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-colors"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MOBILE RECHARGE */}
      {/* ========================================================================= */}
      {isRechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex justify-between items-center pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-[#A8C7FA]" />
                <h3 className="text-base font-normal text-white">Mobile Recharge</h3>
              </div>
              <button onClick={() => setIsRechargeModalOpen(false)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRechargeSubmit} className="py-4 space-y-4">
              <div>
                <label className="text-xs text-[#8E918F]">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={rechargePhone}
                  onChange={(e) => setRechargePhone(e.target.value)}
                  className="w-full mt-1 px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-[#8E918F]">Select Plan</label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['299', '479', '719'].map((plan) => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => setRechargeAmount(plan)}
                      className={`p-2.5 rounded-2xl border text-xs font-semibold ${
                        rechargeAmount === plan
                          ? 'bg-[#004A77] border-[#A8C7FA] text-white'
                          : 'bg-[#16171B] border-[#35383F] text-[#C4C7C5]'
                      }`}
                    >
                      ₹{plan}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-colors mt-2"
              >
                Proceed to Pay ₹{rechargeAmount}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: UPI LITE ACTIVATION */}
      {/* ========================================================================= */}
      {isLiteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex justify-between items-center pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <Rocket className="w-5 h-5 text-[#A8C7FA]" />
                <h3 className="text-base font-normal text-white">Activate UPI Lite</h3>
              </div>
              <button onClick={() => setIsLiteModalOpen(false)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-[#C4C7C5]">
              <p>Pay up to ₹500 instantly without entering your UPI PIN every time. Super fast 1-click payments.</p>
              <div className="p-3.5 rounded-2xl bg-[#16171B] border border-[#2D3039] flex items-center justify-between">
                <div>
                  <span className="text-white font-medium">Add balance to UPI Lite</span>
                  <p className="text-[#8E918F] text-[11px]">Deducted from State Bank of India ••••6492</p>
                </div>
                <span className="text-sm font-bold text-white">₹500</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsLiteModalOpen(false);
                showToast('UPI Lite Activated', '₹500 added to your PIN-free Lite wallet', 'success');
              }}
              className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-colors"
            >
              Add ₹500 & Activate Lite
            </button>
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
