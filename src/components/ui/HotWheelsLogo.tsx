import React from 'react';

export const HotWheelsFlameLogo = ({ className = 'w-28 h-auto' }: { className?: string }) => {
  return (
    <div className={`relative flex items-center justify-center font-black italic tracking-tighter select-none ${className}`}>
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-500 to-red-500 text-xl font-extrabold drop-shadow-[0_2px_10px_rgba(229,9,20,0.5)]">
        HOT WHEELS
      </span>
    </div>
  );
};
