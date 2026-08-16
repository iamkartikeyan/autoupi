'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export default function ThemeToggle({ className = '', size = 'md' }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex items-center justify-center rounded-xl transition-colors duration-200 
        bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] 
        text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10
        ${size === 'sm' ? 'w-8 h-8' : 'w-9 h-9'} ${className}`}
    >
      <motion.div
        key={resolvedTheme}
        initial={{ rotate: -45, scale: 0.5, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        exit={{ rotate: 45, scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun className={size === 'sm' ? 'w-4 h-4 text-amber-400' : 'w-4 h-4 text-amber-400'} />
        ) : (
          <Moon className={size === 'sm' ? 'w-4 h-4 text-slate-700' : 'w-4 h-4 text-slate-700'} />
        )}
      </motion.div>
    </button>
  );
}
