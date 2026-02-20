# Penjelasan Lengkap Kode Proyek JimpitanKu

## 📋 Gambaran Umum

**JimpitanKu** adalah aplikasi web modern berbasis Next.js 14 untuk pencatatan dan pengelolaan iuran jimpitan komunitas RT/RW. Aplikasi ini menggunakan Supabase sebagai backend, dengan dukungan autentikasi pengguna, manajemen data, backup/restore, dan fitur cut off bulanan.

---

## 🏗️ Struktur Proyek

```
jimpitan-rt-rw/
├── app/                    # Next.js App Router pages
├── components/              # Reusable components
│   ├── auth/              # Authentication components
│   ├── dashboard/          # Dashboard-specific components
│   ├── layout/             # Layout components (Sidebar, Header)
│   └── ui/                # UI components (Button, Input, Modal, etc.)
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions & config
│   ├── contexts/           # React contexts
│   ├── supabase/          # Supabase client & types
│   └── utils/             # Format & validation utilities
├── supabase/              # Database migrations
└── docs/                  # Documentation files
```

---

## 📦 Konfigurasi Utama

### [`package.json`](../package.json:1)
- **Nama**: `jimpitan-rt-rw`
- **Dependencies**:
  - `@supabase/supabase-js` - Klien Supabase
  - `next` - Framework Next.js 14
  - `react` & `react-dom` - React 18
  - `recharts` - Library grafik
  - `jspdf` & `jspdf-autotable` - Export PDF
  - `xlsx` - Export Excel
  - `lucide-react` - Icon library
  - `tailwindcss` - Styling

### [`next.config.js`](../next.config.js:1)
- Mengaktifkan `reactStrictMode: true`
- Konfigurasi domain gambar kosong

### [`tsconfig.json`](../tsconfig.json:1)
- Target: ES2017
- Strict mode diaktifkan
- Path alias `@/*` untuk root directory

### [`tailwind.config.ts`](../tailwind.config.ts:1)
- Dark mode dengan class-based
- Warna primary custom (blue-500)
- Font family: Inter

---

## 🗄️ Skema Database

### Tabel `jimpitan` ([`001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql:5))
Menyimpan data pencatatan jimpitan:
- `id` (UUID) - Primary key
- `amount` (INTEGER) - Nominal dalam Rupiah
- `collection_date` (DATE) - Tanggal pencatatan
- `week_number` (INTEGER) - Nomor minggu
- `month` (INTEGER) - Bulan (1-12)
- `year` (INTEGER) - Tahun
- `notes` (TEXT) - Catatan tambahan
- `photo_url` (TEXT) - URL foto bukti ([`006_add_photo_url_column.sql`](../supabase/migrations/006_add_photo_url_column.sql:2))
- `is_archived` (BOOLEAN) - Status arsip ([`017_add_is_archived_column.sql`](../supabase/migrations/017_add_is_archived_column.sql:2))
- `created_at` (TIMESTAMPTZ) - Waktu input

### Tabel `backup_history` ([`001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql:17))
Menyimpan riwayat backup:
- `id` (UUID) - Primary key
- `backup_name` (VARCHAR) - Nama file backup
- `backup_data` (JSONB) - Data jimpitan yang di-backup
- `created_at` (TIMESTAMPTZ) - Waktu dibuat
- `restored_at` (TIMESTAMPTZ) - Waktu di-restore

### Tabel `pengaturan` ([`001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql:25))
Menyimpan konfigurasi aplikasi:
- `id` (UUID) - Primary key
- `key` (VARCHAR) - Kunci pengaturan (unique)
- `value` (TEXT) - Nilai pengaturan
- `updated_at` (TIMESTAMPTZ) - Waktu update terakhir

### Tabel `user_roles` ([`011_create_user_roles.sql`](../supabase/migrations/011_create_user_roles.sql:2))
Manajemen role pengguna:
- `id` (UUID) - Primary key
- `user_id` (UUID) - Referensi ke auth.users
- `role` (VARCHAR) - 'admin' atau 'user'
- `created_at` (TIMESTAMPTZ) - Waktu dibuat

