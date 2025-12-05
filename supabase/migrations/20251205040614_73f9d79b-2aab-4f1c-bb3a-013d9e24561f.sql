-- Drop the overly permissive policy that exposes all profile data
DROP POLICY IF EXISTS "Public can view leaderboard data" ON profiles;

-- Create a restricted policy for leaderboard that only allows viewing public fields
-- Note: We can't restrict columns in RLS, so we'll create a policy that still allows SELECT
-- but the application should only query the safe fields (full_name, points, avatar_url)
-- For true column-level security, we use a view

-- Create a secure view for leaderboard data that only exposes safe fields
CREATE OR REPLACE VIEW public.leaderboard_view AS
SELECT 
  id,
  full_name,
  points,
  avatar_url
FROM public.profiles;

-- Grant SELECT on the view to anon and authenticated
GRANT SELECT ON public.leaderboard_view TO anon;
GRANT SELECT ON public.leaderboard_view TO authenticated;

-- Create restrictive policy: users can only view their own full profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Service role can still access everything for verification functions
CREATE POLICY "Service role full access"
ON profiles FOR SELECT
TO service_role
USING (true);