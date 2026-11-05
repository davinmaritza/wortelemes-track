'use client';

import React from 'react';
import { Flame, Compass, Newspaper, User } from 'lucide-react';

export type AppNavTab = 'garage' | 'news' | 'discover' | 'profile';

interface BottomTabBarProps {
  activeTab: AppNavTab;
  onChangeTab: (tab: AppNavTab) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { key: AppNavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'garage', label: 'Garage', icon: Flame },
    { key: 'discover', label: 'Discover', icon: Compass },
    { key: 'news', label: 'Drops', icon: Newspaper },
    { key: 'profile', label: 'Curator', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40 max-w-sm mx-auto bg-[#101118]/90 backdrop-blur-2xl border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.7)] flex items-center justify-between p-1.5 rounded-2xl safe-area-pb">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onChangeTab(tab.key)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 rounded-xl transition-all ${
              isActive
                ? 'bg-white/[0.1] text-white font-bold'
                : 'text-gray-400 hover:text-gray-200 font-medium'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
