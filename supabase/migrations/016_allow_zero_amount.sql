-- Allow zero amount in jimpitan table
-- This allows houses to record 0 jimpitan when they don't contribute

-- Drop the existing check constraint
ALTER TABLE jimpitan DROP CONSTRAINT IF EXISTS jimpitan_amount_check;

-- Add the new check constraint that allows zero but prevents negative values
ALTER TABLE jimpitan ADD CONSTRAINT jimpitan_amount_check CHECK (amount >= 0);
