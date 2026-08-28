'use client';

import React, { useState } from 'react';
import { OfferOrReward } from '@auto-upi/shared';
import { Sparkles, Check, Gift } from 'lucide-react';

interface RewardCardProps {
  reward: OfferOrReward;
  onScratchComplete?: () => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onScratchComplete }) => {
  const [isScratched, setIsScratched] = useState(reward.isUnlocked);

  const handleScratch = () => {
    if (!isScratched) {
      setIsScratched(true);
      if (onScratchComplete) onScratchComplete();
    }
  };

  return (
    <div
      onClick={handleScratch}
      className={`relative overflow-hidden rounded-card p-5 cursor-pointer select-none transition-all duration-300 ${
        isScratched
          ? 'bg-surface-elevated border border-emerald-500/40'
          : 'bg-gradient-to-br from-surface-elevated to-surface border border-surface-highlight hover:border-zinc-500'
      } shadow-elevated`}
    >
      {!isScratched ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-elevated border border-surface-highlight flex items-center justify-center text-white mb-3 shadow-md">
            <Gift className="w-7 h-7 text-white" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">Mystery Settlement Reward</h4>
          <p className="text-xs text-zinc-300 font-medium">Tap to scratch & unlock</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in zoom-in-95 duration-300">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3">
            <Sparkles className="w-7 h-7" />
          </div>
          <span className="text-xl font-extrabold text-white mb-1">
            {reward.amountOrPercent}
          </span>
          <p className="text-xs text-gray-300 mb-2">{reward.description}</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <Check className="w-3.5 h-3.5" />
            <span>Unlocked & Applied to Wallet</span>
          </span>
        </div>
      )}
    </div>
  );
};
