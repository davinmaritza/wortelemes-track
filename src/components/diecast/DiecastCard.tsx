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
      className={`relative flex flex-col justify-between rounded-[20px] bg-[#121318] p-2 transition-all duration-150 select-none ${
        isRLC
          ? 'border border-[#75161c] shadow-[0_0_20px_rgba(229,9,20,0.15)]'
          : 'border border-[#20222a] hover:border-[#323644]'
      }`}
    >
      {/* 1. Image Thumbnail Canvas (Dark for RLC, Clean White for Mainline / Silver Series) */}
      <div
        className={`relative w-full aspect-[16/11] rounded-[14px] flex items-center justify-center p-2 overflow-hidden ${
          isRLC
            ? 'bg-gradient-to-b from-[#1c191a] to-[#0c0d10]'
            : 'bg-[#ffffff]'
        }`}
      >
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, 220px"
            className="object-contain p-1.5 hover:scale-105 transition-transform duration-200 select-none"
            unoptimized
          />
        ) : (
          <span className="text-[10px] text-gray-500 font-mono">No Image</span>
        )}
      </div>

      {/* 2. Car Information Body */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col gap-1.5">
        {/* Model Name */}
        <h3 className="text-white font-extrabold text-[12px] tracking-tight uppercase truncate">
          {item.name}
        </h3>

        {/* Badge Bar: Bulat Biru | Tahun | Tier Badge | Warna */}
        <div className="flex flex-wrap items-center gap-1 text-[10px] font-semibold">
          {/* Bulat Biru Segment Index */}
          <span className="w-3.5 h-3.5 rounded-full bg-[#0066d6] text-white flex items-center justify-center text-[8px] font-black shrink-0">
            {item.segment_number || 1}
          </span>

          {/* Tahun Rilis */}
          <span className="bg-[#21242e] text-gray-300 px-1.5 py-0.5 rounded text-[9.5px]">
            {item.release_year}
          </span>

          {/* Tier Badge (RLC merah menyala / Silver Series / XL) */}
          {item.tier_badge && (
            <span
              className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold ${
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
            <span className="bg-[#1b1c23] text-gray-400 px-1.5 py-0.5 rounded text-[9.5px] truncate max-w-[70px]">
              {item.color}
            </span>
          )}
        </div>

        {/* Harga Pasar (Tampil halus untuk publik) */}
        {item.sell_price > 0 && (
          <div className="flex items-center justify-between text-[11px] pt-1 text-gray-400">
            <span>Harga:</span>
            <span className="font-extrabold text-white">
              Rp {item.sell_price.toLocaleString('id-ID')}
            </span>
          </div>
        )}

        {/* Modal Beli (Khusus Admin) */}
        {isAdmin && item.buy_price !== undefined && (
          <div className="flex items-center justify-between text-[10px] bg-red-950/40 px-1.5 py-0.5 rounded text-red-300 border border-red-900/30">
            <span>Modal:</span>
            <span className="font-mono">Rp {item.buy_price.toLocaleString('id-ID')}</span>
          </div>
        )}
      </div>

      {/* 3. Bottom Action Controls Bar: [ - / + ] [ ★ ] [ ≡ ] (Persis screenshot) */}
      <div className="mt-1 pt-1.5 border-t border-[#1f2129] flex items-center justify-between px-0.5 text-gray-400">
        {/* Tombol Min / Plus */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onUpdateQty?.(item.id, -1);
          }}
          className="w-6 h-6 flex items-center justify-center rounded hover:text-white transition-colors"
          title="Kurang"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>

        {/* Tombol Star Favorite */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id);
          }}
          className={`w-6 h-6 flex items-center justify-center rounded hover:text-white transition-colors ${
            item.is_favorite ? 'text-amber-400' : 'text-gray-500'
          }`}
          title="Favorit"
        >
          <Star className={`w-3.5 h-3.5 ${item.is_favorite ? 'fill-amber-400' : ''}`} />
        </button>

        {/* Tombol Menu Opsi / WA */}
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
          className="w-6 h-6 flex items-center justify-center rounded hover:text-white transition-colors"
          title="Opsi / Order"
        >
          <AlignLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
