-- Remove the overly permissive anon policy from profiles
DROP POLICY IF EXISTS "Anon can view profiles for leaderboard" ON profiles;

-- The view with security_invoker will still work for authenticated users
-- because they have the "Users can view own profile" policy

-- For the leaderboard, we need authenticated users to be able to see limited data
-- Let's create a more restrictive policy for authenticated users
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Users can see their own full profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to view limited profile data of others (for leaderboard)
-- Note: Since RLS can't restrict columns, the leaderboard_view restricts what's returned
CREATE POLICY "Authenticated users can view profiles for leaderboard"
ON profiles FOR SELECT
TO authenticated
USING (true);

-- Fix generation_tasks table - add user_id column first
ALTER TABLE generation_tasks ADD COLUMN IF NOT EXISTS user_id uuid;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all access to generation_tasks" ON generation_tasks;

-- Create proper user-scoped policies for generation_tasks
CREATE POLICY "Users can view own generation tasks"
ON generation_tasks FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own generation tasks"
ON generation_tasks FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own generation tasks"
ON generation_tasks FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL);

-- Service role can update any task (for webhooks)
CREATE POLICY "Service role can manage generation tasks"
ON generation_tasks FOR ALL
TO service_role
USING (true)
WITH CHECK (true);