'use client';

import { CollectionItem } from '@/types/diecast';
import { showcaseCars } from '@/lib/data/mockData';

const STORAGE_KEY = 'wortelemes_diecast_inventory_v1';
let hasKickedOffInitialSync = false;

// Async background cloud synchronization
export async function syncCollectionsFromCloud(): Promise<CollectionItem[]> {
  if (typeof window === 'undefined') return showcaseCars;
  try {
    const res = await fetch('/api/inventory', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
      window.dispatchEvent(new CustomEvent('diecast-inventory-updated', { detail: json.data }));
      return json.data;
    }
  } catch (err) {
    console.warn('Could not sync inventory from cloud, retaining local cache:', err);
  }
  return getStoredCollections();
}

export function getStoredCollections(): CollectionItem[] {
  if (typeof window === 'undefined') return showcaseCars;

  // Background non-blocking sync on first read
  if (!hasKickedOffInitialSync) {
    hasKickedOffInitialSync = true;
    setTimeout(() => {
      syncCollectionsFromCloud().catch(() => {});
    }, 100);
  }

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
    // 1. Optimistic local cache update
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('diecast-inventory-updated', { detail: items }));

    // 2. Persist to Cloud Database asynchronously
    fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items),
    }).catch((err) => {
      console.error('Failed to sync saved collections to Supabase:', err);
    });
  } catch (err) {
    console.error('Error saving inventory to localStorage:', err);
  }
}

export function deleteStoredCollectionItem(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getStoredCollections();
    const filtered = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new CustomEvent('diecast-inventory-updated', { detail: filtered }));

    fetch(`/api/inventory?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch((err) => {
      console.error('Failed to sync deletion to Supabase:', err);
    });
  } catch (err) {
    console.error('Error deleting inventory item:', err);
  }
}

export function resetStoredCollections(): CollectionItem[] {
  if (typeof window === 'undefined') return showcaseCars;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(showcaseCars));
  window.dispatchEvent(new CustomEvent('diecast-inventory-updated', { detail: showcaseCars }));
  return showcaseCars;
}
