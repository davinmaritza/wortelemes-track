'use client';

import React from 'react';
import { Calendar, Newspaper, Sparkles, Shield, Bookmark, ExternalLink } from 'lucide-react';

interface ArticleItem {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tag: string;
}

const articles: ArticleItem[] = [
  {
    id: 'art-1',
    category: 'RLC Drops & Calendar',
    title: 'Kalender Rilis Red Line Club (RLC) 2026: Deretan Casting Legendaris',
    excerpt: 'Simak daftar jadwal drop resmi RLC untuk kuartal ini, termasuk varian BMW M3 E30, Datsun 240Z, dan Porsche 930 Turbo dengan Spectraflame finish eksklusif.',
    date: '3 Nov 2026',
    readTime: '3 min read',
    tag: 'Drop Alert',
  },
  {
    id: 'art-2',
    category: 'Care & Preservation',
    title: 'Panduan Memilih Akrilik Protector UV-Resistant untuk Carded Koleksi',
    excerpt: "Lindungi carded blister dari ancaman soft corner, kerut, dan perubahan warna akibat sinar matahari langsung dengan spesifikasi akrilik tebal 2mm berfilter UV.",
    date: '28 Okt 2026',
    readTime: '4 min read',
    tag: 'Collector Guide',
  },
  {
    id: 'art-3',
    category: 'Market Insights',
    title: 'Analisis Tren Pasar Diecast 1:64: Mengapa Varian JDM dan Porsche Tetap Jadi Primadona',
    excerpt: 'Eksplorasi valuasi pasar model Japanese Domestic Market (JDM) dan heritage Porsche dari tahun ke tahun di kalangan kolektor Indonesia.',
    date: '20 Okt 2026',
    readTime: '5 min read',
    tag: 'Market Watch',
  },
  {
    id: 'art-4',
    category: 'Authentication',
    title: 'Cara Membedakan Blister Original Pabrik vs Repackaging / Rekat Ulang',
    excerpt: 'Perhatikan tekstur sisa lem di cardstock, barcode cetak pabrik, dan kerapatan blister plastik sebelum memutuskan transaksi bernilai tinggi.',
    date: '15 Okt 2026',
    readTime: '4 min read',
    tag: 'Security Tips',
  },
];

const upcomingDrops = [
  {
    month: 'NOV 2026',
    date: '18 Nov',
    model: '1993 McLaren F1 (RLC Exclusive)',
    series: 'Red Line Club',
    status: 'Upcoming',
  },
  {
    month: 'DES 2026',
    date: '05 Des',
    model: 'Nissan Skyline GT-R R34 (Silver Series)',
    series: 'Silver Series Batch 2',
    status: 'Confirmed',
  },
  {
    month: 'DES 2026',
    date: '22 Des',
    model: 'Porsche 911 GT3 RS (Track Day Special)',
    series: 'Premium Car Culture',
    status: 'Upcoming',
  },
];

export const CollectorJournalView: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col gap-1.5 pt-2">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#0066d6]" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0066d6]">
            Wortelemes Journal
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase font-sans">
          COLLECTOR NEWS & RELEASE RADAR
        </h1>
        <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
          Pusat informasi rilisan batch terkini, jadwal drop internasional, panduan kurasi blister, dan wawasan pasar diecast.
        </p>
      </div>

      {/* Release Calendar Bento Section */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-black uppercase text-white tracking-wide">
                Kalender Drop Rilis (Late 2026)
              </h2>
              <span className="text-[11px] text-gray-400">
                Jadwal tentatif drop diecast premium & batch baru
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2.5 py-1 rounded-full font-bold">
            Live Radar
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
          {upcomingDrops.map((drop, idx) => (
            <div
              key={idx}
              className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-white/15 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                  {drop.date}
                </span>
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  {drop.status}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white uppercase leading-snug">
                  {drop.model}
                </h3>
                <span className="text-[11px] text-gray-400 mt-1 block font-mono">
                  {drop.series}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Articles Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white font-mono">
            PANDUAN & INSIGHT KOLEKSI
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            {articles.length} Artikel
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-[#121319] border border-white/[0.08] hover:border-[#0066d6]/60 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all duration-300 shadow-lg group hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-blue-400 font-black uppercase tracking-wide">
                    {art.category}
                  </span>
                  <span className="text-gray-400 font-mono">{art.readTime}</span>
                </div>

                <h3 className="text-base font-extrabold text-white group-hover:text-blue-300 transition-colors leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-gray-400 leading-relaxed">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-gray-400">
                <span className="font-mono text-[11px]">{art.date}</span>
                <span className="text-blue-400 font-bold group-hover:underline flex items-center gap-1">
                  Baca Selengkapnya
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
