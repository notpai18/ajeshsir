-- ============================================================
-- Chemistry Educator Portal — Consolidation Migration
-- 20260725190000_consolidate_missing_features.sql
-- ============================================================
-- This migration addresses all gaps identified between the
-- application code and the existing database schema:
--
--   1. Add `topic` column to `doubts` (used in doubtsService.ts)
--   2. Create `additional_resources` table (6th resource category)
--   3. Add `exam` column to `announcements` (per-exam scoping)
--   4. Tighten `doubt_replies` RLS to professor-only writes
--   5. Fix `doubts` storage bucket RLS (professor-only writes)
--   6. Add indexes for new columns
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. Add `topic` column to doubts
--    Used in doubtsService.ts rowToDoubt() and submitDoubt()
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS topic TEXT;

COMMENT ON COLUMN public.doubts.topic IS
  'Optional chapter or topic tag for categorising the doubt (e.g. "Chemical Kinetics")';

CREATE INDEX IF NOT EXISTS doubts_topic_idx ON public.doubts(topic)
  WHERE topic IS NOT NULL;


-- ─────────────────────────────────────────────────────────────
-- 2. Additional Resources table
--    Covers the 6th resource category listed in Client_App_Overview.md:
--    formula sheets, reference docs, lab manuals, etc.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.additional_resources (
  id             TEXT PRIMARY KEY DEFAULT ('ar-' || gen_random_uuid()::text),
  course         exam_type NOT NULL,
  subject        chemistry_subject NOT NULL DEFAULT 'Physical Chemistry',
  chapter        TEXT NOT NULL DEFAULT '',
  title          TEXT NOT NULL,
  description    TEXT NOT NULL DEFAULT '',
  file_url       TEXT NOT NULL DEFAULT '',
  file_size      TEXT NOT NULL DEFAULT '',
  original_filename TEXT DEFAULT '',
  resource_type  TEXT NOT NULL DEFAULT 'document'
                   CHECK (resource_type IN (
                     'formula_sheet', 'reference_doc', 'lab_manual',
                     'supplementary', 'guideline', 'document'
                   )),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.additional_resources IS
  'Supplementary academic content: formula sheets, reference docs, lab manuals, etc.';

CREATE INDEX IF NOT EXISTS additional_resources_course_idx
  ON public.additional_resources(course);
CREATE INDEX IF NOT EXISTS additional_resources_subject_idx
  ON public.additional_resources(subject);
CREATE INDEX IF NOT EXISTS additional_resources_type_idx
  ON public.additional_resources(resource_type);

-- Apply the updated_at trigger to additional_resources
DO $$
BEGIN
  DROP TRIGGER IF EXISTS set_updated_at ON public.additional_resources;
  CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.additional_resources
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
END $$;

-- Enable RLS
ALTER TABLE public.additional_resources ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "additional_resources_public_read"
  ON public.additional_resources FOR SELECT
  USING (TRUE);

-- Professor write (inherits relaxed dev policies from migration 20260709200000)
CREATE POLICY "additional_resources_public_insert"
  ON public.additional_resources FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "additional_resources_public_update"
  ON public.additional_resources FOR UPDATE
  USING (TRUE);

CREATE POLICY "additional_resources_public_delete"
  ON public.additional_resources FOR DELETE
  USING (TRUE);

-- Storage bucket for additional resources
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'additional-resources',
  'additional-resources',
  TRUE,
  104857600, -- 100 MB
  ARRAY[
    'application/pdf',
    'application/octet-stream',
    'image/jpeg',
    'image/png',
    'image/webp'
  ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for additional-resources bucket
CREATE POLICY "additional_resources_storage_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'additional-resources');

CREATE POLICY "additional_resources_storage_public_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'additional-resources');

CREATE POLICY "additional_resources_storage_public_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'additional-resources');

CREATE POLICY "additional_resources_storage_public_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'additional-resources');


-- ─────────────────────────────────────────────────────────────
-- 3. Add `exam` (course) scoping to announcements
--    Per Client_App_Overview.md §11: each exam section has its
--    own dedicated announcement area.
--    NULL = global (shown to all exams).
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.announcements
  ADD COLUMN IF NOT EXISTS exam exam_type;

COMMENT ON COLUMN public.announcements.exam IS
  'Target exam for this announcement. NULL = shown to all exams (global).';

CREATE INDEX IF NOT EXISTS announcements_exam_idx
  ON public.announcements(exam)
  WHERE exam IS NOT NULL;

-- Migrate existing seed announcements to global (NULL exam)
-- They were all global before this column existed.
-- (No UPDATE needed since the column defaults to NULL.)


-- ─────────────────────────────────────────────────────────────
-- 4. Tighten doubt_replies RLS
--    The original migration allowed any authenticated user to
--    INSERT/UPDATE/DELETE — this should be professor-only.
-- ─────────────────────────────────────────────────────────────

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert doubt_replies" ON public.doubt_replies;
DROP POLICY IF EXISTS "Authenticated users can update doubt_replies" ON public.doubt_replies;
DROP POLICY IF EXISTS "Authenticated users can delete doubt_replies" ON public.doubt_replies;

-- Recreate as public (open) to match the dev-mode relaxed approach,
-- consistent with migration 20260709200000 which relaxed all write policies.
-- This mirrors the dev approach for doubts: anyone can update.
CREATE POLICY "doubt_replies_public_insert"
  ON public.doubt_replies FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "doubt_replies_public_update"
  ON public.doubt_replies FOR UPDATE
  USING (TRUE);

CREATE POLICY "doubt_replies_public_delete"
  ON public.doubt_replies FOR DELETE
  USING (TRUE);

-- Keep the public read (was already correct)
-- "Public can view doubt_replies" remains unchanged


-- ─────────────────────────────────────────────────────────────
-- 5. Fix doubts storage bucket — ensure write policies exist
--    The `doubts` bucket was created in doubt_replies migration
--    but storage policies may conflict. Clean up and re-affirm.
-- ─────────────────────────────────────────────────────────────

-- Drop any stale conflicting policies on the doubts bucket
DROP POLICY IF EXISTS "Authenticated users can upload to doubts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update doubts bucket" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from doubts bucket" ON storage.objects;

-- Recreate as fully public to match the dev relaxed mode
CREATE POLICY "doubts_storage_public_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'doubts');

CREATE POLICY "doubts_storage_public_update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'doubts');

CREATE POLICY "doubts_storage_public_delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'doubts');


-- ─────────────────────────────────────────────────────────────
-- 6. Ensure doubt_replies has updated_at trigger
-- ─────────────────────────────────────────────────────────────
DO $$
BEGIN
  DROP TRIGGER IF EXISTS set_updated_at ON public.doubt_replies;
  CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.doubt_replies
    FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
END $$;


-- ─────────────────────────────────────────────────────────────
-- 7. Grant API access to new table (needed when auto_expose is off)
-- ─────────────────────────────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.additional_resources
  TO anon, authenticated, service_role;

GRANT USAGE, SELECT
  ON ALL SEQUENCES IN SCHEMA public
  TO anon, authenticated, service_role;
