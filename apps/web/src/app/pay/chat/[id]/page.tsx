'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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

    const CONTACT_MAP: Record<string, Beneficiary> = {
      'ben_rahul': {
        id: 'ben_rahul', userId: 'usr_demo_02',
        name: 'Mr RAHUL SATYENDRA KUMAR', upiIdOrHandle: '9582320234@slc',
        bankName: 'State Bank of India', accountNumberMasked: '••••0234',
        routingIdentifier: 'SBIN0009582', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'M',
        phoneOrEmail: '+91 95823 20234', verificationState: 'VERIFIED', isFavorite: true
      },
      'ben_abhishek': {
        id: 'ben_abhishek', userId: 'usr_demo_03',
        name: 'ABHISHEK', upiIdOrHandle: '7678573087@axl',
        bankName: 'Axis Bank', accountNumberMasked: '••••3087',
        routingIdentifier: 'UTIB0007678', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'A',
        phoneOrEmail: '+91 76785 73087', verificationState: 'VERIFIED', isFavorite: true
      },
      'ben_kartikeyan': {
        id: 'ben_kartikeyan', userId: 'usr_demo_04',
        name: 'kartikeyan sahani', upiIdOrHandle: 'kartikeyan@oksbi',
        bankName: 'State Bank of India', accountNumberMasked: '••••6321',
        routingIdentifier: 'SBIN0006321', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'K',
        phoneOrEmail: '+91 77039 16321', verificationState: 'VERIFIED', isFavorite: true
      },
      'ben_rahulk': {
        id: 'ben_rahulk', userId: 'usr_demo_05',
        name: 'Rahul Kumar', upiIdOrHandle: 'rahulk@oksbi',
        bankName: 'State Bank of India', accountNumberMasked: '••••3456',
        routingIdentifier: 'SBIN0001234', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'R',
        phoneOrEmail: '+91 98101 23456', verificationState: 'VERIFIED', isFavorite: false
      },
      'ben_neerendra': {
        id: 'ben_neerendra', userId: 'usr_demo_06',
        name: 'Neerendra.', upiIdOrHandle: 'neerendra@okaxis',
        bankName: 'Axis Bank', accountNumberMasked: '••••8234',
        routingIdentifier: 'UTIB0008234', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'N',
        phoneOrEmail: '+91 88001 98234', verificationState: 'VERIFIED', isFavorite: false
      },
      'ben_nitin': {
        id: 'ben_nitin', userId: 'usr_demo_07',
        name: 'Mr NITIN', upiIdOrHandle: 'nitin@okicici',
        bankName: 'ICICI Bank', accountNumberMasked: '••••4567',
        routingIdentifier: 'ICIC0004567', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'M',
        phoneOrEmail: '+91 99112 34567', verificationState: 'VERIFIED', isFavorite: false
      },
      'ben_praveen': {
        id: 'ben_praveen', userId: 'usr_demo_01',
        name: 'Praveen Kumar', upiIdOrHandle: '9315896154@ptaxis',
        bankName: 'Paytm Payments Bank', accountNumberMasked: '••••9154',
        routingIdentifier: 'PYTM0123456', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'PK',
        phoneOrEmail: '+91 93158 96154', verificationState: 'VERIFIED', isFavorite: true
      },
      'ben_priya_in': {
        id: 'ben_priya_in', userId: 'usr_demo_08',
        name: 'Priya Sharma', upiIdOrHandle: 'priya.sharma@okaxis',
        bankName: 'Axis Bank', accountNumberMasked: '••••2211',
        routingIdentifier: 'UTIB0002211', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'PS',
        phoneOrEmail: '+91 91234 56789', verificationState: 'VERIFIED', isFavorite: false
      },
    };

    return CONTACT_MAP[beneficiaryId] || CONTACT_MAP['ben_praveen'];
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

  // Receipt Modal — shows last payment card from messages
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const openReceipt = () => {
    // Build a synthetic receipt from the last payment card in messages
    const lastPayMsg = [...messages].reverse().find((m) => m.type === 'PAYMENT_CARD');
    if (lastPayMsg) {
      setSelectedTx({
        id: `receipt_${Date.now()}`,
        userId: 'usr_auto_889210',
        beneficiaryId: beneficiary.id,
        beneficiaryName: beneficiary.name,
        beneficiaryUpiId: beneficiary.upiIdOrHandle,
        beneficiaryCountry: beneficiary.country || 'India',
        beneficiaryFlag: beneficiary.flagEmoji || '🇮🇳',
        senderBankAccountId: primaryAccount?.id || 'acc_sbi',
        sourceCurrency: 'INR',
        targetCurrency: 'INR',
        sourceAmount: lastPayMsg.amount,
        targetAmount: lastPayMsg.amount,
        exchangeRate: 1,
        fee: 0,
        referenceNumber: `UPI${Date.now().toString().slice(-10)}`,
        status: 'RECIPIENT_CREDITED',
        purpose: 'FAMILY_SUPPORT',
        note: 'Payment via Auto-UPI',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settlementSteps: [],
      } as any);
    }
    setIsReceiptOpen(true);
  };

  const isInitialMount = useRef(true);

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
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
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
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>

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
                      onClick={openReceipt}
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
                        onClick={() => {
                          setSelectedTx(msg as any);
                          setIsReceiptOpen(true);
                        }}
                        className="text-xs font-medium text-[#A8C7FA] hover:underline"
                      >
                        View receipt
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
      {/* GOOGLE PAY-STYLE FULL-SCREEN PAYMENT ENTRY */}
      {/* ================================================================= */}
      {isPaySheetOpen && (
        <div className="fixed inset-0 z-50 bg-[#111214] flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Top Bar: X | Info | ⋮ */}
          <div className="flex items-center justify-between px-5 pt-12 pb-4">
            <button
              onClick={() => setIsPaySheetOpen(false)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-[#C4C7C5] transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-[#C4C7C5] transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="flex flex-col items-center justify-center text-center px-6 pt-4 pb-2 space-y-2">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-[#7B1FA2] flex items-center justify-center text-white font-normal text-3xl shadow-lg mb-1">
              {beneficiary.avatarUrl ? (
                <img src={beneficiary.avatarUrl} alt={beneficiary.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                (beneficiary.initials || beneficiary.name.charAt(0))
              )}
            </div>

            {/* Paying name */}
            <p className="text-base font-normal text-white">Paying {beneficiary.name}</p>

            {/* Banking verified name */}
            <div className="flex items-center gap-1.5 text-sm text-[#C4C7C5]">
              <ShieldCheck className="w-4 h-4 text-white shrink-0" />
              <span>Banking name: {beneficiary.name}</span>
            </div>

            {/* UPI handle */}
            <p className="text-sm text-[#8E918F]">
              {beneficiary.bankName} • {beneficiary.upiIdOrHandle}
            </p>
          </div>

          {/* Amount Display */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-4xl font-light text-white">₹</span>
              <span className="text-6xl font-light text-white font-mono min-w-[120px] text-left">
                {amount === '0' || amount === '' ? (
                  <span className="opacity-40">0</span>
                ) : amount}
              </span>
            </div>

            {/* Add note pill */}
            <button
              onClick={() => {
                const note = window.prompt('Add a note for this payment:');
                if (note) showToast('Note Added', `"${note}" will be sent with payment`, 'info');
              }}
              className="px-5 py-2 rounded-full bg-[#1E1F24] border border-[#35383F] text-sm text-[#C4C7C5] hover:bg-[#282A30] transition-colors"
            >
              Add note
            </button>
          </div>

          {/* Custom Numeric Keypad + Arrow Button */}
          <div className="px-4 pb-10">
            {/* Proceed Arrow (bottom right) */}
            <div className="flex justify-end mb-4 pr-2">
              <button
                onClick={handleStartPayment}
                disabled={isProcessing || Number(amount) <= 0}
                className={`w-16 h-16 rounded-[22px] flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                  Number(amount) > 0
                    ? 'bg-[#A8C7FA] hover:bg-[#C2E7FF]'
                    : 'bg-[#1E2A3A] opacity-50'
                }`}
              >
                <ArrowRight className={`w-7 h-7 ${Number(amount) > 0 ? 'text-[#041E49]' : 'text-[#A8C7FA]'}`} />
              </button>
            </div>

            {/* Numpad Grid */}
            <div className="grid grid-cols-3 gap-3">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'DEL'].map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    if (key === 'DEL') {
                      setAmount((prev) => {
                        if (prev.length <= 1) return '0';
                        return prev.slice(0, -1);
                      });
                    } else if (key === '.') {
                      setAmount((prev) => {
                        if (prev.includes('.')) return prev;
                        return prev + '.';
                      });
                    } else {
                      setAmount((prev) => {
                        const next = prev === '0' ? key : prev + key;
                        if (Number(next) > 100000) return prev; // Max ₹1,00,000
                        return next;
                      });
                    }
                  }}
                  className="h-16 rounded-2xl bg-[#1C1C1F] hover:bg-[#282A30] active:scale-95 active:bg-[#35383F] transition-all flex flex-col items-center justify-center text-white shadow-sm"
                >
                  {key === 'DEL' ? (
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                      <line x1="18" y1="9" x2="12" y2="15" />
                      <line x1="12" y1="9" x2="18" y2="15" />
                    </svg>
                  ) : (
                    <>
                      <span className="text-2xl font-light leading-tight">{key}</span>
                      {['2','3','4','5','6','7','8','9'].includes(key) && (
                        <span className="text-[9px] text-[#8E918F] tracking-widest mt-0.5">
                          {key === '2' ? 'ABC' : key === '3' ? 'DEF' : key === '4' ? 'GHI' : key === '5' ? 'JKL' : key === '6' ? 'MNO' : key === '7' ? 'PQRS' : key === '8' ? 'TUV' : 'WXYZ'}
                        </span>
                      )}
                    </>
                  )}
                </button>
              ))}
            </div>
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
