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
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-6 font-normal leading-relaxed">
            Showcase your projects, compete on leaderboards, earn XP, and connect with student builders.
          </p>

          {/* Clean 8-bit Running Dino on Moving Road */}
          <div className="flex justify-center my-6">
            <div className="relative overflow-hidden w-full max-w-md rounded-2xl bg-zinc-950/80 border border-zinc-800/80 p-3 shadow-2xl backdrop-blur-xl">
              {/* Moving Game Canvas / Track Viewport */}
              <div className="relative h-14 w-full overflow-hidden bg-black/90 rounded-xl border border-zinc-900/90 flex items-end">
                {/* Running T-Rex Dino (Bouncing & Running on Left) */}
                <div className="absolute left-6 bottom-1 z-20 animate-dino-run">
                  <svg
                    className="w-9 h-9 text-white"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ shapeRendering: "crispEdges" }}
                  >
                    {/* Dino Head & Eye */}
                    <rect x="11" y="2" width="9" height="6" fill="#ffffff" />
                    <rect x="17" y="4" width="1.5" height="1.5" fill="#000000" />
                    <rect x="13" y="6" width="7" height="2" fill="#ffffff" />

                    {/* Dino Neck & Torso */}
                    <rect x="8" y="7" width="7" height="8" fill="#ffffff" />

                    {/* T-Rex Small Arm */}
                    <rect x="14" y="9" width="3" height="1.5" fill="#e4e4e7" />

                    {/* Dino Tail */}
                    <rect x="4" y="9" width="4" height="4" fill="#ffffff" />
                    <rect x="2" y="8" width="3" height="3" fill="#ffffff" />

                    {/* Running Leg 1 */}
                    <g className="animate-runner-leg1">
                      <rect x="8" y="15" width="2.5" height="5" fill="#ffffff" />
                      <rect x="8" y="19" width="3.5" height="2" fill="#ffffff" />
                    </g>

                    {/* Running Leg 2 */}
                    <g className="animate-runner-leg2">
                      <rect x="12" y="15" width="2.5" height="5" fill="#ffffff" />
                      <rect x="13" y="19" width="3.5" height="2" fill="#ffffff" />
                    </g>
                  </svg>
                </div>

                {/* Continuously Sliding Road & Pixel Dashes (Moving Right to Left) */}
                <div className="absolute inset-y-0 left-0 w-[200%] flex items-end animate-road-move pointer-events-none z-10">
                  {/* Track Segment 1 */}
                  <div className="w-1/2 h-full relative flex items-end">
                    {/* Ground Line */}
                    <div className="w-full h-0.5 bg-zinc-600" />
                    {/* Ground Pixel Dashes */}
                    <div className="absolute bottom-1 left-10 w-4 h-0.5 bg-zinc-700" />
                    <div className="absolute bottom-1 left-32 w-6 h-0.5 bg-zinc-700" />
                    <div className="absolute bottom-1 left-56 w-8 h-0.5 bg-zinc-700" />
                    <div className="absolute bottom-1 left-80 w-5 h-0.5 bg-zinc-700" />
                  </div>

                  {/* Track Segment 2 (Duplicate for Seamless Loop) */}
                  <div className="w-1/2 h-full relative flex items-end">
                    {/* Ground Line */}
                    <div className="w-full h-0.5 bg-zinc-600" />
                    {/* Ground Pixel Dashes */}
                    <div className="absolute bottom-1 left-10 w-4 h-0.5 bg-zinc-700" />
                    <div className="absolute bottom-1 left-32 w-6 h-0.5 bg-zinc-700" />
                    <div className="absolute bottom-1 left-56 w-8 h-0.5 bg-zinc-700" />
                    <div className="absolute bottom-1 left-80 w-5 h-0.5 bg-zinc-700" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Single Get Started Money Button at End of Page */}
          <div className="flex justify-center mt-2">
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