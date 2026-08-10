"use client";

import React, { useState, useEffect } from "react";

export default function StarterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  useEffect(() => {
    // Show splash screen on app load
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimatingOut(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${
        isAnimatingOut ? "opacity-0 scale-95" : "opacity-100 scale-100 animate-in fade-in zoom-in-95 duration-300"
      }`}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 sm:p-8 shadow-2xl shadow-black z-10 overflow-hidden">
        {/* Glow Light Effect */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="SkillSphere Logo"
              className="w-8 h-8 rounded-lg object-cover border border-zinc-700 shadow-md"
            />
            <div>
              <h3 className="text-sm font-semibold text-white font-mono tracking-wider">
                SKILLSPHERE PLATFORM
              </h3>
              <p className="text-[11px] text-zinc-400">Welcome Starter Tour</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all text-xs font-mono"
          >
            ✕ ESC
          </button>
        </div>

        {/* Hero Starter Product Image with Animation */}
        <div className="relative rounded-xl border border-zinc-800 bg-black overflow-hidden group mb-6 shadow-xl">
          <div className="aspect-[16/9] w-full overflow-hidden">
            <img
              src="/hero-product-2.png"
              alt="SkillSphere Starter Overview"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-zinc-800 text-[11px] font-mono text-zinc-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            LIVE ECOSYSTEM PREVIEW
          </div>
        </div>

        {/* Description & Details */}
        <div className="space-y-3 text-left">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Empowering the Next Generation of Student Builders
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            SkillSphere is your unified hub to showcase side projects, verify real-world proof of work, match with skilled student co-founders, and build a verified developer reputation.
          </p>
        </div>

        {/* Action Footer */}
        <div className="mt-8 pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-zinc-500 font-mono">
            Press ESC or click outside to dismiss
          </span>
          <button
            onClick={handleClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-white/10"
          >
            <span>Enter Platform</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
