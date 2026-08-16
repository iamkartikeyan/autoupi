'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Send, ArrowRight, Check, X, Blocks, Eye, Zap, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

interface WalletData {
  id: string;
  address: string;
  balance: number;
}

export default function BlockchainDemoPage() {
  const router = useRouter();
  const [walletA, setWalletA] = useState<WalletData | null>(null);
  const [walletB, setWalletB] = useState<WalletData | null>(null);
  const [activeWallet, setActiveWallet] = useState<'A' | 'B'>('A');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch current user's wallet
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/wallet/my-wallet`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWalletA(response.data.data);
      setToAddress(''); // Will be set when user switches to wallet B

      // For demo purposes, create/get a second wallet
      // In real scenario, this would be another user's wallet
      setWalletB({
        id: 'demo-b',
        address: '0xdemo4567890abcdef1234567890abcdef123456',
        balance: 15000,
      });
    } catch (error: any) {
      console.error('Failed to fetch wallets:', error);
      toast.error('Failed to load wallets');
    } finally {
      setLoading(false);
    }
  };

  const switchWallet = () => {
    setActiveWallet(activeWallet === 'A' ? 'B' : 'A');
    toast.success(`Switched to Wallet ${activeWallet === 'A' ? 'B' : 'A'}`);
  };

  const calculateFee = () => {
    const amt = parseFloat(amount || '0');
    return amt * 0.02;
  };

  const calculateTotal = () => {
    const amt = parseFloat(amount || '0');
    return amt + calculateFee();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentWallet = activeWallet === 'A' ? walletA : walletB;
    const receiverWallet = activeWallet === 'A' ? walletB : walletA;

    if (!currentWallet || !receiverWallet) {
      toast.error('Wallets not loaded');
      return;
    }

    if (!amount) {
      toast.error('Please enter amount');
      return;
    }

    const total = calculateTotal();
    if (total > currentWallet.balance) {
      toast.error(`Insufficient balance. Need ₹${total.toFixed(2)}, have ₹${currentWallet.balance.toFixed(2)}`);
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/transfer`,
        {
          to_address: receiverWallet.address,
          amount: parseFloat(amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult({
        ...response.data.data,
        fromName: activeWallet === 'A' ? 'Alice' : 'Bob',
        toName: activeWallet === 'A' ? 'Bob' : 'Alice',
      });
      setShowResult(true);
      toast.success('Transfer successful! 🎉');

      // Refresh wallets
      fetchWallets();
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast.error(error.response?.data?.error || 'Transfer failed');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-white text-2xl">Loading Demo...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
            ⚡ Live Blockchain Demo
          </h1>
          <p className="text-xl text-purple-200">
            See blockchain transactions in real-time - Watch balances change instantly!
          </p>
        </motion.div>

        {/* Wallet Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Wallet A - Alice */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-gradient-to-br ${
              activeWallet === 'A' ? 'from-blue-600 to-cyan-600' : 'from-blue-800 to-cyan-800'
            } rounded-2xl p-6 shadow-2xl border-4 ${
              activeWallet === 'A' ? 'border-white' : 'border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Alice</h3>
                  <p className="text-blue-100 text-sm">Wallet A</p>
                </div>
              </div>
              {activeWallet === 'A' && (
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white">
                  ACTIVE
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-blue-100 text-xs mb-1">Address</p>
              <code className="text-white text-xs bg-black/20 px-2 py-1 rounded block break-all">
                {walletA?.address || 'Loading...'}
              </code>
            </div>

            <div>
              <p className="text-blue-100 text-xs mb-1">Balance</p>
              <p className="text-4xl font-bold text-white">
                ₹{walletA?.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
          </motion.div>

          {/* Wallet B - Bob */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className={`bg-gradient-to-br ${
              activeWallet === 'B' ? 'from-purple-600 to-pink-600' : 'from-purple-800 to-pink-800'
            } rounded-2xl p-6 shadow-2xl border-4 ${
              activeWallet === 'B' ? 'border-white' : 'border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Bob</h3>
                  <p className="text-purple-100 text-sm">Wallet B</p>
                </div>
              </div>
              {activeWallet === 'B' && (
                <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold text-white">
                  ACTIVE
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-purple-100 text-xs mb-1">Address</p>
              <code className="text-white text-xs bg-black/20 px-2 py-1 rounded block break-all">
                {walletB?.address || 'Loading...'}
              </code>
            </div>

            <div>
              <p className="text-purple-100 text-xs mb-1">Balance</p>
              <p className="text-4xl font-bold text-white">
                ₹{walletB?.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 }) || '0.00'}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Transfer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Make a Transfer</h2>
            <button
              onClick={switchWallet}
              className="flex items-center gap-2 bg-white/20 text-white px-4 py-2 rounded-lg hover:bg-white/30 transition"
            >
              <RefreshCw className="w-4 h-4" />
              Switch Wallet
            </button>
          </div>

          {!showResult ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-gray-300 text-sm mb-2">Transfer Direction:</p>
                <div className="flex items-center justify-center gap-4 text-white">
                  <span className="font-bold text-lg">
                    {activeWallet === 'A' ? 'Alice' : 'Bob'}
                  </span>
                  <ArrowRight className="w-6 h-6" />
                  <span className="font-bold text-lg">
                    {activeWallet === 'A' ? 'Bob' : 'Alice'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2 font-semibold">Amount (₹)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount to send"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  disabled={sending}
                  min="0"
                  step="0.01"
                />
              </div>

              {amount && parseFloat(amount) > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-white/5 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between text-gray-300">
                    <span>Amount:</span>
                    <span>₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Fee (2%):</span>
                    <span>₹{calculateFee().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold">
                    <span>Total Deduction:</span>
                    <span>₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="text-green-400 text-sm">
                    Receiver gets: ₹{parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Mining Block...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Send via Blockchain
                  </>
                )}
              </button>
            </form>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">Transfer Complete! 🎉</h3>
                  <p className="text-gray-300">
                    {result.fromName} sent ₹{result.transaction.amount.toLocaleString()} to {result.toName}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4">
                    <p className="text-red-300 text-sm mb-1">{result.fromName}'s New Balance</p>
                    <p className="text-3xl font-bold text-white">
                      ₹{result.balances.from.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-red-300 text-xs mt-2">
                      Deducted: ₹{(result.balances.from.balance + result.transaction.amount + result.transaction.fee).toLocaleString('en-IN', { minimumFractionDigits: 2 })} → ₹{result.balances.from.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4">
                    <p className="text-green-300 text-sm mb-1">{result.toName}'s New Balance</p>
                    <p className="text-3xl font-bold text-white">
                      ₹{result.balances.to.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-green-300 text-xs mt-2">
                      Added: ₹{(result.balances.to.balance - result.transaction.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })} → ₹{result.balances.to.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-gray-400 text-xs mb-1">Block Number</p>
                  <p className="text-white font-bold text-lg">#{result.block.block_number}</p>
                  <p className="text-gray-400 text-xs mt-3 mb-1">Transaction Hash</p>
                  <code className="text-purple-400 text-xs break-all">
                    {result.transaction.transaction_hash}
                  </code>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowResult(false);
                      setAmount('');
                      fetchWallets();
                    }}
                    className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Another Transfer
                  </button>
                  <button
                    onClick={() => router.push('/blockchain')}
                    className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition flex items-center justify-center gap-2"
                  >
                    <Eye className="w-5 h-5" />
                    View Blockchain
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => router.push('/wallet')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition text-left"
          >
            <Wallet className="w-8 h-8 text-blue-400 mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">My Wallet</h3>
            <p className="text-gray-400 text-sm">View your blockchain wallet and transaction history</p>
          </button>

          <button
            onClick={() => router.push('/send-blockchain')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition text-left"
          >
            <Send className="w-8 h-8 text-green-400 mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">Send Money</h3>
            <p className="text-gray-400 text-sm">Transfer funds to any wallet address</p>
          </button>

          <button
            onClick={() => router.push('/blockchain')}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition text-left"
          >
            <Blocks className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-white font-bold text-lg mb-1">Blockchain Explorer</h3>
            <p className="text-gray-400 text-sm">View all blocks and transactions on the blockchain</p>
          </button>
        </div>
      </div>
    </div>
  );
}
