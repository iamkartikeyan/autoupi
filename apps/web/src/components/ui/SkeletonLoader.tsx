'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse rounded-xl bg-surface-highlight/40 ${className}`}
    />
  );
};

export const HomeSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Search Bar Skeleton */}
      <Skeleton className="h-12 w-full rounded-full" />

      {/* Balance Card Skeleton */}
      <div className="p-6 rounded-card bg-surface border border-surface-highlight space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Skeleton className="h-10 rounded-full" />
          <Skeleton className="h-10 rounded-full" />
        </div>
      </div>

      {/* Quick Actions Skeleton */}
      <div className="p-4 rounded-card bg-surface border border-surface-highlight grid grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            <Skeleton className="w-13 h-13 rounded-2xl" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* People Skeleton */}
      <div className="p-5 rounded-card bg-surface border border-surface-highlight space-y-4">
        <Skeleton className="h-5 w-28" />
        <div className="flex gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-14 h-14 rounded-full" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
