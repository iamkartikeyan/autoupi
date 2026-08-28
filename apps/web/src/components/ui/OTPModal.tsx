'use client';

import React, { useState, useRef, useEffect } from 'react';
import { PrimaryButton } from './PrimaryButton';
import { X, Lock, Shield, Sparkles } from 'lucide-react';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  isLoading?: boolean;
  demoCode?: string;
  phone?: string;
}

export const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  demoCode = '123456',
  phone = '+1 (555) 234-8901',
}) => {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    // Handle paste
    if (value.length > 1) {
      const pasted = value.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        newDigits[i] = pasted[i] || '';
      }
      setDigits(newDigits);
      const nextIndex = Math.min(pasted.length, 5);
      inputsRef.current[nextIndex]?.focus();
      return;
    }

    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const fullCode = digits.join('');
  const isComplete = fullCode.length === 6;

  const handleFillDemoCode = () => {
    const arr = (demoCode || '123456').split('');
    setDigits(arr);
    inputsRef.current[5]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onSubmit(fullCode);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-surface-elevated border border-surface-highlight rounded-card p-6 shadow-elevated text-white animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface border border-surface-highlight flex items-center justify-center text-zinc-300">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">Authorize Settlement</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-4">
          Enter the 6-digit Auto-UPI security PIN sent to <span className="text-gray-200 font-semibold">{phone}</span> to authorize token minting and bank reserve locking.
        </p>

        {/* Demo Helper Pill */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface border border-surface-highlight mb-5 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sandbox PIN: <strong className="text-white">{demoCode}</strong></span>
          </div>
          <button
            type="button"
            onClick={handleFillDemoCode}
            className="text-[11px] font-bold text-white hover:underline"
          >
            Auto Fill
          </button>
        </div>

        {/* 6 Digit Input Row */}
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 sm:gap-2.5 mb-6">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 h-12 sm:w-11 sm:h-13 rounded-xl bg-surface border border-surface-highlight focus:border-white/50 text-center text-lg font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all shadow-inner"
              />
            ))}
          </div>

          <PrimaryButton
            type="submit"
            disabled={!isComplete}
            isLoading={isLoading}
            variant="gradient"
          >
            Confirm & Execute Settlement
          </PrimaryButton>
        </form>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-gray-400">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>256-bit HSM Encrypted Transaction</span>
        </div>
      </div>
    </div>
  );
};
