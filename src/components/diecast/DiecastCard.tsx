'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { Star, Minus, Plus, AlignLeft } from 'lucide-react';

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
  const isRLC = item.tier_badge?.toUpperCase().includes('RLC');

  return (
    <div
      className={`relative flex flex-col justify-between rounded-[20px] bg-[#121318] p-2 transition-all duration-200 select-none group hover:-translate-y-0.5 ${
        isRLC
          ? 'border border-[#75161c] shadow-[0_4px_24px_rgba(229,9,20,0.18)] hover:border-red-500/50'
          : 'border border-[#20222a] hover:border-[#353846]'
      }`}
    >
      {/* 1. Image Thumbnail Canvas */}
      <div
        className={`relative w-full aspect-[16/11] rounded-[14px] flex items-center justify-center p-2 overflow-hidden ${
          isRLC
            ? 'bg-gradient-to-b from-[#1e1b1c] to-[#0c0d10]'
            : 'bg-[#ffffff]'
        }`}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
            className="object-contain p-1.5 group-hover:scale-105 transition-transform duration-300 select-none"
            unoptimized
          />
        ) : (
          <span className="text-[10px] text-gray-500 font-mono">No Image</span>
        )}
      </div>

      {/* 2. Car Information Body (100% Persis Screenshot Asli) */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col gap-1.5">
        {/* Model Name */}
        <h3 className="text-white font-extrabold text-[12.5px] tracking-tight uppercase truncate">
          {item.name}
        </h3>

        {/* Badge Bar: Bulat Biru [1] | Tahun [2026] | Tier Badge [RLC] | Warna */}
        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-semibold">
          {/* Bulat Biru Segment Index */}
          <span className="w-4 h-4 rounded-full bg-[#0066d6] text-white flex items-center justify-center text-[8.5px] font-black shrink-0">
            {item.segment_number || 1}
          </span>

          {/* Tahun Rilis */}
          <span className="bg-[#21242e] text-gray-300 px-2 py-0.5 rounded text-[10px]">
            {item.release_year}
          </span>

          {/* Tier Badge */}
          {item.tier_badge && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isRLC
                  ? 'bg-[#e50914] text-white'
                  : 'bg-[#21242e] text-gray-300'
              }`}
            >
              {item.tier_badge}
            </span>
          )}

          {/* Warna Bodi */}
          {item.color && (
            <span className="bg-[#1b1c23] text-gray-400 px-2 py-0.5 rounded text-[10px] truncate max-w-[85px]">
              {item.color}
            </span>
          )}
        </div>

        {/* Modal Beli (Hanya jika admin login) */}
        {isAdmin && item.buy_price !== undefined && (
          <div className="flex items-center justify-between text-[10px] bg-red-950/40 px-2 py-0.5 rounded text-red-300 border border-red-900/30 mt-0.5">
            <span className="font-bold text-red-400 text-[9px] uppercase">Modal:</span>
            <span className="font-mono font-bold">Rp {item.buy_price.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>

      {/* 3. Bottom Action Controls Bar: [ - / + ] [ ★ ] [ ≡ ] (Persis screenshot) */}
      <div className="mt-1 pt-1.5 border-t border-[#1f2129] flex items-center justify-between px-1 text-gray-400">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateQty?.(item.id, -1);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 hover:text-white transition-colors"
          title="Kurang"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id);
          }}
          className={`w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors ${
            item.is_favorite ? 'text-amber-400' : 'text-gray-500 hover:text-gray-300'
          }`}
          title="Favorit"
        >
          <Star className={`w-3.5 h-3.5 ${item.is_favorite ? 'fill-amber-400' : ''}`} />
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (item.is_for_sale) {
              const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6281234567890';
              const text = `Halo, saya tertarik dengan koleksi Hot Wheels ${item.name} (${item.release_year}). Apakah masih ready?`;
              window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
            }
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5 hover:text-white transition-colors"
          title="Opsi / Order WA"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
