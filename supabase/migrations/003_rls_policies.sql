-- Enable Row Level Security
ALTER TABLE jimpitan ENABLE ROW LEVEL SECURITY;
ALTER TABLE backup_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE pengaturan ENABLE ROW LEVEL SECURITY;

-- Create policies for jimpitan table
-- Allow all authenticated users to read jimpitan data
DROP POLICY IF EXISTS "Allow all to read jimpitan" ON jimpitan;
CREATE POLICY "Allow all to read jimpitan" ON jimpitan
    FOR SELECT USING (true);

-- Allow all authenticated users to insert jimpitan data
DROP POLICY IF EXISTS "Allow all to insert jimpitan" ON jimpitan;
CREATE POLICY "Allow all to insert jimpitan" ON jimpitan
    FOR INSERT WITH CHECK (true);

-- Allow all authenticated users to update jimpitan data
DROP POLICY IF EXISTS "Allow all to update jimpitan" ON jimpitan;
CREATE POLICY "Allow all to update jimpitan" ON jimpitan
    FOR UPDATE USING (true);

-- Allow all authenticated users to delete jimpitan data
DROP POLICY IF EXISTS "Allow all to delete jimpitan" ON jimpitan;
CREATE POLICY "Allow all to delete jimpitan" ON jimpitan
    FOR DELETE USING (true);

-- Create policies for backup_history table
-- Allow all authenticated users to read backup data
DROP POLICY IF EXISTS "Allow all to read backup" ON backup_history;
CREATE POLICY "Allow all to read backup" ON backup_history
    FOR SELECT USING (true);

-- Allow all authenticated users to insert backup data
DROP POLICY IF EXISTS "Allow all to insert backup" ON backup_history;
CREATE POLICY "Allow all to insert backup" ON backup_history
    FOR INSERT WITH CHECK (true);

-- Allow all authenticated users to update backup data
DROP POLICY IF EXISTS "Allow all to update backup" ON backup_history;
CREATE POLICY "Allow all to update backup" ON backup_history
    FOR UPDATE USING (true);

-- Allow all authenticated users to delete backup data
DROP POLICY IF EXISTS "Allow all to delete backup" ON backup_history;
CREATE POLICY "Allow all to delete backup" ON backup_history
    FOR DELETE USING (true);

-- Create policies for pengaturan table
-- Allow all authenticated users to read settings
DROP POLICY IF EXISTS "Allow all to read settings" ON pengaturan;
CREATE POLICY "Allow all to read settings" ON pengaturan
    FOR SELECT USING (true);

-- Allow all authenticated users to insert settings
DROP POLICY IF EXISTS "Allow all to insert settings" ON pengaturan;
CREATE POLICY "Allow all to insert settings" ON pengaturan
    FOR INSERT WITH CHECK (true);

-- Allow all authenticated users to update settings
DROP POLICY IF EXISTS "Allow all to update settings" ON pengaturan;
CREATE POLICY "Allow all to update settings" ON pengaturan
    FOR UPDATE USING (true);

-- Allow all authenticated users to delete settings
DROP POLICY IF EXISTS "Allow all to delete settings" ON pengaturan;
CREATE POLICY "Allow all to delete settings" ON pengaturan
    FOR DELETE USING (true);
