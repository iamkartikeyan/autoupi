'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading payment data...',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-card bg-surface/40 border border-surface-highlight/30">
      <div className="w-12 h-12 rounded-2xl bg-surface-elevated border border-surface-highlight flex items-center justify-center text-white mb-3">
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      </div>
      <p className="text-xs font-semibold text-zinc-300">{message}</p>
    </div>
  );
};
