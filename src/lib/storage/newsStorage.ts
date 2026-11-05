'use client';

import { ArticleItem, UpcomingDropItem } from '@/types/diecast';

const ARTICLES_STORAGE_KEY = 'wortelemes_journal_articles_v1';
const DROPS_STORAGE_KEY = 'wortelemes_upcoming_drops_v1';

export const defaultArticles: ArticleItem[] = [
  {
    id: 'art-1',
    category: 'RLC Drops & Calendar',
    title: '2026 Red Line Club (RLC) Drop Calendar: Iconic Collector Castings',
    excerpt: 'Official RLC quarterly drop schedules featuring the BMW M3 E30, Datsun 240Z, and Porsche 930 Turbo in Spectraflame finishes.',
    content: `The 2026 Red Line Club quarter introduces opening hoods, detailed engine bays, and Spectraflame finishes paired with Real Riders deep-dish wheels across three releases:

1. 1991 BMW M3 E30: Olive Spectraflame with authentic race liveries.
2. Datsun 240Z Custom: Bespoke roll cage and detailed interior dials.
3. Porsche 930 Turbo: Functional decklid displaying the rear-mounted intercooler.

Production is strictly capped at 25,000 numbered units worldwide with acrylic display cases. Reminders should be set 15 minutes before the drop countdown.`,
    date: 'Nov 3, 2026',
    readTime: '3 min read',
    tag: 'Drop Alert',
  },
  {
    id: 'art-2',
    category: 'Care & Preservation',
    title: 'Guide to Selecting UV-Resistant Acrylic Protectors for Carded Collections',
    excerpt: 'Defend blister cards from soft corners, card crease, and sun discoloration with 2mm museum-grade UV-filtering acrylic.',
    content: `Carded diecast preservation requires deliberate preventative care. Prolonged exposure to ambient UV rays breaks down cardstock fibers and causes yellowing of clear plastic blister bubbles.

Key criteria when selecting protective clamshells and cases:
• Material Thickness: Aim for 2mm to 3mm cast acrylic rather than thin PVC.
• UV Rating: Look for 98%+ UV absorption to prevent fade on vibrant card artwork.
• Corner Relief: High-quality cases include molded interior corner channels that prevent soft-edge impact friction.
• Slide-Bottom Mechanism: Magnetic or friction slide bases avoid pressure against the top hang-tag hole.

Storing your protected pieces in a climate-controlled room between 20°C–24°C with 40–50% relative humidity guarantees lifetime card integrity.`,
    date: 'Oct 28, 2026',
    readTime: '4 min read',
    tag: 'Collector Guide',
  },
  {
    id: 'art-3',
    category: 'Market Insights',
    title: '1:64 Diecast Market Watch: Why JDM Classics and Vintage Porsches Dominate',
    excerpt: 'Resale pricing trends and auction data for Japanese Domestic Market (JDM) and Porsche heritage castings.',
    content: `Secondary market transaction data over the past 24 months demonstrates strong resilience in Japanese Domestic Market (JDM) castings, specifically the Nissan Skyline GT-R (R32, R33, R34), Datsun 510 Wagon, and air-cooled Porsche 911s.

Market Dynamics Observed:
• Limited Batch Mainlines with accurate tampo printing appreciate 300% to 500% within 18 months of retail clearance.
• RLC Super Treasure Hunt (STH) variants with factory error cards command premium values among specialized authenticity collectors.
• Liquid secondary trading communities in Indonesia and Southeast Asia consistently value complete chronological carded sets over loose models.

Maintaining immaculate blister conditions remains the single highest driver of long-term resale appraisal.`,
    date: 'Oct 20, 2026',
    readTime: '5 min read',
    tag: 'Market Watch',
  },
  {
    id: 'art-4',
    category: 'Authentication',
    title: 'Authentication Guide: Factory Blister Seals vs. Resealed Cards',
    excerpt: 'Inspect glue residue texture, factory cardstock embossing, and blister heat-seal lines before finalizing high-ticket acquisitions.',
    content: `With increasing values for vintage castings, counterfeits and resealed carded blisters require rigorous verification before completing transactions.

Inspection Checklist:
1. Waffle Pattern Embossing: Factory Mattel heat-sealing uses an automated micro-waffle or cross-hatch crimp along the blister flange that cannot be replicated with conventional glue.
2. Fiber Tear Test: Authentic cards exhibit clean paper fiber tear lines under high-intensity ultraviolet blacklight if tampered with.
3. Base Rivets: Always inspect the bottom rivets using a 10x jeweler loupe to ensure spun factory heads haven't been drilled or substituted with aftermarket screws.

Never hesitate to request high-resolution macro photography from dealers before purchasing rare carded pieces.`,
    date: 'Oct 15, 2026',
    readTime: '4 min read',
    tag: 'Security Tips',
  },
];

export const defaultUpcomingDrops: UpcomingDropItem[] = [
  {
    id: 'drop-1',
    month: 'NOV 2026',
    date: 'Nov 18',
    model: '1993 McLaren F1 (RLC Exclusive)',
    series: 'Red Line Club',
    status: 'Upcoming',
  },
  {
    id: 'drop-2',
    month: 'DEC 2026',
    date: 'Dec 05',
    model: 'Nissan Skyline GT-R R34 (Silver Series)',
    series: 'Silver Series Batch 2',
    status: 'Confirmed',
  },
  {
    id: 'drop-3',
    month: 'DEC 2026',
    date: 'Dec 22',
    model: 'Porsche 911 GT3 RS (Track Day Special)',
    series: 'Premium Car Culture',
    status: 'Upcoming',
  },
];

export function getStoredArticles(): ArticleItem[] {
  if (typeof window === 'undefined') return defaultArticles;
  try {
    const raw = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(defaultArticles));
      return defaultArticles;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultArticles;
  } catch (err) {
    console.error('Error reading articles from localStorage:', err);
    return defaultArticles;
  }
}

export function saveStoredArticles(items: ArticleItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('journal-data-updated'));
  } catch (err) {
    console.error('Error saving articles to localStorage:', err);
  }
}

export function getStoredDrops(): UpcomingDropItem[] {
  if (typeof window === 'undefined') return defaultUpcomingDrops;
  try {
    const raw = localStorage.getItem(DROPS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DROPS_STORAGE_KEY, JSON.stringify(defaultUpcomingDrops));
      return defaultUpcomingDrops;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultUpcomingDrops;
  } catch (err) {
    console.error('Error reading drops from localStorage:', err);
    return defaultUpcomingDrops;
  }
}

export function saveStoredDrops(items: UpcomingDropItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(DROPS_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('journal-data-updated'));
  } catch (err) {
    console.error('Error saving drops to localStorage:', err);
  }
}

export function resetStoredNews(): { articles: ArticleItem[]; drops: UpcomingDropItem[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(defaultArticles));
    localStorage.setItem(DROPS_STORAGE_KEY, JSON.stringify(defaultUpcomingDrops));
    window.dispatchEvent(new CustomEvent('journal-data-updated'));
  }
  return { articles: defaultArticles, drops: defaultUpcomingDrops };
}
