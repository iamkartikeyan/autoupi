'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { RewardCard } from '../../components/ui/RewardCard';
import { ReferralShareSheet } from '../../components/ui/ReferralShareSheet';
import { 
  Sparkles, 
  Gift, 
  Share2, 
  Copy, 
  ChevronRight, 
  ArrowLeft,
  Trophy, 
  CheckCircle2, 
  Users, 
  QrCode, 
  Zap, 
  Smartphone,
  Building2,
  ShieldCheck
} from 'lucide-react';

export default function RewardsPage() {
  const router = useRouter();
  const { offers, referralData, claimReward } = usePayment();
  const { showToast } = useToast();

  const [isReferralSheetOpen, setIsReferralSheetOpen] = useState(false);

  const referralLink = referralData.referralLink || `https://tbd-teal-eta.vercel.app/r/${referralData.referralCode || 'AUTOUPI2026'}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    showToast('Referral Link Copied', 'Share with friends to earn ₹121 on their first payment', 'success');
  };

  // Google Pay Earning Quests
  const QUESTS = [
    {
      id: 'q1',
      title: 'Scan & pay any merchant QR',
      reward: 'Earn up to ₹50 cashback',
      icon: QrCode,
      href: '/qr',
      bg: 'bg-[#0B57D0]'
    },
    {
      id: 'q2',
      title: 'Pay your mobile recharge',
      reward: 'Get flat ₹25 cashback',
      icon: Smartphone,
      href: '/',
      bg: 'bg-[#E53935]'
    },
    {
      id: 'q3',
      title: 'Send money to 3 friends',
      reward: 'Unlock special scratch card',
      icon: Users,
      href: '/pay',
      bg: 'bg-[#7B1FA2]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] pb-24 select-none">
      {/* Top Header */}
      <div className="max-w-lg mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-[#1E1F24] active:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-normal text-white">Rewards</h1>
        <div className="w-6" />
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-6 pt-2">
        {/* ========================================================================= */}
        {/* 1. TOTAL REWARDS EARNED HERO BANNER */}
        {/* ========================================================================= */}
        <div className="p-6 rounded-[28px] bg-[#1E1F24] border border-[#35383F] shadow-lg relative overflow-hidden text-center">
          {/* Subtle gold gradient glow */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD54F] via-[#FFA000] to-[#FF8F00] p-0.5 mx-auto mb-3 shadow-md">
            <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFA726] to-[#FB8C00] flex items-center justify-center text-white">
              <Trophy className="w-8 h-8 fill-yellow-200 text-yellow-100" />
            </div>
          </div>

          <p className="text-xs text-[#8E918F] font-medium">Total rewards earned</p>
          <h2 className="text-4xl font-normal text-white font-sans mt-1 mb-2">
            ₹1,248
          </h2>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16171B] border border-[#35383F] text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Credited to State Bank of India ••••6492</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. YOUR SCRATCH CARDS (Google Pay Grid) */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-lg font-normal text-white">Your scratch cards</h3>
            <span className="text-xs font-semibold text-[#A8C7FA]">
              {offers.filter(o => !o.isUnlocked).length} Available
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {offers.map((offer) => (
              <RewardCard
                key={offer.id}
                reward={offer}
                onScratchComplete={() => {
                  claimReward(offer.id);
                  showToast('Reward Claimed', `${offer.title} credited directly to your bank account`, 'success');
                }}
              />
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. INVITE FRIENDS & GET ₹121 BANNER */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-[28px] bg-[#1E1F24] border border-[#35383F] shadow-lg space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#42A5F5] to-[#1565C0] flex items-center justify-center text-white shrink-0 shadow-md">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-normal text-white leading-tight">
                Invite friends to Auto-UPI
              </h3>
              <p className="text-xs text-[#8E918F] mt-1 leading-snug">
                Get <strong className="text-white font-semibold">₹121</strong> when your friend makes their first payment. They get ₹21 too!
              </p>
            </div>
          </div>

          {/* Referral Code & Share CTA */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] font-mono text-xs text-white font-semibold tracking-wider flex items-center justify-between">
              <span>{referralData.referralCode || 'AUTOUPI2026'}</span>
              <button onClick={copyReferral} className="text-[#A8C7FA] hover:underline text-xs flex items-center gap-1 font-sans">
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>

            <button
              onClick={() => setIsReferralSheetOpen(true)}
              className="px-5 py-3 rounded-2xl bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. EARN MORE REWARDS (Quests & Challenges) */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <h3 className="text-lg font-normal text-white px-1">Earn more rewards</h3>

          <div className="divide-y divide-[#23252B] bg-[#16171B] border border-[#2D3039] rounded-[28px] overflow-hidden">
            {QUESTS.map((quest) => {
              const Icon = quest.icon;
              return (
                <Link
                  key={quest.id}
                  href={quest.href}
                  className="flex items-center justify-between p-4 hover:bg-[#1E1F24] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-2xl ${quest.bg} flex items-center justify-center text-white shadow-sm`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-white">{quest.title}</p>
                      <p className="text-xs text-emerald-400 font-medium">{quest.reward}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8E918F]" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 space-y-1.5 text-xs text-[#8E918F]">
          <div className="flex items-center justify-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NPCI Direct Bank Settlement Rail</span>
          </div>
        </div>
      </div>

      {/* Referral Share Sheet */}
      <ReferralShareSheet
        isOpen={isReferralSheetOpen}
        onClose={() => setIsReferralSheetOpen(false)}
        referralCode={referralData.referralCode || 'AUTOUPI2026'}
      />
    </div>
  );
}
