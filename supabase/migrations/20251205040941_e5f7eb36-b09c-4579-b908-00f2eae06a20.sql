-- Remove the service role policy from profiles as it exposes all data
DROP POLICY IF EXISTS "Service role full access" ON profiles;