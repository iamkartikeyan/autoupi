'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Phone,
  ArrowRight,
  Shield,
  Zap,
  Lock,
  ChevronLeft,
  KeyRound,
  CheckCircle2,
  Sparkles,
  Info,
} from 'lucide-react';
import { authApi, saveAuthData, isAuthenticated } from '@/lib/api';
import BrandLogo from '@/components/ui/BrandLogo';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ThemeToggle from '@/components/ui/ThemeToggle';

const DEMO_USER = {
  phone: '+911234567890',
  email: 'demo@autoupi.com',
  name: 'Demo User',
  otp: '123456',
};

export default function LoginPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      router.replace('/dashboard');
    }
  }, [router]);

  useEffect(() => {
    if (timer > 0) {
      const id = setTimeout(() => setTimer((t) => t - 1), 1000);
      return () => clearTimeout(id);
    }
  }, [timer]);

  // Request OTP
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      return toast.error('Please enter a valid 10-digit mobile number');
    }

    setLoading(true);
    try {
      await authApi.requestOTP(phone, email || `${phone}@autoupi.demo`);
      setStep('otp');
      setTimer(45);
      toast.success('OTP sent! Use demo OTP 123456');
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP Input Box changes
  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val.slice(-1);
    setOtp(newOtp);

    // Auto-advance
    if (val && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Handle OTP Backspace
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP Paste
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < pasted.length; i++) {
      newOtp[i] = pasted[i];
    }
    setOtp(newOtp);
    if (pasted.length === 6) {
      handleVerifyOTP(pasted);
    }
  };

  // Verify OTP & Login
  const handleVerifyOTP = async (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length < 6) {
      return toast.error('Please enter all 6 digits of your OTP');
    }

    setLoading(true);
    try {
      const res = await authApi.verifyOTP(
        phone,
        email || `${phone.replace('+', '')}@autoupi.demo`,
        fullName || 'Demo User',
        code
      );
      const { token, user } = res.data.data;
      saveAuthData(token, user);
      toast.success(`Welcome back, ${user.full_name?.split(' ')[0] || 'User'}! ⚡`);
      router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Invalid OTP code. Try 123456 in Demo mode.');
      setLoading(false);
    }
  };

  // Fill Demo
  const fillDemoData = () => {
    setPhone(DEMO_USER.phone);
    setEmail(DEMO_USER.email);
    setFullName(DEMO_USER.name);
    toast.success('Filled Demo credentials! Click Continue.');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F8FAFC] dark:bg-[#0B0F19] p-4 sm:p-6 transition-colors duration-200">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={() => (step === 'otp' ? setStep('phone') : router.push('/'))}
          className="p-2 rounded-xl bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] text-slate-700 dark:text-slate-200 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <BrandLogo size={32} />

        <ThemeToggle size="sm" />
      </div>

      {/* Main Form Container */}
      <div className="max-w-md w-full mx-auto my-auto py-6 space-y-6">
        <Card variant="elevated" padding="lg" className="border-slate-200/80 dark:border-white/10 shadow-2xl">
          <AnimatePresence mode="wait">
            {step === 'phone' ? (
              <motion.div
                key="phone-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Title */}
                <div className="space-y-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Sign in to AutoUPI
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter your mobile number to receive a secure OTP.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  {/* Phone Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mobile Number
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-xs font-bold text-slate-500">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        inputMode="tel"
                        required
                        value={phone.replace(/^\+91/, '')}
                        onChange={(e) => setPhone(`+91${e.target.value.replace(/\D/g, '')}`)}
                        placeholder="98765 43210"
                        className="input-field pl-16 font-mono text-sm tracking-wider"
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Full Name (Optional) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Name <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="input-field"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    isLoading={loading}
                    className="w-full text-sm font-bold shadow-glow-primary mt-2"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue with OTP
                  </Button>
                </form>

                {/* Demo Credentials Helper */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 text-center">
                  <button
                    type="button"
                    onClick={fillDemoData}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Click here to fill Demo Account (+911234567890)</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Title */}
                <div className="space-y-1 text-center sm:text-left">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                    Verify Security Code
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    We sent a 6-digit OTP to <span className="font-bold text-slate-800 dark:text-slate-200">{phone}</span>
                  </p>
                </div>

                {/* 6 Digit OTP Inputs */}
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-14 text-center text-xl font-mono font-black rounded-xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
                    />
                  ))}
                </div>

                {/* Verify Button */}
                <Button
                  type="button"
                  size="lg"
                  isLoading={loading}
                  onClick={() => handleVerifyOTP()}
                  className="w-full text-sm font-bold shadow-glow-primary"
                >
                  Verify & Enter Dashboard
                </Button>

                {/* Resend & Demo OTP note */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-500 dark:text-slate-400">
                    Demo OTP: <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">123456</span>
                  </span>

                  {timer > 0 ? (
                    <span className="text-slate-400 font-mono">Resend in {timer}s</span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleRequestOTP}
                      className="text-primary-600 dark:text-primary-400 font-bold hover:underline"
                    >
                      Resend Code
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Security Assurance */}
        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium text-center">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bank-Grade 256-Bit TLS</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-primary-500" />
            <span>Zero Password Leak Risk</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center text-[11px] text-slate-400 max-w-sm mx-auto">
        By continuing, you agree to AutoUPI's{' '}
        <button onClick={() => router.push('/terms')} className="underline hover:text-slate-700 dark:hover:text-white">
          Terms of Service
        </button>{' '}
        and{' '}
        <button onClick={() => router.push('/privacy-policy')} className="underline hover:text-slate-700 dark:hover:text-white">
          Privacy Policy
        </button>.
      </div>
    </div>
  );
}
