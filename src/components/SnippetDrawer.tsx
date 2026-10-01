'use client';

import React, { useState } from 'react';
import { Snippet } from '@/types/notebook';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileCode, FileText, Check, Copy } from 'lucide-react';

interface SnippetDrawerProps {
  snippet: Snippet | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSnippet: (updated: Snippet) => void;
}

export const SnippetDrawer: React.FC<SnippetDrawerProps> = ({
  snippet,
  isOpen,
  onClose,
  onUpdateSnippet,
}) => {
  const [copied, setCopied] = useState(false);

  if (!snippet) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = snippet.content.split('\n').length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black shadow-2xl dark:shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden z-10 text-slate-900 dark:text-zinc-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
              <div className="flex items-center space-x-2.5 flex-1 mr-4">
                {snippet.isTex ? (
                  <FileText className="h-4 w-4 text-amber-500 shrink-0" />
                ) : (
                  <FileCode className="h-4 w-4 text-indigo-600 dark:text-pink-400 shrink-0" />
                )}
                <input
                  type="text"
                  value={snippet.title}
                  onChange={(e) => onUpdateSnippet({ ...snippet, title: e.target.value })}
                  className="bg-transparent font-bold text-sm text-slate-900 dark:text-white focus:outline-none flex-1 truncate"
                  placeholder="Algorithm Name"
                />
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 rounded-xl bg-slate-100 dark:bg-zinc-900 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-800 transition"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between px-5 py-2 text-xs border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/60">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={snippet.filename}
                  onChange={(e) => onUpdateSnippet({ ...snippet, filename: e.target.value })}
                  className="rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2 py-1 text-xs font-mono text-slate-700 dark:text-zinc-300 w-32 focus:outline-none"
                  placeholder="file.cpp"
                />

                <select
                  value={snippet.language}
                  onChange={(e) => {
                    const l = e.target.value;
                    onUpdateSnippet({ ...snippet, language: l, isTex: l === 'tex' });
                  }}
                  className="rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-2 py-1 text-xs text-slate-700 dark:text-zinc-300 focus:outline-none"
                >
                  <option value="cpp">C++</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="tex">LaTeX (.tex)</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="rust">Rust</option>
                </select>

                <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600 dark:text-zinc-300">
                  <input
                    type="checkbox"
                    checked={snippet.isTex}
                    onChange={(e) => onUpdateSnippet({ ...snippet, isTex: e.target.checked })}
                    className="rounded border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-indigo-600 dark:text-pink-500"
                  />
                  <span>Raw LaTeX</span>
                </label>
              </div>

              <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                {lineCount} lines
              </span>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex bg-slate-950 font-mono text-xs overflow-auto min-h-[350px]">
              <div className="select-none py-3 px-2 bg-slate-900/60 border-r border-zinc-850 text-slate-600 text-right min-w-[2.8rem]">
                {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
                  <div key={i} className="leading-5">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={snippet.content}
                onChange={(e) => onUpdateSnippet({ ...snippet, content: e.target.value })}
                className="flex-1 w-full resize-none bg-transparent p-3 leading-5 text-zinc-100 font-mono focus:outline-none selection:bg-indigo-500/40 dark:selection:bg-pink-500/40"
                spellCheck={false}
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end px-5 py-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950">
              <button
                onClick={onClose}
                className="rounded-xl bg-indigo-600 hover:bg-indigo-500 dark:bg-pink-600 dark:hover:bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white transition shadow-sm"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
