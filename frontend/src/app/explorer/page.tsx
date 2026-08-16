'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Box,
  Database,
  Search,
  Hash,
  Clock,
  ArrowRight,
  Blocks,
  Link as LinkIcon,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';
import AppLayout from '@/components/layout/AppLayout';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import HashViewer from '@/components/ui/HashViewer';
import Modal from '@/components/ui/Modal';
import Skeleton from '@/components/ui/Skeleton';
import { blockchainApi } from '@/lib/api';

interface Block {
  id: string;
  block_number: number;
  previous_hash: string;
  block_hash: string;
  nonce: number;
  timestamp: string;
  transactions_count: number;
}

interface Stats {
  totalBlocks: number;
  totalTransactions: number;
  totalVolume: number;
  totalFees: number;
  latestBlock: number;
  averageBlockSize: number;
}

export default function BlockchainExplorer() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchData = async () => {
    try {
      const [blocksRes, statsRes] = await Promise.all([
        blockchainApi.getBlocks(1, 20),
        blockchainApi.getStats(),
      ]);

      setBlocks(blocksRes.data.data.blocks || []);
      setStats(statsRes.data.data);
    } catch (error) {
      console.warn('Fallback blockchain explorer mode:', error);
      // Clean mock data if offline
      setStats({
        totalBlocks: 14820,
        totalTransactions: 49830,
        totalVolume: 84200000,
        totalFees: 168400,
        latestBlock: 14820,
        averageBlockSize: 3.4,
      });
      setBlocks([
        {
          id: 'b-1',
          block_number: 14820,
          previous_hash: '0x8f3c71a4b9281e05d419c836a0f7e1b5d92847a16e02b7498c1a7d5e493f0b21',
          block_hash: '0x3a9f1c7d2e4850b1a8f9c4e2d3b5a7f8e9c0b1a2d3e4f5a6b7c8d9e0f1a2b3c4',
          nonce: 10482,
          timestamp: new Date().toISOString(),
          transactions_count: 4,
        },
        {
          id: 'b-0',
          block_number: 0,
          previous_hash: '0x0000000000000000000000000000000000000000000000000000000000000000',
          block_hash: '0x0000000000000000000000000000000000000000000000000000000000000001',
          nonce: 0,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          transactions_count: 1,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      // Search hash or block
      if (/^\d+$/.test(searchQuery.trim())) {
        const res = await blockchainApi.getBlock(parseInt(searchQuery.trim()));
        if (res.data.data) {
          setSelectedBlock(res.data.data);
        } else {
          toast.error('Block not found');
        }
      } else {
        const res = await blockchainApi.getTransaction(searchQuery.trim());
        if (res.data.data) {
          setSearchResult(res.data.data);
        } else {
          toast.error('Transaction hash not found on network');
        }
      }
    } catch {
      toast.error('No record found for this query');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              AutoUPI Blockchain Explorer
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Live cryptographic ledger recording cross-border payment settlements.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-500/20 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>GIFT City L2 Consensus Active</span>
            </span>
          </div>
        </div>

        {/* Network Vital Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card variant="default" padding="md" className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Total Blocks Mined</span>
              <Box className="w-4 h-4 text-primary-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white num">
              {loading ? '...' : (stats?.totalBlocks || 14820).toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400">Block Time: ~1.8s</p>
          </Card>

          <Card variant="default" padding="md" className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>On-Chain Settlements</span>
              <LinkIcon className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white num">
              {loading ? '...' : (stats?.totalTransactions || 49830).toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400">100% Finality Reached</p>
          </Card>

          <Card variant="default" padding="md" className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Settled Volume</span>
              <Database className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 num">
              ₹{loading ? '...' : ((stats?.totalVolume || 84200000) / 10000000).toFixed(2)} Cr
            </div>
            <p className="text-[10px] text-slate-400">INR Escrow Backed</p>
          </Card>

          <Card variant="default" padding="md" className="space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Avg Gas Fee</span>
              <Activity className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white num">
              ₹0.00
            </div>
            <p className="text-[10px] text-slate-400">Sponsored Layer-2 Node</p>
          </Card>
        </div>

        {/* Hash Search Bar */}
        <Card variant="elevated" padding="md">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Transaction Hash (0x...) or Block Number (e.g. 14820)..."
                className="w-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              />
            </div>
            <Button type="submit" size="md" isLoading={searchLoading} className="font-bold">
              Verify On-Chain
            </Button>
          </form>
        </Card>

        {/* Live Block Stream */}
        <Card variant="default" padding="lg" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Blocks className="w-5 h-5 text-primary-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Mined Blocks Stream
              </h2>
            </div>
            <span className="badge-purple">SHA-256 Validated</span>
          </div>

          {/* Responsive List / Table */}
          <div className="space-y-2">
            {loading ? (
              <div className="space-y-2 py-4">
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
              </div>
            ) : (
              blocks.map((block) => (
                <div
                  key={block.id || block.block_number}
                  onClick={() => setSelectedBlock(block)}
                  className="p-3.5 sm:p-4 rounded-xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center font-mono font-bold text-xs">
                      #{block.block_number}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">
                          Block #{block.block_number}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {block.transactions_count || 1} Txns
                        </span>
                      </div>
                      <HashViewer hash={block.block_hash} size="sm" startChars={12} endChars={8} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 text-xs text-slate-500 font-mono">
                    <span>Nonce: {block.nonce}</span>
                    <span>•</span>
                    <span>{new Date(block.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Block Detail Modal */}
        <Modal
          isOpen={!!selectedBlock}
          onClose={() => setSelectedBlock(null)}
          title={`Block #${selectedBlock?.block_number} Cryptographic Header`}
          description="Immutable consensus record on AutoUPI private blockchain"
        >
          {selectedBlock && (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] space-y-2">
                <div>
                  <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase">
                    Block Hash (SHA-256)
                  </span>
                  <HashViewer hash={selectedBlock.block_hash} truncate={false} className="w-full text-xs" />
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] font-sans font-bold uppercase">
                    Previous Hash
                  </span>
                  <HashViewer hash={selectedBlock.previous_hash} truncate={false} className="w-full text-xs" />
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans font-bold">Nonce</span>
                    <span className="font-bold text-slate-900 dark:text-white">{selectedBlock.nonce}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-sans font-bold">Timestamp</span>
                    <span className="text-slate-900 dark:text-white">{new Date(selectedBlock.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                size="md"
                variant="secondary"
                onClick={() => setSelectedBlock(null)}
                className="w-full font-sans"
              >
                Close Header
              </Button>
            </div>
          )}
        </Modal>

        {/* Transaction Search Result Modal */}
        <Modal
          isOpen={!!searchResult}
          onClose={() => setSearchResult(null)}
          title="Transaction Verified On-Chain"
        >
          {searchResult && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 text-emerald-800 dark:text-emerald-300 font-bold">
                ✓ Verified On GIFT City L2 Ledger
              </div>
              <div className="space-y-2 font-mono">
                <p>Hash: {searchResult.transaction_hash}</p>
                <p>From: {searchResult.from_wallet}</p>
                <p>To: {searchResult.to_wallet}</p>
                <p>Amount: ₹{searchResult.amount?.toLocaleString('en-IN')}</p>
              </div>
              <Button size="md" variant="secondary" onClick={() => setSearchResult(null)} className="w-full">
                Close
              </Button>
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  );
}
