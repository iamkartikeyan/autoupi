'use client';

import React from 'react';
import { Wallet, Send, PlusCircle, QrCode, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Button from './Button';

interface BalanceCardProps {
  balance: number;
  currency?: string;
  onSend?: () => void;
  onAddMoney?: () => void;
  onReceive?: () => void;
  className?: string;
}

export default function BalanceCard({
  balance,
  currency = 'INR',
  onSend,
  onAddMoney,
  onReceive,
  className = '',
}: BalanceCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white shadow-xl border border-white/10 ${className}`}
    >
      {/* Background Decor */}
      <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />

      <div className="flex justify-between items-start mb-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
            Total Available Balance
          </span>
          <div className="text-3xl sm:text-5xl font-black font-mono tracking-tight tabular-nums">
            {currency === 'INR' ? '₹' : currency} {balance.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-blue-100/80 font-medium">
            100% Reserve Backed • DICGC Insured
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-white/15 backdrop-blur-md text-white border border-white/10 shadow-sm">
          <Wallet className="w-6 h-6" />
        </div>
      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <button
          type="button"
          onClick={onSend}
          className="p-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-center space-y-1 backdrop-blur-md border border-white/10 shadow-sm"
        >
          <Send className="w-4 h-4 mx-auto" />
          <span className="block text-xs font-bold">Send</span>
        </button>

        <button
          type="button"
          onClick={onAddMoney}
          className="p-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-center space-y-1 backdrop-blur-md border border-white/10 shadow-sm"
        >
          <PlusCircle className="w-4 h-4 mx-auto" />
          <span className="block text-xs font-bold">Add Money</span>
        </button>

        <button
          type="button"
          onClick={onReceive}
          className="p-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-center space-y-1 backdrop-blur-md border border-white/10 shadow-sm"
        >
          <QrCode className="w-4 h-4 mx-auto" />
          <span className="block text-xs font-bold">Receive / QR</span>
        </button>
      </div>
    </div>
  );
}
