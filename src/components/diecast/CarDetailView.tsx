'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { ChevronLeft, Share2, MoreHorizontal, Plus, Star, AlignLeft, MessageCircle } from 'lucide-react';

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
  onUpdateQty,
}) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleWhatsAppOrder = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const text = `Halo, saya tertarik dengan koleksi Hot Wheels *${car.name}* (${car.release_year}) seharga *${formatRupiah(car.sell_price)}*. Apakah unit ini masih ready?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0c0d10] text-white">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-[#0c0d10]/90 backdrop-blur-md border-b border-[#1f222e]">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#16181f] border border-[#242735] flex items-center justify-center text-gray-300 hover:text-white active:scale-95 transition-transform"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h2 className="text-sm font-extrabold tracking-tight uppercase max-w-[200px] sm:max-w-xs truncate text-center">
          {car.name}
        </h2>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: car.name, url: window.location.href });
              }
            }}
            className="w-9 h-9 rounded-full bg-[#16181f] border border-[#242735] flex items-center justify-center text-gray-300 hover:text-white active:scale-95 transition-transform"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#16181f] border border-[#242735] flex items-center justify-center text-gray-300 hover:text-white active:scale-95 transition-transform">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Showcase Asset (Persis screenshot 3) */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-white flex items-center justify-center p-6 overflow-hidden">
        {car.image_url ? (
          <Image
            src={car.image_url}
            alt={car.name}
            fill
            className="object-contain p-4 select-none drop-shadow-2xl"
            priority
            unoptimized
          />
        ) : (
          <span className="text-gray-400 font-mono text-xs">No Asset Available</span>
        )}

        {/* Carousel indicators */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#0066d6]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400/50" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400/50" />
        </div>
      </div>

      {/* Two-Column Specification Matrix (Persis screenshot 3) */}
      <div className="px-5 py-6 flex flex-col gap-5 max-w-lg mx-auto w-full">
        <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-left">
          {/* RELEASE YEAR */}
          <div className="border-l-2 border-[#242735] pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
              RELEASE YEAR
            </span>
            <span className="text-white text-base font-black font-mono">
              {car.release_year}
            </span>
          </div>

          {/* SEGMENT */}
          <div className="border-l-2 border-[#242735] pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
              SEGMENT
            </span>
            <span className="text-white text-sm font-extrabold">
              {car.tier_badge || 'Hot Wheels'}
            </span>
          </div>

          {/* ASSORTMENT */}
          <div className="border-l-2 border-[#242735] pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
              ASSORTMENT
            </span>
            <span className="text-white text-sm font-extrabold">
              {car.condition}
            </span>
          </div>

          {/* INDEX */}
          <div className="border-l-2 border-[#242735] pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
              INDEX
            </span>
            <span className="text-white text-base font-black font-mono">
              {car.casting_code || `${car.segment_number}/10`}
            </span>
          </div>

          {/* SERIES */}
          <div className="border-l-2 border-[#242735] pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
              SERIES
            </span>
            <span className="text-white text-sm font-extrabold flex items-center gap-1">
              Then And Now ({car.release_year}) →
            </span>
          </div>

          {/* SERIES INDEX */}
          <div className="border-l-2 border-[#242735] pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
              SERIES INDEX
            </span>
            <span className="text-white text-base font-black font-mono">
              {car.segment_number}/10
            </span>
          </div>

          {/* RARITY */}
          <div className="border-l-2 border-[#242735] pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
              RARITY / TIER
            </span>
            <span className="text-amber-400 text-sm font-extrabold">
              {car.tier_badge}
            </span>
          </div>

          {/* MAKE / COLOR */}
          <div className="border-l-2 border-[#242735] pl-3">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
              COLOR / FINISH
            </span>
            <span className="text-white text-sm font-extrabold">
              {car.color}
            </span>
          </div>
        </div>

        {/* Pricing Matrix */}
        <div className="p-4 bg-[#14151b] rounded-2xl border border-[#242735] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
              ESTIMASI HARGA PASAR
            </span>
            <span className="text-lg font-black text-white">
              {formatRupiah(car.sell_price)}
            </span>
          </div>

          {isAdmin && car.buy_price !== undefined && (
            <div className="text-right bg-red-950/40 px-3 py-1.5 rounded-xl border border-red-900/40">
              <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider block">
                MODAL (HIDE)
              </span>
              <span className="text-sm font-black font-mono text-red-300">
                {formatRupiah(car.buy_price)}
              </span>
            </div>
          )}
        </div>

        {/* Notes if available */}
        {car.notes && (
          <div className="p-3 bg-[#111217] rounded-xl border border-[#242735] text-xs text-gray-300">
            {car.notes}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Pill (Persis tombol biru di screenshot 3) */}
      <div className="sticky bottom-4 z-20 px-5 max-w-sm mx-auto w-full">
        {isAdmin ? (
          <div className="bg-[#0066d6] text-white rounded-full p-1.5 flex items-center justify-between shadow-[0_8px_30px_rgba(0,102,214,0.4)]">
            <button
              onClick={() => onUpdateQty?.(car.id, 1)}
              className="flex-1 py-2.5 flex items-center justify-center hover:bg-white/10 rounded-full active:scale-95 transition-all font-bold text-xs"
              title="Tambah ke Garasi"
            >
              <Plus className="w-5 h-5" />
            </button>
            <div className="w-[1px] h-6 bg-white/20" />
            <button
              onClick={() => onToggleFavorite?.(car.id)}
              className="flex-1 py-2.5 flex items-center justify-center hover:bg-white/10 rounded-full active:scale-95 transition-all text-xs"
              title="Tandai Favorit"
            >
              <Star className={`w-5 h-5 ${car.is_favorite ? 'fill-white' : ''}`} />
            </button>
            <div className="w-[1px] h-6 bg-white/20" />
            <button
              className="flex-1 py-2.5 flex items-center justify-center hover:bg-white/10 rounded-full active:scale-95 transition-all text-xs"
              title="Opsi Lanjutan"
            >
              <AlignLeft className="w-5 h-5" />
            </button>
          </div>
        ) : (
          car.is_for_sale && (
            <button
              onClick={handleWhatsAppOrder}
              className="w-full bg-[#0066d6] hover:bg-blue-600 text-white rounded-full py-3.5 px-6 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(0,102,214,0.4)] active:scale-95 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Beli Koleksi Ini (Chat WhatsApp)</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};
