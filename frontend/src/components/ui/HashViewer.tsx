'use client';

import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface HashViewerProps {
  hash: string;
  truncate?: boolean;
  startChars?: number;
  endChars?: number;
  showCopy?: boolean;
  showExplorerLink?: boolean;
  explorerPath?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export default function HashViewer({
  hash,
  truncate = true,
  startChars = 6,
  endChars = 4,
  showCopy = true,
  showExplorerLink = false,
  explorerPath,
  className = '',
  size = 'md',
}: HashViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!hash) return <span className="text-slate-400 font-mono text-xs">--</span>;

  const displayHash =
    truncate && hash.length > startChars + endChars
      ? `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`
      : hash;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const finalExplorerUrl = explorerPath || `/explorer?search=${encodeURIComponent(hash)}`;

  return (
    <div
      className={`inline-flex items-center gap-1.5 font-mono select-all bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 rounded-lg px-2 py-1 ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } text-slate-700 dark:text-slate-300 ${className}`}
    >
      <span title={hash}>{displayHash}</span>

      {showCopy && (
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy hash"
          className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      )}

      {showExplorerLink && (
        <Link
          href={finalExplorerUrl}
          onClick={(e) => e.stopPropagation()}
          title="View on Explorer"
          className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-primary-500 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}
