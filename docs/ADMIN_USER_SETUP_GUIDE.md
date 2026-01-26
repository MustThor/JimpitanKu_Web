# Panduan Setup Admin dan User

## Overview
Sistem JimpitanKu_Web sudah dikonfigurasi untuk membatasi akses dengan dua akun:
- **admin@jimpitanku.com** - Role: Admin (bisa hapus backup)
- **user@jimpitanku.com** - Role: User (tidak bisa hapus backup)

**Fitur Keamanan:**
✅ **Login Required** - Semua halaman memerlukan login sebelum akses
✅ **Auto Redirect** - Belum login → otomatis redirect ke halaman login
✅ **Tombol Logout** - Logout button tersedia di header setiap halaman
✅ **Role-based Access** - Admin bisa hapus backup, user tidak bisa
✅ **Route Protection** - Semua halaman terproteksi dengan ProtectedRoute

## Cara Setup Akun

### Langkah 1: Jalankan Migration di Supabase

Pastikan semua migration sudah dijalankan di Supabase dashboard:

1. Buka Supabase Dashboard
2. Masuk ke project Anda
3. Buka SQL Editor
4. Jalankan migration berikut secara berurutan:
   - `001_initial_schema.sql`
   - `002_seed_data.sql`
   - `003_rls_policies.sql`
   - `005_add_backup_data_column.sql`
   - `006_add_photo_url_column.sql`
   - `007_storage_policies.sql`
   - `008_create_storage_bucket.sql`
   - `011_create_user_roles.sql`
   - `012_update_backup_rls_policies.sql`
   - `013_seed_admin_user_roles.sql`

### Langkah 2: Buat Akun Admin

**Option A: Via Signup Form Aplikasi**

1. Buka aplikasi di browser
2. Masuk ke halaman signup
3. Daftar dengan email: `admin@jimpitanku.com`
4. Masukkan password yang aman
5. Role "admin" akan otomatis diberikan

**Option B: Via Supabase Dashboard**

1. Buka Supabase Dashboard
2. Masuk ke **Authentication** → **Users**
3. Klik **"Add user"** → **"Create new user"**
4. Email: `admin@jimpitanku.com`
5. Set password dan aktifkan **"Auto Confirm User"**
6. Klik **"Create user"**

### Langkah 3: Buat Akun User

Gunakan salah satu metode di atas untuk membuat akun:
- Email: `user@jimpitanku.com`
- Role "user" akan otomatis diberikan

## Fitur Perbedaan Admin vs User

### Admin (admin@jimpitanku.com)
✅ Login ke sistem
✅ Input data jimpitan
✅ Melihat dashboard dan riwayat
✅ Membuat backup
✅ Merestore backup
✅ **Menghapus backup** (tombol hapus visible)

### User (user@jimpitanku.com)
✅ Login ke sistem
✅ Input data jimpitan
✅ Melihat dashboard dan riwayat
✅ Membuat backup
✅ Merestore backup
❌ **Tidak bisa menghapus backup** (tombol hapus hidden)

## Verifikasi Setup

### 1. Cek Role di Database

Jalankan query ini di SQL Editor Supabase:

```sql
SELECT 
    u.id,
    u.email,
    ur.role,
    u.created_at
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
ORDER BY u.created_at;
```

Hasil yang diharapkan:
```
id | email                   | role  | created_at
----|-------------------------|-------|-------------------------
uuid | admin@jimpitanku.com   | admin | 2026-01-26 ...
uuid | user@jimpitanku.com    | user  | 2026-01-26 ...
```

### 2. Cek RLS Policies untuk Backup

Jalankan query ini untuk verifikasi kebijakan delete:

```sql
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'backup_history'
ORDER BY policyname;
```

Pastikan ada policy dengan nama `Allow only admins to delete backup` dan cmd = `DELETE`.

### 3. Test Aplikasi

**Test sebagai Admin:**
1. Login dengan `admin@jimpitanku.com`
2. Masuk ke halaman Backup
3. Buat backup baru
4. Pastikan tombol delete (ikon sampah) visible
5. Coba hapus backup → harus berhasil

**Test sebagai User:**
1. Logout dari admin
2. Login dengan `user@jimpitanku.com`
3. Masuk ke halaman Backup
4. Pastikan tombol delete (ikon sampah) TIDAK visible
5. Coba akses endpoint delete secara manual → harus gagal

## Troubleshooting

### Problem: Tombol delete muncul untuk user biasa
**Solution:**
1. Cek AuthContext memanggil isAdmin() dengan benar
2. Buka browser console untuk melihat role user
3. Verifikasi data di tabel user_roles

### Problem: User tidak bisa menghapus backup tapi error muncul
**Solution:**
1. Pastikan migration 012 sudah dijalankan
2. Cek policy RLS di database
3. Verify bahwa user ID di auth.users cocok dengan user_roles

### Problem: Role tidak otomatis ter-assign saat signup
**Solution:**
1. Pastikan migration 013 sudah dijalankan
2. Cek trigger `on_auth_user_created` ada di database:
   ```sql
   SELECT * FROM pg_trigger 
   WHERE tgname = 'on_auth_user_created';
   ```
3. Verify function `assign_user_role()` ada:
   ```sql
   SELECT * FROM pg_proc 
   WHERE proname = 'assign_user_role';
   ```

### Problem: Registrasi email lain diblokir tapi tetap bisa
**Solution:**
1. Verifikasi trigger function berjalan:
   ```sql
   SELECT * FROM auth.users ORDER BY created_at DESC LIMIT 5;
   ```
2. Cek log error di Supabase dashboard
3. Pastikan migration 013 benar-benar dijalankan

## Membatasi Hanya Dua Akun

Sistem sudah dikonfigurasi untuk:
1. ✅ Otomatis memberi role admin untuk `admin@jimpitanku.com`
2. ✅ Otomatis memberi role user untuk `user@jimpitanku.com`
3. ✅ **Memblokir** registrasi untuk email lain

Email lain tidak bisa mendaftar karena trigger di migration 013 akan melempar exception.

## Memodifikasi Email Admin/User

Jika ingin mengubah email admin atau user, edit file:
`supabase/migrations/013_seed_admin_user_roles.sql`

Ganti email di fungsi `assign_user_role()`:

```sql
-- Contoh mengubah email admin
IF NEW.email = 'email_admin_baru@example.com' THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Contoh mengubah email user
ELSIF NEW.email = 'email_user_baru@example.com' THEN
    INSERT INTO user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id) DO UPDATE SET role = 'user';
```

Lalu jalankan ulang migration atau buat migration baru.

## Security Notes

⚠️ **PENTING:**
1. Jangan share password untuk akun admin
2. Gunakan password yang kuat untuk kedua akun
3. Aktifkan 2FA jika tersedia di Supabase
4. Audit log aktivitas admin secara berkala
5. Backup database secara regular

## Database Schema Reference

### Tabel user_roles
```sql
CREATE TABLE user_roles (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id),
    role VARCHAR(20) CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMPTZ
);
```

### Policy RLS untuk Backup Delete
```sql
CREATE POLICY "Allow only admins to delete backup"
ON backup_history
FOR DELETE USING (
    EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
    )
);
```

## Dukungan

Jika mengalami masalah:
1. Cek Supabase logs di dashboard
2. Review migration yang sudah dijalankan
3. Test dengan SQL Editor untuk verifikasi data
4. Lihat error di browser console (F12 → Console)