# Environment Setup Guide

This guide explains how to set up multiple environments for JimpitanKu application.

## Overview

JimpitanKu uses multiple environments to ensure safe development and deployment:

- **Development** - Local development environment
- **Testing** - Automated testing environment
- **Staging** - Pre-production testing environment
- **Production** - Live production environment

## Environment Files

The following environment files are used:

| File | Purpose | When to Use |
|------|---------|-------------|
| `.env.local` | Local development | Running `npm run dev` |
| `.env.test` | Testing | Running tests |
| `.env.staging` | Staging | Deploying to staging |
| `.env.production` | Production | Deploying to production |

⚠️ **IMPORTANT**: Never commit `.env` files to version control. Use `.env.local.example` as a template.

## Setup Instructions

### 1. Create Supabase Projects

Create separate Supabase projects for each environment:

1. **Development Project** (already exists)
   - Name: `jimpitanku-dev`
   - Copy credentials to `.env.local`

2. **Testing Project** (optional)
   - Name: `jimpitanku-test`
   - Copy credentials to `.env.test`

3. **Staging Project** (recommended)
   - Name: `jimpitanku-staging`
   - Copy credentials to `.env.staging`

4. **Production Project** (required)
   - Name: `jimpitanku-prod`
   - Copy credentials to `.env.production`

### 2. Get Supabase Credentials

For each Supabase project:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Environment Files

#### Development (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=JimpitanKu
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Testing (`.env.test`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-test-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-test-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-test-service-role-key
NODE_ENV=test
NEXT_PUBLIC_APP_NAME=JimpitanKu (Test)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Staging (`.env.staging`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key
NODE_ENV=staging
NEXT_PUBLIC_APP_NAME=JimpitanKu (Staging)
NEXT_PUBLIC_APP_URL=https://staging.your-domain.com
```

#### Production (`.env.production`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-prod-service-role-key
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=JimpitanKu
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
```

### 4. Setup Database Schema

Apply the same database schema to all environments:

#### Using Supabase CLI

```bash
# Apply to development
supabase db push --db-url "postgresql://postgres:[password]@dev-db.supabase.co:5432/postgres"

# Apply to staging
supabase db push --db-url "postgresql://postgres:[password]@staging-db.supabase.co:5432/postgres"

# Apply to production
supabase db push --db-url "postgresql://postgres:[password]@prod-db.supabase.co:5432/postgres"
```

#### Using SQL Editor

1. Open Supabase Dashboard for each project
2. Go to **SQL Editor**
3. Run the migration files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/003_rls_policies.sql`
   - `supabase/migrations/005_add_backup_data_column.sql`

⚠️ **IMPORTANT**: Only copy the schema/structure, NOT the data. Production should start with clean data.

### 5. Configure Deployment Platform

#### Vercel Setup

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

| Variable | Development | Preview | Production |
|----------|-------------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Dev URL | Dev URL | Prod URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Dev key | Dev key | Prod key |
| `SUPABASE_SERVICE_ROLE_KEY` | Dev key | Dev key | Prod key |
| `NODE_ENV` | `development` | `preview` | `production` |
| `NEXT_PUBLIC_APP_NAME` | `JimpitanKu` | `JimpitanKu` | `JimpitanKu` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Preview URL | Production URL |

#### GitHub Actions Setup

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Add the following secrets:

```
PROD_SUPABASE_URL
PROD_SUPABASE_ANON_KEY
PROD_SUPABASE_SERVICE_ROLE_KEY

STAGING_SUPABASE_URL
STAGING_SUPABASE_ANON_KEY
STAGING_SUPABASE_SERVICE_ROLE_KEY
```

## Usage

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will use `.env.local` automatically.

### Running Tests

```bash
# Run tests with test environment
NODE_ENV=test npm test
```

### Deploying to Staging

```bash
# Deploy to Vercel preview
vercel
```

### Deploying to Production

```bash
# Deploy to Vercel production
vercel --prod
```

## Environment-Specific Behavior

### Development Environment
- Hot reload enabled
- Detailed error messages
- Development tools
- Database: Development project

### Testing Environment
- Automated test execution
- Isolated test database
- No user-facing features
- Database: Testing project

### Staging Environment
- Production-like environment
- Manual testing
- Preview deployments
- Database: Staging project

### Production Environment
- Optimized build
- Minimal error messages
- Live user traffic
- Database: Production project

## Best Practices

✅ **DO:**
- Use separate Supabase projects for each environment
- Keep environment files in `.gitignore`
- Use `.env.local.example` as a template
- Test migrations in staging before production
- Backup production database before major changes
- Rotate credentials regularly

❌ **DON'T:**
- Commit `.env` files to version control
- Use production database for testing
- Share credentials publicly
- Hardcode credentials in code
- Skip testing in staging
- Forget to backup before deployment

## Troubleshooting

### Environment Variables Not Loading

1. Check that the file name matches the environment
2. Restart the development server
3. Verify the file is in the project root
4. Check for syntax errors in the file

### Database Connection Errors

1. Verify the Supabase URL is correct
2. Check that the API keys are valid
3. Ensure the Supabase project is active
4. Check network connectivity

### Deployment Issues

1. Verify environment variables in deployment platform
2. Check build logs for errors
3. Ensure all dependencies are installed
4. Verify database schema is up to date

## Security Notes

- **Never** commit `.env` files to version control
- **Never** share API keys publicly
- **Always** use environment variables for secrets
- **Always** rotate credentials if compromised
- **Always** use HTTPS for production URLs
- **Always** enable RLS (Row Level Security) in Supabase

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
