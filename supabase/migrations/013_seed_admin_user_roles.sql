-- Seed admin and user roles for specific email addresses
-- IMPORTANT: Users must be created in Supabase Auth first before running this migration
-- Users to create:
--   - admin@jimpitanku.com (role: admin)
--   - user@jimpitanku.com (role: user)

-- Insert admin role for admin@jimpitanku.com
-- Note: Replace 'USER_ID_HERE' with the actual user ID from auth.users table
-- You can get the user ID by running: SELECT id, email FROM auth.users;

-- Example (uncomment and replace with actual user IDs):
-- INSERT INTO user_roles (user_id, role)
-- SELECT 
--     (SELECT id FROM auth.users WHERE email = 'admin@jimpitanku.com' LIMIT 1),
--     'admin'
-- WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@jimpitanku.com')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Insert user role for user@jimpitanku.com
-- Example (uncomment and replace with actual user IDs):
-- INSERT INTO user_roles (user_id, role)
-- SELECT 
--     (SELECT id FROM auth.users WHERE email = 'user@jimpitanku.com' LIMIT 1),
--     'user'
-- WHERE EXISTS (SELECT 1 FROM auth.users WHERE email = 'user@jimpitanku.com')
-- ON CONFLICT (user_id) DO UPDATE SET role = 'user';

-- Alternative: Use a function to automatically assign roles based on email
CREATE OR REPLACE FUNCTION assign_user_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Assign admin role to admin@jimpitanku.com
    IF NEW.email = 'admin@jimpitanku.com' THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
    
    -- Assign user role to user@jimpitanku.com
    ELSIF NEW.email = 'user@jimpitanku.com' THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (NEW.id, 'user')
        ON CONFLICT (user_id) DO UPDATE SET role = 'user';
    
    -- Block registration for all other emails
    ELSE
        RAISE EXCEPTION 'Registrasi baru tidak diizinkan. Hanya admin@jimpitanku.com dan user@jimpitanku.com yang dapat mengakses sistem ini.';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically assign roles on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION assign_user_role();

-- Comment: This trigger will automatically:
-- 1. Assign 'admin' role to admin@jimpitanku.com
-- 2. Assign 'user' role to user@jimpitanku.com
-- 3. Block registration for any other email address
