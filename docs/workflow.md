# Development & Deployment Workflow
## Project: Wortelemes-Track

---

## 1. Local Development Lifecycle

### 1.1. Prasyarat Lingkungan
- Node.js v18+ atau v20+ LTS
- PNPM atau NPM
- Akun Supabase (project URL & anon key / service key)

### 1.2. Setup Awal
1. Clone / buka direktori proyek:
   ```bash
   cd c:\Users\Administrator\Documents\Project\Commission\Wortelemes-Track
   ```
2. Salin environment variable:
   ```bash
   cp .env.example .env.local
   ```
3. Konfigurasi kredensial di `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ADMIN_MASTER_PIN=secret_pin_kolektor
   SESSION_SECRET=long_random_string_for_cookie_encryption
   NEXT_PUBLIC_WHATSAPP_NUMBER=6281234567890
   ```
4. Install dependensi dan jalankan server lokal:
   ```bash
   npm install
   npm run dev
   ```
5. Akses di browser: `http://localhost:3000`

---

## 2. Testing & Quality Gate Workflow

Sebelum commit atau deploy, jalankan verifikasi berikut:
1. **Type Checking**:
   ```bash
   npm run build
   ```
2. **Security & Financial Privacy Verification**:
   - Buka halaman showcase di incognito / non-login mode.
   - Buka DevTools Network tab, periksa payload API `/api/collections`.
   - Pastikan **TIDAK ADA** properti `buy_price` atau kalkulasi modal di dalam JSON response.
3. **Wiki API Integration Check**:
   - Buka form tambah diecast di Admin mode.
   - Ketik nama mobil terkenal (e.g., `Skyline`, `Supra`, `Mustang`).
   - Pastikan thumbnail dan nama casting berhasil ditarik dan terisi ke form.
4. **Mobile Responsive Check**:
   - Emulate layar smartphone (iPhone / Android di Chrome DevTools).
   - Pastikan card diecast, navigation tab, dan bottom CTA WhatsApp berfungsi mulus tanpa overflow horizontal.

---

## 3. Git & Deployment Strategy
- **Branching**: `main` untuk release produksi, feature branch untuk pengerjaan modul.
- **Commit Convention**: Mengikuti standard Conventional Commits:
  - `feat: add wiki search autocomplete`
  - `fix: hide buy_price from public payload`
  - `style: refine diecast card badges to match hw showcase`
- **Hosting Target**: Vercel atau VPS Linux dengan Node.js runtime.
