'use client';

import React from 'react';
import { Series, CollectionItem } from '@/types/diecast';
import { DiecastCard } from './DiecastCard';

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
    <div className="flex flex-col gap-3 py-3 border-b border-[#1f222e] last:border-none">
      {/* Series Title & Category Badges (Screenshot 4) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-xl font-black tracking-tight uppercase">
              {series.name}
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="bg-[#ffffff] text-black text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {series.category}
              </span>
              {series.pantone_code && (
                <span className="bg-[#2a2d39] text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {series.pantone_code}
                </span>
              )}
            </div>
          </div>

          <span className="text-gray-400 text-xs font-black font-mono">
            {currentCount}/{targetCount}
          </span>
        </div>

        {/* Progress Bar (Warna biru Hot Wheels) */}
        <div className="w-full h-1.5 bg-[#1b1c23] rounded-full overflow-hidden mt-1">
          <div
            className="h-full bg-[#0066d6] rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Grid Mobil dalam Seri ini */}
      <div className="grid grid-cols-2 gap-2.5 mt-1">
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
