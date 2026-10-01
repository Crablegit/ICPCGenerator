'use client';

import React, { useState, useEffect } from 'react';
import { NotebookData, Snippet } from '@/types/notebook';
import { initialNotebookData } from '@/lib/initialData';
import { generateLatex } from '@/lib/latexGenerator';
import { openInOverleaf } from '@/lib/overleaf';
import { Navbar } from '@/components/Navbar';
import { ConfigPanel } from '@/components/ConfigPanel';
import { SectionManager } from '@/components/SectionManager';
import { TocPreview } from '@/components/TocPreview';
import { CodeEditor } from '@/components/CodeEditor';
import { LatexViewer } from '@/components/LatexViewer';
import { StarModal } from '@/components/StarModal';
import { Footer } from '@/components/Footer';
import { 
  ListTree, 
  FileCode, 
  FileText, 
  Settings2, 
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [notebook, setNotebook] = useState<NotebookData>(initialNotebookData);
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>('snip-1-1');
  const [activeTab, setActiveTab] = useState<'toc' | 'editor' | 'latex'>('toc');
  const [showConfig, setShowConfig] = useState(false);
  const [starModalOpen, setStarModalOpen] = useState(false);

  // Load from local storage on initial load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('crabs_icpc_notebook');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotebook(parsed);
        if (parsed.sections?.[0]?.snippets?.[0]) {
          setSelectedSnippetId(parsed.sections[0].snippets[0].id);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('crabs_icpc_notebook', JSON.stringify(notebook));
  }, [notebook]);

  // Find currently selected snippet
  let currentSnippet: Snippet | null = null;
  for (const sec of notebook.sections) {
    const found = sec.snippets.find((s) => s.id === selectedSnippetId);
    if (found) {
      currentSnippet = found;
      break;
    }
  }

  // Handle snippet selection
  const handleSelectSnippet = (id: string) => {
    setSelectedSnippetId(id);
    setActiveTab('editor');
  };

  // Update snippet
  const handleUpdateSnippet = (updated: Snippet) => {
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

  // Reset / Clear all
  const handleClearAll = () => {
    if (confirm('Reset everything? This will clear all existing categories and files.')) {
      const resetNotebook: NotebookData = {
        config: {
          title: 'Team Notebook',
          teamName: 'My Team Name',
          university: 'My University',
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
      setSelectedSnippetId(null);
      localStorage.removeItem('crabs_icpc_notebook');
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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        onGenerate={handleGenerate}
        onClearAll={handleClearAll}
      />

      {/* Main Container */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
        {/* Collapsible Config Bar */}
        <div className="mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center space-x-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 border border-white/10 rounded-2xl px-4 py-2 backdrop-blur-md transition cursor-pointer shadow-sm"
          >
            <Settings2 className="h-3.5 w-3.5 text-blue-400" />
            <span>Customize Team & Logo ({notebook.config.teamName || 'Team Notebook'})</span>
            {showConfig ? <ChevronUp className="h-3.5 w-3.5 ml-1" /> : <ChevronDown className="h-3.5 w-3.5 ml-1" />}
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
          {/* Left Column: Categories & Bulk Upload (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900/40 rounded-3xl border border-white/10 p-5 backdrop-blur-xl shadow-xl">
            <SectionManager
              sections={notebook.sections}
              selectedSnippetId={selectedSnippetId}
              onSelectSnippet={handleSelectSnippet}
              onUpdateSections={(newSecs) =>
                setNotebook({ ...notebook, sections: newSecs })
              }
            />
          </div>

          {/* Right Column: Tab View & Previews (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* View Switcher Tabs (Apple fluid pill) */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => setActiveTab('toc')}
                  className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'toc'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ListTree className="h-3.5 w-3.5" />
                  <span>Table of Contents</span>
                </button>

                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'editor'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Code Editor</span>
                </button>

                <button
                  onClick={() => setActiveTab('latex')}
                  className={`flex items-center space-x-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition cursor-pointer ${
                    activeTab === 'latex'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>LaTeX Source</span>
                </button>
              </div>

              {/* Overleaf Quick Trigger Hint */}
              <div className="hidden sm:flex items-center text-xs text-slate-400 space-x-1.5">
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                <span>Ready for Overleaf</span>
              </div>
            </div>

            {/* Tab Panes */}
            <div>
              {activeTab === 'toc' && (
                <div className="animate-fadeIn">
                  <div className="mb-2 text-xs text-slate-400 flex items-center justify-between">
                    <span>Preview Form: Page 1 Table of Contents</span>
                    <span className="text-[11px] text-slate-500">Click any algorithm to edit code</span>
                  </div>
                  <TocPreview
                    notebook={notebook}
                    onSelectSnippet={handleSelectSnippet}
                  />
                </div>
              )}

              {activeTab === 'editor' && (
                <div className="animate-fadeIn">
                  <CodeEditor
                    snippet={currentSnippet}
                    onUpdateSnippet={handleUpdateSnippet}
                  />
                </div>
              )}

              {activeTab === 'latex' && (
                <div className="animate-fadeIn">
                  <LatexViewer notebook={notebook} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Give me a star Modal */}
      <StarModal
        isOpen={starModalOpen}
        onClose={() => setStarModalOpen(false)}
        onConfirmOverleaf={handleConfirmOverleaf}
      />

      {/* Footer with Crabrian and template credits */}
      <Footer />
    </div>
  );
}
