"use client";

import { useState } from "react";

export default function Hero() {
  const [hoveredSsBoxes, setHoveredSsBoxes] = useState<Record<string, boolean>>({});

  // 7 rows x 12 columns pixel map for "S  S"
  const ssPixelMap = [
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1],
  ];

  const handleSsMouseEnter = (id: string) => {
    setHoveredSsBoxes((prev) => ({ ...prev, [id]: true }));
  };

  const handleSsMouseLeave = (id: string) => {
    setTimeout(() => {
      setHoveredSsBoxes((prev) => ({ ...prev, [id]: false }));
    }, 450);
  };

  return (
    <section className="relative min-h-[85vh] bg-[#faf6f0] text-zinc-900 overflow-hidden flex flex-col justify-center pt-28 pb-12">
      {/* Background Subtle Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.4) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-amber-200/20 blur-[140px] rounded-full pointer-events-none" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-8">
          <a
            href="#showcase"
            className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#e2dacd] bg-white text-xs sm:text-sm font-medium text-zinc-800 shadow-sm hover:border-zinc-400 transition-all duration-300"
          >
            <span className="flex h-2 w-2 rounded-full bg-zinc-900 animate-pulse" />
            <span className="font-mono text-xs font-semibold tracking-wide">Competitive Student Developer Arena</span>
            <span className="text-zinc-400">•</span>
            <span className="flex items-center gap-1 text-zinc-900 font-mono text-xs font-bold group-hover:translate-x-0.5 transition-transform">
              Explore Showcase
              <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>
        </div>

        {/* Main Content Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] text-zinc-900">
            <span className="inline-flex items-center justify-center">
              <span>Build.</span>
              <span className="inline-flex items-center relative ml-3 sm:ml-5 -translate-y-1 sm:-translate-y-2 opacity-95 shrink-0">
                <svg
                  className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-zinc-900"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ shapeRendering: "crispEdges" }}
                >
                  <rect x="14" y="18" width="7" height="3" fill="#18181b" />
                  <rect x="15" y="16" width="5" height="2" fill="#3f3f46" />
                  <rect x="2" y="7" width="5" height="5" fill="#18181b" />
                  <rect x="2" y="5" width="6" height="2" fill="#18181b" />
                  <rect x="3" y="12" width="5" height="8" fill="#3f3f46" />
                  <g className="animate-hammer-swing">
                    <rect x="7" y="10" width="5" height="2" fill="#18181b" />
                    <rect x="12" y="5" width="2" height="7" fill="#71717a" />
                    <rect x="10" y="3" width="6" height="4" fill="#18181b" />
                  </g>
                </svg>
              </span>
            </span>

            <span className="inline-flex items-center justify-center px-2">
              <span>Compete.</span>
              <span className="inline-flex items-center relative ml-3 sm:ml-5 -translate-y-1 sm:-translate-y-2 opacity-95 shrink-0">
                <svg
                  className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-zinc-900"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ shapeRendering: "crispEdges" }}
                >
                  <rect x="2" y="21" width="6" height="1" fill="#71717a" />
                  <rect x="10" y="21" width="8" height="1" fill="#a1a1aa" />
                  <rect x="11" y="4" width="5" height="5" fill="#18181b" />
                  <rect x="8" y="9" width="7" height="6" fill="#3f3f46" />
                  <rect x="4" y="10" width="5" height="2" fill="#18181b" />
                  <rect x="14" y="11" width="5" height="2" fill="#18181b" />
                  <g className="animate-runner-leg1">
                    <rect x="8" y="15" width="2" height="6" fill="#18181b" />
                    <rect x="6" y="19" width="3" height="2" fill="#18181b" />
                  </g>
                  <g className="animate-runner-leg2">
                    <rect x="12" y="15" width="2" height="6" fill="#18181b" />
                    <rect x="13" y="19" width="3" height="2" fill="#18181b" />
                  </g>
                </svg>
              </span>
            </span>

            <span className="inline-flex items-center justify-center text-zinc-600">
              <span>Rise.</span>
              <span className="inline-flex items-center relative ml-3 sm:ml-5 -translate-y-1 sm:-translate-y-2 opacity-95 shrink-0">
                <svg
                  className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-zinc-900 animate-sun-rise"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  style={{ shapeRendering: "crispEdges" }}
                >
                  <rect x="1" y="19" width="22" height="2" fill="#71717a" />
                  <rect x="4" y="21" width="16" height="1" fill="#a1a1aa" />
                  <rect x="8" y="8" width="8" height="8" fill="#18181b" />
                  <rect x="9" y="7" width="6" height="1" fill="#18181b" />
                  <rect x="9" y="16" width="6" height="1" fill="#18181b" />
                </svg>
              </span>
            </span>
          </h1>

          <p className="text-base sm:text-xl text-zinc-700 max-w-2xl mx-auto font-normal leading-relaxed">
            SkillSphere is the competitive platform where student developers showcase side projects, compete for campus rankings, earn XP, and connect with fellow builders.
          </p>

          <div className="pt-2 flex flex-wrap justify-center items-center gap-3 text-xs sm:text-sm text-zinc-700 font-medium font-mono">
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#e8e2d8] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-zinc-900" />
              <span>Project Battles</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#e8e2d8] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-zinc-700" />
              <span>Earn XP & Badges</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#e8e2d8] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-zinc-500" />
              <span>Campus Network</span>
            </div>
          </div>
        </div>

        {/* Dual Showcase Cards */}
        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: 3D Floating Logo Card (Fixed 3D rotation line glitch!) */}
          <div className="group relative">
            <div className="relative rounded-3xl border border-[#e8e2d8] bg-white p-8 shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[320px] h-full">
              <div className="my-4 flex items-center justify-center">
                <img
                  src="/SSblacky.png"
                  alt="SkillSphere Logo"
                  className="w-36 h-36 sm:w-44 sm:h-44 object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                />
              </div>
              <div className="text-center pt-2 z-10 font-mono">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 tracking-widest uppercase">
                  BUILD • COMPETE • RISE
                </h3>
              </div>
            </div>
          </div>

          {/* Card 2: Interactive SS Pixel Matrix Reveal (Fixed constant SS display!) */}
          <div className="group relative">
            <div className="relative rounded-3xl border border-[#e8e2d8] bg-white p-6 sm:p-8 shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[320px] h-full">
              <div className="my-3 flex flex-col gap-2 p-5 rounded-2xl border border-[#e8e2d8] bg-[#f4efe6]">
                {ssPixelMap.map((row, rowIdx) => (
                  <div key={`ss-row-${rowIdx}`} className="flex gap-2 justify-center">
                    {row.map((val, colIdx) => {
                      const id = `ss-${rowIdx}-${colIdx}`;
                      const isHovered = hoveredSsBoxes[id];
                      const isSsLetter = val === 1;

                      return (
                        <div
                          key={id}
                          onMouseEnter={() => handleSsMouseEnter(id)}
                          onMouseLeave={() => handleSsMouseLeave(id)}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md border transition-all duration-300 cursor-pointer ${
                            isHovered
                              ? "bg-zinc-900 border-zinc-900 scale-125 z-10 shadow-md"
                              : isSsLetter
                              ? "bg-zinc-300/80 border-zinc-400/80 hover:bg-zinc-900 hover:border-zinc-900"
                              : "bg-white/60 border-zinc-300/60 hover:bg-zinc-400"
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="text-center pt-2 z-10 font-mono">
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 tracking-widest uppercase">
                  HOVER TO REVEAL MATRIX
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}