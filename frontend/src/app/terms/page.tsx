'use client';

import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

export default function TermsPage() {
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
        <div className="text-blue-600 font-black tracking-widest uppercase text-sm mb-6 flex items-center gap-2">
          <Scale className="w-5 h-5"/> Legal Framework
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-8">Terms of Service</h1>
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-12">Last Updated: October 2025</p>
        
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-slate-600 leading-relaxed mb-6">
            Welcome to AutoUPI. By accessing or using our cross-border payment platform, you agree to comply with and be bound by the following comprehensive terms and conditions of use.
          </p>
          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-8">1. Acceptance of Terms</h2>
          <p className="text-slate-600 leading-relaxed mb-6">By creating an account, you accept these terms in full. If you disagree with these terms, you must not use our services.</p>
          
          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-8">2. Regulatory Sandbox Participant</h2>
          <p className="text-slate-600 leading-relaxed mb-6">AutoUPI is currently operating within the Reserve Bank of India (RBI) Regulatory Sandbox. Services are provided on an experimental basis governed by current pilot conditions.</p>
        </div>
      </div>
    </div>
  );
}
