'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="w-16 h-16 rounded-full bg-[#1E1F24] border border-[#35383F] flex items-center justify-center text-2xl font-bold text-white">
        404
      </div>
      <h1 className="text-xl font-normal text-white">Page not found</h1>
      <p className="text-xs text-[#8E918F] max-w-xs">
        The payment route or screen you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-medium inline-flex items-center gap-1.5 transition-all"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return Home</span>
      </Link>
    </div>
  );
}
