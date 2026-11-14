'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Package,
  Truck,
  MessageCircle,
  HelpCircle,
  Award,
  Shield,
  Settings,
  ArrowUpRight,
} from 'lucide-react';
import { CollectorProfile } from '@/types/diecast';
import { getStoredProfile, defaultProfile } from '@/lib/storage/profileStorage';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const CollectorProfileView: React.FC = () => {
  const [profile, setProfile] = useState<CollectorProfile>(defaultProfile);

  useEffect(() => {
    setProfile(getStoredProfile());

    const handleProfileUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CollectorProfile>;
      if (customEvent.detail) {
        setProfile(customEvent.detail);
      } else {
        setProfile(getStoredProfile());
      }
    };

    window.addEventListener('collector-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('collector-profile-updated', handleProfileUpdate);
  }, []);

  const handleWhatsAppChat = () => {
    const phone = profile.whatsappNumber.replace(/[^0-9]/g, '');
    if (!phone) {
      alert('Nomor WhatsApp belum diatur di menu admin.');
      return;
    }
    const text = `Halo ${profile.garageName}! Mau tanya seputar koleksi diecast garasi.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const renderPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="w-4 h-4 text-amber-400" />;
      case 'package':
        return <Package className="w-4 h-4 text-emerald-400" />;
      case 'truck':
        return <Truck className="w-4 h-4 text-blue-400" />;
      case 'shield':
      default:
        return <Shield className="w-4 h-4 text-violet-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 w-full max-w-4xl mx-auto">
      {/* 1. Curator Identity Banner */}
      <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-center md:items-start gap-6 shadow-sm">
        {/* Avatar */}
        <div className="relative w-20 h-20 rounded-xl bg-[#181a24] border border-white/10 overflow-hidden shrink-0 p-1">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-black/40">
            <Image
              src={profile.avatarUrl || '/logo.png'}
              alt={profile.garageName}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2 flex-1">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight uppercase">
              {profile.garageName}
            </h1>
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {profile.collectorBadge}
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed max-w-xl">
            {profile.bio}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {profile.isWhatsAppOrderEnabled ? (
              <button
                onClick={handleWhatsAppChat}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Tanya via WhatsApp</span>
              </button>
            ) : (
              <div
                className="inline-flex items-center gap-2 bg-white/[0.04] text-gray-400 font-medium text-xs px-3 py-1.5 rounded-lg border border-white/[0.06]"
                title="Pemesanan WhatsApp sedang nonaktif"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Pemesanan Nonaktif (Display Koleksi)</span>
              </div>
            )}

            {profile.instagramHandle && (
              <a
                href={`https://instagram.com/${profile.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3 py-1.5 rounded-lg transition-colors font-medium"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>{profile.instagramHandle}</span>
                <ArrowUpRight className="w-3 h-3 text-gray-500" />
              </a>
            )}

            <span className="text-xs text-gray-400 bg-white/[0.02] border border-white/[0.06] px-3 py-1.5 rounded-lg">
              {profile.location}
            </span>

            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 px-3 py-1.5 rounded-lg transition-all font-medium"
              title="Buka Menu Admin"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Menu Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Trust Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {profile.pillars.map((pillar, idx) => (
          <div
            key={pillar.id || idx}
            className="bg-[#12131a] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                {renderPillarIcon(pillar.icon)}
              </div>
              <h3 className="text-xs font-semibold uppercase text-white tracking-wide">
                {pillar.title}
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Collector FAQs */}
      <div className="bg-[#12131a] border border-white/[0.08] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <h2 className="text-xs uppercase tracking-wider text-gray-300 font-semibold">
              Pertanyaan Umum & Info Koleksi
            </h2>
          </div>

          <Link
            href="/admin"
            className="text-[11px] text-gray-400 hover:text-white font-medium transition-colors flex items-center gap-1"
          >
            <Settings className="w-3 h-3 text-gray-400" />
            <span className="hidden sm:inline">Edit di Admin</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {profile.faqs.map((faq, index) => (
            <div
              key={faq.id || index}
              className="bg-[#161822] border border-white/[0.06] rounded-xl p-3.5 flex flex-col gap-1"
            >
              <h3 className="text-xs font-semibold text-white leading-snug">
                {faq.q}
              </h3>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
