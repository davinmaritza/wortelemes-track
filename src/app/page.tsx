'use client';

import React, { useState } from 'react';
import { showcaseCars, showcaseSeries } from '@/lib/data/mockData';
import { CollectionItem, Series } from '@/types/diecast';
import { DiecastCard } from '@/components/diecast/DiecastCard';
import { SeriesSection } from '@/components/diecast/SeriesSection';
import { DiscoverView } from '@/components/diecast/DiscoverView';
import { CarDetailView } from '@/components/diecast/CarDetailView';
import { BottomTabBar, AppNavTab } from '@/components/navigation/BottomTabBar';
import { PortfolioSummary } from '@/components/admin/PortfolioSummary';
import { AddDiecastModal } from '@/components/admin/AddDiecastModal';
import {
  Search,
  Lock,
  Unlock,
  Plus,
  Flame,
  LayoutGrid,
  Camera,
} from 'lucide-react';

export default function Home() {
  // Navigation tabs (Bottom Bar)
  const [currentNav, setCurrentNav] = useState<AppNavTab>('garage');

  // Garage Sub-Tabs: Vehicles | Series | Lists
  const [garageSubTab, setGarageSubTab] = useState<'Vehicles' | 'Series' | 'Lists'>('Vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
  const [filterForSaleOnly, setFilterForSaleOnly] = useState(false);

  // Selected car for full-screen detail view (Screenshot 3)
  const [selectedCar, setSelectedCar] = useState<CollectionItem | null>(null);

  // Data State
  const [collections, setCollections] = useState<CollectionItem[]>(showcaseCars);
  const [seriesList] = useState<Series[]>(showcaseSeries);

  // Admin Mode State (Passcode PIN)
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Verify Admin PIN
  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
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
    if (garageSubTab === 'Lists' && !item.is_favorite) return false;
    return matchesSearch;
  });

  // Sorting Logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (selectedSort === 'price-asc') return a.sell_price - b.sell_price;
    if (selectedSort === 'price-desc') return b.sell_price - a.sell_price;
    return 0;
  });

  // Admin Quick Actions
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

  // If viewing single car detail (Screenshot 3)
  if (selectedCar) {
    return (
      <CarDetailView
        car={selectedCar}
        isAdmin={isAdmin}
        onBack={() => setSelectedCar(null)}
        onToggleFavorite={handleToggleFavorite}
        onUpdateQty={handleUpdateQty}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#0c0d10] text-white flex justify-center pb-24">
      {/* Container Frame (Mobile First) */}
      <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-4xl px-4 sm:px-6 pt-4 flex flex-col">
        {/* Status bar placeholder with local time */}
        <div className="flex items-center justify-between text-xs text-gray-400 font-semibold px-1 pb-2">
          <span>9:30</span>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="text-[10px]">5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Top Branding & Admin Access */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-red-600 fill-red-600" />
            <span className="font-black italic tracking-tighter text-xl bg-gradient-to-r from-red-600 via-amber-500 to-red-500 bg-clip-text text-transparent">
              HOT WHEELS
            </span>
          </div>

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
                <span>Admin Aktif</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Login Admin PIN</span>
              </>
            )}
          </button>
        </div>

        {/* SCREEN VIEWS BASED ON BOTTOM TAB BAR */}
        {currentNav === 'discover' ? (
          /* DISCOVER VIEW (Screenshot 1) */
          <DiscoverView
            cars={collections}
            isAdmin={isAdmin}
            onSelectCar={(car) => setSelectedCar(car)}
            onUpdateQty={handleUpdateQty}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : currentNav === 'news' ? (
          /* NEWS VIEW */
          <div className="py-12 text-center text-gray-400 flex flex-col items-center gap-2">
            <h2 className="text-white font-extrabold text-lg">Hot Wheels Collector News</h2>
            <p className="text-xs max-w-xs">
              Rilisan batch terbaru 2026, agenda Red Line Club drops, dan event konvensi kolektor.
            </p>
          </div>
        ) : currentNav === 'profile' ? (
          /* PROFILE VIEW */
          <div className="py-12 text-center text-gray-400 flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#16181f] border border-[#242735] flex items-center justify-center text-white font-bold text-xl">
              W
            </div>
            <h2 className="text-white font-extrabold text-lg">Garasi Wortelemes</h2>
            <p className="text-xs">Kolektor Diecast & Penjual Terpercaya</p>
            {isAdmin && <PortfolioSummary items={collections} />}
          </div>
        ) : (
          /* MY GARAGE VIEW (Screenshots 2 & 4) */
          <>
            <div className="flex items-center justify-between mt-1 mb-2">
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
                  <span>Tambah Mobil</span>
                </button>
              )}
            </div>

            {/* Admin Financial Dashboard (Strictly Hidden from Public) */}
            {isAdmin && <PortfolioSummary items={collections} />}

            {/* Garage Segmented Pills (Vehicles | Series | Lists) */}
            <div className="bg-[#16181f] p-1 rounded-2xl flex items-center border border-[#242735] mb-4">
              <button
                onClick={() => setGarageSubTab('Vehicles')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  garageSubTab === 'Vehicles'
                    ? 'bg-[#0066d6] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Vehicles
              </button>
              <button
                onClick={() => setGarageSubTab('Series')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  garageSubTab === 'Series'
                    ? 'bg-[#0066d6] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Series
              </button>
              <button
                onClick={() => setGarageSubTab('Lists')}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  garageSubTab === 'Lists'
                    ? 'bg-[#0066d6] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Lists
              </button>
            </div>

            {/* Filters Bar & Search Input */}
            <div className="flex flex-col gap-2.5 mb-5">
              {/* Dropdowns (Date Added, Segment, Assortment) */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value as any)}
                  className="bg-[#16181f] border border-[#242735] text-gray-300 px-3 py-1.5 rounded-xl font-semibold shrink-0 focus:outline-none"
                >
                  <option value="newest">Date Added: New-Old</option>
                  <option value="price-asc">Price: Low-High</option>
                  <option value="price-desc">Price: High-Low</option>
                </select>

                <button
                  onClick={() => setFilterForSaleOnly(!filterForSaleOnly)}
                  className={`px-3 py-1.5 rounded-xl font-semibold shrink-0 transition-all ${
                    filterForSaleOnly
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-[#16181f] text-gray-400 border border-[#242735] hover:text-white'
                  }`}
                >
                  For Sale
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by vehicles, SKU, and more"
                  className="w-full bg-[#16181f] border border-[#242735] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6]"
                />
              </div>
            </div>

            {/* SUB-TAB CONTENT */}
            {garageSubTab === 'Series' ? (
              /* Series Set Completion View (Screenshot 2) */
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
              /* Vehicles & Lists Grid 2-Kolom (Screenshots 2 & 4) */
              <div>
                {sortedItems.length === 0 ? (
                  <div className="py-16 text-center text-gray-500 flex flex-col items-center gap-2">
                    <LayoutGrid className="w-10 h-10 stroke-[1.5] text-gray-600" />
                    <p className="text-xs">Tidak ada mobil yang sesuai dengan pencarian.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {sortedItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedCar(item)}
                        className="cursor-pointer"
                      >
                        <DiecastCard
                          item={item}
                          isAdmin={isAdmin}
                          onUpdateQty={handleUpdateQty}
                          onToggleFavorite={handleToggleFavorite}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Floating Quick Camera Button (Screenshot 1 & 2) */}
        <button
          onClick={() => (isAdmin ? setShowAddModal(true) : setShowPinModal(true))}
          className="fixed bottom-20 right-6 z-30 w-12 h-12 rounded-full bg-[#0066d6] text-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,102,214,0.5)] active:scale-90 transition-transform"
          title="Scan atau Tambah Mobil"
        >
          <Camera className="w-6 h-6" />
        </button>
      </div>

      {/* Persistent Bottom Tab Bar (Screenshots 1, 2, 4) */}
      <BottomTabBar activeTab={currentNav} onChangeTab={(tab) => setCurrentNav(tab)} />

      {/* Admin Passcode PIN Modal */}
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
