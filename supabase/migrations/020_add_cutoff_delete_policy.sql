-- Add DELETE policy for cutoff_history table
-- This allows authenticated users to delete cutoff history records

DROP POLICY IF EXISTS "Allow authenticated users to delete cutoff history" ON cutoff_history;
CREATE POLICY "Allow authenticated users to delete cutoff history" ON cutoff_history
    FOR DELETE USING (auth.role() = 'authenticated');