### Tabel `cutoff_history` ([`018_create_cutoff_history_table.sql`](../supabase/migrations/018_create_cutoff_history_table.sql:2))
Menyimpan riwayat cut off:
- `id` (UUID) - Primary key
- `cutoff_date` (TIMESTAMPTZ) - Tanggal cut off
- `amount` (INTEGER) - Jumlah yang di-cut off
- `period_month` (INTEGER) - Bulan periode
- `period_year` (INTEGER) - Tahun periode
- `created_at` (TIMESTAMPTZ) - Waktu dibuat

### Storage Bucket ([`008_create_storage_bucket.sql`](../supabase/migrations/008_create_storage_bucket.sql:5))
- `jimpitan-photos` - Bucket untuk upload foto
- Public access
- File size limit: 5MB
- Allowed types: JPEG, PNG, WebP

---

## 🔐 Sistem Autentikasi

### [`AuthContext.tsx`](../lib/contexts/AuthContext.tsx:1)
Context React untuk manajemen autentikasi:

**State**:
- `user` - User yang sedang login
- `session` - Session Supabase
- `loading` - Status loading
- `role` - Role pengguna ('admin' atau 'user')

**Methods**:
- `signIn(email, password)` - Login pengguna
- `signUp(email, password, name)` - Registrasi pengguna baru
- `signOut()` - Logout pengguna
- `isAdmin()` - Cek apakah user adalah admin
- `fetchUserRole(userId)` - Fetch role user dari database

**Fitur**:
- Auto-fetch session saat mount
- Listen untuk perubahan auth state
- Logging debug untuk troubleshooting

### [`LoginForm.tsx`](../components/auth/LoginForm.tsx:1)
Form login dengan validasi:
- Input email dan password
- Error handling dengan pesan yang jelas
- Redirect ke dashboard setelah login sukses
- Debug logging

### [`SignupForm.tsx`](../components/auth/SignupForm.tsx:1)
Form registrasi dengan validasi:
- Input nama, email, password, konfirmasi password
- Validasi: password minimal 6 karakter, password harus cocok
- Opsional: filter email yang diizinkan
- Pesan sukses setelah registrasi

### [`ProtectedRoute.tsx`](../components/auth/ProtectedRoute.tsx:1)
HOC untuk proteksi route:
- Cek apakah user sudah login
- Redirect ke `/login` jika belum login
- Support mode development tanpa auth (via env var)
- Loading state saat cek auth

---

## 📄 Halaman Utama

### [`app/layout.tsx`](../app/layout.tsx:1)
Root layout aplikasi:
- Import font Inter
- Bungkus children dengan `AuthProvider`
- Metadata: title dan description

### [`app/page.tsx`](../app/page.tsx:1)
Halaman home:
- Redirect otomatis berdasarkan status:
  - Jika auth enabled dan user belum login → `/login`
  - Jika auth disabled atau user sudah login → `/dashboard`
- Loading spinner saat redirect

### [`app/login/page.tsx`](../app/login/page.tsx:1)
Halaman login:
- Layout centered dengan branding
- Menggunakan `LoginForm` component

### [`app/signup/page.tsx`](../app/signup/page.tsx:1)
Halaman registrasi:
- Hardcoded allowed emails: `admin@jimpitanku.com`, `user@jimpitanku.com`
- Menampilkan pesan blokir jika email tidak diizinkan
- Redirect ke dashboard jika sudah login

---

## 📊 Dashboard ([`app/dashboard/page.tsx`](../app/dashboard/page.tsx:1))

**Fitur**:
- StatCard untuk 3 metrik:
  - Total Pemasukan Bulan Sebelumnya
  - Pemasukan Bulan Ini
  - Pemasukan Minggu Ini
- Grafik mingguan (WeeklyChart)
- Grafik harian (DailyBarChart)
- Entri terbaru (5 item)
- Modal untuk tambah jimpitan baru
- Filter bulan/tahun (admin only)
- Export PDF/Excel (admin only)

