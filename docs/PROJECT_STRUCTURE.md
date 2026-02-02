# Struktur Folder Project JimpitanKu_Web

Dokumentasi ini menjelaskan struktur folder dan file utama dalam project JimpitanKu_Web.

## 📋 Daftar Isi

- [Overview](#overview)
- [Struktur Folder Utama](#struktur-folder-utama)
- [Detail Setiap Folder](#detail-setiap-folder)
- [File Konfigurasi Root](#file-konfigurasi-root)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)

---

## Overview

JimpitanKu_Web adalah aplikasi web untuk manajemen sistem "jimpitan" (kumpulan uang komunitas) yang dibangun dengan Next.js 14+, TypeScript, dan Supabase sebagai backend.

---

## Struktur Folder Utama

```
JimpitanKu_Web/
├── app/                    # Next.js App Router - Halaman dan API routes
├── components/             # Komponen React yang reusable
├── hooks/                  # Custom React Hooks
├── lib/                    # Library, utilities, dan konfigurasi
├── docs/                   # Dokumentasi project
├── plans/                  # Dokumen perencanaan fitur
├── scripts/                # Scripts utilitas
├── supabase/               # Database migrations dan konfigurasi
├── public/                 # Static assets (images, fonts, dll)
└── [config files]          # File konfigurasi root
```

---

## Detail Setiap Folder

### 📁 `app/` - Next.js App Router

Folder ini berisi semua halaman aplikasi menggunakan Next.js App Router pattern.

#### Struktur:
```
app/
├── globals.css              # Global styles
├── layout.tsx               # Root layout component
├── page.tsx                 # Halaman utama (landing page)
├── about/
│   └── page.tsx            # Halaman tentang aplikasi
├── api/
│   └── cron/
│       └── backup/
│           └── route.ts    # API route untuk cron job backup
├── backup/
│   └── page.tsx            # Halaman backup data
├── cutoff/
│   └── page.tsx            # Halaman cutoff/pemotongan
├── dashboard/
│   └── page.tsx            # Dashboard utama
├── input/
│   └── page.tsx            # Form input data jimpitan
├── login/
│   └── page.tsx            # Halaman login
├── riwayat/
│   └── page.tsx            # Halaman riwayat transaksi
├── settings/
│   └── page.tsx            # Halaman pengaturan
└── signup/
    └── page.tsx            # Halaman pendaftaran
```

#### Deskripsi:
- **Halaman Publik**: Landing page, about, login, signup
- **Halaman Terproteksi**: Dashboard, input, riwayat, backup, cutoff, settings
- **API Routes**: Endpoint untuk cron job backup dan integrasi eksternal

---

### 📁 `components/` - Komponen React

Berisi komponen-komponen UI yang reusable dan modular.

#### Struktur:
```
components/
├── auth/                   # Komponen autentikasi
│   ├── LoginForm.tsx      # Form login
│   ├── SignupForm.tsx     # Form pendaftaran
│   └── ProtectedRoute.tsx # Wrapper untuk proteksi route
├── dashboard/              # Komponen dashboard
│   ├── DailyBarChart.tsx  # Grafik batang harian
│   ├── StatCard.tsx       # Kartu statistik
│   └── WeeklyChart.tsx    # Grafik mingguan
├── layout/                 # Komponen layout
│   ├── Header.tsx         # Header aplikasi
│   └── Sidebar.tsx        # Sidebar navigasi
└── ui/                     # Komponen UI dasar
    ├── Button.tsx         # Komponen tombol
    ├── Input.tsx          # Komponen input field
    ├── Modal.tsx          # Komponen modal
    ├── PhotoThumbnail.tsx # Thumbnail foto
    ├── PhotoUpload.tsx    # Komponen upload foto
    └── Select.tsx         # Komponen dropdown select
```

#### Deskripsi:
- **auth/**: Komponen untuk autentikasi dan proteksi route
- **dashboard/**: Komponen visualisasi data di dashboard
- **layout/**: Komponen struktur layout aplikasi
- **ui/**: Komponen UI dasar yang reusable

---

### 📁 `hooks/` - Custom React Hooks

Berisi custom hooks untuk manajemen state dan logic yang kompleks.

#### Struktur:
```
hooks/
├── useAppSettings.ts      # Hook untuk pengaturan aplikasi
├── useBackup.ts           # Hook untuk backup data
├── useCutoff.ts           # Hook untuk operasi cutoff
├── useJimpitan.ts         # Hook untuk operasi jimpitan
└── useTheme.ts            # Hook untuk manajemen tema
```

#### Deskripsi:
- **useAppSettings**: Mengelola pengaturan aplikasi (nama RT, tema, dll)
- **useBackup**: Mengelola operasi backup dan restore data
- **useCutoff**: Mengelola proses cutoff/pemotongan periode
- **useJimpitan**: Mengelola CRUD operasi data jimpitan
- **useTheme**: Mengelola tema (light/dark mode)

---

### 📁 `lib/` - Library dan Utilities

Berisi fungsi helper, konfigurasi, dan integrasi dengan layanan eksternal.

#### Struktur:
```
lib/
├── constants.ts            # Konstanta aplikasi
├── contexts/               # React Context providers
│   └── AuthContext.tsx   # Context untuk autentikasi
├── supabase/               # Integrasi Supabase
│   ├── client.ts          # Supabase client instance
│   ├── storage.ts         # Operasi storage Supabase
│   └── types.ts           # TypeScript types untuk Supabase
└── utils/                  # Utility functions
    ├── export.ts          # Fungsi export data
    ├── format.ts          # Fungsi formatting (currency, date, dll)
    └── validation.ts      # Fungsi validasi input
```

#### Deskripsi:
- **constants**: Konstanta yang digunakan di seluruh aplikasi
- **contexts**: React Context untuk state global (auth, theme, dll)
- **supabase**: Konfigurasi dan helper untuk integrasi Supabase
- **utils**: Fungsi utilitas untuk formatting, validasi, dan export

---

### 📁 `docs/` - Dokumentasi

Berisi berbagai dokumentasi dan panduan untuk pengembangan.

#### Struktur:
```
docs/
├── ADMIN_ROLE_FIX_GUIDE.md              # Panduan fix role admin
├── ADMIN_USER_SETUP_GUIDE.md            # Panduan setup user admin
├── AUTHENTICATION_IMPLEMENTATION.md     # Dokumentasi implementasi auth
├── backup-issue-fix.md                  # Fix untuk masalah backup
├── DEVELOPMENT_AUTHENTICATION_GUIDE.md  # Panduan auth untuk development
├── ENVIRONMENT_QUICK_START.md           # Quick start environment
├── ENVIRONMENT_README.md                # README environment
├── ENVIRONMENT_SETUP.md                 # Setup environment lengkap
├── PRODUCTION_STORAGE_FIX_GUIDE.md      # Fix storage production
└── STORAGE_UPLOAD_DEBUG_REPORT.md       # Debug report upload storage
```

#### Deskripsi:
- Panduan setup environment dan konfigurasi
- Dokumentasi implementasi autentikasi
- Panduan troubleshooting dan fix
- Debug reports untuk berbagai isu

---

### 📁 `plans/` - Perencanaan

Berisi dokumen perencanaan fitur dan arsitektur sistem.

#### Struktur:
```
plans/
├── admin-user-role-system.md    # Rencana sistem role admin
├── jimpitan-app-plan.md         # Rencana aplikasi jimpitan
└── photo-upload-feature-plan.md # Rencana fitur upload foto
```

#### Deskripsi:
- **admin-user-role-system**: Perencanaan sistem role-based access control
- **jimpitan-app-plan**: Perencanaan fitur utama aplikasi
- **photo-upload-feature-plan**: Perencanaan fitur upload dan storage foto

---

### 📁 `scripts/` - Scripts Utilitas

Berisi script untuk otomatisasi dan maintenance.

#### Struktur:
```
scripts/
└── remove-dummy-data.js    # Script untuk menghapus dummy data
```

#### Deskripsi:
- Script untuk operasi database maintenance
- Script untuk data seeding dan cleanup
- Script untuk deployment dan CI/CD

---

### 📁 `supabase/` - Database Migrations

Berisi migrasi database dan konfigurasi Supabase.

#### Struktur:
```
supabase/
├── .temp/                    # Temporary files
└── migrations/               # SQL migration files
    ├── 001_initial_schema.sql                # Schema awal database
    ├── 002_seed_data.sql                     # Data awal (seed)
    ├── 003_rls_policies.sql                  # Row Level Security policies
    ├── 004_remove_dummy_data.sql             # Hapus dummy data
    ├── 005_add_backup_data_column.sql        # Tambah kolom backup
    ├── 006_add_photo_url_column.sql          # Tambah kolom foto
    ├── 007_storage_policies.sql              # Storage policies
    ├── 008_create_storage_bucket.sql         # Create storage bucket
    ├── 009_dev_mode_public_access.sql        # Public access dev mode
    ├── 010_prod_mode_authenticated_access.sql # Authenticated access prod
    ├── 011_create_user_roles.sql             # Tabel user roles
    ├── 012_update_backup_rls_policies.sql    # Update RLS backup
    ├── 013_seed_admin_user_roles.sql         # Seed admin roles
    ├── 014_fix_admin_role_assignment.sql     # Fix role assignment
    ├── 015_fix_production_storage_policies.sql # Fix storage policies
    ├── 016_allow_zero_amount.sql             # Allow amount 0
    ├── 017_add_is_archived_column.sql        # Tambah kolom archived
    ├── 018_create_cutoff_history_table.sql   # Tabel cutoff history
    └── 019_seed_total_pemasukan.sql          # Seed total pemasukan
```

#### Deskripsi:
- **Migrations**: File SQL untuk setup dan update database
- **RLS Policies**: Row Level Security untuk keamanan data
- **Storage Policies**: Policies untuk akses file storage
- **Seed Data**: Data awal untuk development dan production

---

## File Konfigurasi Root

### File Konfigurasi Utama

| File | Deskripsi |
|------|-----------|
| [`package.json`](../package.json) | Dependencies, scripts, dan metadata project |
| [`next.config.js`](../next.config.js) | Konfigurasi Next.js |
| [`tailwind.config.ts`](../tailwind.config.ts) | Konfigurasi Tailwind CSS |
| [`tsconfig.json`](../tsconfig.json) | Konfigurasi TypeScript |
| [`postcss.config.js`](../postcss.config.js) | Konfigurasi PostCSS |
| [`vercel.json`](../vercel.json) | Konfigurasi deployment Vercel |
| [`.env.local.example`](../.env.local.example) | Template environment variables |
| [`.gitignore`](../.gitignore) | File dan folder yang di-ignore git |

### Environment Variables

Template environment variables tersedia di [`.env.local.example`](../.env.local.example):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Application Settings
NEXT_PUBLIC_APP_NAME=JimpitanKu
NEXT_PUBLIC_DEFAULT_THEME=light
```

---

## Teknologi yang Digunakan

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API, Custom Hooks

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

### Deployment
- **Platform**: Vercel
- **CI/CD**: Vercel Git Integration

### Development Tools
- **Package Manager**: npm
- **Version Control**: Git
- **Code Editor**: VS Code

---

## Ringkasan Fitur Aplikasi

Aplikasi JimpitanKu_Web menyediakan fitur:

1. **Autentikasi**: Login, signup, dan role-based access control
2. **Dashboard**: Visualisasi statistik dan grafik
3. **Input Data**: Form input data jimpitan dengan upload foto
4. **Riwayat**: History transaksi dengan filter dan search
5. **Backup**: Backup dan restore data
6. **Cutoff**: Proses pemotongan periode dengan history
7. **Settings**: Pengaturan aplikasi (nama RT, tema, dll)
8. **Admin Panel**: Manajemen user dan role

---

## Kontribusi

Untuk berkontribusi pada project ini, pastikan untuk:

1. Memahami struktur folder yang dijelaskan di atas
2. Membaca dokumentasi di folder [`docs/`](./)
3. Mengikuti konvensi coding yang sudah ada
4. Menambahkan migration baru jika ada perubahan database
5. Update dokumentasi jika ada perubahan fitur

---

## License

Copyright © 2024 JimpitanKu. All rights reserved.
