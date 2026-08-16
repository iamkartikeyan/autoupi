'use client';

import React from 'react';
import { Zap } from 'lucide-react';

export interface BrandLogoProps {
  size?: number;
  showText?: boolean;
  textClassName?: string;
  className?: string;
  grayscale?: boolean;
}

export default function BrandLogo({
  size = 32,
  showText = true,
  textClassName = '',
  className = '',
  grayscale = false,
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${grayscale ? 'grayscale opacity-70' : ''} ${className}`}>
      {/* Icon Badge */}
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-primary-600 via-primary-500 to-accent-500 shadow-glow-primary flex-shrink-0 text-white"
        style={{ width: size, height: size }}
      >
        <Zap className="w-1/2 h-1/2 fill-current" strokeWidth={2.5} />
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${textClassName || 'text-lg'}`}>
            Auto<span className="text-primary-600 dark:text-primary-400">UPI</span>
          </span>
          <span className="text-[10px] font-medium tracking-wider uppercase text-slate-500 dark:text-slate-400">
            Global Settlement
          </span>
        </div>
      )}
    </div>
  );
}
