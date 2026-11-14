'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { Star, MessageCircle, ArrowUpRight } from 'lucide-react';
import { getStoredWhatsAppNumber, isWhatsAppOrderActive } from '@/lib/storage/profileStorage';

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
  const [isOrderActive, setIsOrderActive] = useState(false);

  useEffect(() => {
    setIsOrderActive(isWhatsAppOrderActive());
    const handleProfileUpdate = () => setIsOrderActive(isWhatsAppOrderActive());
    window.addEventListener('collector-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('collector-profile-updated', handleProfileUpdate);
  }, []);

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
    const phone = getStoredWhatsAppNumber().replace(/[^0-9]/g, '');
    if (!phone) {
      alert('Nomor kontak WhatsApp belum diatur di menu admin.');
      return;
    }
    const text = `Halo Wortelemes, saya tertarik dengan unit *${item.name}* (${item.release_year}) harga *${formatRupiah(item.sell_price)}*. Apakah masih ada?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-xl p-2.5 transition-all duration-200 select-none bg-[#12131a] hover:bg-[#161822] border border-white/[0.08] hover:border-white/20 hover:-translate-y-0.5 shadow-sm">
      {/* 1. Image Studio Stage */}
      <div className="relative w-full aspect-[16/11] rounded-lg flex items-center justify-center p-2.5 overflow-hidden bg-[#181a24] border border-white/[0.04]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300 select-none"
            unoptimized
          />
        ) : (
          <span className="text-[10px] text-gray-500 font-mono">No Image</span>
        )}

        {/* Status Indicator (Top Left) */}
        <div className="absolute top-2 left-2 z-10">
          {item.is_for_sale ? (
            <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 backdrop-blur-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Tersedia
            </span>
          ) : (
            <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-gray-400 border border-white/10 backdrop-blur-sm font-medium">
              Koleksi
            </span>
          )}
        </div>

        {/* Favorite Button (Top Right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(item.id);
          }}
          className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-md flex items-center justify-center backdrop-blur-sm transition-all ${
            item.is_favorite
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-black/50 text-gray-400 border border-white/10 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
          title="Favorit"
        >
          <Star className={`w-3 h-3 ${item.is_favorite ? 'fill-amber-400' : ''}`} />
        </button>
      </div>

      {/* 2. Car Information Body */}
      <div className="pt-2.5 pb-0.5 px-0.5 flex flex-col gap-1">
        {/* Model Title */}
        <h3 className="text-white font-semibold text-xs leading-snug tracking-tight uppercase truncate group-hover:text-amber-200 transition-colors">
          {item.name}
        </h3>

        {/* Subtle Metadata Line */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 truncate">
          <span>{item.release_year}</span>
          <span>•</span>
          <span className="text-gray-300">{item.tier_badge || '1:64'}</span>
          {item.segment_number > 0 && (
            <>
              <span>•</span>
              <span className="text-gray-400">#{item.segment_number}</span>
            </>
          )}
          {item.color && (
            <>
              <span>•</span>
              <span className="text-gray-400 truncate max-w-[60px]">{item.color}</span>
            </>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="mt-1 pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight">
              {item.is_for_sale ? formatRupiah(item.sell_price) : 'Koleksi Pribadi'}
            </span>
          </div>

          {/* Action */}
          {item.is_for_sale ? (
            isOrderActive ? (
              <button
                type="button"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[10px] font-medium transition-all active:scale-95"
                title="Tanya via WhatsApp"
              >
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                <span>Tanya</span>
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.03] text-gray-400 border border-white/[0.06] text-[10px]">
                <span>Detail</span>
                <ArrowUpRight className="w-2.5 h-2.5 text-gray-500" />
              </span>
            )
          ) : (
            <span className="text-[10px] text-gray-500 font-mono">
              Display
            </span>
          )}
        </div>

        {/* Admin Cost Tag */}
        {isAdmin && item.buy_price !== undefined && (
          <div className="flex items-center justify-between text-[10px] bg-red-950/30 px-2 py-0.5 rounded text-red-300 border border-red-900/30 mt-1">
            <span className="font-mono text-[9px] uppercase text-red-400">Modal:</span>
            <span className="font-mono font-medium">{formatRupiah(item.buy_price)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
