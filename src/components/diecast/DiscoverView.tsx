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
  const rlcCars = cars.filter((c) => c.tier_badge?.toUpperCase().includes('RLC'));
  const otherCars = cars.filter((c) => !c.tier_badge?.toUpperCase().includes('RLC')).slice(0, 4);

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* 1. Header DISCOVER */}
      <div className="flex flex-col gap-0.5 pt-1">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase font-sans">
          DISCOVER
        </h1>
        <button className="text-[#0066d6] hover:text-blue-400 text-[11px] font-black tracking-wider flex items-center gap-0.5 uppercase w-fit">
          <span>SEE ALL 36,270 VEHICLES</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. Search Box (Rounded pill) */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Vehicle, SKU, and More"
          className="w-full bg-[#16181f] border border-[#232632] rounded-[14px] pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6]"
        />
      </div>

      {/* 3. FEATURED BANNER (Sesuai Screenshot 1) */}
      <div className="flex flex-col gap-2 pt-1">
        <span className="text-[11px] font-black tracking-wider text-gray-300 uppercase">
          FEATURED
        </span>
        <div className="relative w-full h-28 rounded-2xl overflow-hidden border border-[#242735] shadow-lg">
          <Image
            src="/cars/banner_trending.png"
            alt="Trending in Showcase"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-1.5 pt-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0066d6]" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
          <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
        </div>
      </div>

      {/* 4. RED LINE CLUB SECTION (Sesuai Screenshot 1) */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black tracking-wider text-white uppercase">
            RED LINE CLUB
          </span>
          <button className="text-[11px] font-bold text-[#0066d6] hover:text-blue-400">
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
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

      {/* 5. ELITE 64 DROPS SECTION */}
      <div className="flex flex-col gap-2.5 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black tracking-wider text-white uppercase">
            ELITE 64 DROPS
          </span>
          <button className="text-[11px] font-bold text-[#0066d6] hover:text-blue-400">
            See all
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {otherCars.map((car) => (
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
