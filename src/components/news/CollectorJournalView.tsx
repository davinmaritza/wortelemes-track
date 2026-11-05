'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Newspaper, Sparkles, BookOpen, X, ExternalLink, Clock, Tag, ChevronRight } from 'lucide-react';
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
    <div className="flex flex-col gap-8 pb-16 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2">
        <div className="flex flex-col gap-1.5">
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
            Official hub for batch releases, drop schedules, blister preservation guides, and secondary market insights.
          </p>
        </div>

        <Link
          href="/admin"
          className="self-start md:self-auto inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white bg-[#14151b] border border-white/10 hover:border-white/20 px-3.5 py-2 rounded-xl transition-colors"
        >
          <span>Manage News in Admin</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Release Calendar Bento Section */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-black uppercase text-white tracking-wide">
                Release Drop Radar
              </h2>
              <span className="text-[11px] text-gray-400">
                Upcoming drop schedule for premium diecasts and new batches
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 border border-blue-800/40 px-2.5 py-1 rounded-full font-bold">
            Live Radar
          </span>
        </div>

        {upcomingDrops.length === 0 ? (
          <div className="py-8 text-center text-gray-500 text-xs">
            No upcoming drop events scheduled. Add new releases in the admin panel.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
            {upcomingDrops.map((drop) => (
              <div
                key={drop.id}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between gap-3 hover:border-white/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    {drop.date}
                  </span>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    drop.status === 'Confirmed'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : drop.status === 'Live'
                      ? 'bg-red-500/15 text-red-400 border border-red-500/30 animate-pulse'
                      : 'text-gray-400'
                  }`}>
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
        )}
      </div>

      {/* Featured Articles Grid */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-black uppercase tracking-wider text-white font-mono">
            COLLECTOR GUIDES & MARKET INSIGHTS
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            {articles.length} Articles
          </span>
        </div>

        {articles.length === 0 ? (
          <div className="py-12 text-center text-gray-500 bg-[#121319] rounded-2xl border border-white/5 text-xs">
            No articles found. Publish new guides in the admin portal.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((art) => (
              <article
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-[#121319] border border-white/[0.08] hover:border-[#0066d6]/60 rounded-3xl p-5 sm:p-6 flex flex-col justify-between gap-4 transition-all duration-300 shadow-lg group hover:-translate-y-0.5 cursor-pointer"
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
                    Read Full Article →
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#14161f] border border-[#242735] w-full max-w-2xl rounded-3xl p-6 sm:p-8 flex flex-col max-h-[85vh] overflow-y-auto shadow-2xl relative">
            {/* Top Close Button */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {selectedArticle.readTime}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-white/[0.06] hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article Content */}
            <div className="mt-4 flex flex-col gap-4">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight leading-snug">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-gray-400 font-mono pb-2 border-b border-white/[0.05]">
                <span>Published: {selectedArticle.date}</span>
                <span>•</span>
                <span>Tag: #{selectedArticle.tag}</span>
              </div>

              <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/[0.06] text-xs text-gray-300 italic leading-relaxed">
                "{selectedArticle.excerpt}"
              </div>

              {selectedArticle.content ? (
                <div className="text-xs sm:text-sm text-gray-300 leading-relaxed whitespace-pre-line flex flex-col gap-3 font-sans">
                  {selectedArticle.content}
                </div>
              ) : (
                <p className="text-xs text-gray-400 leading-relaxed">
                  Full article text is curated by the garage team. Check back regularly or reach out via WhatsApp for further collector guidance.
                </p>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="bg-[#0066d6] hover:bg-blue-600 text-white font-black text-xs px-6 py-2.5 rounded-full active:scale-95 transition-all shadow"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
