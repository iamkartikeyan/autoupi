'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { usePayment } from '../../context/PaymentContext';
import { StatusPill } from '../../components/ui/StatusPill';
import { TransactionTimeline } from '../../components/ui/TransactionTimeline';
import { Search, Shield, Zap, ArrowRight, Clock, CheckCircle2, ChevronLeft } from 'lucide-react';
import { PaymentTransaction } from '@auto-upi/shared';

function TrackTransferContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get('ref') || 'UPI-XB-8921820';

  const { transactions } = usePayment();
  const [searchInput, setSearchInput] = useState(initialRef);
  const [searchedTx, setSearchedTx] = useState<PaymentTransaction | null>(
    transactions.find((t) => t.referenceNumber.toLowerCase() === initialRef.toLowerCase()) || transactions[0]
  );
  const [searched, setSearched] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    const found = transactions.find(
      (t) =>
        t.referenceNumber.toLowerCase().includes(searchInput.toLowerCase().trim()) ||
        t.id.toLowerCase().includes(searchInput.toLowerCase().trim())
    );

    setSearchedTx(found || null);
    setSearched(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Back Header */}
      <div className="flex items-center justify-between pb-1">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h2 className="text-sm font-medium text-white">Track Settlement</h2>
        <div className="w-8" />
      </div>

      {/* Header */}
      <div className="text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-[#1E1F24] border border-[#35383F] flex items-center justify-center text-white mx-auto mb-3 shadow-md">
          <Zap className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Track Settlement
        </h1>
        <p className="text-xs text-[#8E918F] mt-1">
          Verify payment settlement state and clearing status
        </p>
      </div>

      {/* Search Bar Form */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#8E918F]" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Reference ID e.g. UPI-XB-8921820"
              className="w-full pl-10 pr-4 py-3 rounded-full bg-[#1E1F24] border border-[#35383F] text-sm text-white focus:outline-none focus:border-[#A8C7FA]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-bold shadow-md transition-all active:scale-95 shrink-0"
          >
            Track
          </button>
        </div>
      </form>

      {/* Search Result */}
      {searched && searchedTx ? (
        <div className="space-y-6 max-w-lg mx-auto animate-in fade-in duration-200">
          {/* Public safe summary card */}
          <div className="p-6 rounded-[28px] bg-[#1E1F24] border border-[#35383F] shadow-lg text-center">
            <p className="text-xs text-[#8E918F] font-mono">Reference: {searchedTx.referenceNumber}</p>

            <div className="flex items-center justify-center gap-3 my-4">
              <span className="text-sm font-bold text-white">{searchedTx.sourceCurrency}</span>
              <ArrowRight className="w-4 h-4 text-[#8E918F]" />
              <span className="text-sm font-bold text-emerald-400">
                {searchedTx.targetCurrency} ({searchedTx.beneficiaryFlag} {searchedTx.beneficiaryCountry})
              </span>
            </div>

            <div className="inline-block mb-3">
              <StatusPill status={searchedTx.status} />
            </div>

            <p className="text-[11px] text-[#8E918F] font-mono">
              Initiated: {new Date(searchedTx.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Timeline */}
          <div className="bg-[#1E1F24] rounded-[28px] p-6 border border-[#35383F] shadow-lg">
            <h3 className="text-sm font-bold text-white mb-4">Live Settlement Pipeline</h3>
            <TransactionTimeline transaction={searchedTx} />
          </div>
        </div>
      ) : searched ? (
        <div className="text-center p-8 rounded-[28px] bg-[#1E1F24] border border-[#35383F] max-w-md mx-auto">
          <p className="text-sm font-bold text-white mb-1">Transaction Not Found</p>
          <p className="text-xs text-[#8E918F]">
            Please verify the reference ID (e.g. <code className="text-white">UPI-XB-8921820</code>) and try again.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function TrackTransferPage() {
  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] px-4 py-6 max-w-lg mx-auto select-none">
      <React.Suspense fallback={<div className="text-center p-12 text-[#8E918F]">Loading tracker...</div>}>
        <TrackTransferContent />
      </React.Suspense>
    </div>
  );
}
