'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShieldCheck,
  Package,
  Truck,
  MessageCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Award,
} from 'lucide-react';

export const CollectorProfileView: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleWhatsAppChat = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const text = 'Hello Wortelemes! I would like to inquire about your diecast collection in your garage.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const faqs = [
    {
      q: 'Are all diecasts guaranteed 100% authentic?',
      a: '100% genuine factory releases (Mattel, Hot Wheels, and authorized global distributors). We never collect or sell replicas, resealed custom cards, or counterfeit loose castings.',
    },
    {
      q: 'What is your grading standard for card and blister condition?',
      a: 'Every piece is classified transparently: Carded Mint (straight unbent cardstock), Blister Soft Corner (minor corner soft bend), or Loose Mint (flawless casting body and unchipped factory paint).',
    },
    {
      q: 'Can I request close-up physical inspection photos before checkout?',
      a: 'Absolutely! You can reach us directly on WhatsApp to request 4-sided high-resolution photos, base rivet inspection, and blister clarity checks before packing.',
    },
    {
      q: 'How are shipments packed and protected?',
      a: 'Every order is packaged with heavy-duty double-wall corrugated cardboard and multi-layered bubble wrap at no additional charge to ensure zero transit damage.',
    },
  ];

  return (
    <div className="flex flex-col gap-8 pb-16 w-full max-w-4xl mx-auto">
      {/* 1. Header Profile & Seller Card */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Avatar */}
        <div className="relative w-28 h-28 rounded-3xl bg-[#181a24] border-2 border-white/10 overflow-hidden shadow-2xl shrink-0 p-1">
          <div className="relative w-full h-full rounded-2xl overflow-hidden">
            <Image
              src="/logo.png"
              alt="Wortelemes Avatar"
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
              WORTELEMES GARAGE
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              Verified Collector
            </span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
            1:64 scale diecast curator and collector specializing in RLC, Silver Series, vintage castings, and modern releases. Open for acquisitions, trade inquiries (WTT), and collector consultations.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={handleWhatsAppChat}
              className="inline-flex items-center gap-2 bg-[#0066d6] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contact on WhatsApp</span>
            </button>
            <span className="text-xs text-gray-400 font-mono">
              Location: Indonesia (Worldwide Shipping)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Key Pillars / Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121319] border border-white/[0.08] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-wide">
              100% Authentic
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Every casting is verified genuine from authorized official distribution channels.
            </p>
          </div>
        </div>

        <div className="bg-[#121319] border border-white/[0.08] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-wide">
              Safe Box Packing
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Double-wall boxes & layered bubble wrap complimentary to preserve card integrity.
            </p>
          </div>
        </div>

        <div className="bg-[#121319] border border-white/[0.08] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-wide">
              Worldwide Shipping
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Domestic courier delivery (JNE, SiCepat, Paxel) and international tracked post.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Collector FAQ Accordion */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-black uppercase text-white tracking-wide">
            Frequently Asked Questions (FAQ)
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
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
