export interface Snippet {
  id: string;
  title: string;
  filename: string;
  language: string;
  content: string;
  isTex?: boolean;
  description?: string;
}

export interface Section {
  id: string;
  title: string;
  snippets: Snippet[];
}

export interface NotebookConfig {
  title: string;
  teamName: string;
  university: string;
  date: string;
  initials: string;
  schoolLogo?: string; // base64 or URL of the school logo
  columns: 2 | 3;
  orientation: 'landscape' | 'portrait';
  fontSize: '8pt' | '9pt' | '10pt';
  columnSep: string;
  columnRule: boolean;
  lineNumbers: boolean;
  tabSize: number;
}

export interface NotebookData {
  id?: string;
  config: NotebookConfig;
  sections: Section[];
  updatedAt: string;
}
