'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import { 
  ShieldCheck, 
  User, 
  CreditCard, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  X, 
  ChevronRight, 
  ArrowLeft,
  Sparkles,
  Lock
} from 'lucide-react';
import { KYCSubmissionPayload } from '@auto-upi/shared';

interface KYCWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KYCWorkflowModal: React.FC<KYCWorkflowModalProps> = ({ isOpen, onClose }) => {
  const { user, submitKYC, isLoading } = useAuth();

  // Workflow steps: 1: Personal, 2: Identity, 3: Address, 4: Purpose, 5: Result
  const [step, setStep] = useState<number>(1);

  const [formData, setFormData] = useState<KYCSubmissionPayload>({
    fullName: user.name || 'Aarav Patel',
    dob: '1992-05-14',
    nationality: 'United States',
    documentType: 'PASSPORT',
    documentNumberMasked: '•••• •••• 8492',
    addressLine1: '452 Fremont Street, Apt 8B',
    city: 'San Francisco',
    postalCode: '94105',
    country: 'United States',
    remittancePurpose: 'FAMILY_SUPPORT',
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else if (step === 4) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const success = await submitKYC(formData);
    if (success) {
      setStep(5);
    }
  };

  const STEPS_CONFIG = [
    { num: 1, label: 'Personal', icon: User },
    { num: 2, label: 'Identity', icon: CreditCard },
    { num: 3, label: 'Address', icon: MapPin },
    { num: 4, label: 'Purpose', icon: Briefcase },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-surface-elevated border border-surface-highlight rounded-card p-6 shadow-elevated text-white animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Institutional KYC Verification</h3>
              <p className="text-[11px] text-gray-400">Sandbox Compliance & Identity Rail</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Pills */}
        {step <= 4 && (
          <div className="flex items-center justify-between mb-5 px-1">
            {STEPS_CONFIG.map((s) => {
              const Icon = s.icon;
              const isDone = step > s.num;
              const isCurrent = step === s.num;

              return (
                <div key={s.num} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-emerald-500 text-black'
                        : isCurrent
                        ? 'bg-white text-black ring-2 ring-white/20 shadow-md'
                        : 'bg-surface text-gray-400 border border-surface-highlight'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span
                    className={`text-[10px] ${
                      isCurrent ? 'text-white font-bold' : 'text-gray-400'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Step 1: Personal Details */}
        {step === 1 && (
          <div className="space-y-3.5 animate-in fade-in">
            <div>
              <label className="text-xs text-gray-400">Full Legal Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Nationality</label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Identity Information */}
        {step === 2 && (
          <div className="space-y-3.5 animate-in fade-in">
            <div>
              <label className="text-xs text-gray-400">Identification Document Type</label>
              <select
                value={formData.documentType}
                onChange={(e) =>
                  setFormData({ ...formData, documentType: e.target.value as any })
                }
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
              >
                <option value="PASSPORT">Passport (International)</option>
                <option value="NATIONAL_ID">National Identity Card</option>
                <option value="DRIVERS_LICENSE">Driver's License</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400">Masked Synthetic Document Number</label>
              <input
                type="text"
                value={formData.documentNumberMasked}
                onChange={(e) =>
                  setFormData({ ...formData, documentNumberMasked: e.target.value })
                }
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white font-mono focus:outline-none focus:border-white/50"
              />
              <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Synthetic demo sandbox data only. No real IDs stored.</span>
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Address */}
        {step === 3 && (
          <div className="space-y-3.5 animate-in fade-in">
            <div>
              <label className="text-xs text-gray-400">Street Address</label>
              <input
                type="text"
                value={formData.addressLine1}
                onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Postal Code</label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Remittance Purpose & Submit */}
        {step === 4 && (
          <div className="space-y-3.5 animate-in fade-in">
            <div>
              <label className="text-xs text-gray-400">Primary Remittance Purpose</label>
              <select
                value={formData.remittancePurpose}
                onChange={(e) =>
                  setFormData({ ...formData, remittancePurpose: e.target.value as any })
                }
                className="w-full mt-1 p-3 rounded-xl bg-surface border border-surface-highlight text-sm text-white focus:outline-none focus:border-white/50"
              >
                <option value="FAMILY_SUPPORT">Family Support & Living Expenses</option>
                <option value="BUSINESS">Commercial / Business Invoices</option>
                <option value="SERVICES">Freelance & Consulting Services</option>
                <option value="EDUCATION">Tuition & Education Fees</option>
                <option value="TRAVEL">Travel & Hospitality</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-surface border border-surface-highlight text-xs text-zinc-300">
              <p className="font-semibold text-white mb-0.5">Automated Compliance Clearance</p>
              <p className="text-[11px] text-zinc-400">
                Tier 2 Institutional Verification raises your daily cross-border remittance limit to <strong>$50,000 USD</strong>.
              </p>
            </div>
          </div>
        )}

        {/* Step 5: Verification Result Success Screen */}
        {step === 5 && (
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-glow-emerald">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                Identity Verified • Tier 2
              </span>
              <h3 className="text-lg font-extrabold text-white mt-2">Compliance Approved</h3>
              <p className="text-xs text-gray-300 max-w-xs mx-auto mt-1 leading-relaxed">
                Your account is now approved for up to $50,000 USD in daily atomic cross-border payments.
              </p>
            </div>

            <PrimaryButton onClick={onClose} variant="gradient">
              Return to Profile
            </PrimaryButton>
          </div>
        )}

        {/* Action Buttons for Steps 1-4 */}
        {step <= 4 && (
          <div className="flex gap-2.5 mt-6 pt-3 border-t border-surface-highlight">
            {step > 1 && (
              <SecondaryButton onClick={handleBack} className="w-1/3">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </SecondaryButton>
            )}
            <PrimaryButton
              onClick={handleNext}
              isLoading={isLoading}
              variant="gradient"
              className={step === 1 ? 'w-full' : 'w-2/3'}
            >
              {step === 4 ? 'Verify & Complete' : 'Continue'}
              {step < 4 && <ChevronRight className="w-4 h-4" />}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
};
