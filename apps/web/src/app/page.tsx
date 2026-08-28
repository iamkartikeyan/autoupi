'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePayment } from '../context/PaymentContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { TransactionRow } from '../components/ui/TransactionRow';
import { ReceiptModal } from '../components/ui/ReceiptModal';
import { PeopleSheet } from '../components/ui/PeopleSheet';
import { OfferDetailModal } from '../components/ui/OfferDetailModal';
import { ReferralShareSheet } from '../components/ui/ReferralShareSheet';
import { QRPayIllustration } from '../components/illustrations/QRPayIllustration';
import { PaymentTransaction, Beneficiary, OfferOrReward } from '@auto-upi/shared';
import { 
  QrCode, 
  Send, 
  Building2, 
  Phone, 
  Plus, 
  ChevronRight, 
  Sparkles, 
  Tag, 
  Users, 
  CreditCard, 
  Search, 
  X, 
  Zap, 
  ArrowUpRight,
  ShieldCheck,
  Compass
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { 
    bankAccounts, 
    beneficiaries, 
    transactions, 
    offers, 
    referralData, 
    addBeneficiary, 
    claimOffer 
  } = usePayment();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<OfferOrReward | null>(null);

  // Modals & Sheets
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [isReferralSheetOpen, setIsReferralSheetOpen] = useState(false);
  const [isPeopleSheetOpen, setIsPeopleSheetOpen] = useState(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  // New contact form
  const [newName, setNewName] = useState('');
  const [newUpi, setNewUpi] = useState('');
  const [newCountry, setNewCountry] = useState('India');

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.upiIdOrHandle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePersonClick = (ben: Beneficiary) => {
    router.push(`/pay/chat/${ben.id}`);
  };

  const handleCreateBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newUpi) return;

    await addBeneficiary({
      name: newName,
      upiIdOrHandle: newUpi,
      country: newCountry,
      countryCode: newCountry === 'India' ? 'IN' : 'GB',
      flagEmoji: newCountry === 'India' ? '🇮🇳' : '🇬🇧',
      currency: newCountry === 'India' ? 'INR' : 'GBP',
      bankName: 'Partner Bank',
      routingIdentifier: 'IFSC0001',
    });

    setNewName('');
    setNewUpi('');
    setIsAddContactModalOpen(false);
    showToast('Contact Saved', `${newName} added to your frequent contacts`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] px-4 pt-3 pb-24 max-w-lg mx-auto space-y-6 select-none">
      {/* 1. TOP GOOGLE SEARCH BAR WITH PROFILE AVATAR */}
      <div className="flex items-center gap-3 bg-[#1E1F24] border border-[#35383F] rounded-full px-4 py-2.5 shadow-sm">
        <Search className="w-5 h-5 text-[#8E918F] shrink-0" />
        <input
          type="text"
          placeholder="Pay anyone on UPI or search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder-[#8E918F] focus:outline-none"
        />
        <Link href="/you" className="shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#004A77] text-white flex items-center justify-center font-bold text-xs">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="You" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.name?.charAt(0) || 'K'
            )}
          </div>
        </Link>
      </div>

      {/* 2. FLAT CIRCULAR QUICK ACTIONS (Google Pay Native Grid - 8 Actions) */}
      <div className="grid grid-cols-4 gap-y-4 gap-x-2 text-center pt-1">
        {/* Scan QR */}
        <div
          onClick={() => router.push('/qr')}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] group-hover:scale-105 transition-transform shadow-sm">
            <QrCode className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-[#E3E3E3] mt-2 leading-tight">Scan any<br />QR code</span>
        </div>

        {/* Pay Contacts */}
        <div
          onClick={() => router.push('/pay')}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] group-hover:scale-105 transition-transform shadow-sm">
            <Send className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-[#E3E3E3] mt-2 leading-tight">Pay<br />contacts</span>
        </div>

        {/* Pay Phone Number */}
        <div
          onClick={() => router.push('/pay')}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] group-hover:scale-105 transition-transform shadow-sm">
            <Phone className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-[#E3E3E3] mt-2 leading-tight">Pay phone<br />number</span>
        </div>

        {/* Bank Transfer */}
        <div
          onClick={() => router.push('/transfer?tab=others')}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] group-hover:scale-105 transition-transform shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-[#E3E3E3] mt-2 leading-tight">Bank<br />transfer</span>
        </div>

        {/* Pay UPI ID */}
        <div
          onClick={() => router.push('/pay')}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] group-hover:scale-105 transition-transform shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-[#E3E3E3] mt-2 leading-tight">Pay UPI ID<br />or number</span>
        </div>

        {/* Self Transfer */}
        <div
          onClick={() => router.push('/transfer?tab=self')}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] group-hover:scale-105 transition-transform shadow-sm">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-[#E3E3E3] mt-2 leading-tight">Self<br />transfer</span>
        </div>

        {/* Pay Bills */}
        <div
          onClick={() => showToast('Bills', 'Select biller to pay electricity, DTH, or broadband', 'info')}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] group-hover:scale-105 transition-transform shadow-sm">
            <CreditCard className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-[#E3E3E3] mt-2 leading-tight">Pay<br />bills</span>
        </div>

        {/* Mobile Recharge */}
        <div
          onClick={() => showToast('Recharge', 'Enter mobile number for instant recharge', 'info')}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] group-hover:scale-105 transition-transform shadow-sm">
            <Phone className="w-6 h-6" />
          </div>
          <span className="text-xs font-medium text-[#E3E3E3] mt-2 leading-tight">Mobile<br />recharge</span>
        </div>
      </div>

      {/* 3. PEOPLE SECTION (Flat Avatars with No Card Container) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-normal text-white">People</h2>
          <button
            onClick={() => setIsPeopleSheetOpen(true)}
            className="text-xs font-medium text-[#A8C7FA] hover:text-[#C2E7FF]"
          >
            See more
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 text-center">
          {filteredBeneficiaries.slice(0, 7).map((ben) => (
            <div
              key={ben.id}
              onClick={() => handlePersonClick(ben)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className="relative mb-1.5">
                <div className="w-14 h-14 rounded-full bg-[#1E1F24] border border-[#35383F] overflow-hidden flex items-center justify-center text-white font-bold text-sm group-hover:scale-105 transition-transform shadow-sm">
                  {ben.avatarUrl ? (
                    <img src={ben.avatarUrl} alt={ben.name} className="w-full h-full object-cover" />
                  ) : (
                    ben.initials
                  )}
                </div>
                <span className="absolute -bottom-1 -right-1 text-sm">{ben.flagEmoji}</span>
              </div>
              <span className="text-xs font-medium text-[#E3E3E3] truncate w-16 group-hover:text-white">
                {ben.name.split(' ')[0]}
              </span>
            </div>
          ))}

          {/* Add New Contact */}
          <div
            onClick={() => setIsAddContactModalOpen(true)}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#444746] flex items-center justify-center text-[#A8C7FA] group-hover:border-[#A8C7FA] mb-1.5 transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-[#A8C7FA]">Add</span>
          </div>
        </div>
      </div>

      {/* 4. OFFERS & REWARDS SECTION (2 Pill Tiles) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xl font-normal text-white">Offers & rewards</h2>

        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/rewards"
            className="p-4 rounded-[24px] bg-[#2D1E3A] hover:bg-[#382649] transition-colors flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center text-[#D0BCFF] shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Rewards</h3>
              <p className="text-xs text-[#D0BCFF] font-medium">₹148 earned</p>
            </div>
          </Link>

          <Link
            href="/offers"
            className="p-4 rounded-[24px] bg-[#162E33] hover:bg-[#1E3E45] transition-colors flex items-center gap-3 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-teal-900/50 flex items-center justify-center text-[#A8C7FA] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-white">Offers</h3>
              <p className="text-xs text-[#A8C7FA] font-medium">4 active</p>
            </div>
          </Link>
        </div>
      </div>

      {/* 5. RECENT TRANSACTIONS LIST (Flat Seamless Rows, Matching Screenshot 2) */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-normal text-white">Recent transactions</h2>
          <Link
            href="/activity"
            className="flex items-center gap-1 text-sm font-medium text-[#A8C7FA] hover:text-[#C2E7FF]"
          >
            <span>See all</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Flat seamless list rows */}
        <div className="divide-y divide-[#23252B]/40">
          {transactions.slice(0, 4).map((tx) => (
            <TransactionRow
              key={tx.id}
              transaction={tx}
              onClick={() => {
                setSelectedTransaction(tx);
                setIsReceiptOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ADD CONTACT MODAL */}
      {/* ================================================================= */}
      {isAddContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium">Add new UPI contact</h3>
              <button onClick={() => setIsAddContactModalOpen(false)} className="text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBeneficiary} className="space-y-4">
              <div>
                <label className="text-xs text-[#8E918F]">Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Praveen Kumar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full mt-1 p-3 rounded-2xl bg-[#16171B] border border-[#35383F] text-sm text-white focus:outline-none focus:border-[#A8C7FA]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8E918F]">UPI ID / Mobile Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 9315896154@ptaxis"
                  value={newUpi}
                  onChange={(e) => setNewUpi(e.target.value)}
                  className="w-full mt-1 p-3 rounded-2xl bg-[#16171B] border border-[#35383F] text-sm text-white focus:outline-none focus:border-[#A8C7FA]"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddContactModalOpen(false)}
                  className="w-1/2 py-3 rounded-full border border-[#444746] text-[#C4C7C5] text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-medium"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* People Directory Sheet */}
      <PeopleSheet
        isOpen={isPeopleSheetOpen}
        onClose={() => setIsPeopleSheetOpen(false)}
        beneficiaries={beneficiaries}
        onSelectBeneficiary={handlePersonClick}
        onAddNew={() => setIsAddContactModalOpen(true)}
      />

      {/* Transaction Receipt Modal */}
      <ReceiptModal
        transaction={selectedTransaction}
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
      />
    </div>
  );
}
