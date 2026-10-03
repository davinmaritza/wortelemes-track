import React from 'react';
import Image from 'next/image';

export const HotWheelsFlameLogo = ({ className = 'w-24 h-7' }: { className?: string }) => {
  return (
    <div className={`relative select-none shrink-0 ${className}`}>
      <Image
        src="/cars/hotwheels_flame_logo.png"
        alt="Hot Wheels"
        fill
        className="object-contain"
        priority
        unoptimized
      />
    </div>
  );
};
