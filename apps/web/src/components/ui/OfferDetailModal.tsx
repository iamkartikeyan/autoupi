'use client';

import React from 'react';
import { OfferOrReward } from '@auto-upi/shared';
import { 
  X, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Zap, 
  FileText, 
  Tag,
  Gift
} from 'lucide-react';
import { PrimaryButton } from './PrimaryButton';
import { useRouter } from 'next/navigation';

interface OfferDetailModalProps {
  offer: OfferOrReward | null;
  isOpen: boolean;
  onClose: () => void;
  onClaim?: (offer: OfferOrReward) => void;
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({
  offer,
  isOpen,
  onClose,
  onClaim,
}) => {
  const router = useRouter();

  if (!isOpen || !offer) return null;

  const handleAction = () => {
    if (offer.ctaAction === 'PAY') {
      onClose();
      router.push('/pay');
    } else if (onClaim) {
      onClaim(offer);
    }
  };

  const getDaysRemaining = (dateString: string) => {
    const diff = new Date(dateString).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Expires soon';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-elevated border-t sm:border border-surface-highlight rounded-t-card-lg sm:rounded-card p-6 shadow-elevated text-white max-h-[90vh] overflow-y-auto">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1 bg-surface-highlight rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center text-lg font-bold shadow-md">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                {offer.merchantName || 'Auto-UPI Direct Benefit'}
              </span>
              <h2 className="text-base font-extrabold text-white leading-tight">
                {offer.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-surface hover:bg-surface-subtle text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefit Highlight Box */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-highlight my-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">Total Reward Value</span>
            <div className="flex items-center gap-1 text-xs text-amber-400 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>{getDaysRemaining(offer.expiresAt)}</span>
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono mt-1">
            {offer.amountOrPercent}
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {offer.description}
          </p>
        </div>

        {/* Eligibility & Details */}
        <div className="space-y-3.5 my-5 text-xs">
          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-wider">Offer Highlights & Terms</h3>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Eligibility</p>
              <p className="text-gray-400 text-[11px]">
                {offer.eligibility || 'Valid on all cross-border international remittances above $100 equivalent.'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Tag className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Settlement Credit</p>
              <p className="text-gray-400 text-[11px]">
                Cashback or FX fee discount is applied automatically at checkout.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Direct Bank Credit</p>
              <p className="text-gray-400 text-[11px]">
                Cashback rewards are credited directly to your primary linked bank account.
              </p>
            </div>
          </div>
        </div>

        {/* Promo Code if applicable */}
        {offer.code && (
          <div className="p-3 rounded-xl bg-surface border border-dashed border-surface-highlight flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Voucher Code</p>
              <p className="font-mono text-xs font-bold text-zinc-200">{offer.code}</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-surface-elevated text-zinc-300 text-[10px] font-bold border border-surface-highlight">
              Auto-Applied
            </span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-surface-highlight/70 flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/3 py-3 rounded-full text-xs font-semibold bg-surface hover:bg-surface-subtle text-gray-300 border border-surface-highlight transition-all"
          >
            Close
          </button>
          <PrimaryButton
            onClick={handleAction}
            variant="gradient"
            className="w-2/3"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {offer.ctaText || 'Activate & Send'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
