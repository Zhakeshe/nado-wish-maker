-- Create panoramas table
CREATE TABLE public.panoramas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  panorama_url TEXT NOT NULL,
  thumbnail_url TEXT,
  location TEXT,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.panoramas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Approved panoramas are viewable by everyone"
ON public.panoramas
FOR SELECT
USING (status = 'approved' OR auth.uid() = author_id);

CREATE POLICY "Users can insert their own panoramas"
ON public.panoramas
FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own panoramas"
ON public.panoramas
FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own panoramas"
ON public.panoramas
FOR DELETE
USING (auth.uid() = author_id);

CREATE POLICY "Admins can manage all panoramas"
ON public.panoramas
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_panoramas_updated_at
BEFORE UPDATE ON public.panoramas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create panoramas storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('panoramas', 'panoramas', true);

-- Storage policies
CREATE POLICY "Panorama images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'panoramas');

CREATE POLICY "Authenticated users can upload panoramas"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'panoramas' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own panorama files"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'panoramas' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own panorama files"
ON storage.objects
FOR DELETE
USING (bucket_id = 'panoramas' AND auth.uid()::text = (storage.foldername(name))[1]);