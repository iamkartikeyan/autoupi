'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  FileText,
  Cookie,
  ShieldAlert,
  RefreshCcw,
  AlertTriangle,
  Bug,
  MessageSquareWarning,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';

const LEGAL_PAGES = [
  { id: 'terms', title: 'Terms of Service', desc: 'Rules and responsibilities governing your use of AutoUPI.', icon: FileText, link: '/terms' },
  { id: 'privacy', title: 'Privacy Policy', desc: 'How we handle and cryptographically protect your personal data.', icon: ShieldAlert, link: '/privacy-policy' },
  { id: 'cookies', title: 'Cookie Preferences', desc: 'Information on the web trackers and local storage we use.', icon: Cookie, link: '/cookies' },
  { id: 'acceptable-use', title: 'Acceptable Use Policy', desc: 'Boundaries on permitted activities across our network.', icon: Scale, link: '/acceptable-use' },
  { id: 'refund', title: 'Refund & Reversal Policy', desc: 'SLAs regarding transaction cancellations and refunds.', icon: RefreshCcw, link: '/refund-policy' },
  { id: 'risk', title: 'Risk Disclosures', desc: 'FX market volatility and tokenized asset settlement disclosures.', icon: AlertTriangle, link: '/risk-disclosure' },
  { id: 'security', title: 'Bug Bounty & Disclosure', desc: 'Vulnerability disclosure guidelines and reporting.', icon: Bug, link: '/security' },
  { id: 'grievance', title: 'Grievance Redressal', desc: 'Escalation matrix and Grievance Officer contact details.', icon: MessageSquareWarning, link: '/grievance' },
];

export default function LegalHub() {
  return (
    <AppLayout>
      <div className="space-y-8 max-w-4xl mx-auto py-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
            Legal & Compliance Hub
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Clear Terms. Zero Hidden Clauses.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Bank-grade institutional transparency and regulatory alignment across all international jurisdictions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {LEGAL_PAGES.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.id} href={item.link}>
                <Card variant="interactive" padding="md" className="h-full space-y-2 group">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h2 className="font-bold text-sm text-slate-900 dark:text-white">{item.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
