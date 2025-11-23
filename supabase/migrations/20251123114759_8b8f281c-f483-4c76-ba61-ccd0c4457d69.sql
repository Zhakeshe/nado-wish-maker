-- Create storage bucket for 3D models
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  '3d-models',
  '3d-models',
  false,
  52428800, -- 50MB in bytes
  array['model/gltf-binary', 'model/gltf+json', 'model/obj', 'application/octet-stream']
);

-- RLS policies for 3d-models bucket
create policy "Users can view their own 3D models"
on storage.objects for select
using (
  bucket_id = '3d-models' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can upload their own 3D models"
on storage.objects for insert
with check (
  bucket_id = '3d-models' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own 3D models"
on storage.objects for update
using (
  bucket_id = '3d-models' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own 3D models"
on storage.objects for delete
using (
  bucket_id = '3d-models' 
  and auth.uid()::text = (storage.foldername(name))[1]
);