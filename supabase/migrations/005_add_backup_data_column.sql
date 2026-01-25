-- Add backup_data column to store actual jimpitan data
ALTER TABLE backup_history 
ADD COLUMN IF NOT EXISTS backup_data JSONB;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_backup_data ON backup_history USING GIN (backup_data);
