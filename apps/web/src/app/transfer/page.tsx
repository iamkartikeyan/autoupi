'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { BankLogo } from '../../components/ui/BankLogo';
import { 
  ChevronLeft, 
  MoreVertical, 
  Building2, 
  Check, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';

function TransferPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'self' ? 'self' : 'others';

  const { bankAccounts, receivePaymentToQr } = usePayment();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'others' | 'self'>(initialTab);

  // 'To others' form state
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  // 'To self' form state
  const [selectedSelfAccount, setSelectedSelfAccount] = useState(bankAccounts[0]?.id || '');
  const [isSelfTransferModalOpen, setIsSelfTransferModalOpen] = useState(false);
  const [selfAmount, setSelfAmount] = useState('1000');

  const primaryBank = bankAccounts[0] || {
    id: 'acc_sbi_6492',
    bankName: 'State Bank of India',
    accountNumberMasked: '••••6492',
    accountType: 'SAVINGS',
    balance: 48250.00
  };

  const handleContinueToOthers = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountNumber) {
      showToast('Required', 'Please enter recipient bank account number', 'error');
      return;
    }
    // Route to chat payment with this recipient bank account
    router.push(`/pay/chat/new?bankAccount=${encodeURIComponent(accountNumber)}&ifsc=${encodeURIComponent(ifscCode || 'SBIN0001234')}`);
  };

  const handleExecuteSelfTransfer = async () => {
    const num = parseFloat(selfAmount);
    if (isNaN(num) || num <= 0) return;

    setIsTransferring(true);
    try {
      await receivePaymentToQr(num, 'Self Account Transfer', 'self@upi');
      setIsSelfTransferModalOpen(false);
      showToast('Transfer Complete', `₹${num.toFixed(2)} transferred between your bank accounts`, 'success');
    } catch (err) {
      showToast('Error', 'Unable to complete self transfer', 'error');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] px-4 pt-3 pb-24 max-w-lg mx-auto flex flex-col justify-between select-none">
      <div>
        {/* 1. TOP BAR (Matching Screenshots 1 & 2) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl font-normal text-white">Bank transfer</h1>
          </div>

          <button className="p-1 rounded-full hover:bg-white/10 text-white transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* 2. DUAL TOP TAB BAR (To others | To self) */}
        <div className="flex border-b border-[#23252B] mt-4 mb-6">
          <button
            onClick={() => setActiveTab('others')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'others'
                ? 'text-white'
                : 'text-[#8E918F] hover:text-[#C4C7C5]'
            }`}
          >
            <span>To others</span>
            {activeTab === 'others' && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('self')}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
              activeTab === 'self'
                ? 'text-white'
                : 'text-[#8E918F] hover:text-[#C4C7C5]'
            }`}
          >
            <span>To self</span>
            {activeTab === 'self' && (
              <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />
            )}
          </button>
        </div>

        {/* ============================================================= */}
        {/* TAB 1: TO OTHERS (Matching Screenshot 2) */}
        {/* ============================================================= */}
        {activeTab === 'others' && (
          <div className="space-y-6">
            <h2 className="text-base font-normal text-[#E3E3E3]">Receiver's bank details</h2>

            <form onSubmit={handleContinueToOthers} className="space-y-4">
              {/* Account Number */}
              <div className="border border-[#444746] focus-within:border-[#A8C7FA] rounded-2xl px-4 py-3 bg-transparent transition-colors">
                <input
                  type="text"
                  required
                  placeholder="Bank account number"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-[#8E918F] focus:outline-none"
                />
              </div>

              {/* IFSC Code with Search */}
              <div className="flex items-center justify-between border border-[#444746] focus-within:border-[#A8C7FA] rounded-2xl px-4 py-3 bg-transparent transition-colors">
                <input
                  type="text"
                  placeholder="IFSC code"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-transparent text-sm text-white placeholder-[#8E918F] focus:outline-none uppercase"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIfscCode('SBIN0001234');
                    showToast('IFSC Found', 'SBI Main Branch (SBIN0001234)', 'info');
                  }}
                  className="text-xs font-medium text-[#A8C7FA] hover:text-[#C2E7FF] shrink-0"
                >
                  Search for IFSC
                </button>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all active:scale-[0.98] mt-2"
              >
                Continue
              </button>

              <p className="text-[11px] text-[#8E918F] text-center px-4 leading-relaxed">
                This information will be securely saved as per Google Pay Terms of Service and Privacy Policy
              </p>
            </form>

            {/* Recent Transfers Section (Matching Screenshot 2) */}
            <div className="space-y-3 pt-4">
              <h3 className="text-base font-normal text-[#E3E3E3]">Recent transfers</h3>
              <p className="text-xs text-[#8E918F]">
                Recent bank transfers will show up here for you to easily repeat them
              </p>

              <div className="flex items-center gap-3 pt-2">
                <div className="w-12 h-12 rounded-full border border-dashed border-[#444746] flex items-center justify-center text-[#8E918F]">
                  <Building2 className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================= */}
        {/* TAB 2: TO SELF (Matching Screenshot 1) */}
        {/* ============================================================= */}
        {activeTab === 'self' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-normal text-white">Self transfer</h2>
              <p className="text-xs text-[#8E918F] mt-1 leading-relaxed">
                Manage your money better by adding another account to make self transfers
              </p>
            </div>

            <div className="flex items-start justify-between gap-4">
              {/* Left Accounts List */}
              <div className="space-y-3 flex-1">
                {/* 4 Linked Bank Accounts (SBI, HDFC, Union, Kotak) */}
                {bankAccounts.map((bank) => (
                  <div
                    key={bank.id}
                    onClick={() => {
                      setSelectedSelfAccount(bank.id);
                      setIsSelfTransferModalOpen(true);
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-[#1E1F24] border border-[#35383F] cursor-pointer hover:border-[#A8C7FA] transition-colors"
                  >
                    <BankLogo bankName={bank.bankName} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-normal text-white truncate">
                          {bank.bankName}
                        </h3>
                        {bank.isPrimary && (
                          <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                            Primary
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#8E918F] font-mono">{bank.accountNumberMasked} • ₹{bank.balance.toLocaleString('en-IN')}.00</p>
                    </div>
                  </div>
                ))}

                {/* Add bank account dashed box (Matching Screenshot 1) */}
                <div
                  onClick={() => showToast('Link Account', 'All 4 major banks already linked (SBI, HDFC, Union, Kotak)', 'info')}
                  className="flex items-center gap-3 p-3 rounded-2xl border-2 border-dashed border-[#444746] hover:border-[#A8C7FA] cursor-pointer transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[#A8C7FA] shrink-0 bg-[#1E1F24]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium text-white">Add another bank account</span>
                </div>
              </div>


              {/* Right Side Vector Character Illustration (Matching Screenshot 1) */}
              <div className="w-36 h-36 shrink-0 flex items-center justify-center relative hidden sm:flex">
                <svg viewBox="0 0 160 160" className="w-full h-full">
                  {/* Bank Pillars Background */}
                  <rect x="100" y="40" width="40" height="50" rx="4" fill="#1E2430" stroke="#35383F" strokeWidth="2" />
                  <rect x="105" y="48" width="6" height="34" fill="#35383F" />
                  <rect x="117" y="48" width="6" height="34" fill="#35383F" />
                  <rect x="129" y="48" width="6" height="34" fill="#35383F" />

                  {/* Character */}
                  <circle cx="80" cy="50" r="12" fill="#E0A96D" />
                  <path d="M68 64 L92 64 L86 110 L74 110 Z" fill="#FBBF24" />
                  <path d="M68 110 L76 150 M92 110 L84 150" stroke="#60A5FA" strokeWidth="6" strokeLinecap="round" />
                  
                  {/* Floating Action Icons */}
                  <circle cx="45" cy="55" r="14" fill="#1E1F24" stroke="#EF4444" strokeWidth="2" />
                  <text x="45" y="60" textAnchor="middle" fill="#EF4444" fontSize="12">🏠</text>

                  <circle cx="65" cy="115" r="14" fill="#1E1F24" stroke="#10B981" strokeWidth="2" />
                  <text x="65" y="120" textAnchor="middle" fill="#10B981" fontSize="12">💰</text>

                  <circle cx="125" cy="95" r="14" fill="#1E1F24" stroke="#3B82F6" strokeWidth="2" />
                  <text x="125" y="100" textAnchor="middle" fill="#3B82F6" fontSize="12">📄</text>
                </svg>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. FOOTER BRANDING (Matching Screenshot 2) */}
      <div className="text-right pt-6">
        <p className="text-[10px] text-[#8E918F] uppercase tracking-widest font-bold">
          POWERED BY <span className="text-[#C4C7C5]">UPI</span>
        </p>
      </div>

      {/* ============================================================= */}
      {/* SELF TRANSFER MODAL */}
      {/* ============================================================= */}
      {isSelfTransferModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium">Transfer between accounts</h3>
              <button onClick={() => setIsSelfTransferModalOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#8E918F] text-left mb-4">
              Instantly move money from your secondary bank to State Bank of India ••••6492.
            </p>

            <div className="space-y-3 text-left">
              <div>
                <label className="text-xs text-[#8E918F]">Amount to transfer</label>
                <div className="relative mt-1">
                  <span className="absolute left-4 top-3 text-sm text-[#8E918F]">₹</span>
                  <input
                    type="number"
                    value={selfAmount}
                    onChange={(e) => setSelfAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] text-base font-mono text-white focus:outline-none focus:border-[#A8C7FA]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                {['500', '1000', '5000', '10000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSelfAmount(preset)}
                    className="flex-1 py-1.5 rounded-full bg-[#282A30] hover:bg-[#35383F] text-xs font-mono text-[#C4C7C5] hover:text-white transition-colors"
                  >
                    +₹{preset}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleExecuteSelfTransfer}
              disabled={isTransferring || parseFloat(selfAmount) <= 0}
              className="w-full mt-6 py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all"
            >
              {isTransferring ? 'Transferring...' : `Transfer ₹${selfAmount} to SBI`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TransferPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E0F12]" />}>
      <TransferPageContent />
    </Suspense>
  );
}
