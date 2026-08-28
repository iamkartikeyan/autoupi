'use client';

import React, { useState } from 'react';
import { PaymentTransaction } from '@auto-upi/shared';
import { StatusPill } from './StatusPill';
import { BlockchainInspectorModal } from './BlockchainInspectorModal';
import { X, Download, CheckCircle2, Shield, Printer, Cpu } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ReceiptModalProps {
  transaction: PaymentTransaction | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  isOpen,
  onClose,
}) => {
  const { showToast } = useToast();
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  if (!isOpen || !transaction) return null;

  const handleDownload = () => {
    showToast('Receipt Downloaded', `Saved official receipt for ${transaction.referenceNumber}`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-surface-elevated border border-surface-highlight rounded-card p-6 shadow-elevated text-white max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Payment Receipt</h3>
                <p className="text-[11px] font-mono text-gray-400">{transaction.referenceNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Big Amount Paid banner */}
          <div className="my-4 text-center p-4 rounded-2xl bg-surface border border-surface-highlight">
            <p className="text-xs text-gray-400 uppercase font-medium">Total Amount Transferred</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white my-1">
              {transaction.sourceCurrency} {transaction.sourceAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <span>Recipient Received:</span>
              <span className="font-mono">
                {transaction.targetCurrency} {transaction.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="mt-2.5">
              <StatusPill status={transaction.status} />
            </div>
          </div>

          {/* Transaction Summary Grid */}
          <div className="space-y-2.5 text-xs bg-surface-subtle/50 p-4 rounded-2xl border border-surface-highlight mb-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Recipient Name</span>
              <span className="font-semibold text-white">{transaction.beneficiaryName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Recipient UPI / Handle</span>
              <span className="font-mono font-medium text-gray-200">{transaction.beneficiaryUpiId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Destination Corridor</span>
              <span className="font-semibold text-white">
                {transaction.beneficiaryCountry} ({transaction.beneficiaryFlag})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sender Bank Account</span>
              <span className="font-semibold text-white">{transaction.senderBankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Exchange Rate</span>
              <span className="font-mono text-gray-200">
                1 {transaction.sourceCurrency} = {transaction.exchangeRate} {transaction.targetCurrency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Network Settlement Fee</span>
              <span className="font-semibold text-white">
                {transaction.sourceCurrency} {transaction.fee.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Timestamp</span>
              <span className="text-gray-300">
                {new Date(transaction.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Official Bank Settlement Audit Section */}
          <div className="p-4 rounded-2xl bg-[#16171B] border border-[#282A30] mb-4 text-xs">
            <div className="flex items-center justify-between font-medium text-white mb-2">
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#34D399]" />
                <span>UPI Clearing Network Audit</span>
              </div>
              <span className="text-[10px] text-[#34D399] font-semibold">Verified</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-[#C4C7C5]">
              <p className="truncate">Clearing Rail: NPCI UPI 2.0 / IMPS Instant</p>
              <p className="truncate">Corridor: {transaction.sourceCurrency} → {transaction.targetCurrency} Interbank</p>
              <p className="truncate text-[#8E918F]">
                Network Ref: {transaction.referenceNumber || 'UPI-XB-8921820'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold bg-white hover:bg-zinc-200 text-black transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold bg-surface hover:bg-surface-subtle text-gray-200 border border-surface-highlight transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Receipt</span>
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
    </>
  );
};
