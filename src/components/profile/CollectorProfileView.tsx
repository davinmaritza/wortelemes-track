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
    const text = 'Halo Wortelemes! Saya ingin bertanya mengenai koleksi diecast di garasi Anda.';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const faqs = [
    {
      q: 'Apakah semua diecast dijamin original?',
      a: '100% original resmi pabrik (Mattel/Hot Wheels/dll). Kami tidak pernah mengoleksi atau menjual barang tiruan, custom rekat ulang (reseal), atau loose palsu.',
    },
    {
      q: 'Bagaimana standar penilaian kondisi card & blister?',
      a: 'Setiap diecast diklasifikasikan secara jujur: Carded Mint (karton tegak lurus tanpa tekukan), Blister Soft Corner (ujung karton sedikit tertekan), atau Loose Mint (tanpa kemasan namun bodi mobil mulus tanpa cat terkelupas).',
    },
    {
      q: 'Apakah bisa minta foto fisik detail sebelum checkout?',
      a: 'Tentu saja! Anda dapat menghubungi WhatsApp kami untuk meminta foto close-up 4 sisi, kondisi rivet dasar, serta detail blister sebelum paket dikirim.',
    },
    {
      q: 'Bagaimana standar proteksi packing paket?',
      a: 'Semua pesanan dibungkus menggunakan kardus ganda tebal (double-wall corrugated) dan bubble wrap berlapis tebal secara gratis tanpa biaya tambahan agar carded tidak penyok di perjalanan ekspedisi.',
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
              GARASI WORTELEMES
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <ShieldCheck className="w-3 h-3 text-blue-400" />
              Verified Collector
            </span>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
            Kurator dan kolektor diecast skala 1:64 dengan fokus pada lini RLC, Silver Series, vintage castings, dan rilisan batch modern. Melayani adopsi koleksi, tukar tambah (WTT), dan konsultasi seputar diecast.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
            <button
              onClick={handleWhatsAppChat}
              className="inline-flex items-center gap-2 bg-[#0066d6] hover:bg-blue-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Hubungi via WhatsApp</span>
            </button>
            <span className="text-xs text-gray-400 font-mono">
              Lokasi: Indonesia
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
              100% Original
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Semua casting terverifikasi keasliannya dari distributor resmi.
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
              Kardus tebal & bubble wrap gratis untuk menjaga integritas blister.
            </p>
          </div>
        </div>

        <div className="bg-[#121319] border border-white/[0.08] rounded-2xl p-4 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-white tracking-wide">
              Kirim Se-Indonesia
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
              Mendukung JNE, SiCepat, Paxel, serta opsi COD yang disepakati.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Collector FAQ Accordion */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/5">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          <h2 className="text-sm font-black uppercase text-white tracking-wide">
            Pertanyaan yang Sering Diajukan (FAQ)
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
