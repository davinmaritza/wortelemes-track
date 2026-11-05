'use client';

import React, { useState } from 'react';
import { showcaseCars, showcaseSeries } from '@/lib/data/mockData';
import { CollectionItem, Series } from '@/types/diecast';
import { getStoredCollections, saveStoredCollections } from '@/lib/storage/collectionStorage';
import { DiecastCard } from '@/components/diecast/DiecastCard';
import { SeriesSection } from '@/components/diecast/SeriesSection';
import { DiscoverView } from '@/components/diecast/DiscoverView';
import { CarDetailView } from '@/components/diecast/CarDetailView';
import { CollectorJournalView } from '@/components/news/CollectorJournalView';
import { CollectorProfileView } from '@/components/profile/CollectorProfileView';
import { BottomTabBar, AppNavTab } from '@/components/navigation/BottomTabBar';
import { WortelemesLogo } from '@/components/ui/WortelemesLogo';
import {
  Search,
  Flame,
  LayoutGrid,
  ChevronDown,
  Compass,
  Newspaper,
  User,
  SlidersHorizontal,
} from 'lucide-react';

export default function Home() {
  const [currentNav, setCurrentNav] = useState<AppNavTab>('garage');
  const [garageSubTab, setGarageSubTab] = useState<'Vehicles' | 'Series' | 'Lists'>('Vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price-asc' | 'price-desc' | 'name-asc'>('newest');
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [filterForSaleOnly, setFilterForSaleOnly] = useState(false);

  // Selected car for full-screen detail view
  const [selectedCar, setSelectedCar] = useState<CollectionItem | null>(null);

  // Data State
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [seriesList] = useState<Series[]>(showcaseSeries);

  // Sync with Local Storage
  React.useEffect(() => {
    const initialData = getStoredCollections();
    setCollections(initialData);

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CollectionItem[]>;
      if (customEvent.detail) {
        setCollections(customEvent.detail);
      }
    };
    window.addEventListener('diecast-inventory-updated', handleUpdate);
    return () => window.removeEventListener('diecast-inventory-updated', handleUpdate);
  }, []);

  const filteredItems = collections.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tier_badge.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTier =
      selectedTier === 'all' ||
      item.tier_badge?.toLowerCase().includes(selectedTier.toLowerCase());

    if (!matchesSearch || !matchesTier) return false;
    if (filterForSaleOnly && !item.is_for_sale) return false;
    if (garageSubTab === 'Lists' && !item.is_favorite) return false;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (selectedSort === 'price-asc') return a.sell_price - b.sell_price;
    if (selectedSort === 'price-desc') return b.sell_price - a.sell_price;
    if (selectedSort === 'name-asc') return a.name.localeCompare(b.name);
    return b.release_year - a.release_year;
  });

  const handleUpdateQty = (id: string, delta: number) => {
    setCollections((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c
      );
      saveStoredCollections(updated);
      return updated;
    });
  };

  const handleToggleFavorite = (id: string) => {
    setCollections((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, is_favorite: !c.is_favorite } : c
      );
      saveStoredCollections(updated);
      return updated;
    });
  };

  if (selectedCar) {
    return (
      <CarDetailView
        car={selectedCar}
        isAdmin={false}
        onBack={() => setSelectedCar(null)}
        onToggleFavorite={handleToggleFavorite}
        onUpdateQty={handleUpdateQty}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#090a0f] text-[#ededed] flex flex-col items-center pb-24 md:pb-16 selection:bg-blue-600/30">
      {/* DESKTOP TOP NAVIGATION BAR */}
      <header className="hidden md:flex w-full max-w-7xl px-8 py-4 items-center justify-between border-b border-white/[0.06] bg-[#090a0f]/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-8">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <WortelemesLogo className="w-8 h-8" size={32} />
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-widest text-white uppercase font-sans">
                WORTELEMES
              </span>
              <span className="text-[10px] tracking-wider text-gray-400 font-mono -mt-0.5">
                COLLECTOR VAULT
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 bg-[#12131a] p-1 rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setCurrentNav('garage')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentNav === 'garage'
                  ? 'bg-[#1e202c] text-white shadow-sm border border-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Garage</span>
            </button>

            <button
              onClick={() => setCurrentNav('discover')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentNav === 'discover'
                  ? 'bg-[#1e202c] text-white shadow-sm border border-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setCurrentNav('news')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentNav === 'news'
                  ? 'bg-[#1e202c] text-white shadow-sm border border-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5 text-emerald-400" />
              <span>Drops & News</span>
            </button>

            <button
              onClick={() => setCurrentNav('profile')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentNav === 'profile'
                  ? 'bg-[#1e202c] text-white shadow-sm border border-white/10'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span>Curator Profile</span>
            </button>
          </nav>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-gray-400 bg-white/[0.03] border border-white/[0.08] px-3 py-1.5 rounded-xl">
            1:64 Scale Catalog
          </span>
        </div>
      </header>

      {/* MAIN CONTAINER: Full responsive width without artificial clamping */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-3 md:pt-6 flex flex-col">
        {/* MOBILE BRAND HEADER (Clean, no fake status bar) */}
        <div className="md:hidden flex items-center justify-between py-3 border-b border-white/[0.06] mb-4">
          <div className="flex items-center gap-2.5">
            <WortelemesLogo className="w-7 h-7" size={28} />
            <span className="font-black text-sm tracking-wider text-white uppercase">
              WORTELEMES
            </span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 uppercase bg-white/[0.04] border border-white/[0.08] px-2.5 py-1 rounded-lg">
            1:64 GARAGE
          </span>
        </div>

        {/* SCREEN VIEWS */}
        {currentNav === 'discover' ? (
          <DiscoverView
            cars={collections}
            isAdmin={false}
            onSelectCar={(car) => setSelectedCar(car)}
            onUpdateQty={handleUpdateQty}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : currentNav === 'news' ? (
          <CollectorJournalView />
        ) : currentNav === 'profile' ? (
          <CollectorProfileView />
        ) : (
          /* MY GARAGE */
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-1 mb-3">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white font-sans">
                  GARAGE INVENTORY
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  Curated physical diecasts, blister condition ratings, and live collection vault.
                </p>
              </div>

              {/* Sub-Tab Navigation (Vehicles | Series | Lists) */}
              <div className="bg-[#12131a] p-1 rounded-xl flex items-center border border-white/[0.06] w-full sm:w-80">
                <button
                  onClick={() => setGarageSubTab('Vehicles')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    garageSubTab === 'Vehicles'
                      ? 'bg-[#1e202c] text-white shadow-sm border border-white/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Vehicles
                </button>
                <button
                  onClick={() => setGarageSubTab('Series')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    garageSubTab === 'Series'
                      ? 'bg-[#1e202c] text-white shadow-sm border border-white/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Series Sets
                </button>
                <button
                  onClick={() => setGarageSubTab('Lists')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    garageSubTab === 'Lists'
                      ? 'bg-[#1e202c] text-white shadow-sm border border-white/10'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Favorites
                </button>
              </div>
            </div>

            {/* Interactive Filter & Sort Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-4">
              <div className="flex flex-wrap items-center gap-2">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value as any)}
                    className="appearance-none bg-[#12131a] border border-white/[0.08] hover:border-white/20 rounded-xl pl-3 pr-8 py-2 text-xs text-gray-200 focus:outline-none focus:border-white/30 transition-colors cursor-pointer font-medium"
                  >
                    <option value="newest">Sort: Newest Batch</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A - Z</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Tier Filter */}
                <div className="relative">
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="appearance-none bg-[#12131a] border border-white/[0.08] hover:border-white/20 rounded-xl pl-3 pr-8 py-2 text-xs text-gray-200 focus:outline-none focus:border-white/30 transition-colors cursor-pointer font-medium"
                  >
                    <option value="all">All Tiers</option>
                    <option value="RLC">Red Line Club (RLC)</option>
                    <option value="Silver Series">Silver Series</option>
                    <option value="Mainline">Mainline Regular</option>
                    <option value="Super Treasure Hunt">Super Treasure Hunt</option>
                    <option value="Screen Time">Screen Time</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* For Sale Filter Toggle */}
                <button
                  onClick={() => setFilterForSaleOnly(!filterForSaleOnly)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    filterForSaleOnly
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-[#12131a] text-gray-400 hover:text-white border-white/[0.08]'
                  }`}
                >
                  {filterForSaleOnly ? '✓ For Sale Only' : 'For Sale'}
                </button>
              </div>

              {/* Realtime Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter casting name, color, or series..."
                  className="w-full bg-[#12131a] border border-white/[0.08] focus:border-white/30 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Counter & Status Bar */}
            <div className="flex items-center justify-between py-1 text-xs text-gray-400 font-medium mb-3">
              <div className="flex items-center gap-2">
                <span className="text-white font-mono font-bold">
                  {sortedItems.length} Vehicles
                </span>
                <span className="text-gray-600">•</span>
                <span>{collections.filter((c) => c.is_for_sale).length} Available For Purchase</span>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-gray-400 hover:text-white underline"
                >
                  Clear search
                </button>
              )}
            </div>

            {/* SUB-TAB DISPLAY */}
            {garageSubTab === 'Series' ? (
              <div className="flex flex-col gap-4">
                {seriesList.map((series) => {
                  const seriesItems = collections.filter((i) => i.series_id === series.id);
                  return (
                    <SeriesSection
                      key={series.id}
                      series={series}
                      items={seriesItems}
                      isAdmin={false}
                      onSelectCar={(car) => setSelectedCar(car)}
                      onUpdateQty={handleUpdateQty}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  );
                })}
              </div>
            ) : (
              <div>
                {sortedItems.length === 0 ? (
                  <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-2">
                    <LayoutGrid className="w-10 h-10 stroke-[1.5] text-gray-600" />
                    <p className="text-xs">No vehicles found.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 md:gap-3.5">
                    {sortedItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedCar(item)}
                        className="cursor-pointer"
                      >
                        <DiecastCard
                          item={item}
                          isAdmin={false}
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
      </div>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={currentNav} onChangeTab={(tab) => setCurrentNav(tab)} />
    </main>
  );
}
