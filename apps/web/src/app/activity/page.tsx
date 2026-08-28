'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePayment } from '../../context/PaymentContext';
import { TransactionRow } from '../../components/ui/TransactionRow';
import { SearchBar } from '../../components/ui/SearchBar';
import { TransactionDetailModal } from '../../components/ui/TransactionDetailModal';
import { EmptyState } from '../../components/ui/EmptyState';
import { PaymentTransaction } from '@auto-upi/shared';
import { 
  Filter, 
  TrendingUp, 
  Percent, 
  Zap, 
  Globe2,
  ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type ActivityStatusFilter = 'ALL' | 'SENT' | 'RECEIVED' | 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export default function ActivityPage() {
  const router = useRouter();
  const { transactions } = usePayment();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ActivityStatusFilter>('ALL');
  const [currencyFilter, setCurrencyFilter] = useState<string>('ALL');
  const [countryFilter, setCountryFilter] = useState<string>('ALL');
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Compute User Analytics
  const totalSentVolumeUsd = transactions.reduce((sum, tx) => sum + tx.sourceAmount, 0);
  const avgFee = transactions.length > 0 ? (transactions.reduce((sum, tx) => sum + tx.fee, 0) / transactions.length).toFixed(2) : '1.50';
  const completedCount = transactions.filter((t) => t.status === 'COMPLETED' || t.status === 'RECIPIENT_CREDITED').length;

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.beneficiaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.beneficiaryUpiId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesStatus = true;
    if (statusFilter === 'SENT') {
      matchesStatus = true;
    } else if (statusFilter === 'RECEIVED') {
      matchesStatus = false;
    } else if (statusFilter === 'PENDING') {
      matchesStatus = tx.status !== 'COMPLETED' && tx.status !== 'RECIPIENT_CREDITED' && !tx.status.includes('FAILED') && tx.status !== 'REFUNDED';
    } else if (statusFilter === 'COMPLETED') {
      matchesStatus = tx.status === 'COMPLETED' || tx.status === 'RECIPIENT_CREDITED';
    } else if (statusFilter === 'FAILED') {
      matchesStatus = tx.status.includes('FAILED') || tx.status === 'BANK_DECLINED';
    } else if (statusFilter === 'REFUNDED') {
      matchesStatus = tx.status === 'REFUNDED' || tx.status === 'REFUND_PENDING';
    }

    const matchesCurrency =
      currencyFilter === 'ALL'
        ? true
        : tx.sourceCurrency === currencyFilter || tx.targetCurrency === currencyFilter;

    const matchesCountry =
      countryFilter === 'ALL'
        ? true
        : tx.beneficiaryCountry.toLowerCase() === countryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCurrency && matchesCountry;
  });

  const STATUS_FILTERS: { key: ActivityStatusFilter; label: string }[] = [
    { key: 'ALL', label: 'All' },
    { key: 'SENT', label: 'Sent' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'FAILED', label: 'Failed' },
    { key: 'REFUNDED', label: 'Refunded' },
  ];

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] px-4 pt-3 pb-24 max-w-lg mx-auto space-y-5 select-none">
      {/* Top Header */}
      <div className="flex items-center gap-3 pt-1">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-2xl font-normal text-white tracking-tight">Transaction history</h1>
          <p className="text-xs text-[#8E918F]">All settlements and payments</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-[#1E1F24] border border-[#35383F] rounded-full px-4 py-2.5 shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions"
          className="flex-1 bg-transparent text-sm text-white placeholder-[#8E918F] focus:outline-none"
        />
      </div>

      {/* Status Filter Chips (Material 3 Horizontal Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s.key}
            onClick={() => setStatusFilter(s.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 ${
              statusFilter === s.key
                ? 'bg-[#004A77] text-[#C2E7FF] font-semibold'
                : 'bg-[#1E1F24] text-[#C4C7C5] hover:text-white border border-[#35383F]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Seamless Transaction Feed (Flat Rows on Canvas) */}
      <div className="pt-2">
        {filteredTransactions.length > 0 ? (
          <div className="divide-y divide-[#23252B]/40">
            {filteredTransactions.map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                onClick={() => {
                  setSelectedTransaction(tx);
                  setIsDetailOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No Transactions Found"
            description="There are no payment settlements matching your active filter criteria."
            actionLabel="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('ALL');
              setCurrencyFilter('ALL');
              setCountryFilter('ALL');
            }}
          />
        )}
      </div>

      {/* Comprehensive Transaction Detail Modal */}
      <TransactionDetailModal
        transaction={selectedTransaction}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
      />
    </div>
  );
}
