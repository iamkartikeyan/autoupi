'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { io, Socket } from 'socket.io-client';
import {
  CheckCircle2,
  Circle,
  Loader2,
  Shield,
  Lock,
  Database,
  Rocket,
  Bell,
  ChevronDown,
  Terminal,
  Zap,
  Activity,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TokenVisualization from '@/components/features/TokenVisualization';

const STEP_ICONS: Record<string, LucideIcon> = {
  kyc: Shield,
  aml: Shield,
  rate_lock: Lock,
  liquidity: Database,
  settlement: Rocket,
  notify: Bell,
};

interface StepLog {
  step: string;
  status: string;
  message: string;
  timestamp: string;
}

interface StepState {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  latency?: string;
}

const STEPS_META = [
  { id: 'kyc', name: 'Identity & Biometric KYC Verification' },
  { id: 'aml', name: 'Automated AML & Sanctions Compliance' },
  { id: 'rate_lock', name: 'Interbank Exchange Rate Lock (60s)' },
  { id: 'liquidity', name: 'Destination Liquidity Pool Verification' },
  { id: 'settlement', name: 'GIFT City L2 Blockchain Block Mining' },
  { id: 'notify', name: 'Instant Bank Webhook & Recipient Payout' },
];

function ProcessPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const txnId = searchParams.get('id');

  const [steps, setSteps] = useState<StepState[]>(
    STEPS_META.map((s) => ({ ...s, status: 'pending' }))
  );
  const [logs, setLogs] = useState<StepLog[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState<'processing' | 'complete' | 'failed'>('processing');
  const [hash, setHash] = useState('');
  const [showLogs, setShowLogs] = useState(false);

  const logsEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!txnId) {
      router.push('/send');
      return;
    }

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';
    const socket = io(WS_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_transaction', txnId);
      addLog('system', 'INFO', `Connected to AutoUPI settlement network`);
      addLog('system', 'INFO', `Session established for txn: ${txnId.slice(0, 8)}...`);
    });

    socket.on('txn_status', ({ status: s }: { status: string }) => {
      if (s === 'PROCESSING') {
        timerRef.current = setInterval(() => setElapsed((e) => e + 100), 100);
      }
    });

    socket.on('txn_log', (log: StepLog) => {
      addLog(log.step, log.status, log.message);
      updateStepStatus(log.step, log.status);
    });

    socket.on(
      'txn_complete',
      ({ hash: h, timeTaken }: { hash: string; timeTaken: string; status: string }) => {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus('complete');
        setHash(h);
        setSteps((prev) => prev.map((s) => ({ ...s, status: 'done' })));
        addLog('settlement', 'SUCCESS', `Transaction settled on-chain: ${h}`);

        setTimeout(() => {
          router.push(`/success?id=${txnId}&hash=${h}`);
        }, 1200);
      }
    );

    socket.on('txn_failed', ({ error }: { error: string }) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setStatus('failed');
      addLog('error', 'ERROR', `Settlement failed: ${error}`);
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      socket.disconnect();
    };
  }, [txnId, router]);

  const addLog = (step: string, status: string, message: string) => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [...prev, { step, status, message, timestamp }]);
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const updateStepStatus = (stepId: string, logStatus: string) => {
    setSteps((prev) =>
      prev.map((s) => {
        if (s.id === stepId) {
          return {
            ...s,
            status: logStatus === 'SUCCESS' ? 'done' : 'processing',
          };
        }
        return s;
      })
    );
  };

  const completedCount = steps.filter((s) => s.status === 'done').length;
  const progressPercent = Math.min(100, Math.round((completedCount / steps.length) * 100));

  return (
    <AppLayout maxWidth="max-w-4xl" showFooter={false}>
      <div className="space-y-6 py-4">
        {/* Top Progress Bar Card */}
        <Card variant="elevated" padding="md" className="space-y-4 shadow-xl border-primary-500/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-ping" />
                <span>Live 8-Second Settlement Tunnel</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                {status === 'complete'
                  ? 'Settlement Complete! ✅'
                  : status === 'failed'
                  ? 'Settlement Encountered Issue'
                  : 'Executing Cross-Border Settlement...'}
              </h1>
            </div>

            {/* Live Clock Counter */}
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-white/[0.04] px-4 py-2 rounded-2xl border border-slate-200 dark:border-white/10 flex-shrink-0">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Time Elapsed</div>
                <div className="text-xl font-mono font-black text-primary-600 dark:text-primary-400 num">
                  {(elapsed / 1000).toFixed(1)}s
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-primary-600 text-white flex items-center justify-center shadow-glow-primary">
                <Zap className="w-4 h-4 fill-current" />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Pipeline Completion</span>
              <span className="font-mono text-primary-600 dark:text-primary-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary-600 to-emerald-500 rounded-full"
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </Card>

        {/* 6-Stage Timeline Stepper */}
        <Card variant="default" padding="lg" className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Pipeline Verification Stages ({completedCount}/{steps.length})
          </h2>

          <div className="space-y-3">
            {steps.map((step, idx) => {
              const Icon = STEP_ICONS[step.id] || Circle;
              const isDone = step.status === 'done';
              const isProcessing = step.status === 'processing';

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-3 transition-all duration-200 ${
                    isDone
                      ? 'bg-emerald-50/50 dark:bg-emerald-500/[0.04] border-emerald-200 dark:border-emerald-500/20 text-slate-900 dark:text-white'
                      : isProcessing
                      ? 'bg-primary-50/80 dark:bg-primary-500/10 border-primary-300 dark:border-primary-500/40 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-white/[0.01] border-slate-200/60 dark:border-white/5 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        isDone
                          ? 'bg-emerald-500 text-white shadow-glow-success'
                          : isProcessing
                          ? 'bg-primary-600 text-white shadow-glow-primary animate-pulse'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : isProcessing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate">{step.name}</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {isDone ? 'Verified & Locked ✓' : isProcessing ? 'Processing Active...' : 'Waiting in Queue'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                        isDone
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : isProcessing
                          ? 'bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-300 animate-pulse'
                          : 'bg-slate-100 dark:bg-white/5 text-slate-400'
                      }`}
                    >
                      {isDone ? 'Passed' : isProcessing ? 'Running' : 'Standby'}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        {/* Token Visualization Flow */}
        <div className="overflow-hidden">
          <TokenVisualization activeStep={completedCount} />
        </div>

        {/* Collapsible Technical Terminal Logs */}
        <Card variant="default" padding="sm" className="overflow-hidden">
          <button
            type="button"
            onClick={() => setShowLogs(!showLogs)}
            className="w-full flex items-center justify-between p-3 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-primary-500 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary-500" />
              <span>Technical Settlement Console ({logs.length} events recorded)</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showLogs ? 'rotate-180' : ''}`} />
          </button>

          {showLogs && (
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] space-y-1.5 max-h-56 overflow-y-auto terminal-scroll border border-slate-800">
              {logs.map((log, i) => (
                <div key={i} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-500 select-none">[{log.timestamp}]</span>
                  <span
                    className={`font-bold select-none ${
                      log.status === 'SUCCESS'
                        ? 'text-emerald-400'
                        : log.status === 'ERROR'
                        ? 'text-rose-400'
                        : 'text-blue-400'
                    }`}
                  >
                    [{log.status}]
                  </span>
                  <span className="text-slate-300">{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}

export default function ProcessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Connecting...</div>}>
      <ProcessPageInner />
    </Suspense>
  );
}
