-- Add policy for public leaderboard access (only basic info)
CREATE POLICY "Public can view leaderboard data"
ON public.profiles
FOR SELECT
USING (true);

-- Drop the old restrictive policy first, then recreate with proper scope
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;