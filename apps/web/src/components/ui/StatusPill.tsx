'use client';

import React from 'react';
import { PaymentStatus } from '@auto-upi/shared';
import { CheckCircle2, Clock, ShieldCheck, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface StatusPillProps {
  status: PaymentStatus;
  size?: 'sm' | 'md';
}

export const StatusPill: React.FC<StatusPillProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'RECIPIENT_CREDITED':
        return {
          label: 'Completed',
          bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'BLOCKCHAIN_SETTLED':
      case 'LOCAL_SETTLEMENT':
        return {
          label: 'Domestic Clearing',
          bg: 'bg-blue-950/70 border-blue-500/40 text-blue-300',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />,
        };
      case 'TOKEN_MINTED':
      case 'RESERVE_LOCKED':
        return {
          label: 'Processing',
          bg: 'bg-indigo-950/70 border-indigo-500/40 text-indigo-300',
          icon: <Sparkles className="w-3.5 h-3.5 text-indigo-400" />,
        };
      case 'FX_LOCKED':
      case 'INITIATED':
        return {
          label: 'In Progress',
          bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
          icon: <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />,
        };
      case 'REFUNDED':
        return {
          label: 'Refunded',
          bg: 'bg-teal-950/70 border-teal-500/40 text-teal-300',
          icon: <RefreshCw className="w-3.5 h-3.5 text-teal-400" />,
        };
      case 'FAILED':
      default:
        return {
          label: 'Failed',
          bg: 'bg-rose-950/70 border-rose-500/40 text-rose-300',
          icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
        };
    }
  };

  const config = getStatusConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${config.bg} ${sizeClasses}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
