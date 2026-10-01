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
 * Intelligently extracts the category/section name from a file path
 * Handles arbitrary nested folders, e.g.
 * "content/DP/file.cpp" -> "DP"
 * "ICPCNotebook-main/content/Geometry/file.cpp" -> "Geometry"
 * "DP/file.cpp" -> "DP"
 * "Graph/Tree/lca.cpp" -> "Graph" (with snippet "Tree - lca")
 */
function extractCategoryAndTitle(normalizedPath: string, filename: string): { category: string; title: string } {
  const parts = normalizedPath.split('/').filter(Boolean);
  
  // If file is directly in root
  if (parts.length <= 1) {
    return { category: 'General', title: cleanTitle(filename) };
  }

  // Filter out wrapper root folders like 'content', 'src', 'codes', etc. if deeper directories exist
  const folderParts = parts.slice(0, parts.length - 1);
  const meaningfulFolders = folderParts.filter((f, idx) => {
    // If it's the only folder, keep it
    if (folderParts.length === 1) return true;
    const lower = f.toLowerCase();
    // Drop top-level generic wrapper names
    if (idx === 0 && (lower.includes('icpc') || lower.includes('notebook') || lower.includes('main') || lower.includes('master'))) {
      return false;
    }
    if ((idx <= 1) && (lower === 'content' || lower === 'src' || lower === 'source' || lower === 'code' || lower === 'codes')) {
      return false;
    }
    return true;
  });

  if (meaningfulFolders.length === 0) {
    // Fallback to the immediate parent folder
    const parentFolder = folderParts[folderParts.length - 1] || 'General';
    return { category: parentFolder, title: cleanTitle(filename) };
  }

  // The primary category is the top meaningful folder
  const category = meaningfulFolders[0];

  // If there are subdirectories (e.g. Graph / Trees / lca.cpp), prepend subdirectory to title
  if (meaningfulFolders.length > 1) {
    const subFolders = meaningfulFolders.slice(1).join(' - ');
    return {
      category,
      title: `${subFolders} - ${cleanTitle(filename)}`
    };
  }

  return {
    category,
    title: cleanTitle(filename)
  };
}

/**
 * Parses files uploaded via HTML5 webkitdirectory folder picker
 */
export async function parseFolderFiles(files: FileList | File[]): Promise<Section[]> {
  const sectionMap = new Map<string, Snippet[]>();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rawPath = file.webkitRelativePath || file.name;
    const normalizedPath = rawPath.replace(/\\/g, '/');

    // Ignore hidden files or system files
    if (normalizedPath.split('/').some(part => part.startsWith('.') || part.startsWith('__MACOSX'))) continue;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!VALID_EXTENSIONS.includes(ext)) continue;

    const { category, title } = extractCategoryAndTitle(normalizedPath, file.name);

    try {
      let content = await file.text();
      // If file is 0 bytes (empty dummy file), provide a helpful comment so it doesn't break
      if (!content || content.trim().length === 0) {
        content = `// Empty source file: ${file.name}\n// Paste your algorithm code here\n`;
      }

      const lang = detectLanguage(ext);
      const isTex = ext === '.tex';

      const snippet: Snippet = {
        id: `snip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: title,
        filename: file.name,
        language: lang,
        content: content,
        isTex: isTex
      };

      if (!sectionMap.has(category)) {
        sectionMap.set(category, []);
      }
      sectionMap.get(category)!.push(snippet);
    } catch (err) {
      console.warn(`Failed reading file: ${file.name}`, err);
    }
  }

  // Convert map to Section array sorted naturally
  const sections: Section[] = [];
  const sortedSectionNames = Array.from(sectionMap.keys()).sort(naturalSortCompare);

  sortedSectionNames.forEach((categoryTitle, idx) => {
    sections.push({
      id: `sec-${idx + 1}-${Date.now()}`,
      title: categoryTitle,
      snippets: sectionMap.get(categoryTitle) || []
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

  for (const rawFilename of entries) {
    const entry = loaded.files[rawFilename];
    if (entry.dir) continue;

    const normalizedPath = rawFilename.replace(/\\/g, '/');

    // Ignore hidden or OS files
    if (normalizedPath.split('/').some(p => p.startsWith('.') || p.startsWith('__MACOSX'))) continue;

    const parts = normalizedPath.split('/');
    const baseName = parts[parts.length - 1];
    const ext = '.' + baseName.split('.').pop()?.toLowerCase();

    if (!VALID_EXTENSIONS.includes(ext)) continue;

    const { category, title } = extractCategoryAndTitle(normalizedPath, baseName);

    let content = await entry.async('string');
    if (!content || content.trim().length === 0) {
      content = `// Empty source file: ${baseName}\n// Paste your algorithm code here\n`;
    }

    const lang = detectLanguage(ext);
    const isTex = ext === '.tex';

    const snippet: Snippet = {
      id: `snip-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: title,
      filename: baseName,
      language: lang,
      content: content,
      isTex: isTex
    };

    if (!sectionMap.has(category)) {
      sectionMap.set(category, []);
    }
    sectionMap.get(category)!.push(snippet);
  }

  const sections: Section[] = [];
  const sortedNames = Array.from(sectionMap.keys()).sort(naturalSortCompare);

  sortedNames.forEach((categoryTitle, idx) => {
    sections.push({
      id: `sec-${idx + 1}-${Date.now()}`,
      title: categoryTitle,
      snippets: sectionMap.get(categoryTitle) || []
    });
  });

  return sections;
}
