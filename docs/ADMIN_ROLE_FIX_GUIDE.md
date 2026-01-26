# Admin Role Assignment Fix Guide

## Problem Description

Users were experiencing authentication errors when logging in:

```
GET https://jiiubrcdihxlhuaacpdb.supabase.co/rest/v1/user_roles?select=role&user_id=eq.978e62a7-93b3-4aa3-b2f4-a71ed611cd5c 406 (Not Acceptable)
Error fetching user role: {code: 'PGRST116', details: 'The result contains 0 rows', message: 'Cannot coerce the result to a single JSON object'}
```

### Symptoms

1. **Initial Login Error**: When clicking "Masuk" (Login), the user role fetch fails with error PGRST116
2. **Inconsistent Behavior**: After navigating to "Kembali ke halaman utama" or "buat akun baru", admin login suddenly works
3. **Console Errors**: The error appears in browser console but doesn't prevent access to dashboard
4. **No Redirect After Login**: User stays on login page even after successful authentication

## Root Cause Analysis

### Primary Issue: Missing Role Records

The admin user exists in `auth.users` table but has no corresponding record in the `user_roles` table. This causes the role fetch query to return 0 rows.

### Secondary Issue: Query Method Mismatch

The code used `.single()` method which expects exactly one row:
```typescript
const { data, error } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId)
  .single(); // ❌ Throws error when 0 rows returned
```

When no role exists, this throws error PGRST116: "Cannot coerce the result to a single JSON object"

### Why Admin Works After Navigation

1. **ProtectedRoute Only Checks User Existence**: The dashboard's `ProtectedRoute` only checks if a user is logged in, not their role
2. **Role State is Optional**: The `role` state in `AuthContext` is allowed to be `null`
3. **No Role-Based Access Control**: The dashboard doesn't enforce admin-only access based on role

## Solution Implemented

### 1. Fixed Role Fetching Logic ([`AuthContext.tsx`](lib/contexts/AuthContext.tsx:27))

**Changed from `.single()` to `.maybeSingle()`**:

```typescript
const { data, error } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId)
  .maybeSingle(); // ✅ Returns null instead of error when 0 rows
```

**Added Debug Logging**:
```typescript
console.log('[AuthContext] Fetching user role for userId:', userId);
console.log('[AuthContext] User role data:', data);
```

### 2. Added Login Redirect to Dashboard ([`LoginForm.tsx`](components/auth/LoginForm.tsx:15))

**Added automatic redirect after successful login**:

```typescript
const { signIn } = useAuth();
const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setLoading(true);

  const { error: signInError } = await signIn(email, password);

  if (signInError) {
    setError(signInError);
    setLoading(false);
  } else {
    // Successful login - redirect to dashboard
    console.log('[LoginForm] Login successful, redirecting to dashboard...');
    router.push('/dashboard');
  }
};
```

### 2. Created Database Fix Script

**File**: `fix_admin_role.sql`

This script:
1. Checks existing users and their roles
2. Inserts missing role records for admin and user accounts
3. Creates/updates the trigger function for automatic role assignment
4. Verifies the fix was successful

### 3. Created Migration for Future Deployments

**File**: `supabase/migrations/014_fix_admin_role_assignment.sql`

This migration ensures:
1. Admin users always have roles assigned
2. New signups automatically receive roles
3. Development mode allows any email (assigns 'user' role)
4. Production mode can restrict to specific emails

## How to Apply the Fix

### Step 1: Run the Immediate Fix Script

1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `fix_admin_role.sql`
3. Paste and execute the script
4. Verify the output shows "✅ Admin role assignment fix completed successfully!"

### Step 2: Verify the Fix

After running the script, check that the admin user has a role:

```sql
SELECT 
    u.id as user_id,
    u.email,
    ur.role,
    ur.created_at as role_assigned_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@jimpitanku.com';
```

You should see:
- `user_id`: The UUID of the admin user
- `email`: admin@jimpitanku.com
- `role`: admin
- `role_assigned_at`: Timestamp when role was assigned

### Step 3: Test the Application

1. Clear browser cache and localStorage
2. Navigate to the login page
3. Login with admin credentials
4. Check browser console - you should see:
   ```
   [AuthContext] Fetching user role for userId: [UUID]
   [AuthContext] User role data: { role: 'admin' }
   ```
5. Navigate to dashboard - should work without errors

### Step 4: Deploy the Code Changes

The code changes in [`AuthContext.tsx`](lib/contexts/AuthContext.tsx:27) are already applied. No additional deployment needed if you're running in development mode.

For production deployment:
1. Commit the changes to version control
2. Deploy to your hosting platform
3. The migration will run automatically on next deployment

## Prevention Measures

### Automatic Role Assignment

The trigger function `assign_user_role_on_signup()` ensures:

1. **admin@jimpitanku.com** → Gets 'admin' role
2. **user@jimpitanku.com** → Gets 'user' role  
3. **Any other email** → Gets 'user' role (development mode)

### Production Security

For production, modify the trigger to restrict access:

```sql
-- In assign_user_role_on_signup() function:
ELSE
    -- Block registration for unauthorized emails
    RAISE EXCEPTION 'Registrasi baru tidak diizinkan. Hanya admin@jimpitanku.com dan user@jimpitanku.com yang dapat mengakses sistem ini.';
END IF;
```

## Troubleshooting

### Issue: Still getting PGRST116 error

**Check**: Run the immediate fix script again
```sql
-- Verify role exists
SELECT * FROM user_roles WHERE user_id = '[your-user-id]';
```

**Check**: Verify the code change was applied
```typescript
// Should be .maybeSingle() not .single()
.maybeSingle();
```

### Issue: Admin can't access dashboard

**Check**: Verify RLS policies allow admin access
```sql
SELECT * FROM pg_policies WHERE tablename = 'user_roles';
```

**Check**: Verify user is authenticated
```typescript
const { user } = useAuth();
console.log('User:', user);
```

### Issue: New users don't get roles

**Check**: Verify trigger exists
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

**Check**: Check trigger function logs
```sql
-- Look for RAISE NOTICE messages in Supabase logs
```

## Files Modified

1. **lib/contexts/AuthContext.tsx** - Fixed role fetching logic
2. **fix_admin_role.sql** - Immediate fix script (new)
3. **supabase/migrations/014_fix_admin_role_assignment.sql** - Migration (new)
4. **docs/ADMIN_ROLE_FIX_GUIDE.md** - This documentation (new)

## Summary

The authentication error was caused by:
1. Missing role records in the database
2. Using `.single()` instead of `.maybeSingle()` for optional data

The fix:
1. Changed query method to handle missing roles gracefully
2. Created scripts to assign missing roles
3. Implemented automatic role assignment for future users

After applying these fixes, users should be able to login without errors, and the role-based authentication system will work correctly.
