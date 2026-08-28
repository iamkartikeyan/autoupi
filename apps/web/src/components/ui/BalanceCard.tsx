'use client';

import React, { useState } from 'react';
import { BankAccount } from '@auto-upi/shared';
import { ShieldCheck, Eye, EyeOff, ArrowUpRight, Plus, Building2, Sparkles } from 'lucide-react';

interface BalanceCardProps {
  accounts: BankAccount[];
  onTransferClick?: () => void;
  onAddMoneyClick?: () => void;
}

export const BalanceCard: React.FC<BalanceCardProps> = ({
  accounts,
  onTransferClick,
  onAddMoneyClick,
}) => {
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    accounts[0]?.id || 'acc_chase_usd_01'
  );

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId) || accounts[0];

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="relative overflow-hidden rounded-card bg-surface border border-surface-highlight shadow-elevated p-6 text-white">
      {/* Subtle ambient light gradient in top corner */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with bank selector and reserve backing indicator */}
      <div className="relative z-10 flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-surface-elevated border border-surface-highlight flex items-center justify-center text-zinc-300">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-zinc-200 hover:text-white cursor-pointer focus:outline-none pr-2"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-surface-elevated text-zinc-100">
                  {acc.bankName} ({acc.accountNumberMasked})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-400">
              {selectedAccount?.accountType.replace('_', ' ')} • {selectedAccount?.currency}
            </p>
          </div>
        </div>

        {/* Primary Bank badge */}
        {selectedAccount?.isPrimary && (
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#162E33] border border-teal-500/30 text-teal-300 text-[11px] font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Primary Account</span>
          </div>
        )}
      </div>

      {/* Main Balance Display */}
      <div className="relative z-10 my-4">
        <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          <span>Available Balance</span>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-zinc-400 hover:text-zinc-200 transition-colors p-0.5"
            title={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="flex items-baseline gap-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">
            {showBalance && selectedAccount
              ? formatCurrency(selectedAccount.balance, selectedAccount.currency)
              : '••••••••'}
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-surface-elevated text-zinc-300 border border-surface-highlight font-mono font-medium">
            {selectedAccount?.currency || 'USD'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-surface-highlight/40">
        <button
          onClick={onTransferClick}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-white hover:bg-zinc-200 text-black font-bold text-xs transition-all duration-200 shadow-md active:scale-95"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Pay Globally</span>
        </button>

        <button
          onClick={onAddMoneyClick}
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-surface-elevated hover:bg-surface-highlight text-zinc-200 font-semibold text-xs border border-surface-highlight transition-all duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4 text-zinc-300" />
          <span>Add Reserve</span>
        </button>
      </div>
    </div>
  );
};
