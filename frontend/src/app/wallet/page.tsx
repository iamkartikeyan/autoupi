'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet,
  Copy,
  Check,
  Send,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  QrCode,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Modal from '@/components/ui/Modal';
import HashViewer from '@/components/ui/HashViewer';
import Skeleton from '@/components/ui/Skeleton';
import { blockchainApi, getStoredUser, isAuthenticated } from '@/lib/api';

interface WalletData {
  id: string;
  user_id: string;
  address: string;
  balance: number;
  created_at: string;
}

interface BlockchainTxn {
  id: string;
  from_wallet: string;
  to_wallet: string;
  amount: number;
  fee: number;
  transaction_hash: string;
  timestamp: string;
}

export default function WalletPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const user = mounted ? getStoredUser() : null;

  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<BlockchainTxn[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [toAddress, setToAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    loadWallet();
  }, [router]);

  const loadWallet = async () => {
    setLoading(true);
    try {
      const res = await blockchainApi.getMyWallet();
      const wData = res.data.data;
      setWallet(wData);
      if (wData?.address) {
        const txRes = await blockchainApi.getWalletTransactions(wData.address, 15);
        setTransactions(txRes.data.data.transactions || []);
      }
    } catch (err: any) {
      console.warn('Fallback wallet mode:', err);
      // Clean fallback in demo mode
      const fallbackWallet = {
        id: 'w-demo-1',
        user_id: 'u-1',
        address: '0x71C2834a9281e05d419c836a0f7e1b5d92847a16',
        balance: 47392,
        created_at: new Date().toISOString(),
      };
      setWallet(fallbackWallet);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(transferAmount);
    if (!toAddress.trim()) return toast.error('Enter recipient blockchain address');
    if (!amt || amt <= 0) return toast.error('Enter a valid transfer amount');
    if (wallet && amt > wallet.balance) return toast.error('Insufficient wallet balance');

    setTransferLoading(true);
    try {
      await blockchainApi.transfer({ toAddress, amount: amt });
      toast.success(`Transferred ₹${amt.toLocaleString('en-IN')} on-chain! ⚡`);
      setSendModalOpen(false);
      setToAddress('');
      setTransferAmount('');
      loadWallet();
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Transfer failed');
    } finally {
      setTransferLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AutoUPI Virtual Wallet
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Your personal on-chain settlement account pegged 1:1 with Indian Rupee.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                setRefreshing(true);
                loadWallet();
              }}
              isLoading={refreshing}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => router.push('/send')}
              className="shadow-glow-primary"
              leftIcon={<Send className="w-3.5 h-3.5" />}
            >
              Send Money
            </Button>
          </div>
        </div>

        {/* Wallet Main Card */}
        {loading ? (
          <Skeleton height={200} />
        ) : (
          <Card
            variant="elevated"
            padding="lg"
            className="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 text-white border-primary-500/20 shadow-2xl relative overflow-hidden space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
                  Virtual Settlement Balance
                </span>
                <div className="text-4xl sm:text-5xl font-black num tracking-tight">
                  ₹{(wallet?.balance || 0).toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-slate-400">
                  Backed 100% by bank escrow • DICGC Insured
                </p>
              </div>

              {/* QR & Copy Address Pill */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-400">Your Wallet Address</div>
                <div className="flex items-center gap-2">
                  <HashViewer
                    hash={wallet?.address || ''}
                    size="sm"
                    startChars={10}
                    endChars={8}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setQrModalOpen(true)}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="View QR Code"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Wallet Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setSendModalOpen(true)}
                className="p-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-glow-primary transition-all active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Wallet Transfer</span>
              </button>

              <button
                type="button"
                onClick={() => setQrModalOpen(true)}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>Receive / QR</span>
              </button>

              <button
                type="button"
                onClick={() => router.push('/explorer')}
                className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View On-Chain Explorer</span>
              </button>
            </div>
          </Card>
        )}

        {/* Wallet Ledger History */}
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              On-Chain Wallet Activity ({transactions.length})
            </h2>
            <span className="badge-purple">L2 Consensus</span>
          </div>

          <div className="space-y-2">
            {loading ? (
              <Skeleton height={50} />
            ) : transactions.length > 0 ? (
              transactions.map((tx) => {
                const isOutgoing = tx.from_wallet?.toLowerCase() === wallet?.address?.toLowerCase();
                return (
                  <div
                    key={tx.id || tx.transaction_hash}
                    className="p-3.5 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isOutgoing
                            ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600'
                            : 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600'
                        }`}
                      >
                        {isOutgoing ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {isOutgoing ? 'Transferred to' : 'Received from'}{' '}
                          <span className="font-mono text-slate-500">
                            {(isOutgoing ? tx.to_wallet : tx.from_wallet)?.slice(0, 10)}...
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Hash: {tx.transaction_hash?.slice(0, 16)}...
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-bold num text-sm">
                      <span className={isOutgoing ? 'text-slate-900 dark:text-white' : 'text-emerald-600'}>
                        {isOutgoing ? '-' : '+'}₹{tx.amount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs space-y-1">
                <Clock className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
                <p className="font-semibold">No blockchain transactions yet</p>
                <p>Transfer money between wallets to see live blocks recorded.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Transfer Modal */}
        <Modal
          isOpen={sendModalOpen}
          onClose={() => setSendModalOpen(false)}
          title="Direct Wallet-to-Wallet Transfer"
          description="Instant cryptographic transfer on GIFT City L2"
        >
          <form onSubmit={handleTransfer} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Recipient Wallet Address
              </label>
              <input
                type="text"
                required
                value={toAddress}
                onChange={(e) => setToAddress(e.target.value)}
                placeholder="0x71C...4e89"
                className="input-field font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Amount (INR)
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-lg font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  required
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  placeholder="5000"
                  className="input-field pl-8 font-black text-xl num"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] text-xs space-y-1 text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Network Gas Fee:</span>
                <span className="font-bold text-emerald-500">₹0.00 (Sponsored)</span>
              </div>
              <div className="flex justify-between">
                <span>Confirmation Speed:</span>
                <span className="font-bold">Instant (&lt;1s)</span>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={transferLoading}
              className="w-full font-bold shadow-glow-primary"
            >
              Sign & Send Transfer
            </Button>
          </form>
        </Modal>

        {/* QR Code Modal */}
        <Modal
          isOpen={qrModalOpen}
          onClose={() => setQrModalOpen(false)}
          title="Receive Funds via Wallet"
          description="Scan or share your public AutoUPI address"
        >
          <div className="space-y-4 text-center">
            {/* Simulated QR Box */}
            <div className="w-48 h-48 mx-auto bg-white p-4 rounded-2xl shadow-md border border-slate-200 flex flex-col items-center justify-center space-y-2">
              <QrCode className="w-32 h-32 text-slate-900" />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-medium">Your Public Address</span>
              <HashViewer
                hash={wallet?.address || ''}
                truncate={false}
                className="w-full justify-center text-xs"
              />
            </div>

            <Button
              size="md"
              variant="secondary"
              onClick={() => setQrModalOpen(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
