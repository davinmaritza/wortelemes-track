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
              <Layers className="w-4 h-4 text-gray-400" />
              <h2 className="text-white text-base sm:text-lg font-bold tracking-tight uppercase font-sans">
                {series.name}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <span className="bg-white/[0.06] text-gray-300 text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/[0.08]">
                {series.category}
              </span>
              {series.pantone_code && (
                <span className="text-gray-500 text-[10px] font-mono">
                  {series.pantone_code}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-white text-xs sm:text-sm font-bold font-mono">
              {currentCount} / {targetCount}
            </span>
            <span className="block text-[10px] text-gray-400 font-mono">
              {progressPercentage === 100 ? 'Set Completed' : `${progressPercentage}% collected`}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              progressPercentage === 100
                ? 'bg-emerald-400'
                : 'bg-white/70'
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
