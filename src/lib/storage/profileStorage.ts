'use client';

import { CollectorProfile } from '@/types/diecast';

export const defaultProfile: CollectorProfile = {
  garageName: 'Wortelemes Garage',
  collectorBadge: 'Kolektor 1:64',
  bio: 'Koleksi pribadi dan jual santai diecast skala 1:64. Fokus Hot Wheels (RLC, Super Treasure Hunt, Boulevard, Mainline) dan rilisan diecast pilihan. Semua unit original dan kondisi fisik sesuai deskripsi.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '',
  isWhatsAppOrderEnabled: false, // Default to disabled as requested
  location: 'Indonesia',
  avatarUrl: '/logo.png',
  instagramHandle: '@wortelemes',
  pillars: [
    {
      id: 'pillar-1',
      icon: 'award',
      title: '100% Original',
      description: 'Semua unit dijamin original Hot Wheels / Mattel resmi. Bukan custom atau repro.',
    },
    {
      id: 'pillar-2',
      icon: 'package',
      title: 'Packing Standar Kolektor',
      description: 'Kardus tebal double-wall dan bubble wrap berlapis agar bubble tidak pecah & card aman.',
    },
    {
      id: 'pillar-3',
      icon: 'truck',
      title: 'Kirim Seluruh Indonesia',
      description: 'Melayani kirim ke seluruh Indonesia via ekspedisi terpercaya (JNE, SiCepat, J&T, Paxel).',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      q: 'Apakah semua diecast dijamin original?',
      a: 'Ya, semua diecast kami dapatkan langsung dari distributor resmi atau sesama kolektor terpercaya. Tidak menjual barang tiruan, reseal, atau repro.',
    },
    {
      id: 'faq-2',
      q: 'Bagaimana standar penilaian kondisi card dan blister?',
      a: 'Kondisi dicantumkan jelas: Carded Mint (karton tegak bubble mulus), Soft Corner (ujung karton agak melengkung wajar), atau Loose (unit tanpa kemasan dengan cat mulus).',
    },
    {
      id: 'faq-3',
      q: 'Bisa minta foto atau video detail sebelum beli?',
      a: 'Bisa. Silakan kontak admin via WhatsApp atau DM Instagram untuk cek foto tampak depan, belakang, sudut bubble, dan rivet bawah.',
    },
    {
      id: 'faq-4',
      q: 'Bisa tukar tambah atau barter (WTT)?',
      a: 'Bisa didiskusikan santai jika punya rilisan RLC, STH, atau casting retro yang sepadan.',
    },
  ],
};

const STORAGE_KEY = 'wortelemes_collector_profile_v1';

let hasKickedOffProfileSync = false;

export async function syncProfileFromCloud(): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const res = await fetch('/api/profile', { cache: 'no-store' });
    if (!res.ok) return;
    const json = await res.json();
    if (json.success && json.profile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(json.profile));
      window.dispatchEvent(new CustomEvent('collector-profile-updated', { detail: json.profile }));
    }
  } catch (err) {
    console.warn('Could not sync profile from cloud, using cache:', err);
  }
}

export function getStoredProfile(): CollectorProfile {
  if (typeof window === 'undefined') return defaultProfile;

  if (!hasKickedOffProfileSync) {
    hasKickedOffProfileSync = true;
    setTimeout(() => {
      syncProfileFromCloud().catch(() => {});
    }, 200);
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
      return defaultProfile;
    }
    const parsed = JSON.parse(raw);
    return {
      ...defaultProfile,
      ...parsed,
      isWhatsAppOrderEnabled:
        parsed.isWhatsAppOrderEnabled !== undefined
          ? Boolean(parsed.isWhatsAppOrderEnabled)
          : false,
      pillars: Array.isArray(parsed.pillars) && parsed.pillars.length > 0 ? parsed.pillars : defaultProfile.pillars,
      faqs: Array.isArray(parsed.faqs) && parsed.faqs.length > 0 ? parsed.faqs : defaultProfile.faqs,
    };
  } catch (err) {
    console.error('Error reading collector profile from localStorage:', err);
    return defaultProfile;
  }
}

export function saveStoredProfile(profile: CollectorProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    window.dispatchEvent(new CustomEvent('collector-profile-updated', { detail: profile }));

    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    }).catch((e) => console.error('Failed to sync profile to cloud:', e));
  } catch (err) {
    console.error('Error saving collector profile to localStorage:', err);
  }
}

export function resetStoredProfile(): CollectorProfile {
  if (typeof window === 'undefined') return defaultProfile;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
    window.dispatchEvent(new CustomEvent('collector-profile-updated', { detail: defaultProfile }));
    return defaultProfile;
  } catch (err) {
    console.error('Error resetting collector profile:', err);
    return defaultProfile;
  }
}

export function getStoredWhatsAppNumber(): string {
  const profile = getStoredProfile();
  return profile.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
}

export function isWhatsAppOrderActive(): boolean {
  const profile = getStoredProfile();
  return Boolean(profile.isWhatsAppOrderEnabled);
}

export function setWhatsAppOrderActive(enabled: boolean): void {
  const profile = getStoredProfile();
  const updated: CollectorProfile = {
    ...profile,
    isWhatsAppOrderEnabled: enabled,
  };
  saveStoredProfile(updated);
}
