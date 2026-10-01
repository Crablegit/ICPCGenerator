import JSZip from 'jszip';
import { Section, Snippet } from '@/types/notebook';

const VALID_EXTENSIONS = ['.cpp', '.cc', '.c', '.h', '.hpp', '.java', '.py', '.tex', '.txt', '.kt', '.rs', '.go'];

function detectLanguage(ext: string): string {
  switch (ext) {
    case '.cpp':
    case '.cc':
    case '.c':
    case '.h':
    case '.hpp':
      return 'cpp';
    case '.java':
      return 'java';
    case '.py':
      return 'python';
    case '.tex':
      return 'tex';
    case '.kt':
      return 'kotlin';
    case '.rs':
      return 'rust';
    case '.go':
      return 'go';
    default:
      return 'text';
  }
}

function cleanTitle(filename: string): string {
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
  return nameWithoutExt.replace(/_/g, ' ').replace(/-/g, ' ');
}

/**
 * Natural sort comparison for section titles like "1 Algorithms", "2 DP", "10 Strings"
 */
export function naturalSortCompare(a: string, b: string): number {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

/**
 * Parses files uploaded via HTML5 webkitdirectory folder picker
 */
export async function parseFolderFiles(files: FileList | File[]): Promise<Section[]> {
  const sectionMap = new Map<string, Snippet[]>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const path = file.webkitRelativePath || file.name;

    // Ignore hidden files or system files
    if (path.split('/').some(part => part.startsWith('.'))) continue;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!VALID_EXTENSIONS.includes(ext)) continue;

    // Determine section name from relative path
    const parts = path.split('/');
    let sectionName = 'General';

    if (parts.length >= 3) {
      // e.g. RootFolder / SectionName / Sub / file.cpp
      sectionName = parts[1];
    } else if (parts.length === 2) {
      // e.g. SectionName / file.cpp
      sectionName = parts[0];
    }

    try {
      const content = await file.text();
      const lang = detectLanguage(ext);
      const isTex = ext === '.tex';

      const snippet: Snippet = {
        id: `snip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: cleanTitle(file.name),
        filename: file.name,
        language: lang,
        content: content,
        isTex: isTex
      };

      if (!sectionMap.has(sectionName)) {
        sectionMap.set(sectionName, []);
      }
      sectionMap.get(sectionName)!.push(snippet);
    } catch (err) {
      console.warn(`Failed reading file: ${file.name}`, err);
    }
  }

  // Convert map to Section array sorted naturally
  const sections: Section[] = [];
  const sortedSectionNames = Array.from(sectionMap.keys()).sort(naturalSortCompare);

  sortedSectionNames.forEach((title, idx) => {
    sections.push({
      id: `sec-${idx + 1}-${Date.now()}`,
      title: title,
      snippets: sectionMap.get(title) || []
    });
  });

  return sections;
}

/**
 * Parses a ZIP archive containing folders and files
 */
export async function parseZipArchive(zipFile: File): Promise<Section[]> {
  const zip = new JSZip();
  const loaded = await zip.loadAsync(zipFile);
  const sectionMap = new Map<string, Snippet[]>();

  const entries = Object.keys(loaded.files);

  for (const filename of entries) {
    const entry = loaded.files[filename];
    if (entry.dir) continue;

    // Ignore hidden or OS files
    if (filename.split('/').some(p => p.startsWith('.') || p.startsWith('__MACOSX'))) continue;

    const parts = filename.split('/');
    const baseName = parts[parts.length - 1];
    const ext = '.' + baseName.split('.').pop()?.toLowerCase();

    if (!VALID_EXTENSIONS.includes(ext)) continue;

    let sectionName = 'General';
    if (parts.length >= 3) {
      sectionName = parts[1];
    } else if (parts.length === 2) {
      sectionName = parts[0];
    }

    const content = await entry.async('string');
    const lang = detectLanguage(ext);
    const isTex = ext === '.tex';

    const snippet: Snippet = {
      id: `snip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: cleanTitle(baseName),
      filename: baseName,
      language: lang,
      content: content,
      isTex: isTex
    };

    if (!sectionMap.has(sectionName)) {
      sectionMap.set(sectionName, []);
    }
    sectionMap.get(sectionName)!.push(snippet);
  }

  const sections: Section[] = [];
  const sortedNames = Array.from(sectionMap.keys()).sort(naturalSortCompare);

  sortedNames.forEach((title, idx) => {
    sections.push({
      id: `sec-${idx + 1}-${Date.now()}`,
      title: title,
      snippets: sectionMap.get(title) || []
    });
  });

  return sections;
}
