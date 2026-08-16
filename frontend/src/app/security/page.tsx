'use client';

import Link from 'next/link';
import { ArrowLeft, Bug } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <nav className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/legal" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back to Legal Hub</span>
          </Link>
          <BrandLogo size={32} textClassName="text-white font-bold" />
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-20 pb-40">
        <div className="text-emerald-400 font-black tracking-widest uppercase text-sm mb-6 flex items-center gap-2">
          <Bug className="w-5 h-5"/> Bug Bounty
        </div>
        <h1 className="text-5xl font-black text-white mb-8">Vulnerability Disclosure</h1>
        <div className="prose prose-invert prose-lg max-w-none">
          <p className="text-slate-300 leading-relaxed mb-6">
            We take security seriously. If you are a security researcher and have found a vulnerability, please report it to security@auto-upi.com securely using our PGP Key.
          </p>
        </div>
      </div>
    </div>
  );
}
