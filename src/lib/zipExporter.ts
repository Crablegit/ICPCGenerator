import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { NotebookData } from '@/types/notebook';
import { generateLatex } from './latexGenerator';

export async function exportZip(notebook: NotebookData) {
  const zip = new JSZip();
  const latexCode = generateLatex(notebook);

  // Add root notebook.tex
  zip.file('notebook.tex', latexCode);

  // Add source code organized in folders
  notebook.sections.forEach((sec, idx) => {
    // Format folder name: e.g. "01_Algorithms"
    const safeSecTitle = `${String(idx + 1).padStart(2, '0')}_${sec.title.replace(/^[0-9.]+\s*/, '').replace(/[^a-zA-Z0-9_-]/g, '_')}`;
    const folder = zip.folder(safeSecTitle);

    sec.snippets.forEach((snip) => {
      let ext = '.cpp';
      if (snip.language === 'python') ext = '.py';
      else if (snip.language === 'java') ext = '.java';
      else if (snip.language === 'tex' || snip.isTex) ext = '.tex';
      
      let fname = snip.filename;
      if (!fname.includes('.')) fname += ext;
      
      folder?.file(fname, snip.content);
    });
  });

  // Add Windows compile script
  const compileBat = `@echo off
echo Compiling ICPC Team Notebook (Pass 1 of 2)...
pdflatex -interaction=nonstopmode notebook.tex
echo Compiling Pass 2 (for Table of Contents)...
pdflatex -interaction=nonstopmode notebook.tex
echo Done! Output saved to notebook.pdf
pause
`;
  zip.file('compile.bat', compileBat);

  // Add Linux / Mac compile script
  const compileSh = `#!/usr/bin/env bash
echo "Compiling ICPC Team Notebook (Pass 1 of 2)..."
pdflatex -interaction=nonstopmode notebook.tex
echo "Compiling Pass 2 (for Table of Contents)..."
pdflatex -interaction=nonstopmode notebook.tex
echo "Done! Output saved to notebook.pdf"
`;
  zip.file('compile.sh', compileSh);

  // Add Free GitHub Action for auto-compilation
  const githubAction = `name: Build ICPC Notebook PDF

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Compile LaTeX document
        uses: xu-cheng/latex-action@v3
        with:
          root_file: notebook.tex
          args: -pdf -file-line-error -interaction=nonstopmode

      - name: Upload PDF artifact
        uses: actions/upload-artifact@v4
        with:
          name: ICPC-Notebook
          path: notebook.pdf
`;
  zip.file('.github/workflows/build-notebook.yml', githubAction);

  // Add Readme
  const readme = `# ICPC Team Notebook

Generated with **ICPC Notebook Generator** (based on codes2pdf).

## How to Compile to PDF for Free (No Paid Server Needed)

### Method 1: 1-Click in Overleaf (Recommended)
1. Go back to the web app and click **"Open in Overleaf"**.
2. Overleaf compiles the PDF instantly in the cloud for free!

### Method 2: Free GitHub Actions (Automated CI/CD)
1. Push this folder to a GitHub repository.
2. Go to **Actions** tab on GitHub -> The \`Build ICPC Notebook PDF\` workflow will run automatically.
3. Download the generated \`notebook.pdf\` artifact. (GitHub provides 2,000 free minutes/month).

### Method 3: Local Compilation
- **Windows**: Run \`compile.bat\` (requires MiKTeX or TeX Live installed).
- **Linux/Mac**: Run \`chmod +x compile.sh && ./compile.sh\` (requires \`texlive-full\` or \`texlive-latex-extra\`).
`;
  zip.file('README.md', readme);

  // Generate and trigger download
  const blob = await zip.generateAsync({ type: 'blob' });
  const safeFilename = `${(notebook.config.teamName || 'ICPC_Notebook').replace(/[^a-zA-Z0-9_-]/g, '_')}.zip`;
  saveAs(blob, safeFilename);
}
