'use client';

import React, { useState, useEffect } from 'react';
import { NotebookData, Snippet } from '@/types/notebook';
import { initialNotebookData } from '@/lib/initialData';
import { generateLatex } from '@/lib/latexGenerator';
import { openInOverleaf } from '@/lib/overleaf';
import { processImageFile } from '@/lib/imageHelper';
import { Navbar } from '@/components/Navbar';
import { ConfigPanel } from '@/components/ConfigPanel';
import { SectionManager } from '@/components/SectionManager';
import { TocPreview } from '@/components/TocPreview';
import { SnippetDrawer } from '@/components/SnippetDrawer';
import { StarModal } from '@/components/StarModal';
import { Footer } from '@/components/Footer';
import { 
  Settings2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  RotateCcw, 
  BookOpen,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [notebook, setNotebook] = useState<NotebookData>(initialNotebookData);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [starModalOpen, setStarModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle theme initialization
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = (localStorage.getItem('crabs_icpc_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('crabs_icpc_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load notebook from local storage on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('crabs_icpc_notebook');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotebook(parsed);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save notebook to local storage safely with try/catch
  useEffect(() => {
    try {
      localStorage.setItem('crabs_icpc_notebook', JSON.stringify(notebook));
    } catch (e) {
      console.warn('LocalStorage save failed, trying slim fallback', e);
      try {
        const slim = {
          ...notebook,
          config: { ...notebook.config, schoolLogo: undefined }
        };
        localStorage.setItem('crabs_icpc_notebook', JSON.stringify(slim));
      } catch (err) {
        console.error('LocalStorage error', err);
      }
    }
  }, [notebook]);

  // Global Ctrl + V paste listener for school logo image
  useEffect(() => {
    const handleGlobalPaste = async (e: ClipboardEvent) => {
      // Don't intercept paste if user is typing in an input or textarea
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
          const file = items[i].getAsFile();
          if (file) {
            e.preventDefault();
            try {
              const dataUrl = await processImageFile(file);
              setNotebook((prev) => ({
                ...prev,
                config: {
                  ...prev.config,
                  schoolLogo: dataUrl
                }
              }));
              showToast('University logo added from clipboard! 🖼️');
            } catch (err) {
              console.error('Failed processing pasted image:', err);
            }
          }
          break;
        }
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

  // Handle snippet selection (opens edit drawer)
  const handleSelectSnippet = (id: string) => {
    for (const sec of notebook.sections) {
      const found = sec.snippets.find((s) => s.id === id);
      if (found) {
        setSelectedSnippet(found);
        setIsDrawerOpen(true);
        break;
      }
    }
  };

  // Update snippet
  const handleUpdateSnippet = (updated: Snippet) => {
    setSelectedSnippet(updated);
    setNotebook((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => ({
        ...sec,
        snippets: sec.snippets.map((snip) =>
          snip.id === updated.id ? updated : snip
        ),
      })),
      updatedAt: new Date().toISOString(),
    }));
  };

  // Update logo directly from TOC preview or ConfigPanel
  const handleUpdateLogo = (logoDataUrl?: string) => {
    setNotebook((prev) => ({
      ...prev,
      config: {
        ...prev.config,
        schoolLogo: logoDataUrl
      }
    }));
    if (logoDataUrl) {
      showToast('University logo updated! 🖼️');
    } else {
      showToast('University logo removed');
    }
  };

  // Reset / Clear all
  const handleClearAll = () => {
    if (confirm('Reset everything? This will clear all existing categories and files.')) {
      const resetNotebook: NotebookData = {
        config: {
          title: 'Team Notebook',
          teamName: 'Sample Team Name',
          university: 'Sample University Name',
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          initials: 'CRAB',
          columns: 3,
          orientation: 'landscape',
          fontSize: '10pt',
          columnSep: '0.1in',
          columnRule: true,
          lineNumbers: false,
          tabSize: 2,
        },
        sections: [
          {
            id: `sec-${Date.now()}`,
            title: '1 Algorithms',
            snippets: []
          }
        ],
        updatedAt: new Date().toISOString()
      };
      setNotebook(resetNotebook);
      setSelectedSnippet(null);
      setIsDrawerOpen(false);
      localStorage.removeItem('crabs_icpc_notebook');
      showToast('Notebook reset to default');
    }
  };

  // Generate action -> triggers StarModal
  const handleGenerate = () => {
    setStarModalOpen(true);
  };

  // Confirm Overleaf from StarModal
  const handleConfirmOverleaf = () => {
    const latex = generateLatex(notebook);
    openInOverleaf(latex);
    setStarModalOpen(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center space-x-2 rounded-full border border-indigo-400 dark:border-pink-500 bg-white/95 dark:bg-black/95 px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] dark:shadow-[0_0_25px_rgba(244,63,94,0.5)] backdrop-blur-xl"
          >
            <Check className="h-4 w-4 text-emerald-500 dark:text-pink-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none bg-mesh-dark hidden dark:block opacity-70 z-0" />
      <div className="fixed inset-0 pointer-events-none bg-mesh-light block dark:hidden opacity-50 z-0" />

      {/* Top Navbar */}
      <div className="relative z-20">
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </div>

      {/* Main Container */}
      <main className="relative z-10 flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {/* Collapsible Config Bar */}
        <div className="mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-pink-400 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-pink-500/50 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] dark:hover:shadow-[0_0_14px_rgba(244,63,94,0.4)] rounded-2xl px-4 py-2.5 backdrop-blur-xl transition cursor-pointer shadow-sm"
          >
            <Settings2 className="h-3.5 w-3.5 text-indigo-600 dark:text-pink-500" />
            <span>Customize Team & Logo ({notebook.config.teamName || 'Team Notebook'})</span>
            {showConfig ? <ChevronUp className="h-3.5 w-3.5 ml-1 text-slate-400" /> : <ChevronDown className="h-3.5 w-3.5 ml-1 text-slate-400" />}
          </motion.button>

          <AnimatePresence>
            {showConfig && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                className="mt-3 overflow-hidden"
              >
                <ConfigPanel
                  config={notebook.config}
                  onChange={(newCfg) => setNotebook({ ...notebook, config: newCfg })}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Categories & Bulk Upload (4 cols) with Neon Border */}
          <div className="lg:col-span-4 bg-white/95 dark:bg-zinc-950/80 rounded-3xl border border-slate-200 dark:border-zinc-800 hover:border-indigo-400/60 dark:hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_25px_rgba(244,63,94,0.2)] p-5 backdrop-blur-2xl shadow-xl transition-all">
            <SectionManager
              sections={notebook.sections}
              selectedSnippetId={selectedSnippet?.id || null}
              onSelectSnippet={handleSelectSnippet}
              onUpdateSections={(newSecs) =>
                setNotebook({ ...notebook, sections: newSecs })
              }
            />
          </div>

          {/* Right Column: Fixed Table of Contents & Action Toolbar (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Action Bar with Reset All and Generate Notebook Buttons */}
            <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-indigo-600 dark:text-pink-500" />
                <span className="text-sm font-bold text-slate-800 dark:text-zinc-200 tracking-tight">
                  Table of Contents
                </span>
                <span className="hidden sm:inline text-xs text-slate-400 dark:text-zinc-500 font-normal">
                  • Click algorithm to edit
                </span>
              </div>

              {/* Action Buttons: Reset All + Generate Notebook */}
              <div className="flex items-center space-x-2.5">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 25 }}
                  onClick={handleClearAll}
                  className="flex items-center space-x-1.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/60 hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-400 dark:hover:border-red-500/60 hover:shadow-[0_0_12px_rgba(239,68,68,0.35)] text-slate-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 px-3.5 py-1.5 text-xs font-semibold transition cursor-pointer shadow-sm"
                  title="Reset everything and start fresh"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset All</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96, y: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                  onClick={handleGenerate}
                  className="flex items-center space-x-2 rounded-full border border-indigo-400 dark:border-pink-400 bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 dark:from-pink-500 dark:via-rose-500 dark:to-pink-600 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-[0_0_18px_rgba(99,102,241,0.5)] dark:shadow-[0_0_22px_rgba(244,63,94,0.65)] hover:shadow-[0_0_25px_rgba(99,102,241,0.7)] dark:hover:shadow-[0_0_28px_rgba(244,63,94,0.85)] transition cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Notebook</span>
                </motion.button>
              </div>
            </div>

            {/* Permanent Table of Contents Preview */}
            <div className="animate-fadeIn">
              <TocPreview
                notebook={notebook}
                onSelectSnippet={handleSelectSnippet}
                onUpdateLogo={handleUpdateLogo}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Snippet Edit Drawer Modal */}
      <SnippetDrawer
        snippet={selectedSnippet}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateSnippet={handleUpdateSnippet}
      />

      {/* Give me a star Modal */}
      <StarModal
        isOpen={starModalOpen}
        onClose={() => setStarModalOpen(false)}
        onConfirmOverleaf={handleConfirmOverleaf}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
