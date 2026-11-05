'use client';

import { CollectorProfile } from '@/types/diecast';

export const defaultProfile: CollectorProfile = {
  garageName: 'WORTELEMES GARAGE',
  collectorBadge: 'Verified Collector',
  bio: '1:64 scale diecast curator and collector specializing in RLC, Silver Series, vintage castings, and modern releases. Open for acquisitions, trade inquiries (WTT), and collector consultations.',
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890',
  location: 'Indonesia (Worldwide Shipping)',
  avatarUrl: '/logo.png',
  instagramHandle: '@wortelemes',
  pillars: [
    {
      id: 'pillar-1',
      icon: 'award',
      title: '100% Authentic',
      description: 'Every casting is verified genuine from authorized official distribution channels.',
    },
    {
      id: 'pillar-2',
      icon: 'package',
      title: 'Safe Box Packing',
      description: 'Double-wall boxes & layered bubble wrap complimentary to preserve card integrity.',
    },
    {
      id: 'pillar-3',
      icon: 'truck',
      title: 'Worldwide Shipping',
      description: 'Domestic courier delivery (JNE, SiCepat, Paxel) and international tracked post.',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      q: 'Are all diecasts guaranteed 100% authentic?',
      a: '100% genuine factory releases (Mattel, Hot Wheels, and authorized global distributors). We never collect or sell replicas, resealed custom cards, or counterfeit loose castings.',
    },
    {
      id: 'faq-2',
      q: 'What is your grading standard for card and blister condition?',
      a: 'Every piece is classified transparently: Carded Mint (straight unbent cardstock), Blister Soft Corner (minor corner soft bend), or Loose Mint (flawless casting body and unchipped factory paint).',
    },
    {
      id: 'faq-3',
      q: 'Can I request close-up physical inspection photos before checkout?',
      a: 'Absolutely! You can reach us directly on WhatsApp to request 4-sided high-resolution photos, base rivet inspection, and blister clarity checks before packing.',
    },
    {
      id: 'faq-4',
      q: 'How are shipments packed and protected?',
      a: 'Every order is packaged with heavy-duty double-wall corrugated cardboard and multi-layered bubble wrap at no additional charge to ensure zero transit damage.',
    },
  ],
};

const STORAGE_KEY = 'wortelemes_collector_profile_v1';

export function getStoredProfile(): CollectorProfile {
  if (typeof window === 'undefined') return defaultProfile;
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
  return profile.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
}
