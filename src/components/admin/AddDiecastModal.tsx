'use client';

import React, { useState } from 'react';
import { CollectionItem, Series } from '@/types/diecast';
import { Search, Loader2, X, PlusCircle, Check } from 'lucide-react';
import Image from 'next/image';

interface AddDiecastModalProps {
  isOpen: boolean;
  onClose: () => void;
  seriesList: Series[];
  onAdd: (item: CollectionItem) => void;
}

export const AddDiecastModal: React.FC<AddDiecastModalProps> = ({
  isOpen,
  onClose,
  seriesList,
  onAdd,
}) => {
  const [wikiQuery, setWikiQuery] = useState('');
  const [wikiResults, setWikiResults] = useState<{ title: string; url: string }[]>([]);
  const [isSearchingWiki, setIsSearchingWiki] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Form Fields
  const [name, setName] = useState('');
  const [seriesId, setSeriesId] = useState(seriesList[0]?.id || '');
  const [releaseYear, setReleaseYear] = useState<number>(2026);
  const [segmentNumber, setSegmentNumber] = useState<number>(1);
  const [color, setColor] = useState('');
  const [tierBadge, setTierBadge] = useState('Mainline');
  const [condition, setCondition] = useState('Carded / Mint');
  const [buyPrice, setBuyPrice] = useState<number>(45000);
  const [sellPrice, setSellPrice] = useState<number>(75000);
  const [qty, setQty] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState('');
  const [isForSale, setIsForSale] = useState(true);

  if (!isOpen) return null;

  const handleSearchWiki = async () => {
    if (!wikiQuery.trim()) return;
    setIsSearchingWiki(true);
    try {
      const res = await fetch(`/api/wiki/search?q=${encodeURIComponent(wikiQuery)}`);
      const data = await res.json();
      setWikiResults(data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingWiki(false);
    }
  };

  const handleSelectWikiTitle = async (title: string) => {
    setIsLoadingDetails(true);
    setName(title);
    setWikiResults([]);
    try {
      const res = await fetch(`/api/wiki/details?title=${encodeURIComponent(title)}`);
      const data = await res.json();
      if (data.found && data.image_url) {
        setImageUrl(data.image_url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newItem: CollectionItem = {
      id: `c-${Date.now()}`,
      name,
      series_id: seriesId,
      release_year: Number(releaseYear),
      segment_number: Number(segmentNumber),
      color: color || 'Standard',
      scale: '1:64',
      condition,
      tier_badge: tierBadge,
      buy_price: Number(buyPrice),
      sell_price: Number(sellPrice),
      qty: Number(qty),
      is_for_sale: isForSale,
      is_favorite: false,
      image_url: imageUrl || 'https://static.wikia.nocookie.net/hotwheels/images/e/ea/Erikrod20.jpg/revision/latest?cb=20200115042220',
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#16181f] border border-[#242735] w-full max-w-lg rounded-2xl p-5 flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#242735]">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#0066d6]" />
            <h2 className="text-white font-extrabold text-sm uppercase">Tambah Diecast Baru</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Smart Wiki Autocomplete Box */}
        <div className="mt-4 p-3 bg-[#111217] rounded-xl border border-blue-900/40">
          <label className="text-[11px] font-bold text-blue-400 block mb-1">
            ⚡ Quick Auto-Fill via Hot Wheels Wiki
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={wikiQuery}
              onChange={(e) => setWikiQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchWiki())}
              placeholder="Ketik casting (e.g. Nissan Skyline, Kool Kombi)..."
              className="flex-1 bg-[#1a1d26] border border-[#242735] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#0066d6]"
            />
            <button
              type="button"
              onClick={handleSearchWiki}
              disabled={isSearchingWiki}
              className="bg-[#0066d6] hover:bg-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1 shrink-0"
            >
              {isSearchingWiki ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Cari
            </button>
          </div>

          {/* Hasil Autocomplete Dropdown */}
          {wikiResults.length > 0 && (
            <div className="mt-2 bg-[#1a1d26] border border-[#242735] rounded-lg overflow-hidden divide-y divide-[#242735]">
              {wikiResults.map((res, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectWikiTitle(res.title)}
                  className="w-full text-left px-3 py-2 text-xs text-gray-200 hover:bg-[#0066d6]/20 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span className="font-semibold">{res.title}</span>
                  <span className="text-[10px] text-blue-400 font-mono">Pilih & Isi</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
          {isLoadingDetails && (
            <div className="flex items-center gap-2 text-blue-400 text-xs py-1">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Mengambil gambar & info resmi dari Wiki...
            </div>
          )}

          {/* Image Preview */}
          {imageUrl && (
            <div className="flex items-center gap-3 bg-[#111217] p-2 rounded-xl border border-[#242735]">
              <div className="relative w-16 h-12 bg-white rounded-lg overflow-hidden shrink-0">
                <Image src={imageUrl} alt="preview" fill className="object-contain p-1" unoptimized />
              </div>
              <div className="text-[11px] text-gray-300 truncate">
                <span className="text-emerald-400 font-bold block">Gambar Wiki Terpilih</span>
                <span className="text-gray-500 font-mono text-[9px] truncate block">{imageUrl}</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Nama Model / Casting *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#111217] border border-[#242735] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0066d6]"
              placeholder="e.g. 1991 BMW M3"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Series</label>
              <select
                value={seriesId}
                onChange={(e) => setSeriesId(e.target.value)}
                className="w-full bg-[#111217] border border-[#242735] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#0066d6]"
              >
                {seriesList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Badge / Tier</label>
              <select
                value={tierBadge}
                onChange={(e) => setTierBadge(e.target.value)}
                className="w-full bg-[#111217] border border-[#242735] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#0066d6]"
              >
                <option value="Mainline">Mainline</option>
                <option value="Silver Series">Silver Series</option>
                <option value="RLC">RLC (Red Line Club)</option>
                <option value="Hot Wheels XL">Hot Wheels XL</option>
                <option value="STH">STH (Super Treasure Hunt)</option>
                <option value="TH">TH (Treasure Hunt)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Tahun Rilis</label>
              <input
                type="number"
                value={releaseYear}
                onChange={(e) => setReleaseYear(Number(e.target.value))}
                className="w-full bg-[#111217] border border-[#242735] rounded-lg px-2.5 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Nomor Index</label>
              <input
                type="number"
                value={segmentNumber}
                onChange={(e) => setSegmentNumber(Number(e.target.value))}
                className="w-full bg-[#111217] border border-[#242735] rounded-lg px-2.5 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Jumlah (Qty)</label>
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full bg-[#111217] border border-[#242735] rounded-lg px-2.5 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Warna Bodi</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="e.g. Vibrant Blue"
                className="w-full bg-[#111217] border border-[#242735] rounded-lg px-2.5 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-gray-400 block mb-1">Kondisi</label>
              <input
                type="text"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g. Carded / Mint"
                className="w-full bg-[#111217] border border-[#242735] rounded-lg px-2.5 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* Finansial Inputs */}
          <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#111217] rounded-xl border border-red-950/40">
            <div>
              <label className="text-[10px] font-bold text-red-400 uppercase block mb-1">
                Harga Modal (Hide) *
              </label>
              <input
                type="number"
                required
                value={buyPrice}
                onChange={(e) => setBuyPrice(Number(e.target.value))}
                className="w-full bg-[#1a1d26] border border-red-900/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                Harga Pasaran (Publik) *
              </label>
              <input
                type="number"
                required
                value={sellPrice}
                onChange={(e) => setSellPrice(Number(e.target.value))}
                className="w-full bg-[#1a1d26] border border-emerald-900/30 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_for_sale"
              checked={isForSale}
              onChange={(e) => setIsForSale(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0066d6]"
            />
            <label htmlFor="is_for_sale" className="text-xs text-gray-300 font-medium">
              Tandai sebagai <span className="text-emerald-400 font-bold">For Sale</span> (Calon pembeli bisa chat WA)
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#0066d6] hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-xs active:scale-95 transition-all shadow"
          >
            Simpan ke Garasi
          </button>
        </form>
      </div>
    </div>
  );
};
