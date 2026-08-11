"use client";

import React from "react";
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-transparent border-0 py-4 pointer-events-none">
      <div className="w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between pointer-events-auto">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/SSwhitey.png"
            alt="SkillSphere Logo"
            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
          <span className="text-lg font-bold text-white tracking-tight group-hover:text-zinc-300 transition-colors drop-shadow-md">
            SkillSphere
          </span>
        </Link>

        {/* Action Button (Money Button linking to /register) */}
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="relative group px-5 py-2 sm:py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-1.5 overflow-hidden"
          >
            <span className="relative z-10">Get Started</span>
            <svg
              className="w-4 h-4 relative z-10 text-zinc-700 group-hover:text-black group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}