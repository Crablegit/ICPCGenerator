'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RotateCcw, Trash2 } from 'lucide-react';

interface NavbarProps {
  onGenerate: () => void;
  onClearAll: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onGenerate, onClearAll }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl transition-all">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Brand: Clean Apple typography, no book icon */}
        <div className="flex items-center space-x-3">
          <span className="text-lg font-bold tracking-tight text-white select-none">
            Crab&apos;s ICPC generator
          </span>
          <span className="hidden sm:inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-medium text-blue-400 border border-blue-500/20">
            Overleaf Ready
          </span>
        </div>

        {/* Action Controls: Reset & Primary Generate Button */}
        <div className="flex items-center space-x-3">
          {/* Reset / Clear All button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 450, damping: 25 }}
            onClick={onClearAll}
            className="flex items-center space-x-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 px-3.5 py-1.5 text-xs font-medium text-slate-300 transition-colors"
            title="Xóa toàn bộ các file và đặt lại từ đầu"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset All</span>
          </motion.button>

          {/* Primary Generate Button (Apple style spring button) */}
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96, y: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            onClick={onGenerate}
            className="flex items-center space-x-2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Generate Notebook</span>
          </motion.button>
        </div>
      </div>
    </header>
  );
};
