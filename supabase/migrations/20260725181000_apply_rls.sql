-- Enable Row Level Security on all core tables
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_sheets ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubts ENABLE ROW LEVEL SECURITY;
ALTER TABLE doubt_replies ENABLE ROW LEVEL SECURITY;

-- 1. Notes Policies
CREATE POLICY "Public notes are viewable by everyone" ON notes FOR SELECT USING (true);
CREATE POLICY "Only professors can insert notes" ON notes FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can update notes" ON notes FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can delete notes" ON notes FOR DELETE USING (auth.uid() IS NOT NULL);

-- 2. Videos Policies
CREATE POLICY "Public videos are viewable by everyone" ON videos FOR SELECT USING (true);
CREATE POLICY "Only professors can insert videos" ON videos FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can update videos" ON videos FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can delete videos" ON videos FOR DELETE USING (auth.uid() IS NOT NULL);

-- 3. PYQs Policies
CREATE POLICY "Public PYQs are viewable by everyone" ON pyqs FOR SELECT USING (true);
CREATE POLICY "Only professors can insert pyqs" ON pyqs FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can update pyqs" ON pyqs FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can delete pyqs" ON pyqs FOR DELETE USING (auth.uid() IS NOT NULL);

-- 4. Practice Sheets Policies
CREATE POLICY "Public practice sheets are viewable by everyone" ON practice_sheets FOR SELECT USING (true);
CREATE POLICY "Only professors can insert practice_sheets" ON practice_sheets FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can update practice_sheets" ON practice_sheets FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can delete practice_sheets" ON practice_sheets FOR DELETE USING (auth.uid() IS NOT NULL);

-- 5. Announcements Policies
CREATE POLICY "Public announcements are viewable by everyone" ON announcements FOR SELECT USING (true);
CREATE POLICY "Only professors can insert announcements" ON announcements FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can update announcements" ON announcements FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can delete announcements" ON announcements FOR DELETE USING (auth.uid() IS NOT NULL);

-- 6. Doubts Policies
CREATE POLICY "Doubts are viewable by everyone" ON doubts FOR SELECT USING (true);
-- CRITICAL: Students MUST be able to insert doubts without being logged in!
CREATE POLICY "Anyone can submit a doubt" ON doubts FOR INSERT WITH CHECK (true);
CREATE POLICY "Only professors can update doubts" ON doubts FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can delete doubts" ON doubts FOR DELETE USING (auth.uid() IS NOT NULL);

-- 7. Doubt Replies Policies
CREATE POLICY "Doubt replies are viewable by everyone" ON doubt_replies FOR SELECT USING (true);
-- Assuming for now only professors reply. If students can reply, this needs to be true.
CREATE POLICY "Only professors can reply to doubts" ON doubt_replies FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can update doubt replies" ON doubt_replies FOR UPDATE USING (auth.uid() IS NOT NULL);
CREATE POLICY "Only professors can delete doubt replies" ON doubt_replies FOR DELETE USING (auth.uid() IS NOT NULL);

-- Storage Buckets (assuming buckets are 'notes', 'videos', 'pyqs', 'practice-sheets')
-- Make sure objects are public read, but restricted insert/update/delete
-- Note: Replace with actual bucket names if they differ
-- (This is just a template, exact storage bucket policies are best set in the Supabase UI under Storage -> Policies)
