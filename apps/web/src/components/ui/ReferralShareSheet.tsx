'use client';

import React from 'react';
import { 
  X, 
  Copy, 
  Share2, 
  MessageSquare, 
  Send, 
  Gift, 
  CheckCircle2, 
  Sparkles,
  Users,
  Clock
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { RewardsGiftIllustration } from '../illustrations/RewardsGiftIllustration';

interface ReferralShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

export const ReferralShareSheet: React.FC<ReferralShareSheetProps> = ({
  isOpen,
  onClose,
  referralCode = 'AARAV88',
}) => {
  const { showToast } = useToast();

  if (!isOpen) return null;

  const referralLink = `https://autoupi.io/r/${referralCode}`;
  const shareText = `Join me on Auto-UPI for instant cross-border UPI payments with zero hidden fees and real-time bank settlement! Use my code ${referralCode} to get ₹500 cashback on your first transfer: ${referralLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    showToast('Link Copied', 'Referral link copied to clipboard', 'success');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    showToast('Code Copied', `Referral code ${referralCode} copied`, 'success');
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Auto-UPI Referral Invitation',
          text: shareText,
          url: referralLink,
        });
        showToast('Shared', 'Referral invitation sent', 'success');
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-elevated border-t sm:border border-surface-highlight rounded-t-card-lg sm:rounded-card p-6 shadow-elevated text-white max-h-[90vh] overflow-y-auto">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1 bg-surface-highlight rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Refer Friends & Earn ₹500</h2>
              <p className="text-xs text-gray-400">Give 100% free fees, get ₹500 cashback</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Vector Accent */}
        <div className="my-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-surface to-surface border border-amber-500/30 flex items-center gap-3">
          <RewardsGiftIllustration className="w-16 h-16 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-amber-300">Guaranteed Dual Benefit</p>
            <p className="text-gray-300 text-[11px] mt-0.5 leading-relaxed">
              When your friend completes their first international transfer above $100, both of you receive ₹500 credited directly to your bank account.
            </p>
          </div>
        </div>

        {/* Share Link Input */}
        <div className="space-y-2 mb-5">
          <label className="text-xs text-gray-400">Your Personal Referral Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 p-3 rounded-xl bg-surface border border-surface-highlight text-xs font-mono text-zinc-200 select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="p-3 rounded-xl bg-surface-elevated hover:bg-surface-highlight text-zinc-200 border border-surface-highlight transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Copy className="w-4 h-4 text-zinc-300" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center text-xs">
          <button
            onClick={handleNativeShare}
            className="p-3 rounded-2xl bg-surface hover:bg-surface-subtle border border-surface-highlight flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-surface border border-surface-highlight text-zinc-300 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <span className="font-medium text-[11px] text-gray-200">Share App</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="p-3 rounded-2xl bg-surface hover:bg-surface-subtle border border-surface-highlight flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-medium text-[11px] text-gray-200">WhatsApp</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="p-3 rounded-2xl bg-surface hover:bg-surface-subtle border border-surface-highlight flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-medium text-[11px] text-gray-200">Copy Code</span>
          </button>
        </div>

        {/* 4-Step Progress Rules */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-highlight space-y-2.5 text-xs">
          <h4 className="font-bold text-gray-200 uppercase text-[10px] tracking-wider">How Referral Works</h4>
          
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-highlight text-zinc-300 font-bold text-[10px] flex items-center justify-center font-mono">1</span>
            <p className="text-gray-300 text-[11px]">Invite friends with your link or code</p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-highlight text-zinc-300 font-bold text-[10px] flex items-center justify-center font-mono">2</span>
            <p className="text-gray-300 text-[11px]">Friend verifies KYC & links bank account</p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-surface-elevated border border-surface-highlight text-zinc-300 font-bold text-[10px] flex items-center justify-center font-mono">3</span>
            <p className="text-gray-300 text-[11px]">Friend sends ₹10,000+ ($100 USD)</p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center font-mono">✓</span>
            <p className="text-emerald-400 font-semibold text-[11px]">₹500 automatically credited to both bank accounts</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-all active:scale-95"
        >
          Done
        </button>
      </div>
    </div>
  );
};
