'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { usePayment } from '../../context/PaymentContext';
import { 
  QrCode, 
  Bell, 
  Shield, 
  Sparkles, 
  X, 
  ArrowUpRight, 
  CheckCircle2,
  Gift,
  ShieldAlert,
  Clock,
  Check
} from 'lucide-react';

import { useRouter } from 'next/navigation';

interface TopBarProps {
  onScanClick?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onScanClick }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } = usePayment();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleScan = () => {
    if (onScanClick) {
      onScanClick();
    } else {
      router.push('/qr');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/90 backdrop-blur-xl border-b border-surface-highlight/40 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        {/* Brand & Dynamic Greeting */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-md">
              <span className="text-black font-black text-sm tracking-tighter">⚡</span>
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-zinc-200 transition-colors">
                Auto<span className="text-zinc-300">-UPI</span>
              </span>
              <p className="text-[10px] text-zinc-400 font-medium hidden sm:block">
                {getGreeting()}, {user.name.split(' ')[0]}
              </p>
            </div>
          </Link>
        </div>

        {/* Right Actions: Scan QR, Notifications, Profile Avatar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Scan QR */}
          <button
            onClick={handleScan}
            className="p-2 rounded-full bg-surface-elevated hover:bg-surface-highlight border border-surface-highlight text-zinc-300 hover:text-white transition-all active:scale-95 shadow-sm"
            title="Scan Global UPI QR Code"
          >
            <QrCode className="w-4 h-4" />
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full bg-surface-elevated hover:bg-surface-highlight border border-surface-highlight text-zinc-300 hover:text-white transition-all active:scale-95 shadow-sm"
              title="Recent Settlement Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-white text-[10px] font-bold text-black flex items-center justify-center border-2 border-background shadow-sm">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Drawer */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-surface-elevated border border-surface-highlight shadow-elevated z-50 p-4 animate-in fade-in zoom-in-95 duration-150 text-white">
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-surface-highlight">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">Settlement Notifications</h4>
                    {unreadNotificationsCount > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full bg-surface text-zinc-200 text-[10px] font-bold border border-surface-highlight">
                        {unreadNotificationsCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-zinc-300 hover:text-white hover:underline font-semibold"
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-zinc-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationAsRead(notif.id)}
                      className={`p-3 rounded-xl border text-xs transition-colors cursor-pointer ${
                        notif.isRead
                          ? 'bg-surface/50 border-surface-highlight/50 text-zinc-400'
                          : 'bg-surface border-surface-highlight text-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          {notif.type === 'PAYMENT' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                          {notif.type === 'REWARD' && <Gift className="w-3.5 h-3.5 text-amber-400" />}
                          {notif.type === 'SECURITY' && <Shield className="w-3.5 h-3.5 text-purple-400" />}
                          <span className="font-bold text-[11px]">{notif.title}</span>
                        </div>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {formatTimeAgo(notif.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/activity"
                  onClick={() => setShowNotifications(false)}
                  className="block text-center text-xs font-bold text-zinc-300 hover:text-white hover:underline mt-3 pt-2.5 border-t border-surface-highlight"
                >
                  View Complete Ledger & Receipts
                </Link>
              </div>
            )}
          </div>

          {/* User Profile Avatar with KYC Badge */}
          <Link
            href="/you"
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full bg-surface-elevated hover:bg-surface-highlight border border-surface-highlight transition-all active:scale-95"
          >
            <div className="relative">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-zinc-700"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-zinc-800 text-white font-bold text-xs flex items-center justify-center">
                  {user.name[0]}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-surface flex items-center justify-center text-[8px] text-white">
                ✓
              </span>
            </div>
            <span className="text-xs font-semibold text-zinc-200 hidden md:inline">
              {user.name.split(' ')[0]}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};
