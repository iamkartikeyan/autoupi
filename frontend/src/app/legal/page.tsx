'use client';

import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Scale, 
  FileText, 
  Cookie, 
  ShieldAlert, 
  RefreshCcw, 
  AlertTriangle, 
  Bug, 
  MessageSquareWarning 
} from 'lucide-react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';

const LEGAL_PAGES = [
  { id: 'terms', title: 'Terms of Service', desc: 'The fundamental rules, rights, and responsibilities governing your use of AutoUPI.', icon: FileText, link: '/terms', color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'privacy', title: 'Privacy Policy', desc: 'How we collect, handle, and cryptographically protect your personal data.', icon: ShieldAlert, link: '/privacy-policy', color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'cookies', title: 'Cookie Policy', desc: 'Detailed information on the web trackers and local storage mechanisms we use.', icon: Cookie, link: '/cookies', color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'acceptable-use', title: 'Acceptable Use', desc: 'Firm boundaries on permitted and prohibited activities on our cross-border network.', icon: Scale, link: '/acceptable-use', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { id: 'refund', title: 'Refund Policy', desc: 'Guidelines and SLAs regarding transaction cancellations and fiat refunds.', icon: RefreshCcw, link: '/refund-policy', color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 'risk', title: 'Risk Disclosure', desc: 'Inherent risks involving FX market volatility and tokenized asset settlement.', icon: AlertTriangle, link: '/risk-disclosure', color: 'text-orange-500', bg: 'bg-orange-50' },
  { id: 'security', title: 'Bug Bounty', desc: 'Vulnerability Disclosure Program and HackerOne integration details.', icon: Bug, link: '/security', color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 'grievance', title: 'Grievance Redressal', desc: 'Escalation matrix and DPDP Act mandated Grievance Officer contact info.', icon: MessageSquareWarning, link: '/grievance', color: 'text-teal-500', bg: 'bg-teal-50' },
];

export default function LegalHub() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-slate-200">
      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/compliance" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back to Compliance</span>
          </Link>
          <BrandLogo size={32} textClassName="text-slate-900 font-bold" />
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-slate-500 font-black tracking-widest uppercase text-sm mb-6 flex items-center gap-2"
          >
            <Scale className="w-5 h-5"/> Legal & Compliance Hub
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 text-slate-900 max-w-3xl"
          >
            Clear Terms.<br/>
            No Hidden Clauses.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 leading-relaxed max-w-2xl"
          >
            Review our comprehensive legal documentation, policies, and procedural guidelines designed to protect both the platform and its users.
          </motion.p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEGAL_PAGES.map((page, i) => (
            <Link href={page.link} key={page.id}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1 transition-all h-full flex flex-col group cursor-pointer"
              >
                <div className={`w-14 h-14 ${page.bg} ${page.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <page.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">{page.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm flex-grow">{page.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                  Read Document &rarr;
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
