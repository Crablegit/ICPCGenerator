'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Github, ExternalLink, Sparkles, X, Check } from 'lucide-react';

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
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Dialog Card with Spring Physics */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{
              type: 'spring',
              damping: 26,
              stiffness: 380,
            }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-slate-100"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
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
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 shadow-lg shadow-amber-500/30"
              >
                <Star className="h-8 w-8 fill-current" />
              </motion.div>

              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                Give me a star ⭐
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mb-6">
                Bạn đã tạo thành công mã nguồn ICPC Notebook! Nếu công cụ này giúp ích cho bạn và team, đừng quên tặng mình 1 star trên GitHub nhé!
              </p>

              {/* Author & GitHub Card */}
              <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-3.5 mb-6 flex items-center justify-between text-left">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-white">
                    <Github className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Crabrian</div>
                    <div className="text-[11px] text-slate-400">github.com/Crablegit</div>
                  </div>
                </div>

                <a
                  href="https://github.com/Crablegit"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1 rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20 transition active:scale-95"
                >
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
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
                  className="w-full flex items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Ok bro 🚀 (Mở sang Overleaf)</span>
                </motion.button>

                <button
                  onClick={onClose}
                  className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
