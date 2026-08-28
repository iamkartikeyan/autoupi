'use client';

import React from 'react';
import { ArrowRight, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';

interface FinancialProductCardProps {
  icon?: React.ReactNode;
  badge?: string;
  title: string;
  description: string;
  ctaText?: string;
  onAction?: () => void;
}

export const FinancialProductCard: React.FC<FinancialProductCardProps> = ({
  icon,
  badge = 'New Feature',
  title,
  description,
  ctaText = 'Learn more',
  onAction,
}) => {
  return (
    <div className="p-4 sm:p-5 rounded-card bg-surface hover:bg-surface-elevated border border-surface-highlight hover:border-zinc-600 transition-all duration-200 text-white shadow-card-subtle flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-surface-elevated border border-surface-highlight flex items-center justify-center text-zinc-200">
            {icon || <CreditCard className="w-5 h-5" />}
          </div>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated border border-surface-highlight text-[10px] font-bold text-zinc-300 uppercase font-mono">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">{description}</p>
      </div>

      <button
        onClick={onAction}
        className="flex items-center gap-1.5 text-xs font-bold text-zinc-200 hover:text-white transition-colors self-start"
      >
        <span>{ctaText}</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
