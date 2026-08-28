'use client';

import React from 'react';
import { Beneficiary } from '@auto-upi/shared';

interface PersonAvatarProps {
  beneficiary: Beneficiary;
  onClick?: () => void;
  selected?: boolean;
}

export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  beneficiary,
  onClick,
  selected = false,
}) => {
  return (
    <button
      onClick={onClick}
      className={`group flex flex-col items-center text-center p-2 rounded-2xl transition-all duration-200 focus:outline-none ${
        selected ? 'bg-surface-elevated ring-2 ring-white/60 shadow-sm' : 'hover:bg-surface-elevated/60'
      }`}
    >
      <div className="relative mb-2">
        <div
          className={`w-14 h-14 rounded-full p-0.5 transition-transform duration-200 group-hover:scale-105 ${
            selected
              ? 'bg-white ring-2 ring-white/40'
              : 'bg-surface-highlight group-hover:bg-zinc-600'
          }`}
        >
          {beneficiary.avatarUrl ? (
            <img
              src={beneficiary.avatarUrl}
              alt={beneficiary.name}
              className="w-full h-full object-cover rounded-full bg-surface"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center font-bold text-sm text-zinc-200">
              {beneficiary.initials}
            </div>
          )}
        </div>

        {/* Flag badge */}
        <span
          className="absolute -bottom-1 -right-1 text-sm bg-surface-elevated rounded-full w-5 h-5 flex items-center justify-center shadow-sm border border-surface-highlight"
          title={beneficiary.country}
        >
          {beneficiary.flagEmoji}
        </span>
      </div>

      <p className="text-xs font-semibold text-zinc-200 truncate w-16 group-hover:text-white transition-colors">
        {beneficiary.name.split(' ')[0]}
      </p>
      <p className="text-[10px] text-zinc-400 truncate w-16">
        {beneficiary.currency}
      </p>
    </button>
  );
};
