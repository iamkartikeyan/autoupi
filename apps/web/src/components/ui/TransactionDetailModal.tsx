'use client';

import React, { useState } from 'react';
import { PaymentTransaction } from '@auto-upi/shared';
import { StatusPill } from './StatusPill';
import { TransactionTimeline } from './TransactionTimeline';
import { BlockchainInspectorModal } from './BlockchainInspectorModal';
import { ReceiptModal } from './ReceiptModal';
import { 
  X, 
  Download, 
  Receipt, 
  Cpu, 
  ShieldCheck, 
  Building, 
  Coins, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Clock,
  Layers,
  Copy,
  Zap
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TransactionDetailModalProps {
  transaction: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  if (!isOpen || !transaction) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied', `${label} copied to clipboard`, 'info');
  };

  const isCompleted = transaction.status === 'COMPLETED' || transaction.status === 'RECIPIENT_CREDITED';

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-xl bg-surface-elevated border border-surface-highlight rounded-card p-6 shadow-elevated text-white max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-surface-highlight mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-surface border border-surface-highlight text-zinc-300 flex items-center justify-center font-bold">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Institutional Settlement Ledger</h3>
                <p className="text-[11px] font-mono text-gray-400">Ref: {transaction.referenceNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Big Amount & Status Banner */}
          <div className="p-4 rounded-2xl bg-surface border border-surface-highlight flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Remittance Amount</p>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono mt-0.5">
                {transaction.sourceCurrency} {transaction.sourceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold mt-1">
                <span>Credited:</span>
                <span className="font-mono">
                  {transaction.targetCurrency} {transaction.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span>({transaction.beneficiaryFlag} {transaction.beneficiaryCountry})</span>
              </div>
            </div>

            <div className="text-right">
              <StatusPill status={transaction.status} />
              <p className="text-[10px] text-gray-400 font-mono mt-2">
                {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* 1. PAYMENT SECTION */}
            <div className="p-4 rounded-2xl bg-surface border border-surface-highlight text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-gray-200 pb-1.5 border-b border-surface-highlight/60">
                <span>1. Payment Details</span>
                <span className="font-mono text-[11px] text-zinc-300">{transaction.id}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-gray-400">Sender:</span>
                  <p className="font-semibold text-white truncate">Aarav Patel ({transaction.senderUpiId})</p>
                </div>
                <div>
                  <span className="text-gray-400">Recipient:</span>
                  <p className="font-semibold text-white truncate">{transaction.beneficiaryName} ({transaction.beneficiaryUpiId})</p>
                </div>
                <div>
                  <span className="text-gray-400">Source Amount:</span>
                  <p className="font-mono text-white">{transaction.sourceCurrency} {transaction.sourceAmount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-gray-400">Destination Amount:</span>
                  <p className="font-mono text-emerald-400 font-bold">{transaction.targetCurrency} {transaction.targetAmount.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* 2. FEES & FX SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Fees */}
              <div className="p-3.5 rounded-2xl bg-surface border border-surface-highlight space-y-1.5">
                <span className="font-bold text-gray-200 block pb-1 border-b border-surface-highlight/50">2. Fee Breakdown</span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Platform Fee (0.0%):</span>
                  <span className="font-mono text-white">{transaction.sourceCurrency} 0.00</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">FX Spread (0.20%):</span>
                  <span className="font-mono text-white">Included</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-gray-300">Total Fee:</span>
                  <span className="font-mono text-zinc-200">{transaction.sourceCurrency} {transaction.fee.toFixed(2)}</span>
                </div>
              </div>

              {/* FX */}
              <div className="p-3.5 rounded-2xl bg-surface border border-surface-highlight space-y-1.5">
                <span className="font-bold text-gray-200 block pb-1 border-b border-surface-highlight/50">3. FX Rate Lock</span>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Applied Rate:</span>
                  <span className="font-mono text-white">1 {transaction.sourceCurrency} = {transaction.exchangeRate} {transaction.targetCurrency}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Lock Window:</span>
                  <span className="font-mono text-emerald-400 font-semibold">30s Guaranteed</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-gray-400">Slippage:</span>
                  <span className="font-mono text-white">0.00% (Zero)</span>
                </div>
              </div>
            </div>

            {/* 3. BANK & TOKEN SECTION */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Bank Reserve */}
              <div className="p-3.5 rounded-2xl bg-surface border border-surface-highlight space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-gray-200 pb-1 border-b border-surface-highlight/50">
                  <Building className="w-3.5 h-3.5 text-zinc-300" />
                  <span>4. Bank Escrow Custody</span>
                </div>
                <p className="text-[11px] text-gray-300">Bank: {transaction.senderBankName}</p>
                <p className="text-[11px] font-mono text-gray-400">Lock ID: {transaction.reserveLockId || 'res_custody_84920'}</p>
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                  1:1 Segregated Custody
                </span>
              </div>

              {/* Clearing Speed & Rail */}
              <div className="p-3.5 rounded-2xl bg-surface border border-surface-highlight space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-zinc-200 pb-1 border-b border-surface-highlight/50">
                  <Zap className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Clearing Speed & Rail</span>
                </div>
                <p className="text-[11px] text-gray-300">Domestic Rail: NPCI UPI 2.0 / IMPS</p>
                <p className="text-[11px] font-mono text-gray-400">Settlement Speed: Instant (~3.8s)</p>
                <span className="inline-block px-2 py-0.5 rounded-full bg-surface-elevated border border-surface-highlight text-zinc-200 text-[10px] font-semibold">
                  {isCompleted ? 'Authorized → Cleared → Credited' : 'Clearing In-Progress'}
                </span>
              </div>
            </div>

            {/* 4. BANK CLEARING AUDIT */}
            <div className="p-4 rounded-2xl bg-surface border border-surface-highlight text-xs space-y-2">
              <div className="flex items-center justify-between font-bold text-zinc-200 pb-1.5 border-b border-surface-highlight/60">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#34D399]" />
                  <span>UPI Payment Reference</span>
                </div>
                <span className="text-[10px] text-[#34D399] font-semibold">Verified Rail</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono text-gray-300">
                <p className="truncate">Network Identifier: {transaction.referenceNumber}</p>
                <p className="truncate">Beneficiary Bank: {transaction.beneficiaryCountry === 'India' ? 'State Bank of India' : transaction.beneficiaryCountry === 'United Kingdom' ? 'Barclays Bank' : 'DBS Bank'}</p>
                <p className="truncate text-zinc-400">Timestamp: {new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
            </div>

            {/* 5. LIVE VERTICAL TIMELINE */}
            <div className="p-4 rounded-2xl bg-surface border border-surface-highlight">
              <h4 className="text-xs font-bold text-white mb-3">7. Complete Event History</h4>
              <TransactionTimeline transaction={transaction} />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-5 pt-3 border-t border-surface-highlight flex gap-3">
            <button
              onClick={() => setIsReceiptOpen(true)}
              className="w-1/2 py-3 rounded-full text-xs font-bold bg-white hover:bg-zinc-200 text-black shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Receipt className="w-4 h-4" />
              <span>View Receipt</span>
            </button>
            <button
              onClick={onClose}
              className="w-1/2 py-3 rounded-full text-xs font-semibold bg-surface hover:bg-surface-subtle text-gray-300 border border-surface-highlight transition-colors"
            >
              Close Ledger
            </button>
          </div>
        </div>
      </div>

      {/* Internal Blockchain Inspector */}
      <BlockchainInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        transaction={transaction}
      />

      {/* Official Receipt Modal */}
      <ReceiptModal
        transaction={transaction}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </>
  );
};
