'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle2,
  Clock,
  Globe2,
  Lock,
  Coins,
  Activity,
  Flame,
  Landmark,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowDownRight,
  Eye,
  Check,
  ShieldCheck,
  Cpu,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import CurrencySelector, { SUPPORTED_CURRENCIES, CurrencyItem } from '@/components/ui/CurrencySelector';

// Live Rates for Ticker
const LIVE_RATES = [
  { pair: 'INR / AED', rate: '0.04417', change: '+0.12%', up: true, flag: '🇦🇪' },
  { pair: 'INR / USD', rate: '0.01202', change: '+0.05%', up: true, flag: '🇺🇸' },
  { pair: 'INR / EUR', rate: '0.01115', change: '-0.02%', up: false, flag: '🇪🇺' },
  { pair: 'INR / GBP', rate: '0.00948', change: '+0.08%', up: true, flag: '🇬🇧' },
  { pair: 'INR / SGD', rate: '0.01620', change: '+0.15%', up: true, flag: '🇸🇬' },
  { pair: 'AED / INR', rate: '22.64', change: '-0.12%', up: false, flag: '🇮🇳' },
];

// Exchange Rate Multipliers (Base: INR)
const RATES_MAP: Record<string, number> = {
  AED: 0.04417,
  USD: 0.01202,
  EUR: 0.01115,
  GBP: 0.00948,
  SGD: 0.01620,
};

// Security Visualizer Steps
const SECURITY_STEPS = [
  {
    id: 'fiat_in',
    title: '1. Fiat In',
    icon: Landmark,
    simple: 'You initiate transfer via UPI/IMPS from any Indian bank account.',
    tech: 'ISO 20022 compliant messaging routed through NPCI authorized gateway.',
    badge: 'UPI / IMPS Gateway',
  },
  {
    id: 'collateral',
    title: '2. Reserve Lock',
    icon: Lock,
    simple: '100% equivalent INR is locked in escrow with RBI-regulated partner bank.',
    tech: 'DICGC Insured (up to ₹5 Lakh per depositor). 1:1 statutory liquidity reserve.',
    badge: '100% Escrow Backed',
  },
  {
    id: 'token_mint',
    title: '3. Token Mint',
    icon: Coins,
    simple: 'Digital settlement tokens are created for instantaneous value transfer.',
    tech: 'Classified as Bank Deposit Claim token, strictly pegged 1:1 with zero volatility.',
    badge: '1:1 Fixed Peg',
  },
  {
    id: 'settlement',
    title: '4. Protocol Travel',
    icon: Activity,
    simple: 'Tokens move across our GIFT City L2 channel in sub-seconds.',
    tech: 'Private consensus engine with SHA-256 block mining and cryptographic validation.',
    badge: 'L2 Settlement Layer',
  },
  {
    id: 'burn_payout',
    title: '5. Instant Payout',
    icon: Flame,
    simple: 'Tokens burn and destination currency (AED, USD, EUR) is paid to recipient.',
    tech: 'Pre-funded foreign liquidity pools release instant domestic wire/ACH to recipient.',
    badge: 'Instant Bank Credit',
  },
];

