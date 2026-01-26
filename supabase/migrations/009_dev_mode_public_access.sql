-- Development Mode: Allow public access to storage
-- This migration allows public upload and delete access for development purposes
-- WARNING: Only use this in development! For production, use 007_storage_policies.sql

-- Allow public read access to photos (already exists, but keeping for completeness)
DROP POLICY IF EXISTS "Public photos are viewable by everyone" ON storage.objects;
CREATE POLICY "Public photos are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'jimpitan-photos');

-- Allow public upload access (development mode only)
DROP POLICY IF EXISTS "Public users can upload photos (dev mode)" ON storage.objects;
CREATE POLICY "Public users can upload photos (dev mode)"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'jimpitan-photos');

-- Allow public delete access (development mode only)
DROP POLICY IF EXISTS "Public users can delete photos (dev mode)" ON storage.objects;
CREATE POLICY "Public users can delete photos (dev mode)"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'jimpitan-photos');

-- Note: To switch back to production mode, run:
-- 1. DROP POLICY "Public users can upload photos (dev mode)" ON storage.objects;
-- 2. DROP POLICY "Public users can delete photos (dev mode)" ON storage.objects;
-- 3. Re-run 007_storage_policies.sql to restore authenticated-only access
