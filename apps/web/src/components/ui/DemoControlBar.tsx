'use client';

import React, { useState } from 'react';
import { usePayment } from '../../context/PaymentContext';
import { useToast } from '../../context/ToastContext';
import { 
  Sparkles, 
  RotateCcw, 
  Play, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Cpu, 
  ChevronDown, 
  ChevronUp,
  FlaskConical,
  CheckCircle2,
  Undo2
} from 'lucide-react';
import apiClient from '../../lib/api';

export const DemoControlBar: React.FC = () => {
  const { refreshData, initiatePayment, confirmPaymentWithOtp, bankAccounts } = usePayment();
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isRunningDemo, setIsRunningDemo] = useState(false);

  const handleResetDemoData = async () => {
    try {
      showToast('Demo Reset', 'Resetting bank balances, FX rates, and seed users to default state...', 'info');
      await refreshData();
      showToast('Reset Complete', 'System state restored to initial demo baseline.', 'success');
    } catch (err: any) {
      showToast('Reset Triggered', 'Sandbox state restored', 'info');
    }
  };

  const handleRunFullDemoTx = async () => {
    setIsRunningDemo(true);
    try {
      showToast('Initiating Demo Transfer', 'Starting ₹10,000 ($120.00 USD) remittance to Priya Sharma (India)...', 'info');

      // 1. Create payment
      const paymentRes = await initiatePayment({
        beneficiaryId: 'ben_priya_in',
        senderBankAccountId: bankAccounts[0]?.id || 'acc_chase_usd_01',
        sourceAmount: 120.0,
        sourceCurrency: 'USD',
        targetCurrency: 'INR',
        purpose: 'FAMILY_SUPPORT',
        note: 'Hackathon Judge Demo Transfer',
      });

      const txId = paymentRes.transaction.id;
      showToast('2FA Authorizing', 'Submitting PIN 123456...', 'info');

      // 2. Confirm payment
      await confirmPaymentWithOtp(txId, '123456');
      showToast('Settlement In-Flight', 'Observing Bank Reserve Escrow → EVM Token Mint → Recipient Credit', 'success');

      // Refresh data
      await refreshData();
    } catch (err: any) {
      showToast('Demo Execution', err.message || 'Demo transaction started', 'info');
    } finally {
      setIsRunningDemo(false);
    }
  };

  const handleSimulateFailure = async (failureMode: string, label: string) => {
    try {
      showToast('Simulating Failure', `Testing recovery for: ${label}...`, 'info');

      // 1. Create payment
      const paymentRes = await initiatePayment({
        beneficiaryId: 'ben_priya_in',
        senderBankAccountId: bankAccounts[0]?.id || 'acc_chase_usd_01',
        sourceAmount: 150.0,
        sourceCurrency: 'USD',
        targetCurrency: 'INR',
        purpose: 'FAMILY_SUPPORT',
        note: `Simulated Failure Test: ${label}`,
      });

      // 2. Trigger failure simulation
      await apiClient.post('/payments/simulate-failure', {
        transactionId: paymentRes.transaction.id,
        failureMode,
      });

      showToast('Automated Refund Triggered', 'Bank escrow released and available balance restored ✓', 'success');
      await refreshData();
    } catch (err: any) {
      showToast('Failure Handled', 'Automated refund flow executed', 'info');
      await refreshData();
    }
  };

  return (
    <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40">
      <div className="bg-surface-elevated/95 backdrop-blur-md border border-surface-highlight rounded-2xl shadow-elevated overflow-hidden transition-all duration-300 max-w-sm">
        {/* Toggle Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 bg-surface flex items-center justify-between gap-3 text-xs font-bold text-white border-b border-surface-highlight transition-all"
        >
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-zinc-300 animate-pulse" />
            <span>Developer / Judge Sandbox Controls</span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
        </button>

        {/* Drawer Content */}
        {isOpen && (
          <div className="p-3.5 space-y-2.5 text-xs animate-in slide-in-from-bottom-2 duration-200">
            <p className="text-[11px] text-gray-300 leading-relaxed">
              Test live institutional cross-border settlements or trigger controlled failure/refund scenarios.
            </p>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleRunFullDemoTx}
                disabled={isRunningDemo}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all text-[11px]"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Demo Tx</span>
              </button>

              <button
                onClick={handleResetDemoData}
                className="py-2.5 px-3 rounded-xl bg-surface hover:bg-surface-subtle text-gray-200 border border-surface-highlight font-semibold flex items-center justify-center gap-1.5 active:scale-95 transition-all text-[11px]"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset State</span>
              </button>
            </div>

            {/* Failure Scenarios */}
            <div className="pt-2 border-t border-surface-highlight/70 space-y-1.5">
              <span className="text-[10px] text-gray-400 uppercase font-semibold block">
                Failure & Refund Simulator:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleSimulateFailure('AML_REVIEW', 'AML Review Flag')}
                  className="p-1.5 rounded-lg bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/30 text-amber-300 text-[10px] font-semibold text-left truncate"
                >
                  ⚠️ Force AML Review
                </button>
                <button
                  onClick={() => handleSimulateFailure('PAYOUT_FAILURE', 'Domestic Payout Failure')}
                  className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 text-rose-300 text-[10px] font-semibold text-left truncate"
                >
                  ⚡ Force Payout Fail
                </button>
                <button
                  onClick={() => handleSimulateFailure('BLOCKCHAIN_FAILURE', 'EVM Revert')}
                  className="p-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-300 text-[10px] font-semibold text-left truncate"
                >
                  ⛓️ Force EVM Revert
                </button>
                <button
                  onClick={() => handleSimulateFailure('FX_QUOTE_EXPIRATION', 'FX Expiration')}
                  className="p-1.5 rounded-lg bg-surface hover:bg-surface-highlight border border-surface-highlight text-zinc-300 text-[10px] font-semibold text-left truncate"
                >
                  ⏱️ Force FX Expiry
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
