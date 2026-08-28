'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SupportedCurrency } from '@auto-upi/shared';
import { ChevronDown, Check } from 'lucide-react';

interface CurrencySelectorProps {
  selectedCurrency: SupportedCurrency;
  onSelect: (curr: SupportedCurrency) => void;
}

const CURRENCIES: { code: SupportedCurrency; name: string; flag: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
  { code: 'INR', name: 'Indian Rupee', flag: '🇮🇳', symbol: '₹' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪', symbol: 'د.إ' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
];

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  selectedCurrency,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = CURRENCIES.find((c) => c.code === selectedCurrency) || CURRENCIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-surface-elevated hover:bg-surface-highlight border border-surface-highlight text-sm font-bold text-white transition-all active:scale-95 shadow-sm"
      >
        <span className="text-base">{current.flag}</span>
        <span>{current.code}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-52 rounded-2xl bg-surface-elevated border border-surface-highlight shadow-elevated z-50 py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            Select Currency
          </div>
          {CURRENCIES.map((item) => (
            <button
              key={item.code}
              type="button"
              onClick={() => {
                onSelect(item.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors ${
                selectedCurrency === item.code
                  ? 'bg-surface text-white font-bold'
                  : 'text-zinc-300 hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{item.flag}</span>
                <div>
                  <span className="font-semibold">{item.code}</span>
                  <span className="text-gray-400 ml-1.5">({item.symbol})</span>
                </div>
              </div>
              {selectedCurrency === item.code && <Check className="w-4 h-4 text-white" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
