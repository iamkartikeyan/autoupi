'use client';

import React, { useState, useEffect } from 'react';
import { FXQuote, Beneficiary, BankAccount } from '@auto-upi/shared';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { 
  ShieldCheck, 
  ArrowRight, 
  Clock, 
  Lock, 
  AlertCircle, 
  Check, 
  Zap, 
  Building2, 
  RefreshCw,
  X
} from 'lucide-react';

interface ConfirmationSheetProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary: Beneficiary;
  senderAccount: BankAccount;
  quote: FXQuote;
  onConfirm: () => void;
  onRefreshQuote: () => void;
  isLoading?: boolean;
}

export const ConfirmationSheet: React.FC<ConfirmationSheetProps> = ({
  isOpen,
  onClose,
  beneficiary,
  senderAccount,
  quote,
  onConfirm,
  onRefreshQuote,
  isLoading = false,
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(quote.expiresInSeconds || 30);

  useEffect(() => {
    if (!isOpen) return;
    setSecondsRemaining(quote.expiresInSeconds || 30);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, quote]);

  if (!isOpen) return null;

  const isExpired = secondsRemaining <= 0;
  const formattedCountdown = `00:${secondsRemaining < 10 ? '0' : ''}${secondsRemaining}`;

  const sendAmount = quote.sourceAmount;
  const feeAmount = quote.feeBreakdown.totalFees;
  const totalDebit = quote.totalDebitAmount || sendAmount + feeAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-elevated border border-surface-highlight rounded-t-[32px] sm:rounded-card p-6 shadow-elevated text-white max-h-[92vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface border border-surface-highlight text-zinc-300 flex items-center justify-center">
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Payment Preview & Rate Lock</h3>
              <p className="text-xs text-gray-400">Institutional atomic settlement order</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 my-4 pr-1 -mr-1">
          {/* Rate Lock Timer Banner */}
          <div
            className={`p-3 rounded-2xl flex items-center justify-between transition-colors ${
              isExpired
                ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                : 'bg-surface border border-surface-highlight text-zinc-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className={`w-4 h-4 ${isExpired ? 'text-rose-400' : 'text-zinc-300'}`} />
              <span className="text-xs font-bold">
                {isExpired ? 'Rate Lock Expired' : 'Guaranteed Rate Lock Window'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black tracking-wider">
                {formattedCountdown}
              </span>
              {isExpired && (
                <button
                  onClick={onRefreshQuote}
                  className="px-2.5 py-1 rounded-full bg-white text-black text-[11px] font-bold flex items-center gap-1 hover:bg-zinc-200"
                >
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span>Re-quote</span>
                </button>
              )}
            </div>
          </div>

          {/* Key Financial Metric Cards (SEND / FEE / FX / RECIPIENT / DEBIT) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* SEND */}
            <div className="p-3 rounded-2xl bg-surface border border-surface-highlight">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">SEND</p>
              <p className="text-base font-black text-white font-mono mt-0.5">
                {quote.sourceCurrency} {sendAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* FEE */}
            <div className="p-3 rounded-2xl bg-surface border border-surface-highlight">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">FEE</p>
              <p className="text-base font-black text-white font-mono mt-0.5">
                {quote.sourceCurrency} {feeAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>

            {/* FX RATE */}
            <div className="p-3 rounded-2xl bg-surface border border-surface-highlight">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">FX RATE</p>
              <p className="text-sm font-black text-zinc-200 font-mono mt-0.5">
                1 {quote.sourceCurrency} = {quote.exchangeRate.toFixed(4)} {quote.targetCurrency}
              </p>
            </div>

            {/* RECIPIENT GETS */}
            <div className="p-3 rounded-2xl bg-surface border border-emerald-500/30">
              <p className="text-[10px] text-emerald-400 uppercase font-semibold">RECIPIENT GETS</p>
              <p className="text-base font-black text-emerald-400 font-mono mt-0.5">
                {quote.targetCurrency} {quote.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          {/* Total Debit & Estimated Settlement */}
          <div className="p-4 rounded-2xl bg-surface border border-surface-highlight flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">TOTAL DEBIT</p>
              <p className="text-lg font-black text-white font-mono">
                {quote.sourceCurrency} {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-gray-400 font-mono">Debited from {senderAccount.bankName} (•••• 4829)</p>
            </div>

            <div className="text-right">
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold inline-flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>{quote.estimatedSettlementTime || '~60 sec target'}</span>
              </span>
              <p className="text-[10px] text-gray-400 mt-1">Instant Bank Clearing</p>
            </div>
          </div>

          {/* Beneficiary Recipient Card */}
          <div className="p-3.5 rounded-2xl bg-surface border border-surface-highlight flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                {beneficiary.avatarUrl ? (
                  <img
                    src={beneficiary.avatarUrl}
                    alt={beneficiary.name}
                    className="w-11 h-11 rounded-full object-cover border border-zinc-700"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-xs">
                    {beneficiary.initials}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 text-xs bg-surface-elevated rounded-full w-4 h-4 flex items-center justify-center border border-surface-highlight">
                  {beneficiary.flagEmoji}
                </span>
              </div>

              <div>
                <p className="text-xs font-bold text-white">{beneficiary.name}</p>
                <p className="text-[11px] text-gray-400">
                  {beneficiary.upiIdOrHandle} • {beneficiary.bankName}
                </p>
                <p className="text-[10px] text-gray-500 font-mono">
                  Account: {beneficiary.accountNumberMasked} • {beneficiary.routingIdentifier}
                </p>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
              Verified
            </span>
          </div>

          {/* Compliance & Regulatory Notice */}
          <div className="p-3.5 rounded-2xl bg-surface-subtle border border-surface-highlight text-[11px] text-gray-300 space-y-1">
            <div className="flex items-center gap-1.5 text-gray-200 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure Banking Rail</span>
            </div>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              This payment is authorized securely under partner-bank clearing corridors and official domestic UPI networks.
            </p>
          </div>

          {/* Terms & Conditions Checkbox */}
          <label className="flex items-start gap-2.5 text-xs text-gray-300 cursor-pointer pt-1 select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-surface-highlight accent-white"
            />
            <span>
              I agree to the guaranteed exchange rate and authorize immediate escrow reserve lock of{' '}
              <strong className="text-white">
                {quote.sourceCurrency} {totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </strong>
              .
            </span>
          </label>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-surface-highlight flex gap-2.5">
          <SecondaryButton onClick={onClose} className="w-1/3">
            Cancel
          </SecondaryButton>
          <PrimaryButton
            onClick={onConfirm}
            isLoading={isLoading}
            disabled={!agreedToTerms || isExpired}
            variant="gradient"
            className="w-2/3 shadow-md"
          >
            {isExpired ? 'Refresh Quote to Continue' : 'Authorize & Send'}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
