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
    <main className="min-h-screen bg-[#000000] text-white flex flex-col items-center pb-24 md:pb-12">
      {/* DESKTOP TOP NAVIGATION BAR */}
      <header className="hidden md:flex w-full max-w-7xl px-8 py-3.5 items-center justify-between border-b border-[#1f222e] bg-[#0c0d10]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-8">
          {/* Wortelemes Brand */}
          <div className="flex items-center gap-3">
            <WortelemesLogo className="w-8 h-8" size={32} />
            <span className="font-black text-sm tracking-wider text-white uppercase">
              WORTELEMES
            </span>
            <span className="font-extrabold text-xs tracking-widest text-gray-400 uppercase border-l border-[#242735] pl-3">
              SHOWCASE
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-2">
            <button
              onClick={() => setCurrentNav('garage')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentNav === 'garage'
                  ? 'bg-[#0066d6] text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#16181f]'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>My Garage</span>
            </button>

            <button
              onClick={() => setCurrentNav('discover')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentNav === 'discover'
                  ? 'bg-[#0066d6] text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#16181f]'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => setCurrentNav('news')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentNav === 'news'
                  ? 'bg-[#0066d6] text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#16181f]'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>News</span>
            </button>

            <button
              onClick={() => setCurrentNav('profile')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                currentNav === 'profile'
                  ? 'bg-[#0066d6] text-white shadow'
                  : 'text-gray-400 hover:text-white hover:bg-[#16181f]'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>
          </nav>
        </div>

        {/* Right Desktop Info */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold tracking-wider text-gray-400 uppercase bg-[#16181f] border border-[#242735] px-3.5 py-1.5 rounded-xl">
            Diecast Garage
          </span>
        </div>
      </header>

      {/* MAIN CONTAINER: Responsive Width */}
      <div className="w-full max-w-[430px] md:max-w-6xl lg:max-w-7xl px-4 md:px-8 pt-3 md:pt-6 flex flex-col">
        {/* MOBILE ONLY: Top Status Bar */}
        <div className="md:hidden flex items-center justify-between text-[11px] text-gray-400 font-semibold px-2 pb-1.5">
          <span>9:30</span>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="text-[9px]">5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* MOBILE ONLY: Brand Header (No Hot Wheels logo & No Admin Button) */}
        <div className="md:hidden flex items-center justify-between pb-3 pt-1">
          <div className="flex items-center gap-2.5">
            <WortelemesLogo className="w-8 h-8" size={32} />
            <span className="font-black text-sm tracking-wider text-white uppercase">
              WORTELEMES
            </span>
          </div>
          <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase bg-[#16181f] border border-[#242735] px-2.5 py-1 rounded-full">
            SHOWCASE
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-1 mb-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-white font-sans">
                  MY GARAGE
                </h1>
              </div>
            </div>

            {/* Sub-Tab Navigation (Vehicles | Series | Lists) */}
            <div className="bg-[#14151a] p-1 rounded-full flex items-center border border-[#22242e] w-full md:w-96 mb-3">
              <button
                onClick={() => setGarageSubTab('Vehicles')}
                className={`flex-1 py-1.5 md:py-2 text-xs font-bold rounded-full transition-all ${
                  garageSubTab === 'Vehicles'
                    ? 'bg-[#0066d6] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Vehicles
              </button>
              <button
                onClick={() => setGarageSubTab('Series')}
                className={`flex-1 py-1.5 md:py-2 text-xs font-bold rounded-full transition-all ${
                  garageSubTab === 'Series'
                    ? 'bg-[#0066d6] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Series
              </button>
              <button
                onClick={() => setGarageSubTab('Lists')}
                className={`flex-1 py-1.5 md:py-2 text-xs font-bold rounded-full transition-all ${
                  garageSubTab === 'Lists'
                    ? 'bg-[#0066d6] text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Lists
              </button>
            </div>

            {/* Interactive Filter & Sort Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value as any)}
                    className="appearance-none bg-[#14151b] border border-white/10 hover:border-white/20 rounded-xl pl-3 pr-8 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#0066d6] transition-colors cursor-pointer font-medium"
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
                    className="appearance-none bg-[#14151b] border border-white/10 hover:border-white/20 rounded-xl pl-3 pr-8 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#0066d6] transition-colors cursor-pointer font-medium"
                  >
                    <option value="all">All Categories</option>
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
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    filterForSaleOnly
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                      : 'bg-[#14151b] text-gray-400 hover:text-white border-white/10'
                  }`}
                >
                  {filterForSaleOnly ? '✓ For Sale Only' : 'For Sale Only'}
                </button>
              </div>

              {/* Realtime Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by casting, color, or tier..."
                  className="w-full bg-[#14151b] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6] transition-colors"
                />
              </div>
            </div>

            {/* Counter & Status Bar */}
            <div className="flex items-center justify-between py-1 text-xs text-gray-400 font-semibold mb-2">
              <div className="flex items-center gap-2">
                <span className="text-white font-mono font-bold">
                  {sortedItems.length} Vehicles
                </span>
                <span className="text-gray-600">•</span>
                <span>{collections.filter((c) => c.is_for_sale).length} Available For Sale</span>
              </div>

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-[11px] text-blue-400 hover:underline"
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
