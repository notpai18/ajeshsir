/**
 * PYQs service — all CRUD operations for the pyqs table.
 */
import { supabase } from '../lib/supabase';
import type { TablesUpdate } from '../types/database';
import type { PYQ, ExamType } from '../types';

function rowToPyq(row: {
  id: string;
  course: string;
  subject: string;
  chapter: string;
  year: number;
  difficulty: string;
  question_url: string;
  solution_url: string;
  question_size: string;
  solution_size: string;
  question_original_filename?: string;
  solution_original_filename?: string;
}): PYQ {
  return {
    id: row.id,
    course: row.course as ExamType,
    subject: row.subject,
    chapter: row.chapter,
    year: row.year,
    difficulty: row.difficulty as 'Easy' | 'Medium' | 'Hard',
    questionUrl: row.question_url,
    solutionUrl: row.solution_url,
    questionSize: row.question_size,
    solutionSize: row.solution_size,
    questionOriginalFilename: row.question_original_filename,
    solutionOriginalFilename: row.solution_original_filename,
  };
}

export async function fetchPyqs(): Promise<PYQ[]> {
  const { data, error } = await supabase
    .from('pyqs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchPyqs: ${error.message}`);
  return (data ?? []).map(rowToPyq);
}

export async function createPyq(
  pyq: Omit<PYQ, 'id' | 'questionSize' | 'solutionSize'>
): Promise<PYQ> {
  const { data, error } = await supabase
    .from('pyqs')
    .insert({
      course: pyq.course,
      subject: pyq.subject,
      chapter: pyq.chapter,
      year: pyq.year,
      difficulty: pyq.difficulty,
      question_url: pyq.questionUrl,
      solution_url: pyq.solutionUrl,
      question_size: '',
      solution_size: '',
      question_original_filename: pyq.questionOriginalFilename || '',
      solution_original_filename: pyq.solutionOriginalFilename || '',
    })
    .select()
    .single();

  if (error) throw new Error(`createPyq: ${error.message}`);
  return rowToPyq(data);
}

export async function updatePyq(
  id: string,
  fields: Partial<Omit<PYQ, 'id'>>
): Promise<PYQ> {
  const payload: TablesUpdate<'pyqs'> = {};
  if (fields.course !== undefined) payload.course = fields.course;
  if (fields.subject !== undefined) payload.subject = fields.subject;
  if (fields.chapter !== undefined) payload.chapter = fields.chapter;
  if (fields.year !== undefined) payload.year = fields.year;
  if (fields.difficulty !== undefined) payload.difficulty = fields.difficulty;
  if (fields.questionUrl !== undefined) payload.question_url = fields.questionUrl;
  if (fields.solutionUrl !== undefined) payload.solution_url = fields.solutionUrl;
  if (fields.questionSize !== undefined) payload.question_size = fields.questionSize;
  if (fields.solutionSize !== undefined) payload.solution_size = fields.solutionSize;
  if (fields.questionOriginalFilename !== undefined) payload.question_original_filename = fields.questionOriginalFilename;
  if (fields.solutionOriginalFilename !== undefined) payload.solution_original_filename = fields.solutionOriginalFilename;

  const { data, error } = await supabase
    .from('pyqs')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updatePyq: ${error.message}`);
  return rowToPyq(data);
}

export async function deletePyq(id: string): Promise<void> {
  const { error } = await supabase.from('pyqs').delete().eq('id', id);
  if (error) throw new Error(`deletePyq: ${error.message}`);
}
