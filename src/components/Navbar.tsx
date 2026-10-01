'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-2xl transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Brand: Logo + Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 shadow-sm overflow-hidden p-1.5 transition-transform hover:scale-105">
            <img src="/icon.svg" alt="ICPC Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white select-none">
              Crab&apos;s ICPC generator
            </span>
            <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-200/60 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20">
              PRO
            </span>
          </div>
        </div>

        {/* Right Corner: Light / Dark Mode Toggle */}
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.9, rotate: 15 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-pink-400 hover:border-indigo-300 dark:hover:border-pink-500/40 transition shadow-sm cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-pink-400" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
          </motion.button>
        </div>
      </div>
    </header>
  );
};
