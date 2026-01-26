-- Add photo_url column to jimpitan table
ALTER TABLE jimpitan 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_jimpitan_photo ON jimpitan(photo_url) WHERE photo_url IS NOT NULL;
