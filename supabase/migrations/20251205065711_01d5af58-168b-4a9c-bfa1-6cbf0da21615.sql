-- Add SELECT policy to verification_codes table
-- This allows users to only view their own verification codes
CREATE POLICY "Users can view own verification codes" 
ON public.verification_codes 
FOR SELECT 
USING (auth.uid() = user_id);