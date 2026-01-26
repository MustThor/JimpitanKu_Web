# Storage Upload Error Debug Report

## Error Details

**Error Message**: `new row violates row-level security policy`

**Error URL**: `https://aoyitixilizhbisdjamy.supabase.co/storage/v1/object/jimpitan-photos/439a8064-a3e9-4b43-8bbf-03f9223f17fc_1769435197408.png`

**HTTP Status**: 400 (Bad Request)

## Root Cause Analysis

### Problem Identified
The application is attempting to upload to the **production Supabase instance** (`aoyitixilizhbisdjamy.supabase.co`) instead of the **development instance** (`jiiubrcdihxlhuaacpdb.supabase.co`).

### Why This Causes RLS Violation

1. **Authentication Requirement**: Production RLS policies require authenticated users for uploads:
   ```sql
   CREATE POLICY "Authenticated users can upload photos"
   ON storage.objects FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'jimpitan-photos');
   ```

2. **User Not Authenticated**: If you're not logged into the production Supabase instance, the upload will fail with RLS violation.

3. **Wrong Environment**: Development code should use development credentials, not production.

## Environment Configuration

### Current Configuration Files

**`.env.local` (Development)**:
```
NEXT_PUBLIC_SUPABASE_URL= https://jiiubrcdihxlhuaacpdb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ENABLE_AUTH=true
```

**`.env.production` (Production)**:
```
NEXT_PUBLIC_SUPABASE_URL= https://aoyitixilizhbisdjamy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY= eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ENABLE_AUTH=true
```

## Diagnostic Logging Added

I've added comprehensive logging to help diagnose the issue:

### 1. Supabase Client Initialization (`lib/supabase/client.ts`)
```javascript
console.log('[Supabase Client] Initializing with:', {
  supabaseUrl: supabaseUrl,
  isProduction: supabaseUrl?.includes('aoyitixilizhbisdjamy'),
  isDevelopment: supabaseUrl?.includes('jiiubrcdihxlhuaacpdb'),
  nodeEnv: process.env.NODE_ENV,
  enableAuth: process.env.NEXT_PUBLIC_ENABLE_AUTH,
  timestamp: new Date().toISOString()
});
```

### 2. Photo Upload Attempt (`lib/supabase/storage.ts`)
```javascript
console.log('[DEBUG] Upload photo - Environment & Auth status:', {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  isProduction: process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('aoyitixilizhbisdjamy'),
  hasSession: !!session,
  userId: session?.user?.id,
  userEmail: session?.user?.email,
  bucketName: BUCKET_NAME,
  fileName: `${jimpitanId}_${Date.now()}.${file.name.split('.').pop()}`
});
```

## Possible Scenarios & Solutions

### Scenario 1: Accessing Deployed Production App
**Symptoms**: You're accessing the app via a deployed URL (e.g., Vercel, Netlify)

**Solution**: 
- If you want to test locally, ensure you're running `npm run dev` and accessing `http://localhost:3000`
- If you want to test in production, you must be authenticated in the production Supabase instance

### Scenario 2: Environment Variables Not Loading
**Symptoms**: Running locally but using production credentials

**Solution**:
1. Restart the development server:
   ```bash
   npm run dev
   ```
2. Clear Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```
3. Verify `.env.local` exists and has correct values

### Scenario 3: NODE_ENV Set to Production
**Symptoms**: Running locally but with `NODE_ENV=production`

**Solution**:
1. Check if you're running with production mode:
   ```bash
   npm run build:prod
   npm start
   ```
2. Instead, use development mode:
   ```bash
   npm run dev
   ```

### Scenario 4: Cached Environment Variables
**Symptoms**: Environment variables not updating after changes

**Solution**:
1. Stop the development server (Ctrl+C)
2. Delete `.next` directory:
   ```bash
   rm -rf .next
   ```
3. Restart the server:
   ```bash
   npm run dev
   ```

## Immediate Action Steps

### Step 1: Check Console Logs
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for `[Supabase Client] Initializing with:` log
4. Look for `[DEBUG] Upload photo - Environment & Auth status:` log when attempting upload

### Step 2: Verify Environment
Check what the logs show:
- `isProduction: true` → Using production credentials
- `isDevelopment: true` → Using development credentials
- `hasSession: false` → Not authenticated

### Step 3: Fix Based on Diagnosis

**If using production credentials locally:**
```bash
# Stop server
# Delete cache
rm -rf .next

# Restart development server
npm run dev
```

**If accessing deployed app:**
- Log in to the production Supabase instance
- Or switch to local development environment

**If not authenticated:**
1. Go to `/login` page
2. Sign in with your credentials
3. Try uploading again

## RLS Policy Reference

### Production Policies (Authenticated Only)
```sql
-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jimpitan-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'jimpitan-photos');
```

### Development Policies (Public Access)
```sql
-- Allow public upload access (development mode only)
CREATE POLICY "Public users can upload photos (dev mode)"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'jimpitan-photos');

-- Allow public delete access (development mode only)
CREATE POLICY "Public users can delete photos (dev mode)"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'jimpitan-photos');
```

## Verification Steps

After applying fixes:

1. **Check Supabase Client Log**: Should show `isDevelopment: true`
2. **Check Upload Log**: Should show `hasSession: true` (if auth enabled)
3. **Test Upload**: Should succeed without RLS violation
4. **Verify URL**: Should use `jiiubrcdihxlhuaacpdb.supabase.co`

## Additional Resources

- [Supabase Storage RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Environment Setup Guide](./ENVIRONMENT_SETUP.md)

## Summary

The most likely cause is that your application is using production Supabase credentials instead of development credentials. This causes the RLS policy violation because:

1. Production requires authentication for uploads
2. You're likely not authenticated in the production instance
3. Development code should use development credentials

**Immediate Fix**: Ensure you're running the app locally with `npm run dev` and accessing `http://localhost:3000`, not a deployed URL.
