import { createClient } from '@supabase/supabase-js';
import { NotebookData } from '@/types/notebook';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const SQL_SCHEMA_INSTRUCTIONS = `-- Copy and run this in your Supabase SQL Editor:
create table if not exists public.notebooks (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null default 'Team Notebook',
  data jsonb not null
);

-- Enable Row Level Security (RLS)
alter table public.notebooks enable row level security;

-- Allow public read and write for sharing
create policy "Allow public read" on public.notebooks for select using (true);
create policy "Allow public insert" on public.notebooks for insert with check (true);
create policy "Allow public update" on public.notebooks for update using (true);
`;

/**
 * Save notebook to Supabase or localStorage
 */
export async function saveNotebook(notebook: NotebookData): Promise<{ id: string; isCloud: boolean }> {
  const updatedData: NotebookData = {
    ...notebook,
    updatedAt: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    try {
      if (notebook.id) {
        const { error } = await supabase
          .from('notebooks')
          .update({
            title: notebook.config.title || 'Team Notebook',
            data: updatedData,
            updated_at: new Date().toISOString()
          })
          .eq('id', notebook.id);

        if (error) throw error;
        return { id: notebook.id, isCloud: true };
      } else {
        const { data, error } = await supabase
          .from('notebooks')
          .insert({
            title: notebook.config.title || 'Team Notebook',
            data: updatedData
          })
          .select('id')
          .single();

        if (error) throw error;
        return { id: data.id, isCloud: true };
      }
    } catch (err) {
      console.warn('Supabase save error, falling back to localStorage:', err);
    }
  }

  // Local fallback
  const localId = notebook.id || `local-${Date.now()}`;
  localStorage.setItem(`icpc_notebook_${localId}`, JSON.stringify(updatedData));
  localStorage.setItem('icpc_notebook_last_id', localId);
  return { id: localId, isCloud: false };
}

/**
 * Load notebook from Supabase or localStorage
 */
export async function loadNotebook(id: string): Promise<NotebookData | null> {
  if (isSupabaseConfigured && supabase && !id.startsWith('local-')) {
    try {
      const { data, error } = await supabase
        .from('notebooks')
        .select('data')
        .eq('id', id)
        .single();

      if (!error && data && data.data) {
        return data.data as NotebookData;
      }
    } catch (err) {
      console.warn('Failed loading from Supabase:', err);
    }
  }

  // Check localStorage
  const saved = localStorage.getItem(`icpc_notebook_${id}`);
  if (saved) {
    try {
      return JSON.parse(saved) as NotebookData;
    } catch (e) {
      console.error(e);
    }
  }
  return null;
}
