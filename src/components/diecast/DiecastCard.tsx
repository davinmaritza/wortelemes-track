'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { Star, MessageCircle, Minus, Plus } from 'lucide-react';

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
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleWhatsAppInquiry = () => {
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
    const text = `Halo, saya tertarik dengan koleksi Hot Wheels *${item.name}* (${item.release_year}) yang dijual seharga *${formatRupiah(item.sell_price)}*. Apakah masih available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const isRLC = item.tier_badge?.toLowerCase().includes('rlc');

  return (
    <div
      className={`relative flex flex-col justify-between bg-[#16181f] rounded-2xl border transition-all duration-200 overflow-hidden ${
        isRLC
          ? 'border-red-600/40 shadow-[0_0_15px_rgba(229,9,20,0.15)]'
          : 'border-[#242735] hover:border-[#383d52]'
      }`}
    >
      {/* Gambar Mobil (White container / highlight backdrop) */}
      <div className="relative w-full aspect-[4/3] bg-white rounded-t-2xl flex items-center justify-center p-3 overflow-hidden">
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
          <div className="text-xs text-gray-400 font-mono">No Image</div>
        )}

        {/* Status For Sale Badge */}
        {item.is_for_sale && (
          <span className="absolute top-2 left-2 bg-emerald-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            FOR SALE
          </span>
        )}
      </div>

      {/* Info Body */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
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
          <span className="bg-[#242735] text-gray-300 px-1.5 py-0.5 rounded-md">
            {item.release_year}
          </span>

          {/* Tier Badge (RLC / Silver Series / XL) */}
          {item.tier_badge && (
            <span
              className={`px-1.5 py-0.5 rounded-md ${
                isRLC
                  ? 'bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'bg-[#242735] text-gray-300'
              }`}
            >
              {item.tier_badge}
            </span>
          )}

          {/* Warna Bodi */}
          {item.color && (
            <span className="bg-[#1f222e] text-gray-400 px-1.5 py-0.5 rounded-md line-clamp-1">
              {item.color}
            </span>
          )}
        </div>

        {/* Harga Section */}
        <div className="pt-1 border-t border-[#242735]/60 flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 text-[10px]">Harga Pasaran:</span>
            <span className="font-bold text-white">
              {formatRupiah(item.sell_price)}
            </span>
          </div>

          {/* Harga Beli (Modal) HANYA TERLIHAT JIKA ADMIN */}
          {isAdmin && item.buy_price !== undefined && (
            <div className="flex items-center justify-between text-[11px] bg-red-950/30 px-1.5 py-0.5 rounded text-red-300 border border-red-900/30">
              <span className="text-[9px] uppercase font-bold text-red-400">Modal (Hide):</span>
              <span className="font-mono">{formatRupiah(item.buy_price)}</span>
            </div>
          )}
        </div>

        {/* Action Controls (Persis seperti Hot Wheels App: - ★ + / WhatsApp Order) */}
        <div className="flex items-center justify-between gap-1 mt-1 pt-1 border-t border-[#242735]/40">
          {isAdmin ? (
            <div className="flex items-center justify-between w-full bg-[#111217] p-1 rounded-lg">
              <button
                onClick={() => onUpdateQty?.(item.id, -1)}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#1f222e] text-gray-300 hover:text-white active:scale-90 transition-transform"
                title="Kurangi Stok"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onToggleFavorite?.(item.id)}
                className={`p-1 transition-colors ${
                  item.is_favorite ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
                }`}
                title="Favorit"
              >
                <Star className={`w-4 h-4 ${item.is_favorite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={() => onUpdateQty?.(item.id, 1)}
                className="w-7 h-7 flex items-center justify-center rounded bg-[#1f222e] text-gray-300 hover:text-white active:scale-90 transition-transform"
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
                  onClick={handleWhatsAppInquiry}
                  className="flex items-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all shadow-sm"
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
