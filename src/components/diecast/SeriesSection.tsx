'use client';

import React from 'react';
import { Series, CollectionItem } from '@/types/diecast';
import { DiecastCard } from './DiecastCard';
import { Layers } from 'lucide-react';

interface SeriesSectionProps {
  series: Series;
  items: CollectionItem[];
  isAdmin: boolean;
  onSelectCar?: (car: CollectionItem) => void;
  onUpdateQty?: (id: string, delta: number) => void;
  onToggleFavorite?: (id: string) => void;
}

export const SeriesSection: React.FC<SeriesSectionProps> = ({
  series,
  items,
  isAdmin,
  onSelectCar,
  onUpdateQty,
  onToggleFavorite,
}) => {
  const currentCount = items.length;
  const targetCount = series.total_in_set || 6;
  const progressPercentage = Math.min(100, Math.round((currentCount / targetCount) * 100));

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-white/[0.06] last:border-none">
      {/* Series Title & Category Badges */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0066d6]" />
              <h2 className="text-white text-lg sm:text-xl font-black tracking-tight uppercase">
                {series.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-white/10 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-white/10">
                {series.category}
              </span>
              {series.pantone_code && (
                <span className="bg-[#1b1c24] text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/5">
                  {series.pantone_code}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-white text-xs sm:text-sm font-black font-mono">
              {currentCount} / {targetCount}
            </span>
            <span className="block text-[10px] text-gray-400 font-semibold">
              {progressPercentage === 100 ? 'Set Lengkap' : `${progressPercentage}% Terkumpul`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-[#14161f] rounded-full overflow-hidden border border-white/5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressPercentage === 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                : 'bg-gradient-to-r from-[#0066d6] to-blue-400'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Responsive Grid Mobil dalam Seri ini */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-1">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCar?.(item)}
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
    </div>
  );
};
