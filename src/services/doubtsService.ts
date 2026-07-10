/**
 * Doubts service — submit, reply, and manage doubt tickets.
 * Students can insert without auth; professors can update/delete.
 */
import { supabase } from '../lib/supabase';
import type { Doubt, DoubtReply } from '../types';

function rowToDoubt(row: any): Doubt {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    question: row.question,
    attachmentName: row.attachment_name ?? undefined,
    attachmentUrl: row.attachment_url ?? undefined,
    answerText: row.answer_text ?? undefined,
    isAnswered: row.is_answered,
    createdAt: row.created_at,
    replies: row.doubt_replies ? row.doubt_replies.map((reply: any) => ({
      id: reply.id,
      doubt_id: reply.doubt_id,
      professor_id: reply.professor_id,
      reply_text: reply.reply_text,
      image_urls: reply.image_urls || [],
      video_urls: reply.video_urls || [],
      audio_urls: reply.audio_urls || [],
      attachment_urls: reply.attachment_urls || [],
      created_at: reply.created_at,
      updated_at: reply.updated_at,
      is_edited: reply.is_edited,
      reply_order: reply.reply_order
    })).sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) : []
  };
}

export async function fetchDoubts(): Promise<Doubt[]> {
  try {
    const { data, error } = await supabase
      .from('doubts')
      .select('*, doubt_replies(*)')
      .order('created_at', { ascending: false });

    if (error) {
      if (error.message.includes('relationship') || error.code === 'PGRST200') {
        throw new Error('Fallback to simple query');
      }
      throw new Error(`fetchDoubts: ${error.message}`);
    }
    return (data ?? []).map(rowToDoubt);
  } catch (err: any) {
    // Fallback if doubt_replies relation doesn't exist yet in Supabase
    const { data, error } = await supabase
      .from('doubts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`fetchDoubts (fallback): ${error.message}`);
    return (data ?? []).map(rowToDoubt);
  }
}

/** Submit a new doubt. No auth required (RLS allows public insert). */
export async function submitDoubt(
  doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt' | 'replies'>
): Promise<Doubt> {
  const { data, error } = await supabase
    .from('doubts')
    .insert({
      name: doubt.name,
      email: doubt.email,
      subject: doubt.subject,
      question: doubt.question,
      attachment_name: doubt.attachmentName ?? null,
      attachment_url: doubt.attachmentUrl ?? null,
      is_answered: false,
    })
    .select()
    .single();

  if (error) throw new Error(`submitDoubt: ${error.message}`);
  return rowToDoubt(data);
}

/** Professor replies to a doubt — marks it as answered. */
export async function replyToDoubt(
  doubtId: string, 
  professorId: string, 
  replyData: {
    reply_text?: string;
    image_urls?: string[];
    video_urls?: string[];
    audio_urls?: string[];
    attachment_urls?: string[];
  }
): Promise<Doubt> {
  const { data: replyDataInsert, error: replyError } = await supabase
    .from('doubt_replies')
    .insert({
      doubt_id: doubtId,
      professor_id: professorId,
      reply_text: replyData.reply_text || null,
      image_urls: replyData.image_urls || [],
      video_urls: replyData.video_urls || [],
      audio_urls: replyData.audio_urls || [],
      attachment_urls: replyData.attachment_urls || []
    });

  if (replyError) {
    if (replyError.code === '42P01') {
      throw new Error("MIGRATION REQUIRED: Please run the SQL migration snippet in your Supabase SQL Editor to create the 'doubt_replies' table before sending rich replies.");
    }
    throw new Error(`replyToDoubt: ${replyError.message}`);
  }
  
  // Mark doubt as answered
  await supabase.from('doubts').update({ is_answered: true }).eq('id', doubtId);
  
  // Fetch and return the updated doubt
  const { data: doubtData, error: doubtError } = await supabase
    .from('doubts')
    .select('*, doubt_replies(*)')
    .eq('id', doubtId)
    .single();

  if (doubtError) throw new Error(`replyToDoubt (fetch): ${doubtError.message}`);

  return rowToDoubt(doubtData);
}

/** Delete a doubt by id (professor only). */
export async function deleteDoubt(id: string): Promise<void> {
  const { error } = await supabase.from('doubts').delete().eq('id', id);
  if (error) throw new Error(`deleteDoubt: ${error.message}`);
}

/**
 * Upload an attachment file for a doubt submission or reply.
 * Returns the public URL of the uploaded file.
 */
export async function uploadDoubtAttachment(file: File, folder: string = 'files'): Promise<{ url: string; name: string }> {
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from('doubts')
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(`uploadDoubtAttachment: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage.from('doubts').getPublicUrl(filename);
  return { url: publicUrl, name: file.name };
}
