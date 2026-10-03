export interface Series {
  id: string;
  name: string;
  year: number;
  category: string;
  pantone_code?: string;
  total_in_set: number;
  created_at?: string;
}

export interface CollectionItem {
  id: string;
  series_id?: string;
  series?: Series;
  name: string;
  casting_code?: string;
  release_year: number;
  segment_number: number;
  color: string;
  scale: string;
  condition: string;
  tier_badge: string; // e.g., 'RLC', 'STH', 'TH', 'Silver Series', 'Hot Wheels XL', 'Mainline'
  
  // Public visible
  sell_price: number;
  qty: number;
  is_for_sale: boolean;
  is_favorite: boolean;
  image_url: string;
  wiki_url?: string;

  // Sensitive Admin fields (Stripped for public users)
  buy_price?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface WikiSearchResult {
  title: string;
  url: string;
  thumbnail?: string;
}
