/**
 * Notes service — all CRUD operations for the notes table.
 * DB column names use snake_case; we map them to camelCase TypeScript types.
 */
import { supabase } from '../lib/supabase';
import type { TablesUpdate } from '../types/database';
import type { Note, ExamType } from '../types';

// ─── Shape mappers ───────────────────────────────────────────────────────────

/** Map a DB row → frontend Note type */
function rowToNote(row: {
  id: string;
  course: string;
  subject: string;
  chapter: string;
  title: string;
  description: string;
  file_url: string;
  file_size: string;
  original_filename?: string;
  download_count: number;
}): Note {
  return {
    id: row.id,
    course: row.course as ExamType,
    subject: row.subject,
    chapter: row.chapter,
    title: row.title,
    description: row.description,
    fileUrl: row.file_url,
    fileSize: row.file_size,
    originalFilename: row.original_filename,
    downloadCount: row.download_count,
  };
}

// ─── Queries ─────────────────────────────────────────────────────────────────

/** Fetch all notes, ordered by course then title */
export async function fetchNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchNotes: ${error.message}`);
  return (data ?? []).map(rowToNote);
}

/** Insert a new note. Returns the created record. */
export async function createNote(
  note: Omit<Note, 'id' | 'downloadCount'>
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert({
      course: note.course,
      subject: note.subject,
      chapter: note.chapter,
      title: note.title,
      description: note.description,
      file_url: note.fileUrl,
      file_size: note.fileSize,
      original_filename: note.originalFilename || '',
      download_count: 0,
    })
    .select()
    .single();

  if (error) throw new Error(`createNote: ${error.message}`);
  return rowToNote(data);
}

/** Update note fields by id. */
export async function updateNote(
  id: string,
  fields: Partial<Omit<Note, 'id'>>
): Promise<Note> {
  const updatePayload: TablesUpdate<'notes'> = {};
  if (fields.course !== undefined) updatePayload.course = fields.course;
  if (fields.subject !== undefined) updatePayload.subject = fields.subject;
  if (fields.chapter !== undefined) updatePayload.chapter = fields.chapter;
  if (fields.title !== undefined) updatePayload.title = fields.title;
  if (fields.description !== undefined) updatePayload.description = fields.description;
  if (fields.fileUrl !== undefined) updatePayload.file_url = fields.fileUrl;
  if (fields.fileSize !== undefined) updatePayload.file_size = fields.fileSize;
  if (fields.originalFilename !== undefined) updatePayload.original_filename = fields.originalFilename;
  if (fields.downloadCount !== undefined) updatePayload.download_count = fields.downloadCount;

  const { data, error } = await supabase
    .from('notes')
    .update(updatePayload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateNote: ${error.message}`);
  return rowToNote(data);
}

/** Increment the download count for a note by 1. */
export async function incrementNoteDownload(id: string): Promise<void> {
  const { error } = await supabase.rpc('increment_note_download' as never, { note_id: id } as never);

  if (error) {
    // Fallback: fetch current count, then update
    const { data: current, error: fetchErr } = await supabase
      .from('notes')
      .select('download_count')
      .eq('id', id)
      .single();

    if (fetchErr) throw new Error(`incrementNoteDownload fetch: ${fetchErr.message}`);

    const { error: updateErr } = await supabase
      .from('notes')
      .update({ download_count: (current?.download_count ?? 0) + 1 })
      .eq('id', id);

    if (updateErr) throw new Error(`incrementNoteDownload update: ${updateErr.message}`);
  }
}

/** Delete a note by id. */
export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw new Error(`deleteNote: ${error.message}`);
}
