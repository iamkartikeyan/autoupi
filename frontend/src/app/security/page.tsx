'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Bug, Shield, Lock, CheckCircle2, KeyRound } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function SecurityPage() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-8 py-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Bank-Grade Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Security & Responsible Disclosure
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Learn about AutoUPI's cryptographic controls, zero-knowledge session architecture, and vulnerability bounty program.
          </p>
        </div>

        <Card variant="elevated" padding="lg" className="space-y-6">
          <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Cryptographic Ledger Protection
            </h2>
            <p>
              AutoUPI executes all value transfers across our dedicated Layer-2 GIFT City settlement network. Every transaction block is etched with standard SHA-256 cryptographic hashing, preventing arbitrary state alterations or double-spending.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              2. 100% Escrow Collateralization
            </h2>
            <p>
              Every single digital settlement token minted on our network is collateralized 1:1 by equivalent INR held in escrow accounts at RBI-supervised partner banks, protected under DICGC depositor insurance regulations up to ₹5,00,000.
            </p>

            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              3. Responsible Vulnerability Disclosure
            </h2>
            <p>
              We reward security researchers who practice responsible disclosure. If you discover a potential vulnerability in our smart contracts, API gateway, or consensus layer, please contact us immediately:
            </p>
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-white/[0.04] font-mono text-xs text-primary-600 dark:text-primary-400">
              Email: security@autoupi.com
              <br />
              PGP Fingerprint: 4E91 C028 34A9 281E 05D4 19C8 36A0 F7E1 B5D9 2847
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
