'use client';

import React from 'react';
import { Github, Linkedin, MessageSquare, ExternalLink, Heart, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-zinc-800 bg-white/80 dark:bg-black/90 backdrop-blur-xl py-7 px-4 sm:px-8 mt-14 text-slate-500 dark:text-zinc-400 text-xs transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Author Credit */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <div className="flex items-center space-x-1.5 font-semibold text-sm text-slate-800 dark:text-zinc-200">
            <span>Created by</span>
            <span className="font-bold tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 dark:from-pink-400 dark:via-rose-400 dark:to-pink-500 bg-clip-text text-transparent">
              Crabrian
            </span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-current inline-block ml-0.5" />
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
            <a
              href="https://github.com/Crablegit"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-pink-400 transition"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Github: Crablegit</span>
            </a>
            <a
              href="https://www.linkedin.com/in/brianthecrab/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-slate-600 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-pink-400 transition"
            >
              <Linkedin className="h-3.5 w-3.5" />
              <span>Linkedin: brianthecrab</span>
            </a>
            <div className="flex items-center space-x-1 text-slate-600 dark:text-zinc-300">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-500 dark:text-pink-400" />
              <span>Discord: <span className="font-mono font-medium text-slate-800 dark:text-zinc-200">brianthecrab</span></span>
            </div>
          </div>
        </div>

        {/* Template Credit */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1">
          <div className="flex items-center space-x-1.5 text-slate-600 dark:text-zinc-300">
            <Code2 className="h-3.5 w-3.5 text-indigo-600 dark:text-pink-400" />
            <span className="font-medium">Template Credit:</span>
            <a
              href="https://github.com/Erfaniaa/codes2pdf"
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 dark:text-pink-400 hover:underline inline-flex items-center space-x-0.5 font-mono"
            >
              <span>Erfaniaa/codes2pdf</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
