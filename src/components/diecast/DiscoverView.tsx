'use client';

import React from 'react';
import Image from 'next/image';
import { CollectionItem } from '@/types/diecast';
import { Search, ChevronRight } from 'lucide-react';
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
  const rlcCars = cars.filter((c) => c.tier_badge?.toLowerCase().includes('rlc'));
  const otherHighlights = cars.filter((c) => !c.tier_badge?.toLowerCase().includes('rlc')).slice(0, 4);

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header DISCOVER */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase">
          DISCOVER
        </h1>
        <button className="text-[#0066d6] hover:text-blue-400 text-xs font-bold tracking-wider flex items-center gap-1 uppercase w-fit">
          <span>SEE ALL 36,270 VEHICLES</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Vehicle, SKU, and More"
          className="w-full bg-[#16181f] border border-[#242735] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6]"
        />
      </div>

      {/* FEATURED BANNER: TRENDING IN SHOWCASE (Persis screenshot 1) */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-black tracking-wider text-gray-400 uppercase">
          FEATURED
        </span>
        <div className="relative w-full h-24 rounded-2xl overflow-hidden border border-[#242735] bg-gradient-to-r from-neutral-900 via-zinc-800 to-neutral-900 flex items-center justify-center shadow-lg group">
          {/* Checkered flag racing pattern overlay */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-conic-gradient(#fff_0_25%,#000_0_50%)] bg-[length:20px_20px]" />
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-white text-base sm:text-lg font-black italic tracking-wider drop-shadow-md">
              TRENDING IN <span className="text-blue-500">SHOWCASE</span>
            </span>
          </div>
        </div>
        {/* Pagination dots */}
        <div className="flex justify-center items-center gap-1.5 pt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066d6]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
        </div>
      </div>

      {/* RED LINE CLUB SECTION (Persis screenshot 1) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black tracking-wider text-white uppercase">
            RED LINE CLUB
          </span>
          <button className="text-[11px] font-bold text-[#0066d6] hover:text-blue-400">
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {rlcCars.map((car) => (
            <div key={car.id} onClick={() => onSelectCar(car)} className="cursor-pointer">
              <DiecastCard
                item={car}
                isAdmin={isAdmin}
                onUpdateQty={onUpdateQty}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ELITE DROPS SECTION */}
      <div className="flex flex-col gap-2.5 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black tracking-wider text-white uppercase">
            ELITE 64 DROPS & HIGHLIGHTS
          </span>
          <button className="text-[11px] font-bold text-[#0066d6] hover:text-blue-400">
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {otherHighlights.map((car) => (
            <div key={car.id} onClick={() => onSelectCar(car)} className="cursor-pointer">
              <DiecastCard
                item={car}
                isAdmin={isAdmin}
                onUpdateQty={onUpdateQty}
                onToggleFavorite={onToggleFavorite}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
