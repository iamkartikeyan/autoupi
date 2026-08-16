'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, Copy, Check, Send, ArrowDownLeft, ArrowUpRight, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

interface WalletData {
  id: string;
  user_id: string;
  address: string;
  balance: number;
  created_at: string;
}

interface Transaction {
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
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/wallet/my-wallet`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWallet(response.data.data);
      fetchTransactions(response.data.data.address);
    } catch (error: any) {
      console.error('Failed to fetch wallet:', error);
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (address: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/wallet/${address}/transactions?limit=10`
      );
      setTransactions(response.data.data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    }
  };

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      toast.success('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-white text-2xl">Loading wallet...</div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-white text-2xl">Wallet not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            My Blockchain Wallet
          </h1>
          <p className="text-gray-300">Manage your digital wallet and view transactions</p>
        </motion.div>

        {/* Wallet Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 mb-8 shadow-2xl"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <Wallet className="w-8 h-8 text-white" />
              <span className="text-white text-lg font-semibold">Blockchain Wallet</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-blue-100 text-sm mb-1">Wallet Address</p>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg p-3">
              <code className="text-white text-sm flex-1 break-all">
                {wallet.address}
              </code>
              <button
                onClick={copyAddress}
                className="text-white hover:bg-white/20 p-2 rounded transition"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <p className="text-blue-100 text-sm mb-1">Current Balance</p>
            <p className="text-5xl md:text-6xl font-bold text-white">
              ₹{wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => router.push('/send-blockchain')}
              className="flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              <Send className="w-5 h-5" />
              Send Money
            </button>
            <button
              onClick={() => router.push('/blockchain')}
              className="flex items-center gap-2 bg-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 transition"
            >
              View Blockchain
            </button>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Recent Transactions</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No transactions yet</p>
              <button
                onClick={() => router.push('/send-blockchain')}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Make your first transfer
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((txn, index) => {
                const isSender = txn.from_wallet === wallet.address;
                const amount = isSender ? -(txn.amount + txn.fee) : txn.amount;

                return (
                  <motion.div
                    key={txn.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className={`p-3 rounded-full ${
                            isSender ? 'bg-red-500/20' : 'bg-green-500/20'
                          }`}
                        >
                          {isSender ? (
                            <ArrowUpRight className="w-6 h-6 text-red-400" />
                          ) : (
                            <ArrowDownLeft className="w-6 h-6 text-green-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-white font-semibold">
                            {isSender ? 'Sent' : 'Received'}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {new Date(txn.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-xl font-bold ${
                            isSender ? 'text-red-400' : 'text-green-400'
                          }`}
                        >
                          {isSender ? '-' : '+'}₹{Math.abs(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </p>
                        <p className="text-gray-400 text-xs truncate max-w-[200px]">
                          {txn.transaction_hash}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
