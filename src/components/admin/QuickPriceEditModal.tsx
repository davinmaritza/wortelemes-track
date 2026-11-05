'use client';

import React, { useState } from 'react';
import { CollectionItem } from '@/types/diecast';
import { Check, X, DollarSign } from 'lucide-react';

interface QuickPriceEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: CollectionItem | null;
  onSave: (id: string, buyPrice: number, sellPrice: number) => void;
}

export const QuickPriceEditModal: React.FC<QuickPriceEditModalProps> = ({
  isOpen,
  onClose,
  item,
  onSave,
}) => {
  if (!isOpen || !item) return null;

  return (
    <QuickPriceEditModalContent
      item={item}
      onClose={onClose}
      onSave={onSave}
    />
  );
};

const QuickPriceEditModalContent: React.FC<{
  item: CollectionItem;
  onClose: () => void;
  onSave: (id: string, buyPrice: number, sellPrice: number) => void;
}> = ({ item, onClose, onSave }) => {
  const [buyPrice, setBuyPrice] = useState<number>(item.buy_price ?? 0);
  const [sellPrice, setSellPrice] = useState<number>(item.sell_price ?? 0);

  const profit = sellPrice - buyPrice;
  const marginPercent = buyPrice > 0 ? Math.round((profit / buyPrice) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, Number(buyPrice) || 0, Number(sellPrice) || 0);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-[#12141c] border border-white/[0.08] w-full max-w-sm rounded-2xl p-5 flex flex-col gap-4 shadow-2xl">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] text-white border border-white/10 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-xs uppercase tracking-wider">
                Adjust Pricing
              </h3>
              <p className="text-[11px] text-gray-400 font-medium truncate max-w-[180px]">
                {item.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.06] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Input Modal Beli */}
          <div>
            <label className="text-[10px] font-semibold uppercase text-gray-300 block mb-1">
              Cost Price (Private)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono">
                Rp
              </span>
              <input
                type="number"
                step="1000"
                min="0"
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full bg-[#161822] border border-white/[0.08] focus:border-white/40 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono font-medium focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          {/* Input Harga Jual Pasaran */}
          <div>
            <label className="text-[10px] font-semibold uppercase text-emerald-400 block mb-1">
              Market Price (Public)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono">
                Rp
              </span>
              <input
                type="number"
                step="1000"
                min="0"
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full bg-[#161822] border border-white/[0.08] focus:border-emerald-500/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono font-medium focus:outline-none"
              />
            </div>
          </div>

          {/* Live Profit Preview Box */}
          <div className="bg-[#0b0c10] p-3 rounded-xl border border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">Estimated Margin:</span>
            <div className="text-right">
              <span
                className={`text-xs font-bold font-mono block ${
                  profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {profit >= 0 ? '+' : ''}Rp {profit.toLocaleString('id-ID')}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                ({marginPercent > 0 ? `+${marginPercent}%` : `${marginPercent}%`})
              </span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 font-medium py-2 rounded-xl text-xs transition-colors border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-white hover:bg-neutral-200 active:scale-95 text-black font-semibold py-2 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Save Pricing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
