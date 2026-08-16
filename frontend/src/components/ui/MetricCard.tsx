'use client';

import React from 'react';
import Card from './Card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  className?: string;
}

export default function MetricCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  className = '',
}: MetricCardProps) {
  return (
    <Card variant="default" padding="md" className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-medium">{label}</span>
        {Icon && <Icon className="w-4 h-4 text-primary-500" />}
      </div>

      <div className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
        {value}
      </div>

      {(subtext || trend) && (
        <div className="flex items-center gap-2 text-[11px]">
          {trend && (
            <span
              className={`font-bold ${
                trend.isPositive
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {trend.value}
            </span>
          )}
          {subtext && <span className="text-slate-400 truncate">{subtext}</span>}
        </div>
      )}
    </Card>
  );
}
