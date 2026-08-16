'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Box, Database, Search, Hash, Clock, ArrowRight, Blocks, Link } from 'lucide-react';

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

  const fetchData = async () => {
    try {
      const [blocksRes, statsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/blocks?limit=20`),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/stats`)
      ]);

      setBlocks(blocksRes.data.data.blocks);
      setStats(statsRes.data.data);
    } catch (error) {
      console.error('Failed to fetch blockchain data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0B10] text-slate-300 font-sans selection:bg-primary-500/30 cursor-default flex flex-col">
      <header className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
        <Hash className="w-6 h-6 text-primary-500" />
        <span className="font-bold text-white text-lg tracking-tight">AutoUPI</span>
        <span className="bg-primary-500/20 text-primary-500 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full ml-2">Blockchain Explorer</span>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-2">
          <Database className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-black text-white tracking-tight">Live Blockchain Explorer</h1>
        </div>
        <p className="text-slate-400 mb-8 max-w-2xl">
          View all blocks, transactions, and cryptographic hashes in real-time. Every transfer is permanently recorded on the blockchain.
        </p>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/5 rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Activity className="w-4 h-4 text-success-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Network Status</span>
            </div>
            <div className="text-xl font-bold text-white">🟢 Active</div>
          </div>
          
          <div className="bg-white/5 border border-white/5 rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Box className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-bold uppercase tracking-wider">Total Blocks</span>
            </div>
            <div className="text-xl font-bold text-white">
              {loading ? '...' : stats?.totalBlocks || 0}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Link className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Transactions</span>
            </div>
            <div className="text-xl font-bold text-white">
              {loading ? '...' : stats?.totalTransactions || 0}
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span className="text-xs font-bold uppercase tracking-wider">Latest Block</span>
            </div>
            <div className="text-xl font-bold text-white">
              #{loading ? '...' : stats?.latestBlock || 0}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full bg-surface-1 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search by Transaction Hash or Block Number..."
          />
        </div>

        {/* Blocks Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Latest Blocks</h3>
            <span className="flex items-center gap-2 text-xs font-bold text-primary-500 bg-primary-500/10 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
              LIVE
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-xs uppercase tracking-wider font-bold text-slate-500">
                  <th className="px-6 py-4">Block</th>
                  <th className="px-6 py-4">Block Hash</th>
                  <th className="px-6 py-4">Transactions</th>
                  <th className="px-6 py-4">Nonce</th>
                  <th className="px-6 py-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {blocks.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                      <Blocks className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      No blocks yet. Make your first blockchain transfer to create a block.
                    </td>
                  </tr>
                )}
                {blocks.map((block, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={block.id}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-surface-2 p-2 rounded-lg">
                          <Blocks className="w-5 h-5 text-primary-500" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-white">
                            #{block.block_number}
                          </div>
                          {block.block_number === 0 && (
                            <div className="text-xs text-primary-400 font-semibold">Genesis Block</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs text-primary-400">
                        {block.block_hash.substring(0, 20)}...
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Prev: {block.previous_hash.substring(0, 16)}...
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-white">
                        {block.transactions_count}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-mono text-sm text-slate-300">
                        {block.nonce}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-300">
                        {new Date(block.timestamp).toLocaleString()}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h3 className="text-2xl font-bold text-white mb-6">How Blockchain Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20">
              <div className="text-4xl mb-3">🔐</div>
              <h4 className="text-lg font-bold text-white mb-2">Cryptographic Security</h4>
              <p className="text-sm text-slate-400">
                Every block is secured using SHA-256 hashing algorithm. Changing any data would require recalculating all subsequent blocks.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/20">
              <div className="text-4xl mb-3">⛏️</div>
              <h4 className="text-lg font-bold text-white mb-2">Proof of Work</h4>
              <p className="text-sm text-slate-400">
                Miners compete to find the correct nonce that satisfies the difficulty target, ensuring network security.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-purple-500/20">
              <div className="text-4xl mb-3">🔗</div>
              <h4 className="text-lg font-bold text-white mb-2">Immutable Chain</h4>
              <p className="text-sm text-slate-400">
                Each block contains the hash of the previous block, creating an unbreakable chain of transactions.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
