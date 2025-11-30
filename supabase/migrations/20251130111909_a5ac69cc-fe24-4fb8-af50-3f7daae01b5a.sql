-- Add email verification fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS verification_code TEXT,
ADD COLUMN IF NOT EXISTS code_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_resend_at TIMESTAMP WITH TIME ZONE;

-- Create index for faster code lookups
CREATE INDEX IF NOT EXISTS idx_profiles_verification_code ON public.profiles(verification_code);

-- Create function to check if user is verified
CREATE OR REPLACE FUNCTION public.is_user_verified(user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(is_verified, false)
  FROM public.profiles
  WHERE user_id = user_id_param;
$$;