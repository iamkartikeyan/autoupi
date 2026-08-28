import React from 'react';

export const QRPayIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="phoneGrad" x1="25" y1="15" x2="95" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Phone Outline */}
      <rect x="30" y="10" width="60" height="100" rx="16" fill="url(#phoneGrad)" stroke="#3B82F6" strokeWidth="2" />
      <rect x="52" y="16" width="16" height="4" rx="2" fill="#30363D" />

      {/* QR Code Frame */}
      <rect x="40" y="30" width="40" height="40" rx="8" fill="#161B22" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="3 3" />
      
      {/* QR Code Matrix Elements */}
      <rect x="45" y="35" width="8" height="8" rx="2" fill="#3B82F6" />
      <rect x="67" y="35" width="8" height="8" rx="2" fill="#3B82F6" />
      <rect x="45" y="57" width="8" height="8" rx="2" fill="#3B82F6" />
      
      <rect x="57" y="47" width="6" height="6" rx="1" fill="#60A5FA" />
      <rect x="67" y="57" width="4" height="4" rx="1" fill="#34D399" />
      <rect x="57" y="35" width="4" height="4" rx="1" fill="#93C5FD" />

      {/* Laser Scanning Line */}
      <line x1="38" y1="50" x2="82" y2="50" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="82" cy="50" r="3" fill="#38BDF8" />

      {/* Touch Button */}
      <circle cx="60" cy="94" r="6" fill="#1E293B" stroke="#30363D" strokeWidth="1.5" />
    </svg>
  );
};
