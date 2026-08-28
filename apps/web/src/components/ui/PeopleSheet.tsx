'use client';

import React, { useState } from 'react';
import { Beneficiary } from '@auto-upi/shared';
import { SearchBar } from './SearchBar';
import { X, Plus, Star, ArrowUpRight, UserCheck } from 'lucide-react';

interface PeopleSheetProps {
  isOpen: boolean;
  onClose: () => void;
  beneficiaries: Beneficiary[];
  onSelectBeneficiary: (ben: Beneficiary) => void;
  onAddNew: () => void;
}

export const PeopleSheet: React.FC<PeopleSheetProps> = ({
  isOpen,
  onClose,
  beneficiaries,
  onSelectBeneficiary,
  onAddNew,
}) => {
  const [search, setSearch] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  if (!isOpen) return null;

  const filtered = beneficiaries.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.upiIdOrHandle.toLowerCase().includes(search.toLowerCase()) ||
      b.country.toLowerCase().includes(search.toLowerCase());
    const matchesFav = showFavoritesOnly ? b.isFavorite : true;
    return matchesSearch && matchesFav;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-elevated border border-surface-highlight rounded-t-[32px] sm:rounded-card p-6 shadow-elevated text-white max-h-[88vh] flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-surface-highlight">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface border border-surface-highlight text-zinc-300 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">All People & Beneficiaries</h3>
              <p className="text-xs text-gray-400">Instant cross-border payment directory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search and filters */}
        <div className="my-4 space-y-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, handle, or country..."
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showFavoritesOnly
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-surface text-gray-400 border border-surface-highlight'
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Favorites Only</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onAddNew();
              }}
              className="text-xs font-bold text-zinc-300 hover:text-white hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Beneficiary</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 -mr-1">
          {filtered.map((ben) => (
            <div
              key={ben.id}
              onClick={() => {
                onSelectBeneficiary(ben);
                onClose();
              }}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-surface hover:bg-surface-subtle border border-surface-highlight cursor-pointer transition-all active:scale-[0.99]"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  {ben.avatarUrl ? (
                    <img
                      src={ben.avatarUrl}
                      alt={ben.name}
                      className="w-12 h-12 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-zinc-800 text-white font-bold flex items-center justify-center text-sm">
                      {ben.initials}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 text-sm bg-surface-elevated rounded-full w-5 h-5 flex items-center justify-center border border-surface-highlight shadow-sm">
                    {ben.flagEmoji}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-white">{ben.name}</h4>
                  <p className="text-xs text-gray-400">
                    {ben.upiIdOrHandle} • {ben.country}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-zinc-200 bg-surface-elevated px-2.5 py-1 rounded-full border border-surface-highlight">
                  {ben.currency}
                </span>
                <ArrowUpRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
