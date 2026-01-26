-- Fix admin role assignment issue
-- This migration ensures that the admin user has a role assigned in the user_roles table

-- First, check if admin user exists in auth.users
-- This will help us identify the admin user ID

-- Insert admin role for admin@jimpitanku.com if it doesn't exist
INSERT INTO user_roles (user_id, role)
SELECT 
    (SELECT id FROM auth.users WHERE email = 'admin@jimpitanku.com' LIMIT 1),
    'admin'
WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'admin@jimpitanku.com'
)
AND NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@jimpitanku.com' LIMIT 1)
)
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Insert user role for user@jimpitanku.com if it doesn't exist
INSERT INTO user_roles (user_id, role)
SELECT 
    (SELECT id FROM auth.users WHERE email = 'user@jimpitanku.com' LIMIT 1),
    'user'
WHERE EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'user@jimpitanku.com'
)
AND NOT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = (SELECT id FROM auth.users WHERE email = 'user@jimpitanku.com' LIMIT 1)
)
ON CONFLICT (user_id) DO UPDATE SET role = 'user';

-- Create a function to automatically assign roles on user signup
-- This replaces the previous trigger-based approach
CREATE OR REPLACE FUNCTION assign_user_role_on_signup()
RETURNS TRIGGER AS $$
BEGIN
    -- Assign admin role to admin@jimpitanku.com
    IF NEW.email = 'admin@jimpitanku.com' THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (NEW.id, 'admin')
        ON CONFLICT (user_id) DO UPDATE SET role = 'admin';
        
        RAISE NOTICE 'Admin role assigned to user: %', NEW.email;
    
    -- Assign user role to user@jimpitanku.com
    ELSIF NEW.email = 'user@jimpitanku.com' THEN
        INSERT INTO user_roles (user_id, role)
        VALUES (NEW.id, 'user')
        ON CONFLICT (user_id) DO UPDATE SET role = 'user';
        
        RAISE NOTICE 'User role assigned to user: %', NEW.email;
    
    -- For development/testing: Allow any email and assign 'user' role
    -- Comment this block out in production to restrict access
    ELSE
        INSERT INTO user_roles (user_id, role)
        VALUES (NEW.id, 'user')
        ON CONFLICT (user_id) DO UPDATE SET role = 'user';
        
        RAISE NOTICE 'User role assigned to new user: %', NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to automatically assign roles on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION assign_user_role_on_signup();

-- Add a comment to explain the behavior
COMMENT ON FUNCTION assign_user_role_on_signup() IS 'Automatically assigns user roles based on email address. In development mode, assigns "user" role to all emails. In production, restrict to specific emails only.';
