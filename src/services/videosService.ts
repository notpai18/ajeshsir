/**
 * Videos service — all CRUD operations for the videos table.
 */
import { supabase } from '../lib/supabase';
import type { TablesUpdate } from '../types/database';
import type { Video, ExamType } from '../types';

function rowToVideo(row: {
  id: string;
  course: string;
  subject: string;
  chapter: string;
  title: string;
  youtube_link: string;
  thumbnail: string;
  description: string;
  duration: string;
}): Video {
  return {
    id: row.id,
    course: row.course as ExamType,
    subject: row.subject,
    chapter: row.chapter,
    title: row.title,
    youtubeLink: row.youtube_link,
    thumbnail: row.thumbnail,
    description: row.description,
    duration: row.duration,
  };
}

export async function fetchVideos(): Promise<Video[]> {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`fetchVideos: ${error.message}`);
  return (data ?? []).map(rowToVideo);
}

export async function createVideo(video: Omit<Video, 'id'>): Promise<Video> {
  const { data, error } = await supabase
    .from('videos')
    .insert({
      course: video.course,
      subject: video.subject,
      chapter: video.chapter,
      title: video.title,
      youtube_link: video.youtubeLink,
      thumbnail: video.thumbnail,
      description: video.description,
      duration: video.duration,
    })
    .select()
    .single();

  if (error) throw new Error(`createVideo: ${error.message}`);
  return rowToVideo(data);
}

export async function updateVideo(
  id: string,
  fields: Partial<Omit<Video, 'id'>>
): Promise<Video> {
  const payload: TablesUpdate<'videos'> = {};
  if (fields.course !== undefined) payload.course = fields.course;
  if (fields.subject !== undefined) payload.subject = fields.subject;
  if (fields.chapter !== undefined) payload.chapter = fields.chapter;
  if (fields.title !== undefined) payload.title = fields.title;
  if (fields.youtubeLink !== undefined) payload.youtube_link = fields.youtubeLink;
  if (fields.thumbnail !== undefined) payload.thumbnail = fields.thumbnail;
  if (fields.description !== undefined) payload.description = fields.description;
  if (fields.duration !== undefined) payload.duration = fields.duration;

  const { data, error } = await supabase
    .from('videos')
    .update(payload)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`updateVideo: ${error.message}`);
  return rowToVideo(data);
}

export async function deleteVideo(id: string): Promise<void> {
  const { error } = await supabase.from('videos').delete().eq('id', id);
  if (error) throw new Error(`deleteVideo: ${error.message}`);
}
