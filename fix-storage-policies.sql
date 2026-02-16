-- ============================================
-- FIX STORAGE POLICIES
-- Run this in Supabase SQL Editor
-- ============================================

-- Drop ALL existing policies on storage.objects to start fresh
do $$
declare
  pol record;
begin
  for pol in
    select policyname from pg_policies where tablename = 'objects' and schemaname = 'storage'
  loop
    execute format('drop policy if exists %I on storage.objects', pol.policyname);
  end loop;
end $$;

-- Allow EVERYONE to read/view images (public access)
create policy "Public read access on wish-images"
  on storage.objects for select
  using (bucket_id = 'wish-images');

-- Allow AUTHENTICATED users to upload images  
create policy "Authenticated users can upload to wish-images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'wish-images');

-- Allow AUTHENTICATED users to update their uploads
create policy "Authenticated users can update wish-images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'wish-images');

-- Allow AUTHENTICATED users to delete their uploads
create policy "Authenticated users can delete from wish-images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'wish-images');
