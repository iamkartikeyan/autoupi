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
      <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl text-white max-h-[90vh] overflow-y-auto">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Refer Friends & Earn ₹500</h2>
              <p className="text-xs text-[#8E918F]">Give 100% free fees, get ₹500 cashback</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#8E918F] hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Hero Vector Accent */}
        <div className="my-4 p-4 rounded-2xl bg-[#16171B] border border-amber-500/30 flex items-center gap-3">
          <RewardsGiftIllustration className="w-16 h-16 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-amber-300">Guaranteed Dual Benefit</p>
            <p className="text-[#C4C7C5] text-[11px] mt-0.5 leading-relaxed">
              When your friend completes their first transfer above ₹500, both of you receive ₹121 credited directly to your bank account.
            </p>
          </div>
        </div>

        {/* Share Link Input */}
        <div className="space-y-2 mb-5">
          <label className="text-xs text-[#8E918F]">Your Personal Referral Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="flex-1 p-3 rounded-2xl bg-[#16171B] border border-[#35383F] text-xs font-mono text-white select-all focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="p-3 rounded-2xl bg-[#282A30] hover:bg-[#35383F] text-white border border-[#35383F] transition-colors flex items-center gap-1 text-xs font-semibold"
            >
              <Copy className="w-4 h-4 text-[#A8C7FA]" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Quick Share Buttons */}
        <div className="grid grid-cols-3 gap-2.5 mb-5 text-center text-xs">
          <button
            onClick={handleNativeShare}
            className="p-3 rounded-2xl bg-[#16171B] hover:bg-[#282A30] border border-[#35383F] flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-[#282A30] border border-[#35383F] text-white flex items-center justify-center">
              <Share2 className="w-4 h-4 text-[#A8C7FA]" />
            </div>
            <span className="font-medium text-[11px] text-white">Share App</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="p-3 rounded-2xl bg-[#16171B] hover:bg-[#282A30] border border-[#35383F] flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <span className="font-medium text-[11px] text-white">WhatsApp</span>
          </button>

          <button
            onClick={handleCopyCode}
            className="p-3 rounded-2xl bg-[#16171B] hover:bg-[#282A30] border border-[#35383F] flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-medium text-[11px] text-white">Copy Code</span>
          </button>
        </div>

        {/* 4-Step Progress Rules */}
        <div className="p-4 rounded-2xl bg-[#16171B] border border-[#35383F] space-y-2.5 text-xs">
          <h4 className="font-bold text-white uppercase text-[10px] tracking-wider">How Referral Works</h4>
          
          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#282A30] border border-[#35383F] text-white font-bold text-[10px] flex items-center justify-center font-mono">1</span>
            <p className="text-[#C4C7C5] text-[11px]">Invite friends with your link or code</p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#282A30] border border-[#35383F] text-white font-bold text-[10px] flex items-center justify-center font-mono">2</span>
            <p className="text-[#C4C7C5] text-[11px]">Friend verifies KYC & links bank account</p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-[#282A30] border border-[#35383F] text-white font-bold text-[10px] flex items-center justify-center font-mono">3</span>
            <p className="text-[#C4C7C5] text-[11px]">Friend sends their first payment</p>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center justify-center font-mono">✓</span>
            <p className="text-emerald-400 font-semibold text-[11px]">₹121 automatically credited to your bank account</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};

