'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { showcaseCars, showcaseSeries } from '@/lib/data/mockData';
import { CollectionItem, Series } from '@/types/diecast';
import { getStoredCollections, saveStoredCollections } from '@/lib/storage/collectionStorage';
import { DiecastCard } from '@/components/diecast/DiecastCard';
import { SeriesSection } from '@/components/diecast/SeriesSection';
import { DiscoverView } from '@/components/diecast/DiscoverView';
import { CarDetailView } from '@/components/diecast/CarDetailView';
import { BottomTabBar, AppNavTab } from '@/components/navigation/BottomTabBar';
import { PortfolioSummary } from '@/components/admin/PortfolioSummary';
import { DiecastFormModal } from '@/components/admin/DiecastFormModal';
import { HotWheelsFlameLogo } from '@/components/ui/HotWheelsLogo';
import { WortelemesLogo } from '@/components/ui/WortelemesLogo';
import {
  Search,
  Lock,
  Unlock,
  Plus,
  Flame,
  LayoutGrid,
  Camera,
  ChevronDown,
  Compass,
  Newspaper,
  User,
} from 'lucide-react';

export default function Home() {
  const [currentNav, setCurrentNav] = useState<AppNavTab>('garage');
  const [garageSubTab, setGarageSubTab] = useState<'Vehicles' | 'Series' | 'Lists'>('Vehicles');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');
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

  // Admin Mode State (Passcode PIN)
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const filteredItems = collections.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tier_badge.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterForSaleOnly && !item.is_for_sale) return false;
    if (garageSubTab === 'Lists' && !item.is_favorite) return false;
    return matchesSearch;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (selectedSort === 'price-asc') return a.sell_price - b.sell_price;
    if (selectedSort === 'price-desc') return b.sell_price - a.sell_price;
    return 0;
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

  const handleAddItem = (newItem: CollectionItem) => {
    setCollections((prev) => {
      const updated = [newItem, ...prev];
      saveStoredCollections(updated);
      return updated;
    });
  };

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
    <main className="min-h-screen bg-[#000000] text-white flex flex-col items-center pb-24 md:pb-12">
      {/* DESKTOP TOP NAVIGATION BAR */}
      <header className="hidden md:flex w-full max-w-7xl px-8 py-3.5 items-center justify-between border-b border-[#1f222e] bg-[#0c0d10]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-8">
          {/* Authentic Flame Logo & Wortelemes Brand */}
          <div className="flex items-center gap-3">
            <WortelemesLogo className="w-8 h-8" size={32} />
            <HotWheelsFlameLogo className="w-26 h-7" />
            <span className="font-extrabold text-sm tracking-widest text-gray-400 uppercase border-l border-[#242735] pl-3">
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

        {/* Right Desktop Controls */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 bg-[#16181f] hover:bg-[#20232d] text-gray-200 border border-[#242735] hover:border-red-500/50 px-3.5 py-2 rounded-xl text-xs font-bold transition-all"
            title="Buka Garasi Admin Portal"
          >
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span>Garasi Admin</span>
          </Link>

          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl shadow active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Koleksi</span>
            </button>
          )}

          <button
            onClick={() => (isAdmin ? setIsAdmin(false) : setShowPinModal(true))}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              isAdmin
                ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                : 'bg-[#16181f] text-gray-300 border border-[#242735] hover:text-white'
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
                <span>Quick PIN</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER: Responsive Width */}
      <div className="w-full max-w-[430px] md:max-w-6xl lg:max-w-7xl px-4 md:px-8 pt-3 md:pt-6 flex flex-col">
        {/* MOBILE ONLY: Top Status Bar & Centered Flame Logo */}
        <div className="md:hidden flex items-center justify-between text-[11px] text-gray-400 font-semibold px-2 pb-1.5">
          <span>9:30</span>
          <div className="flex items-center gap-1.5 text-gray-300">
            <span className="text-[9px]">5G</span>
            <span>100%</span>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between pb-3 pt-1">
          <Link
            href="/admin"
            className="flex items-center gap-1.5"
            title="Garasi Admin"
          >
            <WortelemesLogo className="w-8 h-8" size={32} />
          </Link>

          {/* Centered Hot Wheels Logo on Mobile */}
          <HotWheelsFlameLogo className="w-26 h-7" />

          <button
            onClick={() => (isAdmin ? setIsAdmin(false) : setShowPinModal(true))}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            title="Admin PIN"
          >
            {isAdmin ? <Unlock className="w-4 h-4 text-red-400" /> : <Lock className="w-4 h-4" />}
          </button>
        </div>

        {/* SCREEN VIEWS */}
        {currentNav === 'discover' ? (
          <DiscoverView
            cars={collections}
            isAdmin={isAdmin}
            onSelectCar={(car) => setSelectedCar(car)}
            onUpdateQty={handleUpdateQty}
            onToggleFavorite={handleToggleFavorite}
          />
        ) : currentNav === 'news' ? (
          <div className="py-24 text-center text-gray-400 flex flex-col items-center gap-2">
            <h2 className="text-white font-extrabold text-xl">Hot Wheels Collector News</h2>
            <p className="text-xs max-w-sm text-gray-500 mt-1">
              Agenda drop RLC, update rilisan batch 2026, dan liputan diecast terkini dari seluruh dunia.
            </p>
          </div>
        ) : currentNav === 'profile' ? (
          <div className="py-16 text-center text-gray-400 flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full bg-[#16181f] border-2 border-[#242735] overflow-hidden shadow-2xl">
              <img
                src="/logo.png"
                alt="Wortelemes Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-white font-extrabold text-2xl">Garasi Wortelemes</h2>
            <p className="text-xs text-gray-400">Kolektor Diecast & Penjual Terpercaya</p>
            {isAdmin && <PortfolioSummary items={collections} />}
          </div>
        ) : (
          /* MY GARAGE */
          <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mt-1 mb-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-white font-sans">
                  MY GARAGE
                </h1>
              </div>

              {isAdmin && (
                <div className="md:hidden flex justify-end">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1 bg-[#0066d6] hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow active:scale-95 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah</span>
                  </button>
                </div>
              )}
            </div>

            {/* Financial Summary (Only shown for admin) */}
            {isAdmin && <PortfolioSummary items={collections} />}

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

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 mb-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
                <div className="flex items-center gap-1 bg-[#16181f] border border-[#232632] px-3 py-1.5 rounded-full text-gray-300 font-medium shrink-0">
                  <span>Date Added: New-Old</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </div>
                <div className="flex items-center gap-1 bg-[#16181f] border border-[#232632] px-3 py-1.5 rounded-full text-gray-300 font-medium shrink-0">
                  <span>Segment</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </div>
                <div className="flex items-center gap-1 bg-[#16181f] border border-[#232632] px-3 py-1.5 rounded-full text-gray-300 font-medium shrink-0">
                  <span>Assortment</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by vehicles, SKU, and more"
                  className="w-full bg-[#16181f] border border-[#232632] rounded-[14px] pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6]"
                />
              </div>
            </div>

            {/* Counter Bar: 181 / 250 Vehicles [Upgrade] [Select] (Sesuai Screenshot 2) */}
            <div className="flex items-center justify-between py-2 text-xs text-gray-400 font-semibold mb-1">
              <div className="flex items-center gap-2">
                <span>{collections.reduce((sum, i) => sum + (i.qty || 1), 0)} / 250 Vehicles</span>
                <span className="bg-[#0066d6] text-white text-[9.5px] font-black px-2 py-0.5 rounded-full">
                  Upgrade
                </span>
              </div>
              <button className="text-[#0066d6] hover:text-blue-400 font-bold text-xs">
                Select
              </button>
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
                      isAdmin={isAdmin}
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
                    <p className="text-xs">Tidak ada mobil ditemukan.</p>
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

        {/* Floating Camera Button (Hanya di mobile) */}
        <button
          onClick={() => (isAdmin ? setShowAddModal(true) : setShowPinModal(true))}
          className="md:hidden fixed bottom-20 right-6 z-30 w-12 h-12 rounded-full bg-[#0066d6] text-white flex items-center justify-center shadow-[0_4px_25px_rgba(0,102,214,0.6)] active:scale-90 transition-transform"
          title="Scan Foto Diecast"
        >
          <Camera className="w-6 h-6" />
        </button>
      </div>

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar activeTab={currentNav} onChangeTab={(tab) => setCurrentNav(tab)} />

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
      <DiecastFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        seriesList={seriesList}
        onSave={handleAddItem}
      />
    </main>
  );
}
