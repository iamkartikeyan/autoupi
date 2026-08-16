'use client';

import React from 'react';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  src?: string;
  className?: string;
}

export default function Avatar({
  name,
  size = 'md',
  src,
  className = '',
}: AvatarProps) {
  const sizeStyles = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  const initial = name?.trim() ? name.trim()[0].toUpperCase() : 'U';

  return (
    <div
      className={`rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 text-white font-bold flex items-center justify-center flex-shrink-0 shadow-sm select-none ${sizeStyles[size]} ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full object-cover rounded-2xl"
        />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}
