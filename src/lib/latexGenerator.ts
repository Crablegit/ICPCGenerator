import { NotebookData } from '@/types/notebook';

/**
 * Escapes LaTeX special characters in titles and plain text headers
 */
export function escapeLatexText(text: string): string {
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

/**
 * Map snippet language to LaTeX listings language
 */
export function mapLanguageToLatex(lang: string): string {
  const l = lang.toLowerCase();
  if (l.includes('c++') || l.includes('cpp') || l === 'cc') return 'C++';
  if (l === 'c') return 'C';
  if (l.includes('java')) return 'Java';
  if (l.includes('python') || l === 'py') return 'Python';
  if (l.includes('kotlin') || l === 'kt') return 'Kotlin';
  return 'C++';
}

/**
 * Generates exact LaTeX source code compatible with codes2pdf
 */
export function generateLatex(notebook: NotebookData): string {
  const { config, sections } = notebook;
  const cols = config.columns || 3;
  const orientation = config.orientation || 'landscape';
  const fontSize = config.fontSize || '10pt';
  const lineNumbers = config.lineNumbers ? 'left' : 'none';
  const tabSize = config.tabSize || 2;
  const columnRule = config.columnRule ? '1px' : '0pt';
  const columnSep = config.columnSep || '0.1in';

  const authorStr = config.university
    ? `${config.teamName} (${config.university})`
    : config.teamName;

  const rawTitle = escapeLatexText(config.title || 'ICPC Notebook');
  const titleFormatted = config.schoolLogo
    ? `\\includegraphics[height=2.2cm,keepaspectratio]{logo.png}\\\\[0.4cm]\n${rawTitle}`
    : rawTitle;

  let out = `\\documentclass[${fontSize},a4paper,onesided]{article}

\\usepackage{multicol}
\\usepackage[utf8]{inputenc}
\\usepackage[english]{babel}
\\usepackage{listings}
\\usepackage{graphicx}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{amsmath}
\\usepackage{amssymb}
\\usepackage{verbatim}
\\usepackage{hyperref}
\\usepackage{geometry}

\\geometry{verbose,${orientation},a4paper,tmargin=1.5cm,bmargin=1.5cm,lmargin=1cm,rmargin=1cm}

\\definecolor{dkgreen}{rgb}{0,0.6,0}
\\definecolor{gray}{rgb}{0.5,0.5,0.5}
\\definecolor{mauve}{rgb}{0.58,0,0.82}
\\definecolor{navy}{rgb}{0,0,0.7}

\\lstset{frame=tb,
  language=C++,
  aboveskip=1mm,
  belowskip=1mm,
  showstringspaces=false,
  columns=flexible,
  basicstyle={\\footnotesize\\ttfamily},
  numbers=${lineNumbers},
  numberstyle=\\tiny\\color{gray},
  keywordstyle=\\color{navy}\\bfseries,
  commentstyle=\\color{dkgreen}\\itshape,
  stringstyle=\\color{mauve},
  breaklines=true,
  breakatwhitespace=false,
  tabsize=${tabSize}
}

\\setlength{\\columnsep}{${columnSep}}
\\setlength{\\columnseprule}{${columnRule}}

\\usepackage{fancyhdr}
\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\fancyhead[R]{\\thepage}
\\fancyhead[L]{${escapeLatexText(config.initials || 'ICPC')}}

\\begin{document}

\\title{${titleFormatted}}
\\author{${escapeLatexText(authorStr || 'Sample Team')}}
\\date{${escapeLatexText(config.date || '\\today')}}
\\maketitle

\\begin{multicols}{${cols}}
\\tableofcontents
\\end{multicols}

\\pagebreak

\\begin{multicols}{${cols}}
\\lstloadlanguages{C++,Java,Python}
`;

  // Walk through sections and snippets
  for (const section of sections) {
    out += `\n\\section{${escapeLatexText(section.title)}}\n`;

    for (const snippet of section.snippets) {
      out += `\\subsection{${escapeLatexText(snippet.title)}}\n`;

      if (snippet.isTex || snippet.language === 'tex') {
        // Raw LaTeX snippet (equations, notes, descriptions)
        out += `${snippet.content.trim()}\n\n`;
      } else {
        const lang = mapLanguageToLatex(snippet.language || snippet.filename);
        out += `\\begin{lstlisting}[language=${lang}]\n${snippet.content.trim()}\n\\end{lstlisting}\n\n`;
      }
    }
  }

  out += `\\end{multicols}\n\\end{document}\n`;

  return out;
}
