'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { ChevronLeft, Share2, MessageCircle, Star, ShieldCheck } from 'lucide-react';
import { getStoredWhatsAppNumber } from '@/lib/storage/profileStorage';

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
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleWhatsAppOrder = () => {
    const phone = getStoredWhatsAppNumber().replace(/[^0-9]/g, '') || '6281234567890';
    const text = `Hi Wortelemes, I'm interested in your diecast collection *${car.name}* (${car.release_year}, ${car.tier_badge || '1:64'}) listed at *${formatRupiah(car.sell_price)}*. Is this unit still available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#090a0f] text-[#ededed]">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 bg-[#090a0f]/85 backdrop-blur-xl border-b border-white/[0.06]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-300 hover:text-white transition-all text-xs font-semibold"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Garage Catalog</span>
        </button>

        <h2 className="text-xs sm:text-sm font-bold tracking-tight uppercase max-w-[200px] sm:max-w-md truncate text-center text-gray-300 font-mono">
          {car.name}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite?.(car.id)}
            className={`w-8 h-8 rounded-xl flex items-center justify-center border transition-all ${
              car.is_favorite
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white'
            }`}
            title="Favorite"
          >
            <Star className={`w-3.5 h-3.5 ${car.is_favorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: car.name, url: window.location.href });
              }
            }}
            className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 pb-32 flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Physical Studio Canvas */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] rounded-3xl p-6 overflow-hidden bg-[#111219] border border-white/[0.08] shadow-2xl flex items-center justify-center">
            {car.image_url ? (
              <Image
                src={car.image_url}
                alt={car.name}
                fill
                className="object-contain p-6 select-none drop-shadow-xl"
                priority
                unoptimized
              />
            ) : (
              <span className="text-gray-500 font-mono text-xs">No Photo Available</span>
            )}

            {/* Status Chip */}
            <div className="absolute top-4 left-4 z-10">
              {car.is_for_sale ? (
                <span className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-800/40 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Available For Sale
                </span>
              ) : (
                <span className="text-[9px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-gray-400 border border-white/10 backdrop-blur-md">
                  Private Collection
                </span>
              )}
            </div>

            {car.tier_badge && (
              <div className="absolute top-4 right-4 z-10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/[0.08] text-white border border-white/15">
                  {car.tier_badge}
                </span>
              </div>
            )}
          </div>

          {/* Authentic Guarantee pill */}
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400 bg-white/[0.03] border border-white/[0.06] px-4 py-2 rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>100% Genuine Factory Release • Tamper-Evident Packaging</span>
          </div>
        </div>

        {/* Right: Technical Spec Matrix & Pricing */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-xs font-mono text-gray-400">
              <span>Batch #{car.release_year}</span>
              <span>•</span>
              <span>Scale {car.scale || '1:64'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight font-sans">
              {car.name}
            </h1>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Curator-graded casting. Blister and card integrity: {car.condition}.
            </p>
          </div>

          {/* Specification Matrix */}
          <div className="grid grid-cols-2 gap-2.5 bg-[#111219] p-4 sm:p-5 rounded-2xl border border-white/[0.06]">
            <div className="bg-[#151620] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-0.5">
                Release Year
              </span>
              <span className="text-white text-sm font-bold font-mono">
                {car.release_year}
              </span>
            </div>

            <div className="bg-[#151620] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-0.5">
                Series / Tier
              </span>
              <span className="text-white text-sm font-semibold truncate block">
                {car.tier_badge || 'Mainline'}
              </span>
            </div>

            <div className="bg-[#151620] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-0.5">
                Condition Grade
              </span>
              <span className="text-white text-sm font-semibold truncate block">
                {car.condition}
              </span>
            </div>

            <div className="bg-[#151620] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-0.5">
                Segment Index
              </span>
              <span className="text-white text-sm font-bold font-mono">
                {car.segment_number ? `#${car.segment_number}` : 'N/A'}
              </span>
            </div>

            <div className="bg-[#151620] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-0.5">
                Colorway
              </span>
              <span className="text-white text-sm font-semibold truncate block">
                {car.color}
              </span>
            </div>

            <div className="bg-[#151620] p-3 rounded-xl border border-white/[0.04]">
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono block mb-0.5">
                SKU / Code
              </span>
              <span className="text-white text-sm font-bold font-mono">
                {car.casting_code || 'STANDARD'}
              </span>
            </div>
          </div>

          {/* Pricing Info Card */}
          <div className="p-5 bg-[#111219] rounded-2xl border border-white/[0.08] flex items-center justify-between shadow-lg">
            <div>
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-widest block mb-0.5">
                Market Evaluation Price
              </span>
              <span className="text-2xl font-black text-white font-mono tracking-tight">
                {formatRupiah(car.sell_price)}
              </span>
              <span className="block text-[11px] text-gray-400 mt-0.5">
                {car.is_for_sale ? 'Available for secure courier delivery' : 'Private vault display unit'}
              </span>
            </div>

            {isAdmin && car.buy_price !== undefined && (
              <div className="text-right bg-red-950/40 px-3.5 py-2 rounded-xl border border-red-900/30">
                <span className="text-[9px] text-red-400 font-mono uppercase tracking-wider block">
                  Cost (Private)
                </span>
                <span className="text-sm font-bold font-mono text-red-300">
                  {formatRupiah(car.buy_price)}
                </span>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="fixed md:static bottom-0 left-0 right-0 p-4 md:p-0 bg-[#090a0f]/95 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none border-t md:border-t-0 border-white/[0.08] z-30">
            {car.is_for_sale ? (
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-xl py-3.5 px-6 font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via Direct WhatsApp</span>
              </button>
            ) : (
              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 rounded-xl py-3.5 px-6 font-semibold text-xs flex items-center justify-center gap-2 border border-white/[0.08] transition-all"
              >
                <MessageCircle className="w-4 h-4 text-gray-400" />
                <span>Inquire Trade or Vault Acquisition (WhatsApp)</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
