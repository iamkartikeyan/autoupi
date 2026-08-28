'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { Beneficiary } from '@auto-upi/shared';
import { 
  ChevronLeft, 
  MoreVertical, 
  User, 
  Users, 
  ArrowLeftRight, 
  Search,
  BookOpen,
  Plus
} from 'lucide-react';

export default function PayAnyonePage() {
  const router = useRouter();
  const { beneficiaries } = usePayment();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

  // Default seed list matching Screenshot 3
  const defaultRecents = [
    {
      id: 'ben_rahul',
      name: 'Mr RAHUL SATYENDRA KUMAR',
      handle: '9582320234@slc',
      initials: 'M',
      bgColor: 'bg-emerald-600',
      avatarUrl: null
    },
    {
      id: 'ben_praveen',
      name: 'Praveen Kumar',
      handle: '+91 93158 96154',
      initials: 'PK',
      bgColor: 'bg-[#282A30]',
      avatarUrl: null
    },
    {
      id: 'ben_abhishek',
      name: 'ABHISHEK',
      handle: 'PhonePe • 7678573087@axl',
      initials: 'A',
      bgColor: 'bg-pink-600',
      avatarUrl: null
    }
  ];

  const filteredBeneficiaries = beneficiaries.filter(
    (b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.upiIdOrHandle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectContact = (id: string) => {
    router.push(`/pay/chat/${id}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if matching contact exists
    const match = beneficiaries.find(
      (b) =>
        b.upiIdOrHandle.toLowerCase() === searchQuery.trim().toLowerCase() ||
        b.name.toLowerCase() === searchQuery.trim().toLowerCase()
    );

    if (match) {
      router.push(`/pay/chat/${match.id}`);
    } else {
      // Open chat with this new identifier
      router.push(`/pay/chat/new?upi=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] px-4 pt-3 pb-24 max-w-lg mx-auto space-y-6 select-none">
      {/* 1. TOP BAR (Matching Screenshot 3) */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => router.back()}
          className="p-1 rounded-full hover:bg-white/10 text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button className="p-1 rounded-full hover:bg-white/10 text-white transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* 2. HEADER TITLE & SUBTITLE */}
      <div className="space-y-1">
        <h1 className="text-2xl font-normal text-white tracking-tight">Pay anyone</h1>
        <div className="flex items-center gap-1.5 text-xs text-[#8E918F]">
          <span>Pay any</span>
          <span className="font-bold text-[#C4C7C5] tracking-wider">UPI</span>
          <span>app using name, number or UPI ID</span>
        </div>
      </div>

      {/* 3. SEARCH / ENTER UPI ID INPUT (Matching Screenshot 3) */}
      <form onSubmit={handleSearchSubmit}>
        <div className="relative flex items-center bg-transparent border border-[#444746] focus-within:border-[#A8C7FA] rounded-2xl px-4 py-3.5 transition-colors">
          <input
            type="text"
            placeholder="Enter UPI ID or number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#8E918F] focus:outline-none pr-16"
          />

          <div className="absolute right-3 flex items-center gap-2 text-[#8E918F]">
            <span className="text-xs font-mono font-bold px-1 py-0.5 rounded bg-[#1E1F24] border border-[#35383F]">
              123
            </span>
            <button
              type="button"
              onClick={() => showToast('Contacts', 'Syncing phone contacts...', 'info')}
              className="p-1 hover:text-white transition-colors"
            >
              <User className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>

      {/* 4. RECENTS SECTION (Flat Rows on Canvas, Matching Screenshot 3) */}
      <div className="space-y-3">
        <h2 className="text-base font-normal text-[#E3E3E3]">Recents</h2>

        <div className="space-y-1">
          {defaultRecents.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelectContact(item.id)}
              className="flex items-center gap-3.5 py-3 hover:bg-white/5 px-2 rounded-2xl cursor-pointer transition-colors"
            >
              {item.avatarUrl ? (
                <img src={item.avatarUrl} alt={item.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className={`w-10 h-10 rounded-full ${item.bgColor} flex items-center justify-center text-white font-medium text-sm shrink-0`}>
                  {item.initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-normal text-white truncate">{item.name}</h3>
                <p className="text-xs text-[#8E918F] font-mono truncate">{item.handle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ALL PEOPLE ON UPI SECTION (Matching Screenshot 3) */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-normal text-[#E3E3E3]">All people on UPI</h2>

        <div className="space-y-1">
          {/* Self Transfer Row */}
          <div
            onClick={() => router.push('/transfer?tab=self')}
            className="flex items-center gap-3.5 py-3 hover:bg-white/5 px-2 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] shrink-0">
              <ArrowLeftRight className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-normal text-white">Self transfer</h3>
              <p className="text-xs text-[#8E918F]">Transfer money between your accounts</p>
            </div>
          </div>

          {/* Split Expense Row */}
          <div
            onClick={() => showToast('Split Expense', 'Select group members to split expense', 'info')}
            className="flex items-center gap-3.5 py-3 hover:bg-white/5 px-2 rounded-2xl cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#004A77] flex items-center justify-center text-[#C2E7FF] shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-normal text-white">Split expense</h3>
              <p className="text-xs text-[#8E918F]">Share expenses with a group</p>
            </div>
          </div>

          {/* Beneficiaries List */}
          {filteredBeneficiaries.map((ben) => (
            <div
              key={ben.id}
              onClick={() => handleSelectContact(ben.id)}
              className="flex items-center gap-3.5 py-3 hover:bg-white/5 px-2 rounded-2xl cursor-pointer transition-colors"
            >
              {ben.avatarUrl ? (
                <img src={ben.avatarUrl} alt={ben.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-pink-700 flex items-center justify-center text-white font-medium text-sm shrink-0">
                  {ben.initials}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-normal text-white truncate">{ben.name}</h3>
                <p className="text-xs text-[#8E918F] font-mono truncate">
                  {ben.bankName} • {ben.upiIdOrHandle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
