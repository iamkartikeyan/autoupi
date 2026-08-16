'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Zap,
  Users,
  AlertCircle,
  ChevronRight,
  Info,
  Building,
  User,
  CreditCard,
  Lock,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import BottomSheet from '@/components/ui/BottomSheet';
import CurrencySelector, { SUPPORTED_CURRENCIES, CurrencyItem } from '@/components/ui/CurrencySelector';
import { transactionApi, getStoredUser, isAuthenticated } from '@/lib/api';

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

const RECENT_RECIPIENTS = [
  { id: 'ahmed@uae', name: 'Ahmed Al-Rashidi', currency: 'AED', flag: '🇦🇪', bank: 'Emirates NBD' },
  { id: 'john@uk', name: 'John Smith', currency: 'GBP', flag: '🇬🇧', bank: 'Barclays UK' },
  { id: 'sarah@us', name: 'Sarah Johnson', currency: 'USD', flag: '🇺🇸', bank: 'Chase Bank' },
];

const RATES: Record<string, Record<string, number>> = {
  INR: { AED: 0.04417, USD: 0.01202, EUR: 0.01115, GBP: 0.00948, SGD: 0.0162 },
  AED: { INR: 22.64, USD: 0.2723, EUR: 0.2499, GBP: 0.2128, AED: 1 },
  USD: { INR: 83.12, AED: 3.673, EUR: 0.918, GBP: 0.782, USD: 1 },
};

function SendPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const user = mounted ? getStoredUser() : null;

  // Form State
  const initialAmount = searchParams.get('amount') || '10000';
  const initialTarget = searchParams.get('target') || 'AED';

  const [amount, setAmount] = useState(initialAmount);
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [targetCurrency, setTargetCurrency] = useState<CurrencyItem>(
    SUPPORTED_CURRENCIES.find((c) => c.code === initialTarget) || SUPPORTED_CURRENCIES[1]
  );
  const [recipientId, setRecipientId] = useState('ahmed@uae');
  const [recipientName, setRecipientName] = useState('Ahmed Al-Rashidi');
  const [purpose, setPurpose] = useState('Family Support / Maintenance');
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rateTimer, setRateTimer] = useState(60);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const id = setInterval(() => {
      setRateTimer((t) => (t <= 1 ? 60 : t - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const rawAmount = parseFloat(amount.toString().replace(/,/g, '')) || 0;
  const rate = RATES[fromCurrency]?.[targetCurrency.code] || 0.04417;
  const fee = Math.round(rawAmount * 0.02 * 100) / 100;
  const totalDebit = rawAmount + fee;
  const recipientAmount = (rawAmount * rate).toFixed(2);
  const userBalance = user?.wallet_balance || 50000;

  const handleQuickRecipient = (rec: (typeof RECENT_RECIPIENTS)[0]) => {
    setRecipientId(rec.id);
    setRecipientName(rec.name);
    const foundCur = SUPPORTED_CURRENCIES.find((c) => c.code === rec.currency);
    if (foundCur) setTargetCurrency(foundCur);
    toast.success(`Selected ${rec.name}`);
  };

  const handleInitiate = async () => {
    if (rawAmount < 100) return toast.error('Minimum transfer amount is ₹100');
    if (!recipientId.trim()) return toast.error('Please specify a recipient identifier');
    if (!recipientName.trim()) return toast.error('Please enter the recipient full name');

    setLoading(true);
    try {
      const res = await transactionApi.initiate({
        amount: rawAmount,
        currency: fromCurrency,
        targetCurrency: targetCurrency.code,
        recipientId,
        recipientName,
      });

      const { transactionId } = res.data.data;
      toast.success('Transfer initiated! Entering 8s settlement tunnel...');
      setConfirmOpen(false);
      router.push(`/process?id=${transactionId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to initiate transfer');
      setLoading(false);
    }
  };

  return (
    <AppLayout maxWidth="max-w-3xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Send Money Internationally
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Instant 8-second settlement with flat 2% fee & guaranteed interbank rates.
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Rate Lock: {rateTimer}s</span>
          </div>
        </div>

        {/* Main Payment Card */}
        <Card variant="elevated" padding="lg" className="space-y-6 shadow-xl border-slate-200/80 dark:border-white/10">
          {/* Section 1: Amount Input */}
          <div className="space-y-3">
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>YOU SEND</span>
                <span>Available: ₹{userBalance.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  min="100"
                  step="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10,000"
                  className="w-full bg-transparent text-3xl sm:text-4xl font-black text-slate-900 dark:text-white focus:outline-none num"
                />
                <span className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-white/10 text-xs font-bold">
                  INR 🇮🇳
                </span>
              </div>
            </div>

            {/* Quick Amount Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-xs font-bold text-slate-400 flex-shrink-0">Quick:</span>
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(amt.toString())}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    rawAmount === amt
                      ? 'bg-primary-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-white/[0.05] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  +₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Recipient Gets with Currency Selector */}
          <div className="p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/[0.04] border border-emerald-200/80 dark:border-emerald-500/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-400">
              <span>RECIPIENT RECEIVES</span>
              <span>1 INR = {rate} {targetCurrency.code}</span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 dark:text-emerald-400 num">
                {targetCurrency.symbol} {Number(recipientAmount).toLocaleString()}
              </div>
              <CurrencySelector
                selectedCode={targetCurrency.code}
                onSelect={(c) => setTargetCurrency(c)}
                label="Select Recipient Currency"
              />
            </div>
          </div>

          {/* Section 3: Recent Recipients */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Recent Recipients
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {RECENT_RECIPIENTS.map((rec) => {
                const isSelected = recipientId === rec.id;
                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => handleQuickRecipient(rec)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'bg-primary-50 dark:bg-primary-500/10 border-primary-500/50 text-primary-700 dark:text-primary-300 shadow-sm'
                        : 'bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{rec.flag}</span>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs truncate">{rec.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{rec.bank}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Recipient Form Details */}
          <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Recipient Full Name
                </label>
                <input
                  type="text"
                  required
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="e.g. Ahmed Al-Rashidi"
                  className="input-field"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Account / IBAN / UPI ID
                </label>
                <input
                  type="text"
                  required
                  value={recipientId}
                  onChange={(e) => setRecipientId(e.target.value)}
                  placeholder="e.g. ahmed@uae or AE07033..."
                  className="input-field font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Transfer Purpose (FEMA LRS Compliance)
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="input-field cursor-pointer"
              >
                <option value="Family Support / Maintenance">Family Support / Maintenance</option>
                <option value="Education / University Fees">Education / University Fees</option>
                <option value="Medical Treatment">Medical Treatment Abroad</option>
                <option value="Business / Software Service">Business / Software Service</option>
                <option value="Travel / Tourism">Travel / Tourism</option>
              </select>
            </div>
          </div>

          {/* Section 5: Financial Fee Breakdown */}
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>Transfer Amount:</span>
              <span className="font-bold text-slate-900 dark:text-white num">
                ₹{rawAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span>AutoUPI Flat Fee (2%):</span>
              <span className="font-bold text-primary-600 dark:text-primary-400 num">
                ₹{fee.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between font-bold text-sm">
              <span className="text-slate-900 dark:text-white">Total Amount to Debit:</span>
              <span className="text-slate-900 dark:text-white num text-base">
                ₹{totalDebit.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            size="lg"
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="w-full text-base font-bold shadow-glow-primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Review & Send {targetCurrency.symbol}{recipientAmount}
          </Button>
        </Card>

        {/* Confirmation Bottom Sheet */}
        <BottomSheet
          isOpen={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Confirm International Transfer"
        >
          <div className="space-y-5">
            {/* Amount Banner */}
            <div className="text-center p-4 rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 text-white space-y-1">
              <p className="text-xs uppercase tracking-wider font-bold opacity-80">
                Recipient Gets
              </p>
              <h2 className="text-3xl font-black num">
                {targetCurrency.symbol} {Number(recipientAmount).toLocaleString()}
              </h2>
              <p className="text-xs opacity-90 font-medium">
                {targetCurrency.code} • Settled in ~8 Seconds
              </p>
            </div>

            {/* Details List */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Recipient:</span>
                <span className="font-bold text-slate-900 dark:text-white">{recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account / ID:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{recipientId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transfer Purpose:</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{purpose}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Guaranteed Rate:</span>
                <span className="font-bold num text-slate-900 dark:text-white">
                  1 INR = {rate} {targetCurrency.code}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-white/10 pt-2 font-bold text-sm">
                <span className="text-slate-900 dark:text-white">Total Debit from Bank:</span>
                <span className="text-primary-600 dark:text-primary-400 num">
                  ₹{totalDebit.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Confirm Actions */}
            <div className="space-y-2 pt-2">
              <Button
                size="lg"
                isLoading={loading}
                onClick={handleInitiate}
                className="w-full text-base font-bold shadow-glow-primary"
              >
                Authorize & Send Now ⚡
              </Button>
              <Button
                size="md"
                variant="ghost"
                onClick={() => setConfirmOpen(false)}
                className="w-full text-xs text-slate-500"
              >
                Cancel & Edit Details
              </Button>
            </div>
          </div>
        </BottomSheet>
      </div>
    </AppLayout>
  );
}

export default function SendPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SendPageContent />
    </Suspense>
  );
}
