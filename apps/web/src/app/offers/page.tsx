'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '../../context/ToastContext';
import { 
  Zap, 
  Gift, 
  Tag, 
  Clock, 
  Check, 
  Copy, 
  X, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Search,
  Building2,
  Smartphone,
  Flame,
  Tv
} from 'lucide-react';

interface BrandOffer {
  id: string;
  brand: string;
  title: string;
  description: string;
  discount: string;
  category: string;
  code: string;
  color: string;
  terms: string;
  expiresAt: string;
}

const BRAND_OFFERS: BrandOffer[] = [
  {
    id: 'off_01',
    brand: 'Zomato',
    title: 'Flat ₹50 off on Food Orders',
    description: 'Pay using Auto-UPI on Zomato and get flat ₹50 instant discount on orders above ₹249.',
    discount: 'Flat ₹50 Off',
    category: 'FOOD',
    code: 'ZOMATO50',
    color: 'bg-[#C2185B]',
    terms: 'Valid once per user on food delivery orders paid through Auto-UPI.',
    expiresAt: 'Expires in 12 days'
  },
  {
    id: 'off_02',
    brand: 'Indian Oil',
    title: '₹100 Cashback on Fuel',
    description: 'Scan Indian Oil QR code and pay with Auto-UPI to get up to ₹100 guaranteed cashback.',
    discount: 'Up to ₹100',
    category: 'TRAVEL',
    code: 'IOCL100',
    color: 'bg-[#E65100]',
    terms: 'Minimum fuel purchase of ₹500 required at participating IOCL petrol pumps.',
    expiresAt: 'Expires in 18 days'
  },
  {
    id: 'off_03',
    brand: 'Electricity Bill',
    title: 'Flat ₹25 Cashback on Bill',
    description: 'Pay your state electricity bill with Auto-UPI and receive ₹25 cashback in your bank account.',
    discount: '₹25 Cashback',
    category: 'BILLS',
    code: 'POWER25',
    color: 'bg-[#F57C00]',
    terms: 'Valid on electricity bill payment above ₹500.',
    expiresAt: 'Expires in 25 days'
  },
  {
    id: 'off_04',
    brand: 'Jio Prepaid',
    title: '₹30 Cashback on Recharge',
    description: 'Recharge your Jio number with ₹299 plan or above and get ₹30 instant cashback.',
    discount: '₹30 Cashback',
    category: 'RECHARGE',
    code: 'JIO30',
    color: 'bg-[#0B57D0]',
    terms: 'Applicable on 28-day validity plans and higher.',
    expiresAt: 'Expires in 8 days'
  },
  {
    id: 'off_05',
    brand: 'Swiggy',
    title: '20% off up to ₹75',
    description: 'Enjoy delicious meals with 20% discount when you checkout with Auto-UPI.',
    discount: '20% Off',
    category: 'FOOD',
    code: 'SWIGGYUPI',
    color: 'bg-[#FF6D00]',
    terms: 'Valid on select restaurants on orders above ₹199.',
    expiresAt: 'Expires in 15 days'
  },
  {
    id: 'off_06',
    brand: 'Tata Play DTH',
    title: 'Flat ₹40 Cashback on DTH',
    description: 'Recharge your Tata Play connection for 3 months and get ₹40 cashback.',
    discount: '₹40 Cashback',
    category: 'BILLS',
    code: 'TATAPLAY40',
    color: 'bg-[#8E24AA]',
    terms: 'Minimum recharge of ₹400.',
    expiresAt: 'Expires in 30 days'
  }
];

