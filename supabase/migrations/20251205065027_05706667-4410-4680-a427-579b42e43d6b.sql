-- Fix 1: Remove legacy verification columns from profiles table
-- These are no longer needed since verification now uses the separate verification_codes table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS verification_code;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS code_expires_at;

-- Fix 2: Remove NULL user_id condition from generation_tasks RLS policies
-- Service role bypasses RLS anyway, so these permissive conditions are unnecessary and dangerous

-- Update SELECT policy
DROP POLICY IF EXISTS "Users can view own generation tasks" ON public.generation_tasks;
CREATE POLICY "Users can view own generation tasks" 
ON public.generation_tasks 
FOR SELECT 
USING (auth.uid() = user_id);

-- Update INSERT policy  
DROP POLICY IF EXISTS "Users can insert own generation tasks" ON public.generation_tasks;
CREATE POLICY "Users can insert own generation tasks" 
ON public.generation_tasks 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update UPDATE policy
DROP POLICY IF EXISTS "Users can update own generation tasks" ON public.generation_tasks;
CREATE POLICY "Users can update own generation tasks" 
ON public.generation_tasks 
FOR UPDATE 
USING (auth.uid() = user_id);