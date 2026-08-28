'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { OfferCard } from '../../components/ui/OfferCard';
import { SearchBar } from '../../components/ui/SearchBar';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { OfferOrReward } from '@auto-upi/shared';
import { 
  Zap, 
  Gift, 
  Tag, 
  Clock, 
  Check, 
  Copy, 
  X, 
  Sparkles, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const EXTENDED_OFFERS: (OfferOrReward & { category: string; terms: string })[] = [
  {
    id: 'off_feat_01',
    type: 'FX_DISCOUNT',
    category: 'FX_REBATES',
    title: 'Zero-Fee Transfer to India & UK',
    description: 'Get 100% network and platform fee waiver on your next cross-border remittance above $250.',
    amountOrPercent: '100% Fee Waiver',
    expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(),
    isUnlocked: true,
    code: 'ZEROXB2026',
    bgGradient: 'from-surface-elevated via-surface to-surface border-surface-highlight',
    terms: 'Valid on all USD → INR and USD → GBP corridors. Maximum fee waiver of $25 per transaction. One-time use per verified Tier 2 account.'
  },
  {
    id: 'off_sg_02',
    type: 'FX_DISCOUNT',
    category: 'SETTLEMENT_BOOST',
    title: 'Singapore PayNow Interbank Boost',
    description: 'Enjoy +0.45% above mid-market interbank exchange rates on all SGD conversions.',
    amountOrPercent: '+0.45% FX Boost',
    expiresAt: new Date(Date.now() + 21 * 86400000).toISOString(),
    isUnlocked: true,
    code: 'SGBOOST',
    bgGradient: 'from-emerald-600/30 via-teal-600/20 to-surface border-emerald-500/30',
    terms: 'Applied automatically during checkout on USD → SGD and EUR → SGD corridors. No minimum transfer required.'
  },
  {
    id: 'off_cb_03',
    type: 'CASHBACK',
    category: 'FX_REBATES',
    title: 'Institutional Volume Cashback',
    description: 'Send $1,000 or more in a single transaction and receive $25 instant custody cashback.',
    amountOrPercent: '$25.00 Cashback',
    expiresAt: new Date(Date.now() + 30 * 86400000).toISOString(),
    isUnlocked: true,
    code: 'VIPCASH25',
    bgGradient: 'from-violet-600/30 via-purple-600/20 to-surface border-violet-500/30',
    terms: 'Requires completed payment settlement. Cashback is credited instantly to user primary bank balance.'
  },
  {
    id: 'off_euro_04',
    type: 'VOUCHER',
    category: 'MERCHANT_PERKS',
    title: 'SEPA Instant Express Voucher',
    description: 'Zero processing delay guaranteed across all Eurozone partner banking institutions.',
    amountOrPercent: 'SEPA Express',
    expiresAt: new Date(Date.now() + 45 * 86400000).toISOString(),
    isUnlocked: true,
    code: 'SEPAEXPRESS',
    bgGradient: 'from-amber-600/30 via-orange-600/20 to-surface border-amber-500/30',
    terms: 'Guarantees sub-3 second settlement finality to all SEPA Instant member banks.'
  }
];

export default function OffersPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedOffer, setSelectedOffer] = useState<(OfferOrReward & { category: string; terms: string }) | null>(null);

  const CATEGORIES = [
    { id: 'ALL', label: 'All Offers' },
    { id: 'FX_REBATES', label: 'FX Rebates' },
    { id: 'SETTLEMENT_BOOST', label: 'Settlement Boosts' },
    { id: 'MERCHANT_PERKS', label: 'Corridor Perks' },
  ];

  const filteredOffers = EXTENDED_OFFERS.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.code && o.code.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'ALL' || o.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleApplyAndSend = (offer: OfferOrReward & { terms: string }) => {
    showToast('Offer Activated', `${offer.title} will be applied to your next transfer`, 'success');
    setSelectedOffer(null);
    router.push('/pay');
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Promo Code Copied', code, 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Partner & Corridor Offers</h1>
          <p className="text-xs text-gray-400">Exclusive promotions for cross-border remittances</p>
        </div>
      </div>

      {/* Featured Hero Offer */}
      <div className="p-6 rounded-card bg-surface border border-surface-highlight shadow-elevated text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded-full bg-white text-black text-[11px] font-extrabold uppercase tracking-wide">
              Featured Corridor Offer
            </span>
            <span className="text-xs text-zinc-300 font-semibold flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>14 Days Left</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white mb-2 leading-tight">
            100% Zero-Fee Remittance to India & UK
          </h2>
          <p className="text-xs text-gray-300 max-w-lg mb-4 leading-relaxed">
            Eliminate all network fees and FX spread markups on your next transfer over $250. Guaranteed instant settlement via NPCI UPI and UK Faster Payments.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleApplyAndSend(EXTENDED_OFFERS[0])}
              className="py-3 px-6 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Activate & Send Money</span>
            </button>

            <button
              onClick={() => setSelectedOffer(EXTENDED_OFFERS[0])}
              className="py-3 px-5 rounded-full bg-surface-elevated hover:bg-surface-highlight text-gray-200 text-xs font-semibold border border-surface-highlight transition-colors"
            >
              View Terms
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search offers by name, corridor, or code..."
      />

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-all shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-white text-black shadow-md font-bold'
                : 'bg-surface text-zinc-400 hover:text-zinc-200 border border-surface-highlight'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            onClick={() => setSelectedOffer(offer)}
            className="cursor-pointer"
          >
            <OfferCard
              offer={offer}
              onClaim={() => setSelectedOffer(offer)}
            />
          </div>
        ))}
      </div>

      {/* Offer Detail Sheet Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-surface-elevated border border-surface-highlight rounded-card p-6 shadow-elevated text-white animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-surface-highlight">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-surface border border-surface-highlight text-zinc-300 flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Offer Details</h3>
              </div>
              <button
                onClick={() => setSelectedOffer(null)}
                className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Offer Highlight */}
            <div className="my-4 p-4 rounded-2xl bg-surface border border-surface-highlight">
              <span className="px-2.5 py-0.5 rounded-full bg-surface-elevated border border-surface-highlight text-zinc-200 font-bold text-xs font-mono">
                {selectedOffer.amountOrPercent}
              </span>
              <h2 className="text-lg font-bold text-white mt-2">{selectedOffer.title}</h2>
              <p className="text-xs text-gray-300 mt-1 leading-relaxed">{selectedOffer.description}</p>
            </div>

            {/* Coupon Code copy box */}
            {selectedOffer.code && (
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-subtle border border-surface-highlight mb-4">
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-medium">Coupon Code</p>
                  <p className="font-mono text-sm font-bold text-zinc-200">{selectedOffer.code}</p>
                </div>
                <button
                  onClick={() => copyCode(selectedOffer.code!)}
                  className="px-3 py-1.5 rounded-xl bg-surface-elevated hover:bg-surface-highlight text-white text-xs font-semibold flex items-center gap-1 border border-surface-highlight"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </button>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="p-4 rounded-2xl bg-surface border border-surface-highlight text-xs space-y-2 mb-6">
              <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-zinc-300" />
                <span>Terms & Conditions</span>
              </div>
              <p className="text-gray-400 text-[11px] leading-relaxed">{selectedOffer.terms}</p>
            </div>

            {/* CTA */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedOffer(null)}
                className="w-1/3 py-3 rounded-full text-xs font-semibold bg-surface hover:bg-surface-subtle text-gray-300 border border-surface-highlight"
              >
                Close
              </button>
              <PrimaryButton
                onClick={() => handleApplyAndSend(selectedOffer)}
                variant="gradient"
                className="w-2/3"
              >
                Apply & Send Now
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
