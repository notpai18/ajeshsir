-- ============================================================
-- Doubts Moderation Workflow Migration
-- ============================================================
-- Adds 4-state moderation status to doubts table:
--   pending_approval → approved → answered
--                    ↘ rejected
-- ============================================================

-- ─── Add status column to doubts ───────────────────────────
ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS status TEXT
    CHECK (status IN ('pending_approval', 'approved', 'rejected', 'answered'))
    DEFAULT 'pending_approval';

-- ─── Add audit/metadata columns ────────────────────────────
ALTER TABLE public.doubts
  ADD COLUMN IF NOT EXISTS approved_at    TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS approved_by   TEXT,
  ADD COLUMN IF NOT EXISTS rejected_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS rejected_by   TEXT,
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ─── Migrate existing data ─────────────────────────────────
-- All doubts that already have a professor reply → 'answered'
UPDATE public.doubts d
SET status = 'answered'
WHERE is_answered = TRUE
  AND status IS NULL OR status = 'pending_approval';

-- All doubts that were previously public and not answered → 'approved'
-- (They were visible before this migration, so treat them as approved)
UPDATE public.doubts d
SET status = 'approved'
WHERE is_answered = FALSE
  AND (status IS NULL OR status = 'pending_approval' OR status = 'submitted' OR status = 'awaiting' OR status = 'needs-followup');

-- ─── Index on status for performance ──────────────────────
CREATE INDEX IF NOT EXISTS doubts_status_idx ON public.doubts(status);

-- ─── Update RLS policy for public read ────────────────────
-- Drop the old permissive read policy
DROP POLICY IF EXISTS "doubts_public_read" ON public.doubts;

-- New policy: public can only see approved/answered doubts
CREATE POLICY "doubts_public_read"
  ON public.doubts FOR SELECT
  USING (status IN ('approved', 'answered'));

-- Professors can see ALL doubts (including pending/rejected)
-- We use a permissive approach: professors bypass the above
-- by having a second policy that allows full select
CREATE POLICY "doubts_professor_read_all"
  ON public.doubts FOR SELECT
  TO authenticated
  USING (public.is_professor());

-- ─── Policy for professors to approve/reject ──────────────
-- The existing doubts_professor_update policy already covers this
-- since it uses public.is_professor() check

-- ─── Keep backward compat: allow 'submitted' / 'awaiting' ─
-- These legacy values may come from older rows, treat them as approved
-- (handled in frontend deriveStatus function)