**State**:
- `formData` - Data form input jimpitan
- `selectedMonth` / `selectedYear` - Filter untuk grafik
- `isModalOpen` - Status modal tambah
- `errors` - Validasi errors

**Logic**:
- Auto-fill hari berdasarkan tanggal
- Validasi input sebelum submit
- Upload foto ke Supabase Storage
- Auto-refresh data setelah tambah

---

## ➕ Input Jimpitan ([`app/input/page.tsx`](../app/input/page.tsx:1))

**Fitur**:
- Form input lengkap dengan validasi
- Upload foto bukti
- Auto-fill hari berdasarkan tanggal
- Entri terbaru (5 item)

**Fields**:
- Jumlah (Rp)
- Tanggal
- Hari Pengumpulan (auto-filled)
- Foto Bukti (opsional)

---

## 📜 Riwayat ([`app/riwayat/page.tsx`](../app/riwayat/page.tsx:1))

**Fitur**:
- Tabel riwayat dengan pagination
- Filter bulan/tahun (admin only)
- Edit data (modal)
- Hapus data
- Export PDF/Excel (admin only)
- Indikator data yang diarsipkan (locked)

**Pagination**:
- 5 item per page
- Navigation buttons prev/next
- Info: "Menampilkan X - Y dari Z data"

**Edit Modal**:
- Edit jumlah, tanggal, catatan
- Ganti/hapus foto
- Validasi input

---

## 💾 Backup ([`app/backup/page.tsx`](../app/backup/page.tsx:1))

**Fitur**:
- Buat backup baru (admin only)
- Restore dari backup (admin only)
- Hapus backup (admin only)
- Riwayat backup dengan timestamp
- Indikator status restore

**Auto-Backup**:
- Dibuat otomatis sebelum setiap perubahan data
- Diupdate jika sudah ada untuk hari yang sama
- Nama: `AutoBackup_YYYYMMDD`

---

## ⚙️ Settings ([`app/settings/page.tsx`](../app/settings/page.tsx:1))

**Fitur**:
- Konfigurasi nama aplikasi
- Konfigurasi nominal default
- Konfigurasi tema (light/dark)
- Info versi aplikasi

**Storage**:
- Disimpan di localStorage
- Auto-sync dengan theme toggle

---

## ✂️ Cut Off ([`app/cutoff/page.tsx`](../app/cutoff/page.tsx:1))

**Fitur**:
- Perform cut off bulanan (admin only)
- Hapus cut off (admin only)
- Riwayat cut off
- Password confirmation untuk hapus

**Proses Cut Off**:
1. Arsipkan semua jimpitan bulan ini (`is_archived = true`)
2. Update `total_pemasukan` di pengaturan
3. Insert ke `cutoff_history`
4. Refresh data

**Proses Hapus Cut Off**:
1. Hapus dari `cutoff_history`
2. Kurangi `total_pemasukan`
3. Unarchive jimpitan periode tersebut
4. Refresh data

---

## 🧩 Components

### Layout Components

#### [`Sidebar.tsx`](../components/layout/Sidebar.tsx:1)
- Menu navigasi dengan icon
- Filter menu berdasarkan role (admin/user)
- Responsive: collapsible pada mobile
- Active state untuk page saat ini

#### [`Header.tsx`](../components/layout/Header.tsx:1)
- Title halaman
- Toggle sidebar (mobile)
- Toggle theme (dark/light)
- User info dan logout button

### Dashboard Components

#### [`StatCard.tsx`](../components/dashboard/StatCard.tsx:1)
- Card untuk menampilkan statistik
- Format Rupiah
- Icon dengan gradient background
- Hover effect

#### [`WeeklyChart.tsx`](../components/dashboard/WeeklyChart.tsx:1)
- Grafik line chart mingguan
- Menggunakan Recharts
- Tooltip dengan format Rupiah
- Responsive

#### [`DailyBarChart.tsx`](../components/dashboard/DailyBarChart.tsx:1)
- Grafik bar chart harian
- 7 hari (Senin - Minggu)
- Warna berbeda untuk setiap hari
- Tooltip dengan format Rupiah

