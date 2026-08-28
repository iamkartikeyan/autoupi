import React from 'react';

export const GlobalRemittanceHeroIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-auto' }) => {
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="globeGrad" x1="50" y1="30" x2="350" y2="210" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1E293B" stopOpacity="0.8" />
          <stop offset="1" stopColor="#0F172A" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="blueGlow" x1="120" y1="60" x2="280" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="orbitGrad" x1="60" y1="120" x2="340" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.4" />
          <stop offset="1" stopColor="#34D399" stopOpacity="0.8" />
        </linearGradient>
        <radialGradient id="centralPulse" cx="200" cy="120" r="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" stopOpacity="0.35" />
          <stop offset="1" stopColor="#2563EB" stopOpacity="0" />
        </radialGradient>
        <filter id="blurFilter" x="0" y="0" width="400" height="240" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {/* Ambient Backdrop Glow */}
      <circle cx="200" cy="120" r="80" fill="url(#centralPulse)" filter="url(#blurFilter)" />

      {/* Decorative Grid Lines */}
      <ellipse cx="200" cy="120" rx="140" ry="60" stroke="#30363D" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
      <ellipse cx="200" cy="120" rx="110" ry="40" stroke="#30363D" strokeWidth="1" opacity="0.4" />

      {/* Dynamic Curved Flow Rail */}
      <path
        d="M 60 160 C 120 70, 280 70, 340 160"
        stroke="url(#orbitGrad)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M 60 160 C 120 220, 280 220, 340 160"
        stroke="url(#orbitGrad)"
        strokeWidth="2"
        strokeDasharray="6 6"
        opacity="0.7"
      />

      {/* Central Atomic Liquidity Hub */}
      <circle cx="200" cy="120" r="38" fill="url(#globeGrad)" stroke="#3B82F6" strokeWidth="2" />
      <circle cx="200" cy="120" r="30" fill="#1E293B" stroke="#60A5FA" strokeWidth="1" strokeDasharray="3 3" />
      
      {/* Lightning / Atomic Bolt Icon inside Core */}
      <path
        d="M 203 104 L 193 118 L 201 118 L 197 136 L 207 122 L 199 122 Z"
        fill="#60A5FA"
      />

      {/* Origin Node (India UPI Hub) */}
      <g transform="translate(60, 160)">
        <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#10B981" strokeWidth="2" />
        <circle cx="0" cy="0" r="6" fill="#10B981" />
        <text x="0" y="32" fill="#9CA3AF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          🇮🇳 UPI Core
        </text>
      </g>

      {/* Intermediate Clearing Node */}
      <g transform="translate(200, 60)">
        <rect x="-24" y="-12" width="48" height="24" rx="12" fill="#1E2430" stroke="#818CF8" strokeWidth="1.5" />
        <text x="0" y="4" fill="#C7D2FE" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          FX ⚡
        </text>
      </g>

      {/* Destination Node (Global Corridors) */}
      <g transform="translate(340, 160)">
        <circle cx="0" cy="0" r="22" fill="#1E293B" stroke="#3B82F6" strokeWidth="2" />
        <circle cx="0" cy="0" r="6" fill="#60A5FA" />
        <text x="0" y="32" fill="#9CA3AF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
          Global Rail ⚡
        </text>
      </g>

      {/* Floating Speed Particles */}
      <circle cx="110" cy="115" r="3" fill="#38BDF8" />
      <circle cx="150" cy="90" r="2" fill="#818CF8" />
      <circle cx="250" cy="90" r="2.5" fill="#34D399" />
      <circle cx="290" cy="118" r="3" fill="#60A5FA" />
    </svg>
  );
};
