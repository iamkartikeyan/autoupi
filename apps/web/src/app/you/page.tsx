'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { 
  Building2, 
  CreditCard, 
  Zap, 
  QrCode, 
  Tag, 
  Users, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft,
  MoreVertical, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  X, 
  Copy, 
  Download, 
  Share2,
  Sparkles,
  Lock,
  Headphones
} from 'lucide-react';
import { KYCWorkflowModal } from '../../components/ui/KYCWorkflowModal';
import { RealQRCode } from '../../components/ui/RealQRCode';
import { GoogleAuthModal } from '../../components/ui/GoogleAuthModal';

export default function YouPage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { bankAccounts, referralData } = usePayment();
  const { showToast } = useToast();

  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [isPersonalQrOpen, setIsPersonalQrOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');

  const userName = user?.name || 'Kartik Kumar';
  const userUpiId = user?.upiId || 'kk20140158570@oksbi';
  const userPhone = user?.phone || '7703916321';

  const copyUpiId = () => {
    navigator.clipboard.writeText(userUpiId);
    showToast('UPI ID Copied', `${userUpiId} copied to clipboard`, 'success');
  };

  const handleSendSupport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    showToast('Support Ticket Created', 'Our compliance support desk will respond shortly (Ticket #8921)', 'success');
    setSupportMessage('');
    setIsSupportModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] pb-24 select-none">
      {/* 1. SCENIC TOP HEADER WITH USER INFO (Matching Screenshot 3) */}
      <div className="relative w-full overflow-hidden bg-gradient-to-b from-[#18201A] via-[#121714] to-[#0E0F12] px-4 pt-4 pb-6">
        {/* Scenic vector illustration elements */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-4 left-20 w-32 h-16 bg-emerald-900/30 rounded-full blur-2xl" />
          <svg className="absolute bottom-0 inset-x-0 w-full h-32 text-emerald-950/40" viewBox="0 0 500 150" preserveAspectRatio="none">
            <path d="M0,60 C120,130 350,20 500,80 L500,150 L0,150 Z" fill="currentColor" opacity="0.6" />
            <path d="M0,100 C200,40 380,120 500,90 L500,150 L0,150 Z" fill="currentColor" opacity="0.8" />
          </svg>
        </div>

        {/* Top right action bar */}
        <div className="relative z-10 flex items-center justify-between mb-4">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2 rounded-full hover:bg-white/10 text-[#C4C7C5] transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Row */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-normal text-white tracking-tight truncate">
              {userName}
            </h1>
            <p className="text-sm text-[#C4C7C5] font-mono mt-1 truncate">
              UPI ID: {userUpiId}
            </p>
            <p className="text-sm text-[#8E918F] mt-0.5">
              {userPhone}
            </p>
          </div>

          {/* Profile Avatar with Mini QR Overlay */}
          <div
            onClick={() => setIsPersonalQrOpen(true)}
            className="relative cursor-pointer group shrink-0"
          >
            <div className="w-16 h-16 rounded-full bg-[#1E1F24] border-2 border-[#35383F] overflow-hidden flex items-center justify-center text-white font-bold text-xl">
              {user?.avatarUrl ? (
                <img src={user.avatarUrl} alt={userName} className="w-full h-full object-cover" />
              ) : (
                userName.charAt(0)
              )}
            </div>
            {/* Mini QR Badge */}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1E1F24] border border-[#35383F] flex items-center justify-center text-white shadow-md">
              <QrCode className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="px-4 space-y-4 max-w-lg mx-auto pt-2">
        {/* 2. TOP ACTION PILLS (Matching Screenshot 3) */}
        <div className="grid grid-cols-2 gap-3">
          {/* Rewards Pill */}
          <Link
            href="/rewards"
            className="p-4 rounded-[24px] bg-[#2D1E3A] hover:bg-[#382649] transition-colors flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-[#D0BCFF] shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">4 rewards</h3>
              <p className="text-xs text-[#D0BCFF]">View now</p>
            </div>
          </Link>

          {/* Referrals Pill */}
          <Link
            href="/rewards"
            className="p-4 rounded-[24px] bg-[#162E33] hover:bg-[#1E3E45] transition-colors flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center text-[#A8C7FA] shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Get ₹121</h3>
              <p className="text-xs text-[#A8C7FA]">Refer a friend</p>
            </div>
          </Link>
        </div>

        {/* 3. ALERT / WARNING BANNER (Matching Screenshot 3) */}
        <div className="p-4 rounded-[24px] bg-[#221B1E] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#F2B8B5]/20 flex items-center justify-center text-[#F2B8B5] shrink-0 mt-0.5">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white leading-snug">
              Primary bank: State Bank of India ••••6492 (Active for receiving payments)
            </p>
            <button
              onClick={() => showToast('Bank Settings', 'Primary receiving account set to State Bank of India', 'success')}
              className="text-xs font-medium text-[#A8C7FA] hover:underline mt-2 inline-block"
            >
              Manage banks
            </button>
          </div>
        </div>

        {/* 4. SET UP PAYMENT METHODS SECTION (Matching Screenshot 3) */}
        <div className="p-5 rounded-[28px] bg-[#1E1F24] space-y-4">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => router.push('/transfer')}>
            <h3 className="text-base font-medium text-white">Bank accounts & payment methods</h3>
            <ChevronRight className="w-5 h-5 text-[#C4C7C5]" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            {/* 1. Bank Account */}
            <div
              onClick={() => router.push('/transfer')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full bg-[#282A30] flex items-center justify-center text-[#A8C7FA] mb-2 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <p className="text-xs font-medium text-white leading-tight">Bank accounts</p>
              <p className="text-[11px] text-[#8E918F] mt-0.5">4 accounts linked</p>
            </div>


            {/* 2. RuPay Credit Card */}
            <div
              onClick={() => showToast('RuPay Credit Card', 'Link your RuPay card to pay via UPI anywhere', 'info')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-white mb-2 group-hover:scale-105 transition-transform">
                <CreditCard className="w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-white text-[#004A77] font-bold text-[10px] flex items-center justify-center shadow-sm">+</span>
              </div>
              <p className="text-xs font-medium text-white leading-tight">RuPay credit card</p>
              <p className="text-[11px] text-[#8E918F] mt-0.5">Pay with UPI</p>
            </div>

            {/* 3. UPI Lite */}
            <div
              onClick={() => showToast('UPI Lite', 'Activate UPI Lite for pinless payments up to ₹500', 'info')}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="relative w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-white mb-2 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6" />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-white text-[#004A77] font-bold text-[10px] flex items-center justify-center shadow-sm">+</span>
              </div>
              <p className="text-xs font-medium text-white leading-tight">UPI Lite</p>
              <p className="text-[11px] text-[#8E918F] mt-0.5">Pay PIN-free</p>
            </div>
          </div>
        </div>

        {/* 5. SEAMLESS FLAT ACTION ROWS (NO CARD OVERUSE, Matching Screenshot 3) */}
        <div className="divide-y divide-[#23252B]/60 pt-2">
          {/* Your QR Code */}
          <div
            onClick={() => setIsPersonalQrOpen(true)}
            className="flex items-center gap-4 py-4 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <QrCode className="w-5 h-5 text-[#C4C7C5]" />
            <span className="text-base font-normal text-white">Your QR code</span>
          </div>

          {/* Autopay & Mandates */}
          <div
            onClick={() => showToast('Autopay', 'Manage your recurring subscriptions and EMI autopay mandates', 'info')}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-4">
              <Zap className="w-5 h-5 text-[#C4C7C5]" />
              <span className="text-base font-normal text-white">Autopay</span>
            </div>
            <span className="text-xs text-[#8E918F]">0 active</span>
          </div>

          {/* KYC Tier Upgrade */}
          <div
            onClick={() => setIsKycModalOpen(true)}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-5 h-5 text-[#34D399]" />
              <div>
                <span className="text-base font-normal text-white">KYC & Limits</span>
                <p className="text-xs text-[#8E918F]">Tier {user?.kycTier || 2} Verified • $50,000/day</p>
              </div>
            </div>
            <span className="text-xs font-medium text-[#A8C7FA]">Upgrade</span>
          </div>

          {/* Support & Help */}
          <div
            onClick={() => setIsSupportModalOpen(true)}
            className="flex items-center gap-4 py-4 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <Headphones className="w-5 h-5 text-[#C4C7C5]" />
            <span className="text-base font-normal text-white">24/7 Support & Help</span>
          </div>

          {/* Install Mobile App (iOS / Android) */}
          <Link
            href="/download"
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-4">
              <Download className="w-5 h-5 text-[#A8C7FA]" />
              <div>
                <span className="text-base font-normal text-white">Download & Install App</span>
                <p className="text-xs text-[#8E918F]">Free for iPhone & Android</p>
              </div>
            </div>
            <span className="text-xs font-medium text-[#A8C7FA]">Download</span>
          </Link>

          {/* Google / Gmail Account Switcher */}
          <div
            onClick={() => setIsGoogleAuthOpen(true)}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-[#1E1F24]/40 px-2 rounded-2xl transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
              <div>
                <span className="text-base font-normal text-white">Google Account</span>
                <p className="text-xs text-[#8E918F] font-mono">{user?.email || 'kartik.kumar@gmail.com'}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-[#A8C7FA]">Switch</span>
          </div>

          {/* Logout / Reset */}
          <div
            onClick={logout}
            className="flex items-center gap-4 py-4 cursor-pointer hover:bg-rose-950/20 px-2 rounded-2xl transition-colors text-rose-400"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-base font-normal">Sign out / Reset Session</span>
          </div>
        </div>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
      />

      {/* ================================================================= */}
      {/* PERSONAL QR CODE MODAL (Matching Screenshot 4) */}
      {/* ================================================================= */}
      {isPersonalQrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] rounded-[32px] p-6 text-white text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-[#282A30] flex items-center justify-center text-white font-bold text-sm">
                  {userName.charAt(0)}
                </div>
                <span className="text-sm font-medium text-white">{userName}</span>
              </div>
              <button onClick={() => setIsPersonalQrOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Real-Time Scannable QR Code */}
            <div className="flex justify-center my-2">
              <RealQRCode
                value={`upi://pay?pa=${encodeURIComponent(userUpiId)}&pn=${encodeURIComponent(userName)}&cu=INR&mode=02`}
                size={200}
                logo={true}
              />
            </div>

            <p className="text-xs text-[#8E918F] mt-2">Scan to pay with any UPI app</p>

            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-[#C4C7C5]">
              <div className="w-4 h-4 rounded-full bg-[#0070BA] flex items-center justify-center text-[8px] text-white">₹</div>
              <span>State Bank of India 6492</span>
            </div>

            <p className="text-xs text-[#8E918F] font-mono mt-1 flex items-center justify-center gap-1">
              <span>UPI ID: {userUpiId}</span>
              <button onClick={copyUpiId} className="text-[#A8C7FA] hover:text-white">
                <Copy className="w-3.5 h-3.5" />
              </button>
            </p>

            <div className="space-y-2 mt-5">
              <button
                onClick={() => {
                  copyUpiId();
                  showToast('QR Shared', 'Payment link ready to share', 'success');
                }}
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all"
              >
                Share QR code
              </button>

              <button
                onClick={() => setIsPersonalQrOpen(false)}
                className="w-full py-3.5 rounded-full border border-[#444746] text-[#A8C7FA] hover:bg-[#282A30] text-sm font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KYC Workflow Modal */}
      <KYCWorkflowModal
        isOpen={isKycModalOpen}
        onClose={() => setIsKycModalOpen(false)}
      />

      {/* Support Modal */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-medium">24/7 Customer Support</h3>
              <button onClick={() => setIsSupportModalOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendSupport} className="space-y-4 my-2">
              <textarea
                required
                rows={3}
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
                placeholder="Describe your question or issue..."
                className="w-full p-3 rounded-2xl bg-[#16171B] border border-[#35383F] text-sm text-white focus:outline-none focus:border-[#A8C7FA]"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(false)}
                  className="w-1/2 py-3 rounded-full border border-[#444746] text-[#C4C7C5] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-full bg-[#A8C7FA] text-[#041E49] text-xs font-medium"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Context Menu Modal */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#1E1F24] border-t border-[#35383F] rounded-t-[32px] p-5 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#444746] rounded-full mx-auto mb-4" />
            {[
              { label: 'Transaction history', action: () => { setIsMenuOpen(false); router.push('/activity'); } },
              { label: 'Manage bank accounts', action: () => { setIsMenuOpen(false); router.push('/transfer'); } },
              { label: 'Rewards & offers', action: () => { setIsMenuOpen(false); router.push('/rewards'); } },
              { label: 'Download app', action: () => { setIsMenuOpen(false); router.push('/download'); } },
              { label: 'Help & support', action: () => { setIsMenuOpen(false); setIsSupportModalOpen(true); } },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="w-full text-left px-4 py-3.5 rounded-2xl hover:bg-[#282A30] text-sm text-white transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-full text-center px-4 py-3 rounded-2xl text-sm text-[#8E918F] mt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
