'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePayment } from '../../../../context/PaymentContext';
import { useAuth } from '../../../../context/AuthContext';
import { useToast } from '../../../../context/ToastContext';
import { 
  ChevronLeft, 
  Phone, 
  MoreVertical, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronRight, 
  X,
  ArrowRight
} from 'lucide-react';
import { PaymentTransaction, Beneficiary, FXQuote } from '@auto-upi/shared';
import { ReceiptModal } from '../../../../components/ui/ReceiptModal';
import { OTPModal } from '../../../../components/ui/OTPModal';

export default function PaymentChatPage() {
  const params = useParams();
  const router = useRouter();
  const beneficiaryId = (params?.id as string) || 'ben_praveen';

  const { 
    beneficiaries, 
    bankAccounts, 
    transactions, 
    getFXQuote, 
    initiatePayment, 
    confirmPaymentWithOtp 
  } = usePayment();
  const { user } = useAuth();
  const { showToast } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic recipient mapping matching Screenshot 1 & 3
  const getBeneficiary = (): Beneficiary => {
    const existing = beneficiaries.find((b) => b.id === beneficiaryId);
    if (existing) return existing;

    if (beneficiaryId === 'ben_rahul') {
      return {
        id: 'ben_rahul',
        userId: 'usr_demo_02',
        name: 'Mr RAHUL SATYENDRA KUMAR',
        upiIdOrHandle: '9582320234@slc',
        bankName: 'State Bank of India',
        accountNumberMasked: '••••0234',
        routingIdentifier: 'SBIN0009582',
        country: 'India',
        countryCode: 'IN',
        currency: 'INR',
        flagEmoji: '🇮🇳',
        initials: 'M',
        phoneOrEmail: '+91 95823 20234',
        verificationState: 'VERIFIED',
        isFavorite: true
      };
    }

    if (beneficiaryId === 'ben_abhishek') {
      return {
        id: 'ben_abhishek',
        userId: 'usr_demo_03',
        name: 'ABHISHEK',
        upiIdOrHandle: '7678573087@axl',
        bankName: 'Axis Bank',
        accountNumberMasked: '••••3087',
        routingIdentifier: 'UTIB0007678',
        country: 'India',
        countryCode: 'IN',
        currency: 'INR',
        flagEmoji: '🇮🇳',
        initials: 'A',
        phoneOrEmail: '+91 76785 73087',
        verificationState: 'VERIFIED',
        isFavorite: true
      };
    }

    // Default Praveen Kumar (Screenshot 1)
    return {
      id: 'ben_praveen',
      userId: 'usr_demo_01',
      name: 'Praveen Kumar',
      upiIdOrHandle: '9315896154@ptaxis',
      bankName: 'Paytm Payments Bank',
      accountNumberMasked: '••••9154',
      routingIdentifier: 'PYTM0123456',
      country: 'India',
      countryCode: 'IN',
      currency: 'INR',
      flagEmoji: '🇮🇳',
      initials: 'PK',
      phoneOrEmail: '+91 93158 96154',
      verificationState: 'VERIFIED',
      isFavorite: true
    };
  };

  const beneficiary = getBeneficiary();

  const primaryAccount = bankAccounts[0];

  // Conversation state
  const [messages, setMessages] = useState<any[]>([]);
  const [messageInput, setMessageInput] = useState('');

  // Payment flow modal inside chat
  const [isPaySheetOpen, setIsPaySheetOpen] = useState(false);
  const [amount, setAmount] = useState('100');
  const [quote, setQuote] = useState<FXQuote | null>(null);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingTxId, setPendingTxId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Receipt Modal
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Initialize messages
  useEffect(() => {
    setMessages([
      {
        id: 'msg_text_100',
        type: 'TEXT_BUBBLE',
        sender: 'ME',
        text: '100',
        timestamp: '14 Aug, 4:13pm'
      },
      {
        id: 'msg_tx_100',
        type: 'PAYMENT_CARD',
        sender: 'ME',
        amount: 100,
        currency: 'INR',
        date: '14 Aug',
        recipientBank: 'Paytm',
        recipientUpi: beneficiary.upiIdOrHandle || '9315896154@ptaxis',
        status: 'COMPLETED'
      }
    ]);
  }, [beneficiary]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        type: 'TEXT_BUBBLE',
        sender: 'ME',
        text: messageInput.trim(),
        timestamp: 'Just now'
      }
    ]);
    setMessageInput('');
  };

  const handleStartPayment = async () => {
    if (Number(amount) <= 0) return;

    try {
      setIsProcessing(true);
      const res = await initiatePayment({
        beneficiaryId: beneficiary.id,
        senderBankAccountId: primaryAccount?.id || bankAccounts[0]?.id || 'acc_hdfc_inr_02',
        sourceCurrency: 'INR',
        sourceAmount: Number(amount),
        targetCurrency: beneficiary.currency || 'INR',
        purpose: 'FAMILY_SUPPORT',
        note: 'Payment via GPay Chat',
      });

      setPendingTxId(res.transaction.id);
      setIsPaySheetOpen(false);
      setIsOtpOpen(true);
    } catch (err: any) {
      showToast('Error', err.message || 'Unable to initiate', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmOtp = async (otpCode: string) => {
    if (!pendingTxId) return;

    try {
      const settledTx = await confirmPaymentWithOtp(pendingTxId, otpCode);
      setIsOtpOpen(false);

      setMessages((prev) => [
        ...prev,
        {
          id: `msg_text_${Date.now()}`,
          type: 'TEXT_BUBBLE',
          sender: 'ME',
          text: amount,
          timestamp: 'Just now'
        },
        {
          id: `msg_${settledTx.id}`,
          type: 'PAYMENT_CARD',
          sender: 'ME',
          amount: Number(amount),
          currency: beneficiary.currency,
          date: 'Today',
          recipientBank: beneficiary.bankName,
          recipientUpi: beneficiary.upiIdOrHandle,
          status: 'COMPLETED'
        }
      ]);
      showToast('Payment Successful', `Paid ₹${amount} to ${beneficiary.name}`, 'success');
    } catch (err: any) {
      showToast('PIN Failed', 'Invalid 2FA code', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] flex flex-col justify-between max-w-lg mx-auto select-none">
      {/* 1. TOP APP BAR (Matching Screenshot 1) */}
      <header className="px-4 py-3 bg-[#0E0F12] border-b border-[#23252B] flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div className="w-10 h-10 rounded-full bg-[#1E1F24] border border-[#35383F] overflow-hidden flex items-center justify-center text-white font-bold text-sm shrink-0">
            {beneficiary.avatarUrl ? (
              <img src={beneficiary.avatarUrl} alt={beneficiary.name} className="w-full h-full object-cover" />
            ) : (
              beneficiary.initials
            )}
          </div>

          <div>
            <h2 className="text-base font-normal text-white leading-tight">{beneficiary.name}</h2>
            <p className="text-xs text-[#8E918F]">{beneficiary.phoneOrEmail || '+91 93158 96154'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[#C4C7C5]">
          <button
            onClick={() => showToast('Calling', `Dialing ${beneficiary.phoneOrEmail || '+91 93158 96154'}...`, 'info')}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* 2. CHAT BODY WITH PROFILE HEADER (Matching Screenshot 1) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Profile Card Summary Header in Center */}
        <div className="flex flex-col items-center justify-center text-center space-y-1.5 pt-4">
          <div className="w-20 h-20 rounded-full bg-[#1E1F24] border-2 border-[#35383F] overflow-hidden flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-md">
            {beneficiary.avatarUrl ? (
              <img src={beneficiary.avatarUrl} alt={beneficiary.name} className="w-full h-full object-cover" />
            ) : (
              beneficiary.initials
            )}
          </div>

          <h2 className="text-xl font-normal text-white">{beneficiary.name}</h2>

          <div className="flex items-center gap-1 text-xs text-[#C4C7C5]">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            <span>Banking name: {beneficiary.name}</span>
          </div>

          <p className="text-xs text-[#8E918F] font-mono">{beneficiary.phoneOrEmail || '+91 93158 96154'}</p>
          <p className="text-xs text-[#8E918F]">Joined March 2025</p>
        </div>

        {/* Date Divider Line */}
        <div className="flex items-center justify-center gap-3 my-4">
          <div className="h-[1px] bg-[#23252B] flex-1" />
          <span className="text-xs text-[#8E918F] font-medium">14 Aug, 4:13 pm</span>
          <div className="h-[1px] bg-[#23252B] flex-1" />
        </div>

        {/* Messages Feed */}
        <div className="space-y-4">
          {messages.map((msg) => {
            if (msg.type === 'TEXT_BUBBLE') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="px-5 py-2.5 rounded-full bg-[#0B57D0] text-white font-medium text-base shadow-sm">
                    {msg.text}
                  </div>
                </div>
              );
            }

            if (msg.type === 'PAYMENT_CARD') {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="w-full max-w-xs rounded-[28px] p-5 bg-[#1E1F24] text-white space-y-3 shadow-lg">
                    <div>
                      <p className="text-sm text-[#C4C7C5] font-normal">Payment to {beneficiary.name}</p>
                      <h3 className="text-4xl font-normal text-white mt-1 font-mono tracking-tight">
                        ₹{msg.amount}
                      </h3>
                    </div>

                    <div
                      onClick={() => setIsReceiptOpen(true)}
                      className="flex items-center justify-between text-xs text-[#C4C7C5] pt-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 text-[#34D399]">
                        <div className="w-3.5 h-3.5 rounded-full bg-[#34D399] flex items-center justify-center text-black font-bold text-[9px]">✓</div>
                        <span className="font-medium">Paid • {msg.date}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#8E918F]" />
                    </div>

                    {/* Dotted separator line */}
                    <div className="border-t border-dashed border-[#444746] pt-3 text-xs space-y-1">
                      <p className="text-[#C4C7C5]">Sent to {msg.recipientBank}</p>
                      <p className="text-[#8E918F] font-mono text-[11px] truncate">{msg.recipientUpi}</p>
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => setIsReceiptOpen(true)}
                        className="text-xs font-medium text-[#A8C7FA] hover:underline"
                      >
                        Learn more
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 3. BOTTOM STICKY ACTION BAR (Matching Screenshot 1) */}
      <footer className="p-3 bg-[#0E0F12] border-t border-[#23252B] sticky bottom-0 z-10 flex items-center gap-2">
        {/* Soft Blue Pill Pay Button */}
        <button
          onClick={() => setIsPaySheetOpen(true)}
          className="py-3 px-6 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-medium text-sm transition-all active:scale-95 shrink-0"
        >
          Pay
        </button>

        {/* Message Input Pill with Send Arrow */}
        <form onSubmit={handleSendText} className="flex-1 flex items-center bg-[#1E1F24] rounded-full px-4 py-1 border border-[#35383F]">
          <input
            type="text"
            placeholder="Message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#8E918F] py-2 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!messageInput.trim()}
            className="p-1 text-[#C4C7C5] hover:text-white disabled:opacity-30 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </footer>

      {/* ================================================================= */}
      {/* PAYMENT MODAL SHEET */}
      {/* ================================================================= */}
      {isPaySheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white text-center">
            <div className="w-12 h-1 bg-[#35383F] rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-normal">Paying {beneficiary.name}</span>
              <button onClick={() => setIsPaySheetOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6">
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-light text-[#8E918F]">₹</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  autoFocus
                  className="bg-transparent text-5xl font-normal text-white text-center w-48 focus:outline-none font-mono"
                  placeholder="0"
                />
              </div>
            </div>

            <button
              onClick={handleStartPayment}
              disabled={isProcessing || Number(amount) <= 0}
              className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all"
            >
              Pay ₹{amount}
            </button>
          </div>
        </div>
      )}

      {/* 2FA PIN Modal */}
      <OTPModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onSubmit={handleConfirmOtp}
        demoCode="123456"
        phone={user.phone}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={selectedTx}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
