'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { SecondaryButton } from './SecondaryButton';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'Unable to complete the requested action. Please check network connectivity and try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-card bg-rose-950/20 border border-rose-500/30 text-white">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-300 max-w-xs mb-4 leading-relaxed">{message}</p>
      {onRetry && (
        <SecondaryButton onClick={onRetry} icon={<RefreshCw className="w-4 h-4" />}>
          Retry Action
        </SecondaryButton>
      )}
    </div>
  );
};
