'use client';

import { CollectionItem } from '@/types/diecast';
import { showcaseCars } from '@/lib/data/mockData';

const STORAGE_KEY = 'wortelemes_diecast_inventory_v1';

export function getStoredCollections(): CollectionItem[] {
  if (typeof window === 'undefined') return showcaseCars;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(showcaseCars));
      return showcaseCars;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : showcaseCars;
  } catch (err) {
    console.error('Error reading inventory from localStorage:', err);
    return showcaseCars;
  }
}

export function saveStoredCollections(items: CollectionItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('diecast-inventory-updated', { detail: items }));
  } catch (err) {
    console.error('Error saving inventory to localStorage:', err);
  }
}

export function resetStoredCollections(): CollectionItem[] {
  if (typeof window === 'undefined') return showcaseCars;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(showcaseCars));
  window.dispatchEvent(new CustomEvent('diecast-inventory-updated', { detail: showcaseCars }));
  return showcaseCars;
}
