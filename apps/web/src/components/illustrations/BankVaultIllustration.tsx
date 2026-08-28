import React from 'react';

export const BankVaultIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="shieldGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="glowLine" x1="40" y1="20" x2="80" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>

      {/* Outer Shield Container */}
      <path
        d="M 60 15 C 85 15, 100 25, 100 50 C 100 85, 60 105, 60 105 C 60 105, 20 85, 20 50 C 20 25, 35 15, 60 15 Z"
        fill="url(#shieldGrad)"
        stroke="#10B981"
        strokeWidth="2.5"
      />

      {/* Inner Vault Safe Dial */}
      <circle cx="60" cy="58" r="22" fill="#161B22" stroke="#30363D" strokeWidth="2" />
      <circle cx="60" cy="58" r="15" fill="#1E293B" stroke="url(#glowLine)" strokeWidth="2" strokeDasharray="4 2" />
      
      {/* Vault Wheel Spokes */}
      <line x1="60" y1="46" x2="60" y2="70" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <line x1="48" y1="58" x2="72" y2="58" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      <circle cx="60" cy="58" r="4" fill="#6EE7B7" />

      {/* Checkmark verification star */}
      <circle cx="85" cy="30" r="10" fill="#065F46" stroke="#10B981" strokeWidth="1.5" />
      <path d="M 81 30 L 84 33 L 89 27" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
