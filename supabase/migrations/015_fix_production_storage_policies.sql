-- Fix Production Storage Policies
-- This migration ensures proper RLS policies for production storage uploads
-- Run this on your production Supabase instance

-- First, check if bucket exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'jimpitan-photos') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'jimpitan-photos',
      'jimpitan-photos',
      true, -- Public bucket - photos can be accessed publicly
      5242880, -- 5MB file size limit (in bytes)
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
    );
    RAISE NOTICE 'Created jimpitan-photos bucket';
  ELSE
    RAISE NOTICE 'jimpitan-photos bucket already exists';
  END IF;
END $$;

-- Drop all existing policies for this bucket to avoid conflicts
DROP POLICY IF EXISTS "Public photos are viewable by everyone" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own photos" ON storage.objects;
DROP POLICY IF EXISTS "Public users can upload photos (dev mode)" ON storage.objects;
DROP POLICY IF EXISTS "Public users can delete photos (dev mode)" ON storage.objects;

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create production policies

-- Policy 1: Allow public read access to photos
CREATE POLICY "Public photos are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'jimpitan-photos');

-- Policy 2: Allow authenticated users to upload photos
-- This is the critical policy that was likely missing or incorrect
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jimpitan-photos');

-- Policy 3: Allow authenticated users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'jimpitan-photos');

-- Policy 4: Allow authenticated users to update their own photos
CREATE POLICY "Users can update their own photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'jimpitan-photos')
WITH CHECK (bucket_id = 'jimpitan-photos');

-- Verify policies are created
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'objects' AND schemaname = 'storage';
  
  RAISE NOTICE 'Total storage.objects policies: %', policy_count;
END $$;

-- List all policies for verification
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage'
ORDER BY policyname;

-- Note: After running this migration, ensure:
-- 1. Users are authenticated before uploading (NEXT_PUBLIC_ENABLE_AUTH=true)
-- 2. The app uses the correct production credentials
-- 3. Users have valid sessions when attempting uploads
