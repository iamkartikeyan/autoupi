'use client';

import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-12 px-4 space-y-4 max-w-sm mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto">
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction} className="font-bold">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
