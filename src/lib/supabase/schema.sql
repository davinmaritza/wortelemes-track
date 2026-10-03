# Hot Wheels Tracker - Database Setup Migration
# Jalankan script ini di Supabase SQL Editor

-- 1. Buat Tabel Series (untuk pengelompokan set/seri diecast)
CREATE TABLE IF NOT EXISTS public.series (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    year INT DEFAULT 2026,
    category VARCHAR(100) DEFAULT 'Mainline', -- Silver Series, Premium, RLC, Mainline
    pantone_code VARCHAR(50),
    total_in_set INT DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Buat Tabel Collections (untuk detail tiap diecast)
CREATE TABLE IF NOT EXISTS public.collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    series_id UUID REFERENCES public.series(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    casting_code VARCHAR(50),
    release_year INT DEFAULT 2026,
    segment_number INT DEFAULT 1, -- e.g. 1 (dari total 6)
    color VARCHAR(100) DEFAULT 'Standard',
    scale VARCHAR(20) DEFAULT '1:64',
    condition VARCHAR(50) DEFAULT 'Carded / Mint',
    tier_badge VARCHAR(50) DEFAULT 'Mainline', -- RLC, STH, TH, Silver Series, Premium
    
    -- Finansial (Modal dirahasiakan, harga jual untuk publik)
    buy_price NUMERIC(12, 2) DEFAULT 0,
    sell_price NUMERIC(12, 2) DEFAULT 0,
    qty INT DEFAULT 1,
    is_for_sale BOOLEAN DEFAULT false,
    
    -- Media & References
    image_url TEXT,
    wiki_url TEXT,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Dummy Seed Data untuk preview awal persis aplikasi
INSERT INTO public.series (id, name, year, category, pantone_code, total_in_set)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'Sunset Race', 2026, 'Silver Series', 'Pantone 151 C', 6),
  ('a2222222-2222-2222-2222-222222222222', 'Red Line Club Exclusive', 2026, 'RLC', NULL, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.collections (name, series_id, release_year, segment_number, color, condition, tier_badge, buy_price, sell_price, qty, is_for_sale, is_favorite, image_url)
VALUES 
  ('ERIKENSTEIN ROD', 'a1111111-1111-1111-1111-111111111111', 2026, 1, 'Light Blue', 'Carded / Mint', 'Hot Wheels XL', 45000, 75000, 1, true, false, 'https://static.wikia.nocookie.net/hotwheels/images/e/ea/Erikrod20.jpg/revision/latest?cb=20200115042220'),
  ('1991 BMW M3', 'a2222222-2222-2222-2222-222222222222', 2026, 1, 'Olive Green', 'Protector Mint', 'RLC', 450000, 850000, 1, true, true, 'https://static.wikia.nocookie.net/hotwheels/images/0/07/1991_BMW_M3_-_RLC_2022.jpg/revision/latest?cb=20220614185121'),
  ('NISSAN FAIRLADY Z', 'a1111111-1111-1111-1111-111111111111', 2026, 1, 'Vibrant Blue', 'Carded / Mint', 'Silver Series', 65000, 120000, 1, true, true, 'https://static.wikia.nocookie.net/hotwheels/images/a/ab/Custom_Datsun_240Z_-_FJV45.jpg/revision/latest?cb=20180407130252'),
  ('\'69 FORD MUSTANG BOSS 302', 'a1111111-1111-1111-1111-111111111111', 2026, 2, 'Dark Red', 'Carded / Mint', 'Silver Series', 55000, 95000, 2, false, false, 'https://static.wikia.nocookie.net/hotwheels/images/4/4b/69_Ford_Mustang_Boss_302_-_57088.jpg/revision/latest?cb=20120101180214'),
  ('TWIN MILL III', 'a1111111-1111-1111-1111-111111111111', 2026, 3, 'Red', 'Carded', 'Silver Series', 40000, 65000, 1, true, false, 'https://static.wikia.nocookie.net/hotwheels/images/7/74/Twin_Mill_III_-_V0451.jpg/revision/latest?cb=20110328120336'),
  ('KOOL KOMBI', 'a1111111-1111-1111-1111-111111111111', 2026, 4, 'Dark Orange', 'Loose Mint', 'Silver Series', 70000, 140000, 1, true, true, 'https://static.wikia.nocookie.net/hotwheels/images/c/c2/Kool_Kombi_Orange.jpg/revision/latest?cb=20140201192837');
