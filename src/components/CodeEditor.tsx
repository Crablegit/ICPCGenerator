'use client';

import React from 'react';
import { Snippet } from '@/types/notebook';
import { FileCode, FileText, Check, Copy } from 'lucide-react';

interface CodeEditorProps {
  snippet: Snippet | null;
  onUpdateSnippet: (updated: Snippet) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ snippet, onUpdateSnippet }) => {
  const [copied, setCopied] = React.useState(false);

  if (!snippet) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center text-slate-500">
        <FileCode className="h-10 w-10 text-slate-700 mb-3" />
        <p className="text-sm font-medium">No code snippet selected</p>
        <p className="text-xs text-slate-600 mt-1">
          Select an algorithm from the sidebar or table of contents to view and edit its code.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = snippet.content.split('\n').length;

  return (
    <div className="flex flex-col h-full rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-sm">
      {/* Editor Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-900 px-4 py-3">
        <div className="flex items-center space-x-3 flex-1 min-w-[200px]">
          {snippet.isTex ? (
            <FileText className="h-4 w-4 text-amber-400 shrink-0" />
          ) : (
            <FileCode className="h-4 w-4 text-sky-400 shrink-0" />
          )}

          <div className="flex-1">
            <input
              type="text"
              value={snippet.title}
              onChange={(e) => onUpdateSnippet({ ...snippet, title: e.target.value })}
              className="w-full bg-transparent font-semibold text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1"
              placeholder="Snippet title (e.g. Mo's algorithm)"
            />
          </div>
        </div>

        {/* Snippet metadata controls */}
        <div className="flex items-center space-x-2 text-xs">
          {/* Filename */}
          <input
            type="text"
            value={snippet.filename}
            onChange={(e) => onUpdateSnippet({ ...snippet, filename: e.target.value })}
            className="w-32 rounded bg-slate-800 border border-slate-700 px-2 py-1 text-slate-300 text-xs font-mono focus:outline-none"
            placeholder="filename.cpp"
          />

          {/* Language selector */}
          <select
            value={snippet.language}
            onChange={(e) => {
              const lang = e.target.value;
              onUpdateSnippet({
                ...snippet,
                language: lang,
                isTex: lang === 'tex'
              });
            }}
            className="rounded bg-slate-800 border border-slate-700 px-2 py-1 text-slate-300 text-xs focus:outline-none"
          >
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="tex">LaTeX (.tex)</option>
            <option value="kotlin">Kotlin</option>
            <option value="rust">Rust</option>
            <option value="text">Plain Text</option>
          </select>

          {/* Raw TeX toggle */}
          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-400 hover:text-slate-200">
            <input
              type="checkbox"
              checked={snippet.isTex}
              onChange={(e) => onUpdateSnippet({ ...snippet, isTex: e.target.checked })}
              className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-amber-500"
            />
            <span>Raw LaTeX</span>
          </label>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 rounded bg-slate-800 border border-slate-700 px-2.5 py-1 text-slate-300 hover:bg-slate-700 transition"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 min-h-[380px] bg-slate-950 font-mono text-xs flex">
        {/* Line numbers column */}
        <div className="select-none py-3 px-2 bg-slate-900/60 border-r border-slate-800 text-slate-600 text-right font-mono min-w-[3rem]">
          {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
            <div key={i} className="leading-5">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Text area */}
        <textarea
          value={snippet.content}
          onChange={(e) => onUpdateSnippet({ ...snippet, content: e.target.value })}
          className="flex-1 w-full resize-none bg-transparent p-3 leading-5 text-slate-200 font-mono focus:outline-none selection:bg-blue-600/40"
          placeholder="// Paste source code or LaTeX formulas here..."
          spellCheck={false}
        />
      </div>

      {/* Editor Footer Status */}
      <div className="flex items-center justify-between border-t border-slate-800 bg-slate-900/80 px-4 py-1.5 text-[11px] text-slate-400 font-mono">
        <div>
          {lineCount} lines • {snippet.content.length} characters
        </div>
        <div className="text-slate-500">
          {snippet.isTex ? 'Included directly in LaTeX document' : `Wrapped in \\begin{lstlisting}[language=${snippet.language}]`}
        </div>
      </div>
    </div>
  );
};
