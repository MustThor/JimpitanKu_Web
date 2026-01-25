# Jimpitan RT/RW - Sistem Pencatatan Jimpitan Komunitas

Aplikasi web modern untuk mencatat dan mengelola iuran jimpitan komunitas RT/RW.

## 🚀 Fitur

- **Dashboard**: Statistik pemasukan, grafik mingguan, dan entri terbaru
- **Input Jimpitan**: Form untuk menambahkan data jimpitan baru
- **Riwayat**: Tabel riwayat dengan filter bulan/tahun dan pagination
- **Backup**: Buat dan restore backup data
- **Settings**: Konfigurasi nama aplikasi, nominal default, dan tema

## 🛠️ Teknologi

- **Frontend**: Next.js 14 dengan TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React
- **Charts**: Recharts

## 📦 Instalasi

### Prasyarat

- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis di [supabase.com](https://supabase.com))

### Langkah-langkah

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd jimpitan-rt-rw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   
   Copy file `.env.local.example` ke `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` dan masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Setup database Supabase**
   
   Jalankan migrasi SQL di dashboard Supabase:
   
   - Buka file `supabase/migrations/001_initial_schema.sql`
   - Copy dan jalankan di SQL Editor Supabase
   - Ulangi untuk `002_seed_data.sql` dan `003_rls_policies.sql`

5. **Jalankan aplikasi**
   ```bash
   npm run dev
   ```

6. **Buka browser**
   
   Akses aplikasi di [http://localhost:3000](http://localhost:3000)

## 📁 Struktur Proyek

```
jimpitan-rt-rw/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard page
│   ├── input/              # Input jimpitan page
│   ├── riwayat/           # History page
│   ├── backup/             # Backup management page
│   └── settings/           # Settings page
├── components/             # Reusable components
│   ├── layout/             # Sidebar & Header
│   ├── dashboard/           # Dashboard components
│   └── ui/                 # UI components (Button, Input, Select)
├── hooks/                  # Custom React hooks
│   ├── useTheme.ts          # Dark mode hook
│   ├── useJimpitan.ts       # Jimpitan data hook
│   └── useBackup.ts         # Backup data hook
├── lib/                    # Utility functions & config
│   ├── supabase/           # Supabase client & types
│   └── utils/              # Format & validation utilities
├── supabase/              # Database migrations
│   └── migrations/         # SQL migration files
└── public/                 # Static assets
```

## 🎨 Skema Database

### Tabel `jimpitan`
Menyimpan data pencatatan jimpitan.

| Kolom | Tipe | Deskripsi |
|--------|-------|-----------|
| id | uuid | Primary key |
| amount | integer | Nominal dalam Rupiah |
| collection_date | date | Tanggal pencatatan |
| week_number | integer | Nomor minggu |
| month | integer | Bulan (1-12) |
| year | integer | Tahun |
| notes | text | Catatan tambahan |
| created_at | timestamptz | Waktu input |

### Tabel `backup_history`
Menyimpan riwayat backup.

| Kolom | Tipe | Deskripsi |
|--------|-------|-----------|
| id | uuid | Primary key |
| backup_name | varchar | Nama file backup |
| created_at | timestamptz | Waktu dibuat |
| restored_at | timestamptz | Waktu di-restore |

### Tabel `pengaturan`
Menyimpan konfigurasi aplikasi.

| Kolom | Tipe | Deskripsi |
|--------|-------|-----------|
| id | uuid | Primary key |
| key | varchar | Kunci pengaturan (unique) |
| value | text | Nilai pengaturan |
| updated_at | timestamptz | Waktu update terakhir |

## 🌙 Dark Mode

Aplikasi mendukung dark mode yang dapat di-toggle dari header. Preferensi tema disimpan di localStorage.

## 📱 Responsive Design

Aplikasi sepenuhnya responsive dengan:
- Sidebar yang dapat di-collapse pada mobile
- Grid yang menyesuaikan dengan ukuran layar
- Layout yang optimal untuk desktop dan mobile

## 🔒 Keamanan

- Row Level Security (RLS) diaktifkan pada semua tabel
- Validasi input di sisi klien dan server
- SQL injection protection via parameterized queries (Supabase)

## 📝 Catatan

- Semua nilai uang disimpan sebagai integer (Rupiah, tanpa desimal)
- Tanggal menggunakan timezone UTC untuk konsistensi
- Data yang dihapus akan terhapus permanen (CASCADE)

## 🤝 Kontribusi

Kontribusi, issue, dan pull request sangat diapresiasi!

## 📄 Lisensi

MIT License - lihat file LICENSE untuk detail
