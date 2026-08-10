"use client";

import React, { useState } from "react";

export default function CTA() {
  return (
    <section id="cta" className="py-24 bg-black text-white relative overflow-hidden border-t border-zinc-900">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/90 p-8 sm:p-12 lg:p-16 text-center backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/SSwhitey.png"
              alt="SkillSphere Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Ready to Rise on SkillSphere?
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
            Showcase your projects, compete on leaderboards, earn XP, and connect with student builders.
          </p>

          {/* Single Get Started Money Button at End of Page */}
          <div className="flex justify-center">
            <button className="relative group px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-base shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:shadow-[0_0_45px_rgba(255,255,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <svg className="w-5 h-5 relative z-10 text-zinc-700 group-hover:text-black group-hover:translate-x-1.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}