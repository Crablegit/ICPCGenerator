/**
 * Opens LaTeX code in Overleaf via the free official snip API
 * Does not require any server or VM.
 */
export function openInOverleaf(latexCode: string) {
  if (typeof window === 'undefined') return;

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://www.overleaf.com/docs';
  form.target = '_blank';

  const textarea = document.createElement('textarea');
  textarea.name = 'snip';
  textarea.value = latexCode;
  form.appendChild(textarea);

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
