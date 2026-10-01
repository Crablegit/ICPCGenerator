'use client';

import React, { useState } from 'react';
import { X, Database, Check, Copy, ExternalLink } from 'lucide-react';
import { SQL_SCHEMA_INSTRUCTIONS, isSupabaseConfigured } from '@/lib/supabase';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCHEMA_INSTRUCTIONS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">Supabase Cloud Database Setup</h3>
            <p className="text-xs text-slate-400">
              Save your team notebooks in the cloud and share them with your teammates via URL.
            </p>
          </div>
        </div>

        {/* Current status */}
        <div className={`mb-4 rounded-xl p-3 text-xs flex items-center justify-between border ${
          isSupabaseConfigured 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div>
            <span className="font-semibold">Status: </span>
            {isSupabaseConfigured ? 'Connected to Supabase' : 'Running in Local Storage Mode (Ready to use)'}
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800/80">
            {isSupabaseConfigured ? 'Active' : 'Offline Mode'}
          </span>
        </div>

        {/* Step-by-step instructions */}
        <div className="space-y-3 text-xs text-slate-300">
          <div>
            <p className="font-semibold text-slate-200 mb-1">1. Create a free Supabase project</p>
            <p className="text-slate-400">
              Sign up at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-400 underline inline-flex items-center">supabase.com <ExternalLink className="h-3 w-3 ml-0.5" /></a> (100% free tier, 500MB database).
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-slate-200">2. Run this SQL in your Supabase SQL Editor:</p>
              <button
                onClick={handleCopySql}
                className="flex items-center space-x-1 text-[11px] text-blue-400 hover:text-blue-300"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied SQL' : 'Copy SQL'}</span>
              </button>
            </div>
            <pre className="rounded-lg bg-slate-950 p-3 font-mono text-[11px] text-slate-300 overflow-x-auto border border-slate-800">
              {SQL_SCHEMA_INSTRUCTIONS}
            </pre>
          </div>

          <div>
            <p className="font-semibold text-slate-200 mb-1">3. Set Environment Variables</p>
            <p className="text-slate-400">
              Add to your <code className="text-slate-200">.env.local</code> (or in Vercel Project Settings &gt; Environment Variables):
            </p>
            <pre className="rounded-lg bg-slate-950 p-2 font-mono text-[11px] text-slate-300 mt-1 border border-slate-800">
              NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co{'\n'}
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
            </pre>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