export default function LandingPage() {
  const router = useRouter();

  // Calculator State
  const [calcAmount, setCalcAmount] = useState('50000');
  const [calcTargetCurrency, setCalcTargetCurrency] = useState<CurrencyItem>(
    SUPPORTED_CURRENCIES.find((c) => c.code === 'AED') || SUPPORTED_CURRENCIES[1]
  );
  const [activeSecurityStep, setActiveSecurityStep] = useState(0);
  const [showTechDetails, setShowTechDetails] = useState(false);

  // Calculations
  const numericAmount = parseFloat(calcAmount.replace(/,/g, '')) || 0;
  const rate = RATES_MAP[calcTargetCurrency.code] || 0.04417;
  const autoUpiFee = Math.round(numericAmount * 0.02);
  const recipientReceives = (numericAmount * rate).toFixed(2);
  const traditionalFee = Math.round(numericAmount * 0.065 + 1500);
  const estimatedSavings = Math.max(0, traditionalFee - autoUpiFee);

  const handleCalculatorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(
      `/send?amount=${encodeURIComponent(numericAmount)}&target=${encodeURIComponent(
        calcTargetCurrency.code
      )}`
    );
  };

  return (
    <AppLayout>
      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 1: HERO */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-6 sm:pt-12 pb-16 sm:pb-24 overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary-600/15 via-accent-500/10 to-transparent blur-[100px] pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-500/10 border border-primary-200/80 dark:border-primary-500/20 text-primary-700 dark:text-primary-300 text-xs font-semibold shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span>Next-Gen Cross-Border Settlement Network</span>
            <span className="text-primary-400 dark:text-primary-500 font-bold">•</span>
            <span className="text-primary-600 dark:text-primary-400 font-bold">8-Sec Settlement</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          >
            Cross-Border Payments.{' '}
            <span className="text-gradient-primary">Settled in Seconds.</span>
          </motion.h1>

          {/* Supporting Copy */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
          >
            Move money internationally with the simplicity of UPI and the transparency of an on-chain settlement network. Flat 2% fee, zero hidden FX markup, and real-time cryptographic proof.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2"
          >
            <Button
              size="lg"
              onClick={() => router.push('/send')}
              className="w-full sm:w-auto px-8 shadow-glow-primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Send Money Now
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/blockchain-demo')}
              className="w-full sm:w-auto px-6"
              leftIcon={<Cpu className="w-4 h-4 text-primary-500" />}
            >
              Explore How It Works
            </Button>
          </motion.div>

          {/* Trust Highlights */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Flat 2% Transparent Fee</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>8-Second Average Speed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>SHA-256 On-Chain Proof</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Network Visual (Abstract Money Transfer Flow) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-16 max-w-4xl mx-auto p-4 sm:p-6 surface-card rounded-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center text-center">
            {/* Node 1: Sender */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] space-y-1.5">
              <div className="w-10 h-10 mx-auto rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                🇮🇳
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">India (INR)</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">UPI / IMPS Gateway</div>
            </div>

            {/* Node 2: Escrow Lock */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] space-y-1.5 relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Bank Escrow</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">1:1 INR Collateral</div>
            </div>

            {/* Node 3: GIFT City L2 Ledger */}
            <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-200/80 dark:border-primary-500/30 space-y-1.5 relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary-600 text-white flex items-center justify-center shadow-glow-primary">
                <Zap className="w-4 h-4" />
              </div>
              <div className="font-bold text-sm text-primary-700 dark:text-primary-300">GIFT City L2</div>
              <div className="text-[11px] text-primary-600 dark:text-primary-400 font-semibold">8s Block Settlement</div>
            </div>

            {/* Node 4: Recipient */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/60 dark:border-white/[0.06] space-y-1.5">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                🇦🇪 🇺🇸
              </div>
              <div className="font-bold text-sm text-slate-900 dark:text-white">Recipient Node</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Instant Domestic Payout</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 2: LIVE RATE TICKER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-4 border-y border-slate-200/70 dark:border-white/[0.06] overflow-hidden bg-slate-100/50 dark:bg-white/[0.02]">
        <div className="flex items-center gap-8 whitespace-nowrap animate-ticker">
          {[...LIVE_RATES, ...LIVE_RATES, ...LIVE_RATES].map((item, idx) => (
            <div key={idx} className="inline-flex items-center gap-3 text-xs font-semibold">
              <span className="text-base">{item.flag}</span>
              <span className="text-slate-800 dark:text-slate-200">{item.pair}</span>
              <span className="num font-bold text-slate-900 dark:text-white">{item.rate}</span>
              <span
                className={`num text-[11px] font-bold ${
                  item.up ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {item.change}
              </span>
              <span className="text-slate-300 dark:text-white/10">•</span>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 3: INTERACTIVE TRANSFER CALCULATOR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              See How Much You Save in 8 Seconds
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              Live calculator with genuine 2% transparent fee and zero hidden bank spreads.
            </p>
          </div>

          <Card variant="elevated" padding="lg" className="border-primary-500/20 shadow-2xl">
            <form onSubmit={handleCalculatorSubmit} className="space-y-6">
              {/* Two Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* You Send (INR) */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>YOU SEND</span>
                    <span>Source: India (INR)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={calcAmount}
                      onChange={(e) => setCalcAmount(e.target.value)}
                      className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-900 dark:text-white focus:outline-none num"
                      placeholder="50,000"
                    />
                    <span className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-white/10 text-xs font-bold">
                      INR
                    </span>
                  </div>
                </div>

                {/* Recipient Receives */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>RECIPIENT RECEIVES</span>
                    <span>Live Guaranteed Rate</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 num">
                      {calcTargetCurrency.symbol} {Number(recipientReceives).toLocaleString()}
                    </div>
                    <CurrencySelector
                      selectedCode={calcTargetCurrency.code}
                      onSelect={(cur) => setCalcTargetCurrency(cur)}
                      label="Select Target Currency"
                    />
                  </div>
                </div>
              </div>

              {/* Fee & Savings Breakdown Table */}
              <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.06] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Exchange Rate:</span>
                  <span className="font-bold text-slate-900 dark:text-white num">
                    1 INR = {rate} {calcTargetCurrency.code}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">AutoUPI Flat Fee (2%):</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400 num">
                    ₹{autoUpiFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Traditional Bank Fee (SWIFT ~6.5%):</span>
                  <span className="text-rose-500 line-through num">
                    ₹{traditionalFee.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex items-center justify-between font-bold text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400">Your Estimated Savings:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 num text-base">
                    ₹{estimatedSavings.toLocaleString('en-IN')} + 4 Days Time
                  </span>
                </div>
              </div>

              {/* CTA */}
              <Button type="submit" size="lg" className="w-full text-base font-bold shadow-glow-primary">
                Proceed to Send ₹{numericAmount.toLocaleString('en-IN')} <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 4: HOW AUTOPUI WORKS */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-t border-slate-200/70 dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              How AutoUPI Delivers in 8 Seconds
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              The 5-step automated pipeline eliminating correspondent bank delays.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Enter Amount & Recipient',
                desc: 'Select currency pair (INR to AED/USD/EUR/GBP/SGD). Lock guaranteed exchange rate for 60s.',
                icon: Coins,
              },
              {
                step: '02',
                title: 'Automated KYC & AML Scan',
                desc: 'Instant identity check and sanction screening executed in under 1.5 seconds without friction.',
                icon: ShieldCheck,
              },
              {
                step: '03',
                title: 'Collateral Escrow Lock',
                desc: '100% INR fiat is locked in partner bank DICGC-insured reserve account before minting token.',
                icon: Lock,
              },
              {
                step: '04',
                title: 'GIFT City L2 Settlement',
                desc: 'Tokenized transaction settled on our private blockchain. SHA-256 block hash generated.',
                icon: Zap,
              },
              {
                step: '05',
                title: 'Destination Domestic Payout',
                desc: 'Destination liquidity pool releases funds directly to recipient bank account or local UPI.',
                icon: CheckCircle2,
              },
              {
                step: '06',
                title: 'Cryptographic Audit Trail',
                desc: 'Both parties receive verifiable blockchain receipt, tax invoice PDF, and instant notification.',
                icon: Activity,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} variant="interactive" padding="md" className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary-600 dark:text-primary-400">
                      STEP {item.step}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 5: SECURITY & TOKEN VISUALIZER (INTERACTIVE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-t border-slate-200/70 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
              Zero Volatility Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Protocol Visualizer
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              Understand how 100% bank-backed digital deposit tokens eliminate crypto risk. Click any stage below.
            </p>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {SECURITY_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeSecurityStep === idx;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveSecurityStep(idx)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-white dark:bg-white/10 border-primary-500 shadow-md text-primary-600 dark:text-white'
                      : 'bg-white/60 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-white/10'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-2 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
                  <div className="text-xs font-bold truncate">{step.title}</div>
                </button>
              );
            })}
          </div>

          {/* Active Detail Panel */}
          <Card variant="elevated" padding="lg" className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-white/5 pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-primary-500">
                  STAGE {activeSecurityStep + 1} OF 5
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {SECURITY_STEPS[activeSecurityStep].title}
                </h3>
              </div>
              <span className="badge-info">{SECURITY_STEPS[activeSecurityStep].badge}</span>
            </div>

            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
              {SECURITY_STEPS[activeSecurityStep].simple}
            </p>

            {/* Collapsible Technical Details */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowTechDetails(!showTechDetails)}
                className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:underline"
              >
                <span>{showTechDetails ? 'Hide Technical Specification' : 'View Technical Specification'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showTechDetails ? 'rotate-90' : ''}`} />
              </button>

              {showTechDetails && (
                <div className="mt-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-slate-300">
                  {SECURITY_STEPS[activeSecurityStep].tech}
                </div>
              )}
            </div>
          </Card>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 6: COMPARISON TABLE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 border-t border-slate-200/70 dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AutoUPI vs Traditional Providers
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Why AutoUPI is replacing legacy wire transfers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-4 px-4">Feature</th>
                  <th className="py-4 px-4 bg-primary-500/10 text-primary-600 dark:text-primary-400 font-extrabold rounded-t-xl">
                    AutoUPI
                  </th>
                  <th className="py-4 px-4">SWIFT Wire</th>
                  <th className="py-4 px-4">Western Union</th>
                  <th className="py-4 px-4">PayPal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-4 px-4 font-bold">Settlement Speed</td>
                  <td className="py-4 px-4 bg-primary-500/5 font-extrabold text-emerald-600 dark:text-emerald-400">
                    ⚡ 8 Seconds
                  </td>
                  <td className="py-4 px-4 text-slate-500">3 – 5 Business Days</td>
                  <td className="py-4 px-4 text-slate-500">1 – 2 Days</td>
                  <td className="py-4 px-4 text-slate-500">1 – 3 Days</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Transfer Fee</td>
                  <td className="py-4 px-4 bg-primary-500/5 font-extrabold text-primary-600 dark:text-primary-400">
                    Flat 2%
                  </td>
                  <td className="py-4 px-4 text-slate-500">4% – 7% + Wire Fee</td>
                  <td className="py-4 px-4 text-slate-500">3.5% – 6%</td>
                  <td className="py-4 px-4 text-slate-500">4.5% + FX Spread</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Exchange Rate Markup</td>
                  <td className="py-4 px-4 bg-primary-500/5 font-bold text-emerald-600 dark:text-emerald-400">
                    0% (Interbank Rate)
                  </td>
                  <td className="py-4 px-4 text-slate-500">2% – 3.5% Hidden</td>
                  <td className="py-4 px-4 text-slate-500">2% – 4% Hidden</td>
                  <td className="py-4 px-4 text-slate-500">3% – 4% Hidden</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Real-Time Tracking</td>
                  <td className="py-4 px-4 bg-primary-500/5 font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ Live WebSocket Timeline
                  </td>
                  <td className="py-4 px-4 text-slate-500">❌ None (UTR Only)</td>
                  <td className="py-4 px-4 text-slate-500">⚠️ MTCN Status Only</td>
                  <td className="py-4 px-4 text-slate-500">⚠️ Generic Status</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-bold">Cryptographic Proof</td>
                  <td className="py-4 px-4 bg-primary-500/5 font-bold text-emerald-600 dark:text-emerald-400 rounded-b-xl">
                    ✓ SHA-256 On-Chain Hash
                  </td>
                  <td className="py-4 px-4 text-slate-500">❌ None</td>
                  <td className="py-4 px-4 text-slate-500">❌ None</td>
                  <td className="py-4 px-4 text-slate-500">❌ None</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SECTION 7: FINAL CALL TO ACTION */}
      {/* ───────────────────────────────────────────────────────────── */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center surface-card p-8 sm:p-14 rounded-3xl relative overflow-hidden space-y-6 shadow-2xl border-primary-500/30">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center mx-auto shadow-glow-primary">
            <Zap className="w-8 h-8 fill-current" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Move Money Without the Waiting.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Experience cross-border remittances that move at the speed of modern technology.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => router.push('/send')}
              className="w-full sm:w-auto px-10 shadow-glow-primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Send Money in 8 Seconds
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/explorer')}
              className="w-full sm:w-auto px-6"
            >
              Explore Blockchain Ledger
            </Button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
