# Product Requirements Document (PRD)
## Project: Wortelemes-Track (Diecast Collection Tracker & Showcase)

---

## 1. Executive Summary
**Wortelemes-Track** adalah aplikasi web diecast collection tracker & showcase bergaya Hot Wheels Showcase App (Dark mode, tactile diecast cards, collection progress). Aplikasi dirancang secara **semi-private** (1 admin/kolektor pengelola & publik sebagai penonton/calon pembeli) yang memadukan:
1. **Public Showcase**: Katalog publik dengan nuansa Hot Wheels Garage, filter series & segment, status "For Sale" / "Not For Sale", estimasi harga jual, dan direct WhatsApp order button.
2. **Private Admin Garage**: Manajemen koleksi dengan Master Passcode PIN, kalkulasi finansial manual (Harga Beli/Modal, Estimasi Harga Jual, Margin/Profit), kuantitas stok, serta integrasi pencarian cerdas Hot Wheels Fandom Wiki untuk auto-fill data casting.

---

## 2. Product Objectives & User Personas
### A. Personas
1. **Collector / Owner (Admin - 1 User)**:
   - Ingin mendigitalkan garasi koleksi diecast miliknya.
   - Mengontrol pencatatan modal beli, target jual, kuantitas stok, dan status koleksi.
   - Menginginkan kemudahan input: ketik nama model -> auto-fill info dari Hot Wheels Wiki.
2. **Visitor / Potential Buyer (Public)**:
   - Melihat-lihat koleksi mobil diecast sang kolektor.
   - Mencari mobil berdasarkan series (Mainline, RLC, Boulevard, Car Culture, dll) atau tahun rilis.
   - Mengetahui mobil mana yang dijual (*For Sale*) beserta harga jualnya, lalu klik tombol untuk langsung chat WhatsApp ke pemilik.

---

## 3. Reference & UI Inspiration
Berdasarkan referensi aplikasi resmi **Hot Wheels Showcase™** & **CollectHW**:
- **Design DNA**: Dark sleek aesthetic (`#0c0d10`, `#16181f`), aksen Hot Wheels Blue & Flame Red, card diecast ber-badge (Tahun, Series badge: RLC / Silver Series / Pantone, dll).
- **Tab Navigasi Utama**:
  - `Vehicles` (Semua koleksi mobil individual)
  - `Series` (Koleksi per set/seri dengan progress bar kelengkapan set, misal: *3/6 Sunset Race*)
  - `Lists / Wishlist` (Daftar khusus atau incaran)
- **Top Bar**: "MY GARAGE", Progress counter (misal: *181 / 250 Vehicles*), search bar responsif.
- **Card Element (Persis Hot Wheels Showcase™ App)**:
  - **Gambar**: High-res thumbnail mobil transparan / foto fisik asli diecast
  - **Nama**: Model casting name tebal kapital (e.g. *ERIKENSTEIN ROD*, *1991 BMW M3*, *NISSAN FAIRLADY Z*)
  - **Series**: Tag badge series & index set (e.g. `2026`, `Silver Series`, `RLC`, `Index 1/6`)
  - **Harga Pasaran**: Estimasi market value / harga jual (terbuka untuk publik / calon pembeli)
  - **Harga Beli (HIDE)**: Modal pembelian yang **disembunyikan secara ketat** dari publik, hanya tampil di mode admin
  - **Action Bar**: Interaksi counter stok (+ / -), bookmark favorite, dan tombol WhatsApp inquiry

---

## 4. Key Functional Requirements

### 4.1. Hybrid Data Ingestion (Hot Wheels Wiki API)
- Autocomplete search box yang menembak endpoint `hotwheels.fandom.com/api.php?action=opensearch`.
- Fetch detail casting & official high-res image via `action=query&prop=pageimages|info`.
- Fleksibilitas manual: User bisa mengubah nama, mengupload foto fisik sendiri ke Supabase Storage, atau mengganti warna/kondisi.

### 4.2. Financial & Valuation Tracking (Admin Only)
- Field Finansial:
  - `buy_price` (Modal pembelian - Tersembunyi dari publik)
  - `sell_price` (Estimasi harga pasar / harga jual yang ditampilkan ke publik jika for sale)
  - `qty` (Jumlah kepemilikan unit)
- Metrik Dashboard Admin:
  - Total Unit Koleksi
  - Total Modal (Rp)
  - Total Estimasi Valuasi Portofolio (Rp)
  - Estimasi Unrealized / Potential Profit (Rp & %)

### 4.3. Privacy & Access Control
- **Public View**:
  - Akses baca (Read-only) tanpa login.
  - Modal/Harga beli **100% hidden** di server response (tidak bocor via API/JSON).
  - Tombol aksi admin tersembunyi.
- **Admin View**:
  - Akses login cepat via **Master Secret PIN**.
  - Akses CRUD penuh: Tambah mobil, edit data, upload foto fisik, toggle status For Sale / NFS, hapus koleksi.

### 4.4. Social & Commerce Flow
- Tombol CTA *"Tanya / Beli via WhatsApp"* pada item yang berstatus *For Sale*.
- Auto-generate template pesan WhatsApp berformat rapi dengan detail nama diecast dan link halaman showcase.

---

## 5. Non-Functional Requirements
- **Performance**: Caching request Wiki API di server-side Next.js untuk mencegah rate limiting.
- **Mobile-First Experience**: Responsif sempurna di layar smartphone layaknya native mobile app (PWA ready).
- **Security**: Master passcode divalidasi via secure HTTP-only cookie JWT, RLS di database PostgreSQL.
