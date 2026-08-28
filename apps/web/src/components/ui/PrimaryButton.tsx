'use client';

import React, { ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: 'primary' | 'gradient' | 'danger' | 'gpay' | 'outline';
  icon?: React.ReactNode;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  isLoading = false,
  disabled = false,
  variant = 'primary',
  icon,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'outline':
        return 'border border-[#444746] text-[#A8C7FA] hover:bg-[#1E1F24] font-medium';
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-500 text-white font-medium';
      case 'gradient':
      case 'primary':
      case 'gpay':
      default:
        return 'bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold shadow-none';
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`relative w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 ${getVariantStyles()} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[#041E49]" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};
