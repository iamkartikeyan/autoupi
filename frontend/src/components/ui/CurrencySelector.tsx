'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Check } from 'lucide-react';
import BottomSheet from './BottomSheet';

export interface CurrencyItem {
  code: string;
  symbol: string;
  flag: string;
  name: string;
  rate?: number;
}

export const SUPPORTED_CURRENCIES: CurrencyItem[] = [
  { code: 'INR', symbol: '₹', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', flag: '🇦🇪', name: 'UAE Dirham' },
  { code: 'USD', symbol: '$', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', flag: '🇪🇺', name: 'Euro' },
  { code: 'GBP', symbol: '£', flag: '🇬🇧', name: 'British Pound' },
  { code: 'SGD', symbol: 'S$', flag: '🇸🇬', name: 'Singapore Dollar' },
];

interface CurrencySelectorProps {
  selectedCode: string;
  onSelect: (currency: CurrencyItem) => void;
  currencies?: CurrencyItem[];
  label?: string;
  disabled?: boolean;
}

export default function CurrencySelector({
  selectedCode,
  onSelect,
  currencies = SUPPORTED_CURRENCIES,
  label,
  disabled = false,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const current = currencies.find((c) => c.code === selectedCode) || currencies[0];

  const filtered = currencies.filter(
    (c) =>
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: CurrencyItem) => {
    onSelect(item);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white transition-all duration-150 active:scale-95 disabled:opacity-50"
      >
        <span className="text-xl leading-none">{current.flag}</span>
        <span className="font-bold text-sm tracking-wide">{current.code}</span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {/* Responsive Sheet Picker */}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={label || 'Select Currency'}
      >
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search currency by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30"
              autoFocus
            />
          </div>

          {/* List */}
          <div className="space-y-1.5 max-h-[60vh] overflow-y-auto">
            {filtered.map((item) => {
              const isSelected = item.code === selectedCode;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-slate-100 dark:hover:bg-white/[0.04] text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.flag}</span>
                    <div className="text-left">
                      <div className="font-bold text-sm leading-tight flex items-center gap-1.5">
                        <span>{item.code}</span>
                        <span className="text-xs text-slate-400 font-normal">({item.symbol})</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{item.name}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary-500" />}
                </button>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-6 text-sm text-slate-400">
                No matching currency found
              </div>
            )}
          </div>
        </div>
      </BottomSheet>
    </>
  );
}
