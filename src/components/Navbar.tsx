"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf6f0]/90 border-b border-[#e8e2d8] backdrop-blur-md h-16 px-6 sm:px-12 flex items-center justify-between">
      {/* Top Left: Logo + Brand Name */}
      <Link href="/" className="flex items-center gap-3 group">
        <img
          src="/SSblacky.png"
          alt="SkillSphere Logo"
          className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
        />
        <span className="text-lg font-extrabold text-zinc-900 tracking-tight group-hover:text-black transition-colors">
          SkillSphere
        </span>
      </Link>

      {/* Top Right: Get Started Button */}
      <Link
        href="/dashboard"
        className="group px-4 py-2 sm:py-2.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-mono font-bold text-xs sm:text-sm shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
      >
        <span>Get Started</span>
        <svg
          className="w-4 h-4 text-zinc-300 group-hover:text-white group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </Link>
    </header>
  );
}