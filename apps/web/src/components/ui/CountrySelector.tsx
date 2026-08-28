'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { SupportedCurrency } from '@auto-upi/shared';

export interface CountryOption {
  name: string;
  code: string;
  flag: string;
  currency: SupportedCurrency;
  rail: string;
}

export const SUPPORTED_COUNTRIES: CountryOption[] = [
  { name: 'India', code: 'IN', flag: '🇮🇳', currency: 'INR', rail: 'UPI Instant' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', currency: 'GBP', rail: 'Faster Payments' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬', currency: 'SGD', rail: 'PayNow' },
  { name: 'Germany (Eurozone)', code: 'DE', flag: '🇪🇺', currency: 'EUR', rail: 'SEPA Instant' },
  { name: 'United States', code: 'US', flag: '🇺🇸', currency: 'USD', rail: 'FedNow / ACH' },
  { name: 'United Arab Emirates', code: 'AE', flag: '🇦🇪', currency: 'AED', rail: 'Aani Instant' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', currency: 'JPY', rail: 'Zengin Instant' },
];

interface CountrySelectorProps {
  selectedCountryCode: string;
  onSelect: (country: CountryOption) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountryCode,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selected =
    SUPPORTED_COUNTRIES.find((c) => c.code === selectedCountryCode) || SUPPORTED_COUNTRIES[0];

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
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 rounded-input bg-surface-elevated hover:bg-surface-highlight border border-surface-highlight text-sm text-white transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{selected.flag}</span>
          <div className="text-left">
            <p className="font-semibold text-gray-100">{selected.name}</p>
            <p className="text-[11px] text-gray-400">
              Rail: {selected.rail} ({selected.currency})
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-2xl bg-surface-elevated border border-surface-highlight shadow-elevated z-50 py-1.5 backdrop-blur-xl animate-in fade-in">
          {SUPPORTED_COUNTRIES.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => {
                onSelect(country);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left transition-colors ${
                selectedCountryCode === country.code
                  ? 'bg-surface text-white font-semibold'
                  : 'text-zinc-200 hover:bg-surface-subtle'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{country.flag}</span>
                <div>
                  <p className="font-semibold">{country.name}</p>
                  <p className="text-[11px] text-gray-400">
                    {country.rail} • {country.currency}
                  </p>
                </div>
              </div>
              {selectedCountryCode === country.code && (
                <Check className="w-4 h-4 text-white" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
