'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Server, Activity, ArrowLeft, CheckCircle2, CloudLightning } from 'lucide-react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';

const TRUST_METRICS = [
  { label: 'Uptime (90 Days)', value: '99.999%', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
  { label: 'Transactions Secured', value: '$1.2B+', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { label: 'Data Centers', value: '4 (Active-Active)', icon: Server, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { label: 'Encryption Standard', value: 'AES-256 GCM', icon: Lock, color: 'text-purple-500', bg: 'bg-purple-500/10' },
];

export default function TrustCenter() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-green-500/30">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/compliance" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back to Compliance</span>
          </Link>
          <BrandLogo size={32} textClassName="text-white font-bold" />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-green-400 text-xs font-bold uppercase tracking-widest mb-8"
          >
            <Shield className="w-4 h-4" /> Enterprise Security
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-6xl md:text-8xl font-black tracking-tight mb-8"
          >
            Trust is our <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Currency.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            AutoUPI is built on zero-trust architecture. We don't just protect your money; we protect the data surrounding it. Review our real-time security posture.
          </motion.p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TRUST_METRICS.map((metric, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all cursor-crosshair group"
            >
              <div className={`w-14 h-14 rounded-2xl ${metric.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <metric.icon className={`w-7 h-7 ${metric.color}`} />
              </div>
              <h3 className="text-3xl font-black mb-2">{metric.value}</h3>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">{metric.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Architecture Snapshot */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-black">Zero-Knowledge. <br/> Infinite Security.</h2>
            <div className="space-y-6">
              {[
                { title: 'End-to-End Encryption', desc: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 GCM. Keys are managed via AWS KMS.' },
                { title: 'Biometric Access', desc: 'Administrative and service level access is guarded by physical FIDO2 keys and hardware biometrics.' },
                { title: 'Vulnerability Management', desc: 'Continuous vulnerability scanning and annual external penetration testing by CREST-certified auditors.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">{item.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full bg-white/5 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8"><CloudLightning className="w-32 h-32 text-green-500/20" /></div>
            <h3 className="text-xl font-bold mb-6">Live Status</h3>
            <div className="space-y-4">
              {['UPI Gateway', 'SWIFT Nodes', 'Escrow Accounts', 'Fraud Detection Engine'].map((sys, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/40">
                  <span className="font-semibold">{sys}</span>
                  <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    Operational
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Certifications & Safety */}
      <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Audits */}
          <div>
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-500" /> Audits & Certifications
            </h3>
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold">SOC 2 Type II Certified</h4>
                  <span className="text-[10px] font-black px-3 py-1 bg-green-500/20 text-green-400 rounded-full uppercase tracking-widest">Valid</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">Rigorous annual SOC 2 Type II audits conducted by independent AICPA-accredited firms ensuring strict controls around security and processing integrity.</p>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-wider cursor-pointer hover:text-white transition-colors">Request Audit Report &rarr;</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold">Penetration Testing</h4>
                  <span className="text-[10px] font-black px-3 py-1 bg-green-500/20 text-green-400 rounded-full uppercase tracking-widest">Q3 Audit Passed</span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">Quarterly black-box uncredentialed penetration testing conducted by CREST-certified elite hackers and integrated HackerOne bug bounty program.</p>
                <Link href="/security" className="text-xs text-blue-400 font-bold uppercase tracking-wider hover:text-white transition-colors">View Bounty Program &rarr;</Link>
              </div>
            </div>
          </div>

          {/* Fund Safety */}
          <div>
            <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
              <Lock className="w-6 h-6 text-emerald-500" /> Fund Safety Architecture
            </h3>
            <div className="space-y-4">
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                <h4 className="font-bold mb-2">Escrow Account Segregation</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Client funds are held in strictly segregated escrow accounts at RBI-regulated Tier-1 banks (SBI, HDFC). 0% of user fiat is mixed with operational capital.</p>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                <h4 className="font-bold mb-2">DICGC Insurance Protection</h4>
                <p className="text-sm text-slate-400 leading-relaxed">Deposit Insurance limits of ₹5,000,000 automatically apply to all Indian residents' fiat balances stored within our escrow ecosystem.</p>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-2xl p-6">
                 <h4 className="font-bold mb-2">Multi-Signature Settlement</h4>
                 <p className="text-sm text-slate-400 leading-relaxed">Cross-border transfers require m-of-n hardware multi-signature approvals combining AWS HSM instances and manual key-holders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
