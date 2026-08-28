'use client';

import React, { useState } from 'react';
import { OfferOrReward } from '@auto-upi/shared';
import { Sparkles, Check, Gift, Trophy, ArrowRight, X } from 'lucide-react';

interface RewardCardProps {
  reward: OfferOrReward;
  onScratchComplete?: () => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ reward, onScratchComplete }) => {
  const [isScratched, setIsScratched] = useState(reward.isUnlocked);
  const [isScratchModalOpen, setIsScratchModalOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(reward.isUnlocked);

  const handleCardClick = () => {
    if (!isRevealed) {
      setIsScratchModalOpen(true);
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
    setIsScratched(true);
    if (onScratchComplete) onScratchComplete();
  };

  return (
    <>
      {/* Square Google Pay Scratch Tile */}
      <div
        onClick={handleCardClick}
        className={`relative aspect-square rounded-[24px] p-4 cursor-pointer select-none transition-all duration-300 flex flex-col items-center justify-between text-center overflow-hidden border ${
          isRevealed
            ? 'bg-[#1E1F24] border-[#35383F]'
            : 'bg-gradient-to-br from-[#FFD54F] via-[#FFA000] to-[#E65100] border-amber-400/40 shadow-lg hover:scale-[1.02] active:scale-95'
        }`}
      >
        {!isRevealed ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-2 relative">
            {/* Shimmer Pattern */}
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white mb-2 shadow-inner">
              <Trophy className="w-7 h-7 fill-white text-white drop-shadow" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight drop-shadow">
              Scratch & Win
            </span>
            <span className="text-[11px] text-yellow-100 font-medium mt-1">
              Tap to open
            </span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-between p-2 animate-in fade-in zoom-in-95">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-white font-sans">
                {reward.amountOrPercent}
              </h4>
              <p className="text-[11px] text-[#8E918F] mt-0.5 line-clamp-2">
                {reward.title}
              </p>
            </div>
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Cashback Won
            </span>
          </div>
        )}
      </div>

      {/* Interactive Scratch-off Modal */}
      {isScratchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] border border-[#35383F] rounded-[32px] p-6 text-white shadow-2xl relative text-center">
            <button
              onClick={() => setIsScratchModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#8E918F] hover:text-white rounded-full bg-[#16171B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pt-4 pb-2">
              <h3 className="text-lg font-normal text-white">Auto-UPI Rewards</h3>
              <p className="text-xs text-[#8E918F] mt-0.5">Scratch below to reveal your prize</p>
            </div>

            {/* Scratching Card Canvas Area */}
            <div className="my-6 relative w-64 h-64 mx-auto rounded-[28px] overflow-hidden border border-[#35383F] shadow-2xl flex items-center justify-center">
              {/* Revealed Prize Behind */}
              <div className="absolute inset-0 bg-[#16171B] flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 animate-bounce">
                  <Trophy className="w-8 h-8 fill-emerald-400" />
                </div>
                <h2 className="text-3xl font-black text-white font-sans tracking-tight">
                  {reward.amountOrPercent}
                </h2>
                <p className="text-xs text-[#C4C7C5] mt-1 font-medium">
                  {reward.title}
                </p>
                <p className="text-[11px] text-emerald-400 mt-2 font-semibold">
                  Credited to State Bank of India ••••6492
                </p>
              </div>

              {/* Gold Scratch Layer */}
              {!isRevealed && (
                <div
                  onClick={handleReveal}
                  className="absolute inset-0 bg-gradient-to-br from-[#FFD54F] via-[#FFA000] to-[#E65100] flex flex-col items-center justify-center p-4 cursor-pointer hover:opacity-95 active:scale-95 transition-transform select-none"
                >
                  <div className="w-14 h-14 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-white mb-2 shadow-inner">
                    <Sparkles className="w-7 h-7 fill-white" />
                  </div>
                  <span className="text-base font-bold text-white drop-shadow">
                    Tap to Scratch
                  </span>
                  <span className="text-xs text-yellow-100 font-medium mt-1">
                    Reveals instant prize
                  </span>
                </div>
              )}
            </div>

            {isRevealed ? (
              <button
                onClick={() => setIsScratchModalOpen(false)}
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-colors"
              >
                Claim & Add to Balance
              </button>
            ) : (
              <button
                onClick={handleReveal}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#FFA000] to-[#FF8F00] text-gray-950 font-bold text-sm transition-transform active:scale-95"
              >
                Scratch Now
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};
