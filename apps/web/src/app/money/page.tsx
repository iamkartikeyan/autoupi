'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { TransactionRow } from '../../components/ui/TransactionRow';
import { ReceiptModal } from '../../components/ui/ReceiptModal';
import { 
  Building2, 
  CreditCard, 
  Gauge, 
  MoreVertical,
  CheckCircle2, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  CircleDollarSign,
  ChevronRight
} from 'lucide-react';
import { PaymentTransaction, BankAccount } from '@auto-upi/shared';

type BalanceCheckState = 'IDLE' | 'VERIFYING' | 'FETCHING' | 'SUCCESS';

export default function MoneyPage() {
  const { bankAccounts, transactions } = usePayment();
  const { showToast } = useToast();

  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Check Balance Flow State
  const [isCheckBalanceOpen, setIsCheckBalanceOpen] = useState(false);
  const [targetAccount, setTargetAccount] = useState<BankAccount | null>(null);
  const [checkState, setCheckState] = useState<BalanceCheckState>('IDLE');

  // Credit Report Modal State
  const [isCreditReportOpen, setIsCreditReportOpen] = useState(false);

  // Add Bank Modal State
  const [isAddBankOpen, setIsAddBankOpen] = useState(false);
  const [newBankName, setNewBankName] = useState('');
  const [newRouting, setNewRouting] = useState('');

  // Primary Bank Account
  const primaryAccount = bankAccounts[0] || {
    id: 'bank_sbi',
    bankName: 'State Bank of India',
    accountNumberMasked: '••••6492',
    accountType: 'Savings account',
    balance: 48250.00,
    currency: 'INR',
    routingOrIfsc: 'SBIN0006492'
  };

  const handleStartCheckBalance = (account: BankAccount) => {
    setTargetAccount(account);
    setIsCheckBalanceOpen(true);
    setCheckState('VERIFYING');

    setTimeout(() => {
      setCheckState('FETCHING');
      setTimeout(() => {
        setCheckState('SUCCESS');
      }, 1000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] pb-24 select-none">
      {/* 1. SCENIC TOP HEADER (Matching Screenshot 2) */}
      <div className="relative w-full h-44 overflow-hidden bg-gradient-to-b from-[#161D24] via-[#101419] to-[#0E0F12] px-4 pt-4 flex flex-col justify-between">
        {/* Scenic vector elements */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-2 left-10 w-24 h-12 bg-emerald-900/30 rounded-full blur-xl" />
          <div className="absolute top-6 right-8 w-32 h-16 bg-teal-800/20 rounded-full blur-2xl" />
          <svg className="absolute bottom-0 inset-x-0 w-full h-24 text-emerald-950/40" viewBox="0 0 500 150" preserveAspectRatio="none">
            <path d="M0,80 C150,140 300,30 500,90 L500,150 L0,150 Z" fill="currentColor" opacity="0.5" />
            <path d="M0,110 C180,60 320,130 500,100 L500,150 L0,150 Z" fill="currentColor" opacity="0.8" />
          </svg>
        </div>

        {/* Top bar icons */}
        <div className="relative z-10 flex items-center justify-end">
          <button className="p-2 rounded-full hover:bg-white/10 text-[#C4C7C5] transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Page Title */}
        <div className="relative z-10 pb-4">
          <h1 className="text-3xl font-medium tracking-tight text-white">Money</h1>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 space-y-6 max-w-lg mx-auto">
        {/* 2. BANK ACCOUNTS SEAMLESS LIST (NO CARD, Matching Screenshot 2) */}
        <div className="space-y-4 pt-2">
          {bankAccounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between py-2 cursor-pointer group"
              onClick={() => handleStartCheckBalance(account)}
            >
              <div className="flex items-center gap-4 min-w-0">
                {/* SBI / Bank Logo Circle */}
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#0B57D0] shrink-0 shadow-sm">
                  <div className="w-7 h-7 rounded-full bg-[#0070BA] flex items-center justify-center text-white">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-normal text-white truncate">
                    {account.bankName}
                  </h3>
                  <p className="text-sm text-[#8E918F] font-mono tracking-wider">
                    {account.accountNumberMasked || '••••6492'}
                  </p>
                  <p className="text-xs text-[#8E918F]">
                    {account.accountType ? account.accountType.replace('_', ' ') : 'Savings account'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartCheckBalance(account);
                }}
                className="text-sm font-medium text-[#A8C7FA] hover:text-[#C2E7FF] shrink-0 pl-2"
              >
                Check balance
              </button>
            </div>
          ))}
        </div>

        {/* 3. CIBIL SCORE ROW (NO CARD, Matching Screenshot 2) */}
        <div
          onClick={() => setIsCreditReportOpen(true)}
          className="flex items-center justify-between py-2 border-t border-[#23252B] cursor-pointer group"
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Speedometer gauge icon circle */}
            <div className="w-12 h-12 rounded-full bg-[#23252B] flex items-center justify-center shrink-0">
              <Gauge className="w-6 h-6 text-[#FB7185]" />
            </div>

            <div>
              <h3 className="text-base font-normal text-white">CIBIL score</h3>
              <p className="text-xs text-[#8E918F]">Tap for full report</p>
            </div>
          </div>

          <div className="text-base font-medium text-white tracking-wide">
            769
          </div>
        </div>

        {/* 4. CREDIT FOR YOU SECTION (2-Column Rounded Tiles, Matching Screenshot 2) */}
        <div className="space-y-3 pt-2">
          <h2 className="text-xl font-normal text-white">Credit for you</h2>

          <div className="grid grid-cols-2 gap-3">
            {/* Tile 1: Flex by Auto-UPI */}
            <div
              onClick={() => showToast('Flex Credit', 'Your account is eligible for zero-interest instant credit', 'info')}
              className="p-4 rounded-[28px] bg-[#1E1F24] hover:bg-[#282A30] transition-colors flex flex-col justify-between h-48 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#282A30] flex items-center justify-center text-amber-300">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#004A77] text-[#C2E7FF] text-[11px] font-medium">
                    New
                  </span>
                </div>
                <h3 className="text-sm font-medium text-white leading-snug">Flex by Auto-UPI</h3>
                <p className="text-xs text-[#8E918F] mt-1 line-clamp-2">
                  UPI credit card made simple
                </p>
              </div>

              <span className="text-xs font-medium text-[#A8C7FA]">
                Check details
              </span>
            </div>

            {/* Tile 2: Personal Loan */}
            <div
              onClick={() => showToast('Personal Loan', 'Pre-approved loan up to ₹40 lakh with instant approval', 'info')}
              className="p-4 rounded-[28px] bg-[#1E1F24] hover:bg-[#282A30] transition-colors flex flex-col justify-between h-48 cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#282A30] flex items-center justify-center text-amber-400">
                    <CircleDollarSign className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-white leading-snug">Personal loan</h3>
                <p className="text-xs text-[#8E918F] mt-1 line-clamp-2">
                  Up to ₹40 lakh, instant approval
                </p>
              </div>

              <span className="text-xs font-medium text-[#A8C7FA]">
                Check details
              </span>
            </div>
          </div>
        </div>

        {/* 5. TRANSACTION HISTORY SECTION (Matching Screenshot 2) */}
        <div className="space-y-2 pt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-normal text-white">Transaction history</h2>
            <Link
              href="/activity"
              className="flex items-center gap-1 text-sm font-medium text-[#A8C7FA] hover:text-[#C2E7FF]"
            >
              <span>See all</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Seamless flat list rows */}
          <div className="divide-y divide-[#23252B]/40">
            {transactions.slice(0, 5).map((tx) => (
              <TransactionRow
                key={tx.id}
                transaction={tx}
                onClick={() => {
                  setSelectedTx(tx);
                  setIsReceiptOpen(true);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* CHECK BALANCE MODAL (Google Pay Style Bottom Sheet) */}
      {/* ================================================================= */}
      {isCheckBalanceOpen && targetAccount && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white text-center">
            <div className="w-12 h-1 bg-[#35383F] rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#A8C7FA]" />
                <span className="text-xs font-medium text-[#C4C7C5]">{targetAccount.bankName}</span>
              </div>
              <button onClick={() => setIsCheckBalanceOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {(checkState === 'VERIFYING' || checkState === 'FETCHING') && (
              <div className="py-8 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-[#35383F] border-t-[#A8C7FA] animate-spin mx-auto" />
                <p className="text-sm font-medium text-white">
                  {checkState === 'VERIFYING' ? 'Verifying UPI PIN session...' : 'Fetching balance from bank...'}
                </p>
              </div>
            )}

            {checkState === 'SUCCESS' && (
              <div className="py-4 space-y-4 animate-in fade-in zoom-in-95">
                <span className="text-xs text-[#8E918F] uppercase font-medium">Available Balance</span>
                <h2 className="text-3xl sm:text-4xl font-medium text-white font-mono">
                  ₹{targetAccount.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </h2>

                <div className="p-3.5 rounded-2xl bg-[#16171B] border border-[#282A30] text-xs text-left space-y-1.5 my-4">
                  <div className="flex justify-between text-[#8E918F]">
                    <span>Account</span>
                    <span className="text-white font-mono">{targetAccount.accountNumberMasked}</span>
                  </div>
                  <div className="flex justify-between text-[#8E918F]">
                    <span>Type</span>
                    <span className="text-white">{targetAccount.accountType ? targetAccount.accountType.replace('_', ' ') : 'Savings'}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckBalanceOpen(false)}
                  className="w-full py-3 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CREDIT REPORT MODAL */}
      {/* ================================================================= */}
      {isCreditReportOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white">
            <div className="w-12 h-1 bg-[#35383F] rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex justify-between items-center pb-3 border-b border-[#282A30]">
              <h3 className="text-base font-medium text-white">Credit report summary</h3>
              <button onClick={() => setIsCreditReportOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm">
              <div className="p-4 rounded-2xl bg-[#16171B] flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">CIBIL Score</p>
                  <p className="text-xs text-[#8E918F]">Updated 2 days ago</p>
                </div>
                <span className="text-2xl font-bold text-emerald-400">769</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#16171B] flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">Payment History</p>
                  <p className="text-xs text-[#8E918F]">100% on-time payments</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400">Excellent</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#16171B] flex justify-between items-center">
                <div>
                  <p className="font-medium text-white">Credit Card Utilization</p>
                  <p className="text-xs text-[#8E918F]">₹12,400 / ₹1,50,000</p>
                </div>
                <span className="text-xs font-semibold text-[#A8C7FA]">8%</span>
              </div>
            </div>

            <button
              onClick={() => setIsCreditReportOpen(false)}
              className="w-full py-3 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Transaction Receipt Modal */}
      <ReceiptModal
        transaction={selectedTx}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