export default function OffersPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedOffer, setSelectedOffer] = useState<BrandOffer | null>(null);

  const CATEGORIES = [
    { id: 'ALL', label: 'All' },
    { id: 'FOOD', label: 'Food & Dining' },
    { id: 'BILLS', label: 'Bills & Utilities' },
    { id: 'RECHARGE', label: 'Recharges' },
    { id: 'TRAVEL', label: 'Fuel & Travel' }
  ];

  const filteredOffers = BRAND_OFFERS.filter((o) => {
    const matchesSearch =
      o.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || o.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Code Copied', `Coupon code "${code}" copied!`, 'success');
  };

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] pb-24 select-none">
      {/* Top Header */}
      <div className="max-w-lg mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
        <Link
          href="/"
          className="p-2 -ml-2 rounded-full hover:bg-[#1E1F24] active:bg-white/20 text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-normal text-white">Offers</h1>
        <div className="w-6" />
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-5 pt-2">
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-[#1E1F24] border border-[#35383F] rounded-full px-4 py-2.5 shadow-md">
          <Search className="w-5 h-5 text-[#8E918F] shrink-0" />
          <input
            type="text"
            placeholder="Search offers by merchant or brand"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-white placeholder-[#8E918F] w-full focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#8E918F]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Categories Horizontal Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#0B57D0] text-white shadow-sm'
                  : 'bg-[#1E1F24] hover:bg-[#282A30] text-[#C4C7C5] border border-[#35383F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredOffers.map((offer) => (
            <div
              key={offer.id}
              onClick={() => setSelectedOffer(offer)}
              className="p-4 rounded-[24px] bg-[#1E1F24] hover:bg-[#282A30] border border-[#35383F] shadow-md flex flex-col justify-between cursor-pointer transition-all duration-200 group"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl ${offer.color} text-white font-bold flex items-center justify-center text-sm shadow-sm`}>
                    {offer.brand.charAt(0)}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    {offer.discount}
                  </span>
                </div>

                <h3 className="text-sm font-normal text-white leading-snug">
                  {offer.title}
                </h3>
                <p className="text-xs text-[#8E918F] mt-1 line-clamp-2">
                  {offer.description}
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-[#2D3039] mt-3">
                <span className="text-[11px] text-[#8E918F]">{offer.expiresAt}</span>
                <span className="text-xs font-semibold text-[#A8C7FA] group-hover:underline">
                  View Offer
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-4 space-y-1 text-xs text-[#8E918F]">
          <p>Offers curated for your Auto-UPI ID</p>
          <div className="flex items-center justify-center gap-1 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Verified Merchant Partners</span>
          </div>
        </div>
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />
            <div className="flex justify-between items-center pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl ${selectedOffer.color} text-white font-bold flex items-center justify-center text-xs`}>
                  {selectedOffer.brand.charAt(0)}
                </div>
                <h3 className="text-base font-normal text-white">{selectedOffer.brand}</h3>
              </div>
              <button onClick={() => setSelectedOffer(null)} className="p-1 text-[#8E918F] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedOffer.title}</h2>
                <p className="text-xs text-[#C4C7C5] mt-1.5 leading-relaxed">{selectedOffer.description}</p>
              </div>

              {/* Coupon Code Box */}
              <div className="p-3.5 rounded-2xl bg-[#16171B] border border-[#35383F] flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#8E918F] uppercase tracking-wider font-semibold">Promo Code</span>
                  <p className="font-mono text-sm text-white font-bold">{selectedOffer.code}</p>
                </div>
                <button
                  onClick={() => copyCode(selectedOffer.code)}
                  className="px-3 py-1.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>

              {/* Terms */}
              <div className="text-xs text-[#8E918F] space-y-1 bg-[#16171B] p-3.5 rounded-2xl border border-[#2D3039]">
                <span className="text-white font-medium block">Terms & Conditions</span>
                <p>{selectedOffer.terms}</p>
              </div>

              <button
                onClick={() => {
                  setSelectedOffer(null);
                  router.push('/pay');
                }}
                className="w-full py-3.5 rounded-full bg-[#0B57D0] hover:bg-[#1A73E8] text-white font-semibold text-sm transition-colors mt-2"
              >
                Pay with Auto-UPI to Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
