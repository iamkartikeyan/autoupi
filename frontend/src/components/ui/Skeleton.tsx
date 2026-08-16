'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
}

export default function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded-md h-4 w-full',
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
  };

  const style: React.CSSProperties = {
    width: width,
    height: height,
  };

  return (
    <div
      style={style}
      className={`bg-slate-200 dark:bg-white/[0.06] animate-pulse ${variantStyles[variant]} ${className}`}
    />
  );
}
