'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CollectionItem } from '@/types/diecast';
import { ChevronLeft, Share2, MessageCircle, Star, ShieldCheck, EyeOff } from 'lucide-react';
import { getStoredWhatsAppNumber, isWhatsAppOrderActive } from '@/lib/storage/profileStorage';

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
  const [isOrderActive, setIsOrderActive] = useState(false);

  useEffect(() => {
    setIsOrderActive(isWhatsAppOrderActive());

    const handleProfileUpdate = () => {
      setIsOrderActive(isWhatsAppOrderActive());
    };

    window.addEventListener('collector-profile-updated', handleProfileUpdate);
    return () => window.removeEventListener('collector-profile-updated', handleProfileUpdate);
  }, []);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const handleWhatsAppOrder = () => {
    const phone = getStoredWhatsAppNumber().replace(/[^0-9]/g, '');
    if (!phone) {
      alert('Nomor WhatsApp belum diatur di menu admin.');
      return;
    }
    const text = `Halo Wortelemes, mau tanya unit diecast *${car.name}* (${car.release_year}, ${car.tier_badge || '1:64'}) harga *${formatRupiah(car.sell_price)}*. Apakah masih available?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0b10] text-[#ededed]">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3 bg-[#0a0b10]/90 backdrop-blur-md border-b border-white/[0.08]">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-300 hover:text-white transition-all text-xs font-medium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <h2 className="text-xs sm:text-sm font-semibold tracking-tight uppercase max-w-[200px] sm:max-w-md truncate text-center text-gray-300">
          {car.name}
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite?.(car.id)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
              car.is_favorite
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:text-white'
            }`}
            title="Favorit"
          >
            <Star className={`w-3.5 h-3.5 ${car.is_favorite ? 'fill-amber-400' : ''}`} />
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: car.name, url: window.location.href });
              }
            }}
            className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-gray-400 hover:text-white transition-all"
            title="Bagikan"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Showcase */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 pb-28 flex flex-col md:flex-row gap-8 items-start">
        {/* Left: Product Image */}
        <div className="w-full md:w-1/2 flex flex-col items-center">
          <div className="relative w-full aspect-[4/3] rounded-2xl p-6 overflow-hidden bg-[#13141c] border border-white/[0.08] flex items-center justify-center">
            {car.image_url ? (
              <Image
                src={car.image_url}
                alt={car.name}
                fill
                className="object-contain p-4 select-none"
                priority
                unoptimized
              />
            ) : (
              <span className="text-gray-500 font-mono text-xs">Belum Ada Foto</span>
            )}

            {/* Status Chip */}
            <div className="absolute top-3 left-3 z-10">
              {car.is_for_sale ? (
                <span className="inline-flex items-center gap-1.5 text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 backdrop-blur-sm font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Tersedia
                </span>
              ) : (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-black/60 text-gray-400 border border-white/10 backdrop-blur-sm font-medium">
                  Koleksi Pribadi
                </span>
              )}
            </div>

            {car.tier_badge && (
              <div className="absolute top-3 right-3 z-10">
                <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-white/[0.08] text-white border border-white/15">
                  {car.tier_badge}
                </span>
              </div>
            )}
          </div>

          <p className="mt-2.5 text-[11px] text-gray-500 text-center">
            Foto fisik asli unit garasi Wortelemes.
          </p>
        </div>

        {/* Right: Spec Matrix & Pricing */}
        <div className="w-full md:w-1/2 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs text-gray-400">
              <span>Rilis {car.release_year}</span>
              <span>•</span>
              <span>Skala {car.scale || '1:64'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-tight">
              {car.name}
            </h1>
          </div>

          {/* Clean Key-Value Spec List (No fragmented boxes) */}
          <div className="divide-y divide-white/[0.06] border-y border-white/[0.08] py-1 text-xs">
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-400">Tahun Rilis</span>
              <span className="font-medium text-white font-mono">{car.release_year}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-400">Seri / Kategori</span>
              <span className="font-medium text-white">{car.tier_badge || 'Mainline'}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-400">Kondisi Kemasan</span>
              <span className="font-medium text-white">{car.condition || 'Carded / Mint'}</span>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <span className="text-gray-400">Warna Casting</span>
              <span className="font-medium text-white">{car.color || '-'}</span>
            </div>
            {car.segment_number > 0 && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400">Nomor Seri / Segment</span>
                <span className="font-medium text-white font-mono">#{car.segment_number}</span>
              </div>
            )}
            {car.casting_code && (
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400">Kode SKU / Casting</span>
                <span className="font-mono text-gray-300">{car.casting_code}</span>
              </div>
            )}
          </div>

          {/* Pricing Info */}
          <div className="p-4 rounded-xl bg-[#13141c] border border-white/[0.08] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-0.5">
                Harga
              </span>
              <span className="text-2xl font-bold text-white tracking-tight">
                {formatRupiah(car.sell_price)}
              </span>
              <span className="block text-[11px] text-gray-400 mt-0.5">
                {car.is_for_sale ? `Stok: ${car.qty || 1} unit • Siap kirim packing aman` : 'Koleksi pribadi (tidak dijual)'}
              </span>
            </div>

            {isAdmin && car.buy_price !== undefined && (
              <div className="text-right bg-red-950/30 px-3 py-1.5 rounded-lg border border-red-900/30">
                <span className="text-[9px] text-red-400 uppercase tracking-wider block">
                  Modal (Privat)
                </span>
                <span className="text-xs font-semibold text-red-300 font-mono">
                  {formatRupiah(car.buy_price)}
                </span>
              </div>
            )}
          </div>

          {/* Action CTA */}
          <div className="fixed md:static bottom-0 left-0 right-0 p-4 md:p-0 bg-[#0a0b10]/95 md:bg-transparent backdrop-blur-md md:backdrop-blur-none border-t md:border-t-0 border-white/[0.08] z-30">
            {isOrderActive ? (
              car.is_for_sale ? (
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white rounded-xl py-3 px-6 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Tanya / Order via WhatsApp</span>
                </button>
              ) : (
                <button
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 rounded-xl py-3 px-6 font-medium text-xs flex items-center justify-center gap-2 border border-white/[0.08] transition-all"
                >
                  <MessageCircle className="w-4 h-4 text-gray-400" />
                  <span>Tanya Info Koleksi (WhatsApp)</span>
                </button>
              )
            ) : (
              <div className="w-full bg-[#13141c] border border-white/[0.08] rounded-xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 text-left w-full sm:w-auto">
                  <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-white">Pemesanan WhatsApp Sedang Nonaktif</p>
                    <p className="text-[11px] text-gray-400">Katalog saat ini hanya untuk display koleksi garasi.</p>
                  </div>
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-[10px] font-semibold text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors"
                  >
                    Buka Admin
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