### UI Components

#### [`Button.tsx`](../components/ui/Button.tsx:1)
- Variants: primary, secondary, danger, ghost
- Sizes: sm, md, lg
- Gradient untuk primary
- Disabled state

#### [`Input.tsx`](../components/ui/Input.tsx:1)
- Label dan error message
- Dark mode support
- Focus ring effect

#### [`Modal.tsx`](../components/ui/Modal.tsx:1)
- Backdrop dengan blur
- Escape key close
- Header dengan close button
- Responsive

#### [`Select.tsx`](../components/ui/Select.tsx:1)
- Dropdown select
- Label dan error message
- Dark mode support

#### [`PhotoUpload.tsx`](../components/ui/PhotoUpload.tsx:1)
- Drag & drop upload
- Preview gambar
- Validasi: max 5MB, allowed types
- Remove photo button

#### [`PhotoThumbnail.tsx`](../components/ui/PhotoThumbnail.tsx:1)
- Thumbnail dengan size variants
- Placeholder jika tidak ada foto
- Click to open full size

---

## 🎣 Custom Hooks

### [`useTheme.ts`](../hooks/useTheme.ts:1)
- State: `darkMode`
- Check localStorage dan system preference
- Toggle theme dengan persist ke localStorage
- Update document class

### [`useJimpitan.ts`](../hooks/useJimpitan.ts:1)
**State**:
- `data` - Array jimpitan
- `loading` - Status loading
- `error` - Error message

**Methods**:
- `fetchJimpitan(includeArchived)` - Fetch data dari database
- `addJimpitan(input)` - Tambah jimpitan baru dengan auto-backup
- `deleteJimpitan(id)` - Hapus jimpitan
- `updateJimpitan(id, input)` - Edit jimpitan
- `getFilteredData(month, year)` - Filter data
- `getTotalByPeriod(month, year)` - Hitung total periode
- `getTotalToday()` - Hitung total hari ini
- `getTotalThisWeek()` - Hitung total minggu ini
- `getWeeklyData(month, year)` - Data untuk grafik mingguan
- `getDailyTotalByDayOfWeek(month, year)` - Data untuk grafik harian

**Fitur**:
- Auto-backup sebelum tambah data
- Upload/hapus foto dari storage
- Recalculate week info jika tanggal berubah
- Prevent edit/delete pada archived data

### [`useBackup.ts`](../hooks/useBackup.ts:1)
**State**:
- `data` - Array backup history
- `loading` - Status loading
- `error` - Error message

**Methods**:
- `fetchBackups()` - Fetch riwayat backup
- `createBackup()` - Buat backup manual
- `createAutoBackup()` - Buat/update auto-backup harian
- `restoreBackup(id)` - Restore dari backup
- `deleteBackup(id)` - Hapus backup

**Auto-Backup**:
- Nama: `AutoBackup_YYYYMMDD`
- Update jika sudah ada untuk hari yang sama
- Dipanggil otomatis sebelum perubahan data

### [`useCutoff.ts`](../hooks/useCutoff.ts:1)
**State**:
- `cutoffHistory` - Array riwayat cut off
- `totalPemasukan` - Total pemasukan bulan sebelumnya
- `loading` - Status loading
- `error` - Error message

**Methods**:
- `fetchCutoffHistory()` - Fetch riwayat cut off
- `fetchTotalPemasukan()` - Fetch total dari pengaturan
- `performCutoff(month, year, amount)` - Lakukan cut off
- `deleteCutoff(id, amount, periodMonth, periodYear)` - Hapus cut off

### [`useAppSettings.ts`](../hooks/useAppSettings.ts:1)
**State**:
- `appName` - Nama aplikasi
- `nominalDefault` - Nominal default
- `theme` - Tema (light/dark)
- `isLoaded` - Status load dari localStorage

**Methods**:
- `saveSettings(settings)` - Simpan ke localStorage
- `setAppName()`, `setNominalDefault()`, `setTheme()` - Setters

---

## 🛠️ Utility Functions

