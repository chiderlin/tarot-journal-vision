-- Community Feature Migration
-- Run this in Supabase Dashboard > SQL Editor

-- 1. Add is_public and post_type columns to journal_entries
ALTER TABLE journal_entries
  ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS post_type text DEFAULT 'journal'
    CHECK (post_type IN ('journal', 'experience', 'insight', 'observation'));

-- 2. Drop the old select policy that only allowed users to see their own entries
DROP POLICY IF EXISTS "Users can view own journal entries." ON journal_entries;
DROP POLICY IF EXISTS "Users can view their own journal entries" ON journal_entries;

-- 3. Create new select policy: own entries + all public entries
CREATE POLICY "Users can view own or public journal entries."
  ON journal_entries
  FOR SELECT
  USING (auth.uid() = user_id OR is_public = true);
