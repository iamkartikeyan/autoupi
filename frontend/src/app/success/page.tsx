'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import {
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Home,
  Clock,
  Zap,
  Download,
  ExternalLink,
  ShieldCheck,
  FileText,
  Lock,
  ChevronDown,
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import toast from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import HashViewer from '@/components/ui/HashViewer';
import { transactionApi } from '@/lib/api';

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });

function SuccessPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnId = searchParams.get('id');
  const hashParam = searchParams.get('hash');

  const [txn, setTxn] = useState<Record<string, any> | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showConfetti, setShowConfetti] = useState(true);
  const [showTechProof, setShowTechProof] = useState(false);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const timer = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (txnId) {
      transactionApi
        .get(txnId)
        .then((res: any) => setTxn(res.data.data))
        .catch(() => {});
    }
  }, [txnId]);

  const amount = (txn?.amount as number) || 50000;
  const finalAmount = (txn?.final_amount as number) || 2208.5;
  const fee = (txn?.fee as number) || 1000;
  const rate = (txn?.exchange_rate as number) || 0.04417;
  const settlementTime = (txn?.settlement_time as number) || 7.8;
  const hash =
    (txn?.blockchain_hash as string) ||
    hashParam ||
    '0x8f3c71a4b9281e05d419c836a0f7e1b5d92847a16e02b7498c1a7d5e493f0b21';
  const fromCurrency = (txn?.currency as string) || 'INR';
  const toCurrency = (txn?.target_currency as string) || 'AED';
  const recipientName = (txn?.recipient_name as string) || 'Ahmed Al-Rashidi';
  const recipientId = (txn?.recipient_id as string) || 'ahmed@uae';
  const timestamp = txn?.created_at ? new Date(txn.created_at).toLocaleString() : new Date().toLocaleString();

  // Generate Official PDF Receipt
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();

      // Header
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('AutoUPI Payment Receipt', 20, 20);

      doc.setFontSize(10);
      doc.text('Cross-Border Settlement Network • ISO 20022 Compliant', 20, 28);

      // Status
      doc.setTextColor(16, 185, 129);
      doc.setFontSize(14);
      doc.text('STATUS: SETTLED & COMPLETED', 20, 48);

      // Meta Table
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);

      let y = 60;
      const addRow = (label: string, value: string) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 90, y);
        y += 8;
      };

      addRow('Transaction Reference:', txnId || 'TXN-' + Math.random().toString(36).substring(7).toUpperCase());
      addRow('Date & Time:', timestamp);
      addRow('Settlement Duration:', `${settlementTime} seconds`);
      addRow('Sender Name:', 'Verified Account Holder');
      addRow('Recipient Name:', recipientName);
      addRow('Recipient Identifier:', recipientId);
      addRow('Source Amount:', `INR ${amount.toLocaleString('en-IN')}`);
      addRow('Exchange Rate Applied:', `1 INR = ${rate} ${toCurrency}`);
      addRow('Platform Fee (2%):', `INR ${fee.toLocaleString('en-IN')}`);
      addRow('Final Payout Amount:', `${toCurrency} ${Number(finalAmount).toLocaleString()}`);
      addRow('Blockchain Hash:', hash);

      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text('Funds held in escrow with RBI partner banks. DICGC Insured up to INR 5,00,000.', 20, 170);
      doc.text('AutoUPI Technologies Inc. • GIFT City IFSC L2 Settlement Channel', 20, 176);

      doc.save(`AutoUPI-Receipt-${txnId?.slice(0, 8) || 'transfer'}.pdf`);
      toast.success('PDF Receipt downloaded successfully!');
    } catch (err) {
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <AppLayout maxWidth="max-w-2xl">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          numberOfPieces={180}
          colors={['#10B981', '#2563EB', '#38BDF8', '#8B5CF6', '#F59E0B']}
          recycle={false}
        />
      )}

      <div className="space-y-6 py-6 text-center sm:text-left">
        {/* Animated Checkmark Header */}
        <div className="flex flex-col items-center sm:items-start space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-glow-success"
          >
            <CheckCircle2 className="w-10 h-10" />
          </motion.div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Payment Sent Successfully! 🎉
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ₹{amount.toLocaleString('en-IN')} has been settled to {recipientName} in{' '}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{settlementTime}s</span>.
            </p>
          </div>
        </div>

        {/* Amount Banner Card */}
        <Card variant="elevated" padding="lg" className="overflow-hidden space-y-6 shadow-2xl border-emerald-500/20">
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-center space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest opacity-80">
              Recipient Receives
            </span>
            <div className="text-4xl sm:text-5xl font-black num">
              {toCurrency === 'AED' ? 'د.إ' : '$'} {Number(finalAmount).toLocaleString()}
            </div>
            <p className="text-xs font-semibold opacity-90">{toCurrency} Direct Account Payout</p>
          </div>

          {/* Breakdown Rows */}
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Recipient:</span>
              <span className="font-bold text-slate-900 dark:text-white">{recipientName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Recipient Account / UPI:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{recipientId}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Settlement Speed:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> {settlementTime} Seconds
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Exchange Rate Locked:</span>
              <span className="font-bold num text-slate-900 dark:text-white">
                1 INR = {rate} {toCurrency}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-white/5">
              <span className="text-slate-500 dark:text-slate-400">Platform Fee (2%):</span>
              <span className="font-bold text-slate-900 dark:text-white num">₹{fee.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-1 font-bold text-slate-900 dark:text-white">
              <span>Total Debited:</span>
              <span className="num text-base">₹{(amount + fee).toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Cryptographic Proof Collapsible */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  On-Chain Cryptographic Proof
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowTechProof(!showTechProof)}
                className="text-xs text-primary-600 dark:text-primary-400 font-bold hover:underline flex items-center gap-1"
              >
                <span>{showTechProof ? 'Hide' : 'Details'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTechProof ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-slate-500">Transaction Hash:</span>
              <HashViewer hash={hash} showExplorerLink explorerPath={`/explorer?search=${encodeURIComponent(hash)}`} />
            </div>

            {showTechProof && (
              <div className="pt-2 border-t border-slate-200/60 dark:border-white/5 space-y-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                <p>Consensus: GIFT City L2 Proof-of-Authority</p>
                <p>Status: Permanently Validated & Mined</p>
                <p>Escrow: DICGC Insured Partner Bank</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              onClick={handleDownloadPDF}
              leftIcon={<Download className="w-4 h-4" />}
              className="w-full font-bold shadow-glow-primary"
            >
              Download PDF Receipt
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/dashboard')}
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <SuccessPageInner />
    </Suspense>
  );
}
