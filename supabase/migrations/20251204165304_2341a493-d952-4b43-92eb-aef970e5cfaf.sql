-- Create table for tracking 3D generation tasks
CREATE TABLE public.generation_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'PENDING',
  image_url TEXT,
  model_url TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generation_tasks ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for simplicity (webhook needs access)
CREATE POLICY "Allow all access to generation_tasks" 
ON public.generation_tasks 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index on task_id for faster lookups
CREATE INDEX idx_generation_tasks_task_id ON public.generation_tasks(task_id);