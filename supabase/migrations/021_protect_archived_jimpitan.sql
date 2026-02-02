-- Migration: Protect archived jimpitan data from updates and deletes
-- This ensures data integrity after cutoff by preventing modifications to archived records

-- Drop existing policies if they conflict
DROP POLICY IF EXISTS "Prevent update on archived jimpitan" ON jimpitan;
DROP POLICY IF EXISTS "Prevent delete on archived jimpitan" ON jimpitan;

-- Create policy to prevent UPDATE on archived jimpitan
-- Only allow updates on non-archived records
CREATE POLICY "Allow update only on non-archived jimpitan" ON jimpitan
  FOR UPDATE
  USING (is_archived = false)
  WITH CHECK (is_archived = false);

-- Create policy to prevent DELETE on archived jimpitan
-- Only allow deletes on non-archived records
CREATE POLICY "Allow delete only on non-archived jimpitan" ON jimpitan
  FOR DELETE
  USING (is_archived = false);

-- Add comment for documentation
COMMENT ON POLICY "Allow update only on non-archived jimpitan" ON jimpitan IS 
  'Prevents modification of jimpitan records that have been archived during cutoff';

COMMENT ON POLICY "Allow delete only on non-archived jimpitan" ON jimpitan IS 
  'Prevents deletion of jimpitan records that have been archived during cutoff';
