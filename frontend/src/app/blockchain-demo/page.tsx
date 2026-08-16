'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Shield,
  Coins,
  Cpu,
  Flame,
  CheckCircle2,
  Lock,
  Landmark,
  Zap,
  Activity,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import HashViewer from '@/components/ui/HashViewer';

const PROTOCOL_STAGES = [
  {
    step: 1,
    title: 'Fiat Collateral Deposit & Escrow Lock',
    icon: Landmark,
    badge: 'Reserve Escrow',
    desc: 'Sender deposits ₹50,000 via UPI. 100% equivalent fiat is locked into partner bank escrow account with DICGC insurance coverage.',
    technical: 'RBI Sandbox Cohort 3 Compliance • 1:1 Reserve Verification • ISO 20022 message generated',
  },
  {
    step: 2,
    title: 'Pegged Settlement Token Minting',
    icon: Coins,
    badge: 'Token Creation',
    desc: 'Smart contract verifies bank escrow receipt and mints 50,000 INR-T settlement tokens strictly pegged 1:1 to Indian Rupee.',
    technical: 'Zero Volatility Peg • Cryptographic non-fungible receipt ID • Collateral lock signature',
  },
  {
    step: 3,
    title: 'GIFT City Layer-2 Channel Settlement',
    icon: Zap,
    badge: 'L2 Consensus',
    desc: 'Tokens traverse our high-throughput Layer-2 network in sub-seconds without Ethereum/Bitcoin public chain gas congestion.',
    technical: 'Proof-of-Authority Consensus • 1,500 TPS Capacity • Sub-millisecond block propagation',
  },
  {
    step: 4,
    title: 'Block Mining & Cryptographic Hash',
    icon: Cpu,
    badge: 'SHA-256 Mining',
    desc: 'Transaction is validated and permanently etched into a new block. Unique immutable SHA-256 hash is generated.',
    technical: 'Block Header Hash generated • Merkle Root updated • Nonce validated by validator node',
  },
  {
    step: 5,
    title: 'Settlement Token Burn & Liquidity Release',
    icon: Flame,
    badge: 'Deflationary Burn',
    desc: 'Settlement tokens are permanently burned upon arrival at the destination node, preventing double-spending.',
    technical: 'Atomic Burn Function executed • Supply decreased by 50,000 INR-T • Event emitted',
  },
  {
    step: 6,
    title: 'Destination Domestic Fiat Payout',
    icon: CheckCircle2,
    badge: 'Local Wire / ACH',
    desc: 'UAE Liquidity Pool instantly credits 2,208.50 AED directly into recipient bank account (Emirates NBD).',
    technical: 'Instant Payout Webhook triggered • UAE Central Bank Local Switch • Recipient SMS confirmation',
  },
];

export default function BlockchainDemoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= PROTOCOL_STAGES.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const stepData = PROTOCOL_STAGES[currentStep];
  const Icon = stepData.icon;

  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Interactive Architecture Walkthrough
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            How AutoUPI Settles in 8s
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Interactive visual simulation of tokenization, collateral escrow, and atomic settlement for developers, judges, and investors.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
            leftIcon={<ChevronLeft className="w-4 h-4" />}
          >
            Prev
          </Button>

          <Button
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="shadow-glow-primary px-5"
            leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {isPlaying ? 'Pause' : 'Auto Play'}
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setCurrentStep((s) => Math.min(PROTOCOL_STAGES.length - 1, s + 1))}
            disabled={currentStep === PROTOCOL_STAGES.length - 1}
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            Next
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Visual Stage Progress Stepper */}
        <div className="grid grid-cols-6 gap-2">
          {PROTOCOL_STAGES.map((s, idx) => (
            <button
              key={s.step}
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx <= currentStep
                  ? 'bg-gradient-to-r from-primary-600 to-emerald-500'
                  : 'bg-slate-200 dark:bg-white/10'
              }`}
            />
          ))}
        </div>

        {/* Main Stage Simulation Card */}
        <Card variant="elevated" padding="lg" className="space-y-6 shadow-2xl border-primary-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-500 text-white flex items-center justify-center shadow-glow-primary">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-primary-500">
                  STAGE 0{stepData.step} OF 06
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {stepData.title}
                </h2>
              </div>
            </div>

            <span className="badge-purple">{stepData.badge}</span>
          </div>

          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed">
            {stepData.desc}
          </p>

          {/* Technical Specs Callout */}
          <div className="p-4 rounded-xl bg-slate-100/70 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 space-y-1.5">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Technical Consensus Log
            </div>
            <div className="text-xs font-mono text-primary-600 dark:text-primary-400 font-semibold">
              {stepData.technical}
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
