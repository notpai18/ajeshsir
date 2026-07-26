-- ============================================================
-- Chemistry Educator Portal — Doubts Schema Sync
-- 20260726100000_sync_doubts_schema.sql
-- ============================================================
-- This migration brings the doubts (and doubt_replies) table
-- into full sync with what the application code expects.
--
-- All ALTER TABLE statements use IF NOT EXISTS so this
-- migration is safe to run on a DB that already has some of
-- these columns from earlier migrations.
--
-- COLUMNS ADDED TO doubts:
--   status, approved_at, approved_by, rejected_at, rejected_by,
--   rejection_reason, topic
-- (created_at / updated_at already exist from initial_schema)
--
-- COLUMNS ADDED TO doubt_replies:
--   image_names, video_names, audio_names, attachment_names
-- (all other reply columns exist from 20260711000000)
--
-- RLS:
--   Consolidates all SELECT policies so anon sees only
--   approved/answered doubts, and authenticated sees all.
--   UPDATE policy stays open (dev-mode).
-- ============================================================


-- ─────────────────────────────────────────────────────────────
-- 1. doubts — status column + constraint
-- ─────────────────────────────────────────────────────────────

-- Add status if missing (may already exist from 20260725180000)
ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';

-- Drop any old CHECK constraint on status (name varies across migrations)
ALTER TABLE public.doubts DROP CONSTRAINT IF EXISTS doubts_status_check;

-- Normalise any legacy values that may exist in live data
UPDATE public.doubts SET status = 'pending'
  WHERE status IN ('pending_approval', 'submitted', 'awaiting', 'needs-followup')
    AND is_answered = FALSE;

UPDATE public.doubts SET status = 'answered'
  WHERE status IN ('pending_approval', 'submitted', 'awaiting', 'needs-followup')
    AND is_answered = TRUE;

-- Recreate CHECK with the four canonical values
ALTER TABLE public.doubts
  ADD CONSTRAINT doubts_status_check
    CHECK (status IN ('pending', 'approved', 'rejected', 'answered'));

-- ─────────────────────────────────────────────────────────────
-- 2. doubts — moderation audit columns
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS approved_at      TIMESTAMPTZ;

-- approved_by stores the professor's display name / auth UID as text
-- (using TEXT not UUID because professor_id may be a text identifier)
ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS approved_by      TEXT;

ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS rejected_at      TIMESTAMPTZ;

ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS rejected_by      TEXT;

ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- answered_at / answered_by for future use (not currently written by code
-- but listed in the spec and referenced by rowToDoubt for future-proofing)
ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS answered_at      TIMESTAMPTZ;

ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS answered_by      TEXT;

-- ─────────────────────────────────────────────────────────────
-- 3. doubts — topic column
-- ─────────────────────────────────────────────────────────────

-- May already exist from 20260725190000_consolidate_missing_features
ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS topic TEXT;

-- ─────────────────────────────────────────────────────────────
-- 4. doubts — indexes
-- ─────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS doubts_status_idx   ON public.doubts(status);
CREATE INDEX IF NOT EXISTS doubts_topic_idx    ON public.doubts(topic) WHERE topic IS NOT NULL;

-- ─────────────────────────────────────────────────────────────
-- 5. doubt_replies — media filename columns
--    The code inserts image_names / video_names / audio_names /
--    attachment_names when replying. These must exist in the DB.
-- ─────────────────────────────────────────────────────────────

ALTER TABLE public.doubt_replies
  ADD COLUMN IF NOT EXISTS image_names      TEXT[] DEFAULT '{}';

ALTER TABLE public.doubt_replies
  ADD COLUMN IF NOT EXISTS video_names      TEXT[] DEFAULT '{}';

ALTER TABLE public.doubt_replies
  ADD COLUMN IF NOT EXISTS audio_names      TEXT[] DEFAULT '{}';

ALTER TABLE public.doubt_replies
  ADD COLUMN IF NOT EXISTS attachment_names TEXT[] DEFAULT '{}';

-- ─────────────────────────────────────────────────────────────
-- 6. RLS — consolidate doubts SELECT policies
--
-- Goal:
--   • anon (public)        → only rows where status IN ('approved','answered')
--   • authenticated (prof) → all rows regardless of status
--   • INSERT               → anyone (no auth required for students)
--   • UPDATE/DELETE        → anyone (dev-mode relaxed)
-- ─────────────────────────────────────────────────────────────

-- Drop every existing SELECT policy on doubts to start clean
DROP POLICY IF EXISTS "doubts_public_read"              ON public.doubts;
DROP POLICY IF EXISTS "doubts_professor_read_all"        ON public.doubts;
DROP POLICY IF EXISTS "doubts_anon_read"                 ON public.doubts;
DROP POLICY IF EXISTS "doubts_authenticated_read_all"    ON public.doubts;
DROP POLICY IF EXISTS "Doubts are viewable by everyone"  ON public.doubts;

-- Public (anon) can only see approved / answered doubts
CREATE POLICY "doubts_anon_read"
  ON public.doubts FOR SELECT
  TO anon
  USING (status IN ('approved', 'answered'));

-- Authenticated users (professor) can see all doubts
CREATE POLICY "doubts_authenticated_read_all"
  ON public.doubts FOR SELECT
  TO authenticated
  USING (TRUE);

-- ─────────────────────────────────────────────────────────────
-- 7. RLS — ensure UPDATE is open (dev-mode)
--    Professor needs to UPDATE status, approved_at, etc.
--    without being auth-blocked (professor auth toggle is UI-only).
-- ─────────────────────────────────────────────────────────────

-- Drop the strict professor-only update policy if it somehow got re-added
DROP POLICY IF EXISTS "doubts_professor_update" ON public.doubts;

-- Ensure the open update policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'doubts'
      AND policyname = 'doubts_public_update'
  ) THEN
    EXECUTE 'CREATE POLICY "doubts_public_update"
      ON public.doubts FOR UPDATE USING (TRUE)';
  END IF;
END $$;

-- ─────────────────────────────────────────────────────────────
-- 8. Grant API access to all columns (needed if Supabase
--    auto_expose is off or if anon role was not granted)
-- ─────────────────────────────────────────────────────────────

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.doubts
  TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.doubt_replies
  TO anon, authenticated, service_role;

-- ─────────────────────────────────────────────────────────────
-- 9. Refresh Supabase schema cache
--    Forces PostgREST to reload the schema so the new columns
--    are visible immediately without a manual restart.
-- ─────────────────────────────────────────────────────────────

NOTIFY pgrst, 'reload schema';
