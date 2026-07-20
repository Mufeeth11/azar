import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 relative select-none group">
      <div className="relative h-10 w-9 flex items-center justify-center transition-transform group-hover:scale-105">
        <span className="absolute left-0 top-0 text-[42px] font-bold text-[#f78c25] z-10 font-serif leading-none drop-shadow-md">s</span>
        <span className="absolute right-0 top-3 text-[34px] font-bold text-[#a83a3a] z-0 font-serif leading-none">R</span>
      </div>
      <span className="font-sans font-extrabold text-[#a83a3a] tracking-[0.15em] uppercase text-[15px] mt-2 transition-colors group-hover:text-[#f78c25]">DIGITAL</span>
    </Link>
  );
}