### [`lib/constants.ts`](../lib/constants.ts:1)
- `MENU_ITEMS` - Konfigurasi menu navigasi
- `MONTHS` - Array nama bulan Indonesia
- `ITEMS_PER_PAGE` - Konstanta pagination (5)
- `DEFAULT_SETTINGS` - Default settings aplikasi

### [`lib/utils/format.ts`](../lib/utils/format.ts:1)
**Functions**:
- `formatRupiah(number)` - Format ke Rupiah
- `formatDate(dateString)` - Format tanggal panjang
- `formatShortDate(dateString)` - Format tanggal pendek
- `formatDateTime(dateString)` - Format tanggal dan waktu
- `getWeekInfo(date)` - Hitung info minggu (week number, month, year)
- `getCalendarWeeksForMonth(month, year)` - Get semua minggu untuk bulan
- `getMonthAndYear(date)` - Get month/year berdasarkan week's Monday

**Week Calculation**:
- System: Monday-Sunday
- Week belongs to month where Monday falls
- Handle partial weeks dari bulan sebelumnya

### [`lib/utils/validation.ts`](../lib/utils/validation.ts:1)
**Functions**:
- `validateJimpitanInput(data)` - Validasi input jimpitan
  - Amount: tidak boleh negatif
  - Collection date: wajib, tidak boleh masa depan
  - Photo: max 5MB, allowed types
  - Notes: wajib diisi
- `validateSettingsInput(data)` - Validasi settings
  - App name: tidak boleh kosong, max 100 karakter
  - Nominal default: tidak boleh negatif
  - Theme: harus 'light' atau 'dark'

### [`lib/utils/export.ts`](../lib/utils/export.ts:1)
**Functions**:
- `exportToPDF(data, month, year, appName)` - Export data ke PDF
- `exportToExcel(data, month, year)` - Export data ke Excel
- `exportWeeklySummaryToPDF(weeklyData, month, year, appName)` - Export ringkasan mingguan ke PDF
- `exportWeeklySummaryToExcel(weeklyData, month, year)` - Export ringkasan mingguan ke Excel

**Features**:
- Table dengan header dan footer (total)
- Styling custom
- Filename dengan format: `jimpitan-MM-YYYY.pdf/xlsx`

---

## 🔌 Supabase Integration

### [`lib/supabase/client.ts`](../lib/supabase/client.ts:1)
- Inisialisasi Supabase client
- Load credentials dari environment variables
- Debug logging untuk troubleshooting

### [`lib/supabase/storage.ts`](../lib/supabase/storage.ts:1)
**Functions**:
- `uploadJimpitanPhoto(file, jimpitanId)` - Upload foto ke storage
  - Validasi type dan size
  - Generate unique filename
  - Return public URL
- `deleteJimpitanPhoto(photoUrl)` - Hapus foto dari storage
- `compressImage(file, maxWidth, quality)` - Kompresi gambar (opsional)

**Bucket**: `jimpitan-photos`

### [`lib/supabase/types.ts`](../lib/supabase/types.ts:1)
**Interfaces**:
- `Jimpitan` - Data jimpitan
- `CutoffHistory` - Data cut off
- `BackupHistory` - Data backup
- `Pengaturan` - Data pengaturan
- `CreateJimpitanInput` - Input untuk create
- `UpdateJimpitanInput` - Input untuk update
- `CreateBackupInput` - Input untuk create backup
- `UpdateBackupInput` - Input untuk update backup
- `UpdatePengaturanInput` - Input untuk update pengaturan
- `UserRole` - 'admin' | 'user'
- `UserRoleAssignment` - Data role assignment

---

## 🔒 Row Level Security (RLS)

Semua tabel memiliki RLS diaktifkan ([`003_rls_policies.sql`](../supabase/migrations/003_rls_policies.sql:1)):

**Policies**:
- `jimpitan`: All authenticated users can read/insert/update/delete
- `backup_history`: All authenticated users can read/insert/update/delete
- `pengaturan`: All authenticated users can read/insert/update/delete
- `user_roles`: Users can read own role, service role can manage
- `cutoff_history`: Authenticated users can read/insert

