-- Seed data file - ready for real data insertion
-- Previous dummy data has been removed and is saved in version control for testing purposes
-- To restore dummy data for testing, check git history or use the backup version

-- Example structure for inserting default settings (uncomment and modify as needed):
-- INSERT INTO pengaturan (key, value) VALUES
--     ('app_name', 'Jimpitan RT 05'),
--     ('nominal_default', '5000'),
--     ('theme', 'light')
-- ON CONFLICT (key) DO NOTHING;

-- Example structure for inserting jimpitan data (uncomment and modify as needed):
-- INSERT INTO jimpitan (amount, collection_date, week_number, month, year, notes) VALUES
--     (125000, '2026-01-25', 4, 1, 2026, 'Jimpitan malam Jumat')
-- ON CONFLICT DO NOTHING;

-- Example structure for inserting backup history (uncomment and modify as needed):
-- INSERT INTO backup_history (backup_name, created_at, restored_at) VALUES
--     ('Backup_20260120_1430', '2026-01-20T14:30:00+00:00', NULL)
-- ON CONFLICT DO NOTHING;
