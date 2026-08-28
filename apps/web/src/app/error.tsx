'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-full bg-red-950/60 border border-red-500/30 flex items-center justify-center text-2xl font-bold text-red-400">
        !
      </div>
      <h1 className="text-xl font-normal text-white">Something went wrong</h1>
      <p className="text-xs text-[#8E918F] max-w-xs">
        {error.message || 'An unexpected error occurred in the payment terminal.'}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-full bg-[#1E1F24] border border-[#444746] text-[#A8C7FA] text-xs font-medium"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-medium"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
