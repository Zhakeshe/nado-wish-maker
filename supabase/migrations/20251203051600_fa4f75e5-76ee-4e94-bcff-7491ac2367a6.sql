-- Update storage bucket to be public and allow image uploads
UPDATE storage.buckets 
SET public = true,
    allowed_mime_types = ARRAY['model/gltf-binary', 'model/gltf+json', 'application/octet-stream', 'image/png', 'image/jpeg', 'image/webp']
WHERE id = '3d-models';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can upload their own 3d models" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own 3d models" ON storage.objects;
DROP POLICY IF EXISTS "Public can view 3d models" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own 3d models" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own 3d models" ON storage.objects;

-- Create policies for 3d-models bucket
CREATE POLICY "Users can upload their own 3d models"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = '3d-models' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own 3d models"
ON storage.objects FOR SELECT
USING (
  bucket_id = '3d-models' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view 3d models"
ON storage.objects FOR SELECT
USING (bucket_id = '3d-models');

CREATE POLICY "Users can update their own 3d models"
ON storage.objects FOR UPDATE
USING (
  bucket_id = '3d-models' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own 3d models"
ON storage.objects FOR DELETE
USING (
  bucket_id = '3d-models' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);