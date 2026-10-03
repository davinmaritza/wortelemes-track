'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { showcaseCars, showcaseSeries } from '@/lib/data/mockData';
import { CollectionItem, Series } from '@/types/diecast';
import { PortfolioSummary } from '@/components/admin/PortfolioSummary';
import { AddDiecastModal } from '@/components/admin/AddDiecastModal';
import { HotWheelsFlameLogo } from '@/components/ui/HotWheelsLogo';
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
} from 'lucide-react';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Data Collections
  const [collections, setCollections] = useState<CollectionItem[]>(showcaseCars);
  const [seriesList] = useState<Series[]>(showcaseSeries);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Edit State
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);

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

  const handleAddItem = (newItem: CollectionItem) => {
    setCollections((prev) => [newItem, ...prev]);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Yakin ingin menghapus mobil ini dari database?')) {
      setCollections((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleToggleForSale = (id: string) => {
    setCollections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_for_sale: !item.is_for_sale } : item))
    );
  };

  const handleUpdatePrice = (id: string, buyPrice: number, sellPrice: number) => {
    setCollections((prev) =>
      prev.map((item) => (item.id === id ? { ...item, buy_price: buyPrice, sell_price: sellPrice } : item))
    );
  };

  const filteredItems = collections.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tier_badge.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // RENDER: LOGIN FORM JIKA BELUM TERVERIFIKASI
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#0c0d10] text-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm bg-[#16181f] border border-[#242735] rounded-3xl p-6 sm:p-8 flex flex-col items-center shadow-2xl">
          <HotWheelsFlameLogo className="w-28 h-8 mb-5" />

          <div className="w-12 h-12 rounded-2xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="text-xl font-black uppercase tracking-tight text-white text-center">
            GARASI ADMIN PORTAL
          </h1>
          <p className="text-xs text-gray-400 text-center mt-1 mb-6">
            Akses privat khusus pemilik untuk kelola modal rahasia, valuasi pasar, dan inventori koleksi.
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
                  PIN salah. Coba default: 1234
                </span>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-[#0066d6] hover:bg-blue-600 active:scale-98 text-white font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg"
            >
              Masuk Dashboard Admin
            </button>

            <Link
              href="/"
              className="text-xs text-gray-500 hover:text-gray-300 text-center mt-2 flex items-center justify-center gap-1 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Kembali ke Galeri Publik
            </Link>
          </form>
        </div>
      </main>
    );
  }

  // RENDER: DASHBOARD ADMIN LENGKAP (SUDAH LOGIN)
  return (
    <main className="min-h-screen bg-[#0c0d10] text-white flex flex-col items-center pb-20">
      {/* Top Admin Header */}
      <header className="w-full max-w-7xl px-4 sm:px-8 py-4 border-b border-[#1f222e] bg-[#121318]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HotWheelsFlameLogo className="w-24 h-7" />
          <span className="text-xs font-black uppercase bg-red-950/80 text-red-400 border border-red-800/40 px-2.5 py-1 rounded-full">
            Admin Workspace
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-[#0066d6] hover:bg-blue-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl active:scale-95 transition-all shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mobil</span>
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-[#1a1d26] border border-[#242735] px-3 py-2 rounded-xl transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lihat Web Publik</span>
          </Link>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 bg-red-950/30 border border-red-900/30 px-3 py-2 rounded-xl transition-colors font-bold"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="w-full max-w-7xl px-4 sm:px-8 pt-6 flex flex-col gap-6">
        {/* Ringkasan Portofolio & Keuangan */}
        <PortfolioSummary items={collections} />

        {/* Inventory Control Table / List */}
        <div className="bg-[#14151b] border border-[#242735] rounded-2xl p-4 sm:p-6 flex flex-col gap-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black uppercase text-white tracking-tight">
                Kelola Inventori & Harga Modal
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Total {collections.length} mobil terdaftar dalam database.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari model atau seri..."
                className="w-full bg-[#1a1d26] border border-[#242735] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#0066d6]"
              />
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#242735] text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-3 px-3">Mobil</th>
                  <th className="py-3 px-3">Seri / Tier</th>
                  <th className="py-3 px-3">Kondisi</th>
                  <th className="py-3 px-3">Modal Beli (Hide)</th>
                  <th className="py-3 px-3">Harga Pasaran</th>
                  <th className="py-3 px-3">Margin Profit</th>
                  <th className="py-3 px-3">Status Jual</th>
                  <th className="py-3 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#242735]/60">
                {filteredItems.map((item) => {
                  const profit = (item.sell_price || 0) - (item.buy_price || 0);
                  const marginPercent =
                    item.buy_price && item.buy_price > 0
                      ? Math.round((profit / item.buy_price) * 100)
                      : 0;

                  return (
                    <tr key={item.id} className="hover:bg-[#1a1d26]/40 transition-colors">
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
                          <span className="font-extrabold text-white uppercase block">
                            {item.name}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {item.release_year} • {item.color}
                          </span>
                        </div>
                      </td>

                      {/* Series / Tier */}
                      <td className="py-3 px-3">
                        <span className="bg-[#242735] text-gray-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {item.tier_badge}
                        </span>
                      </td>

                      {/* Condition */}
                      <td className="py-3 px-3 text-gray-300">
                        {item.condition}
                      </td>

                      {/* Buy Price (Modal) */}
                      <td className="py-3 px-3 font-mono font-bold text-red-400">
                        Rp {item.buy_price?.toLocaleString('id-ID')}
                      </td>

                      {/* Sell Price (Pasaran) */}
                      <td className="py-3 px-3 font-mono font-bold text-white">
                        Rp {item.sell_price?.toLocaleString('id-ID')}
                      </td>

                      {/* Margin Profit */}
                      <td className="py-3 px-3">
                        <span className="text-emerald-400 font-bold font-mono">
                          +{profit.toLocaleString('id-ID')} ({marginPercent}%)
                        </span>
                      </td>

                      {/* For Sale Toggle */}
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleForSale(item.id)}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${
                            item.is_for_sale
                              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800/40'
                              : 'bg-gray-800/60 text-gray-400 border-gray-700/40'
                          }`}
                        >
                          {item.is_for_sale ? 'For Sale' : 'Not For Sale (NFS)'}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:text-red-200 transition-colors"
                          title="Hapus Mobil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
