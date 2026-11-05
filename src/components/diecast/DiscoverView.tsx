'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { Search, ArrowUpRight } from 'lucide-react';
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

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

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
    <div className="flex flex-col gap-6 pb-20 w-full max-w-7xl mx-auto">
      {/* 1. Header Discover */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
            DISCOVERY ARCHIVE
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Curated archive of rare Red Line Club issues, Super Treasure Hunts, and available units.
          </p>
        </div>

        {/* Coherent Monochromatic Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeCategory === 'all'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            All Archive ({cars.length})
          </button>
          <button
            onClick={() => setActiveCategory('rlc')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeCategory === 'rlc'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            RLC Vault ({rlcCars.length})
          </button>
          <button
            onClick={() => setActiveCategory('sth')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeCategory === 'sth'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            STH / Chase ({sthCars.length})
          </button>
          <button
            onClick={() => setActiveCategory('forsale')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeCategory === 'forsale'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/[0.08]'
            }`}
          >
            Available ({forSaleCars.length})
          </button>
        </div>
      </div>

      {/* 2. Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter model name, series, or color finish..."
          className="w-full bg-[#111219] border border-white/[0.08] focus:border-white/25 rounded-2xl pl-10 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
        />
      </div>

      {/* 3. Refined Featured Showcase (When not searching) */}
      {!searchTerm && activeCategory === 'all' && spotlightCar && (
        <div
          onClick={() => onSelectCar(spotlightCar)}
          className="relative w-full rounded-3xl overflow-hidden border border-white/[0.08] hover:border-white/20 bg-[#111219] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 cursor-pointer group shadow-xl transition-all duration-300"
        >
          <div className="flex flex-col gap-2.5 max-w-lg z-10">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                Vault Feature
              </span>
              <span className="text-gray-400 text-xs font-mono">
                {spotlightCar.release_year} Series • #{spotlightCar.segment_number || 1}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight leading-snug">
              {spotlightCar.name}
            </h2>

            <p className="text-xs text-gray-400 leading-relaxed">
              Curator-grade casting preservation with authentic tamper-evident blister packaging and certified factory tampos.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="text-lg font-black font-mono text-white tracking-tight">
                {formatRupiah(spotlightCar.sell_price)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-white bg-white/[0.08] hover:bg-white/[0.15] border border-white/10 px-3 py-1.5 rounded-xl font-medium transition-colors">
                <span>View Full Specifications</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
              </span>
            </div>
          </div>

          {/* Car Image Preview Stage */}
          <div className="relative w-64 h-36 sm:w-80 sm:h-44 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-[#161822]/60 border border-white/[0.04]">
            <Image
              src={spotlightCar.image_url}
              alt={spotlightCar.name}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-500 select-none"
              unoptimized
            />
          </div>
        </div>
      )}

      {/* 4. Filtered Cars Grid */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-300 font-bold">
            {searchTerm
              ? `Search Results (${filteredCars.length})`
              : activeCategory === 'rlc'
              ? 'Red Line Club Vault'
              : activeCategory === 'sth'
              ? 'Super Treasure Hunt & Chase'
              : activeCategory === 'forsale'
              ? 'Available Units'
              : 'Complete Catalog'}
          </h2>
          <span className="text-xs text-gray-500 font-mono">
            {filteredCars.length} Models
          </span>
        </div>

        {filteredCars.length === 0 ? (
          <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-2">
            <p className="text-xs font-mono">No matching diecasts found in vault.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredCars.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectCar(item)}
                className="cursor-pointer"
              >
                <DiecastCard
                  item={item}
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
