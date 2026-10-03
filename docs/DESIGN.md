# Design System & UI Specification
## Project: Wortelemes-Track (Hot Wheels Diecast Collection Tracker)

---

## 1. Visual DNA & Design Philosophy
Desain mengacu langsung pada antarmuka aplikasi **Hot Wheels Showcase™**. 
Konsep visual:
- Tampilan gelap pekat (OLED Dark Mode) yang menonjolkan warna diecast.
- Bentuk rounded pills, badge kontras tinggi, dan kartu diecast dua kolom yang padat informasi namun tetap bersih.
- Tipografi tegas bergaya otomotif/diecast.
- Mengikuti prinsip **No AI Slop**: tidak ada gradien ungu generik, tidak ada border neon cyan berlebihan, tidak ada layout 3 boks simetris, dan menggunakan copy fungsional yang lugas.

---

## 2. Color Palette & Tokens

### Backgrounds & Surfaces
- Canvas Background: `#0c0d10` (Hitam OLED)
- Card Surface: `#16181f` (Abu-abu gelap pekat)
- Card Inner / Image Container: `#ffffff` (Putih bersih untuk memunculkan siluet mobil) atau `#121318` (untuk foto diecast dengan background dramatis)
- Border Stroke: `#242735` (Garis pembatas tipis ber-opacity rendah)
- Input & Pill Inactive: `#1f222e`

### Accents & Badges
- Primary Blue (Tabs & Index Bulat): `#0066d6`
- RLC Red (Badge Red Line Club): `#e50914` (Background: `rgba(229, 9, 20, 0.15)`, Border: `rgba(229, 9, 20, 0.4)`)
- Silver Series / Pantone Badge: `#2c303e` dengan teks `#e2e8f0`
- Star / Favorite Gold: `#f5a623`
- Text Primary: `#ffffff`
- Text Secondary: `#8e95a5`
- Text Muted: `#5c6375`

---

## 3. Typography Hierarchy
- **Header "MY GARAGE"**: Sans-serif geometric bold (uppercase), tracking tight.
- **Model Name**: Bold uppercase, ukuran 13-14px, line-clamp 1 baris.
- **Badges & Tags**: 10-11px semibold, penomoran tabular monospaced untuk index (`1/6`, `2/6`).
- **Harga Pasaran**: 12-13px semibold dengan format mata uang rupiah yang jelas (misal: `Rp 150.000`).

---

## 4. Component Anatomy

### 4.1. Navigation Header & Segmented Control
- Logo Flame Hot Wheels di tengah atas.
- Judul `MY GARAGE` di sebelah kiri.
- Pill Tabs:
  - `Vehicles` (aktif: background `#0066d6`, teks putih)
  - `Series` (tidak aktif: background transparan / `#1f222e`, teks abu-abu)
  - `Lists` (tidak aktif)
- Filter dropdown baris kedua: `Date Added: New-Old`, `Segment`, `Assortment`.
- Search Bar: Icon kaca pembesar, background `#16181f`, rounded-xl, placeholder `Search by vehicles, SKU, and more`.
- Counter status: `181 / 250 Vehicles` di kiri, tombol aksi di kanan.

### 4.2. Diecast Card (Mobile 2-Column Grid)
- Outer container: `rounded-2xl`, background `#16181f`, border `1px solid #242735`.
- Image Box: Aspect ratio 4:3, `rounded-xl`, gambar diecast terpusat (*contain*).
- Info Area:
  - Baris 1: Model name (contoh: `ERIKENSTEIN ROD`, `1991 BMW M3`).
  - Baris 2: Badge deret horizontal:
    - Badge lingkaran biru berisi nomor index (`1`)
    - Badge tahun (`2026`)
    - Badge seri / tier (`RLC` warna merah, `Hot Wheels XL`, dll)
    - Badge warna bodi (`Dark Red`, `Vibrant Blue`)
  - Baris 3: Label harga pasaran (terbuka untuk publik).
  - Baris 4 (Admin mode only): Harga modal pembelian asli (tersembunyi dari publik).
- Action Footer:
  - Tombol Qty (`-` dan `+`)
  - Tombol Bintang Favorit (`★`)
  - Tombol Menu / Direct WhatsApp Order

### 4.3. Series View & Progress Tracker
- Header Seri: `SUNSET RACE (2026)` dengan badge `SILVER SERIES` dan `PANTONE`.
- Progress Bar: Garis horizontal warna biru (`#0066d6`) dengan background track gelap, disertai angka kelengkapan (contoh: `3/6`).
- Grid kartu mobil yang terdaftar di bawah seri tersebut.

---

## 5. Micro-Interactions & UX States
- **Tap Feedback**: Efek scale halus (`active:scale-95`) saat menekan kartu atau tombol.
- **Empty States**: Ilustrasi siluet blister kosong dengan teks bantuan singkat jika hasil pencarian tidak ditemukan.
- **Loading Skeleton**: Skeleton loading berwarna gelap (`#1a1d26` dengan animasi shimmer halus).
