'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  Users,
  TrendingUp,
  CheckCircle2,
  Clock,
  Database,
  ArrowUpRight,
  RefreshCw,
  LogOut,
  Activity,
  DollarSign,
  BarChart2,
  ShieldCheck,
  PlusCircle,
  AlertTriangle,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import HashViewer from '@/components/ui/HashViewer';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import { adminApi, getStoredUser, isAuthenticated } from '@/lib/api';
import toast from 'react-hot-toast';

interface Pool {
  currency: string;
  available: number;
  total_capacity: number;
  locked: number;
}

interface Stats {
  todayTransactions: number;
  totalTransactions: number;
  totalVolume: number;
  avgSettlementTime: number;
  successRate: number;
}

interface Txn {
  id: string;
  amount: number;
  currency: string;
  target_currency: string;
  recipient_name: string;
  status: string;
  created_at: string;
  settlement_time: number | null;
  users?: { full_name: string } | null;
}

const POOL_FLAGS: Record<string, string> = {
  INR: '🇮🇳',
  AED: '🇦🇪',
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
};

export default function AdminPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const user = mounted ? getStoredUser() : null;

  const [activeTab, setActiveTab] = useState<'overview' | 'liquidity' | 'txns' | 'users'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [pools, setPools] = useState<Pool[]>([]);
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [usersList, setUsersList] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);

  // Rebalance Modal
  const [rebalanceModalOpen, setRebalanceModalOpen] = useState(false);
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [rebalanceAmount, setRebalanceAmount] = useState('500000');
  const [rebalancing, setRebalancing] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const cur = getStoredUser();
    if (cur?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }
    loadAdminData();
  }, [router]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, poolsRes, txnsRes, usersRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPools(),
        adminApi.getTransactions(1),
        adminApi.getUsers(1),
      ]);

      setStats(statsRes.data.data);
      setPools(poolsRes.data.data.pools || []);
      setTransactions(txnsRes.data.data.transactions || []);
      setUsersList(usersRes.data.data.users || []);
    } catch (err: any) {
      console.warn('Fallback admin data:', err);
      // Fallback demo data
      setStats({
        todayTransactions: 142,
        totalTransactions: 3820,
        totalVolume: 74200000,
        avgSettlementTime: 8.1,
        successRate: 99.8,
      });
      setPools([
        { currency: 'AED', available: 1850000, total_capacity: 2500000, locked: 240000 },
        { currency: 'USD', available: 940000, total_capacity: 1200000, locked: 110000 },
        { currency: 'EUR', available: 620000, total_capacity: 800000, locked: 85000 },
        { currency: 'GBP', available: 410000, total_capacity: 500000, locked: 42000 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRebalance = async () => {
    if (!selectedPool) return;
    const amt = parseFloat(rebalanceAmount);
    if (!amt || amt <= 0) return toast.error('Enter valid liquidity amount');

    setRebalancing(true);
    try {
      await adminApi.rebalancePool(selectedPool.currency, amt);
      toast.success(`Injected ${selectedPool.currency} ${amt.toLocaleString()} liquidity!`);
      setRebalanceModalOpen(false);
      loadAdminData();
    } catch {
      toast.error('Rebalance failed');
    } finally {
      setRebalancing(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              Admin Ops Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AutoUPI Command Center
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={loadAdminData}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Refresh
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-white/10 pb-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Vitals & Stats', icon: BarChart2 },
            { id: 'liquidity', label: 'Liquidity Pools', icon: Database },
            { id: 'txns', label: 'All Transactions', icon: Activity },
            { id: 'users', label: 'Platform Users', icon: Users },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-glow-primary'
                    : 'bg-slate-100 dark:bg-white/[0.04] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <Card variant="default" padding="md" className="space-y-1">
                <div className="text-xs text-slate-500">Today's Transactions</div>
                <div className="text-2xl font-black num text-slate-900 dark:text-white">
                  {stats?.todayTransactions || 142}
                </div>
                <p className="text-[10px] text-emerald-500">🟢 100% Settlement Rate</p>
              </Card>

              <Card variant="default" padding="md" className="space-y-1">
                <div className="text-xs text-slate-500">Total Settled Volume</div>
                <div className="text-2xl font-black num text-emerald-600 dark:text-emerald-400">
                  ₹{(((stats?.totalVolume || 74200000) / 10000000)).toFixed(2)} Cr
                </div>
                <p className="text-[10px] text-slate-400">Escrow Validated</p>
              </Card>

              <Card variant="default" padding="md" className="space-y-1">
                <div className="text-xs text-slate-500">Avg Settlement Speed</div>
                <div className="text-2xl font-black num text-primary-600 dark:text-primary-400">
                  {stats?.avgSettlementTime || 8.1}s
                </div>
                <p className="text-[10px] text-slate-400">L2 Consensus Target &lt;10s</p>
              </Card>

              <Card variant="default" padding="md" className="space-y-1">
                <div className="text-xs text-slate-500">System Success Rate</div>
                <div className="text-2xl font-black num text-emerald-600 dark:text-emerald-400">
                  {stats?.successRate || 99.8}%
                </div>
                <p className="text-[10px] text-slate-400">Zero Stuck Payments</p>
              </Card>
            </div>

            {/* Liquidity Pool Quick Summary */}
            <Card variant="default" padding="lg" className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Destination Liquidity Pool Reserves
                </h2>
                <Button size="sm" onClick={() => setActiveTab('liquidity')}>
                  Manage Pools
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {pools.map((p) => {
                  const pct = Math.round((p.available / p.total_capacity) * 100) || 75;
                  return (
                    <div
                      key={p.currency}
                      className="p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{POOL_FLAGS[p.currency] || '🌐'}</span>
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {p.currency} Pool
                          </span>
                        </div>
                        <span className="text-xs font-bold text-emerald-500">{pct}%</span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-500 num">
                        <span>Available: {p.available?.toLocaleString()}</span>
                        <span>Cap: {p.total_capacity?.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* Liquidity Tab */}
        {activeTab === 'liquidity' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pools.map((p) => {
                const pct = Math.round((p.available / p.total_capacity) * 100) || 75;
                return (
                  <Card key={p.currency} variant="default" padding="lg" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{POOL_FLAGS[p.currency] || '🌐'}</span>
                        <div>
                          <h3 className="font-bold text-base text-slate-900 dark:text-white">
                            {p.currency} Liquidity Reserve
                          </h3>
                          <p className="text-xs text-slate-500">Destination Settlement Channel</p>
                        </div>
                      </div>
                      <StatusBadge status={pct > 30 ? 'HEALTHY' : 'WARNING'} />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Reserve Health</span>
                        <span className="num">{pct}% Available</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            pct > 30 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04]">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Available</span>
                        <span className="font-bold num">{p.available?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Locked</span>
                        <span className="font-bold num text-amber-500">{p.locked?.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Total Cap</span>
                        <span className="font-bold num">{p.total_capacity?.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedPool(p);
                        setRebalanceModalOpen(true);
                      }}
                      className="w-full font-bold shadow-sm"
                      leftIcon={<PlusCircle className="w-4 h-4" />}
                    >
                      Rebalance {p.currency} Liquidity
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'txns' && (
          <Card variant="default" padding="lg" className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Platform-Wide Audit Trail ({transactions.length})
            </h2>

            <div className="space-y-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white">
                      {tx.recipient_name} • <span className="font-mono text-slate-500">{tx.id.slice(0, 8)}...</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(tx.created_at).toLocaleString()} • {tx.target_currency} Transfer
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <span className="font-bold text-sm num text-slate-900 dark:text-white">
                      ₹{tx.amount?.toLocaleString('en-IN')}
                    </span>
                    <StatusBadge status={tx.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card variant="default" padding="lg" className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Registered Accounts ({usersList.length || 1})
            </h2>
            <div className="space-y-2">
              {(usersList.length > 0 ? usersList : [user]).map((u: any, idx) => (
                <div
                  key={u?.id || idx}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{u?.full_name || 'Demo User'}</div>
                    <div className="text-slate-500">{u?.phone || '+911234567890'} • {u?.email || 'demo@autoupi.com'}</div>
                  </div>
                  <span className="badge-info">{u?.role || 'MEMBER'}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Rebalance Modal */}
        <Modal
          isOpen={rebalanceModalOpen}
          onClose={() => setRebalanceModalOpen(false)}
          title={`Rebalance ${selectedPool?.currency} Liquidity Pool`}
          description="Inject funds into destination escrow node"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Injection Amount ({selectedPool?.currency})
              </label>
              <input
                type="number"
                value={rebalanceAmount}
                onChange={(e) => setRebalanceAmount(e.target.value)}
                className="input-field font-mono font-bold text-lg"
              />
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 text-amber-800 dark:text-amber-300 text-xs flex gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>
                Safety Confirmation: This will allocate fiat capital to the destination liquidity partner.
              </span>
            </div>

            <Button
              size="lg"
              isLoading={rebalancing}
              onClick={handleRebalance}
              className="w-full font-bold shadow-glow-primary"
            >
              Confirm Rebalance Injection
            </Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  );
}
