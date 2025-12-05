-- Remove the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view profiles for leaderboard" ON profiles;

-- Drop the old view (we'll use a function instead)
DROP VIEW IF EXISTS public.leaderboard_view;

-- Create a security definer function that returns only safe leaderboard data
CREATE OR REPLACE FUNCTION public.get_leaderboard(limit_count int DEFAULT 10)
RETURNS TABLE (
  id uuid,
  full_name text,
  points int,
  avatar_url text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    p.id,
    p.full_name,
    p.points,
    p.avatar_url
  FROM public.profiles p
  ORDER BY p.points DESC
  LIMIT limit_count;
$$;

-- Grant execute to public
GRANT EXECUTE ON FUNCTION public.get_leaderboard(int) TO anon;
GRANT EXECUTE ON FUNCTION public.get_leaderboard(int) TO authenticated;