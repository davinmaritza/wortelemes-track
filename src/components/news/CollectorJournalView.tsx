'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Newspaper, BookOpen, X, Clock, Settings, ArrowUpRight } from 'lucide-react';
import { ArticleItem, UpcomingDropItem } from '@/types/diecast';
import { getStoredArticles, getStoredDrops } from '@/lib/storage/newsStorage';

export const CollectorJournalView: React.FC = () => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [upcomingDrops, setUpcomingDrops] = useState<UpcomingDropItem[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  useEffect(() => {
    setArticles(getStoredArticles());
    setUpcomingDrops(getStoredDrops());

    const handleUpdate = () => {
      setArticles(getStoredArticles());
      setUpcomingDrops(getStoredDrops());
    };

    window.addEventListener('journal-data-updated', handleUpdate);
    return () => window.removeEventListener('journal-data-updated', handleUpdate);
  }, []);

  return (
    <div className="flex flex-col gap-6 pb-20 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase font-sans">
            RELEASE RADAR & JOURNAL
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Verified release schedules, case assortments, and market valuation reports.
          </p>
        </div>

        <Link
          href="/admin"
          className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] px-3.5 py-2 rounded-xl transition-colors font-medium"
        >
          <Settings className="w-3.5 h-3.5 text-gray-400" />
          <span>Admin News Management</span>
        </Link>
      </div>

      {/* 1. Release Drop Radar */}
      <div className="bg-[#111219] border border-white/[0.08] rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-300 font-bold">
              Upcoming Release Drops & Restocks
            </h2>
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            {upcomingDrops.length} Scheduled
          </span>
        </div>

        {upcomingDrops.length === 0 ? (
          <div className="py-10 text-center text-gray-500 text-xs">
            No drops scheduled currently. Use the admin workspace to publish new release dates.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {upcomingDrops.map((drop) => {
              const statusColor =
                drop.status === 'Confirmed'
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                  : drop.status === 'Live'
                  ? 'bg-blue-950/60 text-blue-300 border-blue-800/40'
                  : drop.status === 'Sold Out'
                  ? 'bg-red-950/60 text-red-300 border-red-800/40'
                  : 'bg-amber-950/60 text-amber-300 border-amber-800/40';

              return (
                <div
                  key={drop.id}
                  className="bg-[#151620] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-white bg-white/[0.06] border border-white/10 px-2.5 py-1 rounded-lg">
                      {drop.month ? `${drop.month} ` : ''}{drop.date}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${statusColor}`}
                    >
                      {drop.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white uppercase leading-snug line-clamp-1">
                      {drop.model}
                    </h3>
                    <span className="text-xs text-gray-400 mt-1 block font-mono line-clamp-1">
                      {drop.series}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Editorial Stories & Market Analysis */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase tracking-widest text-gray-300 font-bold flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-gray-400" />
            Curator Journal Articles
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            {articles.length} Stories
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="py-12 text-center text-gray-500 bg-[#111219] rounded-2xl border border-white/[0.06] text-xs">
            No articles published yet. Publish new stories via the admin workspace.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((art) => (
              <article
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-[#111219] border border-white/[0.06] hover:border-white/20 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-xl"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-300 font-mono text-[10px] uppercase tracking-wider bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                      {art.category}
                    </span>
                    <span className="text-gray-500 font-mono">{art.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-gray-200 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-400">
                  <span className="font-mono text-[11px] text-gray-500">{art.date}</span>
                  <span className="text-white font-medium group-hover:underline flex items-center gap-1 text-[11px]">
                    <span>Read Story</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#12131b] border border-white/10 w-full max-w-2xl rounded-3xl p-6 sm:p-8 flex flex-col max-h-[85vh] overflow-y-auto shadow-2xl relative">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-gray-300 uppercase tracking-wider bg-white/[0.06] px-2.5 py-1 rounded-md border border-white/10">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {selectedArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/15 flex items-center justify-center text-gray-300 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Story */}
            <div className="mt-5 flex flex-col gap-4">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-snug">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono pb-2 border-b border-white/[0.06]">
                <span>Published: {selectedArticle.date}</span>
                <span>•</span>
                <span>#{selectedArticle.tag}</span>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-sans font-medium italic border-l-2 border-white/20 pl-4 py-1">
                &ldquo;{selectedArticle.excerpt}&rdquo;
              </p>

              <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line font-sans pt-2">
                {selectedArticle.content || selectedArticle.excerpt}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-white/[0.08] flex items-center justify-between">
              <span className="text-[11px] text-gray-500 font-mono">
                Wortelemes Journal Archives
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-xs font-semibold px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors"
              >
                Back to Feed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
