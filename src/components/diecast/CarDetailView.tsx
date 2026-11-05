'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { ChevronLeft, Share2, MessageCircle, Star, Sparkles, ShieldCheck } from 'lucide-react';

interface CarDetailViewProps {
  car: CollectionItem;
  isAdmin: boolean;
  onBack: () => void;
  onToggleFavorite?: (id: string) => void;
  onUpdateQty?: (id: string, delta: number) => void;
}

export const CarDetailView: React.FC<CarDetailViewProps> = ({
  car,
  isAdmin,
  onBack,
  onToggleFavorite,
}) => {
  const isRLC = car.tier_badge?.toUpperCase().includes('RLC');
  const isSTH = car.tier_badge?.toUpperCase().includes('TREASURE') || car.tier_badge?.toUpperCase().includes('STH');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleWhatsAppOrder = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const text = `Halo Wortelemes, saya tertarik dengan koleksi diecast *${car.name}* (${car.release_year}, ${car.tier_badge || '1:64'}) seharga *${formatRupiah(car.sell_price)}*. Apakah unit ini masih ready?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090a0d] text-white">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3.5 bg-[#090a0d]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white active:scale-95 transition-all text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali ke Garasi</span>
        </button>

        <h2 className="text-xs sm:text-sm font-extrabold tracking-tight uppercase max-w-[200px] sm:max-w-md truncate text-center text-gray-300">
          {car.name}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite?.(car.id)}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
              car.is_favorite
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                : 'bg-white/[0.06] border-white/10 text-gray-400 hover:text-white'
            }`}
            title="Favorit"
          >
            <Star className={`w-4 h-4 ${car.is_favorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: car.name, url: window.location.href });
              }
            }}
            className="w-9 h-9 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-gray-400 hover:text-white active:scale-95 transition-all"
            title="Bagikan"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-8 pb-32 flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Showcase Asset Preview Podium */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div
            className={`relative w-full aspect-[4/3] rounded-3xl p-6 overflow-hidden shadow-2xl flex items-center justify-center ${
              isRLC
                ? 'bg-gradient-to-b from-[#241518] via-[#151012] to-[#0c0d10] border border-red-500/30 shadow-red-950/20'
                : isSTH
                ? 'bg-gradient-to-b from-[#251c13] via-[#15120e] to-[#0c0d10] border border-amber-500/30 shadow-amber-950/20'
                : 'bg-gradient-to-b from-[#181a24] via-[#101117] to-[#0a0a0f] border border-white/10 shadow-black/80'
            }`}
          >
            {/* Subtle Spotlight radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.08),transparent_65%)] pointer-events-none" />

            {car.image_url ? (
              <Image
                src={car.image_url}
                alt={car.name}
                fill
                className="object-contain p-6 select-none drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500"
                priority
                unoptimized
              />
            ) : (
              <span className="text-gray-500 font-mono text-xs">No Asset Available</span>
            )}

            {/* Floating Top Badges */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              {car.is_for_sale ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Available For Sale
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-black/60 text-gray-400 border border-white/10 backdrop-blur-md">
                  Koleksi Pribadi
                </span>
              )}
            </div>

            {car.tier_badge && (
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                    isRLC
                      ? 'bg-red-600 text-white shadow-lg shadow-red-900/40'
                      : isSTH
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-900/40'
                      : 'bg-white/15 text-white border border-white/20'
                  }`}
                >
                  {car.tier_badge}
                </span>
              </div>
            )}
          </div>

          {/* Authentic Guarantee pill */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-full">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>100% Diecast Original & Terverifikasi Fisik</span>
          </div>
        </div>

        {/* Right: Technical Spec Matrix & Pricing */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#0066d6] uppercase tracking-wider">
                Batch #{car.release_year}
              </span>
              <span className="text-gray-600">•</span>
              <span className="text-xs font-mono text-gray-400">
                Skala {car.scale || '1:64'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
              {car.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Koleksi diecast premium terawat dengan presisi detail tinggi, kondisi {car.condition}.
            </p>
          </div>

          {/* Specification Matrix */}
          <div className="grid grid-cols-2 gap-3 bg-[#111218] p-4 sm:p-5 rounded-2xl border border-white/[0.08]">
            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-0.5">
                Tahun Rilis
              </span>
              <span className="text-white text-sm font-black font-mono">
                {car.release_year}
              </span>
            </div>

            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-0.5">
                Tier / Kategori
              </span>
              <span className="text-white text-sm font-extrabold truncate block">
                {car.tier_badge || 'Mainline'}
              </span>
            </div>

            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-0.5">
                Kondisi Card / Fisik
              </span>
              <span className="text-white text-sm font-extrabold truncate block">
                {car.condition}
              </span>
            </div>

            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-0.5">
                Nomor Segmen
              </span>
              <span className="text-white text-sm font-black font-mono">
                {car.segment_number ? `#${car.segment_number}` : 'N/A'}
              </span>
            </div>

            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-0.5">
                Warna Bodi
              </span>
              <span className="text-white text-sm font-extrabold truncate block">
                {car.color}
              </span>
            </div>

            <div className="bg-white/[0.02] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold block mb-0.5">
                Kode Casting / SKU
              </span>
              <span className="text-white text-sm font-black font-mono">
                {car.casting_code || 'STANDARD'}
              </span>
            </div>
          </div>

          {/* Pricing Info Card */}
          <div className="p-5 bg-gradient-to-r from-[#12141c] to-[#151722] rounded-2xl border border-white/10 flex items-center justify-between shadow-xl">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block mb-0.5">
                ESTIMASI HARGA PASARAN
              </span>
              <span className="text-2xl font-black text-white font-mono">
                {formatRupiah(car.sell_price)}
              </span>
              <span className="block text-[10px] text-gray-400 mt-0.5">
                {car.is_for_sale ? 'Siap kirim ke seluruh Indonesia' : 'Unit koleksi display'}
              </span>
            </div>

            {isAdmin && car.buy_price !== undefined && (
              <div className="text-right bg-red-950/60 px-3.5 py-2 rounded-xl border border-red-800/40">
                <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider block">
                  MODAL RAHASIA (HIDE)
                </span>
                <span className="text-sm font-black font-mono text-red-300">
                  {formatRupiah(car.buy_price)}
                </span>
              </div>
            )}
          </div>

          {/* Action CTA: Sticky on Mobile, Inline on Desktop */}
          <div className="fixed md:static bottom-0 left-0 right-0 p-4 md:p-0 bg-[#090a0d]/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t md:border-t-0 border-white/10 z-30">
            {car.is_for_sale ? (
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-[#0066d6] hover:bg-blue-600 active:scale-[0.98] text-white rounded-full py-4 px-6 font-black text-sm flex items-center justify-center gap-2.5 shadow-[0_10px_35px_rgba(0,102,214,0.4)] transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Beli Koleksi Ini (Chat WhatsApp)</span>
              </button>
            ) : (
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-white/[0.08] hover:bg-white/15 text-gray-300 rounded-full py-4 px-6 font-bold text-xs flex items-center justify-center gap-2 border border-white/10 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Tanya Ketersediaan / Titip Model (WhatsApp)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
