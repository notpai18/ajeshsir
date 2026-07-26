-- ============================================================
-- Fix: Allow anon to read doubts of ALL statuses
-- 20260726150000_fix_anon_read_all_statuses.sql
-- ============================================================
--
-- ROOT CAUSE:
--   The application uses a single Supabase anon key for ALL
--   users (students AND the professor). The professor "auth"
--   is a UI-only toggle (localStorage flag) — no real Supabase
--   session is created. Therefore the professor's Supabase
--   client is still role=anon.
--
--   The previous migration (20260726100000) set:
--     doubts_anon_read  → status IN ('approved','answered')
--     doubts_authenticated_read_all → all rows (authenticated only)
--
--   Since the professor is NEVER authenticated (no real login),
--   the 'authenticated' policy never fires. The professor sees
--   ZERO pending/rejected doubts — the moderation queue is
--   completely empty.
--
-- FIX:
--   Replace doubts_anon_read with a permissive policy that
--   allows anon to read all rows. This matches the dev-mode
--   relaxed RLS approach already applied to every other table
--   and operation in the application.
--
--   Public student visibility is enforced CLIENT-SIDE in
--   student/DoubtsSection.tsx via isPublicDoubt() which only
--   renders approved/answered doubts. This is consistent with
--   the existing security model for this application.
--
-- ============================================================

-- Drop the restrictive anon-only policy
DROP POLICY IF EXISTS "doubts_anon_read"           ON public.doubts;
DROP POLICY IF EXISTS "doubts_public_read"          ON public.doubts;
DROP POLICY IF EXISTS "doubts_professor_read_all"   ON public.doubts;
DROP POLICY IF EXISTS "doubts_authenticated_read_all" ON public.doubts;
DROP POLICY IF EXISTS "Doubts are viewable by everyone" ON public.doubts;

-- Single open read policy: anon and authenticated can both read all rows
CREATE POLICY "doubts_read_all"
  ON public.doubts FOR SELECT
  USING (TRUE);

-- Ensure the open policies for doubt_replies are also in place
DROP POLICY IF EXISTS "Doubt replies are viewable by everyone" ON public.doubt_replies;

CREATE POLICY "doubt_replies_read_all"
  ON public.doubt_replies FOR SELECT
  USING (TRUE);

-- Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';
