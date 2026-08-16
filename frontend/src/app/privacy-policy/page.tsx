'use client';

import { motion } from 'framer-motion';
import { Shield, ArrowLeft, LockKeyhole, UserX, Ghost, Orbit, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import BrandLogo from '@/components/ui/BrandLogo';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200">
      <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/compliance" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-bold">Back to Compliance</span>
          </Link>
          <BrandLogo size={32} textClassName="text-slate-900 font-bold" />
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="text-blue-600 font-black tracking-widest uppercase text-sm mb-6 flex items-center gap-2"
        >
          <LockKeyhole className="w-5 h-5"/> Data Protection at AutoUPI
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-slate-900"
        >
          Privacy by <br/>
          <span className="text-blue-600">Design.</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="text-2xl text-slate-500 leading-relaxed font-serif italic"
        >
          We believe financial privacy is a fundamental human right. Our systems are engineered to know as little about you as legally possible.
        </motion.p>
      </div>

      {/* Core Principles */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: UserX, title: 'No Data Brokering', desc: 'We never sell, rent, or trade your personal or financial data to third parties. Ever. Your data is yours.' },
            { icon: Orbit, title: 'DPDP Act Compliance', desc: 'Full compliance with India’s Digital Personal Data Protection Act 2023. Data remains sovereign.' },
            { icon: Ghost, title: 'Ephemeral KYC', desc: 'Aadhaar / PAN data is cryptographically hashed. We store the verification status, not your plaintext identity.' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Document Content */}
      <div className="max-w-4xl mx-auto px-6 py-20 border-t border-slate-200">
        <div className="prose prose-slate prose-lg max-w-none">
          <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-8">Last Updated: October 2025</p>
          
          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-12">1. Information We Collect</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            To provide cross-border remittance services under RBI guidelines, we are legally required to collect specific KYC details. This includes your Name, Address, PAN Card (hashed), and transaction beneficiaries.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-12">2. How We Use Information</h2>
          <div className="bg-slate-100 rounded-2xl p-6 mb-6">
            <ul className="space-y-3 m-0 list-none p-0 text-slate-700">
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Facilitating cross-border transfers via authorized dealer banks.</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Enforcing FEMA LRS limits dynamically.</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> Combating money laundering (AML / CFT screening).</li>
            </ul>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-12">3. Data Retention Policy</h2>
          <div className="bg-slate-100 rounded-2xl p-6 mb-6">
            <p className="text-slate-600 mb-4 mt-0">We adhere to the principle of data minimization and strict retention timelines:</p>
            <ul className="space-y-3 m-0 list-none p-0 text-slate-700">
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> <strong>KYC Documents:</strong> Retained for 5 years post-account closure (RBI PMLA mandate).</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> <strong>Failed KYC:</strong> Immediate cryptographical destruction.</li>
              <li className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" /> <strong>Incomplete Transfers:</strong> Session data automatically purged after 30 days.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-12">4. Third-Party Data Processors</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            We hold strict Data Processing Agreements (DPAs) with essential infrastructure partners. These include <strong>Supabase</strong> (Database hosting in Mumbai), <strong>Twilio</strong> (Transactional OTPs), and <strong>Tier-1 Indian Banking Partners</strong> for settlement processing. None of these entities have the right to use your data for marketing.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-12">5. Data Residency & Sovereignty</h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            In strict adherence to RBI Circulars on Storage of Payment System Data, all data relating to payment systems operated by AutoUPI is stored in systems located only in India. Cloud hosting is provided exclusively by MeitY-empanelled providers.
          </p>

          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-12">6. Your Rights (DPDP Act)</h2>
          <p className="text-slate-600 leading-relaxed">
            Under the Digital Personal Data Protection Act, you possess the right to:
          </p>
          <ul className="text-slate-600 leading-relaxed list-disc pl-6 space-y-2 mt-4">
            <li>Obtain a summary of personal data being processed.</li>
            <li>Correct, complete, or update your personal data.</li>
            <li>Inquire about the identities of all Data Fiduciaries with whom data is shared.</li>
            <li>Request erasure of your personal data (subject to PMLA data retention laws).</li>
          </ul>

          <h2 className="text-2xl font-black text-slate-900 mb-4 mt-12">7. Grievance Redressal</h2>
          <div className="bg-slate-100 rounded-2xl p-8 border border-slate-200 mt-6 prose-sm">
            <h3 className="font-bold text-slate-900 mb-2 mt-0">Grievance Officer (DPDP Act)</h3>
            <p className="text-slate-600 mb-4">In accordance with the Digital Personal Data Protection Act, 2023, the contact details of the Grievance Officer are provided below:</p>
            <div className="space-y-2 font-medium text-slate-800">
              <p className="m-0"><strong>Name:</strong> Priya Sharma, Head of Data Privacy</p>
              <p className="m-0"><strong>Email:</strong> <a href="mailto:grievance@auto-upi.com" className="text-blue-600 font-bold hover:underline">grievance@auto-upi.com</a></p>
              <p className="m-0"><strong>Resolution SLA:</strong> Within 7 working days</p>
            </div>
          </div>

          {/* Hackathon Wow Factor: Privacy Controls Mockup */}
          <div className="mt-16 p-8 border-2 border-slate-200 bg-white rounded-3xl relative overflow-hidden shadow-xl shadow-slate-200/50">
             {/* Decorative */}
             <div className="absolute top-0 right-0 opacity-10 blur-2xl w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply translate-x-1/2 -translate-y-1/2 pointer-events-none" />
             
             <div className="relative z-10">
               <h2 className="text-2xl font-black text-slate-900 mb-2 flex items-center gap-3">
                 <LockKeyhole className="w-5 h-5 text-blue-600" /> Active Privacy Controls
               </h2>
               <p className="text-slate-600 mb-8 max-w-2xl text-sm leading-relaxed">
                 We don't just write policies; we build tools. You can invoke your DPDP rights instantly without contacting support. (Live portal simulation below)
               </p>
               
               <div className="grid md:grid-cols-2 gap-4">
                 <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-blue-400 transition-colors cursor-crosshair">
                   <h4 className="font-bold text-slate-900 mb-1">Download Archive</h4>
                   <p className="text-xs text-slate-500 mb-4">Export all identifiable data we hold on you in machine-readable JSON format.</p>
                   <button className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors w-full shadow-md">Export to JSON</button>
                 </div>
                 <div className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-200 hover:border-red-400 transition-colors cursor-crosshair">
                   <h4 className="font-bold text-slate-900 mb-1">Invoke Erasure (RtbF)</h4>
                   <p className="text-xs text-slate-500 mb-4">Cryptographically shred non-regulatory data across all distributed shards instantly.</p>
                   <button className="text-[10px] font-black uppercase tracking-widest border border-red-200 text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-50 transition-colors w-full">Request Shredding</button>
                 </div>
                 <div className="md:col-span-2 bg-slate-900 rounded-xl p-5 text-slate-300 font-mono text-[10px] leading-relaxed flex items-center gap-4 mt-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse flex-shrink-0" />
                   <div>
                     <span className="text-green-400">System Log:</span> Telemetry collection is currently locally <span className="font-bold text-white bg-slate-800 px-1 py-0.5 rounded ml-1">PAUSED</span> for this session. Zero analytical cookies injected globally.
                   </div>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
