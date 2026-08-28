'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  // Hide BottomNav on chat pages and full-screen QR scanner to avoid mobile viewport overlap
  if (pathname.includes('/pay/chat') || pathname === '/qr') {
    return null;
  }

  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/home';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0F12] border-t border-[#1E1F24] px-4 py-2 sm:hidden">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {/* TAB 1: HOME */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center min-w-[72px] select-none group"
        >
          <div
            className={`flex items-center justify-center px-5 py-1 rounded-full transition-all duration-200 ${
              isCurrent('/')
                ? 'bg-[#0B57D0] text-white shadow-sm'
                : 'text-[#8E918F] group-hover:text-white'
            }`}
          >
            <Home className={`w-5 h-5 ${isCurrent('/') ? 'fill-white stroke-white' : 'stroke-[2]'}`} />
          </div>
          <span
            className={`text-xs mt-1 transition-colors duration-200 ${
              isCurrent('/') ? 'font-medium text-white' : 'font-normal text-[#8E918F]'
            }`}
          >
            Home
          </span>
        </Link>

        {/* TAB 2: MONEY */}
        <Link
          href="/money"
          className="flex flex-col items-center justify-center min-w-[72px] select-none group"
        >
          <div
            className={`flex items-center justify-center px-5 py-1 rounded-full transition-all duration-200 ${
              isCurrent('/money')
                ? 'bg-[#0B57D0] text-white shadow-sm'
                : 'text-[#8E918F] group-hover:text-white'
            }`}
          >
            <div className="w-5 h-5 rounded-full border-[1.8px] border-current flex items-center justify-center font-bold text-[11px] leading-none">
              ₹
            </div>
          </div>
          <span
            className={`text-xs mt-1 transition-colors duration-200 ${
              isCurrent('/money') ? 'font-medium text-white' : 'font-normal text-[#8E918F]'
            }`}
          >
            Money
          </span>
        </Link>

        {/* TAB 3: YOU */}
        <Link
          href="/you"
          className="flex flex-col items-center justify-center min-w-[72px] select-none group"
        >
          <div
            className={`flex items-center justify-center px-5 py-1 rounded-full transition-all duration-200 ${
              isCurrent('/you')
                ? 'bg-[#0B57D0] text-white shadow-sm'
                : 'text-[#8E918F] group-hover:text-white'
            }`}
          >
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="You" className="w-5 h-5 rounded-full object-cover border border-current" />
            ) : (
              <User className="w-5 h-5 stroke-[2]" />
            )}
          </div>
          <span
            className={`text-xs mt-1 transition-colors duration-200 ${
              isCurrent('/you') ? 'font-medium text-white' : 'font-normal text-[#8E918F]'
            }`}
          >
            You
          </span>
        </Link>
      </div>
    </nav>
  );
};
