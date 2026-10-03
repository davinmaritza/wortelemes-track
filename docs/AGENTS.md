# AI Agents & Developer Collaboration Guidelines
## Project: Wortelemes-Track

---

## 1. Role & Identity
File ini ditujukan untuk setiap AI coding assistant (Antigravity, Claude Code, Cursor, Copilot) yang bekerja pada repositori ini. Tugas utamanya adalah mengembangkan fitur tracking koleksi diecast bergaya aplikasi Hot Wheels Showcase™ dengan fidelitas UI tinggi, arsitektur bersih, dan keamanan data privat.

---

## 2. Core Directives & Code Conventions

### 2.1. Strict Anti-Slop UI Standard
- Terapkan visual DNA Hot Wheels Showcase:
  - Deep dark theme palette: Background canvas `#090a0d`, Card surface `#13141a`, Card border `#1f222e`.
  - Accent colors: Hot Wheels Electric Blue `#0070f3` / `#1a73e8`, Collector Red badge `#e50914`, Metallic Gold `#f5a623`.
  - Typefaces: Gunakan sans-serif punchy bold untuk judul (*Plus Jakarta Sans* / *Outfit*) dan mono untuk kode seri / index.
- Hindari desain template generic (dilarang background ungu gradien klise, dilarang 3-box symmetry kaku).
- Setiap card diecast harus memiliki touch-feedback, subtle border glow, dan badge segment (contoh: `1/6`, `RLC`, `2026`).

### 2.2. Data Privacy & Zero Financial Leakage
- **FATAL ERROR**: Menampilkan `buy_price` (modal beli) atau kalkulasi keuntungan ke endpoint atau tampilan publik.
- Selalu pastikan server components / API handlers membedakan data publik vs data pemilik (admin).

### 2.3. Surgical Edits & Zero Truncation
- Jangan pernah menulis placeholder seperti `// TODO: implement later` atau `/* rest of code */`.
- Selalu tulis implementasi utuh dan fungsional.

---

## 3. Tech Stack Quick Reference
- Framework: Next.js 15 (App Router, Server Actions)
- Database: Supabase PostgreSQL
- Storage: Supabase Storage (`diecast-images`)
- Styles: Tailwind CSS
- Icons: `lucide-react`
