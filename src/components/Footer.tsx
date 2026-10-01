'use client';

import React from 'react';
import { Github, Linkedin, MessageSquare, ExternalLink, Heart, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950/80 backdrop-blur-xl py-8 px-4 sm:px-8 mt-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Author Credit */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <div className="flex items-center space-x-1.5 text-slate-200 font-semibold text-sm">
            <span>Tạo bởi</span>
            <span className="text-white font-bold tracking-wide bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Crabrian
            </span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-current inline-block" />
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs">
            <a
              href="https://github.com/Crablegit"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-slate-300 hover:text-white transition"
            >
              <Github className="h-3.5 w-3.5" />
              <span>Github: Crablegit</span>
            </a>
            <a
              href="https://www.linkedin.com/in/brianthecrab/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1 text-slate-300 hover:text-blue-400 transition"
            >
              <Linkedin className="h-3.5 w-3.5" />
              <span>Linkedin: brianthecrab</span>
            </a>
            <div className="flex items-center space-x-1 text-slate-300">
              <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
              <span>Discord: <span className="font-mono text-slate-200">brianthecrab</span></span>
            </div>
          </div>
        </div>

        {/* Template Credit */}
        <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-1 max-w-md">
          <div className="flex items-center space-x-1 text-slate-300">
            <Code2 className="h-3.5 w-3.5 text-emerald-400" />
            <span className="font-medium">Template Credit:</span>
            <a
              href="https://github.com/Erfaniaa/codes2pdf"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline inline-flex items-center space-x-0.5 font-mono"
            >
              <span>Erfaniaa/codes2pdf</span>
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Website chỉ hỗ trợ việc sử dụng template mà không cần cài đặt các thư viện TeX phức tạp hay tốn phí máy chủ.
          </p>
        </div>
      </div>
    </footer>
  );
};
