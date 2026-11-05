'use client';

import React from 'react';
import { Flame, Compass, Newspaper, User } from 'lucide-react';

export type AppNavTab = 'garage' | 'news' | 'discover' | 'profile';

interface BottomTabBarProps {
  activeTab: AppNavTab;
  onChangeTab: (tab: AppNavTab) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090a0e]/90 backdrop-blur-2xl border-t border-white/[0.08] flex items-center justify-around py-2 px-3 w-full safe-area-pb">
      {/* 1. My Garage */}
      <button
        onClick={() => onChangeTab('garage')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'garage'
            ? 'text-[#0066d6] font-extrabold scale-105'
            : 'text-gray-400 hover:text-gray-200 font-semibold'
        }`}
      >
        <Flame className={`w-5 h-5 ${activeTab === 'garage' ? 'fill-[#0066d6]' : ''}`} />
        <span className="text-[10px] tracking-tight">Garage</span>
      </button>

      {/* 2. Discover */}
      <button
        onClick={() => onChangeTab('discover')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'discover'
            ? 'text-[#0066d6] font-extrabold scale-105'
            : 'text-gray-400 hover:text-gray-200 font-semibold'
        }`}
      >
        <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'stroke-[#0066d6]' : ''}`} />
        <span className="text-[10px] tracking-tight">Discover</span>
      </button>

      {/* 3. News */}
      <button
        onClick={() => onChangeTab('news')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'news'
            ? 'text-[#0066d6] font-extrabold scale-105'
            : 'text-gray-400 hover:text-gray-200 font-semibold'
        }`}
      >
        <Newspaper className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">News</span>
      </button>

      {/* 4. Profile */}
      <button
        onClick={() => onChangeTab('profile')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
          activeTab === 'profile'
            ? 'text-[#0066d6] font-extrabold scale-105'
            : 'text-gray-400 hover:text-gray-200 font-semibold'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Profile</span>
      </button>
    </nav>
  );
};
