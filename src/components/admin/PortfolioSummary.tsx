'use client';

import React from 'react';
import { CollectionItem } from '@/types/diecast';
import { DollarSign, Package, TrendingUp, ShieldCheck } from 'lucide-react';

interface PortfolioSummaryProps {
  items: CollectionItem[];
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({ items }) => {
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalItems = items.reduce((acc, curr) => acc + (curr.qty || 1), 0);
  const totalModal = items.reduce((acc, curr) => acc + (curr.buy_price || 0) * (curr.qty || 1), 0);
  const totalValuasi = items.reduce((acc, curr) => acc + (curr.sell_price || 0) * (curr.qty || 1), 0);
  const totalPotentialProfit = totalValuasi - totalModal;
  const profitMarginPercent = totalModal > 0 ? Math.round((totalPotentialProfit / totalModal) * 100) : 0;

  return (
    <div className="bg-[#16181f] border border-red-900/40 rounded-2xl p-4 mb-4 flex flex-col gap-3 shadow-lg">
      <div className="flex items-center justify-between pb-2 border-b border-[#242735]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          <h2 className="text-white text-sm font-black uppercase tracking-wide">
            Portfolio & Finansial (Admin Secret)
          </h2>
        </div>
        <span className="text-[10px] bg-red-950/60 text-red-300 border border-red-800/50 px-2 py-0.5 rounded-full font-mono">
          Private Mode
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Koleksi */}
        <div className="bg-[#111217] p-2.5 rounded-xl border border-[#242735]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
            <Package className="w-3.5 h-3.5 text-blue-400" />
            <span>Total Unit</span>
          </div>
          <div className="text-white font-extrabold text-base font-mono">
            {totalItems} Unit
          </div>
        </div>

        {/* Total Modal */}
        <div className="bg-[#111217] p-2.5 rounded-xl border border-[#242735]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
            <span>Total Modal</span>
          </div>
          <div className="text-white font-extrabold text-sm sm:text-base font-mono truncate">
            {formatRupiah(totalModal)}
          </div>
        </div>

        {/* Total Valuasi Pasar */}
        <div className="bg-[#111217] p-2.5 rounded-xl border border-[#242735]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
            <span>Valuasi Pasar</span>
          </div>
          <div className="text-white font-extrabold text-sm sm:text-base font-mono truncate">
            {formatRupiah(totalValuasi)}
          </div>
        </div>

        {/* Potensi Margin Profit */}
        <div className="bg-[#111217] p-2.5 rounded-xl border border-[#242735]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Potensi Profit</span>
          </div>
          <div className="text-emerald-400 font-extrabold text-sm sm:text-base font-mono truncate">
            +{formatRupiah(totalPotentialProfit)}
            <span className="text-[10px] text-emerald-500 font-semibold ml-1">({profitMarginPercent}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
