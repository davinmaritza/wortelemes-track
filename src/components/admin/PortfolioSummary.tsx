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
    <div className="bg-[#12131a] border border-white/[0.08] rounded-xl p-4 mb-4 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <h2 className="text-white text-xs font-semibold uppercase tracking-wider">
            Ringkasan Koleksi Garasi
          </h2>
        </div>
        <span className="text-[10px] bg-white/[0.05] text-gray-300 border border-white/10 px-2 py-0.5 rounded-md font-mono">
          Privat
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Total Koleksi */}
        <div className="bg-[#0e0f14] p-3 rounded-lg border border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
            <Package className="w-3.5 h-3.5 text-gray-400" />
            <span>Total Koleksi</span>
          </div>
          <div className="text-white font-bold text-base font-mono">
            {totalItems} <span className="text-xs font-normal text-gray-400">unit</span>
          </div>
        </div>

        {/* Total Modal */}
        <div className="bg-[#0e0f14] p-3 rounded-lg border border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
            <DollarSign className="w-3.5 h-3.5 text-gray-400" />
            <span>Total Modal</span>
          </div>
          <div className="text-white font-bold text-sm sm:text-base font-mono truncate">
            {formatRupiah(totalModal)}
          </div>
        </div>

        {/* Total Nilai Jual */}
        <div className="bg-[#0e0f14] p-3 rounded-lg border border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
            <span>Estimasi Nilai Jual</span>
          </div>
          <div className="text-white font-bold text-sm sm:text-base font-mono truncate">
            {formatRupiah(totalValuasi)}
          </div>
        </div>

        {/* Potensi Margin */}
        <div className="bg-[#0e0f14] p-3 rounded-lg border border-white/[0.06]">
          <div className="flex items-center gap-1.5 text-gray-400 text-[11px] mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Potensi Selisih</span>
          </div>
          <div className="text-emerald-400 font-bold text-sm sm:text-base font-mono truncate">
            +{formatRupiah(totalPotentialProfit)}
            <span className="text-[10px] text-emerald-400/80 font-medium ml-1">({profitMarginPercent}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
