'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';
import { 
  Home, 
  Wallet, 
  History, 
  User, 
  Send, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  QrCode,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AppShellProps {
  children: ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const DESKTOP_NAV_ITEMS = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Pay anyone', href: '/pay', icon: Send },
    { label: 'Bank transfer', href: '/transfer', icon: Building2 },
    { label: 'QR code', href: '/qr', icon: QrCode },
    { label: 'Money', href: '/money', icon: Wallet },
    { label: 'You', href: '/you', icon: User },
    { label: 'Transaction history', href: '/activity', icon: History },
    { label: 'Offers & rewards', href: '/rewards', icon: Sparkles },
  ];

  const isCurrent = (href: string) => {
    if (href === '/') return pathname === '/' || pathname === '/home';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background text-gray-100 flex flex-col font-sans">
      {/* TopBar on mobile and compact header */}
      <TopBar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Persistent Left Sidebar */}
        <aside className="hidden sm:flex flex-col w-64 p-5 border-r border-[#23252B] shrink-0">
          {/* Quick Pay CTA */}
          <Link
            href="/pay"
            className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-medium text-sm shadow-md transition-all duration-150 active:scale-95 mb-6"
          >
            <Send className="w-4 h-4" />
            <span>Pay anyone</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 flex-1">
            {DESKTOP_NAV_ITEMS.map((item) => {
              const active = isCurrent(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-surface-elevated text-white font-bold border border-surface-highlight shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-100 hover:bg-surface/60'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Viewport Content Area */}
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 pb-24 sm:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
