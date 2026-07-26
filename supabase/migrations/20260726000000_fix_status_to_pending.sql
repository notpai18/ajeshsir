-- ============================================================
-- Fix: Rename status value 'pending_approval' → 'pending'
-- ============================================================
-- The application code was written with 'pending_approval' as
-- the DB status value, but the correct workflow uses 'pending'.
-- This migration:
--   1. Drops the CHECK constraint
--   2. Renames all 'pending_approval' rows to 'pending'
--   3. Recreates the CHECK constraint with the correct values
--   4. Updates the DEFAULT value
-- ============================================================

-- Step 1: Drop the old CHECK constraint (name may vary; use ALTER COLUMN)
ALTER TABLE public.doubts
  DROP CONSTRAINT IF EXISTS doubts_status_check;

-- Step 2: Rename existing 'pending_approval' rows to 'pending'
UPDATE public.doubts
  SET status = 'pending'
  WHERE status = 'pending_approval';

-- Step 3: Also rename any legacy 'submitted' / 'awaiting' / 'needs-followup'
--   that slipped through; treat them as 'pending' (not yet reviewed)
UPDATE public.doubts
  SET status = 'pending'
  WHERE status IN ('submitted', 'awaiting', 'needs-followup')
    AND is_answered = FALSE;

-- Step 4: Recreate the CHECK constraint with correct values
ALTER TABLE public.doubts
  ADD CONSTRAINT doubts_status_check
    CHECK (status IN ('pending', 'approved', 'rejected', 'answered'));

-- Step 5: Update the DEFAULT to 'pending'
ALTER TABLE public.doubts
  ALTER COLUMN status SET DEFAULT 'pending';

-- Step 6: Update RLS public read policy to use new value names
DROP POLICY IF EXISTS "doubts_public_read" ON public.doubts;

CREATE POLICY "doubts_public_read"
  ON public.doubts FOR SELECT
  USING (status IN ('approved', 'answered'));

-- Step 7: Re-create the broad "doubts_professor_read_all" policy
-- (allows authenticated professors to read ALL doubts regardless of status)
DROP POLICY IF EXISTS "doubts_professor_read_all" ON public.doubts;

-- Note: The professor reads via authenticated session. The "Doubts are viewable
-- by everyone" policy in apply_rls migration allows all SELECT — but that conflicts
-- with the status-filtered public read. Drop that overly-permissive policy and
-- replace with two targeted ones.
DROP POLICY IF EXISTS "Doubts are viewable by everyone" ON public.doubts;

-- Public (anon) can only see approved/answered
CREATE POLICY "doubts_anon_read"
  ON public.doubts FOR SELECT
  TO anon
  USING (status IN ('approved', 'answered'));

-- Authenticated (professor) can see all
CREATE POLICY "doubts_authenticated_read_all"
  ON public.doubts FOR SELECT
  TO authenticated
  USING (true);