**Storage Policies**:
- Development mode: Public access ([`009_dev_mode_public_access.sql`](../supabase/migrations/009_dev_mode_public_access.sql))
- Production mode: Authenticated access ([`010_prod_mode_authenticated_access.sql`](../supabase/migrations/010_prod_mode_authenticated_access.sql))

---

## 🎨 Styling & UX

**Dark Mode**:
- Class-based implementation
- Persist di localStorage
- Toggle di header
- Auto-detect system preference

**Responsive Design**:
- Mobile-first approach
- Collapsible sidebar
- Grid yang menyesuaikan ukuran layar
- Touch-friendly buttons

**Color Scheme**:
- Primary: Blue (#3b82f6)
- Success: Green
- Danger: Red
- Warning: Amber
- Gradient backgrounds untuk cards

---

## 📝 Catatan Penting

1. **Timezone**: Semua tanggal menggunakan UTC untuk konsistensi
2. **Mata Uang**: Disimpan sebagai integer (Rupiah, tanpa desimal)
3. **Week System**: Monday-Sunday, week belongs to month where Monday falls
4. **Auto-Backup**: Dibuat sebelum setiap perubahan data
5. **Archived Data**: Data yang di-cutoff tidak dapat diedit/dihapus oleh user biasa
6. **Admin Role**: Hanya admin yang bisa akses fitur backup, cut off, dan settings
7. **Photo Upload**: Max 5MB, types: JPEG, PNG, WebP
8. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` - URL Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key Supabase
   - `NEXT_PUBLIC_ENABLE_AUTH` - Enable/disable auth (development)

---

## 🔄 Alur Data

1. **Tambah Jimpitan**:
   - User input data → Validasi → Auto-backup → Upload foto (jika ada) → Insert ke database → Refresh UI

2. **Edit Jimpitan**:
   - User edit data → Validasi → Upload/hapus foto (jika berubah) → Update database → Refresh UI

3. **Hapus Jimpitan**:
   - User konfirmasi → Hapus dari database → Hapus foto dari storage → Refresh UI

4. **Backup**:
   - Admin klik backup → Fetch semua data → Insert ke backup_history → Refresh list

5. **Restore**:
   - Admin pilih backup → Hapus semua data jimpitan → Insert data dari backup → Update restored_at → Refresh UI

6. **Cut Off**:
   - Admin pilih periode → Archive jimpitan → Update total_pemasukan → Insert ke cutoff_history → Refresh UI

---

## 🚀 Deployment

- **Platform**: Vercel (dikonfigurasi di [`vercel.json`](../vercel.json:1))
- **Environment**: Support dev, staging, dan production
- **Database**: Supabase PostgreSQL
- **Storage**: Supabase Storage (bucket: jimpitan-photos)

---

## 📚 Dokumentasi

Folder [`docs/`](../docs/) berbagai panduan:
- `PROJECT_STRUCTURE.md` - Struktur proyek
- `AUTHENTICATION_IMPLEMENTATION.md` - Implementasi auth
- `ADMIN_USER_SETUP_GUIDE.md` - Setup admin user
- `PRODUCTION_STORAGE_FIX_GUIDE.md` - Fix storage production
- Dan lainnya...

---

## 🎯 Kesimpulan

JimpitanKu adalah aplikasi web lengkap untuk pencatatan iuran jimpitan dengan fitur:
- ✅ Autentikasi pengguna dengan role-based access
- ✅ CRUD data jimpitan dengan validasi
- ✅ Upload foto bukti ke storage
- ✅ Dashboard dengan grafik dan statistik
- ✅ Riwayat dengan pagination dan export
- ✅ Backup/restore data
- ✅ Cut off bulanan dengan arsip
- ✅ Dark mode dan responsive design
- ✅ Auto-backup sebelum perubahan data
- ✅ Row Level Security untuk keamanan

Aplikasi ini menggunakan teknologi modern (Next.js 14, TypeScript, Tailwind CSS, Supabase) dengan arsitektur yang bersih dan maintainable.
