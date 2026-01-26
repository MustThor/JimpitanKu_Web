# Quick Start: Environment Setup

This is a quick guide to set up multiple environments for JimpitanKu.

## 📋 Prerequisites

- Supabase account
- Vercel account (for deployment)
- Git repository

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Supabase Projects

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create 2 projects:
   - **Development**: Already exists (use current project)
   - **Production**: Click "New Project" → Name: `jimpitanku-prod`

### Step 2: Get Credentials

For each Supabase project:

1. Go to **Settings** → **API**
2. Copy these values:
   - Project URL
   - anon public key
   - service_role key

### Step 3: Update Environment Files

#### Development (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-dev-service-role-key
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=JimpitanKu
NEXT_PUBLIC_APP_URL=http://localhost:3000
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

### Step 4: Setup Production Database

Option 1: Using Supabase Dashboard (Easiest)

1. Open Supabase Dashboard for production project
2. Go to **SQL Editor**
3. Run these files in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/003_rls_policies.sql`
   - `supabase/migrations/005_add_backup_data_column.sql`

Option 2: Using Supabase CLI

```bash
supabase db push --db-url "postgresql://postgres:[password]@prod-db.supabase.co:5432/postgres"
```

### Step 5: Configure Vercel

1. Go to your Vercel project
2. Navigate to **Settings** → **Environment Variables**
3. Add these variables for **Production**:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-prod-project.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your prod anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your prod service role key |
| `NODE_ENV` | `production` |
| `NEXT_PUBLIC_APP_NAME` | `JimpitanKu` |
| `NEXT_PUBLIC_APP_URL` | Your production domain |

### Step 6: Deploy

```bash
# Deploy to production
vercel --prod
```

## ✅ Verification

### Test Development
```bash
npm run dev
# Open http://localhost:3000
```

### Test Production
```bash
# Deploy to Vercel
vercel --prod

# Visit your production URL
```

## 📁 File Structure

```
jimpitan-ku-web/
├── .env.local              ← Development (not committed)
├── .env.production         ← Production (not committed)
├── .env.staging            ← Staging (not committed)
├── .env.test               ← Testing (not committed)
├── .env.local.example      ← Template (committed)
├── .gitignore              ← Ignores .env files
└── docs/
    ├── ENVIRONMENT_SETUP.md       ← Detailed guide
    └── ENVIRONMENT_QUICK_START.md ← This file
```

## 🔧 Useful Commands

```bash
# Development
npm run dev

# Build for production
npm run build:prod

# Check environment
npm run env:check

# Backup production database
npm run db:backup:prod
```

## ⚠️ Important Notes

- ✅ Use separate Supabase projects for each environment
- ✅ Never commit `.env` files to Git
- ✅ Only copy schema, NOT data, to production
- ✅ Test in development before deploying to production
- ❌ Don't use production database for testing
- ❌ Don't share API keys publicly

## 📚 Additional Resources

- [Detailed Setup Guide](./ENVIRONMENT_SETUP.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🆘 Troubleshooting

### Environment variables not loading?
- Restart your dev server: `npm run dev`
- Check file is in project root
- Verify file name matches environment

### Database connection error?
- Verify Supabase URL is correct
- Check API keys are valid
- Ensure Supabase project is active

### Deployment failed?
- Check Vercel environment variables
- Review build logs
- Verify database schema is up to date

---

**Need help?** Check the [detailed setup guide](./ENVIRONMENT_SETUP.md) for more information.
