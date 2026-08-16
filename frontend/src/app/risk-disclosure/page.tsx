'use client';

import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

export default function RiskDisclosure() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/legal" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back to Legal Hub</span>
          </Link>
          <BrandLogo size={32} textClassName="text-slate-900 font-bold" />
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-20 pb-40">
        <div className="text-amber-500 font-black tracking-widest uppercase text-sm mb-6 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5"/> Market Risks
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-8">Risk Disclosure</h1>
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-slate-600 leading-relaxed mb-6">
            Cross-border remittance involves exposure to foreign exchange (FX) market volatility. Rates are locked for 15 minutes at the time of quotation.
          </p>
        </div>
      </div>
    </div>
  );
}
