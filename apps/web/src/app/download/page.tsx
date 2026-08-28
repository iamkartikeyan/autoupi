'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Download, 
  Smartphone, 
  Apple, 
  QrCode, 
  CheckCircle2, 
  Share2, 
  ExternalLink, 
  ChevronLeft,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { RealQRCode } from '../../components/ui/RealQRCode';

export default function DownloadPage() {
  const router = useRouter();
  const [activePlatform, setActivePlatform] = useState<'all' | 'ios' | 'android'>('all');

  const appUrl = 'https://tbd-teal-eta.vercel.app';

  return (
    <div className="min-h-screen bg-[#0E0F12] text-[#E3E3E3] px-4 py-4 max-w-lg mx-auto space-y-6 select-none">
      {/* Top Bar */}
      <header className="flex items-center justify-between pb-3 border-b border-[#23252B]">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-normal text-white">Download Auto-UPI App</h1>
        </div>
      </header>

      {/* Hero Badge */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-16 h-16 rounded-[24px] bg-[#1E1F24] border border-[#35383F] mx-auto flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-9 h-9">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-white">Auto-UPI for Mobile</h2>
        <p className="text-xs text-[#8E918F]">Free 1-Tap Direct Install for Apple iOS & Android</p>
      </div>

      {/* QR Code Section for Camera Scan */}
      <div className="bg-[#1E1F24] border border-[#35383F] rounded-[32px] p-6 text-center shadow-xl space-y-4">
        <span className="text-xs font-semibold text-[#A8C7FA] uppercase tracking-wider">Scan to Install on Phone</span>
        
        <div className="flex justify-center py-2">
          <div className="p-4 bg-white rounded-3xl shadow-md inline-block">
            <RealQRCode 
              value={appUrl} 
              size={180} 
              logo={true}
            />
          </div>
        </div>

        <p className="text-xs text-[#8E918F]">
          Point your iPhone Camera or Android Scanner at this QR code to instantly install the app on your phone.
        </p>

        {/* Direct Link Button */}
        <a
          href={appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-4 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
        >
          <ExternalLink className="w-4 h-4" />
          <span>Direct App URL ({appUrl})</span>
        </a>
      </div>

      {/* Platform Tabs */}
      <div className="flex border-b border-[#2D3039]">
        <button
          onClick={() => setActivePlatform('all')}
          className={`flex-1 pb-2.5 text-xs font-medium relative ${
            activePlatform === 'all' ? 'text-white' : 'text-[#8E918F]'
          }`}
        >
          All Platforms
          {activePlatform === 'all' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
        </button>

        <button
          onClick={() => setActivePlatform('ios')}
          className={`flex-1 pb-2.5 text-xs font-medium relative ${
            activePlatform === 'ios' ? 'text-white' : 'text-[#8E918F]'
          }`}
        >
          iPhone (iOS)
          {activePlatform === 'ios' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
        </button>

        <button
          onClick={() => setActivePlatform('android')}
          className={`flex-1 pb-2.5 text-xs font-medium relative ${
            activePlatform === 'android' ? 'text-white' : 'text-[#8E918F]'
          }`}
        >
          Android
          {activePlatform === 'android' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-white" />}
        </button>
      </div>

      {/* Instruction Guides */}
      {(activePlatform === 'all' || activePlatform === 'ios') && (
        <div className="bg-[#16171B] border border-[#2D3039] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <span className="text-lg">🍏</span>
            <span>Apple iPhone / iPad Installation:</span>
          </div>
          <ol className="text-xs text-[#8E918F] space-y-2 list-decimal list-inside leading-relaxed">
            <li>Open Safari browser and navigate to <strong className="text-white">{appUrl}</strong></li>
            <li>Tap the <strong className="text-white">Share button [ ⎋ ]</strong> at the bottom of Safari</li>
            <li>Scroll down and tap <strong className="text-white">"Add to Home Screen" [ ⊞ ]</strong></li>
            <li>Tap <strong className="text-white">Add</strong> on top right</li>
          </ol>
        </div>
      )}

      {(activePlatform === 'all' || activePlatform === 'android') && (
        <div className="bg-[#16171B] border border-[#2D3039] rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2 text-white font-medium text-sm">
            <span className="text-lg">🤖</span>
            <span>Android Phone Installation:</span>
          </div>
          <ol className="text-xs text-[#8E918F] space-y-2 list-decimal list-inside leading-relaxed">
            <li>Open Chrome browser and navigate to <strong className="text-white">{appUrl}</strong></li>
            <li>Tap the bottom banner <strong className="text-white">"Install Auto-UPI App"</strong></li>
            <li>Or tap the Chrome menu (⋮) and choose <strong className="text-white">"Install app"</strong></li>
          </ol>
        </div>
      )}

      {/* Security & Features */}
      <div className="p-4 rounded-2xl bg-[#1E1F24]/50 border border-[#2D3039] flex items-center justify-between text-xs text-[#8E918F]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>100% Free • Zero App Store Fees</span>
        </div>
        <div className="flex items-center gap-1.5 text-white font-medium">
          <Zap className="w-3.5 h-3.5 text-[#A8C7FA]" />
          <span>v1.0 Production</span>
        </div>
      </div>
    </div>
  );
}
