-- Create cutoff_history table
CREATE TABLE IF NOT EXISTS cutoff_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cutoff_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    amount INTEGER NOT NULL,
    period_month INTEGER NOT NULL,
    period_year INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE cutoff_history ENABLE ROW LEVEL SECURITY;

-- Create policies (all authenticated users can read and insert)
DROP POLICY IF EXISTS "Allow authenticated users to read cutoff history" ON cutoff_history;
CREATE POLICY "Allow authenticated users to read cutoff history" ON cutoff_history
    FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated users to insert cutoff history" ON cutoff_history;
CREATE POLICY "Allow authenticated users to insert cutoff history" ON cutoff_history
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create index
CREATE INDEX IF NOT EXISTS idx_cutoff_history_date ON cutoff_history(cutoff_date DESC);
