'use client';

import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';
import BrandLogo from '@/components/ui/BrandLogo';

export default function CookiesPage() {
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
        <div className="text-orange-500 font-black tracking-widest uppercase text-sm mb-6 flex items-center gap-2">
          <Cookie className="w-5 h-5"/> Privacy Choices
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-8">Cookie Policy</h1>
        <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-12">Last Updated: October 2025</p>
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-slate-600 leading-relaxed mb-6">
            We use essential session tokens to verify anti-CSRF signatures and maintain your authenticated state. We **do not** use tracking or marketing cookies per our DPDP alignment guidelines.
          </p>
        </div>
      </div>
    </div>
  );
}


