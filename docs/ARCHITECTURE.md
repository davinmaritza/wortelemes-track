# Architecture & Technical Design Document
## Project: Wortelemes-Track

---

## 1. High-Level Architecture Diagram

```
+---------------------------------------------------------------+
|                      Client Browser                           |
|       (Public Showcase / Authenticated Admin Garage)          |
+------------------------------+--------------------------------+
                               | HTTPS
                               v
+---------------------------------------------------------------+
|                    Next.js 15 App Router                      |
|                                                               |
|  [Pages / UI]                                                 |
|  - / (My Garage: Vehicles, Series, Lists)                     |
|  - /series/[id] (Series detail & set completion progress)     |
|  - /admin (Passcode Login & Inventory Financial Manager)      |
|                                                               |
|  [Server Actions & Route Handlers]                            |
|  - /api/auth/pin        --> Validates PIN, sets secure cookie |
|  - /api/wiki/search     --> Proxy to Hot Wheels Fandom API    |
|  - /api/collections     --> Public sanitized feed (no buy_pr) |
|  - Server Actions       --> Admin CRUD, Uploads, Calculations |
+--------------+-------------------------------+----------------+
               |                               |
               v                               v
+-------------------------------+ +-----------------------------+
|    Supabase (PostgreSQL)      | | Hot Wheels Fandom MediaWiki |
| - Table: collections          | | - action=opensearch         |
| - Table: series               | | - action=query              |
| - Storage: diecast-images     | +-----------------------------+
+-------------------------------+
```

---

## 2. Technology Stack & Decision Matrix
| Component | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 15 (App Router, React 19) | Server components untuk data privacy (buy_price ditapis di server), SEO cepat, dan zero API leakage. |
| **Styling** | Tailwind CSS v4 / Lucide React | Membangun UI gelap presisi sesuai visual Hot Wheels Showcase™ (OLED dark, blue/red pill badges). |
| **Database** | PostgreSQL via Supabase | Relasi terstruktur antara diecast item dan series set, realtime sync, scalable. |
| **Media Storage** | Supabase Storage Bucket (`diecast-images`) | Menyimpan foto fisik upload koleksi asli dengan direct CDN URL. |
| **External API** | Hot Wheels Fandom MediaWiki API | Pencarian open-search dan query image thumbnail resmi tanpa perlu manual input dari nol. |
| **Authentication**| HTTP-only Session Cookie + Master PIN | Praktis untuk single-owner tanpa ribet OAuth email login. |

---

## 3. Database Schema Specification

### 3.1. Table: `series`
Menampung data set/seri untuk melacak "Complete Your Sets" layaknya di app resmi.
```sql
CREATE TABLE series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,            -- e.g., "Sunset Race (2026)", "Boulevard"
    year INT,                               -- e.g., 2026
    category VARCHAR(100),                  -- e.g., "Silver Series", "Premium", "Mainline"
    pantone_code VARCHAR(50),               -- e.g., "Pantone 151 C"
    total_in_set INT DEFAULT 0,             -- Jumlah target mobil dalam set (e.g., 6)
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.2. Table: `collections`
Menampung detail setiap item diecast.
```sql
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID REFERENCES series(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,            -- e.g., "Nissan Fairlady Z", "1991 BMW M3"
    casting_code VARCHAR(50),              -- e.g., "HRR43"
    release_year INT,                       -- e.g., 2026
    segment_number INT,                    -- Nomor di set, e.g., 1 (artinya 1/6)
    color VARCHAR(100),                    -- e.g., "Vibrant Blue", "Olive Green"
    scale VARCHAR(20) DEFAULT '1:64',
    condition VARCHAR(50) DEFAULT 'Mint',  -- Mint, Blister Soft Corner, Loose, Protector
    tier_badge VARCHAR(50),                -- e.g., "RLC", "STH", "TH", "Premium", "Silver Series"
    
    -- Financial Fields (ADMIN SENSITIVE)
    buy_price NUMERIC(12, 2) DEFAULT 0,    -- Harga Beli / Modal
    sell_price NUMERIC(12, 2) DEFAULT 0,   -- Estimasi Harga Jual / Pasar
    qty INT DEFAULT 1,                     -- Jumlah stok unit
    is_for_sale BOOLEAN DEFAULT false,     -- Apakah berstatus dijual
    
    -- Media & References
    image_url TEXT,                        -- Foto fisik atau thumbnail wiki
    wiki_url TEXT,                         -- Link artikel Hot Wheels Wiki
    notes TEXT,                            -- Catatan khusus
    is_favorite BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Security & Data Privacy Architecture
1. **Server-Side Sanitation:** Query database untuk non-admin visitor secara eksplisit meng-exclude field `buy_price` dan `notes` rahasia:
   ```ts
   // Public fetcher query:
   // SELECT id, series_id, name, release_year, segment_number, color, scale, condition, tier_badge, sell_price, qty, is_for_sale, image_url FROM collections...
   ```
2. **Master Passcode Protection:**
   - PIN rahasia didefinisikan di `.env` (`ADMIN_MASTER_PIN`).
   - Sesi terenkripsi disimpan dalam cookie `__session_admin` dengan flag `HttpOnly`, `SameSite=Strict`, `Secure`.

---

## 5. Third-Party Integration: Hot Wheels Fandom API
Alur Integrasi API:
1. `GET /api/wiki/search?q=Mustang`
   - Memanggil `https://hotwheels.fandom.com/api.php?action=opensearch&search=Mustang&limit=8&format=json`
2. `GET /api/wiki/details?title=Nissan_Skyline_GT-R_(BNR34)`
   - Memanggil `https://hotwheels.fandom.com/api.php?action=query&titles={title}&prop=pageimages|info&inprop=url&pithumbsize=600&format=json`
   - Mengekstrak thumbnail URL dan judul resmi untuk form auto-fill.
