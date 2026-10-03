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
    // md:hidden ensures it ONLY shows on Mobile screens, not Desktop!
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0d10]/95 backdrop-blur-xl border-t border-[#1f222e] flex items-center justify-around py-2.5 px-4 w-full">
      {/* 1. My Garage */}
      <button
        onClick={() => onChangeTab('garage')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
          activeTab === 'garage' ? 'text-[#0066d6]' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Flame className={`w-5 h-5 ${activeTab === 'garage' ? 'fill-[#0066d6]' : ''}`} />
        <span>My Garage</span>
      </button>

      {/* 2. News */}
      <button
        onClick={() => onChangeTab('news')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
          activeTab === 'news' ? 'text-[#0066d6]' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Newspaper className="w-5 h-5" />
        <span>News</span>
      </button>

      {/* 3. Discover */}
      <button
        onClick={() => onChangeTab('discover')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
          activeTab === 'discover' ? 'text-[#0066d6]' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'stroke-[#0066d6]' : ''}`} />
        <span>Discover</span>
      </button>

      {/* 4. Profile */}
      <button
        onClick={() => onChangeTab('profile')}
        className={`flex flex-col items-center gap-1 text-[10px] font-bold transition-colors ${
          activeTab === 'profile' ? 'text-[#0066d6]' : 'text-gray-400 hover:text-gray-200'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
