'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CollectionItem, Series } from '@/types/diecast';
import { Search, Loader2, X, PlusCircle, Check, Edit2, Upload, Camera, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface DiecastFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  seriesList: Series[];
  itemToEdit?: CollectionItem | null;
  onSave: (item: CollectionItem) => void;
}

export const DiecastFormModal: React.FC<DiecastFormModalProps> = ({
  isOpen,
  onClose,
  seriesList,
  itemToEdit,
  onSave,
}) => {
  const isEditing = Boolean(itemToEdit);

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
  const [notes, setNotes] = useState('');

  // Image Upload State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal mengupload file gambar');
      }

      setImageUrl(data.url);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Gagal upload gambar');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Populate form when itemToEdit changes
  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name);
      setSeriesId(itemToEdit.series_id || seriesList[0]?.id || '');
      setReleaseYear(itemToEdit.release_year);
      setSegmentNumber(itemToEdit.segment_number);
      setColor(itemToEdit.color);
      setTierBadge(itemToEdit.tier_badge);
      setCondition(itemToEdit.condition);
      setBuyPrice(itemToEdit.buy_price ?? 45000);
      setSellPrice(itemToEdit.sell_price);
      setQty(itemToEdit.qty);
      setImageUrl(itemToEdit.image_url);
      setIsForSale(itemToEdit.is_for_sale);
      setNotes(itemToEdit.notes || '');
    } else {
      setName('');
      setSeriesId(seriesList[0]?.id || '');
      setReleaseYear(2026);
      setSegmentNumber(1);
      setColor('');
      setTierBadge('Mainline');
      setCondition('Carded / Mint');
      setBuyPrice(45000);
      setSellPrice(75000);
      setQty(1);
      setImageUrl('/cars/erikenstein_rod.png');
      setIsForSale(true);
      setNotes('');
    }
    setWikiResults([]);
    setWikiQuery('');
  }, [itemToEdit, isOpen, seriesList]);

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

    const itemData: CollectionItem = {
      id: itemToEdit?.id || `c-${Date.now()}`,
      name: name.trim(),
      series_id: seriesId,
      release_year: Number(releaseYear),
      segment_number: Number(segmentNumber),
      color: color.trim() || 'Standard',
      scale: '1:64',
      condition: condition.trim() || 'Carded / Mint',
      tier_badge: tierBadge,
      buy_price: Number(buyPrice) || 0,
      sell_price: Number(sellPrice) || 0,
      qty: Math.max(1, Number(qty) || 1),
      is_for_sale: isForSale,
      is_favorite: itemToEdit?.is_favorite ?? false,
      image_url: imageUrl || '/cars/erikenstein_rod.png',
      notes: notes.trim(),
      updated_at: new Date().toISOString(),
    };

    onSave(itemData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#16181f] border border-[#242735] w-full max-w-lg rounded-2xl p-5 flex flex-col max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#242735]">
          <div className="flex items-center gap-2">
            {isEditing ? (
              <Edit2 className="w-5 h-5 text-amber-400" />
            ) : (
              <PlusCircle className="w-5 h-5 text-[#0066d6]" />
            )}
            <h2 className="text-white font-black text-sm uppercase tracking-wide">
              {isEditing ? 'Edit Data Mobil & Harga' : 'Tambah Diecast Baru'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#242735] transition-colors"
          >
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

          {/* Autocomplete Results */}
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

          {/* Image Upload & Thumbnail Preview Section */}
          <div className="bg-[#111217] p-3 rounded-xl border border-[#242735] flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-gray-400 uppercase">
                Foto / Gambar Diecast
              </label>
              {isUploading && (
                <span className="text-[10px] text-blue-400 flex items-center gap-1 font-medium">
                  <Loader2 className="w-3 h-3 animate-spin" /> Mengunggah...
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Preview Thumbnail */}
              <div className="relative w-20 h-14 bg-white rounded-xl overflow-hidden shrink-0 border border-[#242735] shadow-inner flex items-center justify-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="preview"
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>

              {/* Upload Actions */}
              <div className="flex-1 flex flex-col gap-1.5">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex-1 bg-[#1e222f] hover:bg-[#2b3042] text-white border border-[#2c3144] py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isUploading ? 'Uploading...' : 'Upload Foto'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const sample = prompt('Masukkan URL gambar langsung:', imageUrl);
                      if (sample !== null) setImageUrl(sample.trim());
                    }}
                    className="bg-[#16181f] hover:bg-[#1f222e] text-gray-300 border border-[#242735] px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    title="Paste Link URL"
                  >
                    URL
                  </button>
                </div>

                <p className="text-[10px] text-gray-500 truncate">
                  {imageUrl ? imageUrl : 'Format: PNG, JPG, WebP. Atau cari via Wiki di atas.'}
                </p>

                {uploadError && (
                  <p className="text-[10px] text-red-400 font-medium">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>
          </div>

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
                <option value="Super Treasure Hunt">Super Treasure Hunt (STH)</option>
                <option value="Treasure Hunt">Treasure Hunt (TH)</option>
                <option value="Screen Time">Screen Time</option>
                <option value="Premium">Premium Car Culture</option>
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

          {/* Finansial Inputs (Modal vs Pasaran) */}
          <div className="p-3 bg-[#111217] rounded-xl border border-red-950/40 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-gray-300">Penyesuaian Harga & Margin</span>
              <span className="font-mono font-bold text-emerald-400">
                Profit: Rp {((Number(sellPrice) || 0) - (Number(buyPrice) || 0)).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-red-400 uppercase block mb-1">
                  Modal Beli (Privat) *
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(Number(e.target.value))}
                    className="w-full bg-[#1a1d26] border border-red-900/30 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-emerald-400 uppercase block mb-1">
                  Harga Jual / Pasaran *
                </label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-mono">
                    Rp
                  </span>
                  <input
                    type="number"
                    required
                    value={sellPrice}
                    onChange={(e) => setSellPrice(Number(e.target.value))}
                    className="w-full bg-[#1a1d26] border border-emerald-900/30 rounded-lg pl-8 pr-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Catatan Khusus */}
          <div>
            <label className="text-[11px] text-gray-400 block mb-1">Catatan Tambahan (Opsional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Kondisi blister mulus, ban karet Real Riders"
              className="w-full bg-[#111217] border border-[#242735] rounded-lg px-3 py-1.5 text-xs text-white"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_for_sale_modal"
              checked={isForSale}
              onChange={(e) => setIsForSale(e.target.checked)}
              className="w-4 h-4 rounded accent-[#0066d6]"
            />
            <label htmlFor="is_for_sale_modal" className="text-xs text-gray-300 font-medium">
              Tandai sebagai <span className="text-emerald-400 font-bold">For Sale</span> (Tampil tombol chat WA)
            </label>
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#0066d6] hover:bg-blue-600 text-white font-black py-2.5 rounded-xl text-xs active:scale-95 transition-all shadow-lg uppercase tracking-wider"
          >
            {isEditing ? 'Simpan Perubahan' : 'Simpan ke Garasi'}
          </button>
        </form>
      </div>
    </div>
  );
};
