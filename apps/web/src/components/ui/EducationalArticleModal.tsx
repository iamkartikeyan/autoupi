'use client';

import React from 'react';
import { EducationalArticle } from '@auto-upi/shared';
import { X, Clock, ShieldCheck, Zap, BookOpen, CheckCircle2 } from 'lucide-react';
import { BankVaultIllustration } from '../illustrations/BankVaultIllustration';
import { GlobalRemittanceHeroIllustration } from '../illustrations/GlobalRemittanceHeroIllustration';

interface EducationalArticleModalProps {
  article: EducationalArticle | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EducationalArticleModal: React.FC<EducationalArticleModalProps> = ({
  article,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-elevated border-t sm:border border-surface-highlight rounded-t-card-lg sm:rounded-card p-6 shadow-elevated text-white max-h-[90vh] overflow-y-auto">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1 bg-surface-highlight rounded-full mx-auto mb-4 sm:hidden" />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated text-zinc-300 border border-surface-highlight text-[10px] font-bold uppercase font-mono">
              {article.badge}
            </span>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime}</span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-2 leading-snug">
          {article.title}
        </h2>
        <p className="text-xs text-zinc-300 mb-5 font-medium">
          {article.shortDescription}
        </p>

        {/* Vector Visual Graphic */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-highlight mb-5 flex items-center justify-center">
          {article.category === 'RESERVES' ? (
            <BankVaultIllustration className="w-20 h-20" />
          ) : (
            <GlobalRemittanceHeroIllustration className="w-full max-h-36 object-contain" />
          )}
        </div>

        {/* Article Body Paragraphs */}
        <div className="space-y-3.5 text-xs text-gray-300 leading-relaxed mb-6">
          {article.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Key Takeaways */}
        <div className="p-4 rounded-2xl bg-surface border border-surface-highlight space-y-2 mb-5">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Key Takeaways for Users</span>
          </h4>
          <ul className="space-y-1.5 text-[11px] text-gray-300">
            <li>• Funds remain locked in 1:1 segregated bank custody until domestic rail credits.</li>
            <li>• Zero hidden foreign exchange spreads or post-transaction slippage.</li>
            <li>• Fully compliant with ISO 20022 and domestic central bank payment regulations.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-all active:scale-95"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
