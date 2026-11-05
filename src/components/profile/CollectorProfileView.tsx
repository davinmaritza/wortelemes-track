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
  ChevronDown,
  Sparkles,
  Award,
  Shield,
  ExternalLink,
  Settings,
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    const phone = profile.whatsappNumber.replace(/[^0-9]/g, '') || '6281234567890';
    const text = `Hello ${profile.garageName}! I would like to inquire about your diecast collection in your garage.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const renderPillarIcon = (iconName: string) => {
    switch (iconName) {
      case 'award':
        return <Award className="w-5 h-5" />;
      case 'package':
        return <Package className="w-5 h-5" />;
      case 'truck':
        return <Truck className="w-5 h-5" />;
      case 'shield':
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getPillarColorClass = (index: number) => {
    if (index === 0) return 'bg-blue-500/15 border-blue-500/30 text-blue-400';
    if (index === 1) return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
    return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
  };

  return (
    <div className="flex flex-col gap-8 pb-16 w-full max-w-4xl mx-auto">
      {/* 1. Header Profile & Seller Card */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative w-28 h-28 rounded-3xl bg-[#181a24] border-2 border-white/10 overflow-hidden shadow-2xl shrink-0 p-1">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black/40">
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
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              {profile.garageName}
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              {profile.collectorBadge}
            </span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
            {profile.bio}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={handleWhatsAppChat}
              className="inline-flex items-center gap-2 bg-[#0066d6] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact on WhatsApp</span>
            </button>

            {profile.instagramHandle && (
              <a
                href={`https://instagram.com/${profile.instagramHandle.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white bg-[#1a1d26] border border-[#242735] px-3.5 py-2.5 rounded-full transition-colors font-medium"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
                <span>{profile.instagramHandle}</span>
              </a>
            )}

            <span className="text-xs text-gray-400 font-mono">
              Location: {profile.location}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Pillars / Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {profile.pillars.map((pillar, idx) => (
          <div
            key={pillar.id || idx}
            className="bg-[#121319] border border-white/[0.08] rounded-2xl p-4 flex items-start gap-3"
          >
            <div
              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${getPillarColorClass(
                idx
              )}`}
            >
              {renderPillarIcon(pillar.icon)}
            </div>
            <div>
              <h3 className="text-xs font-black uppercase text-white tracking-wide">
                {pillar.title}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Collector FAQ Accordion */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-black uppercase text-white tracking-wide">
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <Link
            href="/admin"
            className="text-[11px] text-gray-400 hover:text-blue-400 font-medium transition-colors flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Manage Profile & FAQ in Admin</span>
          </Link>
        </div>

        <div className="flex flex-col gap-2.5">
          {profile.faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={faq.id || index}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 text-xs font-bold text-gray-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-gray-400 leading-relaxed border-t border-white/[0.04]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
