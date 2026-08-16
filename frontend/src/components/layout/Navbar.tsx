'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Send,
  LayoutDashboard,
  Wallet,
  Globe2,
  GitCompare,
  Cpu,
  ShieldCheck,
  LogOut,
  User,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { getStoredUser, clearAuth, isAuthenticated } from '@/lib/api';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authed = mounted ? isAuthenticated() : false;
  const user = mounted ? getStoredUser() : null;

  const navLinks = [
    { label: 'Send', href: '/send', icon: Send },
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
    { label: 'Explorer', href: '/explorer', icon: Globe2 },
    { label: 'Compare', href: '/compare', icon: GitCompare },
    { label: 'Protocol Demo', href: '/blockchain-demo', icon: Cpu },
  ];

  const handleLogout = () => {
    clearAuth();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <BrandLogo size={36} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/70 dark:bg-white/[0.04] p-1.5 rounded-2xl border border-slate-200/60 dark:border-white/[0.06]">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white dark:bg-white/10 text-primary-600 dark:text-white shadow-sm font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-primary-500' : ''}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions on Right */}
          <div className="flex items-center gap-2.5">
            {/* Live Network Status Badge (Desktop) */}
            <Link
              href="/trust-center"
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-500/20 hover:opacity-80 transition-opacity"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Network Active</span>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile or Login CTA */}
            {authed && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center font-bold text-xs">
                    {(user.full_name as string)?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold truncate max-w-[100px]">
                    {(user.full_name as string)?.split(' ')[0] || 'Account'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-white/5">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {user.full_name as string}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {user.email as string}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/wallet"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                        >
                          <Wallet className="w-4 h-4 text-slate-400" />
                          <span>My Wallet</span>
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-primary-600 dark:text-primary-400 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            <span>Admin Command</span>
                          </Link>
                        )}
                      </div>

                      <div className="pt-1 border-t border-slate-100 dark:border-white/5">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/send"
                  className="btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button (Hamburger for secondary links) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Fullscreen Drawer for additional destinations */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Main Navigation
              </p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.05]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{link.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-white/5 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1">
                Trust & Security
              </p>
              <Link
                href="/compliance"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
              >
                <span>🛡️ RBI Compliance & DICGC</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                href="/trust-center"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05]"
              >
                <span>⚡ Live Network Uptime</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
