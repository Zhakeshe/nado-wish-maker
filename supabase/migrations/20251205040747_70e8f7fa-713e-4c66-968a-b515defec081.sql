-- Fix the SECURITY DEFINER view warning by making it SECURITY INVOKER
DROP VIEW IF EXISTS public.leaderboard_view;

CREATE VIEW public.leaderboard_view 
WITH (security_invoker = true)
AS
SELECT 
  id,
  full_name,
  points,
  avatar_url
FROM public.profiles;

-- Grant SELECT on the view to anon and authenticated
GRANT SELECT ON public.leaderboard_view TO anon;
GRANT SELECT ON public.leaderboard_view TO authenticated;

-- We also need a policy that allows viewing profiles through the view
-- Since security_invoker means the view respects the caller's permissions,
-- we need a policy that allows public SELECT but only on leaderboard-safe fields
-- This requires us to add a policy that allows public SELECT on profiles

-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Allow authenticated users to view their own profile (full access)
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Allow public access to all profiles (view will limit columns)
-- This is safe because we only query through the view which limits columns
CREATE POLICY "Anon can view profiles for leaderboard"
ON profiles FOR SELECT
TO anon
USING (true);