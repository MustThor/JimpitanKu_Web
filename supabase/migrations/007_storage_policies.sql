-- Create storage policies for jimpitan-photos bucket

-- Allow public read access to photos
DROP POLICY IF EXISTS "Public photos are viewable by everyone" ON storage.objects;
CREATE POLICY "Public photos are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'jimpitan-photos');

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
