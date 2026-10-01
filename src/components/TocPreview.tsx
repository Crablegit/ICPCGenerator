'use client';

import React, { useRef, useState } from 'react';
import { NotebookData } from '@/types/notebook';
import { FileText, Sparkles, Image as ImageIcon, X, Upload } from 'lucide-react';
import { processImageFile } from '@/lib/imageHelper';

interface TocPreviewProps {
  notebook: NotebookData;
  onSelectSnippet?: (id: string) => void;
  onUpdateLogo?: (logoDataUrl?: string) => void;
}

export const TocPreview: React.FC<TocPreviewProps> = ({ 
  notebook, 
  onSelectSnippet,
  onUpdateLogo 
}) => {
  const { config, sections } = notebook;
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [isHoveringLogoArea, setIsHoveringLogoArea] = useState(false);

  // Compute estimated page numbers for each item
  let currentPage = 2;
  let currentLinesInPage = 0;
  const linesPerPage = 120; // 3 columns * ~40 lines per column in landscape

  const sectionPageMap = new Map<string, number>();
  const snippetPageMap = new Map<string, number>();

  sections.forEach((sec) => {
    sectionPageMap.set(sec.id, currentPage);
    sec.snippets.forEach((snip) => {
      snippetPageMap.set(snip.id, currentPage);
      const lines = snip.content.split('\n').length + 4;
      currentLinesInPage += lines;
      if (currentLinesInPage >= linesPerPage) {
        currentPage += Math.floor(currentLinesInPage / linesPerPage);
        currentLinesInPage = currentLinesInPage % linesPerPage;
      }
    });
  });

  const handleLogoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      const dataUrl = await processImageFile(file);
      onUpdateLogo && onUpdateLogo(dataUrl);
    } catch (err) {
      console.error(err);
    }
    e.target.value = '';
  };

  const handleDropLogo = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsHoveringLogoArea(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        try {
          const dataUrl = await processImageFile(file);
          onUpdateLogo && onUpdateLogo(dataUrl);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  return (
    <div className="relative group">
      {/* Hidden Logo Input */}
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleLogoFile}
      />

      {/* Paper Top Info Bar */}
      <div className="flex items-center justify-between px-3 py-2 mb-2 text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
        <div className="flex items-center space-x-1.5">
          <FileText className="h-3.5 w-3.5 text-indigo-600 dark:text-pink-500" />
          <span>Preview Content</span>
        </div>
        <div className="flex items-center space-x-1 text-indigo-600 dark:text-pink-400">
          <Sparkles className="h-3 w-3" />
          <span>codes2pdf LaTeX Form</span>
        </div>
      </div>

      {/* Physical Paper Document Simulation with Neon Rim Glow */}
      <div className="w-full rounded-3xl bg-white text-slate-900 border-2 border-indigo-300/90 dark:border-pink-500/60 shadow-[0_0_25px_rgba(99,102,241,0.18)] dark:shadow-[0_0_30px_rgba(244,63,94,0.28)] hover:border-indigo-500 dark:hover:border-pink-400 hover:shadow-[0_0_35px_rgba(99,102,241,0.28)] dark:hover:shadow-[0_0_40px_rgba(244,63,94,0.4)] p-6 sm:p-12 font-serif min-h-[550px] transition-all">
        {/* Title Header with Interactive School Logo */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsHoveringLogoArea(true); }}
          onDragLeave={() => setIsHoveringLogoArea(false)}
          onDrop={handleDropLogo}
          className={`text-center mb-8 p-3 rounded-2xl transition-all ${
            isHoveringLogoArea ? 'bg-indigo-50/70 border-2 border-dashed border-indigo-400' : ''
          }`}
        >
          {/* Logo placed directly on top of Team Notebook */}
          <div className="flex flex-col items-center justify-center mb-3">
            {config.schoolLogo ? (
              <div className="relative group inline-flex items-center mb-2.5">
                <img
                  src={config.schoolLogo}
                  alt="School Logo"
                  onClick={() => logoInputRef.current?.click()}
                  className="h-12 max-w-[120px] object-contain shrink-0 cursor-pointer hover:opacity-85 transition hover:scale-105"
                  title="Click to change logo"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLogo && onUpdateLogo(undefined);
                  }}
                  className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow transition cursor-pointer"
                  title="Remove logo"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="inline-flex items-center space-x-1 rounded-xl border border-dashed border-slate-300 hover:border-indigo-500 dark:hover:border-pink-500 bg-slate-50 hover:bg-indigo-50/50 px-3 py-1 text-xs font-sans text-slate-500 hover:text-indigo-600 dark:hover:text-pink-600 transition cursor-pointer shadow-sm mb-2"
                title="Add University Logo (Click or Paste Ctrl+V)"
              >
                <ImageIcon className="h-3.5 w-3.5" />
                <span>+ Add School Logo</span>
              </button>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
              {config.title || 'icpc notebook'}
            </h1>
          </div>

          <div className="text-sm text-slate-800 font-serif font-medium">
            {config.teamName} {config.university ? `(${config.university})` : ''}
          </div>
          <div className="text-xs text-slate-600 font-serif mt-1">
            {config.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        {/* Contents Heading */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900 font-serif">Contents</h2>
        </div>

        {/* 3 Columns Layout */}
        <div
          className={`gap-6 ${
            config.columns === 2 
              ? 'columns-1 md:columns-2' 
              : 'columns-1 md:columns-2 lg:columns-3'
          }`}
          style={{
            columnRule: config.columnRule ? '1px solid #cbd5e1' : 'none'
          }}
        >
          {sections.map((section, secIdx) => {
            const secPage = sectionPageMap.get(section.id) || 2;
            const displaySecNumber = section.title.match(/^[0-9]+/)?.[0] || String(secIdx + 1);
            const cleanSecTitle = section.title.replace(/^[0-9.]+\s*/, '');

            return (
              <div key={section.id} className="break-inside-avoid mb-4 text-xs font-serif leading-relaxed">
                {/* Main Section Header */}
                <div className="flex items-baseline justify-between font-bold text-slate-900 border-b border-transparent">
                  <div className="truncate mr-1">
                    <span className="mr-1.5">{displaySecNumber}</span>
                    <span>{cleanSecTitle}</span>
                  </div>
                  <div className="font-semibold text-slate-900">{secPage}</div>
                </div>

                {/* Subsections list with dot leaders */}
                <div className="mt-1 space-y-0.5 pl-2">
                  {section.snippets.map((snip, snipIdx) => {
                    const snipPage = snippetPageMap.get(snip.id) || secPage;
                    const subNum = `${displaySecNumber}.${snipIdx + 1}`;

                    return (
                      <div
                        key={snip.id}
                        onClick={() => onSelectSnippet && onSelectSnippet(snip.id)}
                        className="group flex items-baseline justify-between cursor-pointer hover:text-indigo-600 transition"
                        title="Click to view/edit code"
                      >
                        <div className="flex items-baseline truncate flex-1 min-w-0 pr-1">
                          <span className="font-medium mr-1.5 shrink-0 text-slate-700">{subNum}</span>
                          <span className="truncate group-hover:underline text-slate-800">{snip.title}</span>
                        </div>
                        <div className="flex-1 border-b border-dotted border-slate-400 mx-1 relative -top-1 opacity-70" />
                        <div className="font-mono text-[11px] text-slate-700 shrink-0 font-medium">
                          {snipPage}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Page number footer */}
        <div className="text-center text-xs text-slate-600 mt-12 font-serif">
          1
        </div>
      </div>
    </div>
  );
};
