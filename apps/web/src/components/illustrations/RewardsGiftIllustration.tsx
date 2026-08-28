import React from 'react';

export const RewardsGiftIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="giftGrad" x1="20" y1="30" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#D97706" />
        </linearGradient>
        <linearGradient id="coinGrad" x1="60" y1="10" x2="90" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FCD34D" />
          <stop offset="1" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Floating Gold Coins */}
      <circle cx="35" cy="25" r="10" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="1.5" />
      <text x="35" y="29" fill="#78350F" fontSize="10" fontWeight="bold" textAnchor="middle">₹</text>

      <circle cx="85" cy="22" r="12" fill="url(#coinGrad)" stroke="#B45309" strokeWidth="1.5" />
      <text x="85" y="27" fill="#78350F" fontSize="12" fontWeight="bold" textAnchor="middle">$</text>

      {/* Gift Box Base */}
      <rect x="30" y="55" width="60" height="50" rx="10" fill="url(#giftGrad)" stroke="#B45309" strokeWidth="2" />
      
      {/* Box Lid */}
      <rect x="25" y="44" width="70" height="15" rx="6" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />

      {/* Ribbon Vertical */}
      <rect x="54" y="44" width="12" height="61" fill="#78350F" opacity="0.3" />

      {/* Ribbon Bow */}
      <path d="M 60 44 C 50 32, 38 38, 48 44 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
      <path d="M 60 44 C 70 32, 82 38, 72 44 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
      <circle cx="60" cy="44" r="4" fill="#FCD34D" stroke="#B45309" strokeWidth="1" />

      {/* Sparkles */}
      <path d="M 20 45 L 23 48 L 20 51 L 17 48 Z" fill="#FDE68A" />
      <path d="M 98 42 L 101 45 L 98 48 L 95 45 Z" fill="#FDE68A" />
    </svg>
  );
};
