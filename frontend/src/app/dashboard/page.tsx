'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  PlusCircle,
  QrCode,
  Wallet,
  Clock,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  Download,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import HashViewer from '@/components/ui/HashViewer';
import BottomSheet from '@/components/ui/BottomSheet';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import { transactionApi, getStoredUser, isAuthenticated } from '@/lib/api';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  target_currency: string;
  recipient_name: string;
  recipient_id: string;
  final_amount: number;
  status: string;
  settlement_time: number | null;
  created_at: string;
  fee: number;
  blockchain_hash?: string;
}

const ANALYTICS_DATA = [
  { month: 'Apr', volume: 45000, savings: 2400 },
  { month: 'May', volume: 82000, savings: 4800 },
  { month: 'Jun', volume: 65000, savings: 3600 },
  { month: 'Jul', volume: 120000, savings: 7200 },
  { month: 'Aug', volume: 185000, savings: 11500 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const user = mounted ? getStoredUser() : null;

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Detail Sheet
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false);
  const [topupAmount, setTopupAmount] = useState('10000');

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true);
    transactionApi
      .getHistory(page, 15)
      .then((res) => {
        const data = res.data.data;
        setTransactions(data.transactions || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        console.error('Failed to fetch transactions:', err);
      })
      .finally(() => setLoading(false));
  }, [page, mounted]);

  const completed = transactions.filter((t) => t.status === 'COMPLETED');
  const totalVolume = completed.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalSaved = Math.round(totalVolume * 0.045);
  const avgSpeed =
    completed.length > 0
      ? (completed.reduce((s, t) => s + (t.settlement_time || 8), 0) / completed.length).toFixed(1)
      : '7.9';

  const userBalance = user?.wallet_balance || 47392;

  // Filtered Transactions
  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.recipient_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.target_currency?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDownloadInvoice = (txn: Transaction) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(37, 99, 235);
      doc.rect(0, 0, 210, 30, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.text('AutoUPI Payment Statement', 20, 20);

      doc.setTextColor(30, 41, 59);
      doc.setFontSize(10);
      let y = 45;
      doc.text(`Transaction ID: ${txn.id}`, 20, y);
      doc.text(`Date: ${new Date(txn.created_at).toLocaleString()}`, 20, (y += 8));
      doc.text(`Recipient: ${txn.recipient_name} (${txn.recipient_id})`, 20, (y += 8));
      doc.text(`Amount: INR ${txn.amount?.toLocaleString('en-IN')}`, 20, (y += 8));
      doc.text(`Status: ${txn.status}`, 20, (y += 8));
      doc.save(`AutoUPI-${txn.id.slice(0, 8)}.pdf`);
      toast.success('Invoice downloaded!');
    } catch {
      toast.error('Failed to download invoice');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {user?.full_name?.split(' ')[0] || 'Member'} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Manage your international payments and instant settlement wallet.
            </p>
          </div>

          <Button
            size="md"
            onClick={() => router.push('/send')}
            className="self-start sm:self-auto shadow-glow-primary font-bold"
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send Money Now
          </Button>
        </div>

        {/* Balance Card & Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Available Balance Card */}
          <Card
            variant="elevated"
            padding="lg"
            className="lg:col-span-2 relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-accent-600 text-white shadow-xl border-0"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                  Total Available Balance
                </span>
                <div className="text-3xl sm:text-5xl font-black num tracking-tight">
                  ₹{userBalance.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white">
                <Wallet className="w-5 h-5" />
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.push('/send')}
                className="p-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-center space-y-1"
              >
                <Send className="w-4 h-4 mx-auto" />
                <span className="block text-xs font-bold">Send</span>
              </button>

              <button
                type="button"
                onClick={() => setAddMoneyModalOpen(true)}
                className="p-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-center space-y-1"
              >
                <PlusCircle className="w-4 h-4 mx-auto" />
                <span className="block text-xs font-bold">Add Money</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/wallet')}
                className="p-3 rounded-xl bg-white/15 hover:bg-white/25 active:scale-95 transition-all text-center space-y-1"
              >
                <QrCode className="w-4 h-4 mx-auto" />
                <span className="block text-xs font-bold">Wallet QR</span>
              </button>
            </div>
          </Card>

          {/* Quick Metrics Column */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <Card variant="default" padding="md" className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Total Saved vs SWIFT</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 num">
                ₹{totalSaved.toLocaleString('en-IN')}
              </div>
              <p className="text-[10px] text-slate-400">Zero foreign exchange hidden spread</p>
            </Card>

            <Card variant="default" padding="md" className="space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Average Settlement</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white num">
                {avgSpeed}s
              </div>
              <p className="text-[10px] text-slate-400">L2 Gift City channel operational</p>
            </Card>
          </div>
        </div>

        {/* Analytics Chart */}
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Transfer Volume & Savings (Last 5 Months)
            </h2>
            <span className="badge-success">Real-Time Growth</span>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ANALYTICS_DATA}>
                <defs>
                  <linearGradient id="volGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#2563EB"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#volGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Transaction History Section */}
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Recent Transactions ({total})
            </h2>

            {/* Search & Filter */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search recipient or ID..."
                  className="w-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="COMPLETED">Completed</option>
                <option value="PROCESSING">Processing</option>
                <option value="PENDING">Pending</option>
                <option value="FAILED">Failed</option>
              </select>
            </div>
          </div>

          {/* Transaction List */}
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-2 py-4">
                <Skeleton height={56} />
                <Skeleton height={56} />
                <Skeleton height={56} />
              </div>
            ) : filteredTransactions.length > 0 ? (
              filteredTransactions.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTxn(t)}
                  className="w-full p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {t.recipient_name || 'International Transfer'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {new Date(t.created_at).toLocaleDateString()} • {t.target_currency} Transfer
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 space-y-1">
                    <p className="font-bold text-sm text-slate-900 dark:text-white num">
                      -₹{t.amount?.toLocaleString('en-IN')}
                    </p>
                    <StatusBadge status={t.status} size="sm" />
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <Clock className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold">No transactions found</p>
                <p className="text-xs">Send your first international payment in 8 seconds.</p>
                <Button size="sm" onClick={() => router.push('/send')} className="mt-2">
                  Send Money
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Transaction Detail Bottom Sheet */}
        <BottomSheet
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          title="Transaction Details"
        >
          {selectedTxn && (
            <div className="space-y-5">
              <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1">
                <StatusBadge status={selectedTxn.status} size="md" />
                <h3 className="text-3xl font-black num text-slate-900 dark:text-white">
                  ₹{selectedTxn.amount?.toLocaleString('en-IN')}
                </h3>
                <p className="text-xs text-slate-500">
                  Recipient receives {selectedTxn.target_currency} {selectedTxn.final_amount?.toLocaleString()}
                </p>
              </div>

              <div className="space-y-3 text-xs p-4 rounded-xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient Name:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{selectedTxn.recipient_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Recipient Identifier:</span>
                  <span className="font-mono font-bold">{selectedTxn.recipient_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Settlement Speed:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedTxn.settlement_time || 8.2} Seconds
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-mono">{selectedTxn.id.slice(0, 16)}...</span>
                </div>
                {selectedTxn.blockchain_hash && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Blockchain Hash:</span>
                    <HashViewer hash={selectedTxn.blockchain_hash} size="sm" showExplorerLink />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => handleDownloadInvoice(selectedTxn)}
                  leftIcon={<Download className="w-4 h-4" />}
                >
                  Download PDF
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => setSelectedTxn(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </BottomSheet>

        {/* Add Money Modal */}
        <Modal
          isOpen={addMoneyModalOpen}
          onClose={() => setAddMoneyModalOpen(false)}
          title="Add Funds to AutoUPI Wallet"
          description="Instant deposit via UPI / NetBanking"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Deposit Amount (INR)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-lg font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="input-field pl-8 font-black text-xl num"
                />
              </div>
            </div>

            <div className="flex gap-2">
              {[5000, 10000, 25000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTopupAmount(amt.toString())}
                  className="flex-1 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-white/5 hover:bg-slate-200"
                >
                  +₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            <Button
              size="lg"
              onClick={() => {
                toast.success(`₹${Number(topupAmount).toLocaleString('en-IN')} added via UPI!`);
                setAddMoneyModalOpen(false);
              }}
              className="w-full font-bold shadow-glow-primary"
            >
              Deposit with UPI App
            </Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
