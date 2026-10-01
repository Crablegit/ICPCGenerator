'use client';

import React from 'react';
import { NotebookData } from '@/types/notebook';
import { Printer, HelpCircle } from 'lucide-react';
import { TocPreview } from './TocPreview';

interface PrintViewProps {
  notebook: NotebookData;
}

export const PrintView: React.FC<PrintViewProps> = ({ notebook }) => {
  const { config, sections } = notebook;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Top Banner with Print Button */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">
            Browser Print & PDF Generator (100% Free, Zero VM)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click <strong>Print / Save as PDF</strong> below, then in Chrome/Edge select <em>Destination: Save as PDF</em>, <em>Layout: Landscape</em>, <em>Margins: Minimum/Default</em>.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 transition"
        >
          <Printer className="h-4 w-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Document Container */}
      <div className="rounded-2xl border border-slate-700 bg-white text-slate-950 p-8 sm:p-12 shadow-2xl print:border-none print:p-0 print:shadow-none font-serif">
        {/* Page 1: Title & Table of Contents */}
        <div className="print-page mb-12">
          <TocPreview notebook={notebook} />
        </div>

        <hr className="no-print my-10 border-slate-300 border-dashed" />

        {/* Page 2+: Content in 3 Columns */}
        <div>
          {/* Running Header */}
          <div className="flex justify-between items-center pb-2 mb-4 border-b border-slate-400 text-[10px] text-slate-600 font-mono">
            <span>{config.initials || 'ICPC'}</span>
            <span className="font-semibold">{config.title || 'icpc notebook'}</span>
          </div>

          <div
            className={`gap-4 ${
              config.columns === 2 ? 'print-columns-2 columns-2' : 'print-columns-3 columns-3'
            }`}
            style={{
              columnRule: config.columnRule ? '1px solid #cbd5e1' : 'none'
            }}
          >
            {sections.map((section, secIdx) => {
              const displaySecNumber = section.title.match(/^[0-9]+/)?.[0] || String(secIdx + 1);
              const cleanSecTitle = section.title.replace(/^[0-9.]+\s*/, '');

              return (
                <div key={section.id} className="mb-6">
                  {/* Section Title */}
                  <h2 className="print-avoid-break text-sm font-bold font-serif text-slate-900 border-b border-slate-400 pb-0.5 mb-2 mt-4 first:mt-0">
                    {displaySecNumber} {cleanSecTitle}
                  </h2>

                  {/* Snippets in this section */}
                  {section.snippets.map((snip, snipIdx) => {
                    const subNum = `${displaySecNumber}.${snipIdx + 1}`;

                    return (
                      <div key={snip.id} className="print-avoid-break mb-4">
                        {/* Subsection Title */}
                        <h3 className="text-xs font-bold font-serif text-slate-800 mb-1">
                          {subNum} {snip.title}
                        </h3>

                        {/* Code box or Raw LaTeX */}
                        {snip.isTex || snip.language === 'tex' ? (
                          <div className="text-[10px] font-serif bg-slate-50 p-2 border border-slate-200 rounded my-1 italic">
                            {snip.content}
                          </div>
                        ) : (
                          <pre className="print-code font-mono text-[8pt] leading-tight bg-slate-50 p-1.5 border-t border-b border-slate-300 overflow-x-auto whitespace-pre-wrap">
                            <code>{snip.content}</code>
                          </pre>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
