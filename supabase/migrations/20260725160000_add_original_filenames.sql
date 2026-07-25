-- Add original_filename columns for downloads
ALTER TABLE public.notes ADD COLUMN original_filename TEXT DEFAULT '';
ALTER TABLE public.practice_sheets ADD COLUMN original_filename TEXT DEFAULT '';
ALTER TABLE public.pyqs ADD COLUMN question_original_filename TEXT DEFAULT '';
ALTER TABLE public.pyqs ADD COLUMN solution_original_filename TEXT DEFAULT '';

-- Add parallel arrays to doubt_replies for original file names
ALTER TABLE public.doubt_replies ADD COLUMN image_names text[] DEFAULT '{}';
ALTER TABLE public.doubt_replies ADD COLUMN video_names text[] DEFAULT '{}';
ALTER TABLE public.doubt_replies ADD COLUMN audio_names text[] DEFAULT '{}';
ALTER TABLE public.doubt_replies ADD COLUMN attachment_names text[] DEFAULT '{}';
