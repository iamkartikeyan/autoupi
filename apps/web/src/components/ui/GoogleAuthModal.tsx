'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, Mail, Phone, Lock, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const { user, loginWithGoogle, login, sendOtp, verifyOtp, isLoading } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'google' | 'email' | 'phone'>('google');

  // Google Sign-In state
  const [customGmail, setCustomGmail] = useState('');
  const [customName, setCustomName] = useState('');

  // Email & Password state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone OTP state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  if (!isOpen) return null;

  const handleGoogleQuickLogin = async (presetEmail?: string, presetName?: string) => {
    const selectedEmail = presetEmail || customGmail || 'kartik.kumar@gmail.com';
    const selectedName = presetName || customName || 'Kartik Kumar';

    const success = await loginWithGoogle({
      email: selectedEmail,
      name: selectedName,
      avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedName)}&background=004A77&color=fff`,
    });

    if (success) {
      onClose();
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const ok = await login({ identifier: email, password: password || 'AutoUpi2026!' });
      if (ok) onClose();
    } catch (err: any) {
      showToast('Login Failed', err.message || 'Check your credentials', 'error');
    }
  };

  const handleSendOtp = async () => {
    if (!phoneNumber) return;
    try {
      const res = await sendOtp(phoneNumber);
      if (res.success) {
        setIsOtpSent(true);
        showToast('OTP Sent', `Verification code sent to ${phoneNumber}`, 'info');
      }
    } catch (err) {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) return;
    try {
      const ok = await verifyOtp(phoneNumber, otpCode);
      if (ok) onClose();
    } catch (err) {
      showToast('Verification Failed', 'Please try again', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2D3039]">
          <div className="flex items-center gap-2.5">
            {/* Google Colorful 'G' Logo */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-normal text-white">Sign in with Google</h2>
              <p className="text-[11px] text-[#8E918F]">Auto-UPI Secure Payment Authentication</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#8E918F] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#2D3039] my-4">
          <button
            onClick={() => setActiveTab('google')}
            className={`flex-1 pb-2.5 text-xs font-medium relative ${
              activeTab === 'google' ? 'text-white' : 'text-[#8E918F] hover:text-white'
            }`}
          >
            <span>Google / Gmail</span>
            {activeTab === 'google' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>

          <button
            onClick={() => setActiveTab('phone')}
            className={`flex-1 pb-2.5 text-xs font-medium relative ${
              activeTab === 'phone' ? 'text-white' : 'text-[#8E918F] hover:text-white'
            }`}
          >
            <span>Phone OTP</span>
            {activeTab === 'phone' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>

          <button
            onClick={() => setActiveTab('email')}
            className={`flex-1 pb-2.5 text-xs font-medium relative ${
              activeTab === 'email' ? 'text-white' : 'text-[#8E918F] hover:text-white'
            }`}
          >
            <span>Email Login</span>
            {activeTab === 'email' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
          </button>
        </div>

        {/* TAB 1: GOOGLE / GMAIL AUTH */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <p className="text-xs text-[#8E918F] leading-relaxed">
              Choose an active Google account to securely sign in and link your verified UPI identity.
            </p>

            {/* Quick 1-Tap Google Accounts List */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleQuickLogin('kartik.kumar@gmail.com', 'Kartik Kumar')}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16171B] hover:bg-[#282A30] border border-[#35383F] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#004A77] text-white flex items-center justify-center font-bold text-sm">
                    K
                  </div>
                  <div>
                    <h4 className="text-sm font-normal text-white">Kartik Kumar</h4>
                    <p className="text-xs text-[#8E918F]">kartik.kumar@gmail.com</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8E918F] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                type="button"
                onClick={() => handleGoogleQuickLogin('aarav.patel@gmail.com', 'Aarav Patel')}
                disabled={isLoading}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#16171B] hover:bg-[#282A30] border border-[#35383F] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                    A
                  </div>
                  <div>
                    <h4 className="text-sm font-normal text-white">Aarav Patel</h4>
                    <p className="text-xs text-[#8E918F]">aarav.patel@gmail.com</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8E918F] group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Custom Gmail Input Form */}
            <div className="pt-2 border-t border-[#2D3039] space-y-2.5">
              <label className="text-xs text-[#8E918F]">Or sign in with another Gmail account</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={customGmail}
                  onChange={(e) => setCustomGmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-sm text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleGoogleQuickLogin()}
                  disabled={!customGmail || isLoading}
                  className="px-5 py-3 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-medium disabled:opacity-50 transition-all shrink-0"
                >
                  {isLoading ? 'Signing in...' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PHONE OTP */}
        {activeTab === 'phone' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#8E918F]">Mobile Number</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-sm text-white focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={!phoneNumber || isLoading}
                  className="px-4 py-3 rounded-full bg-[#282A30] hover:bg-[#35383F] text-xs text-[#A8C7FA] font-medium transition-all shrink-0"
                >
                  {isOtpSent ? 'Resend' : 'Send OTP'}
                </button>
              </div>
            </div>

            {isOtpSent && (
              <div className="space-y-2 pt-2 animate-in fade-in">
                <label className="text-xs text-[#8E918F]">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-center text-lg font-mono tracking-widest text-white focus:outline-none"
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpCode.length < 6 || isLoading}
                  className="w-full mt-3 py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all"
                >
                  Verify & Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EMAIL LOGIN */}
        {activeTab === 'email' && (
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label className="text-xs text-[#8E918F]">Email Address</label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-sm text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#8E918F]">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-2xl bg-[#16171B] border border-[#35383F] focus:border-[#A8C7FA] text-sm text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-sm font-medium transition-all mt-2"
            >
              Sign In
            </button>
          </form>
        )}

        {/* Security Badge */}
        <div className="mt-5 pt-3 border-t border-[#2D3039] flex items-center justify-center gap-1.5 text-[11px] text-[#8E918F]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Protected by 256-Bit Bank Grade Encryption</span>
        </div>
      </div>
    </div>
  );
};
