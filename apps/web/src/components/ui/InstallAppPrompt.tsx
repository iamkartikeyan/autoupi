'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share2, PlusSquare, Smartphone, CheckCircle2, ChevronRight } from 'lucide-react';

export const InstallAppPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if already installed & opened as standalone app
    const isRunningStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isRunningStandalone) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Capture Android PWA install event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Auto show banner after 2 seconds if not installed
      setTimeout(() => setIsOpen(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If iOS and not standalone, show prompt after 3 seconds
    if (isIosDevice && !isRunningStandalone) {
      const dismissed = localStorage.getItem('pwa_prompt_dismissed');
      if (!dismissed) {
        setTimeout(() => setIsOpen(true), 3000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsOpen(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isStandalone || !isOpen) return null;

  return (
    <>
      {/* Floating Bottom App Installation Bar */}
      <div className="fixed bottom-20 left-4 right-4 z-40 max-w-lg mx-auto bg-[#1E1F24] border border-[#35383F] rounded-[24px] p-3.5 shadow-2xl animate-in slide-in-from-bottom duration-300 flex items-center justify-between text-white">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-11 h-11 rounded-2xl bg-[#0E0F12] border border-[#35383F] flex items-center justify-center text-white shrink-0 overflow-hidden shadow-sm">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-semibold text-white leading-tight">Install Auto-UPI App</h4>
            <p className="text-[11px] text-[#8E918F] truncate">
              {isIOS ? 'Install on iPhone / iPad (Free)' : 'Fast 1-tap install on Android (Free)'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-1.5 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-semibold shadow-sm transition-all"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 text-[#8E918F] hover:text-white rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* iOS Installation Instruction Sheet Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#1E1F24] border-t sm:border border-[#35383F] rounded-t-[32px] sm:rounded-[32px] p-6 text-white shadow-2xl">
            <div className="w-12 h-1 bg-[#444746] rounded-full mx-auto mb-4 sm:hidden" />

            <div className="flex items-center justify-between pb-3 border-b border-[#2D3039]">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-5 h-5 text-[#A8C7FA]" />
                <h3 className="text-base font-normal text-white">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="p-1 text-[#8E918F] hover:text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-[#C4C7C5]">
              <p>Follow these 2 simple steps in Safari to install Auto-UPI as a native app on your home screen:</p>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#16171B] border border-[#2D3039]">
                <div className="w-8 h-8 rounded-full bg-[#004A77] text-[#A8C7FA] flex items-center justify-center shrink-0 font-bold">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Tap the Share Icon</h4>
                  <p className="text-[11px] text-[#8E918F] mt-0.5">
                    Tap the <strong>Share button</strong> <span className="inline-block px-1.5 py-0.5 bg-[#282A30] rounded text-white font-mono">⎋</span> at the bottom bar of Safari.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#16171B] border border-[#2D3039]">
                <div className="w-8 h-8 rounded-full bg-[#004A77] text-[#A8C7FA] flex items-center justify-center shrink-0 font-bold">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Select "Add to Home Screen"</h4>
                  <p className="text-[11px] text-[#8E918F] mt-0.5">
                    Scroll down and tap <strong>Add to Home Screen</strong> <span className="inline-block px-1.5 py-0.5 bg-[#282A30] rounded text-white font-mono">⊞</span>, then tap <strong>Add</strong>.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-3 rounded-full bg-[#A8C7FA] hover:bg-[#C2E7FF] text-[#041E49] text-xs font-semibold transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
