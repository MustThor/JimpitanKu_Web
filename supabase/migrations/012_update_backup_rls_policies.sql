-- Update backup_history RLS policies to restrict delete to admin only

-- Remove the existing policy that allows all authenticated users to delete backups
DROP POLICY IF EXISTS "Allow all to delete backup" ON backup_history;

-- Create new policy that only allows admins to delete backups
DROP POLICY IF EXISTS "Allow only admins to delete backup" ON backup_history;
CREATE POLICY "Allow only admins to delete backup" ON backup_history
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );
