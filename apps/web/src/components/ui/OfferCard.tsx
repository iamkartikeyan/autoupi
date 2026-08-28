'use client';

import React from 'react';
import { OfferOrReward } from '@auto-upi/shared';
import { Gift, Zap, Sparkles, ArrowRight, Tag, Clock, ChevronRight } from 'lucide-react';

interface OfferCardProps {
  offer: OfferOrReward;
  variant?: 'featured' | 'compact' | 'card';
  onClick?: () => void;
  onClaim?: () => void;
}

export const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  variant = 'card',
  onClick,
  onClaim,
}) => {
  // TYPE A: Featured Hero Offer Card
  if (variant === 'featured') {
    return (
      <div
        onClick={onClick}
        className={`group relative overflow-hidden rounded-card p-5 sm:p-6 bg-gradient-to-br ${offer.bgGradient || 'from-surface-elevated to-surface'} border border-surface-highlight backdrop-blur-md text-white shadow-elevated cursor-pointer transition-all duration-200 hover:border-zinc-500 active:scale-98`}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm shadow-inner group-hover:scale-105 transition-transform">
              <Gift className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-300">
                {offer.merchantName || 'Featured Benefit'}
              </span>
              <h3 className="text-base font-extrabold text-white leading-tight">
                {offer.title}
              </h3>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-black text-white tracking-wide shrink-0 font-mono shadow-sm">
            {offer.amountOrPercent}
          </span>
        </div>

        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed mb-4">
          {offer.description}
        </p>

        <div className="flex items-center justify-between pt-3.5 border-t border-white/15 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px]">
            <Tag className="w-3.5 h-3.5 text-zinc-300" />
            <span>{offer.code ? `Code: ${offer.code}` : 'Instant Activation'}</span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) onClick();
            }}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white text-black font-bold text-xs shadow-sm hover:bg-zinc-200 transition-all"
          >
            <span>{offer.ctaText || 'View Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // TYPE B: Compact List Item (e.g. for dense feeds or vertical lists)
  if (variant === 'compact') {
    return (
      <div
        onClick={onClick}
        className="flex items-center justify-between p-3.5 rounded-2xl bg-surface hover:bg-surface-elevated border border-surface-highlight hover:border-zinc-500 transition-all cursor-pointer select-none text-white"
      >
        <div className="flex items-center gap-3 min-w-0 pr-3">
          <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-surface-highlight flex items-center justify-center text-zinc-300 shrink-0">
            {offer.type === 'CASHBACK' && <Gift className="w-5 h-5 text-amber-400" />}
            {offer.type === 'FX_DISCOUNT' && <Zap className="w-5 h-5 text-emerald-400" />}
            {offer.type === 'SCRATCH_CARD' && <Sparkles className="w-5 h-5 text-purple-400" />}
            {offer.type === 'VOUCHER' && <Tag className="w-5 h-5 text-zinc-300" />}
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-white truncate">{offer.title}</h4>
            <p className="text-[11px] text-zinc-400 truncate">{offer.headline || offer.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2.5 py-1 rounded-full bg-surface-elevated border border-surface-highlight text-xs font-bold text-zinc-200 font-mono">
            {offer.amountOrPercent}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
        </div>
      </div>
    );
  }

  // DEFAULT: Standard Carousel Card
  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-card p-5 bg-gradient-to-br ${offer.bgGradient || 'from-surface-elevated to-surface'} border border-surface-highlight backdrop-blur-md text-white shadow-card-subtle flex flex-col justify-between min-w-[260px] max-w-[320px] transition-all duration-200 hover:-translate-y-1 cursor-pointer`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm group-hover:scale-105 transition-transform">
          {offer.type === 'CASHBACK' && <Gift className="w-5 h-5 text-amber-300" />}
          {offer.type === 'FX_DISCOUNT' && <Zap className="w-5 h-5 text-emerald-300" />}
          {offer.type === 'SCRATCH_CARD' && <Sparkles className="w-5 h-5 text-purple-300" />}
          {offer.type === 'VOUCHER' && <Tag className="w-5 h-5 text-zinc-300" />}
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-bold text-white tracking-wide">
          {offer.amountOrPercent}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-bold text-white mb-1 leading-snug">{offer.title}</h4>
        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">{offer.description}</p>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
        <span className="text-[11px] text-zinc-400 font-mono">
          {offer.code ? `Code: ${offer.code}` : 'Instant Activation'}
        </span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClick) onClick();
            else if (onClaim) onClaim();
          }}
          className="flex items-center gap-1 text-xs font-bold text-white hover:underline transition-all"
        >
          <span>Claim</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
