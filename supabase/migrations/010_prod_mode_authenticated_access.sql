-- Production Mode: Restore authenticated-only access to storage
-- This migration restores the production security policies
-- Run this when deploying to production

-- Allow public read access to photos
DROP POLICY IF EXISTS "Public photos are viewable by everyone" ON storage.objects;
CREATE POLICY "Public photos are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'jimpitan-photos');

-- Remove public upload access (development mode)
DROP POLICY IF EXISTS "Public users can upload photos (dev mode)" ON storage.objects;

-- Remove public delete access (development mode)
DROP POLICY IF EXISTS "Public users can delete photos (dev mode)" ON storage.objects;

-- Allow authenticated users to upload photos
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jimpitan-photos');

-- Allow users to delete their own photos
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'jimpitan-photos');

-- Note: Make sure to set NEXT_PUBLIC_ENABLE_AUTH=true in your production environment variables
