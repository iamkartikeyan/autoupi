'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Server, Activity, ArrowLeft, CheckCircle2, Zap, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';

const TRUST_METRICS = [
  { label: 'Settlement Engine Uptime', value: '99.99%', icon: Activity, status: 'HEALTHY' },
  { label: 'GIFT City L2 Node Health', value: 'Operational', icon: Server, status: 'HEALTHY' },
  { label: 'Escrow Reserve Backing', value: '100.00%', icon: Shield, status: 'VERIFIED' },
  { label: 'Encryption Standard', value: 'AES-256 GCM', icon: Lock, status: 'ACTIVE' },
];

const SECURITY_SYSTEMS = [
  {
    title: 'ISO 20022 Financial Messaging',
    desc: 'All international transfer instructions conform strictly with universal financial industry messaging standards.',
    status: 'Operational',
  },
  {
    title: 'Automated AML & OFAC Sanctions Engine',
    desc: 'Real-time heuristic scanning of blacklisted wallets and high-risk remittance entities in under 1.2 seconds.',
    status: 'Operational',
  },
  {
    title: 'RBI Regulatory Sandbox Pilot Cohort 3',
    desc: 'Tested under official Reserve Bank of India sandbox framework for cross-border payment solutions.',
    status: 'Compliant',
  },
  {
    title: 'DICGC Statutory Escrow Coverage',
    desc: 'All INR escrow deposits are held in partner bank reserve accounts protected by DICGC insurance up to ₹5 Lakh.',
    status: 'Insured',
  },
];

export default function TrustCenter() {
  return (
    <AppLayout>
      <div className="space-y-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Real-Time Network Status
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Security & Trust Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Live operational status, regulatory disclosures, and security architecture of the AutoUPI settlement network.
          </p>
        </div>

        {/* Operational Banner */}
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <div>
              <p className="font-bold text-sm text-emerald-900 dark:text-emerald-300">
                All Systems Fully Operational
              </p>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                GIFT City L2 settlement channel running at optimal 8.1s latency.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            100% Uptime
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_METRICS.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.label} variant="default" padding="md" className="space-y-2">
                <div className="flex items-center justify-between">
                  <Icon className="w-4 h-4 text-primary-500" />
                  <StatusBadge status={m.status} size="sm" />
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white num">
                  {m.value}
                </div>
                <p className="text-xs text-slate-500 font-medium">{m.label}</p>
              </Card>
            );
          })}
        </div>

        {/* Security Systems List */}
        <Card variant="elevated" padding="lg" className="space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Core Infrastructure Vitals
          </h2>

          <div className="space-y-3">
            {SECURITY_SYSTEMS.map((s) => (
              <div
                key={s.title}
                className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{s.desc}</p>
                </div>
                <StatusBadge status="ACTIVE" size="sm" />
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Button
              size="md"
              onClick={() => (window.location.href = '/compliance')}
              className="w-full sm:w-auto font-bold"
            >
              View Full Compliance Suite
            </Button>
            <Button
              size="md"
              variant="secondary"
              onClick={() => (window.location.href = '/explorer')}
              className="w-full sm:w-auto font-bold"
            >
              Verify On-Chain Explorer
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
