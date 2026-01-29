-- Add is_archived column to jimpitan table
ALTER TABLE jimpitan ADD COLUMN IF NOT EXISTS is_archived BOOLEAN DEFAULT FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_jimpitan_is_archived ON jimpitan(is_archived);
