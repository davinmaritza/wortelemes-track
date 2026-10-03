'use client';

import React, { useState } from 'react';
import { initialCollections, initialSeries } from '@/lib/data/mockData';
import { CollectionItem, Series } from '@/types/diecast';
import { DiecastCard } from '@/components/diecast/DiecastCard';
import { SeriesSection } from '@/components/diecast/SeriesSection';
import { PortfolioSummary } from '@/components/admin/PortfolioSummary';
import { AddDiecastModal } from '@/components/admin/AddDiecastModal';
import {
  Search,
  Lock,
  Unlock,
  Plus,
  Flame,
  ChevronDown,
  LayoutGrid,
  Layers,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'Vehicles' | 'Series' | 'Lists'>('Vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [filterForSaleOnly, setFilterForSaleOnly] = useState(false);

  // Data State
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections);
  const [seriesList] = useState<Series[]>(initialSeries);

  // Admin Mode State (Passcode PIN)
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Handle Admin Passcode Login
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1234 (bisa disesuaikan via ENV)
    if (pinInput === '1234' || pinInput === '0000') {
      setIsAdmin(true);
      setShowPinModal(false);
      setPinInput('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Filter & Search Logic
  const filteredItems = collections.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tier_badge.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterForSaleOnly && !item.is_for_sale) return false;
    if (activeTab === 'Lists' && !item.is_favorite) return false;
    return matchesSearch;
  });

  // Sort Logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (selectedSort === 'price-asc') return a.sell_price - b.sell_price;
    if (selectedSort === 'price-desc') return b.sell_price - a.sell_price;
    return 0; // Default order
  });

  // Admin Actions
  const handleUpdateQty = (id: string, delta: number) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
    );
  };

  const handleToggleFavorite = (id: string) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_favorite: !c.is_favorite } : c))
    );
  };

  const handleAddItem = (newItem: CollectionItem) => {
    setCollections((prev) => [newItem, ...prev]);
  };

  return (
    <main className="min-h-screen bg-[#0c0d10] text-white flex justify-center pb-20">
      {/* Mobile-first frame container */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl px-4 sm:px-6 pt-5 flex flex-col">
        {/* Top Branding Bar */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-600 fill-red-600 animate-pulse" />
            <span className="font-black italic tracking-tighter text-xl bg-gradient-to-r from-red-600 via-amber-500 to-red-500 bg-clip-text text-transparent">
              HOT WHEELS
            </span>
          </div>

          {/* Admin Toggle Button */}
          <button
            onClick={() => (isAdmin ? setIsAdmin(false) : setShowPinModal(true))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              isAdmin
                ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                : 'bg-[#16181f] text-gray-400 border border-[#242735] hover:text-white'
            }`}
          >
            {isAdmin ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-red-400" />
                <span>Admin Mode (Keluar)</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Login Admin PIN</span>
              </>
            )}
          </button>
        </div>

        {/* Garage Title & Add Button */}
        <div className="flex items-center justify-between mt-2 mb-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-white">
              MY GARAGE
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {collections.reduce((sum, i) => sum + (i.qty || 1), 0)} / 250 Vehicles
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Koleksi</span>
            </button>
          )}
        </div>

        {/* Admin Portfolio Summary (Hidden from public) */}
        {isAdmin && <PortfolioSummary items={collections} />}

        {/* Tab Navigation (Persis Hot Wheels Showcase App) */}
        <div className="bg-[#16181f] p-1 rounded-2xl flex items-center border border-[#242735] mb-4">
          <button
            onClick={() => setActiveTab('Vehicles')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'Vehicles'
                ? 'bg-[#0066d6] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Vehicles
          </button>
          <button
            onClick={() => setActiveTab('Series')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'Series'
                ? 'bg-[#0066d6] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Series
          </button>
          <button
            onClick={() => setActiveTab('Lists')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'Lists'
                ? 'bg-[#0066d6] text-white shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Wishlist / Favorit
          </button>
        </div>

        {/* Filters & Search Controls */}
        <div className="flex flex-col gap-2.5 mb-5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by vehicles, SKU, and more"
              className="w-full bg-[#16181f] border border-[#242735] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6] transition-colors"
            />
          </div>

          {/* Quick Filter Badges */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
            <button
              onClick={() => setFilterForSaleOnly(!filterForSaleOnly)}
              className={`px-3 py-1.5 rounded-lg font-semibold shrink-0 transition-all ${
                filterForSaleOnly
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-[#16181f] text-gray-400 border border-[#242735] hover:text-white'
              }`}
            >
              🟢 Hanya For Sale
            </button>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="bg-[#16181f] border border-[#242735] text-gray-300 px-3 py-1.5 rounded-lg font-semibold shrink-0 focus:outline-none"
            >
              <option value="newest">Urutan Terbaru</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
            </select>
          </div>
        </div>

        {/* MAIN CONTENT DISPLAY */}
        {activeTab === 'Series' ? (
          /* Tab Series: Track Every Series & Progress Bar */
          <div className="flex flex-col gap-2">
            {seriesList.map((series) => {
              const seriesItems = collections.filter((i) => i.series_id === series.id);
              return (
                <SeriesSection
                  key={series.id}
                  series={series}
                  items={seriesItems}
                  isAdmin={isAdmin}
                  onUpdateQty={handleUpdateQty}
                  onToggleFavorite={handleToggleFavorite}
                />
              );
            })}
          </div>
        ) : (
          /* Tab Vehicles & Lists: Grid 2-Kolom Persis Hot Wheels App */
          <div>
            {sortedItems.length === 0 ? (
              <div className="py-16 text-center text-gray-500 flex flex-col items-center gap-2">
                <LayoutGrid className="w-10 h-10 stroke-[1.5] text-gray-600" />
                <p className="text-xs">Tidak ada mobil diecast yang cocok dengan pencarian.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {sortedItems.map((item) => (
                  <DiecastCard
                    key={item.id}
                    item={item}
                    isAdmin={isAdmin}
                    onUpdateQty={handleUpdateQty}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* PIN Login Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#16181f] border border-[#242735] w-full max-w-xs rounded-2xl p-5 flex flex-col items-center shadow-xl">
            <div className="w-10 h-10 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-white font-bold text-sm text-center mb-1">
              Admin Passcode PIN
            </h3>
            <p className="text-gray-400 text-[11px] text-center mb-4">
              Masukkan Master PIN untuk membuka kelola stok dan melihat modal rahasia. (Default: <code className="text-blue-400 font-mono">1234</code>)
            </p>

            <form onSubmit={handleVerifyPin} className="w-full flex flex-col gap-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Masukkan PIN"
                className={`w-full bg-[#111217] border ${
                  pinError ? 'border-red-500' : 'border-[#242735]'
                } rounded-xl px-3 py-2 text-center text-white tracking-widest text-lg font-mono focus:outline-none focus:border-[#0066d6]`}
                autoFocus
              />
              {pinError && (
                <span className="text-red-400 text-[10px] text-center">
                  PIN salah. Coba 1234
                </span>
              )}

              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 bg-[#1f222e] text-gray-300 py-2 rounded-xl text-xs font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0066d6] text-white py-2 rounded-xl text-xs font-bold"
                >
                  Buka Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Diecast */}
      <AddDiecastModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        seriesList={seriesList}
        onAdd={handleAddItem}
      />
    </main>
  );
}
