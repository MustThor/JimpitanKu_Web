# Production Storage Upload Fix Guide

## Problem
You're experiencing a "new row violates row-level security policy" error when uploading photos in production.

## Root Cause Analysis

Based on the error logs, the issue is one of the following:

### 1. User Not Authenticated (Most Likely)
The production RLS policies require authentication for uploads:
```sql
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jimpitan-photos');
```

If you're not logged in, the upload will fail with RLS violation.

### 2. Storage Policies Not Applied to Production
The storage policies from migrations 007, 009, or 010 might not have been applied to the production Supabase instance.

### 3. Bucket Doesn't Exist in Production
The `jimpitan-photos` bucket might not exist in the production Supabase instance.

## Diagnostic Steps

### Step 1: Check Authentication Status

Look at your browser console for the debug log:
```
[DEBUG] Upload photo - Environment & Auth status:
```

Check these values:
- `hasSession: false` → **You're not authenticated** (this is the problem!)
- `hasSession: true` → You're authenticated, issue is elsewhere

### Step 2: Verify You're Logged In

1. Go to the login page: `/login`
2. Sign in with your credentials
3. Check if you see a success message
4. Try uploading again

### Step 3: Check Console Logs

After attempting upload, look for:
```
[DEBUG] Upload error details:
```

This will show the exact error details.

## Solutions

### Solution 1: Authenticate Before Upload (Recommended)

**If you're not authenticated:**
1. Navigate to `/login`
2. Enter your email and password
3. After successful login, you should be redirected
4. Try uploading the photo again

**If you don't have an account:**
1. Go to `/signup`
2. Create a new account
3. Log in with your new credentials
4. Try uploading the photo again

### Solution 2: Apply Storage Policies to Production

If the storage policies haven't been applied to production:

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your production project: `aoyitixilizhbisdjamy`

2. **Open SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the fix migration:**
   - Copy the content of [`supabase/migrations/015_fix_production_storage_policies.sql`](../supabase/migrations/015_fix_production_storage_policies.sql)
   - Paste it into the SQL editor
   - Click "Run"

4. **Verify the policies:**
   - You should see output showing the policies were created
   - Check that 4 policies were created for `storage.objects`

### Solution 3: Create Storage Bucket (If Missing)

If the bucket doesn't exist:

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your production project

2. **Create the bucket:**
   - Click on "Storage" in the left sidebar
   - Click "New bucket"
   - Name: `jimpitan-photos`
   - Public bucket: ✓ (check the box)
   - File size limit: 5242880 (5MB)
   - Allowed MIME types: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`
   - Click "Create bucket"

3. **Set up policies:**
   - After creating the bucket, click on it
   - Go to "Policies" tab
   - Click "New Policy"
   - Follow Solution 2 to apply the policies

### Solution 4: Disable Authentication (Not Recommended for Production)

**⚠️ WARNING: This is NOT recommended for production!**

If you want to allow public uploads in production (insecure):

1. **Go to Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your production project

2. **Open SQL Editor:**
   - Click on "SQL Editor"
   - Click "New Query"

3. **Run this SQL:**
```sql
-- Allow public upload access (INSECURE - only for testing!)
DROP POLICY IF EXISTS "Authenticated users can upload photos" ON storage.objects;
CREATE POLICY "Public users can upload photos (dev mode)"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'jimpitan-photos');
```

4. **After testing, revert back:**
```sql
-- Remove public access
DROP POLICY IF EXISTS "Public users can upload photos (dev mode)" ON storage.objects;

-- Restore authenticated access
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jimpitan-photos');
```

## Verification

After applying the fix:

1. **Check Authentication:**
   - Ensure you're logged in
   - Check console shows `hasSession: true`

2. **Test Upload:**
   - Try uploading a photo
   - Should succeed without RLS violation

3. **Check Console Logs:**
   - Should see successful upload logs
   - No error messages

## Common Issues & Troubleshooting

### Issue: "Session expired"
**Solution:** Log out and log back in to refresh your session.

### Issue: "Bucket not found"
**Solution:** Create the bucket using Solution 3 above.

### Issue: "Policy not found"
**Solution:** Apply the policies using Solution 2 above.

### Issue: "User not authenticated"
**Solution:** Log in using Solution 1 above.

## Environment Variables Check

Ensure your production environment variables are correct:

**`.env.production`** should have:
```env
NEXT_PUBLIC_SUPABASE_URL=https://aoyitixilizhbisdjamy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
NEXT_PUBLIC_ENABLE_AUTH=true
```

## Next Steps

1. **First, try logging in** - This is the most likely solution
2. **If still failing, apply the storage policies** - Use Solution 2
3. **If bucket is missing, create it** - Use Solution 3
4. **Verify the fix works** - Test upload again

## Additional Resources

- [Supabase Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Storage Upload Debug Report](./STORAGE_UPLOAD_DEBUG_REPORT.md)

## Summary

The most likely cause is that **you're not authenticated** in the production Supabase instance. The production RLS policies require authentication for uploads.

**Quick Fix:**
1. Go to `/login`
2. Log in with your credentials
3. Try uploading again

If that doesn't work, apply the storage policies using the SQL migration provided in [`supabase/migrations/015_fix_production_storage_policies.sql`](../supabase/migrations/015_fix_production_storage_policies.sql).
