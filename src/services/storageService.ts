/**
 * Storage service — handles file uploads for notes, PYQs, and practice sheets.
 * Returns public URLs that are stored in the database records.
 */
import { supabase } from '../lib/supabase';

type Bucket = 'notes-pdfs' | 'practice-sheets' | 'pyqs';

/**
 * Upload a PDF file to the specified bucket.
 * Returns the public URL for storage in the DB record.
 */
export async function uploadFile(
  file: File,
  bucket: Bucket
): Promise<{ url: string; size: string; originalFilename: string }> {
  const ext = file.name.split('.').pop() ?? 'pdf';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  if (!supabase) {
    throw new Error('Supabase client is not initialized. Check your environment variables.');
  }

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/pdf',
    });

  if (error) throw new Error(`uploadFile [${bucket}]: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);

  // Format file size for display
  const bytes = file.size;
  let size: string;
  if (bytes >= 1_048_576) {
    size = `${(bytes / 1_048_576).toFixed(1)} MB`;
  } else if (bytes >= 1024) {
    size = `${(bytes / 1024).toFixed(0)} KB`;
  } else {
    size = `${bytes} B`;
  }

  return { url: data.publicUrl, size, originalFilename: file.name };
}

/**
 * Delete a file from a bucket by its storage path.
 */
export async function deleteFile(bucket: Bucket, path: string): Promise<void> {
  // Extract the filename from a public URL if a full URL was passed
  const filename = path.includes('/') ? path.split('/').pop()! : path;
  if (!supabase) {
    console.warn(`deleteFile [${bucket}/${filename}]: Supabase client not initialized`);
    return;
  }
  const { error } = await supabase.storage.from(bucket).remove([filename]);
  if (error) console.warn(`deleteFile [${bucket}/${filename}]: ${error.message}`);
}
