'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, IndianRupee, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Money', href: '/money', icon: IndianRupee },
    { label: 'You', href: '/you', icon: User },
  ];

  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/home';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121316] border-t border-[#23252B] px-6 py-2 sm:hidden">
      <div className="flex items-center justify-around max-w-sm mx-auto">
        {NAV_ITEMS.map((item) => {
          const active = isCurrent(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center min-w-[64px] select-none group"
            >
              {/* Google Material 3 Active Pill */}
              <div
                className={`flex items-center justify-center px-5 py-1 rounded-full transition-all duration-200 ${
                  active
                    ? 'bg-[#004A77] text-[#C2E7FF]'
                    : 'text-[#C4C7C5] group-hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
              </div>
              <span
                className={`text-xs mt-1 transition-colors duration-200 ${
                  active ? 'font-bold text-[#E3E3E3]' : 'font-medium text-[#C4C7C5]'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
