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
    title: '2026 Red Line Club (RLC) Drop Calendar: Iconic Collector Castings',
    excerpt: 'Review official RLC quarterly drop schedules featuring the BMW M3 E30, Datsun 240Z, and Porsche 930 Turbo in signature Spectraflame finishes.',
    date: 'Nov 3, 2026',
    readTime: '3 min read',
    tag: 'Drop Alert',
  },
  {
    id: 'art-2',
    category: 'Care & Preservation',
    title: 'Guide to Selecting UV-Resistant Acrylic Protectors for Carded Collections',
    excerpt: 'Defend blister cards from soft corners, card crease, and sun discoloration with 2mm museum-grade UV-filtering acrylic.',
    date: 'Oct 28, 2026',
    readTime: '4 min read',
    tag: 'Collector Guide',
  },
  {
    id: 'art-3',
    category: 'Market Insights',
    title: '1:64 Diecast Market Watch: Why JDM Classics and Vintage Porsches Dominate',
    excerpt: 'Deep dive into long-term market valuations for Japanese Domestic Market (JDM) and Porsche heritage castings among serious collectors.',
    date: 'Oct 20, 2026',
    readTime: '5 min read',
    tag: 'Market Watch',
  },
  {
    id: 'art-4',
    category: 'Authentication',
    title: 'Authentication Guide: Factory Blister Seals vs. Resealed Cards',
    excerpt: 'Inspect glue residue texture, factory cardstock embossing, and blister heat-seal lines before finalizing high-ticket acquisitions.',
    date: 'Oct 15, 2026',
    readTime: '4 min read',
    tag: 'Security Tips',
  },
];

const upcomingDrops = [
  {
    month: 'NOV 2026',
    date: 'Nov 18',
    model: '1993 McLaren F1 (RLC Exclusive)',
    series: 'Red Line Club',
    status: 'Upcoming',
  },
  {
    month: 'DEC 2026',
    date: 'Dec 05',
    model: 'Nissan Skyline GT-R R34 (Silver Series)',
    series: 'Silver Series Batch 2',
    status: 'Confirmed',
  },
  {
    month: 'DEC 2026',
    date: 'Dec 22',
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
          Official hub for batch releases, drop schedules, blister preservation guides, and secondary market insights.
        </p>
      </div>

      {/* Release Calendar Bento Section */}
      <div className="bg-[#121319] border border-white/10 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <Calendar className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm font-black uppercase text-white tracking-wide">
                Release Drop Radar (Late 2026)
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
            COLLECTOR GUIDES & MARKET INSIGHTS
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            {articles.length} Articles
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
                  Read Full Article →
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
