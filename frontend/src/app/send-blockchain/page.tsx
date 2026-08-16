'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Wallet, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from 'axios';

interface WalletData {
  id: string;
  address: string;
  balance: number;
}

export default function SendBlockchainPage() {
  const router = useRouter();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

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
    } catch (error: any) {
      console.error('Failed to fetch wallet:', error);
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  const calculateFee = () => {
    const amt = parseFloat(amount || '0');
    return amt * 0.02; // 2% fee
  };

  const calculateTotal = () => {
    const amt = parseFloat(amount || '0');
    return amt + calculateFee();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!wallet) {
      toast.error('Wallet not found');
      return;
    }

    if (!toAddress || !amount) {
      toast.error('Please fill all fields');
      return;
    }

    if (toAddress === wallet.address) {
      toast.error('Cannot send to yourself');
      return;
    }

    const total = calculateTotal();
    if (total > wallet.balance) {
      toast.error(`Insufficient balance. You need ₹${total.toFixed(2)} but have ₹${wallet.balance.toFixed(2)}`);
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/transfer`,
        {
          to_address: toAddress,
          amount: parseFloat(amount),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data.data);
      toast.success('Transfer successful! 🎉');

      // Refresh wallet balance
      fetchWallet();
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast.error(error.response?.data?.error || 'Transfer failed');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="text-white text-2xl">Loading...</div>
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Send Money via Blockchain
          </h1>
          <p className="text-gray-300">Transfer funds instantly with blockchain technology</p>
        </motion.div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            {/* Wallet Info */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Your Balance</p>
                  <p className="text-3xl font-bold text-white">
                    ₹{wallet.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <Wallet className="w-12 h-12 text-white/50" />
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* To Address */}
              <div>
                <label className="block text-white mb-2 font-semibold">
                  Receiver's Wallet Address
                </label>
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-white mb-2 font-semibold">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={sending}
                  min="0"
                  step="0.01"
                />
              </div>

              {/* Fee Breakdown */}
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
                    <span>Total:</span>
                    <span>₹{calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </motion.div>
              )}

              {/* Warning */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-200 text-sm">
                  This transaction will be recorded on the blockchain permanently. 
                  Please verify the receiver's address carefully.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Money
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          /* Success Result */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
          >
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Transfer Successful! 🎉</h2>
              <p className="text-gray-300">Your transaction has been recorded on the blockchain</p>
            </div>

            {/* Transaction Details */}
            <div className="bg-white/5 rounded-xl p-6 mb-6 space-y-4">
              <h3 className="text-xl font-bold text-white mb-4">Transaction Details</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span className="text-white text-sm truncate max-w-[300px]">
                    {result.balances.from.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span className="text-white text-sm truncate max-w-[300px]">
                    {result.balances.to.address}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-bold">
                    ₹{result.transaction.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-white">
                    ₹{result.transaction.fee.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-gray-400">Block Number:</span>
                  <span className="text-white font-bold">#{result.block.block_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction Hash:</span>
                  <span className="text-blue-400 text-xs truncate max-w-[300px]">
                    {result.transaction.transaction_hash}
                  </span>
                </div>
              </div>
            </div>

            {/* Updated Balances */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <p className="text-red-300 text-sm mb-1">Your New Balance</p>
                <p className="text-2xl font-bold text-white">
                  ₹{result.balances.from.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <p className="text-green-300 text-sm mb-1">Receiver's New Balance</p>
                <p className="text-2xl font-bold text-white">
                  ₹{result.balances.to.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setResult(null);
                  setToAddress('');
                  setAmount('');
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send More
              </button>
              <button
                onClick={() => router.push('/wallet')}
                className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition"
              >
                View Wallet
              </button>
              <button
                onClick={() => router.push('/blockchain')}
                className="flex-1 bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition"
              >
                Blockchain Explorer
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
