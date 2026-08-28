'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { RewardCard } from '../../components/ui/RewardCard';
import { OfferCard } from '../../components/ui/OfferCard';
import { ReferralShareSheet } from '../../components/ui/ReferralShareSheet';
import { RewardsGiftIllustration } from '../../components/illustrations/RewardsGiftIllustration';
import { 
  Sparkles, 
  Gift, 
  Share2, 
  Copy, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  CheckCircle2, 
  Coins,
  ArrowRight,
  Users,
  Clock
} from 'lucide-react';

export default function RewardsPage() {
  const { offers, referralData, claimReward } = usePayment();
  const { showToast } = useToast();

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isReferralSheetOpen, setIsReferralSheetOpen] = useState(false);

  const referralLink = referralData.referralLink || `https://autoupi.io/r/${referralData.referralCode}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    showToast('Referral Link Copied', 'Share with friends to earn ₹500 on their first international transfer', 'success');
  };

  const FAQS = [
    {
      q: 'How do I earn Auto-UPI scratch rewards?',
      a: 'Complete any cross-border remittance above $100 equivalent to instantly unlock a guaranteed cashback or yield-boost scratch card.',
    },
    {
      q: 'When are rewards credited to my bank reserve?',
      a: 'Cashback rewards are settled directly into your linked bank custody reserve wallet within 2.5 seconds of unlocking.',
    },
    {
      q: 'Is there a limit on referral bonuses?',
      a: 'You can earn up to $500 USD per calendar month through our verified international payment referral program.',
    },
    {
      q: 'Can I use rewards towards network settlement fees?',
      a: 'Yes, cashback credits are automatically applied to offset cross-border settlement fees and FX spreads.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Auto-UPI Rewards</h1>
          <p className="text-xs text-gray-400">Earn instant cashback and settlement yield bonuses</p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-violet/20 border border-brand-violet/40 text-brand-purple text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>VIP Tier</span>
        </div>
      </div>

      {/* Rewards Balance Banner */}
      <div className="p-6 rounded-card bg-gradient-to-br from-brand-violet/25 via-surface-elevated to-surface border border-brand-violet/40 shadow-elevated text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-violet/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block shrink-0">
              <RewardsGiftIllustration className="w-16 h-16" />
            </div>
            <div>
              <p className="text-xs text-gray-300 uppercase tracking-wider font-semibold">Total Cashback Earned</p>
              <h2 className="text-3xl sm:text-4xl font-black text-white my-1 font-sans">
                $148.50 <span className="text-sm font-normal text-gray-400 font-mono">USD</span>
              </h2>
              <p className="text-xs text-emerald-400 font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>₹12,400 INR equivalent credited to bank</span>
              </p>
            </div>
          </div>

          <div className="flex sm:flex-col gap-2">
            <Link
              href="/pay"
              className="py-2.5 px-5 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-all active:scale-95 text-center"
            >
              Send to Earn More
            </Link>
          </div>
        </div>
      </div>

      {/* Active Scratch Cards Section */}
      <section className="bg-surface rounded-card p-5 border border-surface-highlight shadow-elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Your Scratch Cards</h3>
            <p className="text-xs text-gray-400">Tap any mystery card to reveal your reward</p>
          </div>
          <span className="text-xs font-semibold text-zinc-300">2 Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <RewardCard
              key={offer.id}
              reward={offer}
              onScratchComplete={() => {
                claimReward(offer.id);
                showToast('Reward Unlocked', `${offer.title} activated!`, 'success');
              }}
            />
          ))}
        </div>
      </section>

      {/* Referral Program Banner */}
      <section className="p-5 rounded-card bg-surface border border-surface-highlight shadow-elevated">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-surface-elevated border border-surface-highlight text-amber-400 flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white mb-1">Invite Friends & Earn ₹500</h3>
              <span className="px-2 py-0.5 rounded-full bg-surface-elevated border border-surface-highlight text-amber-300 text-[10px] font-bold">
                2 Earned
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed mb-3">
              Give a friend 100% free cross-border remittance fees and get ₹500 instantly credited to your custody reserve when they complete their first transfer.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-md">
              <div className="flex-1 px-3.5 py-2.5 rounded-xl bg-surface-elevated border border-surface-highlight font-mono text-xs text-zinc-200 select-all truncate">
                {referralLink}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyReferral}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight text-white text-xs font-bold border border-surface-highlight flex items-center justify-center gap-1.5 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
                <button
                  onClick={() => setIsReferralSheetOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Referral Progress List */}
            <div className="mt-4 pt-3 border-t border-surface-highlight/60 space-y-2">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">Recent Referrals</span>
              {referralData.progressList.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2.5 rounded-xl bg-surface-elevated border border-surface-highlight/70 text-xs">
                  <div>
                    <p className="font-semibold text-white">{item.friendName}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{item.friendEmailOrPhoneMasked}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                      {item.rewardAmount}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Earn Guide */}
      <section className="bg-surface rounded-card p-5 border border-surface-highlight shadow-elevated">
        <h3 className="text-sm font-bold text-white mb-4">How to Earn Rewards</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-highlight">
            <div className="w-8 h-8 rounded-full bg-surface border border-surface-highlight text-white font-bold text-xs flex items-center justify-center mb-2 font-mono">
              01
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Transfer Globally</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Send payments across India, UK, Singapore, or Eurozone corridors.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-highlight">
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-brand-purple font-bold text-xs flex items-center justify-center mb-2 font-mono">
              02
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Scratch Cards</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Unlock mystery cashback, FX rate boosts, or settlement token yield vouchers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-surface-elevated border border-surface-highlight">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-2 font-mono">
              03
            </div>
            <h4 className="text-xs font-bold text-white mb-1">Instant Payout</h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Cashback is automatically credited to your bank custody account with zero delay.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-surface rounded-card p-5 border border-surface-highlight shadow-elevated">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4 text-brand-sky" />
          <h3 className="text-sm font-bold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-2">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-surface-elevated border border-surface-highlight overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-3.5 text-left text-xs font-semibold text-gray-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                {isOpen && (
                  <div className="px-3.5 pb-3.5 text-xs text-gray-400 leading-relaxed border-t border-surface-highlight/40 pt-2 animate-in fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Referral Share Sheet */}
      <ReferralShareSheet
        isOpen={isReferralSheetOpen}
        onClose={() => setIsReferralSheetOpen(false)}
        referralCode={referralData.referralCode}
      />
    </div>
  );
}
