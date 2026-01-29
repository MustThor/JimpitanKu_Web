-- Seed total_pemasukan setting if not exists
INSERT INTO pengaturan (key, value)
VALUES ('total_pemasukan', '0')
ON CONFLICT (key) DO NOTHING;
