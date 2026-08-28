'use client';

import React, { useState } from 'react';
import { Beneficiary, SupportedCurrency } from '@auto-upi/shared';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { X, UserPlus, Edit3, Trash2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface BeneficiaryManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiary?: Beneficiary | null; // If null, mode is ADD; if provided, mode is EDIT
  onSave: (data: Partial<Beneficiary>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const BeneficiaryManageModal: React.FC<BeneficiaryManageModalProps> = ({
  isOpen,
  onClose,
  beneficiary,
  onSave,
  onDelete,
}) => {
  const isEditing = !!beneficiary;

  const [name, setName] = useState(beneficiary?.name || '');
  const [upiId, setUpiId] = useState(beneficiary?.upiIdOrHandle || '');
  const [country, setCountry] = useState(beneficiary?.country || 'India');
  const [currency, setCurrency] = useState<SupportedCurrency>(beneficiary?.currency || 'INR');
  const [bankName, setBankName] = useState(beneficiary?.bankName || 'State Bank of India');
  const [accountNumber, setAccountNumber] = useState(beneficiary?.accountNumberMasked?.replace(/[^0-9]/g, '') || '');
  const [routingIdentifier, setRoutingIdentifier] = useState(beneficiary?.routingIdentifier || '');
  const [phoneOrEmail, setPhoneOrEmail] = useState(beneficiary?.phoneOrEmail || '');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleCountryChange = (selectedCountry: string) => {
    setCountry(selectedCountry);
    if (selectedCountry === 'India') {
      setCurrency('INR');
      setBankName('State Bank of India');
      setRoutingIdentifier('SBIN0004829');
    } else if (selectedCountry === 'United Kingdom') {
      setCurrency('GBP');
      setBankName('Barclays UK');
      setRoutingIdentifier('20-04-15');
    } else if (selectedCountry === 'Singapore') {
      setCurrency('SGD');
      setBankName('DBS Bank Singapore');
      setRoutingIdentifier('DBSSSGSG');
    } else if (selectedCountry === 'Germany') {
      setCurrency('EUR');
      setBankName('Deutsche Bank Frankfurt');
      setRoutingIdentifier('DEUTDEDBFXX');
    } else {
      setCurrency('USD');
      setBankName('JPMorgan Chase');
      setRoutingIdentifier('021000021');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !upiId) return;

    setIsLoading(true);
    const flagMap: Record<string, string> = {
      India: '🇮🇳',
      'United Kingdom': '🇬🇧',
      Singapore: '🇸🇬',
      Germany: '🇪🇺',
      'United States': '🇺🇸',
    };

    const countryCodeMap: Record<string, string> = {
      India: 'IN',
      'United Kingdom': 'GB',
      Singapore: 'SG',
      Germany: 'DE',
      'United States': 'US',
    };

    const maskedAcc = accountNumber.startsWith('•')
      ? accountNumber
      : `•••• ${accountNumber ? accountNumber.slice(-4) : Math.floor(1000 + Math.random() * 9000)}`;

    await onSave({
      name,
      upiIdOrHandle: upiId,
      country,
      countryCode: countryCodeMap[country] || 'US',
      flagEmoji: flagMap[country] || '🌐',
      currency,
      bankName,
      accountNumberMasked: maskedAcc,
      routingIdentifier: routingIdentifier || `${countryCodeMap[country] || 'US'}0004829`,
      phoneOrEmail,
      verificationState: 'VERIFIED',
    });

    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-elevated border border-surface-highlight rounded-card p-6 shadow-elevated text-white max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface border border-surface-highlight text-zinc-300 flex items-center justify-center">
              {isEditing ? <Edit3 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isEditing ? 'Edit Beneficiary' : 'Add New Beneficiary'}
              </h3>
              <p className="text-[11px] text-gray-400">Institutional cross-border clearing directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto space-y-3.5 pr-1 -mr-1">
          <div>
            <label className="text-xs text-gray-400 font-medium">Full Name / Business Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Rahul Verma"
              className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 font-medium">Destination Corridor</label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
              >
                <option value="India">🇮🇳 India (UPI)</option>
                <option value="United Kingdom">🇬🇧 UK (FPS)</option>
                <option value="Singapore">🇸🇬 Singapore (PayNow)</option>
                <option value="Germany">🇪🇺 Germany (SEPA)</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium">Settlement Currency</label>
              <input
                type="text"
                disabled
                value={currency}
                className="w-full mt-1 p-3 rounded-xl bg-surface/50 border border-surface-highlight text-sm text-zinc-200 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 font-medium">Global UPI ID / Corridor Handle</label>
            <input
              type="text"
              required
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. rahul.verma@okaxis or rahul@paynow"
              className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white font-mono focus:outline-none focus:border-white/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 font-medium">Bank Name</label>
              <input
                type="text"
                required
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium">Routing / IFSC Code</label>
              <input
                type="text"
                value={routingIdentifier}
                onChange={(e) => setRoutingIdentifier(e.target.value)}
                placeholder="e.g. SBIN0004829"
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white font-mono focus:outline-none focus:border-white/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 font-medium">Last 4 Account Digits</label>
              <input
                type="text"
                maxLength={4}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="e.g. 4829"
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white font-mono focus:outline-none focus:border-white/50"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 font-medium">Contact Phone / Email</label>
              <input
                type="text"
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-2">
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={async () => {
                  if (confirm(`Delete ${beneficiary.name} from saved beneficiaries?`)) {
                    setIsLoading(true);
                    await onDelete(beneficiary.id);
                    setIsLoading(false);
                    onClose();
                  }
                }}
                className="p-3 rounded-full bg-surface hover:bg-rose-950/40 text-rose-400 border border-surface-highlight hover:border-rose-500/40 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <SecondaryButton onClick={onClose} className="w-1/2">
              Cancel
            </SecondaryButton>

            <PrimaryButton
              type="submit"
              isLoading={isLoading}
              variant="gradient"
              className={isEditing && onDelete ? 'flex-1' : 'w-1/2'}
            >
              {isEditing ? 'Save Changes' : 'Add Beneficiary'}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
