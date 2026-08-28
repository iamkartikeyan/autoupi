'use client';

import React, { useState } from 'react';
import { PaymentTransaction } from '@auto-upi/shared';
import { 
  X, 
  Copy, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Coins, 
  Terminal,
  Activity
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface BlockchainInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: PaymentTransaction | null;
}

export const BlockchainInspectorModal: React.FC<BlockchainInspectorModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'RAW_DATA' | 'LOGS'>('OVERVIEW');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied', `${label} copied to clipboard`, 'info');
  };

  const settlement = transaction?.blockchainSettlement || {
    tokenSymbol: 'AUST',
    contractAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    tokenAmount: `${transaction?.sourceAmount || 350}.00 AUST`,
    txHash: '0x3c91a8e104f2d7a984bc19d678e0293847f9810427acde84792bce9812401f82',
    blockNumber: 195042,
    network: 'Auto-UPI EVM Testnet (Chain 31337)',
    gasUsed: '42,108 Gas',
    settlementTimestamp: transaction?.settledAt || new Date().toISOString(),
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-surface-elevated border border-surface-highlight rounded-card p-6 shadow-elevated text-white max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-highlight mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-violet/20 border border-brand-violet/40 text-brand-purple flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">EVM Blockchain Inspector</h3>
              <p className="text-[11px] text-gray-400 font-mono">Chain ID: 31337 • Consensus: Immediate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-surface-subtle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex p-1 rounded-xl bg-surface border border-surface-highlight mb-4">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Settlement Overview
          </button>
          <button
            onClick={() => setActiveTab('RAW_DATA')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'RAW_DATA'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Decoded Call Data
          </button>
          <button
            onClick={() => setActiveTab('LOGS')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'LOGS'
                ? 'bg-white text-black shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Event Logs
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 -mr-1 animate-in fade-in">
            {/* Status Pill */}
            <div className="p-3 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">Smart Contract Execution Confirmed</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-semibold">12 Confirmations</span>
            </div>

            {/* Grid Specs */}
            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-surface border border-surface-highlight">
                <span className="text-[10px] text-gray-400 uppercase font-medium">Network</span>
                <p className="font-bold text-white font-mono mt-0.5">{settlement.network}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-surface-highlight">
                <span className="text-[10px] text-gray-400 uppercase font-medium">Block Height</span>
                <p className="font-bold text-zinc-200 font-mono mt-0.5">#{settlement.blockNumber}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-surface-highlight">
                <span className="text-[10px] text-gray-400 uppercase font-medium">Settlement Token</span>
                <p className="font-bold text-white font-mono mt-0.5">{settlement.tokenAmount}</p>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-surface-highlight">
                <span className="text-[10px] text-gray-400 uppercase font-medium">Gas Consumption</span>
                <p className="font-bold text-emerald-400 font-mono mt-0.5">{settlement.gasUsed}</p>
              </div>
            </div>

            {/* Smart Contract Address */}
            <div className="p-3 rounded-xl bg-surface border border-surface-highlight text-xs flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] text-gray-400 uppercase font-medium">Smart Contract Address</span>
                <p className="font-mono text-gray-200 truncate">{settlement.contractAddress}</p>
              </div>
              <button
                onClick={() => copyToClipboard(settlement.contractAddress, 'Contract Address')}
                className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface-highlight text-zinc-300"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Transaction Hash */}
            <div className="p-3 rounded-xl bg-surface border border-surface-highlight text-xs flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] text-gray-400 uppercase font-medium">EVM Transaction Hash</span>
                <p className="font-mono text-zinc-200 truncate">{settlement.txHash}</p>
              </div>
              <button
                onClick={() => copyToClipboard(settlement.txHash, 'Transaction Hash')}
                className="p-1.5 rounded-lg bg-surface-elevated hover:bg-surface-highlight text-zinc-300"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Raw Call Data */}
        {activeTab === 'RAW_DATA' && (
          <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-1 -mr-1 animate-in fade-in">
            <div className="p-3.5 rounded-2xl bg-surface border border-surface-highlight space-y-2">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Method Signature</p>
              <code className="text-emerald-400 text-[11px] block break-all">
                lockReserveAndMint(string reserveLockId, string txReference, string corridor, address settlementPool, uint256 tokenAmount, uint256 sourceAmount, uint256 targetAmount)
              </code>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-surface-highlight space-y-2">
              <p className="text-[10px] text-gray-400 uppercase font-semibold">Input Parameters</p>
              <pre className="text-gray-300 text-[10px] overflow-x-auto whitespace-pre-wrap bg-surface-subtle p-2.5 rounded-xl border border-surface-highlight">
{JSON.stringify(
  {
    txReference: transaction?.referenceNumber || 'UPI-XB-8921820',
    corridor: `${transaction?.sourceCurrency || 'USD'}_${transaction?.targetCurrency || 'INR'}`,
    sourceAmount: transaction?.sourceAmount || 350,
    targetAmount: transaction?.targetAmount || 29225,
    settlementTokenAmount: `${transaction?.sourceAmount || 350} * 10^18`,
    settlementPool: '0xSettlementPool_Corridor_IN',
    timestamp: Math.floor(new Date(settlement.settlementTimestamp).getTime() / 1000),
  },
  null,
  2
)}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 3: Event Logs */}
        {activeTab === 'LOGS' && (
          <div className="flex-1 overflow-y-auto space-y-2 text-xs pr-1 -mr-1 animate-in fade-in font-mono">
            <div className="p-3 rounded-xl bg-surface border border-surface-highlight space-y-1">
              <div className="flex justify-between text-[11px] text-emerald-400 font-bold">
                <span>[Event] TokenMinted</span>
                <span>Block #{settlement.blockNumber - 1}</span>
              </div>
              <p className="text-[10px] text-gray-400 break-all">
                Topic: 0x8f2a947c61d5639e4bf37f90c883e015d9a927c3d18e27c191a84f39b6e82a91
              </p>
              <p className="text-[10px] text-gray-300">Amount: {settlement.tokenAmount} minted for corridor transit</p>
            </div>

            <div className="p-3 rounded-xl bg-surface border border-surface-highlight space-y-1">
              <div className="flex justify-between text-[11px] text-zinc-200 font-bold">
                <span>[Event] SettlementCompleted</span>
                <span>Block #{settlement.blockNumber}</span>
              </div>
              <p className="text-[10px] text-gray-400 break-all">
                Topic: 0x3c91a8e104f2d7a984bc19d678e0293847f9810427acde84792bce9812401f82
              </p>
              <p className="text-[10px] text-gray-300">Amount: {settlement.tokenAmount} burned upon recipient credit</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-surface-highlight flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-surface-elevated hover:bg-surface-highlight text-white text-xs font-semibold border border-surface-highlight"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
