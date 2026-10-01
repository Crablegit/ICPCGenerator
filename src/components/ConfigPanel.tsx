'use client';

import React, { useRef } from 'react';
import { NotebookConfig } from '@/types/notebook';
import { Settings, Image as ImageIcon, Upload, Trash2, Columns, Type } from 'lucide-react';

interface ConfigPanelProps {
  config: NotebookConfig;
  onChange: (config: NotebookConfig) => void;
}

export const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof NotebookConfig, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      handleChange('schoolLogo', reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Support paste from clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            handleChange('schoolLogo', reader.result as string);
          };
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  };

  return (
    <div
      onPaste={handlePaste}
      tabIndex={0}
      className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/80 p-5 shadow-xl backdrop-blur-xl transition-all focus:outline-none focus:border-indigo-500/40 dark:focus:border-pink-500/40"
    >
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200">
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4 text-indigo-600 dark:text-pink-500" />
          <h3 className="text-xs font-bold tracking-wider uppercase text-slate-700 dark:text-zinc-300">
            Notebook & University Setup
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-zinc-500">
          Tip: You can paste (Ctrl+V) school logo directly anywhere here
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        {/* Title */}
        <div>
          <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-medium">Notebook Title</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black px-3 py-2 text-slate-900 dark:text-zinc-100 focus:border-indigo-500 dark:focus:border-pink-500 focus:outline-none transition-all"
            placeholder="Team Notebook"
          />
        </div>

        {/* Team Name */}
        <div>
          <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-medium">Team Name</label>
          <input
            type="text"
            value={config.teamName}
            onChange={(e) => handleChange('teamName', e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black px-3 py-2 text-slate-900 dark:text-zinc-100 focus:border-indigo-500 dark:focus:border-pink-500 focus:outline-none transition-all"
            placeholder="Sample Team Name"
          />
        </div>

        {/* University */}
        <div>
          <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-medium">University / School Name</label>
          <input
            type="text"
            value={config.university}
            onChange={(e) => handleChange('university', e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black px-3 py-2 text-slate-900 dark:text-zinc-100 focus:border-indigo-500 dark:focus:border-pink-500 focus:outline-none transition-all"
            placeholder="Sample University Name"
          />
        </div>

        {/* Date & Initials */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-medium">Date</label>
            <input
              type="text"
              value={config.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black px-2.5 py-2 text-slate-900 dark:text-zinc-100 focus:border-indigo-500 dark:focus:border-pink-500 focus:outline-none transition-all"
              placeholder="December 14, 2018"
            />
          </div>
          <div>
            <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-medium">Initials</label>
            <input
              type="text"
              value={config.initials}
              onChange={(e) => handleChange('initials', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black px-2.5 py-2 text-slate-900 dark:text-zinc-100 focus:border-indigo-500 dark:focus:border-pink-500 focus:outline-none transition-all"
              placeholder="ST"
            />
          </div>
        </div>

        {/* School Logo Upload / Paste */}
        <div className="sm:col-span-2 lg:col-span-2 rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 p-3 flex items-center justify-between">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
          <div className="flex items-center space-x-3">
            {config.schoolLogo ? (
              <div className="relative group h-10 w-10 rounded-xl bg-white dark:bg-zinc-900 p-1 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-zinc-700">
                <img
                  src={config.schoolLogo}
                  alt="School Logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-slate-400 dark:text-zinc-500">
                <ImageIcon className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-zinc-200">
                {config.schoolLogo ? 'School Logo Added' : 'University Logo (Optional)'}
              </div>
              <div className="text-[11px] text-slate-400 dark:text-zinc-500">
                {config.schoolLogo
                  ? 'Displays beside Team Notebook'
                  : 'Click Upload or Paste (Ctrl+V) image here'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-200 transition active:scale-95"
            >
              <Upload className="h-3.5 w-3.5 text-indigo-600 dark:text-pink-400" />
              <span>{config.schoolLogo ? 'Change' : 'Upload Logo'}</span>
            </button>
            {config.schoolLogo && (
              <button
                onClick={() => handleChange('schoolLogo', undefined)}
                className="p-1.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition active:scale-95"
                title="Remove logo"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Layout Options: Columns & Font size */}
        <div className="sm:col-span-2 lg:col-span-2 grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-medium flex items-center space-x-1">
              <Columns className="h-3 w-3 text-slate-400" />
              <span>Columns</span>
            </label>
            <select
              value={config.columns}
              onChange={(e) => handleChange('columns', Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black px-3 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none"
            >
              <option value={3}>3 Columns (Standard ICPC)</option>
              <option value={2}>2 Columns</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-500 dark:text-zinc-400 mb-1 font-medium flex items-center space-x-1">
              <Type className="h-3 w-3 text-slate-400" />
              <span>Font Size</span>
            </label>
            <select
              value={config.fontSize}
              onChange={(e) => handleChange('fontSize', e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-black px-3 py-2 text-slate-900 dark:text-zinc-100 focus:outline-none"
            >
              <option value="10pt">10pt (Standard)</option>
              <option value="9pt">9pt (Compact)</option>
              <option value="8pt">8pt (Ultra Compact)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
