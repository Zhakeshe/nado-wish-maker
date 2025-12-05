-- Fix verify_email_code function - remove references to non-existent columns
CREATE OR REPLACE FUNCTION public.verify_email_code(code_input text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  
  -- Code is valid - update profile to verified (removed non-existent columns)
  UPDATE public.profiles
  SET is_verified = true
  WHERE user_id = current_user_id;
  
  -- Delete the verification code
  DELETE FROM public.verification_codes WHERE user_id = current_user_id;
  
  RETURN json_build_object('success', true);
END;
$function$;