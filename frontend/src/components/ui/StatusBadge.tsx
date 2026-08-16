'use client';

import React from 'react';
import { CheckCircle2, Clock, Loader2, XCircle, ShieldCheck } from 'lucide-react';

export type StatusType =
  | 'COMPLETED'
  | 'PROCESSING'
  | 'PENDING'
  | 'FAILED'
  | 'VERIFIED'
  | 'ACTIVE'
  | 'HEALTHY'
  | 'WARNING';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}: StatusBadgeProps) {
  const norm = (status || '').toUpperCase();

  const configs: Record<
    string,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    COMPLETED: {
      label: 'Completed',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
    },
    PROCESSING: {
      label: 'Processing',
      bg: 'bg-blue-50 dark:bg-blue-500/10',
      text: 'text-blue-700 dark:text-blue-400',
      border: 'border-blue-200 dark:border-blue-500/20',
      icon: <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />,
    },
    PENDING: {
      label: 'Pending',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/20',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
    },
    FAILED: {
      label: 'Failed',
      bg: 'bg-rose-50 dark:bg-rose-500/10',
      text: 'text-rose-700 dark:text-rose-400',
      border: 'border-rose-200 dark:border-rose-500/20',
      icon: <XCircle className="w-3.5 h-3.5 text-rose-500" />,
    },
    VERIFIED: {
      label: 'Verified',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />,
    },
    HEALTHY: {
      label: 'Healthy',
      bg: 'bg-emerald-50 dark:bg-emerald-500/10',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-500/20',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />,
    },
    WARNING: {
      label: 'Warning',
      bg: 'bg-amber-50 dark:bg-amber-500/10',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-500/20',
      icon: <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />,
    },
  };

  const current = configs[norm] || {
    label: status,
    bg: 'bg-slate-100 dark:bg-white/[0.05]',
    text: 'text-slate-700 dark:text-slate-300',
    border: 'border-slate-200 dark:border-white/10',
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border select-none ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      {showIcon && current.icon}
      <span>{current.label}</span>
    </span>
  );
}
