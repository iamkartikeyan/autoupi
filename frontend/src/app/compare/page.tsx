'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  Clock,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Landmark,
  CheckCircle2,
  DollarSign,
  Info,
  ChevronDown,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';

const COUNTRIES = [
  { name: 'United Arab Emirates', code: 'UAE', currency: 'AED', flag: '🇦🇪', rate: 0.04417 },
  { name: 'United States', code: 'USA', currency: 'USD', flag: '🇺🇸', rate: 0.01202 },
  { name: 'United Kingdom', code: 'UK', currency: 'GBP', flag: '🇬🇧', rate: 0.00948 },
  { name: 'Singapore', code: 'SGP', currency: 'SGD', flag: '🇸🇬', rate: 0.0162 },
  { name: 'Europe', code: 'EU', currency: 'EUR', flag: '🇪🇺', rate: 0.01115 },
];

const QUICK_AMOUNTS = [50000, 100000, 500000, 1000000, 2000000];

export default function ComparePage() {
  const router = useRouter();

  const [amount, setAmount] = useState(100000);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [transfersPerYear, setTransfersPerYear] = useState(12);

  // Calculations
  const calcs = useMemo(() => {
    const autoUpiFee = Math.round(amount * 0.02);
    const swiftFee = Math.round(amount * 0.065 + 1500);
    const westernUnionFee = Math.round(amount * 0.055 + 800);
    const paypalFee = Math.round(amount * 0.05 + 1200);

    const singleSavings = swiftFee - autoUpiFee;
    const annualSavings = singleSavings * transfersPerYear;

    const recipientGets = (amount * selectedCountry.rate).toFixed(2);

    const chartData = [
      { name: 'AutoUPI', fee: autoUpiFee, time: '8 Seconds', color: '#10B981' },
      { name: 'Western Union', fee: westernUnionFee, time: '1-2 Days', color: '#64748B' },
      { name: 'PayPal', fee: paypalFee, time: '2-3 Days', color: '#64748B' },
      { name: 'SWIFT Wire', fee: swiftFee, time: '3-5 Days', color: '#EF4444' },
    ];

    return {
      autoUpiFee,
      swiftFee,
      singleSavings,
      annualSavings,
      recipientGets,
      chartData,
    };
  }, [amount, selectedCountry, transfersPerYear]);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Fee & Speed Calculator
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Compare Transfer Costs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            See how much time and money you save with AutoUPI's 8-second 2% settlement.
          </p>
        </div>

        {/* Amount Input & Country Selector */}
        <Card variant="elevated" padding="lg" className="max-w-3xl mx-auto space-y-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Amount Slider */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Transfer Amount: <span className="text-primary-600 dark:text-primary-400 font-mono font-bold text-base">₹{amount.toLocaleString('en-IN')}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-primary-600 cursor-pointer"
              />
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar pt-1">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setAmount(amt)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap transition-colors ${
                      amount === amt
                        ? 'bg-primary-600 text-white'
                        : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    ₹{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Destination Country */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Destination Country
              </label>
              <select
                value={selectedCountry.code}
                onChange={(e) => {
                  const found = COUNTRIES.find((c) => c.code === e.target.value);
                  if (found) setSelectedCountry(found);
                }}
                className="input-field cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.currency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Annual Savings Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-glow-success">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                Estimated Annual Savings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black num">
                ₹{calcs.annualSavings.toLocaleString('en-IN')}
              </h2>
              <p className="text-xs opacity-90">
                Based on {transfersPerYear} transfers per year vs traditional SWIFT wire fees.
              </p>
            </div>

            <Button
              size="md"
              onClick={() => router.push(`/send?amount=${amount}&target=${selectedCountry.currency}`)}
              className="bg-white text-emerald-900 hover:bg-slate-100 font-bold flex-shrink-0"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Transfer ₹{amount.toLocaleString('en-IN')}
            </Button>
          </div>
        </Card>

        {/* Side-by-Side Comparison Grid */}
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: AutoUPI */}
          <Card variant="elevated" padding="lg" className="border-emerald-500/30 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">AutoUPI Protocol</h3>
              </div>
              <span className="badge-success">Recommended</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Settlement Time:</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">⚡ 8 Seconds</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Platform Fee (2%):</span>
                <span className="font-bold num text-slate-900 dark:text-white">
                  ₹{calcs.autoUpiFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">FX Markup:</span>
                <span className="font-bold text-emerald-600">0% (Interbank Rate)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Recipient Receives:</span>
                <span className="font-extrabold num text-emerald-600">
                  {selectedCountry.currency} {Number(calcs.recipientGets).toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Card 2: SWIFT */}
          <Card variant="default" padding="lg" className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Traditional SWIFT Wire</h3>
              </div>
              <span className="badge-danger">Legacy</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-500">
              <div className="flex justify-between py-1">
                <span>Settlement Time:</span>
                <span className="text-rose-500 font-bold">3 – 5 Business Days</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Estimated Fees:</span>
                <span className="text-rose-500 font-bold num">
                  ₹{calcs.swiftFee.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>FX Spread:</span>
                <span className="text-rose-500 font-bold">2.5% – 4% Hidden</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Intermediaries:</span>
                <span>2 – 4 Correspondent Banks</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Fee Comparison Chart */}
        <Card variant="default" padding="lg" className="max-w-4xl mx-auto space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Total Fee Comparison for ₹{amount.toLocaleString('en-IN')} Transfer
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calcs.chartData}>
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Fee']}
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="fee" radius={[8, 8, 0, 0]}>
                  {calcs.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
