# Specification & Architecture Document: Diecast Tracker & Showcase (Wortelemes-Track)

## 1. Project Overview & Objective
Web application tracking & showcase koleksi diecast (Hot Wheels & cars diecast lainnya). Berfungsi ganda sebagai:
1. **Public Showcase & Catalog**: Pengunjung umum dapat melihat koleksi diecast, mencari/filter model, melihat status ketersediaan (*For Sale* vs *Not For Sale / NFS*), dan estimasi harga jual/pasar dengan tombol CTA WhatsApp Direct Checkout/Inquiry.
2. **Private Admin Portfolio & Financial Management**: Pemilik koleksi (admin) dapat login secara praktis via **Master Passcode / Secret PIN** untuk mengelola inventori (tambah, edit, hapus, upload foto fisik), melihat metrik finansial privat (Total modal pembelian, total valuasi saat ini, potensi margin keuntungan/profit), serta memanfaatkan fitur pencarian autocomplete & auto-fill data dari **Hot Wheels Fandom MediaWiki API**.

---

## 2. Tech Stack & Environment
- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Styling & UI**: Tailwind CSS (Mobile-first responsive PWA, Lucide Icons / Phosphor icons, micro-animations)
- **Database & Storage**: Supabase (PostgreSQL) + Supabase Storage Bucket untuk upload foto fisik diecast
- **MediaWiki Integration**: Hot Wheels Fandom API (`action=opensearch` & `action=query`) via Next.js Route Handler / Server Actions (anti-CORS, cached)
- **Auth Strategy**: Session-based / encrypted cookie JWT yang divalidasi dengan Master Admin Passcode (env: `ADMIN_PASSCODE` / `ADMIN_SECRET`)

---

## 3. Core Features & User Stories

### A. Public Showcase (Visitor View)
- **Diecast Gallery Grid/List**: Tampilan visual kartu koleksi yang responsif (Mobile & Desktop).
- **Search & Filter**: Cari berdasarkan nama casting, seri (Mainline, Premium, Boulevard, STH/TH, Car Culture, dll), tahun rilis, dan status (*All*, *For Sale*, *Not For Sale*).
- **Diecast Detail Card**:
  - Foto utama (foto fisik asli yang diupload atau thumbnail dari Hot Wheels Wiki)
  - Nama model casting & seri/tahun
  - Kondisi diecast (Carded / Loose / Mint / Blister Kerut / dll)
  - Status ketersediaan (*For Sale* vs *NFS*)
  - **Estimasi Harga Jual**: Ditampilkan transparan kepada calon pembeli (Harga Beli/Modal **disembunyikan** dari publik)
  - **Direct WhatsApp Order**: Tombol "Hubungi via WhatsApp" yang langsung generate pesan otomatis: *"Halo, saya tertarik dengan koleksi Hot Wheels [Nama Model] seri [Tahun/Series]..."*

### B. Admin Dashboard (Owner View - Authenticated)
- **Quick PIN / Passcode Login**: Modal/halaman login tanpa perlu repot verifikasi email.
- **Financial & Portfolio Analytics**:
  - Total Koleksi (jumlah unit fisik)
  - Total Modal (Akumulasi Harga Beli)
  - Total Valuasi Pasar (Akumulasi Estimasi Harga Jual)
  - Potensi Margin/Profit (`Valuasi - Modal`) dan Margin Percentage (`%`)
- **Smart Diecast Entry (Hybrid Wiki Auto-fill)**:
  - Input nama mobil -> Live suggestion dari Hot Wheels Wiki
  - Sekali klik suggestion, auto-fill: Nama Casting, Gambar Thumbnail Wiki, Link Referensi Wiki, Estimasi Tahun
  - Kolom input kustom: Harga Beli (Rp), Estimasi Harga Jual (Rp), Jumlah Stok (Qty), Kondisi, Catatan/Notes, Status For Sale/NFS
  - Upload Foto Fisik Asli (tersimpan di Supabase Storage / fallback URL)
- **Inventory CRUD**: Edit data, update harga pasar, ubah status jual, hapus item.

---

## 4. Database Schema (PostgreSQL / Supabase)

Table: `collections`
- `id`: UUID (Primary Key, default: `gen_random_uuid()`)
- `name`: VARCHAR(255) NOT NULL (e.g., "Nissan Skyline GT-R (BNR34)")
- `series`: VARCHAR(150) (e.g., "Fast & Furious", "Mainline", "Boulevard")
- `release_year`: INT
- `scale`: VARCHAR(20) DEFAULT '1:64'
- `condition`: VARCHAR(50) DEFAULT 'Carded / Mint' (e.g., Mint, Blister Soft Corner, Loose)
- `buy_price`: NUMERIC(12, 2) DEFAULT 0 (Hanya untuk Admin)
- `sell_price`: NUMERIC(12, 2) DEFAULT 0 (Terbuka untuk Publik jika For Sale)
- `qty`: INT DEFAULT 1
- `is_for_sale`: BOOLEAN DEFAULT false
- `image_url`: TEXT (URL foto fisik asli atau thumbnail wiki)
- `wiki_url`: TEXT (Link rujukan wiki jika ada)
- `notes`: TEXT
- `created_at`: TIMESTAMPTZ DEFAULT now()
- `updated_at`: TIMESTAMPTZ DEFAULT now()

---

## 5. Implementation Roadmap
1. **Setup Project**: Next.js 15, Tailwind CSS, Lucide Icons, TypeScript config.
2. **Supabase Schema & Storage**: Migrasi table `collections`, bucket setup untuk foto fisik, RLS / API layer.
3. **Hot Wheels Wiki API Service**: Endpoint server-side untuk search autocomplete & auto-fetch infobox/images.
4. **Auth & Admin Protection**: Master PIN authentication flow dengan secure HTTP-only cookie.
5. **UI Public Showcase**: Mobile-first gallery, filter chips, search, WhatsApp CTA, responsive detail modal.
6. **UI Admin Dashboard**: Financial overview summary cards, form tambah/edit diecast dengan smart Wiki autocomplete & image uploader.
7. **Verification & Testing**: Verifikasi flow search wiki, CRUD, privasi harga non-login vs login, dan responsiveness.
