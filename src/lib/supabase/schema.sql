-- Wortelemes Collections - Comprehensive Database Schema Migration
-- Run this in Supabase SQL Editor

-- 1. Create Series Table
CREATE TABLE IF NOT EXISTS public.series (
    id TEXT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    year INT DEFAULT 2026,
    category VARCHAR(100) DEFAULT 'Mainline',
    pantone_code VARCHAR(50),
    total_in_set INT DEFAULT 6,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Collections (Diecast Inventory) Table
CREATE TABLE IF NOT EXISTS public.collections (
    id TEXT PRIMARY KEY,
    series_id TEXT REFERENCES public.series(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    casting_code VARCHAR(50),
    release_year INT DEFAULT 2026,
    segment_number INT DEFAULT 1,
    color VARCHAR(100) DEFAULT 'Standard',
    scale VARCHAR(20) DEFAULT '1:64',
    condition VARCHAR(50) DEFAULT 'Carded / Mint',
    tier_badge VARCHAR(50) DEFAULT 'Mainline',
    buy_price NUMERIC(12, 2) DEFAULT 0,
    sell_price NUMERIC(12, 2) DEFAULT 0,
    qty INT DEFAULT 1,
    is_for_sale BOOLEAN DEFAULT false,
    is_favorite BOOLEAN DEFAULT false,
    image_url TEXT,
    wiki_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create News / Journal Articles Table
CREATE TABLE IF NOT EXISTS public.news_articles (
    id TEXT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT,
    content TEXT,
    date VARCHAR(50),
    read_time VARCHAR(50),
    tag VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Upcoming Drops Table
CREATE TABLE IF NOT EXISTS public.upcoming_drops (
    id TEXT PRIMARY KEY,
    month VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    model TEXT NOT NULL,
    series TEXT,
    status VARCHAR(50) DEFAULT 'Upcoming',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Create Collector Profile Table (Single row key-value / json store)
CREATE TABLE IF NOT EXISTS public.collector_profile (
    id TEXT PRIMARY KEY DEFAULT 'default',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Enable Row Level Security (RLS) & Set Permissive Public Access
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upcoming_drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collector_profile ENABLE ROW LEVEL SECURITY;

-- Series Policies
DROP POLICY IF EXISTS "Public read series" ON public.series;
CREATE POLICY "Public read series" ON public.series FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write series" ON public.series;
CREATE POLICY "Public write series" ON public.series FOR ALL USING (true);

-- Collections Policies
DROP POLICY IF EXISTS "Public read collections" ON public.collections;
CREATE POLICY "Public read collections" ON public.collections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write collections" ON public.collections;
CREATE POLICY "Public write collections" ON public.collections FOR ALL USING (true);

-- News Articles Policies
DROP POLICY IF EXISTS "Public read news_articles" ON public.news_articles;
CREATE POLICY "Public read news_articles" ON public.news_articles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write news_articles" ON public.news_articles;
CREATE POLICY "Public write news_articles" ON public.news_articles FOR ALL USING (true);

-- Upcoming Drops Policies
DROP POLICY IF EXISTS "Public read upcoming_drops" ON public.upcoming_drops;
CREATE POLICY "Public read upcoming_drops" ON public.upcoming_drops FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write upcoming_drops" ON public.upcoming_drops;
CREATE POLICY "Public write upcoming_drops" ON public.upcoming_drops FOR ALL USING (true);

-- Collector Profile Policies
DROP POLICY IF EXISTS "Public read collector_profile" ON public.collector_profile;
CREATE POLICY "Public read collector_profile" ON public.collector_profile FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public write collector_profile" ON public.collector_profile;
CREATE POLICY "Public write collector_profile" ON public.collector_profile FOR ALL USING (true);

-- 7. Seed Initial Series
INSERT INTO public.series (id, name, year, category, pantone_code, total_in_set)
VALUES 
  ('s-sunset-2026', 'SUNSET RACE (2026)', 2026, 'SILVER SERIES', 'PANTONE', 6),
  ('s-rlc-2026', 'RED LINE CLUB', 2026, 'RLC', NULL, 3),
  ('s-mainline-2026', 'MAINLINE SET', 2026, 'MAINLINE', NULL, 10)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  year = EXCLUDED.year,
  category = EXCLUDED.category,
  pantone_code = EXCLUDED.pantone_code,
  total_in_set = EXCLUDED.total_in_set;

-- 8. Seed Initial Collections
INSERT INTO public.collections (id, name, series_id, release_year, segment_number, color, scale, condition, tier_badge, casting_code, sell_price, buy_price, qty, is_for_sale, is_favorite, image_url, notes)
VALUES 
  ('car-erikenstein', 'ERIKENSTEIN ROD', 's-sunset-2026', 2026, 1, 'Light Blue', '1:64', 'Carded / Mint', 'Hot Wheels XL', '181', 75000, 45000, 1, true, false, '/cars/erikenstein_rod.png', NULL),
  ('car-bmw-m3', '1991 BMW M3', 's-rlc-2026', 2026, 1, 'Olive Green', '1:64', 'Protector Mint', 'RLC', 'RLC-01', 850000, 450000, 1, true, true, '/cars/1991_bmw_m3.png', NULL),
  ('car-porsche-carrera', 'PORSCHE CARRERA', 's-mainline-2026', 2026, 2, 'Yellow', '1:64', 'Carded', 'Mainline', '122', 55000, 35000, 1, true, false, '/cars/porsche_carrera.png', NULL),
  ('car-simpsons', 'THE SIMPSONS', 's-mainline-2026', 2026, 3, 'Pink', '1:64', 'Carded / Mint', 'Screen Time', '58', 85000, 45000, 1, false, false, '/cars/the_simpsons.png', NULL),
  ('car-porsche-rs', 'PORSCHE 911 CARRERA RS 2.7', 's-mainline-2026', 2026, 9, 'Spectraflame Brown', '1:64', 'Carded / Mint', 'Super Treasure Hunt', '208', 350000, 120000, 1, true, true, '/cars/porsche_911_rs.png', 'Super Treasure Hunt variant with Real Riders rubber tires & Spectraflame finish.'),
  ('car-fairlady-z', 'NISSAN FAIRLADY Z', 's-sunset-2026', 2026, 1, 'Vibrant Blue', '1:64', 'Carded / Mint', 'Silver Series', '1/6', 120000, 65000, 1, true, true, '/cars/nissan_fairlady_z.png', NULL),
  ('car-mustang-boss', '''69 FORD MUSTANG BOSS 302', 's-sunset-2026', 2026, 2, 'Dark Red', '1:64', 'Carded / Mint', 'Silver Series', '2/6', 95000, 55000, 2, false, false, '/cars/69_mustang_boss.png', NULL),
  ('car-twin-mill', 'TWIN MILL III', 's-sunset-2026', 2026, 3, 'Red', '1:64', 'Carded', 'Silver Series', '3/6', 65000, 40000, 1, true, false, '/cars/twin_mill_iii.png', NULL),
  ('car-kool-kombi', 'KOOL KOMBI', 's-sunset-2026', 2026, 4, 'Dark Orange', '1:64', 'Loose Mint', 'Silver Series', '4/6', 140000, 70000, 1, true, true, '/cars/kool_kombi.png', NULL),
  ('car-audi-quattro', '1985 AUDI QUATTRO SPORT S1', 's-rlc-2026', 2026, 1, 'Blue', '1:64', 'Carded', 'RLC', 'RLC-02', 950000, 520000, 1, true, true, '/cars/audi_quattro.png', NULL),
  ('car-nissan-720', '1986 NISSAN 720 KING CAB', 's-rlc-2026', 2026, 2, 'Blue', '1:64', 'Carded', 'RLC', 'RLC-03', 890000, 480000, 1, true, false, '/cars/nissan_720.png', NULL)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  series_id = EXCLUDED.series_id,
  release_year = EXCLUDED.release_year,
  segment_number = EXCLUDED.segment_number,
  color = EXCLUDED.color,
  scale = EXCLUDED.scale,
  condition = EXCLUDED.condition,
  tier_badge = EXCLUDED.tier_badge,
  casting_code = EXCLUDED.casting_code,
  sell_price = EXCLUDED.sell_price,
  buy_price = EXCLUDED.buy_price,
  qty = EXCLUDED.qty,
  is_for_sale = EXCLUDED.is_for_sale,
  is_favorite = EXCLUDED.is_favorite,
  image_url = EXCLUDED.image_url,
  notes = EXCLUDED.notes;

-- 9. Seed News Articles
INSERT INTO public.news_articles (id, category, title, excerpt, content, date, read_time, tag)
VALUES 
  ('art-1', 'RLC Drops & Calendar', '2026 Red Line Club (RLC) Drop Calendar: Iconic Collector Castings', 'Official RLC quarterly drop schedules featuring the BMW M3 E30, Datsun 240Z, and Porsche 930 Turbo in Spectraflame finishes.', 'The 2026 Red Line Club quarter introduces opening hoods, detailed engine bays, and Spectraflame finishes paired with Real Riders deep-dish wheels across three releases:

1. 1991 BMW M3 E30: Olive Spectraflame with authentic race liveries.
2. Datsun 240Z Custom: Bespoke roll cage and detailed interior dials.
3. Porsche 930 Turbo: Functional decklid displaying the rear-mounted intercooler.

Production is strictly capped at 25,000 numbered units worldwide with acrylic display cases. Reminders should be set 15 minutes before the drop countdown.', 'Nov 3, 2026', '3 min read', 'Drop Alert'),
  ('art-2', 'Care & Preservation', 'Guide to Selecting UV-Resistant Acrylic Protectors for Carded Collections', 'Defend blister cards from soft corners, card crease, and sun discoloration with 2mm museum-grade UV-filtering acrylic.', 'Carded diecast preservation requires deliberate preventative care. Prolonged exposure to ambient UV rays breaks down cardstock fibers and causes yellowing of clear plastic blister bubbles.

Key criteria when selecting protective clamshells and cases:
• Material Thickness: Aim for 2mm to 3mm cast acrylic rather than thin PVC.
• UV Rating: Look for 98%+ UV absorption to prevent fade on vibrant card artwork.
• Corner Relief: High-quality cases include molded interior corner channels that prevent soft-edge impact friction.
• Slide-Bottom Mechanism: Magnetic or friction slide bases avoid pressure against the top hang-tag hole.

Storing your protected pieces in a climate-controlled room between 20°C–24°C with 40–50% relative humidity guarantees lifetime card integrity.', 'Oct 28, 2026', '4 min read', 'Collector Guide'),
  ('art-3', 'Market Insights', '1:64 Diecast Market Watch: Why JDM Classics and Vintage Porsches Dominate', 'Resale pricing trends and auction data for Japanese Domestic Market (JDM) and Porsche heritage castings.', 'Secondary market transaction data over the past 24 months demonstrates strong resilience in Japanese Domestic Market (JDM) castings, specifically the Nissan Skyline GT-R (R32, R33, R34), Datsun 510 Wagon, and air-cooled Porsche 911s.

Market Dynamics Observed:
• Limited Batch Mainlines with accurate tampo printing appreciate 300% to 500% within 18 months of retail clearance.
• RLC Super Treasure Hunt (STH) variants with factory error cards command premium values among specialized authenticity collectors.
• Liquid secondary trading communities in Indonesia and Southeast Asia consistently value complete chronological carded sets over loose models.

Maintaining immaculate blister conditions remains the single highest driver of long-term resale appraisal.', 'Oct 20, 2026', '5 min read', 'Market Watch'),
  ('art-4', 'Authentication', 'Authentication Guide: Factory Blister Seals vs. Resealed Cards', 'Inspect glue residue texture, factory cardstock embossing, and blister heat-seal lines before finalizing high-ticket acquisitions.', 'With increasing values for vintage castings, counterfeits and resealed carded blisters require rigorous verification before completing transactions.

Inspection Checklist:
1. Waffle Pattern Embossing: Factory Mattel heat-sealing uses an automated micro-waffle or cross-hatch crimp along the blister flange that cannot be replicated with conventional glue.
2. Fiber Tear Test: Authentic cards exhibit clean paper fiber tear lines under high-intensity ultraviolet blacklight if tampered with.
3. Base Rivets: Always inspect the bottom rivets using a 10x jeweler loupe to ensure spun factory heads haven''t been drilled or substituted with aftermarket screws.

Never hesitate to request high-resolution macro photography from dealers before purchasing rare carded pieces.', 'Oct 15, 2026', '4 min read', 'Security Tips')
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  date = EXCLUDED.date,
  read_time = EXCLUDED.read_time,
  tag = EXCLUDED.tag;

-- 10. Seed Upcoming Drops
INSERT INTO public.upcoming_drops (id, month, date, model, series, status)
VALUES 
  ('drop-1', 'NOV 2026', 'Nov 18', '1993 McLaren F1 (RLC Exclusive)', 'Red Line Club', 'Upcoming'),
  ('drop-2', 'DEC 2026', 'Dec 05', 'Nissan Skyline GT-R R34 (Silver Series)', 'Silver Series Batch 2', 'Confirmed'),
  ('drop-3', 'DEC 2026', 'Dec 22', 'Porsche 911 GT3 RS (Track Day Special)', 'Premium Car Culture', 'Upcoming')
ON CONFLICT (id) DO UPDATE SET
  month = EXCLUDED.month,
  date = EXCLUDED.date,
  model = EXCLUDED.model,
  series = EXCLUDED.series,
  status = EXCLUDED.status;

-- 11. Seed Collector Profile
INSERT INTO public.collector_profile (id, data)
VALUES (
  'default',
  '{
    "garageName": "WORTELEMES GARAGE",
    "collectorBadge": "Verified Collector",
    "bio": "1:64 scale diecast curator and collector specializing in RLC, Silver Series, vintage castings, and modern releases. Open for acquisitions, trade inquiries (WTT), and collector consultations.",
    "whatsappNumber": "6281234567890",
    "location": "Indonesia (Worldwide Shipping)",
    "avatarUrl": "/logo.png",
    "instagramHandle": "@wortelemes",
    "pillars": [
      {
        "id": "pillar-1",
        "icon": "award",
        "title": "100% Authentic",
        "description": "Every casting is verified genuine from authorized official distribution channels."
      },
      {
        "id": "pillar-2",
        "icon": "package",
        "title": "Safe Box Packing",
        "description": "Double-wall boxes and corner guards included on every order."
      },
      {
        "id": "pillar-3",
        "icon": "truck",
        "title": "Worldwide Shipping",
        "description": "Domestic courier delivery (JNE, SiCepat, Paxel) and international tracked post."
      }
    ],
    "faqs": [
      {
        "id": "faq-1",
        "q": "Are all diecasts guaranteed 100% authentic?",
        "a": "Every model comes directly from factory cases and authorized distribution. We do not stock reproductions, resealed cards, or custom clones."
      },
      {
        "id": "faq-2",
        "q": "What is your grading standard for card and blister condition?",
        "a": "Every piece is classified transparently: Carded Mint (straight unbent cardstock), Blister Soft Corner (minor corner soft bend), or Loose Mint (flawless casting body and unchipped factory paint)."
      },
      {
        "id": "faq-3",
        "q": "Can I request close-up physical inspection photos before checkout?",
        "a": "Yes. Message us on WhatsApp for 4-sided macro photos, base rivet inspection, and blister bubble clarity checks before purchase."
      },
      {
        "id": "faq-4",
        "q": "How are shipments packed and protected?",
        "a": "We pack every shipment in double-wall corrugated boxes with wrapped card protectors and reinforced corners. Free of charge."
      }
    ]
  }'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  data = EXCLUDED.data,
  updated_at = now();
