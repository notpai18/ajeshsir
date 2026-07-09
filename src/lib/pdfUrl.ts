/**
 * getPDFUrl — universal helper for resolving PDF URLs from Supabase.
 * Accepts a storage path, public URL, or signed URL.
 * Used by all modules: Notes, PYQs, Practice Sheets.
 */
import { supabase } from '../lib/supabase';

type Bucket = 'notes-pdfs' | 'practice-sheets' | 'pyqs' | 'doubt-attachments';

/**
 * Given a raw fileUrl (which may be a full public URL, a signed URL, or a
 * storage path like "notes-pdfs/abc.pdf"), return a usable fetch URL.
 *
 * Priority:
 * 1. If it's already a full http(s) URL → return as-is.
 * 2. If it's a storage path → generate a signed URL (60-min expiry).
 */
export async function getPDFUrl(
  fileUrl: string,
  bucket: Bucket = 'notes-pdfs'
): Promise<string> {
  if (!fileUrl) throw new Error('getPDFUrl: fileUrl is required');

  // Already a full URL
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    return fileUrl;
  }

  // Storage path — generate signed URL
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(fileUrl, 3600);

  if (error || !data?.signedUrl) {
    throw new Error(`getPDFUrl: could not sign URL for "${fileUrl}": ${error?.message}`);
  }

  return data.signedUrl;
}

/**
 * Guess the bucket from a fileUrl public URL.
 * Falls back to 'notes-pdfs'.
 */
export function guessBucketFromUrl(fileUrl: string): Bucket {
  if (fileUrl.includes('practice-sheets')) return 'practice-sheets';
  if (fileUrl.includes('pyqs')) return 'pyqs';
  if (fileUrl.includes('doubt-attachments')) return 'doubt-attachments';
  return 'notes-pdfs';
}

/**
 * Download the PDF file with the correct filename.
 * Triggers a browser save dialog.
 */
export async function downloadPDF(fileUrl: string, filename: string): Promise<void> {
  try {
    const url = fileUrl.startsWith('http') ? fileUrl : await getPDFUrl(fileUrl);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  } catch (err) {
    console.error('[downloadPDF] error:', err);
    // fallback: open in new tab
    window.open(fileUrl, '_blank', 'noopener,noreferrer');
  }
}
