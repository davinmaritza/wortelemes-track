'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { showcaseSeries } from '@/lib/data/mockData';
import { CollectionItem, Series, ArticleItem, UpcomingDropItem } from '@/types/diecast';
import { PortfolioSummary } from '@/components/admin/PortfolioSummary';
import { DiecastFormModal } from '@/components/admin/DiecastFormModal';
import { QuickPriceEditModal } from '@/components/admin/QuickPriceEditModal';
import { ArticleFormModal } from '@/components/admin/ArticleFormModal';
import { DropFormModal } from '@/components/admin/DropFormModal';
import { WortelemesLogo } from '@/components/ui/WortelemesLogo';
import {
  getStoredCollections,
  saveStoredCollections,
  resetStoredCollections,
} from '@/lib/storage/collectionStorage';
import {
  getStoredArticles,
  saveStoredArticles,
  getStoredDrops,
  saveStoredDrops,
  resetStoredNews,
} from '@/lib/storage/newsStorage';
import {
  Lock,
  Unlock,
  Plus,
  Trash2,
  Edit3,
  Search,
  ChevronLeft,
  DollarSign,
  TrendingUp,
  Package,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
  CheckSquare,
  Square,
  RotateCcw,
  SlidersHorizontal,
  Newspaper,
  Calendar,
  Sparkles,
  BookOpen,
  Clock,
  FileText,
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Tab State: 'inventory' | 'journal'
  const [activeAdminTab, setActiveAdminTab] = useState<'inventory' | 'journal'>('inventory');

  // Data Collections with Local Persistence
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [seriesList] = useState<Series[]>(showcaseSeries);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');

  // Multi-Selection State for Select All / Bulk Delete
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Diecast Modals State
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
  const [priceEditingItem, setPriceEditingItem] = useState<CollectionItem | null>(null);

  // News Journal & Drop Calendar State
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [drops, setDrops] = useState<UpcomingDropItem[]>([]);
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [showDropModal, setShowDropModal] = useState(false);
  const [editingDrop, setEditingDrop] = useState<UpcomingDropItem | null>(null);

  // Load from Storage on Mount
  useEffect(() => {
    const data = getStoredCollections();
    setCollections(data);
    setArticles(getStoredArticles());
    setDrops(getStoredDrops());

    const handleInventoryUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CollectionItem[]>;
      if (customEvent.detail) {
        setCollections(customEvent.detail);
      }
    };

    const handleJournalUpdate = () => {
      setArticles(getStoredArticles());
      setDrops(getStoredDrops());
    };

    window.addEventListener('diecast-inventory-updated', handleInventoryUpdate);
    window.addEventListener('journal-data-updated', handleJournalUpdate);

    return () => {
      window.removeEventListener('diecast-inventory-updated', handleInventoryUpdate);
      window.removeEventListener('journal-data-updated', handleJournalUpdate);
    };
  }, []);

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === '0000') {
      setIsAuthenticated(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleSaveItem = (savedItem: CollectionItem) => {
    setCollections((prev) => {
      const exists = prev.some((item) => item.id === savedItem.id);
      const updated = exists
        ? prev.map((item) => (item.id === savedItem.id ? savedItem : item))
        : [savedItem, ...prev];
      saveStoredCollections(updated);
      return updated;
    });
    setEditingItem(null);
  };

  const handleDeleteSingle = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the garage?`)) {
      setCollections((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        saveStoredCollections(updated);
        return updated;
      });
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleToggleForSale = (id: string) => {
    setCollections((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, is_for_sale: !item.is_for_sale } : item
      );
      saveStoredCollections(updated);
      return updated;
    });
  };

  const handleUpdatePrice = (id: string, buyPrice: number, sellPrice: number) => {
    setCollections((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, buy_price: buyPrice, sell_price: sellPrice } : item
      );
      saveStoredCollections(updated);
      return updated;
    });
  };

  const handleResetToDefault = () => {
    if (confirm('Reset all garage inventory to default catalog? Custom changes will be restored to defaults.')) {
      const def = resetStoredCollections();
      setCollections(def);
      setSelectedIds([]);
    }
  };

  // Article CRUD Handlers
  const handleSaveArticle = (savedArticle: ArticleItem) => {
    setArticles((prev) => {
      const exists = prev.some((a) => a.id === savedArticle.id);
      const updated = exists
        ? prev.map((a) => (a.id === savedArticle.id ? savedArticle : a))
        : [savedArticle, ...prev];
      saveStoredArticles(updated);
      return updated;
    });
    setEditingArticle(null);
  };

  const handleDeleteArticle = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete article "${title}"?`)) {
      setArticles((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        saveStoredArticles(updated);
        return updated;
      });
    }
  };

  // Drop Event CRUD Handlers
  const handleSaveDrop = (savedDrop: UpcomingDropItem) => {
    setDrops((prev) => {
      const exists = prev.some((d) => d.id === savedDrop.id);
      const updated = exists
        ? prev.map((d) => (d.id === savedDrop.id ? savedDrop : d))
        : [savedDrop, ...prev];
      saveStoredDrops(updated);
      return updated;
    });
    setEditingDrop(null);
  };

  const handleDeleteDrop = (id: string, model: string) => {
    if (confirm(`Are you sure you want to remove release drop event "${model}"?`)) {
      setDrops((prev) => {
        const updated = prev.filter((d) => d.id !== id);
        saveStoredDrops(updated);
        return updated;
      });
    }
  };

  const handleResetNewsToDefault = () => {
    if (confirm('Reset all journal articles and release drops to default?')) {
      const def = resetStoredNews();
      setArticles(def.articles);
      setDrops(def.drops);
    }
  };

  // Filter items based on search and tier filter
  const filteredItems = collections.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tier_badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || item.tier_badge === tierFilter;
    return matchesSearch && matchesTier;
  });

  // Checkbox Select All Logic
  const allFilteredSelected =
    filteredItems.length > 0 &&
    filteredItems.every((item) => selectedIds.includes(item.id));

  const handleToggleSelectAll = () => {
    if (allFilteredSelected) {
      // Unselect all currently filtered items
      const filteredIdSet = new Set(filteredItems.map((item) => item.id));
      setSelectedIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      // Select all currently filtered items
      const newSelected = new Set([...selectedIds, ...filteredItems.map((item) => item.id)]);
      setSelectedIds(Array.from(newSelected));
    }
  };

  const handleToggleRowSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk Delete Action
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    if (
      confirm(
        `WARNING: Are you sure you want to delete ${selectedIds.length} selected vehicles?`
      )
    ) {
      setCollections((prev) => {
        const updated = prev.filter((item) => !selectedIds.includes(item.id));
        saveStoredCollections(updated);
        return updated;
      });
      setSelectedIds([]);
    }
  };

  // Bulk Mark For Sale Action
  const handleBulkToggleSale = (status: boolean) => {
    if (selectedIds.length === 0) return;
    setCollections((prev) => {
      const updated = prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, is_for_sale: status } : item
      );
      saveStoredCollections(updated);
      return updated;
    });
  };

  // RENDER: LOGIN PIN FORM JIKA BELUM TERVERIFIKASI
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0c0d10] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#16181f] border border-[#242735] rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl">
          <div className="flex items-center gap-3 mb-5">
            <WortelemesLogo className="w-10 h-10" size={40} />
            <span className="font-black text-xl tracking-wider text-white uppercase">
              WORTELEMES
            </span>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-black uppercase tracking-tight text-white text-center">
            ADMIN GARAGE PORTAL
          </h1>
          <p className="text-xs text-gray-400 text-center mt-1 mb-6 leading-relaxed">
            Private owner access to manage private cost records, market values, rapid price adjustments, and inventory.
          </p>

          <form onSubmit={handleVerifyPin} className="w-full flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-400 block mb-1">
                MASTER PASSCODE PIN
              </label>
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="••••"
                className={`w-full bg-[#111217] border ${
                  pinError ? 'border-red-500 ring-2 ring-red-500/20' : 'border-[#242735]'
                } rounded-xl px-4 py-3 text-center text-white tracking-[0.5em] text-xl font-mono focus:outline-none focus:border-[#0066d6] transition-all`}
                autoFocus
              />
              {pinError && (
                <span className="text-red-400 text-xs text-center block mt-1.5 font-medium">
                  Invalid PIN. Try default: 1234
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#0066d6] hover:bg-blue-600 active:scale-98 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              Access Admin Dashboard
            </button>

            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-300 text-center mt-2 flex items-center justify-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Back to Public Showcase
            </Link>
          </form>
        </div>
      </main>
    );
  }

  // RENDER: DASHBOARD ADMIN LENGKAP (SUDAH LOGIN)
  return (
    <main className="min-h-screen bg-[#0c0d10] text-white flex flex-col items-center pb-24">
      {/* Top Admin Header */}
      <header className="w-full max-w-7xl px-4 sm:px-8 py-3.5 border-b border-[#1f222e] bg-[#121318]/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <WortelemesLogo className="w-8 h-8" size={32} />
          <span className="font-black text-sm tracking-wider text-white uppercase">
            WORTELEMES
          </span>
          <span className="text-[10px] font-black uppercase bg-red-950/80 text-red-400 border border-red-800/40 px-2.5 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Admin Workspace
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {activeAdminTab === 'inventory' ? (
            <>
              <button
                onClick={() => {
                  setEditingItem(null);
                  setShowFormModal(true);
                }}
                className="flex items-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white font-black text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Vehicle</span>
              </button>

              <button
                onClick={handleResetToDefault}
                className="hidden md:flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-[#1a1d26] border border-[#242735] px-2.5 py-2 rounded-xl transition-colors"
                title="Reset to default catalog"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Default</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setShowArticleModal(true);
                }}
                className="flex items-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white font-black text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow"
              >
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </button>

              <button
                onClick={() => {
                  setEditingDrop(null);
                  setShowDropModal(true);
                }}
                className="flex items-center gap-1.5 bg-[#1e2330] hover:bg-[#282f40] text-blue-400 border border-blue-500/30 font-bold text-xs px-3 py-2 rounded-xl active:scale-95 transition-all"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add Drop</span>
              </button>

              <button
                onClick={handleResetNewsToDefault}
                className="hidden md:flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-[#1a1d26] border border-[#242735] px-2.5 py-2 rounded-xl transition-colors"
                title="Reset news to default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset News</span>
              </button>
            </>
          )}

          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white bg-[#1a1d26] border border-[#242735] px-3 py-2 rounded-xl transition-colors font-medium"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Public Showcase</span>
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-950/30 border border-red-900/30 px-3 py-2 rounded-xl transition-colors font-bold"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="w-full max-w-7xl px-4 sm:px-8 pt-6 flex flex-col gap-6">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-[#242735] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveAdminTab('inventory')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'inventory'
                  ? 'bg-[#0066d6] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-[#14151b] text-gray-400 hover:text-white border border-[#242735]'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Vehicles & Inventory</span>
              <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-mono text-gray-300">
                {collections.length}
              </span>
            </button>

            <button
              onClick={() => setActiveAdminTab('journal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeAdminTab === 'journal'
                  ? 'bg-[#0066d6] text-white shadow-lg shadow-blue-500/20'
                  : 'bg-[#14151b] text-gray-400 hover:text-white border border-[#242735]'
              }`}
            >
              <Newspaper className="w-3.5 h-3.5" />
              <span>News Articles & Release Radar</span>
              <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-mono text-gray-300">
                {articles.length + drops.length}
              </span>
            </button>
          </div>

          <div className="text-xs text-gray-400 hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-gray-400">Sync Live to Showcase</span>
          </div>
        </div>

        {activeAdminTab === 'inventory' ? (
          <>
            {/* Ringkasan Portofolio & Keuangan */}
            <PortfolioSummary items={collections} />

        {/* Inventory Control Table / List Card */}
        <div className="bg-[#14151b] border border-[#242735] rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl">
          {/* Header Controls: Title & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black uppercase text-white tracking-tight">
                  Inventory & Pricing Management
                </h2>
                <span className="text-[11px] font-mono font-bold bg-[#1e212b] text-gray-300 px-2 py-0.5 rounded-full border border-[#2d3142]">
                  {collections.length} Units
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Manage vehicles, adjust cost and market prices, toggle sale availability, and perform bulk operations.
              </p>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Tier Filter */}
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-[#1a1d26] border border-[#242735] rounded-xl px-2.5 py-2 text-xs text-gray-200 focus:outline-none focus:border-[#0066d6]"
              >
                <option value="all">All Tiers</option>
                <option value="Mainline">Mainline</option>
                <option value="Silver Series">Silver Series</option>
                <option value="RLC">RLC</option>
                <option value="Hot Wheels XL">Hot Wheels XL</option>
                <option value="Super Treasure Hunt">STH</option>
                <option value="Screen Time">Screen Time</option>
              </select>

              {/* Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vehicle or series..."
                  className="w-full bg-[#1a1d26] border border-[#242735] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6]"
                />
              </div>
            </div>
          </div>

          {/* Bulk Action Banner when items are selected */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-red-950/20 border border-red-900/40 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-xs font-bold text-red-300">
                  {selectedIds.length} vehicles selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkToggleSale(true)}
                  className="bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border border-emerald-800/40 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Set For Sale
                </button>
                <button
                  onClick={() => handleBulkToggleSale(false)}
                  className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Set NFS
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 hover:bg-red-700 active:scale-95 text-white text-[11px] font-black px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete ({selectedIds.length})</span>
                </button>
                <button
                  onClick={() => setSelectedIds([])}
                  className="text-xs text-gray-400 hover:text-white px-2 py-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Desktop Table View */}
          <div className="overflow-x-auto rounded-xl border border-[#242735]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#111217] border-b border-[#242735] text-gray-400 font-bold uppercase text-[10px]">
                  {/* Select All Checkbox */}
                  <th className="py-3 px-3 w-10 text-center">
                    <button
                      type="button"
                      onClick={handleToggleSelectAll}
                      className="text-gray-400 hover:text-white transition-colors"
                      title={allFilteredSelected ? 'Deselect all' : 'Select all'}
                    >
                      {allFilteredSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#0066d6]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-3">Vehicle</th>
                  <th className="py-3 px-3">Series / Tier</th>
                  <th className="py-3 px-3">Condition</th>
                  <th className="py-3 px-3">Cost Price (Private)</th>
                  <th className="py-3 px-3">Market Value</th>
                  <th className="py-3 px-3">Profit Margin</th>
                  <th className="py-3 px-3">Sale Status</th>
                  <th className="py-3 px-3 text-right">Actions & Adjust</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242735]/60 bg-[#14151b]">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-500">
                      No vehicles found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const profit = (item.sell_price || 0) - (item.buy_price || 0);
                    const marginPercent =
                      item.buy_price && item.buy_price > 0
                        ? Math.round((profit / item.buy_price) * 100)
                        : 0;
                    const isSelected = selectedIds.includes(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#1a1d26]/60 transition-colors ${
                          isSelected ? 'bg-blue-950/20' : ''
                        }`}
                      >
                        {/* Row Selection Checkbox */}
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleRowSelect(item.id)}
                            className="text-gray-400 hover:text-white transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#0066d6]" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-600" />
                            )}
                          </button>
                        </td>

                        {/* Car Thumbnail & Name */}
                        <td className="py-3 px-3 flex items-center gap-3">
                          <div className="relative w-12 h-9 bg-white rounded-lg p-1 shrink-0 overflow-hidden border border-[#242735]">
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-extrabold text-white uppercase block leading-tight">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-400 font-mono">
                              {item.release_year} • {item.color} • Qty: {item.qty}
                            </span>
                          </div>
                        </td>

                        {/* Series / Tier */}
                        <td className="py-3 px-3">
                          <span className="bg-[#242735] text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase inline-block">
                            {item.tier_badge}
                          </span>
                        </td>

                        {/* Condition */}
                        <td className="py-3 px-3 text-gray-300">
                          {item.condition}
                        </td>

                        {/* Buy Price (Modal Privat) */}
                        <td className="py-3 px-3 font-mono font-bold text-red-400 whitespace-nowrap">
                          Rp {item.buy_price?.toLocaleString('id-ID')}
                        </td>

                        {/* Sell Price (Pasaran) */}
                        <td className="py-3 px-3 font-mono font-bold text-white whitespace-nowrap">
                          Rp {item.sell_price?.toLocaleString('id-ID')}
                        </td>

                        {/* Margin Profit */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`font-bold font-mono text-[11px] ${
                              profit >= 0 ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {profit >= 0 ? '+' : ''}Rp {profit.toLocaleString('id-ID')} ({marginPercent}%)
                          </span>
                        </td>

                        {/* For Sale Toggle Button */}
                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleForSale(item.id)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                              item.is_for_sale
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40 hover:bg-emerald-900'
                                : 'bg-gray-800/60 text-gray-400 border-gray-700/40 hover:bg-gray-700'
                            }`}
                          >
                            {item.is_for_sale ? 'For Sale' : 'NFS'}
                          </button>
                        </td>

                        {/* Actions: Quick Price Edit, Full Edit, Delete */}
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Fast Price Adjust Button */}
                            <button
                              onClick={() => setPriceEditingItem(item)}
                              className="p-1.5 rounded-lg bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/60 transition-colors border border-emerald-800/30"
                              title="Quick Price Adjust"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>

                            {/* Full Edit Modal */}
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowFormModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-[#242735] text-gray-200 hover:bg-[#0066d6] hover:text-white transition-colors"
                              title="Edit Vehicle"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete Single */}
                            <button
                              onClick={() => handleDeleteSingle(item.id, item.name)}
                              className="p-1.5 rounded-lg bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:text-red-200 transition-colors border border-red-900/20"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
          </>
        ) : (
          /* News & Release Drop Radar Management */
          <div className="flex flex-col gap-6">
            {/* Release Drop Radar Manager */}
            <div className="bg-[#14151b] border border-[#242735] rounded-2xl p-4 sm:p-6 flex flex-col gap-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      Release Drop Radar
                    </h2>
                    <span className="text-[11px] font-mono font-bold bg-[#1e212b] text-gray-300 px-2 py-0.5 rounded-full border border-[#2d3142]">
                      {drops.length} Drops
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Manage upcoming release dates, case waves, and retail drop status shown in the public Drop Radar.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingDrop(null);
                    setShowDropModal(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white font-black text-xs px-3.5 py-2.5 rounded-xl active:scale-95 transition-all shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Drop Event</span>
                </button>
              </div>

              {drops.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-[#242735] rounded-xl bg-[#0f1015]">
                  <Calendar className="w-10 h-10 text-gray-600 mb-2" />
                  <p className="text-sm font-bold text-gray-400">No scheduled drops found</p>
                  <p className="text-xs text-gray-500 max-w-sm mt-1">
                    Add upcoming Hot Wheels releases or restock events to keep collectors informed.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {drops.map((drop) => {
                    const statusColor =
                      drop.status === 'Confirmed'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50'
                        : drop.status === 'Live'
                        ? 'bg-blue-950/60 text-blue-400 border-blue-800/50'
                        : drop.status === 'Sold Out'
                        ? 'bg-red-950/60 text-red-400 border-red-800/50'
                        : 'bg-amber-950/60 text-amber-400 border-amber-800/50';

                    return (
                      <div
                        key={drop.id}
                        className="bg-[#1a1d26] border border-[#242735] hover:border-[#383d54] rounded-xl p-4 flex flex-col justify-between gap-3 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#0066d6]/20 border border-[#0066d6]/40 text-blue-400 font-mono font-black text-[11px] px-2 py-1 rounded-lg">
                              {drop.month} {drop.date}
                            </span>
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${statusColor}`}
                            >
                              {drop.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingDrop(drop);
                                setShowDropModal(true);
                              }}
                              className="p-1.5 rounded-lg bg-[#242735] text-gray-200 hover:bg-[#0066d6] hover:text-white transition-colors"
                              title="Edit Drop"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteDrop(drop.id, drop.model)}
                              className="p-1.5 rounded-lg bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:text-red-200 transition-colors border border-red-900/20"
                              title="Delete Drop"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-bold text-white text-sm leading-snug line-clamp-1">
                            {drop.model}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1 font-medium">
                            {drop.series}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Collector Journal Articles Manager */}
            <div className="bg-[#14151b] border border-[#242735] rounded-2xl p-4 sm:p-6 flex flex-col gap-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black uppercase text-white tracking-tight flex items-center gap-2">
                      <Newspaper className="w-5 h-5 text-blue-400" />
                      Collector Journal Stories & Articles
                    </h2>
                    <span className="text-[11px] font-mono font-bold bg-[#1e212b] text-gray-300 px-2 py-0.5 rounded-full border border-[#2d3142]">
                      {articles.length} Stories
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Publish market analyses, collector spotlights, and valuation insights readable on the public showcase.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingArticle(null);
                    setShowArticleModal(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white font-black text-xs px-3.5 py-2.5 rounded-xl active:scale-95 transition-all shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write Article</span>
                </button>
              </div>

              {articles.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-[#242735] rounded-xl bg-[#0f1015]">
                  <FileText className="w-10 h-10 text-gray-600 mb-2" />
                  <p className="text-sm font-bold text-gray-400">No articles published yet</p>
                  <p className="text-xs text-gray-500 max-w-sm mt-1">
                    Create your first article or guide to share expertise with fellow diecast collectors.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {articles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-[#1a1d26] border border-[#242735] hover:border-[#383d54] rounded-xl p-5 flex flex-col justify-between gap-3 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase bg-blue-950/60 text-blue-400 border border-blue-800/40 px-2 py-0.5 rounded-md">
                            {article.category}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-gray-300 bg-[#242735] px-2 py-0.5 rounded-md">
                            #{article.tag}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingArticle(article);
                              setShowArticleModal(true);
                            }}
                            className="p-1.5 rounded-lg bg-[#242735] text-gray-200 hover:bg-[#0066d6] hover:text-white transition-colors"
                            title="Edit Article"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(article.id, article.title)}
                            className="p-1.5 rounded-lg bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:text-red-200 transition-colors border border-red-900/20"
                            title="Delete Article"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-bold text-white text-base leading-snug group-hover:text-blue-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-[#242735]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-400" />
                            {article.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            {article.readTime}
                          </span>
                        </div>
                        {article.content && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-2 py-0.5 rounded font-medium">
                            Full Story Attached
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Diecast */}
      <DiecastFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingItem(null);
        }}
        seriesList={seriesList}
        itemToEdit={editingItem}
        onSave={handleSaveItem}
      />

      {/* Modal Quick Price Adjustment */}
      <QuickPriceEditModal
        isOpen={Boolean(priceEditingItem)}
        onClose={() => setPriceEditingItem(null)}
        item={priceEditingItem}
        onSave={handleUpdatePrice}
      />

      {/* Modal Add / Edit Article */}
      <ArticleFormModal
        isOpen={showArticleModal}
        onClose={() => {
          setShowArticleModal(false);
          setEditingArticle(null);
        }}
        articleToEdit={editingArticle}
        onSave={handleSaveArticle}
      />

      {/* Modal Add / Edit Drop Event */}
      <DropFormModal
        isOpen={showDropModal}
        onClose={() => {
          setShowDropModal(false);
          setEditingDrop(null);
        }}
        dropToEdit={editingDrop}
        onSave={handleSaveDrop}
      />
    </main>
  );
}
