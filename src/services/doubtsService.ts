/**
 * Doubts service — submit, reply, and manage doubt tickets.
 * Students can insert without auth; professors can update/delete.
 */
import { supabase } from '../lib/supabase';
import type { Doubt, DoubtReply } from '../types';

function rowToDoubt(row: any): Doubt {
  // Derive status: prefer explicit DB status column; fall back to isAnswered boolean
  const deriveStatus = (row: any): import('../types').DoubtStatus => {
    if (row.status) {
      // Normalise any legacy status values that may still exist in the DB
      if (row.status === 'pending_approval' || row.status === 'submitted' || row.status === 'awaiting' || row.status === 'needs-followup') {
        return row.is_answered ? 'answered' : 'pending';
      }
      return row.status;
    }
    return row.is_answered ? 'answered' : 'pending';
  };

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    topic: row.topic ?? undefined,
    question: row.question,
    attachmentName: row.attachment_name ?? undefined,
    attachmentUrl: row.attachment_url ?? undefined,
    answerText: row.answer_text ?? undefined,
    isAnswered: row.is_answered,
    status: deriveStatus(row),
    createdAt: row.created_at,
    // Moderation audit fields
    approvedAt: row.approved_at ?? undefined,
    approvedBy: row.approved_by ?? undefined,
    rejectedAt: row.rejected_at ?? undefined,
    rejectedBy: row.rejected_by ?? undefined,
    rejectionReason: row.rejection_reason ?? undefined,
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
  const payload: any = {
    name: doubt.name,
    email: doubt.email,
    subject: doubt.subject,
    topic: doubt.topic ?? null,
    question: doubt.question,
    attachment_name: doubt.attachmentName ?? null,
    attachment_url: doubt.attachmentUrl ?? null,
    is_answered: false,
    status: 'pending',
  };

  let { data, error } = await supabase
    .from('doubts')
    .insert(payload)
    .select()
    .single();

  let retries = 0;
  while (error && error.message.includes("Could not find the") && retries < 5) {
    const match = error.message.match(/'([^']+)' column/);
    if (match && match[1]) {
      const missingColumn = match[1];
      delete payload[missingColumn];
      const retry = await supabase
        .from('doubts')
        .insert(payload)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
      retries++;
    } else {
      break;
    }
  }

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
    image_names?: string[];
    video_names?: string[];
    audio_names?: string[];
    attachment_names?: string[];
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
      attachment_urls: replyData.attachment_urls || [],
      image_names: replyData.image_names || [],
      video_names: replyData.video_names || [],
      audio_names: replyData.audio_names || [],
      attachment_names: replyData.attachment_names || []
    });

  if (replyError) {
    if (replyError.code === '42P01') {
      throw new Error("MIGRATION REQUIRED: Please run the SQL migration snippet in your Supabase SQL Editor to create the 'doubt_replies' table before sending rich replies.");
    }
    throw new Error(`replyToDoubt: ${replyError.message}`);
  }
  
  // Mark doubt as answered and update status + answered_at
  await supabase.from('doubts').update({
    is_answered: true,
    status: 'answered',
    answered_at: new Date().toISOString()
  }).eq('id', doubtId);
  
  // Fetch and return the updated doubt
  const { data: doubtData, error: doubtError } = await supabase
    .from('doubts')
    .select('*, doubt_replies(*)')
    .eq('id', doubtId)
    .single();

  if (doubtError) throw new Error(`replyToDoubt (fetch): ${doubtError.message}`);

  return rowToDoubt(doubtData);
}

/**
 * Approve a doubt — sets status to 'approved', making it publicly visible.
 * Professor only.
 */
export async function approveDoubt(id: string): Promise<Doubt> {
  const { error } = await supabase
    .from('doubts')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) throw new Error(`approveDoubt: ${error.message}`);

  const { data, error: fetchError } = await supabase
    .from('doubts')
    .select('*, doubt_replies(*)')
    .eq('id', id)
    .single();

  if (fetchError) throw new Error(`approveDoubt (fetch): ${fetchError.message}`);
  return rowToDoubt(data);
}

/**
 * Reject a doubt — sets status to 'rejected', hides it from the public.
 * Professor only. Optional rejection reason shown to the student.
 */
export async function rejectDoubt(id: string, reason?: string): Promise<Doubt> {
  const { error } = await supabase
    .from('doubts')
    .update({
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejection_reason: reason ?? null,
    })
    .eq('id', id);

  if (error) throw new Error(`rejectDoubt: ${error.message}`);

  const { data, error: fetchError } = await supabase
    .from('doubts')
    .select('*, doubt_replies(*)')
    .eq('id', id)
    .single();

  if (fetchError) throw new Error(`rejectDoubt (fetch): ${fetchError.message}`);
  return rowToDoubt(data);
}

/** Delete a doubt by id (professor only). */
export async function deleteDoubt(id: string): Promise<void> {
  const { error } = await supabase.from('doubts').delete().eq('id', id);
  if (error) throw new Error(`deleteDoubt: ${error.message}`);
}

/**
 * Update the explicit status on a doubt (and keep isAnswered in sync).
 */
export async function updateDoubtStatus(
  id: string,
  status: import('../types').DoubtStatus,
  hasReplies: boolean
): Promise<void> {
  const isAnswered = status === 'answered';
  const { error } = await supabase
    .from('doubts')
    .update({ status, is_answered: isAnswered })
    .eq('id', id);
  if (error) throw new Error(`updateDoubtStatus: ${error.message}`);
}

/**
 * No-op: legacy function kept for API compatibility.
 * The new moderation workflow (pending/approved/rejected/answered) does not
 * need a 'submitted → awaiting' transition.
 */
export async function markDoubtSeen(id: string, _currentStatus: import('../types').DoubtStatus): Promise<void> {
  // No-op in the new workflow
}

/**
 * Upload an attachment file for a doubt submission or reply.
 * Returns the public URL of the uploaded file.
 */
export async function uploadDoubtAttachment(file: File, folder: string = 'files'): Promise<{ url: string; name: string }> {
  const ext = file.name.split('.').pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your environment variables.');
  }

  const { error } = await supabase.storage
    .from('doubts')
    .upload(filename, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(`uploadDoubtAttachment: ${error.message}`);

  const { data: { publicUrl } } = supabase.storage.from('doubts').getPublicUrl(filename);
  return { url: publicUrl, name: file.name };
}
