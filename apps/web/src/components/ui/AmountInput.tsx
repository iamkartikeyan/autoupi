'use client';

import React from 'react';
import { SupportedCurrency, FXFeeBreakdown } from '@auto-upi/shared';
import { CurrencySelector } from './CurrencySelector';
import { Zap, ShieldCheck, Clock, ArrowRight } from 'lucide-react';

interface AmountInputProps {
  amount: number | string;
  onChange: (val: string) => void;
  sourceCurrency: SupportedCurrency;
  onSourceCurrencyChange: (curr: SupportedCurrency) => void;
  targetCurrency: SupportedCurrency;
  targetAmount?: number;
  exchangeRate?: number;
  feeBreakdown?: FXFeeBreakdown;
  availableBalance?: number;
  presets?: number[];
}

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onChange,
  sourceCurrency,
  onSourceCurrencyChange,
  targetCurrency,
  targetAmount,
  exchangeRate,
  feeBreakdown,
  availableBalance = 14850.50,
  presets = [50, 100, 250, 500, 1000],
}) => {
  const numAmount = Number(amount) || 0;
  const totalFee = feeBreakdown?.totalFees || (sourceCurrency === 'INR' ? 100 : 1.50);
  const totalDebit = numAmount + totalFee;

  return (
    <div className="flex flex-col items-center p-6 rounded-card bg-surface border border-surface-highlight/70 shadow-elevated">
      {/* Top Label & Balance info */}
      <div className="w-full flex items-center justify-between text-xs text-gray-400 mb-3">
        <span>Enter Remittance Amount</span>
        <button
          type="button"
          onClick={() => onChange(availableBalance.toString())}
          className="text-zinc-400 hover:text-white hover:underline"
        >
          Bal: {sourceCurrency} {availableBalance.toLocaleString()} (Max)
        </button>
      </div>

      {/* Main Centered Amount Input */}
      <div className="flex items-center justify-center gap-2 my-2 w-full">
        <CurrencySelector
          selectedCurrency={sourceCurrency}
          onSelect={onSourceCurrencyChange}
        />
        <input
          type="number"
          step="any"
          min="1"
          placeholder="0.00"
          value={amount}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent text-4xl sm:text-5xl font-extrabold text-white text-center focus:outline-none w-48 sm:w-64 tracking-tight"
          autoFocus
        />
      </div>

      {/* Fast Preset Chips */}
      <div className="w-full flex items-center justify-center gap-2 my-3 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset.toString())}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-surface-subtle hover:bg-surface-highlight border border-surface-highlight text-gray-300 hover:text-white transition-all duration-150 active:scale-95"
          >
            +{sourceCurrency === 'USD' ? '$' : ''}{preset}
          </button>
        ))}
      </div>

      {/* Detailed Live Corridor Breakdown Matrix */}
      {targetAmount !== undefined && exchangeRate && (
        <div className="w-full mt-3 pt-4 border-t border-surface-highlight space-y-2.5 animate-in fade-in">
          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* SEND */}
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-surface-highlight">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">SEND</span>
              <p className="font-bold text-white font-mono mt-0.5">
                {sourceCurrency} {numAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* FEE */}
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-surface-highlight">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">FEE</span>
              <p className="font-bold text-white font-mono mt-0.5">
                {sourceCurrency} {totalFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* FX RATE */}
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-surface-highlight">
              <span className="text-[10px] text-gray-400 font-semibold uppercase">FX RATE</span>
              <p className="font-bold text-zinc-200 font-mono mt-0.5">
                1 {sourceCurrency} = {exchangeRate.toFixed(4)} {targetCurrency}
              </p>
            </div>

            {/* RECIPIENT GETS */}
            <div className="p-2.5 rounded-xl bg-surface-elevated border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 font-semibold uppercase">RECIPIENT GETS</span>
              <p className="font-bold text-emerald-400 font-mono mt-0.5">
                {targetCurrency} {targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* TOTAL DEBIT & ESTIMATED SETTLEMENT TIME */}
          <div className="p-3 rounded-xl bg-surface-elevated border border-surface-highlight flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-gray-400 font-semibold uppercase">TOTAL DEBIT</span>
              <p className="font-extrabold text-white font-mono text-sm">
                {sourceCurrency} {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-right">
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>~60 sec target</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
