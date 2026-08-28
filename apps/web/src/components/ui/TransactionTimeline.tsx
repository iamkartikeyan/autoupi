'use client';

import React from 'react';
import { PaymentTransaction, PaymentStatus } from '@auto-upi/shared';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  ArrowRight, 
  Banknote,
  Cpu,
  UserCheck,
  Building
} from 'lucide-react';

interface TransactionTimelineProps {
  transaction: PaymentTransaction;
}

const TIMELINE_STAGES: { key: PaymentStatus; title: string; subtitle: string; icon: any }[] = [
  {
    key: 'INITIATED',
    title: 'Payment Initiated',
    subtitle: 'Authorized securely via UPI PIN / 2FA',
    icon: CheckCircle2,
  },
  {
    key: 'KYC_CHECK',
    title: 'Security Verified',
    subtitle: 'Account identity verification verified',
    icon: UserCheck,
  },
  {
    key: 'AML_CHECK',
    title: 'Compliance Cleared',
    subtitle: 'Real-time AML & fraud check passed',
    icon: ShieldCheck,
  },
  {
    key: 'RESERVE_LOCKED',
    title: 'Bank Funds Reserved',
    subtitle: 'Authorized at partner bank source account',
    icon: Building,
  },
  {
    key: 'FX_LOCKED',
    title: 'FX Rate Guaranteed',
    subtitle: 'Mid-market interbank conversion locked with zero slippage',
    icon: Sparkles,
  },
  {
    key: 'LOCAL_SETTLEMENT',
    title: 'Domestic Rail Payout',
    subtitle: 'Dispatched to destination domestic clearing rail (NPCI UPI / FPS)',
    icon: ArrowRight,
  },
  {
    key: 'RECIPIENT_CREDITED',
    title: 'Recipient Credited',
    subtitle: 'Instant credit completed to destination account',
    icon: Banknote,
  },
];

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ transaction }) => {
  const getStageStatus = (stageKey: PaymentStatus, index: number) => {
    if (transaction.status === 'COMPLETED' || transaction.status === 'RECIPIENT_CREDITED') {
      return 'completed';
    }

    const recorded = transaction.timeline?.find((s) => s.step === stageKey);
    if (recorded?.isCompleted) return 'completed';
    if (transaction.status === stageKey) return 'active';

    const stageOrder: PaymentStatus[] = [
      'INITIATED',
      'AUTHENTICATING',
      'KYC_CHECK',
      'AML_CHECK',
      'BANK_AUTHORIZED',
      'RESERVE_LOCKED',
      'TOKEN_MINTING',
      'TOKEN_MINTED',
      'BLOCKCHAIN_SETTLEMENT',
      'BLOCKCHAIN_SETTLED',
      'FX_LOCKED',
      'FX_CONVERTED',
      'LOCAL_SETTLEMENT',
      'RECIPIENT_CREDITED',
      'COMPLETED',
    ];

    const currentOrderIdx = stageOrder.indexOf(transaction.status);
    const stageOrderIdx = stageOrder.indexOf(stageKey);

    if (currentOrderIdx >= stageOrderIdx && currentOrderIdx >= 0) {
      return 'completed';
    }

    return 'pending';
  };

  return (
    <div className="relative pl-6 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-highlight">
      {TIMELINE_STAGES.map((stage, index) => {
        const status = getStageStatus(stage.key, index);
        const recordedStep = transaction.timeline?.find((s) => s.step === stage.key);
        const isCurrentActive = status === 'active';

        return (
          <div key={stage.key} className="relative group">
            {/* Step indicator dot / icon */}
            <div
              className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center -translate-x-1/2 transition-all duration-300 ${
                status === 'completed'
                  ? 'bg-emerald-500 text-black shadow-glow-emerald'
                  : isCurrentActive
                  ? 'bg-white text-black ring-4 ring-white/20 shadow-md animate-pulse'
                  : 'bg-surface-elevated text-gray-500 border border-surface-highlight'
              }`}
            >
              {status === 'completed' ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : isCurrentActive ? (
                <span className="text-xs font-bold">●</span>
              ) : (
                <span className="text-xs">○</span>
              )}
            </div>

            {/* Step content card */}
            <div
              className={`p-3 rounded-2xl border transition-all duration-200 ${
                isCurrentActive
                  ? 'bg-surface-elevated border-white/40 shadow-md'
                  : status === 'completed'
                  ? 'bg-surface/80 border-surface-highlight/60'
                  : 'bg-surface-subtle/40 border-surface-highlight/30 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4
                    className={`text-xs font-bold ${
                      status === 'completed'
                        ? 'text-emerald-300'
                        : isCurrentActive
                        ? 'text-white font-extrabold'
                        : 'text-gray-400'
                    }`}
                  >
                    {recordedStep?.title || stage.title}
                  </h4>
                  <p className="text-[11px] text-gray-300 mt-0.5 leading-relaxed">
                    {recordedStep?.description || stage.subtitle}
                  </p>
                </div>

                {recordedStep?.timestamp && (
                  <span className="text-[10px] text-gray-400 font-mono shrink-0">
                    {new Date(recordedStep.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                )}
              </div>

              {/* On-chain settlement transaction hash badge */}
              {recordedStep?.txHash && (
                <div className="mt-2 pt-1.5 border-t border-surface-highlight/50 flex items-center justify-between text-[10px] font-mono text-zinc-300">
                  <span className="truncate max-w-[200px]">
                    Tx: {recordedStep.txHash}
                  </span>
                  <span className="text-zinc-200 font-semibold">Block Confirmed</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
