'use client';

import React, { useState } from 'react';
import { NotebookData } from '@/types/notebook';
import { generateLatex } from '@/lib/latexGenerator';
import { openInOverleaf } from '@/lib/overleaf';
import { Copy, Check, Download, ExternalLink, Sparkles, FileCode2 } from 'lucide-react';

interface LatexViewerProps {
  notebook: NotebookData;
}

export const LatexViewer: React.FC<LatexViewerProps> = ({ notebook }) => {
  const [copied, setCopied] = useState(false);
  const latex = generateLatex(notebook);

  const handleCopy = () => {
    navigator.clipboard.writeText(latex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([latex], { type: 'text/x-tex;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(notebook.config.teamName || 'notebook').replace(/[^a-zA-Z0-9_-]/g, '_')}.tex`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div className="flex items-center space-x-2">
          <FileCode2 className="h-4 w-4 text-emerald-400" />
          <span className="text-sm font-semibold text-slate-200">
            Generated LaTeX Source (notebook.tex)
          </span>
          <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 border border-emerald-500/20">
            codes2pdf compatible
          </span>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-700 transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy LaTeX'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-700 transition"
          >
            <Download className="h-3.5 w-3.5 text-amber-400" />
            <span>Download .tex</span>
          </button>

          <button
            onClick={() => openInOverleaf(latex)}
            className="flex items-center space-x-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-white font-semibold hover:bg-emerald-500 transition shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Open in Overleaf</span>
            <ExternalLink className="h-3 w-3 opacity-80" />
          </button>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative flex-1 min-h-[450px] overflow-auto bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed selection:bg-emerald-500/30">
        <pre className="whitespace-pre">{latex}</pre>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/80 px-4 py-2 text-[11px] text-slate-400">
        <span>3-Column Landscape layout • \usepackage&#123;multicol,listings,geometry&#125;</span>
        <span className="text-emerald-400 font-medium">Free compilation supported via Overleaf & Local TeX</span>
      </div>
    </div>
  );
};
