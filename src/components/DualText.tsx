import React from 'react';

interface DualTextProps {
  ar: string;
  en: string;
  className?: string;
  arClass?: string;
  enClass?: string;
  direction?: "col" | "row" | "row-between";
}

export const DualText = ({ 
  ar, 
  en, 
  className = "", 
  arClass = "text-[1.5em] leading-relaxed font-arabic", 
  enClass = "text-[0.85em] opacity-80 mb-1 font-sans block", 
  direction = "col" 
}: DualTextProps) => (
  <span className={`flex ${direction === 'col' ? 'flex-col' : direction === 'row-between' ? 'flex-row items-center justify-between w-full flex-wrap gap-4' : 'flex-row items-baseline gap-x-3 flex-wrap'} ${className}`}>
    <span className={`${enClass} ${direction !== 'col' ? '!mb-0' : ''}`} dir="ltr">{en}</span>
    <span className={arClass} dir="rtl">{ar}</span>
  </span>
);
