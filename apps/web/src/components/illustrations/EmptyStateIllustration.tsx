import React from 'react';

export const EmptyStateIllustration: React.FC<{ className?: string }> = ({ className = 'w-24 h-24' }) => {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="emptyGrad" x1="20" y1="20" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Layered Document Folders */}
      <rect x="25" y="35" width="70" height="55" rx="14" fill="#161B22" stroke="#30363D" strokeWidth="1.5" />
      <rect x="30" y="25" width="60" height="20" rx="6" fill="#1E2430" stroke="#30363D" strokeWidth="1.5" />
      
      {/* Front Document Card */}
      <rect x="35" y="45" width="50" height="40" rx="10" fill="url(#emptyGrad)" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="3 3" />
      
      {/* Search Lens / Empty Marker */}
      <circle cx="60" cy="62" r="10" stroke="#60A5FA" strokeWidth="2" />
      <line x1="67" y1="69" x2="75" y2="77" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />

      <circle cx="60" cy="62" r="3" fill="#3B82F6" opacity="0.6" />
    </svg>
  );
};
