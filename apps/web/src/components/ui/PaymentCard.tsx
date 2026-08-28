'use client';

import React from 'react';
import { BankAccount } from '@auto-upi/shared';
import { Shield, Wifi, CreditCard } from 'lucide-react';

interface PaymentCardProps {
  account: BankAccount;
  userName?: string;
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  account,
  userName = 'Aarav Patel',
}) => {
  return (
    <div className="relative w-full aspect-[1.586/1] rounded-card-lg p-6 flex flex-col justify-between overflow-hidden shadow-elevated bg-gradient-to-br from-[#18191D] via-[#121316] to-[#000000] border border-surface-highlight text-white select-none">
      {/* Holographic light reflection streak */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top row: Bank Name & Contactless Icon */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-zinc-300" />
          <span className="text-sm font-bold tracking-wide text-zinc-200">
            {account.bankName}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-zinc-400">
          <Wifi className="w-4 h-4 rotate-90" />
          <Shield className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Center: Chip & Masked Number */}
      <div className="relative z-10 my-auto">
        <div className="w-10 h-7 rounded-lg bg-amber-200/90 border border-amber-300/60 shadow-inner flex items-center justify-center mb-3">
          <div className="w-8 h-4 border-t border-b border-amber-400/80 grid grid-cols-2 gap-1" />
        </div>

        <p className="font-mono text-base sm:text-lg tracking-widest text-zinc-200 font-semibold">
          {account.accountNumberMasked}
        </p>
      </div>

      {/* Bottom row: Cardholder, Currency, and Settlement Token Backing */}
      <div className="relative z-10 flex items-end justify-between text-xs">
        <div>
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Cardholder</p>
          <p className="font-semibold text-zinc-200 uppercase">{userName}</p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-zinc-400 uppercase tracking-wider">Custody Type</p>
          <p className="font-semibold text-zinc-200">
            {account.isReserveBacked ? '1:1 Custody Vault' : 'Standard'}
          </p>
        </div>
      </div>
    </div>
  );
};
