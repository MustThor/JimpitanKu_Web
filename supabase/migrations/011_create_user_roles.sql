-- Create user_roles table to manage user roles
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policies for user_roles table
-- Allow authenticated users to read their own role
DROP POLICY IF EXISTS "Allow users to read own role" ON user_roles;
CREATE POLICY "Allow users to read own role" ON user_roles
    FOR SELECT USING (auth.uid() = user_id);

-- Allow service role to insert user roles (for seeding)
DROP POLICY IF EXISTS "Allow service role to insert" ON user_roles;
CREATE POLICY "Allow service role to insert" ON user_roles
    FOR INSERT WITH CHECK (true);

-- Allow service role to update user roles
DROP POLICY IF EXISTS "Allow service role to update" ON user_roles;
CREATE POLICY "Allow service role to update" ON user_roles
    FOR UPDATE USING (true);

-- Allow service role to delete user roles
DROP POLICY IF EXISTS "Allow service role to delete" ON user_roles;
CREATE POLICY "Allow service role to delete" ON user_roles
    FOR DELETE USING (true);
