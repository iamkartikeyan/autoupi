'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, Send, LayoutDashboard, Wallet, Globe2 } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Send', href: '/send', icon: Send, highlight: true },
    { label: 'History', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'Explorer', href: '/explorer', icon: Globe2 },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-footer safe-bottom">
      <nav className="flex items-center justify-around px-2 h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative -top-3 flex flex-col items-center group"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-glow-primary transition-transform duration-150 active:scale-90 ${
                    isActive
                      ? 'bg-primary-600 ring-4 ring-primary-500/20'
                      : 'bg-gradient-to-tr from-primary-600 to-accent-500 hover:scale-105'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-0.5 ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 py-1.5 active:scale-95 transition-transform"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors duration-150 ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary-600 dark:bg-primary-400"
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                  />
                )}
              </div>
              <span
                className={`text-[10px] font-semibold mt-1 transition-colors duration-150 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
