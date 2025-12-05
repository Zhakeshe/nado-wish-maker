-- Fix: Remove overly permissive policy that allows any user to delete any generation task
-- Note: Service role bypasses RLS anyway, so this policy is unnecessary and dangerous
DROP POLICY IF EXISTS "Service role can manage generation tasks" ON public.generation_tasks;

-- Add proper user-scoped DELETE policy
CREATE POLICY "Users can delete own generation tasks" 
ON public.generation_tasks 
FOR DELETE 
USING (auth.uid() = user_id);