'use client';

import React from 'react';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';
import { Shield, Zap, Globe, FileText, CheckCircle2 } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
  maxWidth?: string;
  hideNav?: boolean;
}

export default function AppLayout({
  children,
  showFooter = true,
  maxWidth = 'max-w-7xl',
  hideNav = false,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {!hideNav && <Navbar />}

      <main className={`flex-1 w-full ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 lg:pb-12`}>
        {children}
      </main>

      {/* Modern Global Footer */}
      {showFooter && !hideNav && (
        <footer className="border-t border-slate-200/80 dark:border-white/[0.08] bg-white/60 dark:bg-[#0B0F19]/60 backdrop-blur-xl mt-auto pb-20 lg:pb-8 pt-10 text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              {/* Col 1: Brand */}
              <div className="col-span-2 sm:col-span-2 md:col-span-1 space-y-3">
                <BrandLogo size={30} />
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  Next-generation cross-border settlement layer. Move money internationally in 8 seconds with 2% flat fees.
                </p>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>RBI Sandbox Pilot & DICGC Insured</span>
                </div>
              </div>

              {/* Col 2: Products */}
              <div className="space-y-2.5">
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Product
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/send" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Send Money
                    </Link>
                  </li>
                  <li>
                    <Link href="/wallet" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Virtual Wallet
                    </Link>
                  </li>
                  <li>
                    <Link href="/explorer" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Blockchain Explorer
                    </Link>
                  </li>
                  <li>
                    <Link href="/compare" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Fee Calculator & Comparison
                    </Link>
                  </li>
                  <li>
                    <Link href="/blockchain-demo" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Protocol Simulation
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Compliance & Trust */}
              <div className="space-y-2.5">
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Trust & Security
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/compliance" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Regulatory Compliance
                    </Link>
                  </li>
                  <li>
                    <Link href="/security" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Security Standards
                    </Link>
                  </li>
                  <li>
                    <Link href="/trust-center" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Network Trust Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/risk-disclosure" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Risk Disclosures
                    </Link>
                  </li>
                  <li>
                    <Link href="/grievance" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Grievance Redressal
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 4: Legal */}
              <div className="space-y-2.5">
                <p className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                  Legal
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/terms" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/refund-policy" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Refund Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/acceptable-use" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Acceptable Use
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="hover:text-primary-600 dark:hover:text-white transition-colors">
                      Cookie Preferences
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-6 border-t border-slate-200/60 dark:border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[11px]">
              <div>
                © {new Date().getFullYear()} AutoUPI Technologies Inc. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <span>ISO 20022 Compliant</span>
                <span>•</span>
                <span>256-Bit TLS Encryption</span>
                <span>•</span>
                <span>100% Reserve Backing</span>
              </div>
            </div>
          </div>
        </footer>
      )}

      {/* Mobile Bottom Navigation */}
      {!hideNav && <BottomNav />}
    </div>
  );
}
