'use client';

import React from 'react';
import { Plus } from 'lucide-react';
import { SecondaryButton } from './SecondaryButton';
import { EmptyStateIllustration } from '../illustrations/EmptyStateIllustration';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-card bg-surface/50 border border-surface-highlight/40">
      <div className="mb-3">
        {icon || <EmptyStateIllustration className="w-20 h-20 mx-auto" />}
      </div>
      <h3 className="text-sm font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-400 max-w-xs mb-4 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <SecondaryButton onClick={onAction} icon={<Plus className="w-4 h-4" />}>
          {actionLabel}
        </SecondaryButton>
      )}
    </div>
  );
};
