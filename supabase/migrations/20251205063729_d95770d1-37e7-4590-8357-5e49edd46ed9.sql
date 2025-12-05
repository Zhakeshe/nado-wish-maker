-- Create a separate table for verification codes (users cannot SELECT from this)
CREATE TABLE public.verification_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  code text NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- NO SELECT policy for users - they should never be able to read their own code
-- Only allow INSERT for users (to create their verification code)
CREATE POLICY "Users can insert their own verification code"
ON public.verification_codes
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own code (for cleanup after verification)
CREATE POLICY "Users can delete their own verification code"
ON public.verification_codes
FOR DELETE
USING (auth.uid() = user_id);

-- Create SECURITY DEFINER function to verify codes server-side
CREATE OR REPLACE FUNCTION public.verify_email_code(code_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  stored_code text;
  code_expiry timestamp with time zone;
BEGIN
  -- Get authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Get the stored verification code
  SELECT code, expires_at INTO stored_code, code_expiry
  FROM public.verification_codes
  WHERE user_id = current_user_id;
  
  IF stored_code IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'No verification code found');
  END IF;
  
  -- Check if code has expired
  IF code_expiry < now() THEN
    RETURN json_build_object('success', false, 'error', 'Code has expired');
  END IF;
  
  -- Verify the code
  IF stored_code != code_input THEN
    RETURN json_build_object('success', false, 'error', 'Invalid code');
  END IF;
  
  -- Code is valid - update profile to verified
  UPDATE public.profiles
  SET is_verified = true, verification_code = NULL, code_expires_at = NULL
  WHERE user_id = current_user_id;
  
  -- Delete the verification code
  DELETE FROM public.verification_codes WHERE user_id = current_user_id;
  
  RETURN json_build_object('success', true);
END;
$$;

-- Create function to generate and store a new verification code
CREATE OR REPLACE FUNCTION public.create_verification_code()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  new_code text;
  new_expiry timestamp with time zone;
  last_resend timestamp with time zone;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Check rate limit (60 seconds between resends)
  SELECT last_resend_at INTO last_resend
  FROM public.profiles
  WHERE user_id = current_user_id;
  
  IF last_resend IS NOT NULL AND last_resend > now() - interval '60 seconds' THEN
    RETURN json_build_object('success', false, 'error', 'Please wait before requesting a new code');
  END IF;
  
  -- Generate new 6-digit code
  new_code := lpad(floor(random() * 1000000)::text, 6, '0');
  new_expiry := now() + interval '5 minutes';
  
  -- Upsert the verification code
  INSERT INTO public.verification_codes (user_id, code, expires_at)
  VALUES (current_user_id, new_code, new_expiry)
  ON CONFLICT (user_id) 
  DO UPDATE SET code = new_code, expires_at = new_expiry, created_at = now();
  
  -- Update last_resend_at in profiles
  UPDATE public.profiles
  SET last_resend_at = now()
  WHERE user_id = current_user_id;
  
  -- Return the code (to be sent via email edge function)
  RETURN json_build_object('success', true, 'code', new_code, 'expires_at', new_expiry);
END;
$$;