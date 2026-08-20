"use client";

import React from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

export default function CTA() {
  return (
    <section id="cta" className="py-24 bg-[#faf6f0] text-zinc-900 relative overflow-hidden border-t border-[#e8e2d8]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-200/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          <div className="rounded-3xl border border-[#e8e2d8] bg-white p-8 sm:p-12 lg:p-16 text-center shadow-md relative overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/SSblacky.png"
              alt="SkillSphere Logo"
              className="h-12 w-auto object-contain"
            />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 text-zinc-900">
            Ready for a long ru
          </h2>
          <p className="text-base sm:text-lg text-zinc-700 max-w-2xl mx-auto mb-6 font-normal leading-relaxed">
            Showcase your projects, compete with friends, earn XP, and connect with student builders.
          </p>

          {/* Clean 8-bit Running Dino Game */}
          <div className="flex justify-center my-6">
            <div className="relative overflow-hidden w-full max-w-md rounded-2xl bg-[#f4efe6] border border-[#e2dacd] p-3 shadow-inner">
              <div className="relative h-14 w-full overflow-hidden bg-white rounded-xl border border-[#e8e2d8] flex items-end">
                {/* Running T-Rex Dino */}
                <div className="absolute left-6 bottom-1 z-20 animate-dino-run">
                  <svg
                    className="w-9 h-9 text-zinc-900"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ shapeRendering: "crispEdges" }}
                  >
                    <rect x="11" y="2" width="9" height="6" fill="#18181b" />
                    <rect x="17" y="4" width="1.5" height="1.5" fill="#ffffff" />
                    <rect x="13" y="6" width="7" height="2" fill="#18181b" />
                    <rect x="8" y="7" width="7" height="8" fill="#18181b" />
                    <rect x="14" y="9" width="3" height="1.5" fill="#3f3f46" />
                    <rect x="4" y="9" width="4" height="4" fill="#18181b" />
                    <rect x="2" y="8" width="3" height="3" fill="#18181b" />
                    <g className="animate-runner-leg1">
                      <rect x="8" y="15" width="2.5" height="5" fill="#18181b" />
                      <rect x="8" y="19" width="3.5" height="2" fill="#18181b" />
                    </g>
                    <g className="animate-runner-leg2">
                      <rect x="12" y="15" width="2.5" height="5" fill="#18181b" />
                      <rect x="13" y="19" width="3.5" height="2" fill="#18181b" />
                    </g>
                  </svg>
                </div>

                {/* Moving Road */}
                <div className="absolute inset-y-0 left-0 w-[200%] flex items-end animate-road-move pointer-events-none z-10">
                  <div className="w-1/2 h-full relative flex items-end">
                    <div className="w-full h-0.5 bg-zinc-300" />
                    <div className="absolute bottom-1 left-10 w-4 h-0.5 bg-zinc-400" />
                    <div className="absolute bottom-1 left-32 w-6 h-0.5 bg-zinc-400" />
                    <div className="absolute bottom-1 left-56 w-8 h-0.5 bg-zinc-400" />
                    <div className="absolute bottom-1 left-80 w-5 h-0.5 bg-zinc-400" />
                  </div>
                  <div className="w-1/2 h-full relative flex items-end">
                    <div className="w-full h-0.5 bg-zinc-300" />
                    <div className="absolute bottom-1 left-10 w-4 h-0.5 bg-zinc-400" />
                    <div className="absolute bottom-1 left-32 w-6 h-0.5 bg-zinc-400" />
                    <div className="absolute bottom-1 left-56 w-8 h-0.5 bg-zinc-400" />
                    <div className="absolute bottom-1 left-80 w-5 h-0.5 bg-zinc-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-mono font-bold text-sm shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <span>Create Your Account Now</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </div>
    </section>
  );
}