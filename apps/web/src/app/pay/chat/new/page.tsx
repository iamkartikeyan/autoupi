'use client';

export const dynamic = 'force-dynamic';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePayment } from '../../../../context/PaymentContext';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { OTPModal } from '../../../../components/ui/OTPModal';
import { ChevronLeft, ShieldCheck, X, Send } from 'lucide-react';

function NewPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { bankAccounts, initiatePayment, confirmPaymentWithOtp } = usePayment();
  const { user } = useAuth();
  const { showToast } = useToast();

  const upiId = searchParams.get('upi') || '';
  const bankAccount = searchParams.get('bankAccount') || '';
  const ifsc = searchParams.get('ifsc') || '';

  const recipientId = upiId || bankAccount;
  const isBank = !!bankAccount;

  const [amount, setAmount] = useState('100');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingTxId, setPendingTxId] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  const primaryAccount = bankAccounts[0];

  const handlePay = async () => {
    if (!recipientId || Number(amount) <= 0) {
      showToast('Error', 'Enter a valid amount', 'error');
      return;
    }

    try {
      setIsProcessing(true);
      const res = await initiatePayment({
        beneficiaryId: 'temp_new',
        senderBankAccountId: primaryAccount?.id || 'acc_sbi',
        sourceCurrency: 'INR',
        sourceAmount: Number(amount),
        targetCurrency: 'INR',
        note: note || 'Payment via Auto-UPI',
      });
      setPendingTxId(res.transaction.id);
      setIsOtpOpen(true);
    } catch (err: any) {
      showToast('Error', err?.message || 'Unable to initiate payment', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOtp = async (otpCode: string) => {
    if (!pendingTxId) return;
    try {
      await confirmPaymentWithOtp(pendingTxId, otpCode);
      setIsOtpOpen(false);
      setIsPaid(true);
      showToast('Payment Successful', `₹${amount} sent to ${recipientId}`, 'success');
    } catch (err: any) {
      showToast('PIN Failed', 'Invalid UPI PIN', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] px-4 pt-3 pb-24 max-w-lg mx-auto flex flex-col select-none">
      {/* Top Bar */}
      <div className="flex items-center gap-3 pt-1 mb-6">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-normal text-white">
          {isBank ? 'Bank Transfer' : 'Send Money'}
        </h1>
      </div>

      {/* Recipient Info Card */}
      <div className="p-4 rounded-[24px] bg-[#1E1F24] border border-[#35383F] mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#0B57D0] flex items-center justify-center text-white font-bold text-lg shrink-0">
          {(upiId || bankAccount).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-normal text-white truncate">{upiId || bankAccount}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400">UPI Verified</span>
          </div>
          {ifsc && <p className="text-xs text-[#8E918F] font-mono mt-0.5">IFSC: {ifsc}</p>}
        </div>
      </div>

      {isPaid ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-12">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-normal text-white">Payment Sent!</h2>
          <p className="text-sm text-[#8E918F]">₹{amount} successfully sent to {recipientId}</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-8 py-3 rounded-full bg-[#A8C7FA] text-[#041E49] font-medium text-sm"
          >
            Back to Home
          </button>
        </div>
      ) : (
        <div className="flex-1 space-y-5">
          {/* Amount Input */}
          <div>
            <label className="text-xs text-[#8E918F] mb-1 block">Amount (₹)</label>
            <div className="relative border border-[#444746] focus-within:border-[#A8C7FA] rounded-2xl px-4 py-3 bg-transparent transition-colors">
              <span className="absolute left-4 top-3.5 text-sm text-[#8E918F]">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-5 bg-transparent text-lg font-mono text-white focus:outline-none"
                placeholder="0"
              />
            </div>

            {/* Quick Amount Presets */}
            <div className="flex gap-2 mt-2">
              {['100', '500', '1000', '2000'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setAmount(preset)}
                  className="flex-1 py-1.5 rounded-full bg-[#1E1F24] border border-[#35383F] text-xs text-[#C4C7C5] hover:text-white hover:border-[#A8C7FA] transition-colors font-mono"
                >
                  ₹{preset}
                </button>
              ))}
            </div>
          </div>

          {/* Note / Message */}
          <div>
            <label className="text-xs text-[#8E918F] mb-1 block">Note (optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a message..."
              className="w-full px-4 py-3 rounded-2xl bg-transparent border border-[#444746] focus:border-[#A8C7FA] text-sm text-white placeholder-[#8E918F] focus:outline-none transition-colors"
            />
          </div>

          {/* From Account */}
          {primaryAccount && (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1E1F24] border border-[#35383F] text-xs text-[#8E918F]">
              <span>Paying from</span>
              <span className="text-white font-medium">{primaryAccount.bankName} {primaryAccount.accountNumberMasked}</span>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing || Number(amount) <= 0}
            className="w-full py-4 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            {isProcessing ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </div>
      )}

      <OTPModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSubmit={handleConfirmOtp}
        demoCode="123456"
        phone={user.phone}
      />
    </div>
  );
}

export default function NewPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E0F12]" />}>
      <NewPaymentContent />
    </Suspense>
  );
}
