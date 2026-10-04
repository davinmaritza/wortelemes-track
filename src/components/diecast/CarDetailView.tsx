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
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 bg-[#0c0d10]/90 backdrop-blur-md border-b border-[#1f222e]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#16181f] border border-[#242735] text-gray-300 hover:text-white active:scale-95 transition-all text-xs font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Kembali ke Garasi</span>
        </button>

        <h2 className="text-sm md:text-base font-extrabold tracking-tight uppercase max-w-[220px] sm:max-w-md truncate text-center">
          {car.name}
        </h2>

        <div className="flex items-center gap-2">
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

      {/* Main Content: Responsive Split on Desktop (Asset on left, Specs on right) */}
      <div className="max-w-5xl mx-auto w-full px-4 md:px-8 py-6 pb-24 flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Showcase Asset Preview */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] bg-white rounded-3xl border border-[#242735] flex items-center justify-center p-6 overflow-hidden shadow-2xl">
            {car.image_url ? (
              <Image
                src={car.image_url}
                alt={car.name}
                fill
                className="object-contain p-4 select-none drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                priority
                unoptimized
              />
            ) : (
              <span className="text-gray-400 font-mono text-xs">No Asset Available</span>
            )}

            {/* Carousel dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0066d6]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400/50" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400/50" />
            </div>
          </div>
        </div>

        {/* Right: Technical Spec Matrix & Pricing */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
              {car.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Diecast Scale {car.scale || '1:64'} • Rilis Batch {car.release_year}
            </p>
          </div>

          {/* Specification Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-[#14151b] p-5 rounded-2xl border border-[#242735]">
            <div className="border-l-2 border-[#242735] pl-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                RELEASE YEAR
              </span>
              <span className="text-white text-base font-black font-mono">
                {car.release_year}
              </span>
            </div>

            <div className="border-l-2 border-[#242735] pl-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                SEGMENT
              </span>
              <span className="text-white text-sm font-extrabold">
                {car.tier_badge || 'Hot Wheels'}
              </span>
            </div>

            <div className="border-l-2 border-[#242735] pl-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                ASSORTMENT
              </span>
              <span className="text-white text-sm font-extrabold">
                {car.condition}
              </span>
            </div>

            <div className="border-l-2 border-[#242735] pl-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                INDEX
              </span>
              <span className="text-white text-base font-black font-mono">
                {car.casting_code || `${car.segment_number}/10`}
              </span>
            </div>

            <div className="border-l-2 border-[#242735] pl-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                SERIES
              </span>
              <span className="text-white text-sm font-extrabold">
                Then And Now ({car.release_year})
              </span>
            </div>

            <div className="border-l-2 border-[#242735] pl-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                SERIES INDEX
              </span>
              <span className="text-white text-base font-black font-mono">
                {car.segment_number}/10
              </span>
            </div>

            <div className="border-l-2 border-[#242735] pl-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                RARITY / TIER
              </span>
              <span className="text-amber-400 text-sm font-extrabold">
                {car.tier_badge}
              </span>
            </div>

            <div className="border-l-2 border-[#242735] pl-3">
              <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold block mb-1">
                COLOR / FINISH
              </span>
              <span className="text-white text-sm font-extrabold">
                {car.color}
              </span>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="p-4 bg-[#14151b] rounded-2xl border border-[#242735] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                ESTIMASI HARGA PASAR
              </span>
              <span className="text-xl font-black text-white">
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

          {/* Action Button: Sticky Bottom Bar on Mobile, Inline on Desktop */}
          <div className="fixed md:static bottom-0 left-0 right-0 p-4 md:p-0 bg-[#0c0d10]/95 md:bg-transparent backdrop-blur-lg md:backdrop-blur-none border-t md:border-t-0 border-[#1f222e] z-30">
            {isAdmin ? (
              <div className="bg-[#0066d6] text-white rounded-full p-2 flex items-center justify-between shadow-[0_8px_30px_rgba(0,102,214,0.4)] max-w-md mx-auto">
                <button
                  onClick={() => onUpdateQty?.(car.id, 1)}
                  className="flex-1 py-2.5 flex items-center justify-center hover:bg-white/10 rounded-full active:scale-95 transition-all font-bold text-xs"
                  title="Tambah Stok"
                >
                  <Plus className="w-5 h-5 mr-1" />
                  Tambah Stok
                </button>
                <div className="w-[1px] h-6 bg-white/20" />
                <button
                  onClick={() => onToggleFavorite?.(car.id)}
                  className="flex-1 py-2.5 flex items-center justify-center hover:bg-white/10 rounded-full active:scale-95 transition-all text-xs font-bold"
                  title="Favorit"
                >
                  <Star className={`w-5 h-5 mr-1 ${car.is_favorite ? 'fill-white' : ''}`} />
                  Favorit
                </button>
              </div>
            ) : (
              car.is_for_sale && (
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full max-w-md mx-auto bg-[#0066d6] hover:bg-blue-600 text-white rounded-full py-3.5 px-6 font-bold text-sm flex items-center justify-center gap-2 shadow-[0_8px_30px_rgba(0,102,214,0.4)] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Beli Koleksi Ini (Chat WhatsApp)</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
