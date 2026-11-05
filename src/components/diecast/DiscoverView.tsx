'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { Search, Flame, Sparkles, Trophy, ShoppingBag } from 'lucide-react';
import { DiecastCard } from './DiecastCard';

interface DiscoverViewProps {
  cars: CollectionItem[];
  isAdmin: boolean;
  onSelectCar: (car: CollectionItem) => void;
  onUpdateQty?: (id: string, delta: number) => void;
  onToggleFavorite?: (id: string) => void;
}

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  cars,
  isAdmin,
  onSelectCar,
  onUpdateQty,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'rlc' | 'sth' | 'forsale'>('all');

  // Filter cars based on search and active chip
  const filteredCars = cars.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.tier_badge.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeCategory === 'rlc') return c.tier_badge?.toUpperCase().includes('RLC');
    if (activeCategory === 'sth') return c.tier_badge?.toUpperCase().includes('TREASURE') || c.tier_badge?.toUpperCase().includes('STH');
    if (activeCategory === 'forsale') return c.is_for_sale;

    return true;
  });

  const rlcCars = cars.filter((c) => c.tier_badge?.toUpperCase().includes('RLC'));
  const sthCars = cars.filter((c) => c.tier_badge?.toUpperCase().includes('TREASURE') || c.tier_badge?.toUpperCase().includes('STH'));
  const forSaleCars = cars.filter((c) => c.is_for_sale);
  const spotlightCar = rlcCars[0] || cars[0];

  return (
    <div className="flex flex-col gap-6 pb-12 w-full">
      {/* 1. Header Discover */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Curated Showcase
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
            DISCOVER DIECAST
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Jelajahi rilisan casting terlangka, koleksi Red Line Club, dan unit yang siap diadopsi.
          </p>
        </div>

        {/* Live Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-[#0066d6] text-white shadow'
                : 'bg-white/[0.06] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            Semua ({cars.length})
          </button>
          <button
            onClick={() => setActiveCategory('rlc')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
              activeCategory === 'rlc'
                ? 'bg-red-600 text-white shadow'
                : 'bg-white/[0.06] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            RLC Vault ({rlcCars.length})
          </button>
          <button
            onClick={() => setActiveCategory('sth')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
              activeCategory === 'sth'
                ? 'bg-amber-600 text-white shadow'
                : 'bg-white/[0.06] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            STH / Rare ({sthCars.length})
          </button>
          <button
            onClick={() => setActiveCategory('forsale')}
            className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
              activeCategory === 'forsale'
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white/[0.06] text-gray-400 hover:text-white border border-white/5'
            }`}
          >
            For Sale ({forSaleCars.length})
          </button>
        </div>
      </div>

      {/* 2. Interactive Search Box */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari berdasarkan model (Porsche, BMW, Mustang), seri, atau warna..."
          className="w-full bg-[#121319] border border-white/10 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6] transition-colors shadow-inner"
        />
      </div>

      {/* 3. Hero Spotlight Banner (Hanya jika tidak sedang search) */}
      {!searchTerm && activeCategory === 'all' && spotlightCar && (
        <div
          onClick={() => onSelectCar(spotlightCar)}
          className="relative w-full rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-r from-[#1c1013] via-[#151118] to-[#0c0d12] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group shadow-2xl hover:border-red-500/50 transition-all duration-300"
        >
          <div className="flex flex-col gap-2 max-w-md z-10">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider shadow">
                SPOTLIGHT HIGHLIGHT
              </span>
              <span className="text-gray-400 text-xs font-mono">
                {spotlightCar.release_year} Series
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight group-hover:text-red-300 transition-colors">
              {spotlightCar.name}
            </h2>

            <p className="text-xs text-gray-400 leading-relaxed">
              Koleksi unggulan dengan casting legendaris dan detail akrilik presisi. Klik untuk melihat spesifikasi lengkap dan estimasi harga pasaran.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-lg font-black font-mono text-white">
                Rp {spotlightCar.sell_price.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-red-400 font-bold bg-red-950/60 border border-red-800/40 px-3 py-1 rounded-full">
                Lihat Detail Showcase →
              </span>
            </div>
          </div>

          {/* Car Image Preview */}
          <div className="relative w-64 h-36 sm:w-80 sm:h-44 shrink-0 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)] group-hover:scale-105 transition-transform duration-500">
            <Image
              src={spotlightCar.image_url}
              alt={spotlightCar.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* 4. Filtered Cars Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black tracking-wider text-white uppercase font-mono">
            {searchTerm
              ? `HASIL PENCARIAN (${filteredCars.length})`
              : activeCategory === 'rlc'
              ? 'RED LINE CLUB VAULT'
              : activeCategory === 'sth'
              ? 'SUPER TREASURE HUNT & CHASE'
              : activeCategory === 'forsale'
              ? 'READY FOR SALE (BISA DIBELI)'
              : 'KATALOG EKSKLUSIF'}
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            {filteredCars.length} Model
          </span>
        </div>

        {filteredCars.length === 0 ? (
          <div className="py-16 text-center text-gray-500 flex flex-col items-center gap-2 bg-[#121319] rounded-2xl border border-white/5">
            <p className="text-xs">Tidak ada mobil yang cocok dengan pencarian.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredCars.map((car) => (
              <div
                key={car.id}
                onClick={() => onSelectCar(car)}
                className="cursor-pointer"
              >
                <DiecastCard
                  item={car}
                  isAdmin={isAdmin}
                  onUpdateQty={onUpdateQty}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
