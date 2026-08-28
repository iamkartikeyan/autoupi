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
  ChevronDown,
  X, 
  ArrowRight,
  Info,
  Check,
  Building2,
  Sparkles,
  User,
  ShieldAlert
} from 'lucide-react';
import { PaymentTransaction, Beneficiary, BankAccount } from '@auto-upi/shared';
import { ReceiptModal } from '../../../../components/ui/ReceiptModal';
import { BankLogo } from '../../../../components/ui/BankLogo';

export default function PaymentChatPage() {
  const params = useParams();
  const router = useRouter();
  const beneficiaryId = (params?.id as string) || 'ben_praveen';

  const { 
    beneficiaries, 
    bankAccounts, 
    transactions, 
    initiatePayment, 
    confirmPaymentWithOtp 
  } = usePayment();
  const { user } = useAuth();
  const { showToast } = useToast();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Dynamic recipient mapping matching Google Pay Screenshot
  const getBeneficiary = (): Beneficiary => {
    const existing = beneficiaries.find((b) => b.id === beneficiaryId);
    if (existing) return existing;

    const CONTACT_MAP: Record<string, Beneficiary> = {
      'ben_rahul': {
        id: 'ben_rahul', userId: 'usr_demo_02',
        name: 'Mr RAHUL SATYENDRA KUMAR', upiIdOrHandle: '9582320234@slc',
        bankName: 'Union Bank of India', accountNumberMasked: '••••0234',
        routingIdentifier: 'UBIN0533891', country: 'India', countryCode: 'IN',
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
        name: 'Mr SUSHIL SAHANI', upiIdOrHandle: 'sahanisushil9@axl',
        bankName: 'Union Bank of India', accountNumberMasked: '••••6120',
        routingIdentifier: 'UBIN0536120', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'M',
        phoneOrEmail: '+91 93158 96154', verificationState: 'VERIFIED', isFavorite: true
      },
      'ben_priya_in': {
        id: 'ben_priya_in', userId: 'usr_demo_08',
        name: 'Kamini Sharma', upiIdOrHandle: 'kamini@okaxis',
        bankName: 'State Bank of India', accountNumberMasked: '••••2211',
        routingIdentifier: 'SBIN0002211', country: 'India', countryCode: 'IN',
        currency: 'INR', flagEmoji: '🇮🇳', initials: 'K',
        phoneOrEmail: '+91 95364 53204', verificationState: 'VERIFIED', isFavorite: false
      },
    };

    return CONTACT_MAP[beneficiaryId] || CONTACT_MAP['ben_praveen'];
  };

  const beneficiary = getBeneficiary();

  // Selected Bank for Payment (Default: Union Bank or SBI from the 4 banks)
  const defaultBank = bankAccounts.find(b => b.bankName.includes('Union')) || bankAccounts[0];
  const [selectedBank, setSelectedBank] = useState<BankAccount>(defaultBank || bankAccounts[0]);
  const [isBankPickerOpen, setIsBankPickerOpen] = useState(false);

  // Conversation state initialized synchronously
  const [messages, setMessages] = useState<any[]>(() => [
    {
      id: 'msg_text_100',
      type: 'TEXT_BUBBLE',
      sender: 'ME',
      text: '5',
      timestamp: '14 Aug, 4:13pm'
    },
    {
      id: 'msg_tx_100',
      type: 'PAYMENT_CARD',
      sender: 'ME',
      amount: 5,
      currency: 'INR',
      date: '14 Aug',
      recipientBank: beneficiary.bankName || 'Union Bank of India',
      recipientUpi: beneficiary.upiIdOrHandle || 'sahanisushil9@axl',
      status: 'COMPLETED'
    }
  ]);
  const [messageInput, setMessageInput] = useState('');

  // Payment Screens Flow State: 'NONE' | 'AMOUNT_ENTRY' | 'PIN_SCREEN' | 'SUCCESS_SCREEN'
  const [payFlowStep, setPayFlowStep] = useState<'NONE' | 'AMOUNT_ENTRY' | 'PIN_SCREEN' | 'SUCCESS_SCREEN'>('NONE');
  const [amount, setAmount] = useState('5');
  const [paymentNote, setPaymentNote] = useState('');
  const [pinDigits, setPinDigits] = useState<string[]>([]);
  const [isProcessingPin, setIsProcessingPin] = useState(false);
  const [lastCompletedTx, setLastCompletedTx] = useState<PaymentTransaction | null>(null);

  // Receipt Modal
  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

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
    scrollToBottom();
  };

  const openReceipt = () => {
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
        senderBankAccountId: selectedBank?.id || 'acc_union',
        sourceCurrency: 'INR',
        targetCurrency: 'INR',
        sourceAmount: lastPayMsg.amount,
        targetAmount: lastPayMsg.amount,
        exchangeRate: 1,
        fee: 0,
        referenceNumber: `UPI${Date.now().toString().slice(-10)}`,
        status: 'RECIPIENT_CREDITED',
        purpose: 'FAMILY_SUPPORT',
        note: paymentNote || 'Payment via Auto-UPI',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settlementSteps: [],
      } as any);
      setIsReceiptOpen(true);
    }
  };

  // -------------------------------------------------------------
  // PIN PAD LOGIC (Image 1)
  // -------------------------------------------------------------
  const handleNumpadPress = (digit: string) => {
    if (pinDigits.length < 4) {
      setPinDigits((prev) => [...prev, digit]);
    }
  };

  const handleNumpadDelete = () => {
    setPinDigits((prev) => prev.slice(0, -1));
  };

  const handlePinSubmit = async () => {
    if (pinDigits.length < 4) {
      showToast('Enter PIN', 'Please enter your 4-digit UPI PIN', 'error');
      return;
    }

    setIsProcessingPin(true);

    // Simulate real UPI bank clearing
    setTimeout(() => {
      setIsProcessingPin(false);
      const paidAmount = Number(amount) || 5;

      const newTx: any = {
        id: `tx_${Date.now()}`,
        type: 'PAYMENT_CARD',
        sender: 'ME',
        amount: paidAmount,
        currency: 'INR',
        date: 'Today',
        recipientBank: beneficiary.bankName || 'Union Bank of India',
        recipientUpi: beneficiary.upiIdOrHandle || 'sahanisushil9@axl',
        status: 'COMPLETED',
        note: paymentNote
      };

      setLastCompletedTx(newTx);
      setMessages((prev) => [...prev, newTx]);
      setPayFlowStep('SUCCESS_SCREEN');
      scrollToBottom();
      showToast('Payment Successful', `₹${paidAmount}.00 paid to ${beneficiary.name}`, 'success');
    }, 1200);
  };

  return (
    <div className="w-full max-w-lg mx-auto min-h-[100dvh] bg-[#0E0F12] text-[#E3E3E3] flex flex-col justify-between select-none relative overflow-x-hidden">
      {/* ================================================================= */}
      {/* 1. CHAT SCREEN (Matching Image 3) */}
      {/* ================================================================= */}
      <header className="px-4 py-3 bg-[#0E0F12] border-b border-[#23252B] flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>

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

      {/* CHAT BODY WITH PROFILE HEADER (Matching Image 3) */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Profile Card Summary Header in Center */}
        <div className="flex flex-col items-center justify-center text-center space-y-1.5 pt-4">
          <div className="w-20 h-20 rounded-full bg-[#9333EA] flex items-center justify-center text-white font-bold text-3xl mb-2 shadow-lg">
            {beneficiary.avatarUrl ? (
              <img src={beneficiary.avatarUrl} alt={beneficiary.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              beneficiary.initials || beneficiary.name.charAt(0)
            )}
          </div>

          <h2 className="text-xl font-normal text-white">{beneficiary.name}</h2>

          <div className="flex items-center gap-1 text-xs text-[#C4C7C5]">
            <ShieldCheck className="w-4 h-4 text-[#34D399]" />
            <span>Banking name: {beneficiary.name}</span>
          </div>

          <p className="text-xs text-[#8E918F] font-mono">{beneficiary.phoneOrEmail || '+91 95364 53204'}</p>
          <p className="text-xs text-[#8E918F]">Joined November 2019</p>

          <p className="text-xs text-[#8E918F] pt-2">Say &quot;Hello! 👋&quot;</p>
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
                  <div className="w-full max-w-xs rounded-[28px] p-5 bg-[#1E1F24] text-white space-y-3 shadow-lg border border-[#35383F]">
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

      {/* BOTTOM STICKY ACTION BAR (Matching Image 3) */}
      <footer className="p-3 bg-[#0E0F12] border-t border-[#23252B] sticky bottom-0 z-10 space-y-2">
        <div className="flex items-center gap-2">
          {/* Pay Button Pill */}
          <button
            onClick={() => {
              setAmount('5');
              setPinDigits([]);
              setPayFlowStep('AMOUNT_ENTRY');
            }}
            className="py-3 px-6 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-medium text-sm transition-all active:scale-95 shrink-0 shadow-md"
          >
            Pay
          </button>

          {/* Request Button Pill */}
          <button
            onClick={() => showToast('Request Sent', `Payment request for ₹${amount} sent to ${beneficiary.name}`, 'info')}
            className="py-3 px-5 rounded-full bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] text-white font-medium text-sm transition-all active:scale-95 shrink-0"
          >
            Request
          </button>

          {/* Message Input Pill with Send Arrow */}
          <form onSubmit={handleSendText} className="flex-1 flex items-center bg-[#1E1F24] rounded-full px-4 py-1 border border-[#35383F]">
            <input
              type="text"
              placeholder="Send a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder-[#8E918F] py-2 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-1 text-[#C4C7C5] hover:text-white disabled:opacity-30 transition-colors"
            >
              <Send className="w-5 h-5 text-[#A8C7FA]" />
            </button>
          </form>
        </div>
      </footer>

      {/* ================================================================= */}
      {/* 2. PAYMENT AMOUNT & METHOD SELECTION SCREEN (Exact Image 2) */}
      {/* ================================================================= */}
      {payFlowStep === 'AMOUNT_ENTRY' && (
        <div className="fixed inset-0 z-50 bg-[#0E0F12] flex flex-col justify-between animate-in fade-in duration-200">
          {/* Top Bar: X | Info | ⋮ */}
          <div className="flex items-center justify-between px-5 pt-12 pb-2">
            <button
              onClick={() => setPayFlowStep('NONE')}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-1 text-[#C4C7C5]">
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                <Info className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Recipient Details in Center (Image 2) */}
          <div className="flex flex-col items-center justify-center text-center px-6 pt-2 pb-1 space-y-1.5">
            {/* Green Initial Avatar (Image 2) */}
            <div className="w-16 h-16 rounded-full bg-[#1B5E50] flex items-center justify-center text-white font-normal text-2xl shadow-lg mb-1">
              {beneficiary.avatarUrl ? (
                <img src={beneficiary.avatarUrl} alt={beneficiary.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                beneficiary.initials || 'M'
              )}
            </div>

            <p className="text-base font-normal text-white">Paying {beneficiary.name}</p>

            <div className="flex items-center gap-1.5 text-xs text-[#C4C7C5]">
              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[9px] font-bold">✓</div>
              <span>Banking name: {beneficiary.name}</span>
            </div>

            <p className="text-xs text-[#8E918F]">
              PhonePe • {beneficiary.upiIdOrHandle || 'sahanisushil9@axl'}
            </p>
          </div>

          {/* Huge Amount Input (Image 2) */}
          <div className="flex flex-col items-center justify-center px-8 my-auto space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="text-5xl font-light text-white">₹</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="text-6xl font-light text-white bg-transparent text-center focus:outline-none w-48 font-mono"
              />
            </div>

            {/* Add note Pill Button */}
            <button
              onClick={() => {
                const note = window.prompt('Add a note:', paymentNote);
                if (note !== null) setPaymentNote(note);
              }}
              className="px-5 py-2 rounded-full bg-[#1E1F24] border border-[#35383F] text-xs text-[#C4C7C5] hover:bg-[#282A30] transition-colors"
            >
              {paymentNote ? `Note: ${paymentNote}` : 'Add note'}
            </button>
          </div>

          {/* Bottom Sheet Card: Select Payment Method & Pay CTA (Image 2) */}
          <div className="bg-[#1E1F24] rounded-t-[32px] border-t border-[#35383F] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#C4C7C5] font-normal">Select payment method</span>
            </div>

            {/* Bank Selection Row with Logo, Masked Acc, Balance, and Chevron */}
            <div
              onClick={() => setIsBankPickerOpen(true)}
              className="flex items-center justify-between p-3 rounded-2xl bg-[#16171B] border border-[#35383F] hover:border-[#A8C7FA] cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <BankLogo bankName={selectedBank?.bankName || 'Union Bank of India'} size="md" />
                <div className="min-w-0">
                  <h4 className="text-sm font-normal text-white truncate">
                    {selectedBank?.bankName || 'Union Bank of India'} {selectedBank?.accountNumberMasked?.slice(-4) || '6120'}
                  </h4>
                  <p className="text-xs text-[#8E918F]">
                    Balance: <span className="text-[#A8C7FA] font-medium">Check now</span>
                  </p>
                </div>
              </div>

              <ChevronDown className="w-5 h-5 text-[#8E918F]" />
            </div>

            {/* Big Blue Pay Button */}
            <button
              onClick={() => {
                if (Number(amount) <= 0) return;
                setPinDigits([]);
                setPayFlowStep('PIN_SCREEN');
              }}
              disabled={Number(amount) <= 0}
              className="w-full py-4 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-base transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
            >
              Pay ₹{amount || '5'}
            </button>

            {/* NPCI UPI Branding Footer */}
            <div className="text-center pt-1">
              <p className="text-[10px] text-[#8E918F] uppercase tracking-widest font-bold">
                POWERED BY <span className="text-white">UPI</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 3. OFFICIAL UPI PIN PAD SCREEN (Exact Image 1) */}
      {/* ================================================================= */}
      {payFlowStep === 'PIN_SCREEN' && (
        <div className="fixed inset-0 z-50 bg-[#F4F5F7] text-[#1F2937] flex flex-col justify-between animate-in fade-in duration-150">
          {/* Top Bar: UPI Logo | Bank Name | X */}
          <div className="flex items-center justify-between px-5 pt-12 pb-3 bg-white border-b border-gray-200 shadow-sm">
            <div>
              <div className="flex items-center gap-1 font-black text-base italic text-[#004A77] tracking-tighter">
                <span>UPI</span>
                <span className="text-[#00C853]">▶▶</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">{selectedBank?.bankName || 'Union Bank of India'}</p>
            </div>

            <button
              onClick={() => setPayFlowStep('AMOUNT_ENTRY')}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Light Gold / Yellow Summary Card (Image 1) */}
          <div className="px-4 pt-3">
            <div className="bg-[#FFF8E1] border border-[#FFE082] rounded-2xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Pay ₹{Number(amount).toFixed(2)}
                </h3>
                <p className="text-xs text-gray-700 mt-0.5">
                  To {beneficiary.name}
                </p>
              </div>

              <div className="w-10 h-10 rounded-2xl bg-[#0052CC] text-white flex items-center justify-center shadow-md">
                <span className="font-bold text-xs">₹➔👤</span>
              </div>
            </div>
          </div>

          {/* PIN Dots Area (Image 1) */}
          <div className="flex flex-col items-center justify-center my-auto px-6 space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Enter your PIN</h2>

            {/* 4 Circular PIN Rings */}
            <div className="flex items-center gap-4 py-2">
              {[0, 1, 2, 3].map((index) => {
                const isFilled = pinDigits.length > index;
                return (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 transition-all ${
                      isFilled
                        ? 'bg-gray-900 border-gray-900 scale-110'
                        : 'border-gray-400 bg-transparent'
                    }`}
                  />
                );
              })}
            </div>

            {/* Security Notice with Info Icon */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Never enter your UPI PIN to receive money</span>
            </div>
          </div>

          {/* Custom 3x4 Light Gray Keypad (Image 1) */}
          <div className="bg-[#E5E7EB] border-t border-gray-300 p-3 pb-8 shadow-inner">
            <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => handleNumpadPress(digit)}
                  className="h-14 rounded-2xl bg-white hover:bg-gray-50 active:bg-gray-200 text-2xl font-normal text-gray-900 flex items-center justify-center shadow-sm transition-colors active:scale-95"
                >
                  {digit}
                </button>
              ))}

              {/* Backspace Key */}
              <button
                type="button"
                onClick={handleNumpadDelete}
                className="h-14 rounded-2xl bg-[#D1D5DB] hover:bg-gray-300 active:bg-gray-400 flex items-center justify-center text-gray-700 shadow-sm transition-colors active:scale-95"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                  <line x1="18" y1="9" x2="12" y2="15" />
                  <line x1="12" y1="9" x2="18" y2="15" />
                </svg>
              </button>

              {/* 0 Key */}
              <button
                type="button"
                onClick={() => handleNumpadPress('0')}
                className="h-14 rounded-2xl bg-white hover:bg-gray-50 active:bg-gray-200 text-2xl font-normal text-gray-900 flex items-center justify-center shadow-sm transition-colors active:scale-95"
              >
                0
              </button>

              {/* Royal Blue Pay Button */}
              <button
                type="button"
                onClick={handlePinSubmit}
                disabled={isProcessingPin}
                className="h-14 rounded-2xl bg-[#002868] hover:bg-[#003888] active:bg-[#001848] text-white font-bold text-base flex items-center justify-center shadow-md transition-all active:scale-95"
              >
                {isProcessingPin ? '...' : 'Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 4. SUCCESS PAYMENT SCREEN */}
      {/* ================================================================= */}
      {payFlowStep === 'SUCCESS_SCREEN' && (
        <div className="fixed inset-0 z-50 bg-[#0E0F12] text-white flex flex-col items-center justify-between p-6 pt-16 animate-in zoom-in-95 duration-200">
          <div className="flex flex-col items-center text-center space-y-4 my-auto">
            <div className="w-24 h-24 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-2xl animate-bounce">
              <Check className="w-14 h-14 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-light text-white font-mono">₹{amount}.00</h2>
              <p className="text-base text-emerald-400 font-medium">Paid to {beneficiary.name}</p>
              <p className="text-xs text-[#8E918F] font-mono">
                Ref: UPI{Date.now().toString().slice(-10)} • {new Date().toLocaleTimeString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1E1F24] border border-[#35383F] text-xs text-[#C4C7C5] max-w-xs w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-[#8E918F]">Debited from</span>
                <span className="text-white font-medium">{selectedBank?.bankName} ({selectedBank?.accountNumberMasked})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E918F]">UPI ID</span>
                <span className="text-white font-mono">{beneficiary.upiIdOrHandle}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setPayFlowStep('NONE')}
            className="w-full py-4 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-bold text-sm transition-all"
          >
            Done
          </button>
        </div>
      )}

      {/* Bank Account Selector Modal */}
      {isBankPickerOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t border-[#35383F] rounded-t-[32px] p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-2" />
            <div className="flex items-center justify-between pb-2 border-b border-[#2D3039]">
              <h3 className="text-base font-normal text-white">Choose account to pay with</h3>
              <button onClick={() => setIsBankPickerOpen(false)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {bankAccounts.map((bank) => (
                <div
                  key={bank.id}
                  onClick={() => {
                    setSelectedBank(bank);
                    setIsBankPickerOpen(false);
                    showToast('Bank Selected', `${bank.bankName} (${bank.accountNumberMasked}) selected`, 'info');
                  }}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-colors ${
                    selectedBank.id === bank.id
                      ? 'bg-[#004A77]/30 border-[#A8C7FA]'
                      : 'bg-[#16171B] border-[#35383F] hover:bg-[#282A30]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <BankLogo bankName={bank.bankName} size="md" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-medium text-white truncate">{bank.bankName}</h4>
                      <p className="text-xs text-[#8E918F] font-mono">{bank.accountNumberMasked} • ₹{bank.balance.toLocaleString('en-IN')}.00</p>
                    </div>
                  </div>

                  {selectedBank.id === bank.id && (
                    <CheckCircle2 className="w-5 h-5 text-[#A8C7FA] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        transaction={selectedTx}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
