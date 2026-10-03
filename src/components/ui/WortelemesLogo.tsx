import React from 'react';
import Image from 'next/image';

interface WortelemesLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const WortelemesLogo = ({
  className = 'w-7 h-7',
  size = 28,
  showText = false,
}: WortelemesLogoProps) => {
  return (
    <div className="flex items-center gap-2 select-none shrink-0">
      <div className={`relative overflow-hidden rounded-full border border-white/20 bg-black shrink-0 ${className}`}>
        <Image
          src="/logo.png"
          alt="Wortelemes Logo"
          width={size}
          height={size}
          className="object-cover w-full h-full"
          priority
          unoptimized
        />
      </div>
      {showText && (
        <span className="font-black text-sm tracking-widest text-white uppercase font-sans">
          WORTELEMES
        </span>
      )}
    </div>
  );
};
