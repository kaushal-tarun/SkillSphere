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
    <section className="relative min-h-[85vh] bg-black text-white overflow-hidden flex flex-col justify-center pt-20 pb-8 lg:pt-24 lg:pb-12">
      {/* Background Subtle Grid & Monochromatic White Radial Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Subtle Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        {/* White / Silver Radial Ambient Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[750px] h-[350px] bg-white/10 blur-[140px] rounded-full opacity-60 pointer-events-none" />
        <div className="absolute top-1/2 -left-48 w-[400px] h-[400px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 -right-48 w-[450px] h-[450px] bg-zinc-400/5 blur-[130px] rounded-full pointer-events-none" />

        {/* Subtle Fade at Bottom */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-8">
          <a
            href="#features"
            className="group inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-950/80 text-xs sm:text-sm font-medium text-zinc-300 backdrop-blur-md hover:border-zinc-700 hover:text-white transition-all duration-300 shadow-xl shadow-black/80"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-medium tracking-wide">The Competitive Student Developer Arena</span>
            <span className="text-zinc-600">•</span>
            <span className="flex items-center gap-1 text-white group-hover:translate-x-0.5 transition-transform font-semibold">
              See How It Works
              <svg className="w-3.5 h-3.5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>
        </div>

        {/* Main Content Header */}
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Main Headline */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]">
            <span className="block text-white">Build.</span>
            <span className="block bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent py-1">
              Compete.
            </span>
            <span className="block text-zinc-400">Rise.</span>
          </h1>

          {/* Subtitle / Supporting text */}
          <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
            SkillSphere is the competitive arena where student developers showcase projects, compete for rankings, earn XP, unlock titles and badges, and connect with fellow builders.
          </p>

          {/* Micro Value Props */}
          <div className="pt-4 flex flex-wrap justify-center items-center gap-6 text-xs sm:text-sm text-zinc-400 font-medium">
            <div className="flex items-center gap-2 bg-zinc-900/60 px-3.5 py-1.5 rounded-lg border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>Project Battles</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/60 px-3.5 py-1.5 rounded-lg border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
              <span>Earn XP & Badges</span>
            </div>
            <div className="flex items-center gap-2 bg-zinc-900/60 px-3.5 py-1.5 rounded-lg border border-zinc-800">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <span>Make Student Friends</span>
            </div>
          </div>
        </div>

        {/* Dual Showcase Grid: Space 1 (Original 3D Logo Core) + Space 2 (Interactive SS Pixel Matrix) */}
        <div className="mt-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Space 1: Original 3D Rotating Black Logo Core + BUILD CONNECT RISE */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-zinc-400/10 to-transparent rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-700 pointer-events-none" />
            <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl p-8 shadow-2xl shadow-black overflow-hidden flex flex-col items-center justify-center min-h-[320px] h-full">
              <div className="relative [perspective:1000px] my-3 flex items-center justify-center cursor-pointer">
                <div className="animate-rotate-3d hover:[animation-play-state:paused] transition-transform duration-500">
                  <img
                    src="/SSblacky.png"
                    alt="SkillSphere 3D Rotating Logo"
                    className="w-40 h-40 sm:w-52 sm:h-52 object-contain drop-shadow-[0_0_40px_rgba(255,255,255,0.22)] hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              <div className="text-center pt-2 z-10">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-widest uppercase">
                  BUILD • CONNECT • RISE
                </h3>
              </div>
            </div>
          </div>

          {/* Space 2: Interactive "SS" Black Pixel Grid + BUILD CONNECT RISE */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-zinc-400/10 to-transparent rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition duration-700 pointer-events-none" />
            <div className="relative rounded-3xl border border-zinc-800 bg-zinc-950/90 backdrop-blur-2xl p-6 sm:p-8 shadow-2xl shadow-black overflow-hidden flex flex-col items-center justify-center min-h-[320px] h-full">
              {/* Interactive SS Pixel Grid Box (Black boxes with subtle white borders, glowing white on hover) */}
              <div className="my-3 flex flex-col gap-2 p-5 rounded-2xl border border-zinc-800/80 bg-black/80 backdrop-blur-xl group-hover:border-zinc-600 transition-all duration-300">
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
                              ? "bg-white border-white shadow-[0_0_20px_rgba(255,255,255,1)] scale-125 z-10"
                              : isSsLetter
                              ? "bg-zinc-950/90 border-zinc-700/90 hover:border-white"
                              : "bg-zinc-950/30 border-zinc-900/60 hover:border-zinc-600"
                          }`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="text-center pt-2 z-10">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-widest uppercase">
                  BUILD • CONNECT • RISE
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Seamless Downward Flow Indicator */}
        <div className="flex flex-col items-center justify-center mt-10 space-y-2 opacity-80 hover:opacity-100 transition-opacity">
          <a href="#showcase" className="flex flex-col items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors group">
            <span>Explore Featured Student Projects</span>
            <div className="w-6 h-6 rounded-full border border-zinc-800 bg-zinc-950 flex items-center justify-center group-hover:border-zinc-600 transition-colors animate-bounce">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}