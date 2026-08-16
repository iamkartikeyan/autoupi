'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  Laptop,
  Lock,
  Globe,
  LogOut,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Mail,
  KeyRound,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import StatusBadge from '@/components/ui/StatusBadge';
import { useTheme } from '@/context/ThemeContext';
import { getStoredUser, clearAuth, isAuthenticated } from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const user = mounted ? getStoredUser() : null;

  // Toggle state
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);
  const [emailReceipts, setEmailReceipts] = useState(true);
  const [smsUpdates, setSmsUpdates] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    toast.success('Signed out safely');
    router.push('/login');
  };

  return (
    <AppLayout maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Account & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your personal profile, security, and settlement settings.
          </p>
        </div>

        {/* Profile Card */}
        <Card variant="elevated" padding="lg" className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar name={user?.full_name || 'User'} size="lg" />
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                  {user?.full_name || 'Demo Member'}
                </h2>
                <StatusBadge status="VERIFIED" size="sm" />
              </div>
              <p className="text-xs text-slate-500 font-mono">{user?.phone || '+91 1234567890'}</p>
              <p className="text-xs text-slate-400">{user?.email || 'demo@autoupi.com'}</p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-500">KYC Status:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Tier-2 Full Remittance Verified
            </span>
          </div>
        </Card>

        {/* Theme Preferences */}
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Interface Theme</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose light, dark, or follow system settings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'dark', label: 'Dark Mode', icon: Moon },
              { id: 'light', label: 'Light Mode', icon: Sun },
              { id: 'system', label: 'System', icon: Laptop },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = theme === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id as any)}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-500 text-primary-600 dark:text-primary-400 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Security & Alerts */}
        <Card variant="default" padding="lg" className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Security & Notification Controls
          </h2>

          <div className="space-y-3 divide-y divide-slate-100 dark:divide-white/5 text-xs">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Biometric / OTP 2-Factor Authentication
                </span>
                <p className="text-slate-500">Require OTP code for any international transaction.</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-4 h-4 accent-primary-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  WhatsApp Instant Transaction Alerts
                </span>
                <p className="text-slate-500">Receive instant UTR & settlement receipts via WhatsApp.</p>
              </div>
              <input
                type="checkbox"
                checked={whatsappAlerts}
                onChange={(e) => setWhatsappAlerts(e.target.checked)}
                className="w-4 h-4 accent-primary-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Email PDF Tax Invoices
                </span>
                <p className="text-slate-500">Automatically dispatch GST/Tax receipt to your inbox.</p>
              </div>
              <input
                type="checkbox"
                checked={emailReceipts}
                onChange={(e) => setEmailReceipts(e.target.checked)}
                className="w-4 h-4 accent-primary-600 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Sign Out Button */}
        <Card variant="default" padding="md">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span>Sign Out of AutoUPI</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        </Card>
      </div>
    </AppLayout>
  );
}
