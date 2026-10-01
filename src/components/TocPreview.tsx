'use client';

import React from 'react';
import { NotebookData } from '@/types/notebook';
import { FileText, Sparkles } from 'lucide-react';

interface TocPreviewProps {
  notebook: NotebookData;
  onSelectSnippet?: (id: string) => void;
}

export const TocPreview: React.FC<TocPreviewProps> = ({ notebook, onSelectSnippet }) => {
  const { config, sections } = notebook;

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

  return (
    <div className="relative group">
      {/* Paper Top Info Bar */}
      <div className="flex items-center justify-between px-4 py-2 mb-2 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
        <div className="flex items-center space-x-1.5">
          <FileText className="h-3.5 w-3.5 text-blue-500" />
          <span>A4 Landscape • 3 Columns Preview</span>
        </div>
        <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="h-3 w-3" />
          <span>codes2pdf LaTeX Form</span>
        </div>
      </div>

      {/* Physical Paper Document Simulation */}
      <div className="w-full rounded-3xl bg-white text-slate-900 shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-200/90 dark:border-white/10 p-6 sm:p-12 font-serif min-h-[550px] transition-all">
        {/* Title Header with Optional School Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-2">
            {config.schoolLogo && (
              <img
                src={config.schoolLogo}
                alt="School Logo"
                className="h-8 max-w-[50px] object-contain shrink-0 inline-block"
              />
            )}
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif inline-block">
              {config.title || 'Team Notebook'}
            </h1>
          </div>

          <div className="text-sm text-slate-800 font-serif font-medium">
            {config.teamName} {config.university ? `(${config.university})` : ''}
          </div>
          <div className="text-xs text-slate-600 font-serif mt-1">
            {config.date || 'December 14, 2018'}
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
                        className="group flex items-baseline justify-between cursor-pointer hover:text-blue-700 transition"
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
