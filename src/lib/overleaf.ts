import JSZip from 'jszip';
import { NotebookData } from '@/types/notebook';
import { generateLatex } from './latexGenerator';

/**
 * Opens LaTeX code in Overleaf via official API.
 * If a school logo image is present, packages into a data:application/zip;base64,... URI
 * so Overleaf extracts BOTH main.tex AND logo.png automatically without any server or cost.
 * Supports passing either NotebookData or raw LaTeX string.
 */
export async function openInOverleaf(notebookOrLatex: NotebookData | string) {
  if (typeof window === 'undefined') return;

  let latexCode: string;
  let logoBase64: string | undefined;
  let title = 'Team_Notebook';

  if (typeof notebookOrLatex === 'string') {
    latexCode = notebookOrLatex;
  } else {
    latexCode = generateLatex(notebookOrLatex);
    logoBase64 = notebookOrLatex.config.schoolLogo;
    title = (notebookOrLatex.config.title || 'Team_Notebook').replace(/\s+/g, '_');
  }

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://www.overleaf.com/docs';
  form.target = '_blank';

  if (logoBase64) {
    const zip = new JSZip();
    zip.file('main.tex', latexCode);

    // Extract base64 image data
    try {
      const parts = logoBase64.split(',');
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      zip.file('logo.png', base64Data, { base64: true });
    } catch (e) {
      console.warn('Failed to embed logo into zip', e);
    }

    const zipBase64 = await zip.generateAsync({ type: 'base64' });

    const snipUriInput = document.createElement('input');
    snipUriInput.type = 'hidden';
    snipUriInput.name = 'snip_uri';
    snipUriInput.value = `data:application/zip;base64,${zipBase64}`;
    form.appendChild(snipUriInput);

    const nameInput = document.createElement('input');
    nameInput.type = 'hidden';
    nameInput.name = 'snip_name';
    nameInput.value = title;
    form.appendChild(nameInput);
  } else {
    const textarea = document.createElement('textarea');
    textarea.name = 'snip';
    textarea.value = latexCode;
    form.appendChild(textarea);
  }

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}

/**
 * Downloads a local ZIP file containing main.tex and logo.png
 */
export async function downloadProjectZip(notebook: NotebookData) {
  if (typeof window === 'undefined') return;

  const latexCode = generateLatex(notebook);
  const { config } = notebook;
  const zip = new JSZip();

  zip.file('main.tex', latexCode);

  if (config.schoolLogo) {
    try {
      const parts = config.schoolLogo.split(',');
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      zip.file('logo.png', base64Data, { base64: true });
    } catch (e) {
      console.warn('Failed embedding logo', e);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(content);
  a.download = `${(config.title || 'Team_Notebook').replace(/\s+/g, '_')}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
