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
    <header className="sticky top-0 z-40 w-full border-b border-indigo-200/70 dark:border-pink-500/30 bg-white/80 dark:bg-black/80 backdrop-blur-2xl transition-colors">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Brand: Title ONLY (no logo icon, no PRO badge) */}
        <div className="flex items-center">
          <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white select-none">
            Crab&apos;s ICPC generator
          </span>
        </div>

        {/* Right Corner: Light / Dark Mode Toggle with Neon Border Glow */}
        <div className="flex items-center">
          <motion.button
            whileTap={{ scale: 0.9, rotate: 15 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-300/80 dark:border-pink-500/50 shadow-[0_0_10px_rgba(99,102,241,0.15)] dark:shadow-[0_0_12px_rgba(244,63,94,0.25)] bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 hover:border-indigo-500 hover:shadow-[0_0_14px_rgba(99,102,241,0.5)] dark:hover:border-pink-500 dark:hover:shadow-[0_0_16px_rgba(244,63,94,0.6)] transition cursor-pointer"
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
