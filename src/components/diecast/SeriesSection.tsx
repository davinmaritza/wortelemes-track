'use client';

import React from 'react';
import { Series, CollectionItem } from '@/types/diecast';
import { DiecastCard } from './DiecastCard';

interface SeriesSectionProps {
  series: Series;
  items: CollectionItem[];
  isAdmin: boolean;
  onUpdateQty?: (id: string, delta: number) => void;
  onToggleFavorite?: (id: string) => void;
}

export const SeriesSection: React.FC<SeriesSectionProps> = ({
  series,
  items,
  isAdmin,
  onUpdateQty,
  onToggleFavorite,
}) => {
  const currentCount = items.length;
  const targetCount = series.total_in_set || 6;
  const progressPercentage = Math.min(100, Math.round((currentCount / targetCount) * 100));

  return (
    <div className="flex flex-col gap-3 py-4 border-b border-[#242735]/60 last:border-none">
      {/* Series Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-white text-lg font-black tracking-tight uppercase">
              {series.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-[#242735] text-gray-200 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                {series.category}
              </span>
              {series.pantone_code && (
                <span className="bg-[#1f222e] text-gray-400 text-[11px] font-semibold px-2 py-0.5 rounded uppercase">
                  {series.pantone_code}
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-gray-400 text-sm font-black font-mono">
              {currentCount}/{targetCount}
            </span>
          </div>
        </div>

        {/* Progress Bar (Gaya Hot Wheels Showcase App) */}
        <div className="w-full h-2 bg-[#1f222e] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0066d6] rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Grid Mobil dalam Seri ini */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-1">
        {items.map((item) => (
          <DiecastCard
            key={item.id}
            item={item}
            isAdmin={isAdmin}
            onUpdateQty={onUpdateQty}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
};
