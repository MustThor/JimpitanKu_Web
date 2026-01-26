# Development Authentication Guide

## Overview

This guide explains how to enable/disable authentication for development and production environments in the JimpitanKu application.

## Problem Solved

During development, you may encounter Supabase rate limiting issues when testing signup functionality. To avoid this, authentication can be disabled in development mode while keeping it enabled for production deployment.

## Environment Variable

The authentication toggle is controlled by the `NEXT_PUBLIC_ENABLE_AUTH` environment variable:

- `NEXT_PUBLIC_ENABLE_AUTH=false` - Authentication disabled (development mode)
- `NEXT_PUBLIC_ENABLE_AUTH=true` - Authentication enabled (production mode)

## Development Mode Setup

### 1. Configure Environment Variables

In your `.env.local` file, ensure authentication is disabled:

```env
NEXT_PUBLIC_ENABLE_AUTH=false
```

### 2. Apply Development Storage Policies

Run the development mode migration to allow public access to storage:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration in your Supabase dashboard SQL editor
# File: supabase/migrations/009_dev_mode_public_access.sql
```

This migration allows:
- Public read access to photos
- Public upload access to photos
- Public delete access to photos

### 3. Restart Development Server

After changing environment variables, restart your dev server:

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### 4. Test Without Authentication

You can now access protected pages without logging in:
- `/dashboard` - Dashboard page
- `/input` - Input jimpitan page
- `/riwayat` - History page
- `/settings` - Settings page

## Production Mode Setup

### 1. Configure Environment Variables

In your `.env.production` file, ensure authentication is enabled:

```env
NEXT_PUBLIC_ENABLE_AUTH=true
```

### 2. Apply Production Storage Policies

Run the production mode migration to restore authenticated-only access:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the migration in your Supabase dashboard SQL editor
# File: supabase/migrations/010_prod_mode_authenticated_access.sql
```

This migration:
- Keeps public read access to photos
- Removes public upload access
- Removes public delete access
- Restores authenticated-only upload and delete access

### 3. Verify Authentication is Enabled

Before deploying, verify:
- `NEXT_PUBLIC_ENABLE_AUTH=true` is set in production environment variables
- Production storage policies are applied
- Users can sign up and log in
- Protected routes require authentication

### 4. Deploy

Deploy your application with authentication enabled:

```bash
# For Vercel
vercel --prod

# Or use your deployment platform
```

## Migration Files

### Development Mode
- **File**: `supabase/migrations/009_dev_mode_public_access.sql`
- **Purpose**: Allow public access to storage for development
- **Policies**:
  - `Public photos are viewable by everyone` - Public read access
  - `Public users can upload photos (dev mode)` - Public upload access
  - `Public users can delete photos (dev mode)` - Public delete access

### Production Mode
- **File**: `supabase/migrations/010_prod_mode_authenticated_access.sql`
- **Purpose**: Restore authenticated-only access for production
- **Policies**:
  - `Public photos are viewable by everyone` - Public read access (kept)
  - `Authenticated users can upload photos` - Authenticated upload access
  - `Users can delete their own photos` - Authenticated delete access

## How It Works

### ProtectedRoute Component

The [`ProtectedRoute`](components/auth/ProtectedRoute.tsx:15-19) component checks the `NEXT_PUBLIC_ENABLE_AUTH` environment variable:

```typescript
const authEnabled = process.env.NEXT_PUBLIC_ENABLE_AUTH === 'true';

if (!authEnabled) {
  console.log('[ProtectedRoute] Authentication is disabled (development mode)');
  return <>{children}</>;
}
```

When authentication is disabled:
- No authentication checks are performed
- Protected pages render immediately
- No redirect to login page
- No loading spinner

When authentication is enabled:
- User authentication is checked
- Unauthenticated users are redirected to `/login`
- Loading spinner shows during auth check
- Protected pages only render for authenticated users

## Security Considerations

### Development Mode
- **Use ONLY in development environments**
- **NEVER deploy with `NEXT_PUBLIC_ENABLE_AUTH=false`**
- Public access to storage means anyone can upload/delete photos
- Suitable for local development and testing

### Production Mode
- **ALWAYS use `NEXT_PUBLIC_ENABLE_AUTH=true` in production**
- Authenticated-only access to storage
- Users must sign up and log in to access protected features
- Required for security and data protection

## Troubleshooting

### Issue: Still being redirected to login in development

**Solution**:
1. Check that `NEXT_PUBLIC_ENABLE_AUTH=false` is in `.env.local`
2. Restart the development server
3. Check browser console for `[ProtectedRoute] Authentication is disabled` message

### Issue: Cannot upload photos in development

**Solution**:
1. Ensure development storage policies are applied (migration 009)
2. Check Supabase dashboard for storage policies
3. Verify bucket `jimpitan-photos` exists

### Issue: Storage policy errors in production

**Solution**:
1. Ensure `NEXT_PUBLIC_ENABLE_AUTH=true` is set
2. Apply production storage policies (migration 010)
3. Verify users are authenticated before uploading

### Issue: Rate limiting during development

**Solution**:
1. Disable authentication with `NEXT_PUBLIC_ENABLE_AUTH=false`
2. Apply development storage policies
3. Restart development server

## Switching Between Modes

### From Development to Production

1. Update environment variables:
   ```env
   NEXT_PUBLIC_ENABLE_AUTH=true
   ```

2. Apply production storage policies:
   ```bash
   # Run migration 010
   supabase db push
   ```

3. Test authentication flow:
   - Sign up a test user
   - Log in
   - Access protected pages
   - Upload a photo

4. Deploy to production

### From Production to Development

1. Update environment variables:
   ```env
   NEXT_PUBLIC_ENABLE_AUTH=false
   ```

2. Apply development storage policies:
   ```bash
   # Run migration 009
   supabase db push
   ```

3. Restart development server

## Best Practices

1. **Always test authentication before deploying** - Verify signup, login, and protected routes work
2. **Keep development and production databases separate** - Use different Supabase projects
3. **Document environment variables** - Keep `.env.local.example` updated
4. **Use environment-specific configs** - Different `.env` files for different environments
5. **Never commit `.env` files** - Add `.env*` to `.gitignore`

## Additional Resources

- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [AUTHENTICATION_IMPLEMENTATION.md](AUTHENTICATION_IMPLEMENTATION.md) - Original authentication implementation guide

## Summary

- **Development**: Set `NEXT_PUBLIC_ENABLE_AUTH=false` and apply migration 009
- **Production**: Set `NEXT_PUBLIC_ENABLE_AUTH=true` and apply migration 010
- **Security**: Never deploy with authentication disabled
- **Testing**: Always test authentication flow before production deployment
