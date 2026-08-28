'use client';

import React from 'react';

interface QuickActionTileProps {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  badge?: string;
  onClick?: () => void;
  variant?: 'primary' | 'surface' | 'accent';
}

export const QuickActionTile: React.FC<QuickActionTileProps> = ({
  icon,
  label,
  subLabel,
  badge,
  onClick,
  variant = 'surface',
}) => {
  const getIconWrapperStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-white text-black shadow-md';
      case 'accent':
        return 'bg-surface-elevated text-zinc-100 border border-surface-highlight';
      case 'surface':
      default:
        return 'bg-surface-elevated text-zinc-300 group-hover:bg-surface-highlight group-hover:text-white border border-surface-highlight/70';
    }
  };

  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center text-center p-2.5 rounded-2xl transition-all duration-200 focus:outline-none"
    >
      <div className="relative mb-2">
        <div
          className={`w-13 h-13 p-3.5 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-active:scale-95 ${getIconWrapperStyles()}`}
        >
          {icon}
        </div>

        {badge && (
          <span className="absolute -top-1.5 -right-2 px-1.5 py-0.5 text-[9px] font-bold bg-zinc-800 text-white rounded-full border border-surface-highlight shadow-sm">
            {badge}
          </span>
        )}
      </div>

      <span className="text-xs font-medium text-zinc-200 group-hover:text-white transition-colors leading-tight">
        {label}
      </span>
      {subLabel && (
        <span className="text-[10px] text-zinc-400 mt-0.5">
          {subLabel}
        </span>
      )}
    </button>
  );
};
