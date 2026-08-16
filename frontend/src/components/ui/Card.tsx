'use client';

import React, { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantStyles = {
    default:
      'bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] shadow-card-light dark:shadow-card-dark rounded-xl',
    elevated:
      'bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-white/10 shadow-soft dark:shadow-card-dark rounded-2xl',
    glass:
      'bg-white/80 dark:bg-[#111827]/75 backdrop-blur-xl border border-slate-200/70 dark:border-white/[0.08] shadow-soft rounded-xl',
    interactive:
      'bg-white dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/[0.08] shadow-card-light dark:shadow-card-dark rounded-xl hover:-translate-y-0.5 hover:shadow-subtle-hover hover:border-primary-500/40 dark:hover:border-primary-500/40 transition-all duration-150 cursor-pointer',
  };

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
