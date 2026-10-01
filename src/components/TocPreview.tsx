'use client';

import React from 'react';
import { NotebookData } from '@/types/notebook';

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
    <div className="w-full rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-200/80 p-6 sm:p-12 font-serif min-h-[550px]">
      {/* Title Header with Optional School Logo */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-2">
          {config.schoolLogo && (
            <img
              src={config.schoolLogo}
              alt="School Logo"
              className="h-8 max-w-[45px] object-contain shrink-0 inline-block"
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

      {/* Contents Header */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-900 font-serif">Contents</h2>
      </div>

      {/* 3 Columns Layout matching codes2pdf and image */}
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
                      title="Click to view code"
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

      {/* Page number footer matching the image */}
      <div className="text-center text-xs text-slate-600 mt-12 font-serif">
        1
      </div>
    </div>
  );
};
