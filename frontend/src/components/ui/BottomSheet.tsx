'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string;
  showCloseButton?: boolean;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = 'max-h-[85vh]',
  showCloseButton = true,
}: BottomSheetProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet Container */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-lg bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-white/10 rounded-t-3xl shadow-2xl overflow-hidden flex flex-col z-10 ${maxHeight} safe-bottom`}
          >
            {/* Grab Handle */}
            <div className="w-full flex items-center justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1.2 rounded-full bg-slate-300 dark:bg-white/20" />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="px-5 py-3 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
                {title ? (
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{title}</h3>
                ) : (
                  <div />
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close sheet"
                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Content with auto-scroll */}
            <div className="p-5 overflow-y-auto overflow-x-hidden flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
