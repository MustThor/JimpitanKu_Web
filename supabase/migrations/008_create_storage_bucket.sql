-- Create storage bucket for jimpitan photos
-- This migration creates the 'jimpitan-photos' bucket that stores uploaded photos

-- Insert the bucket into storage.buckets table
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'jimpitan-photos',
  'jimpitan-photos',
  true, -- Public bucket - photos can be accessed publicly
  5242880, -- 5MB file size limit (in bytes)
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;
