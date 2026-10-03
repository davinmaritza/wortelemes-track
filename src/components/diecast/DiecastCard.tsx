'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { Star, MessageCircle, Minus, Plus } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';

interface DiecastCardProps {
  item: CollectionItem;
  isAdmin: boolean;
  onUpdateQty?: (id: string, delta: number) => void;
  onToggleFavorite?: (id: string) => void;
}

export const DiecastCard: React.FC<DiecastCardProps> = ({
  item,
  isAdmin,
  onUpdateQty,
  onToggleFavorite,
}) => {
  const shouldReduceMotion = useReducedMotion();

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleWhatsAppInquiry = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const text = `Halo, saya tertarik dengan koleksi Hot Wheels *${item.name}* (${item.release_year}) seharga *${formatRupiah(item.sell_price)}*. Apakah masih available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const isRLC = item.tier_badge?.toLowerCase().includes('rlc');

  return (
    <div
      className={`relative flex flex-col justify-between bg-[#14151b] rounded-2xl border transition-all duration-200 overflow-hidden active:scale-[0.99] ${
        isRLC
          ? 'border-red-600/40 shadow-[0_4px_20px_rgba(229,9,20,0.12)]'
          : 'border-[#222533] hover:border-[#35394d]'
      }`}
    >
      {/* Container Foto Mobil (Contrast white backdrop rounded inner) */}
      <div className="relative w-full aspect-[4/3] bg-white rounded-t-2xl flex items-center justify-center p-2.5 overflow-hidden">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, 280px"
            className="object-contain p-2 hover:scale-105 transition-transform duration-300 select-none"
            unoptimized
          />
        ) : (
          <span className="text-[11px] text-gray-400 font-mono">No Image</span>
        )}

        {/* Status For Sale Badge */}
        {item.is_for_sale && (
          <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide">
            FOR SALE
          </span>
        )}
      </div>

      {/* Info Body */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2.5">
        {/* Title */}
        <h3 className="text-white font-extrabold text-[13px] tracking-tight uppercase line-clamp-1">
          {item.name}
        </h3>

        {/* Badges Bar (Persis seperti Hot Wheels Showcase App) */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
          {/* Index Bulat Biru */}
          <span className="w-4 h-4 rounded-full bg-[#0066d6] text-white flex items-center justify-center text-[9px] font-black shrink-0">
            {item.segment_number || 1}
          </span>

          {/* Tahun Rilis */}
          <span className="bg-[#1f222e] text-gray-300 px-1.5 py-0.5 rounded-md">
            {item.release_year}
          </span>

          {/* Tier Badge (RLC / Silver Series / XL) */}
          {item.tier_badge && (
            <span
              className={`px-1.5 py-0.5 rounded-md ${
                isRLC
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'bg-[#1f222e] text-gray-300'
              }`}
            >
              {item.tier_badge}
            </span>
          )}

          {/* Warna Bodi */}
          {item.color && (
            <span className="bg-[#191b24] text-gray-400 px-1.5 py-0.5 rounded-md line-clamp-1">
              {item.color}
            </span>
          )}
        </div>

        {/* Harga Section */}
        <div className="pt-1.5 border-t border-[#222533] flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Harga Pasar:</span>
            <span className="font-extrabold text-white">
              {formatRupiah(item.sell_price)}
            </span>
          </div>

          {/* Modal Beli: HANYA TAMPIL KETIKA ADMIN */}
          {isAdmin && item.buy_price !== undefined && (
            <div className="flex items-center justify-between text-[11px] bg-red-950/30 px-2 py-0.5 rounded text-red-300 border border-red-900/30">
              <span className="text-[9px] uppercase font-bold text-red-400">Modal (Hide):</span>
              <span className="font-mono font-bold">{formatRupiah(item.buy_price)}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-1 pt-1 border-t border-[#222533]/60">
          {isAdmin ? (
            <div className="flex items-center justify-between w-full bg-[#0e0f14] p-1 rounded-xl border border-[#222533]">
              <button
                type="button"
                onClick={() => onUpdateQty?.(item.id, -1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1d26] text-gray-300 hover:text-white active:scale-90 transition-transform"
                title="Kurangi Stok"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onToggleFavorite?.(item.id)}
                className={`p-1 transition-colors ${
                  item.is_favorite ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
                }`}
                title="Favorit"
              >
                <Star className={`w-4 h-4 ${item.is_favorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => onUpdateQty?.(item.id, 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#1a1d26] text-gray-300 hover:text-white active:scale-90 transition-transform"
                title="Tambah Stok"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="text-[11px] text-gray-400 font-mono">
                Stok: <span className="text-white font-bold">{item.qty}</span>
              </div>

              {item.is_for_sale && (
                <button
                  type="button"
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl active:scale-95 transition-all shadow"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat WA
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
