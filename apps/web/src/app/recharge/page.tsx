'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '../../context/ToastContext';
import { usePayment } from '../../context/PaymentContext';
import { useAuth } from '../../context/AuthContext';
import {
  ChevronLeft,
  MoreVertical,
  Search,
  User,
  ChevronDown,
  ChevronRight,
  X,
  Zap,
  Wifi,
  Phone,
  Tv,
  CreditCard,
  Radio,
  Gift,
  Building2,
  Smartphone
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type Screen = 'MAIN' | 'PLANS';

interface Operator {
  id: string;
  name: string;
  color: string;
  textColor: string;
  initial: string;
}

interface Plan {
  id: string;
  price: number;
  data: string;
  validity: string;
  calls: string;
  label?: string;
  otts?: string[];
  category: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────
const OPERATORS: Operator[] = [
  { id: 'jio', name: 'Jio Prepaid', color: '#1565C0', textColor: 'white', initial: 'J' },
  { id: 'airtel', name: 'Airtel Prepaid', color: '#E53935', textColor: 'white', initial: 'A' },
  { id: 'vi', name: 'Vi Prepaid', color: '#7B1FA2', textColor: 'white', initial: 'V' },
  { id: 'bsnl', name: 'BSNL Prepaid', color: '#2E7D32', textColor: 'white', initial: 'B' },
];

const JIO_PLANS: Plan[] = [
  { id: 'p1', price: 19, data: '1 GB', validity: '1 day', calls: 'Unlimited', label: 'Suggested for you', category: 'Popular' },
  { id: 'p2', price: 199, data: '1.5 GB/day', validity: '28 days', calls: 'Unlimited', category: 'Popular' },
  { id: 'p3', price: 299, data: '2 GB/day', validity: '28 days', calls: 'Unlimited', otts: ['JioCinema', 'JioTV'], category: 'Popular' },
  { id: 'p4', price: 479, data: '2 GB/day', validity: '56 days', calls: 'Unlimited', otts: ['Disney+', 'JioCinema'], category: 'True 5G unlimited' },
  { id: 'p5', price: 719, data: '2 GB/day', validity: '84 days', calls: 'Unlimited', otts: ['Disney+', 'JioCinema', 'SonyLIV'], category: 'True 5G unlimited' },
  { id: 'p6', price: 149, data: 'Unlimited 5G+\n30 GB', validity: '28 days', calls: 'NA', category: 'Cricket/data' },
  { id: 'p7', price: 200, data: 'Unlimited 5G+\n30 GB', validity: '28 days', calls: 'NA', otts: ['JioHotstar', '+8 more'], category: 'Popular', label: '15 OTT Apps & 100...' },
];

const PAYMENT_CATEGORIES = [
  { id: 'recharge', label: 'Mobile recharge', icon: Smartphone, color: '#1E2D3D' },
  { id: 'electricity', label: 'Electricity', icon: Zap, color: '#1E2D3D' },
  { id: 'dth', label: 'DTH / Cable TV', icon: Tv, color: '#1E2D3D' },
  { id: 'fastag', label: 'FASTag recharge', icon: Radio, color: '#1E2D3D' },
  { id: 'credit', label: 'Credit cards', icon: CreditCard, color: '#1E2D3D' },
  { id: 'gas', label: 'Gas cylinder booking', icon: Building2, color: '#1E2D3D' },
  { id: 'broadband', label: 'Broadband / Landline', icon: Wifi, color: '#1E2D3D' },
  { id: 'postpaid', label: 'Postpaid mobile', icon: Phone, color: '#1E2D3D' },
  { id: 'gift', label: 'Gift cards', icon: Gift, color: '#1E2D3D', badge: 'Offers' },
];

const MY_RECHARGES = [
  { id: 'r1', name: 'Sachin Kumar', phone: '+91 70111 86944', operator: 'jio', operatorColor: '#2E7D32', initial: 'S', suggested: true, suggestedPlan: '1GB for ₹19' },
  { id: 'r2', name: 'Jio Prepaid 6321', phone: '+91 77039 16321', operator: 'jio', operatorColor: '#1565C0', initial: 'J', suggested: true, suggestedPlan: '1GB for ₹19' },
  { id: 'r3', name: 'Jio Prepaid 0648', phone: '+91 96502 40648', operator: 'jio', operatorColor: '#1565C0', initial: 'J', suggested: false, suggestedPlan: '' },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function RechargePage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { receivePaymentToQr } = usePayment();
  const { user } = useAuth();

  const [screen, setScreen] = useState<Screen>('MAIN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedOperator, setSelectedOperator] = useState<Operator>(OPERATORS[0]);
  const [selectedPlanCategory, setSelectedPlanCategory] = useState('Popular');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredPlans = JIO_PLANS.filter(
    (p) =>
      p.category === selectedPlanCategory &&
      (searchQuery === '' ||
        p.price.toString().includes(searchQuery) ||
        p.data.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectRecharge = (phone: string, operator: Operator) => {
    setPhoneNumber(phone.replace(/\D/g, '').slice(-10));
    setSelectedOperator(operator);
    setScreen('PLANS');
  };

  const handleRechargeNow = async (plan: Plan) => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      await receivePaymentToQr(plan.price, `Mobile Recharge - ${selectedOperator.name}`, 'recharge@upi');
      showToast(
        'Recharge Successful! 🎉',
        `₹${plan.price} recharge for ${phoneNumber || '77039 16321'} (${selectedOperator.name}) — ${plan.data} for ${plan.validity}`,
        'success'
      );
      router.push('/');
    } catch {
      showToast('Recharge Failed', 'Please try again', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── MAIN SCREEN ──────────────────────────────────────────────────────────
  if (screen === 'MAIN') {
    return (
      <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] pb-24 select-none">
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 pt-12 pb-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-lg font-normal text-white">Mobile recharge</h1>
          </div>
          <button className="p-2 rounded-full hover:bg-white/10 text-[#C4C7C5] transition-colors">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        <div className="max-w-lg mx-auto px-4 space-y-6">
          {/* Enter Mobile Number */}
          <div className="space-y-2">
            <h2 className="text-base font-normal text-white">Enter mobile number</h2>
            <div className="flex items-center gap-3 border border-[#444746] focus-within:border-[#A8C7FA] rounded-2xl px-4 py-3 bg-transparent transition-colors">
              <span className="text-base shrink-0">🇮🇳</span>
              <span className="text-sm text-[#C4C7C5] shrink-0">+91</span>
              <input
                type="tel"
                maxLength={10}
                placeholder="00000 00000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 bg-transparent text-base text-white placeholder-[#8E918F] focus:outline-none font-mono tracking-wider"
              />
              <button className="text-[#8E918F] hover:text-white transition-colors shrink-0">
                <User className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#8E918F] px-1">Ensure this is a valid mobile number</p>

            {phoneNumber.length === 10 && (
              <button
                onClick={() => setScreen('PLANS')}
                className="w-full py-3.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-semibold text-sm transition-all mt-2"
              >
                View Plans for +91 {phoneNumber}
              </button>
            )}
          </div>

          {/* My Recharges */}
          <div className="space-y-2">
            <h2 className="text-base font-normal text-white">My recharges</h2>
            <div className="space-y-1">
              {MY_RECHARGES.map((r) => {
                const op = OPERATORS.find((o) => o.id === r.operator) || OPERATORS[0];
                return (
                  <div
                    key={r.id}
                    className="flex items-center gap-3 py-3 px-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => handleSelectRecharge(r.phone, op)}
                  >
                    {/* Avatar with operator badge */}
                    <div className="relative shrink-0">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white font-medium text-base shadow-sm"
                        style={{ backgroundColor: r.operatorColor }}
                      >
                        {r.initial}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#1565C0] border-2 border-[#0E0F12] flex items-center justify-center text-white text-[8px] font-bold">
                        J
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-normal text-white">{r.name}</p>
                      <p className="text-xs text-[#8E918F]">{r.phone}</p>
                      {r.suggested && (
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-[#0B57D0]/30 text-[#A8C7FA] text-[10px] font-medium">
                          Suggested
                        </span>
                      )}
                    </div>

                    {r.suggestedPlan && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRecharge(r.phone, op);
                        }}
                        className="px-4 py-2 rounded-full border border-[#444746] text-white text-xs font-medium hover:bg-[#1E1F24] transition-colors shrink-0"
                      >
                        {r.suggestedPlan}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Operators */}
          <div className="space-y-2">
            <h2 className="text-base font-normal text-white">Mobile operators</h2>
            <div className="space-y-1">
              {OPERATORS.map((op) => (
                <div
                  key={op.id}
                  onClick={() => {
                    setSelectedOperator(op);
                    setScreen('PLANS');
                  }}
                  className="flex items-center gap-4 py-3 px-2 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
                    style={{ backgroundColor: op.color }}
                  >
                    {op.initial}
                  </div>
                  <span className="text-sm font-normal text-white">{op.name}</span>
                  <ChevronRight className="w-4 h-4 text-[#8E918F] ml-auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Categories Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-normal text-white">Payment categories</h2>
              <button className="text-xs font-medium text-[#A8C7FA] flex items-center gap-0.5">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      if (cat.id === 'recharge') return;
                      showToast(cat.label, `${cat.label} payment coming soon`, 'info');
                    }}
                    className="relative flex flex-col items-center justify-center gap-2 p-3 rounded-[18px] bg-[#1A1B1F] hover:bg-[#232428] border border-[#2D3039] cursor-pointer transition-colors aspect-square"
                  >
                    {cat.badge && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white leading-tight">
                        {cat.badge}
                      </span>
                    )}
                    <Icon className="w-6 h-6 text-[#C4C7C5]" />
                    <span className="text-[11px] font-normal text-[#C4C7C5] text-center leading-tight">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Suggestions */}
          <div className="space-y-3 pb-4">
            <h2 className="text-base font-normal text-white">Suggestions for you</h2>
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {[
                { name: 'JioHotstar', color: '#7B1FA2' },
                { name: 'Airtel Xstream', color: '#E53935' },
                { name: 'Vi Movies', color: '#7B1FA2' },
              ].map((s) => (
                <div
                  key={s.name}
                  onClick={() => showToast(s.name, `${s.name} subscription plans available`, 'info')}
                  className="flex flex-col items-center gap-2 shrink-0 cursor-pointer"
                >
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: s.color }}
                  >
                    <span className="text-white text-xs font-bold text-center px-1">{s.name.slice(0, 3)}</span>
                  </div>
                  <span className="text-xs text-[#C4C7C5] text-center max-w-[64px] truncate">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── PLANS SCREEN ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] pb-24 select-none flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 pt-12 pb-3 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreen('MAIN')}
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm shrink-0"
              style={{ backgroundColor: selectedOperator.color }}
            >
              {selectedOperator.initial}
            </div>
            <span className="text-base font-normal text-white">{selectedOperator.name}</span>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-white/10 text-[#C4C7C5] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* User Number Row */}
      <div className="px-4 mb-3 shrink-0">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1E1F24] border border-[#35383F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2E7D32] flex items-center justify-center text-white font-medium shrink-0">
              {user?.name?.charAt(0) || 'K'}
            </div>
            <div>
              <p className="text-sm font-normal text-white">{user?.name || 'kartikeyan sahani'}</p>
              <p className="text-xs text-[#E53935] font-medium">Plan validity has expired, recharge now</p>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-[#C4C7C5]" />
        </div>
      </div>

      {/* Suggested Plan Banner */}
      <div className="px-4 mb-3 shrink-0">
        <div className="rounded-[24px] bg-[#0B57D0] overflow-hidden">
          {/* Illustration area */}
          <div className="relative bg-gradient-to-br from-[#1565C0] to-[#0B57D0] h-28 flex items-center justify-center">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#F9A825] flex items-center justify-center text-2xl shadow-lg">🍔</div>
              <div className="w-16 h-16 rounded-2xl bg-[#2E7D32] flex items-center justify-center text-2xl shadow-lg">🎵</div>
              <div className="w-14 h-14 rounded-2xl bg-[#C62828] flex items-center justify-center text-2xl shadow-lg">🎬</div>
            </div>
          </div>

          <div className="px-4 py-3 bg-[#1A1A2E]">
            <p className="text-base font-semibold text-white">1GB data for ₹19</p>
            <p className="text-sm text-[#C4C7C5]">Validity: 1 day</p>
            <p className="text-xs text-[#8E918F] mt-0.5">Suggested for you</p>
            <button
              onClick={() => handleRechargeNow(JIO_PLANS[0])}
              disabled={isProcessing}
              className="mt-3 mb-1 w-full py-2.5 rounded-full bg-[#0B57D0] hover:bg-[#1A73E8] border border-[#4A90D9] text-white font-medium text-sm transition-all"
            >
              {isProcessing ? 'Processing...' : 'Get extra data'}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-3 shrink-0">
        <div className="flex items-center gap-3 bg-[#1E1F24] border border-[#35383F] rounded-full px-4 py-2.5">
          <Search className="w-4 h-4 text-[#8E918F] shrink-0" />
          <input
            type="text"
            placeholder="Search for a plan or enter amount"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-white placeholder-[#8E918F] focus:outline-none"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#8E918F]">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="shrink-0 px-4">
        <div className="flex overflow-x-auto gap-1 no-scrollbar border-b border-[#23252B]">
          {['Popular', 'True 5G unlimited', 'Cricket/data', 'Jio extras', 'Validity'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedPlanCategory(cat)}
              className={`shrink-0 pb-2.5 px-3 text-sm font-medium relative transition-colors whitespace-nowrap ${
                selectedPlanCategory === cat ? 'text-white' : 'text-[#8E918F] hover:text-[#C4C7C5]'
              }`}
            >
              {cat}
              {selectedPlanCategory === cat && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Plans List */}
      <div className="flex-1 overflow-y-auto px-4 pt-3 space-y-3 pb-4">
        {(filteredPlans.length > 0 ? filteredPlans : JIO_PLANS.slice(1, 5)).map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleRechargeNow(plan)}
            className="flex items-start justify-between p-4 rounded-[20px] bg-[#1E1F24] border border-[#35383F] hover:bg-[#282A30] hover:border-[#A8C7FA]/40 transition-all cursor-pointer group"
          >
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-normal text-white">₹{plan.price}</span>
                {plan.label && (
                  <span className="text-[10px] text-[#8E918F] truncate">{plan.label}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs">
                <span className="text-[#8E918F]">Data</span>
                <span className="text-white font-medium">{plan.data}</span>
                <span className="text-[#8E918F]">Validity</span>
                <span className="text-white font-medium">{plan.validity}</span>
                {plan.calls !== 'NA' && (
                  <>
                    <span className="text-[#8E918F]">Calls</span>
                    <span className="text-white font-medium">{plan.calls}</span>
                  </>
                )}
              </div>
              {plan.otts && (
                <div className="flex items-center gap-1 pt-1">
                  {plan.otts.slice(0, 3).map((ott) => (
                    <span
                      key={ott}
                      className="text-[10px] text-[#8E918F] bg-[#16171B] border border-[#2D3039] px-2 py-0.5 rounded-full"
                    >
                      {ott}
                    </span>
                  ))}
                  {plan.otts.length > 3 && (
                    <span className="text-[10px] text-[#8E918F]">+{plan.otts.length - 3}</span>
                  )}
                </div>
              )}
            </div>

            <div className="shrink-0 ml-3 w-10 h-10 rounded-full bg-[#282A30] group-hover:bg-[#A8C7FA]/20 border border-[#35383F] flex items-center justify-center transition-colors">
              <ChevronRight className="w-5 h-5 text-[#8E918F] group-hover:text-[#A8C7FA]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
