# Admin/User Role System Implementation Plan

## Overview
Implement a role-based access control system with only 2 hardcoded users:
- **Admin**: admin@jimpitanku.com (can delete backups)
- **User**: user@jimpitanku.com (cannot delete backups)
- **New registrations**: Blocked

## System Architecture

```mermaid
graph TB
    A[User Login] --> B{Check Email}
    B -->|admin@jimpitanku.com| C[Admin Role]
    B -->|user@jimpitanku.com| D[User Role]
    B -->|Other Email| E[Registration Blocked]
    C --> F[Full Access]
    D --> G[Limited Access]
    F --> H[Can Delete Backups]
    G --> I[Cannot Delete Backups]
```

## Implementation Steps

### 1. Database Schema Changes

#### Create User Roles Table
Create a `user_roles` table to manage user roles:
```sql
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);
```

#### Enable RLS on user_roles
```sql
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
```

### 2. Update RLS Policies

#### Backup Delete Policy
Restrict backup deletion to admin users only:
```sql
-- Allow only admins to delete backups
DROP POLICY IF EXISTS "Allow all to delete backup" ON backup_history;
CREATE POLICY "Allow only admins to delete backup" ON backup_history
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role = 'admin'
        )
    );
```

### 3. Update AuthContext

Add role checking functionality to `lib/contexts/AuthContext.tsx`:
- Add `isAdmin()` function to check if current user is admin
- Add `role` state to track user role
- Fetch user role from `user_roles` table on login

### 4. Update Signup Page

Modify `app/signup/page.tsx` to:
- Block all new registrations
- Display message: "Registrasi baru tidak diizinkan. Silakan hubungi admin."
- Redirect to login page after showing message

### 5. Update Backup Page

Modify `app/backup/page.tsx` to:
- Hide delete button for non-admin users
- Show admin-only indicator in UI
- Use `isAdmin()` from AuthContext to conditionally render delete button

### 6. Create Seed Migration

Create `supabase/migrations/011_seed_admin_user_roles.sql`:
- Insert admin role for admin@jimpitanku.com
- Insert user role for user@jimpitanku.com
- Note: Users must be created first in Supabase Auth

### 7. Update Type Definitions

Add role types to `lib/supabase/types.ts`:
```typescript
export type UserRole = 'admin' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}
```

## Security Considerations

1. **Database-level enforcement**: RLS policies ensure even if UI is bypassed, database enforces restrictions
2. **Hardcoded emails**: Only specific emails can access the system
3. **No new registrations**: Prevents unauthorized user creation
4. **Role-based access**: Clear separation between admin and user permissions

## Setup Instructions

### Step 1: Create Users in Supabase Auth
1. Go to Supabase Dashboard → Authentication
2. Create user: `admin@jimpitanku.com` with password
3. Create user: `user@jimpitanku.com` with password

### Step 2: Run Migrations
```bash
# Apply all migrations
supabase db push
```

### Step 3: Verify Setup
1. Login as admin@jimpitanku.com
2. Verify delete button is visible on backup page
3. Login as user@jimpitanku.com
4. Verify delete button is hidden on backup page
5. Try to register new user - should be blocked

## Testing Checklist

- [ ] Admin can login successfully
- [ ] User can login successfully
- [ ] Admin can delete backups
- [ ] User cannot delete backups (button hidden)
- [ ] New user registration is blocked
- [ ] RLS policies prevent unauthorized deletion at database level
- [ ] Role is correctly fetched and displayed in AuthContext

## Files to Modify

1. `supabase/migrations/011_create_user_roles.sql` - NEW
2. `supabase/migrations/012_update_backup_rls_policies.sql` - NEW
3. `supabase/migrations/013_seed_admin_user_roles.sql` - NEW
4. `lib/contexts/AuthContext.tsx` - UPDATE
5. `lib/supabase/types.ts` - UPDATE
6. `app/backup/page.tsx` - UPDATE
7. `app/signup/page.tsx` - UPDATE

## Notes

- This implementation uses Supabase's built-in auth system
- Roles are stored in a separate table linked to auth.users
- Email addresses are hardcoded in the UI for simplicity
- For production, consider using environment variables for email addresses
