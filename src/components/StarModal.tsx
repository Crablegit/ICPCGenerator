'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Github, ExternalLink, Sparkles, X } from 'lucide-react';

interface StarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmOverleaf: () => void;
}

export const StarModal: React.FC<StarModalProps> = ({
  isOpen,
  onClose,
  onConfirmOverleaf,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Scrim with Apple fluid blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Dialog Card with Spring Physics and Neon Border Glow */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 380,
            }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-indigo-400/80 dark:border-pink-500/80 shadow-[0_0_25px_rgba(99,102,241,0.35)] dark:shadow-[0_0_35px_rgba(244,63,94,0.45)] bg-white dark:bg-black/95 p-6 sm:p-8 backdrop-blur-2xl text-slate-900 dark:text-zinc-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white transition active:scale-95"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Glowing Icon Header */}
            <div className="flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0.5, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 300,
                  delay: 0.05,
                }}
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-blue-600 dark:from-pink-500 dark:to-rose-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] dark:shadow-[0_0_25px_rgba(244,63,94,0.6)]"
              >
                <Star className="h-8 w-8 fill-current" />
              </motion.div>

              <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                Give me a star ⭐
              </h3>

              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed max-w-xs mb-6">
                You have successfully generated your ICPC Notebook! If this tool is helpful for you and your team, please consider dropping a star on GitHub!
              </p>

              {/* Author & GitHub Card */}
              <div className="w-full rounded-2xl border border-slate-200 dark:border-zinc-850 hover:border-indigo-400 dark:hover:border-pink-500/50 bg-slate-50 dark:bg-zinc-900/60 p-3.5 mb-6 flex items-center justify-between text-left transition-all">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 dark:bg-black text-white">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-900 dark:text-white">Crabrian</div>
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400">github.com/Crablegit</div>
                  </div>
                </div>

                <a
                  href="https://github.com/Crablegit/crabs-icpc-generator"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 rounded-xl bg-indigo-50 dark:bg-pink-500/10 border border-indigo-200 dark:border-pink-500/40 hover:border-indigo-400 dark:hover:border-pink-500 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-pink-400 hover:bg-indigo-100 dark:hover:bg-pink-500/20 transition active:scale-95"
                >
                  <Star className="h-3 w-3 fill-current text-indigo-600 dark:text-pink-400" />
                  <span>Star</span>
                  <ExternalLink className="h-2.5 w-2.5 opacity-70" />
                </a>
              </div>

              {/* Action Buttons */}
              <div className="w-full flex flex-col gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={onConfirmOverleaf}
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl border border-indigo-300 dark:border-pink-300 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-pink-500 dark:to-rose-600 py-3.5 px-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] dark:shadow-[0_0_25px_rgba(244,63,94,0.65)] hover:shadow-[0_0_28px_rgba(99,102,241,0.7)] dark:hover:shadow-[0_0_32px_rgba(244,63,94,0.85)] transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Ok bro 🚀 (Open in Overleaf)</span>
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
