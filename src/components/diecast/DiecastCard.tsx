'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { Star, MessageCircle, Eye } from 'lucide-react';

interface DiecastCardProps {
  item: CollectionItem;
  isAdmin: boolean;
  onUpdateQty?: (id: string, delta: number) => void;
  onToggleFavorite?: (id: string) => void;
}

export const DiecastCard: React.FC<DiecastCardProps> = ({
  item,
  isAdmin,
  onToggleFavorite,
}) => {
  const isRLC = item.tier_badge?.toUpperCase().includes('RLC');
  const isSTH = item.tier_badge?.toUpperCase().includes('TREASURE') || item.tier_badge?.toUpperCase().includes('STH');

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const text = `Halo Wortelemes, saya tertarik dengan koleksi diecast *${item.name}* (${item.release_year}) seharga *${formatRupiah(item.sell_price)}*. Apakah unit ini masih ready?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl p-2.5 transition-all duration-300 select-none bg-[#121319] hover:-translate-y-1 shadow-lg hover:shadow-2xl ${
        isRLC
          ? 'border border-red-500/30 hover:border-red-500/70 hover:shadow-red-950/30'
          : isSTH
          ? 'border border-amber-500/30 hover:border-amber-500/70 hover:shadow-amber-950/30'
          : 'border border-white/[0.08] hover:border-[#0066d6]/60 hover:shadow-blue-950/20'
      }`}
    >
      {/* 1. Image Podium Canvas */}
      <div
        className={`relative w-full aspect-[16/11] rounded-xl flex items-center justify-center p-2.5 overflow-hidden transition-colors ${
          isRLC
            ? 'bg-gradient-to-b from-[#241517] to-[#120f11] border border-red-500/10'
            : isSTH
            ? 'bg-gradient-to-b from-[#231b12] to-[#12100d] border border-amber-500/10'
            : 'bg-gradient-to-b from-[#1a1c24] to-[#101116] border border-white/[0.04]'
        }`}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 select-none drop-shadow-md"
            unoptimized
          />
        ) : (
          <span className="text-[10px] text-gray-500 font-mono">No Image</span>
        )}

        {/* Status Chip (Top Left) */}
        <div className="absolute top-2 left-2 z-10">
          {item.is_for_sale ? (
            <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              For Sale
            </span>
          ) : (
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/50 text-gray-400 border border-white/10 backdrop-blur-md">
              Koleksi
            </span>
          )}
        </div>

        {/* Favorite Quick Button (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id);
          }}
          className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            item.is_favorite
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 scale-100'
              : 'bg-black/40 text-gray-400 border border-white/10 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          title="Tandai Favorit"
        >
          <Star className={`w-3 h-3 ${item.is_favorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* 2. Car Information Body */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col gap-1.5">
        {/* Model Name */}
        <h3 className="text-white font-extrabold text-[12.5px] leading-tight tracking-tight uppercase truncate group-hover:text-blue-300 transition-colors">
          {item.name}
        </h3>

        {/* Metadata Badges Bar */}
        <div className="flex flex-wrap items-center gap-1 text-[10px]">
          {/* Segment Index */}
          <span className="w-4 h-4 rounded-full bg-[#0066d6] text-white flex items-center justify-center text-[8.5px] font-black shrink-0">
            {item.segment_number || 1}
          </span>

          {/* Release Year */}
          <span className="bg-white/[0.06] text-gray-300 px-1.5 py-0.5 rounded text-[9.5px] font-mono">
            {item.release_year}
          </span>

          {/* Tier Badge */}
          {item.tier_badge && (
            <span
              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
                isRLC
                  ? 'bg-red-950/80 text-red-300 border border-red-800/40'
                  : isSTH
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/40'
                  : 'bg-white/[0.06] text-gray-300'
              }`}
            >
              {item.tier_badge}
            </span>
          )}

          {/* Color Finish */}
          {item.color && (
            <span className="bg-white/[0.04] text-gray-400 px-1.5 py-0.5 rounded text-[9.5px] truncate max-w-[80px]">
              {item.color}
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-1 pt-1.5 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8.5px] font-bold text-gray-400 uppercase tracking-wider">
              {item.is_for_sale ? 'Harga Pasaran' : 'Status'}
            </span>
            <span className="text-xs font-black text-white font-mono">
              {item.is_for_sale ? formatRupiah(item.sell_price) : 'NFS'}
            </span>
          </div>

          {/* CTA / Detail Action */}
          {item.is_for_sale ? (
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[10px] font-black tracking-wide transition-all active:scale-95"
              title="Pesan via WhatsApp"
            >
              <MessageCircle className="w-3 h-3" />
              <span>Beli</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400 font-semibold">
              <Eye className="w-3 h-3" />
              <span>Detail</span>
            </span>
          )}
        </div>

        {/* Modal Beli (Hanya jika admin login) */}
        {isAdmin && item.buy_price !== undefined && (
          <div className="flex items-center justify-between text-[10px] bg-red-950/50 px-2 py-0.5 rounded text-red-300 border border-red-900/40 mt-0.5">
            <span className="font-bold text-red-400 text-[9px] uppercase">Modal:</span>
            <span className="font-mono font-bold">{formatRupiah(item.buy_price)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
