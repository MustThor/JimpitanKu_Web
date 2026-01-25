-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create jimpitan table
CREATE TABLE IF NOT EXISTS jimpitan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    amount INTEGER NOT NULL CHECK (amount > 0),
    collection_date DATE NOT NULL,
    week_number INTEGER,
    month INTEGER,
    year INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create backup_history table
CREATE TABLE IF NOT EXISTS backup_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    backup_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    restored_at TIMESTAMPTZ
);

-- Create pengaturan table
CREATE TABLE IF NOT EXISTS pengaturan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_jimpitan_date ON jimpitan(collection_date DESC);
CREATE INDEX idx_jimpitan_month_year ON jimpitan(month, year);
CREATE INDEX idx_backup_created_at ON backup_history(created_at DESC);
CREATE INDEX idx_pengaturan_key ON pengaturan(key);
