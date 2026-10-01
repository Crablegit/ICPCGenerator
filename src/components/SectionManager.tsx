'use client';

import React, { useRef, useState } from 'react';
import { Section, Snippet } from '@/types/notebook';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderPlus, 
  FileCode, 
  Upload, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Plus, 
  FileText, 
  FolderArchive,
  Folder,
  Layers,
  Edit2,
  Check,
  Eraser
} from 'lucide-react';
import { parseFolderFiles, parseZipArchive } from '@/lib/folderParser';

interface SectionManagerProps {
  sections: Section[];
  selectedSnippetId: string | null;
  onSelectSnippet: (id: string) => void;
  onUpdateSections: (sections: Section[]) => void;
}

export const SectionManager: React.FC<SectionManagerProps> = ({
  sections,
  selectedSnippetId,
  onSelectSnippet,
  onUpdateSections
}) => {
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);
  const categoryListRef = useRef<HTMLDivElement>(null);

  const [activeSectionForUpload, setActiveSectionForUpload] = useState<string | null>(null);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Add new section and auto-scroll to bottom
  const handleAddSection = () => {
    const nextNum = sections.length + 1;
    const newId = `sec-${Date.now()}`;
    const defaultTitle = `${nextNum} New Category`;
    const newSection: Section = {
      id: newId,
      title: defaultTitle,
      snippets: []
    };
    onUpdateSections([...sections, newSection]);

    // Immediately trigger edit mode for the newly added category
    setEditingSectionId(newId);
    setEditingTitle(defaultTitle);

    // Auto-scroll the categories container to the very bottom
    setTimeout(() => {
      if (categoryListRef.current) {
        categoryListRef.current.scrollTo({
          top: categoryListRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 120);
  };

  // Move Section Up/Down
  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sections.length - 1) return;
    const newSections = [...sections];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = newSections[idx];
    newSections[idx] = newSections[targetIdx];
    newSections[targetIdx] = temp;
    onUpdateSections(newSections);
  };

  // Delete Section
  const handleDeleteSection = (secId: string) => {
    if (confirm('Delete this category and all its code files?')) {
      onUpdateSections(sections.filter(s => s.id !== secId));
    }
  };

  // Clear all files in a specific section
  const handleClearSectionFiles = (secId: string, title: string) => {
    if (confirm(`Clear all code files inside "${title}"?`)) {
      onUpdateSections(
        sections.map(s => s.id === secId ? { ...s, snippets: [] } : s)
      );
      showStatus(`Cleared files in "${title}"`);
    }
  };

  // Rename section
  const handleStartRename = (sec: Section) => {
    setEditingSectionId(sec.id);
    setEditingTitle(sec.title);
  };

  const handleSaveRename = (secId: string) => {
    if (!editingTitle.trim()) return;
    onUpdateSections(
      sections.map(s => s.id === secId ? { ...s, title: editingTitle.trim() } : s)
    );
    setEditingSectionId(null);
  };

  // Move snippet
  const handleMoveSnippet = (secId: string, snipIdx: number, direction: 'up' | 'down') => {
    onUpdateSections(
      sections.map(sec => {
        if (sec.id !== secId) return sec;
        if (direction === 'up' && snipIdx === 0) return sec;
        if (direction === 'down' && snipIdx === sec.snippets.length - 1) return sec;
        const targetIdx = direction === 'up' ? snipIdx - 1 : snipIdx + 1;
        const newSnippets = [...sec.snippets];
        const temp = newSnippets[snipIdx];
        newSnippets[snipIdx] = newSnippets[targetIdx];
        newSnippets[targetIdx] = temp;
        return { ...sec, snippets: newSnippets };
      })
    );
  };

  // Delete snippet
  const handleDeleteSnippet = (secId: string, snipId: string) => {
    onUpdateSections(
      sections.map(sec => {
        if (sec.id !== secId) return sec;
        return {
          ...sec,
          snippets: sec.snippets.filter(sn => sn.id !== snipId)
        };
      })
    );
  };

  // Add blank snippet
  const handleAddSnippet = (secId: string) => {
    const newSnip: Snippet = {
      id: `snip-${Date.now()}`,
      title: 'new_algorithm',
      filename: 'new_algorithm.cpp',
      language: 'cpp',
      content: '// Enter code here\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    return 0;\n}'
    };
    onUpdateSections(
      sections.map(sec => {
        if (sec.id !== secId) return sec;
        return { ...sec, snippets: [...sec.snippets, newSnip] };
      })
    );
    onSelectSnippet(newSnip.id);
  };

  // Upload to specific section
  const handleTriggerSectionFileUpload = (secId: string) => {
    setActiveSectionForUpload(secId);
    singleFileInputRef.current?.click();
  };

  const handleSectionFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !activeSectionForUpload) return;
    const files = Array.from(e.target.files);
    const newSnippets: Snippet[] = [];

    for (const file of files) {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      let content = await file.text();
      if (!content || content.trim().length === 0) {
        content = `// Empty source file: ${file.name}\n// Paste your algorithm code here\n`;
      }
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      let lang = 'cpp';
      if (ext === '.py') lang = 'python';
      else if (ext === '.java') lang = 'java';
      else if (ext === '.tex') lang = 'tex';

      newSnippets.push({
        id: `snip-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: nameWithoutExt.replace(/_/g, ' '),
        filename: file.name,
        language: lang,
        content: content,
        isTex: ext === '.tex'
      });
    }

    onUpdateSections(
      sections.map(sec => {
        if (sec.id !== activeSectionForUpload) return sec;
        return { ...sec, snippets: [...sec.snippets, ...newSnippets] };
      })
    );

    showStatus(`Added ${newSnippets.length} file(s)!`);
    e.target.value = '';
    setActiveSectionForUpload(null);
  };

  // Bulk Folder Upload
  const handleFolderUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const parsedSections = await parseFolderFiles(e.target.files);
      if (parsedSections.length > 0) {
        onUpdateSections(parsedSections);
        showStatus(`Imported ${parsedSections.length} categories!`);
        if (parsedSections[0].snippets.length > 0) {
          onSelectSnippet(parsedSections[0].snippets[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error reading folder.');
    }
    e.target.value = '';
  };

  // Bulk ZIP Upload
  const handleZipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      const file = e.target.files[0];
      const parsedSections = await parseZipArchive(file);
      if (parsedSections.length > 0) {
        onUpdateSections(parsedSections);
        showStatus(`Extracted ${parsedSections.length} categories!`);
        if (parsedSections[0].snippets.length > 0) {
          onSelectSnippet(parsedSections[0].snippets[0].id);
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error parsing ZIP.');
    }
    e.target.value = '';
  };

  // Drag & drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const firstFile = e.dataTransfer.files[0];
      if (firstFile.name.endsWith('.zip')) {
        const parsed = await parseZipArchive(firstFile);
        if (parsed.length > 0) {
          onUpdateSections(parsed);
          showStatus(`Imported ${parsed.length} categories from ZIP!`);
        }
        return;
      }

      const parsed = await parseFolderFiles(Array.from(e.dataTransfer.files));
      if (parsed.length > 0) {
        onUpdateSections(parsed);
        showStatus(`Imported ${parsed.length} categories from folder!`);
      }
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        multiple
        className="hidden"
        onChange={handleFolderUpload}
      />
      <input
        ref={zipInputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={handleZipUpload}
      />
      <input
        ref={singleFileInputRef}
        type="file"
        multiple
        accept=".cpp,.cc,.c,.h,.hpp,.java,.py,.tex,.txt"
        className="hidden"
        onChange={handleSectionFilesSelected}
      />

      {/* Bulk Upload Dropzone with Neon Border */}
      <motion.div
        whileHover={{ scale: 1.005 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`rounded-2xl border-2 border-dashed p-4 text-center transition-all ${
          isDragging 
            ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] bg-indigo-50/50 dark:border-pink-500 dark:shadow-[0_0_22px_rgba(244,63,94,0.6)] dark:bg-pink-500/10' 
            : 'border-slate-200 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-900/40 hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.3)] dark:hover:border-pink-500 dark:hover:shadow-[0_0_16px_rgba(244,63,94,0.4)]'
        }`}
      >
        <div className="flex items-center justify-center space-x-2 text-slate-800 dark:text-zinc-200 mb-1">
          <Folder className="h-4 w-4 text-indigo-600 dark:text-pink-500" />
          <span className="text-xs font-bold uppercase tracking-wider">Bulk Upload Root Folder</span>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-zinc-400 mb-3 px-2">
          Each subfolder becomes a category with its code files (.cpp, .py, .java, .tex).
        </p>

        <div className="flex items-center justify-center gap-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => folderInputRef.current?.click()}
            className="flex items-center space-x-1.5 rounded-full border border-indigo-400 dark:border-pink-400 bg-indigo-600 hover:bg-indigo-500 dark:bg-pink-600 dark:hover:bg-pink-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_0_14px_rgba(99,102,241,0.45)] dark:shadow-[0_0_16px_rgba(244,63,94,0.55)] transition cursor-pointer"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>Select Folder</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => zipInputRef.current?.click()}
            className="flex items-center space-x-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 hover:border-indigo-400 dark:hover:border-pink-500/50 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 transition cursor-pointer"
          >
            <FolderArchive className="h-3.5 w-3.5 text-indigo-500 dark:text-pink-400" />
            <span>Select .ZIP</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Status banner */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-xl bg-emerald-500/10 dark:bg-pink-500/15 border border-emerald-500/30 dark:border-pink-500/40 shadow-[0_0_12px_rgba(244,63,94,0.25)] px-3.5 py-2 text-xs text-emerald-700 dark:text-pink-300 flex items-center space-x-2"
          >
            <Check className="h-4 w-4" />
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sections Tree List Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-indigo-600 dark:text-pink-500" />
          <h3 className="text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider">
            Categories ({sections.length})
          </h3>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleAddSection}
          className="flex items-center space-x-1 rounded-full bg-indigo-50 dark:bg-pink-500/10 border border-indigo-200 dark:border-pink-500/40 hover:border-indigo-500 dark:hover:border-pink-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.35)] dark:hover:shadow-[0_0_14px_rgba(244,63,94,0.5)] px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-pink-400 hover:bg-indigo-100 dark:hover:bg-pink-500/20 transition cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Category</span>
        </motion.button>
      </div>

      {/* Category List with Auto-Scroll Ref */}
      <div
        ref={categoryListRef}
        className="space-y-3 overflow-y-auto max-h-[calc(100vh-23rem)] pr-1 scroll-smooth"
      >
        {sections.map((section, secIdx) => (
          <div
            key={section.id}
            className="rounded-2xl border border-slate-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-950/80 overflow-hidden shadow-sm transition-all hover:border-indigo-400/80 dark:hover:border-pink-500/60 hover:shadow-[0_0_16px_rgba(99,102,241,0.2)] dark:hover:shadow-[0_0_18px_rgba(244,63,94,0.3)]"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between bg-slate-50/80 dark:bg-zinc-900/60 px-3 py-2 border-b border-slate-100 dark:border-zinc-800/80">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <Folder className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                {editingSectionId === section.id ? (
                  <div className="flex items-center space-x-1 flex-1">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(section.id)}
                      autoFocus
                      className="w-full rounded-md bg-white dark:bg-black px-2 py-0.5 text-xs text-slate-900 dark:text-white border border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.4)] dark:border-pink-500 dark:shadow-[0_0_12px_rgba(244,63,94,0.5)] focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRename(section.id)}
                      className="p-1 text-emerald-600 dark:text-pink-400 hover:opacity-80"
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <span
                    onClick={() => handleStartRename(section)}
                    className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate cursor-pointer hover:text-indigo-600 dark:hover:text-pink-400 transition"
                    title="Click to rename category"
                  >
                    {section.title}
                  </span>
                )}
                <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                  ({section.snippets.length})
                </span>
              </div>

              {/* Section Controls Toolbar */}
              <div className="flex items-center space-x-0.5 shrink-0 ml-2">
                {/* Upload code files to this category */}
                <button
                  onClick={() => handleTriggerSectionFileUpload(section.id)}
                  className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-pink-400 transition rounded"
                  title="Upload code files to this category"
                >
                  <Upload className="h-3.5 w-3.5" />
                </button>
                {/* Add new code snippet */}
                <button
                  onClick={() => handleAddSnippet(section.id)}
                  className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-pink-400 transition rounded"
                  title="Add code snippet"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                {/* Clear all files in this section */}
                <button
                  onClick={() => handleClearSectionFiles(section.id, section.title)}
                  className="p-1 text-slate-400 hover:text-amber-500 transition rounded"
                  title="Clear all files in this category"
                >
                  <Eraser className="h-3.5 w-3.5" />
                </button>
                {/* Move category up */}
                <button
                  onClick={() => handleMoveSection(secIdx, 'up')}
                  disabled={secIdx === 0}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 disabled:opacity-20 rounded"
                  title="Move category up"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </button>
                {/* Move category down */}
                <button
                  onClick={() => handleMoveSection(secIdx, 'down')}
                  disabled={secIdx === sections.length - 1}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 disabled:opacity-20 rounded"
                  title="Move category down"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {/* Rename */}
                <button
                  onClick={() => handleStartRename(section)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 rounded"
                  title="Rename category"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
                {/* Delete category */}
                <button
                  onClick={() => handleDeleteSection(section.id)}
                  className="p-1 text-red-400 hover:text-red-500 rounded"
                  title="Delete category"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Snippets list */}
            <div className="p-2 space-y-1">
              {section.snippets.length === 0 ? (
                <div 
                  onClick={() => handleTriggerSectionFileUpload(section.id)}
                  className="group flex flex-col items-center justify-center py-3 px-2 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 hover:border-indigo-500 hover:shadow-[0_0_12px_rgba(99,102,241,0.3)] dark:hover:border-pink-500 dark:hover:shadow-[0_0_14px_rgba(244,63,94,0.4)] text-slate-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-pink-400 cursor-pointer transition text-center"
                >
                  <span className="text-[11px] font-medium">+ Upload or add code here</span>
                </div>
              ) : (
                section.snippets.map((snip, snipIdx) => {
                  const isSelected = selectedSnippetId === snip.id;
                  return (
                    <motion.div
                      key={snip.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onSelectSnippet(snip.id)}
                      className={`group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition cursor-pointer ${
                        isSelected
                          ? 'border border-indigo-500 shadow-[0_0_14px_rgba(99,102,241,0.4)] bg-indigo-50/80 text-indigo-700 dark:border-pink-500 dark:shadow-[0_0_16px_rgba(244,63,94,0.55)] dark:bg-pink-500/15 dark:text-pink-300'
                          : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        {snip.isTex || snip.language === 'tex' ? (
                          <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        ) : (
                          <FileCode className="h-3.5 w-3.5 text-indigo-500 dark:text-pink-400 shrink-0" />
                        )}
                        <span className="truncate">{snip.title}</span>
                        <span className="rounded-md bg-slate-100 dark:bg-zinc-900 px-1.5 py-0.2 text-[9px] font-mono text-slate-500 dark:text-zinc-400 uppercase">
                          {snip.isTex ? 'TEX' : snip.language}
                        </span>
                      </div>

                      {/* Snippet item controls */}
                      <div className="flex items-center space-x-0.5 opacity-0 group-hover:opacity-100 transition shrink-0 ml-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSnippet(section.id, snipIdx, 'up');
                          }}
                          disabled={snipIdx === 0}
                          className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 disabled:opacity-20"
                          title="Move up"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveSnippet(section.id, snipIdx, 'down');
                          }}
                          disabled={snipIdx === section.snippets.length - 1}
                          className="p-0.5 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 disabled:opacity-20"
                          title="Move down"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSnippet(section.id, snip.id);
                          }}
                          className="p-0.5 text-red-400 hover:text-red-500"
                          title="Delete file"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
