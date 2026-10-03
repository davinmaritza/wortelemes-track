# Project Roadmap & Task Breakdown (TODO)
## Project: Wortelemes-Track

---

## Phase 1: Environment & Foundation Setup
- [x] Inisialisasi Next.js 15 App Router dengan TypeScript & Tailwind CSS.
- [x] Konfigurasi Lucide React icons & font styling (*Plus Jakarta Sans* / font modern).
- [x] Setup Supabase client & environment configuration (`.env.local`).
- [x] Buat SQL migration script untuk tabel `series` dan `collections` di Supabase.

---

## Phase 2: MediaWiki Integration & Backend API
- [x] Buat API Route `/api/wiki/search` untuk proxy endpoint MediaWiki `opensearch`.
- [x] Buat API Route `/api/wiki/details` untuk mengambil metadata image thumbnail diecast.
- [x] Buat API Route / Server Action Autentikasi Admin via Master Secret PIN (`/api/auth/pin`).
- [x] Setup API endpoint / Server Action untuk mengambil koleksi publik (sanitasi modal/harga beli).

---

## Phase 3: Public Showcase & Garage UI
- [x] Bangun layout header "MY GARAGE" dengan tabs navigasi:
  - `Vehicles` (Katalog semua diecast)
  - `Series` (Koleksi dikelompokkan per set/seri dengan set progress bar)
  - `Lists` (Filter favorit & For Sale)
- [x] Bangun komponen `DiecastCard` sesuai desain referensi Hot Wheels Showcase™:
  - Image preview bersih
  - Name badge, year, series tag, segment index (`1/6`), dan color chip
  - Status tag (*For Sale* dengan nominal harga jual)
  - WhatsApp CTA Button (*"Beli Koleksi Ini"*) dengan pesan terformat otomatis.
- [x] Implementasikan search bar real-time, filter series, dan sort (Date Added, Year, Price).

---

## Phase 4: Admin Dashboard & Financial Portfolio
- [x] Buat halaman / modal login Master PIN admin yang aman.
- [x] Bangun Financial Overview Cards:
  - Total Unit Koleksi
  - Total Modal Pembelian (Hidden from public)
  - Total Valuasi Pasar
  - Potensi Margin Keuntungan (Rp & %)
- [x] Bangun Modal Form Tambah / Edit Koleksi:
  - Input nama mobil dengan Live Auto-complete Wiki suggestions.
  - One-click auto-fill data dari Hot Wheels Wiki.
  - Image uploader (upload foto fisik ke Supabase Storage atau gunakan gambar Wiki).
  - Input field modal beli, estimasi harga jual, jumlah stok (qty), kondisi, & toggle For Sale.
- [x] Fitur Quick Adjust: tombol edit cepat (+/- qty, star favorite, delete item, inline modal edit harga beli & harga jual).
- [x] Checkbox Select All & Bulk Action: hapus massal (bulk delete) & set massal status For Sale / NFS.

---

## Phase 5: Testing, Hardening & Polishing
- [x] Verifikasi zero-leakage: Pastikan non-admin sama sekali tidak menerima field modal/buy_price.
- [x] Testing responsivitas mobile (PWA viewport di iOS & Android browser) & desktop grid view.
- [x] Testing edge-case API Wiki jika mobil tidak ditemukan atau offline.
- [x] Final polishing visual (micro-animations, select all checkbox, live profit margin calculator, zero placeholder slop).
