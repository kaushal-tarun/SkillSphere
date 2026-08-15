"use client";

import React, { useState, useEffect } from "react";

export default function Features() {
  const [activeFilter, setActiveFilter] = useState("all");

  // Cute peeking pixel guy state
  const [peekBoxIndex, setPeekBoxIndex] = useState<number | null>(null);
  const [isWaving, setIsWaving] = useState(false);

  // Mouse spotlight state for interactive card hover
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const features = [
    {
      id: "project-battles",
      title: "Project Battles & Arena Rankings",
      category: "showcase",
      colSpan: "lg:col-span-2",
      desc: "Submit your side projects to compete in community arena battles. Rank up based on peer votes, code craftsmanship, and live production demos.",
      icon: (
        <div className="animate-sword-clash">
          <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="3" y="3" width="3" height="3" fill="#18181b" />
            <rect x="6" y="6" width="3" height="3" fill="#18181b" />
            <rect x="9" y="9" width="3" height="3" fill="#3f3f46" />
            <rect x="12" y="12" width="3" height="3" fill="#18181b" />
            <rect x="15" y="15" width="3" height="3" fill="#71717a" />
            <rect x="18" y="18" width="3" height="3" fill="#18181b" />
            <rect x="18" y="3" width="3" height="3" fill="#18181b" />
            <rect x="15" y="6" width="3" height="3" fill="#18181b" />
            <rect x="6" y="15" width="3" height="3" fill="#18181b" />
            <rect x="3" y="18" width="3" height="3" fill="#18181b" />
          </svg>
        </div>
      ),
      badge: "ARENA MODE",
      highlight: "Head-to-head project battles & live peer rankings",
      widget: (
        <div className="mt-4 p-3.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
            <span className="text-zinc-900 font-bold tracking-tight">DevPulse</span>
            <span className="text-zinc-400 font-extrabold text-[10px]">VS</span>
            <span className="text-zinc-800 font-bold tracking-tight">Algorank</span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-white font-extrabold text-[10px] shadow-sm">
            842 Votes Today
          </span>
        </div>
      ),
    },
    {
      id: "proof-of-work",
      title: "Live Proof-of-Work",
      category: "showcase",
      colSpan: "lg:col-span-1",
      desc: "Connect your GitHub repositories to showcase verified commit histories, real-world contributions, and live production deployments.",
      icon: (
        <div>
          <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="2" y="4" width="20" height="16" fill="#ffffff" stroke="#18181b" strokeWidth="2" />
            <rect x="5" y="8" width="3" height="2" fill="#18181b" />
            <rect x="7" y="10" width="3" height="2" fill="#18181b" />
            <rect x="5" y="12" width="3" height="2" fill="#18181b" />
            <rect x="11" y="12" width="5" height="2" className="animate-terminal-blink fill-zinc-900" />
          </svg>
        </div>
      ),
      badge: "GITHUB SYNCED",
      highlight: "Auto-synced contribution graph & code stats",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center gap-1.5 justify-center shadow-sm">
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-300" />
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-400" />
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-900 shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-500" />
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-900 shadow-sm" />
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-400" />
          <span className="text-[10px] font-mono text-zinc-700 ml-2">1,240 Commits</span>
        </div>
      ),
    },
    {
      id: "teammate-match",
      title: "Co-Founder Matchmaking",
      category: "connect",
      colSpan: "lg:col-span-1",
      desc: "Find ideal hackathon teammates, frontend wizards, backend architects, or AI researchers based on complementary skill sets.",
      icon: (
        <div className="animate-team-pulse">
          <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="4" y="5" width="5" height="5" fill="#18181b" />
            <rect x="3" y="11" width="7" height="6" fill="#18181b" />
            <rect x="15" y="5" width="5" height="5" fill="#18181b" />
            <rect x="14" y="11" width="7" height="6" fill="#18181b" />
          </svg>
        </div>
      ),
      badge: "TEAMMAKING",
      highlight: "AI-powered skill matrix matching engine",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-sm">
          <span className="text-zinc-800 font-semibold">Match Score</span>
          <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-extrabold text-[10px]">
            98% Compatible
          </span>
        </div>
      ),
    },
    {
      id: "xp-levels",
      title: "XP & Badge Progression",
      category: "grow",
      colSpan: "lg:col-span-1",
      desc: "Earn XP points by shipping repositories, assisting peers, writing technical notes, and winning competitive hackathons.",
      icon: (
        <div className="animate-[bounce_2s_infinite]">
          <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="10" y="2" width="4" height="4" fill="#18181b" />
            <rect x="6" y="6" width="12" height="4" fill="#18181b" />
            <rect x="8" y="10" width="8" height="6" fill="#18181b" />
            <rect x="10" y="16" width="4" height="4" fill="#18181b" />
          </svg>
        </div>
      ),
      badge: "GAMIFIED XP",
      highlight: "Unlock tier badges & exclusive builder perks",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-sm">
          <span className="text-zinc-800 font-semibold">Current Rank</span>
          <span className="text-zinc-900 font-bold">LVL 42 • 14,250 XP</span>
        </div>
      ),
    },
    {
      id: "recruiter-pipeline",
      title: "Direct Founder Pipeline",
      category: "connect",
      colSpan: "lg:col-span-1",
      desc: "Top-ranked student builders get direct inbound messages from tech founders, venture funds, and fast-growing YC startups.",
      icon: (
        <div className="animate-[pulse_3s_infinite]">
          <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="3" y="3" width="18" height="18" fill="none" stroke="#18181b" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="#71717a" strokeWidth="1.5" />
            <g className="animate-radar-scan">
              <line x1="12" y1="12" x2="20" y2="6" stroke="#18181b" strokeWidth="2" />
            </g>
          </svg>
        </div>
      ),
      badge: "DIRECT PIPELINE",
      highlight: "Bypass resume screening with real code",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-sm">
          <span className="text-zinc-800 font-semibold">14 Founder Inbounds</span>
          <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-extrabold text-[10px]">
            YC Backed
          </span>
        </div>
      ),
    },
    {
      id: "hackathon-hub",
      title: "Global Hackathon Feed",
      category: "showcase",
      colSpan: "lg:col-span-1",
      desc: "Discover upcoming student hackathons, submit project demos, and compete on live global leaderboards.",
      icon: (
        <div className="animate-flame-flicker">
          <svg className="w-6 h-6 text-zinc-900" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="10" y="3" width="4" height="4" fill="#18181b" />
            <rect x="8" y="7" width="8" height="5" fill="#18181b" />
            <rect x="6" y="12" width="12" height="6" fill="#18181b" />
            <rect x="8" y="18" width="8" height="3" fill="#3f3f46" />
          </svg>
        </div>
      ),
      badge: "HACKATHONS",
      highlight: "Live tracking & trophy showcases",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-sm">
          <span className="text-zinc-800 font-semibold">ETHIndia 2026</span>
          <span className="text-emerald-700 font-bold">3d 14h left</span>
        </div>
      ),
    },
  ];

  const filteredFeatures =
    activeFilter === "all"
      ? features
      : features.filter((f) => f.category === activeFilter);

  // Timer loop for cute pixel guy peeking behind feature boxes
  useEffect(() => {
    const initialTimeout = setTimeout(() => {
      triggerPeek();
    }, 1200);

    const triggerPeek = () => {
      const randomIndex = Math.floor(Math.random() * filteredFeatures.length);
      setPeekBoxIndex(randomIndex);

      setIsWaving(true);
      setTimeout(() => {
        setIsWaving(false);
        setTimeout(() => setPeekBoxIndex(null), 700);
      }, 2500);
    };

    const interval = setInterval(triggerPeek, 6500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [filteredFeatures.length]);

  return (
    <section id="features" className="py-24 bg-[#faf6f0] text-zinc-900 relative overflow-hidden border-t border-[#e8e2d8]">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-amber-200/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#e2dacd] bg-white text-xs font-mono text-zinc-800 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
            POWERFUL CAPABILITIES
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900">
            Engineered for Ambitious Builders
          </h2>
          <p className="text-base sm:text-lg text-zinc-700 font-normal leading-relaxed">
            Everything student developers need to build, showcase side projects, match with teammates, and accelerate their tech career.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4 font-mono">
            {[
              { id: "all", label: "All Features", count: features.length },
              { id: "showcase", label: "Showcase", count: features.filter(f => f.category === "showcase").length },
              { id: "connect", label: "Connect", count: features.filter(f => f.category === "connect").length },
              { id: "grow", label: "Grow & Learn", count: features.filter(f => f.category === "grow").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                  activeFilter === tab.id
                    ? "bg-zinc-900 text-white font-bold shadow-md"
                    : "bg-white text-zinc-700 border border-[#e8e2d8] hover:text-zinc-900 hover:border-zinc-400"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeFilter === tab.id ? "bg-white text-zinc-900" : "bg-zinc-100 text-zinc-600"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
          {filteredFeatures.map((item, index) => (
            <div
              key={item.id}
              className={`relative pt-3 ${activeFilter === "all" ? item.colSpan : ""}`}
            >
              {/* Peeking 8-Bit Pixel Guy */}
              {peekBoxIndex === index && (
                <div
                  className={`absolute -top-3 right-8 z-0 pointer-events-none transition-all duration-700 transform ${
                    isWaving
                      ? "-translate-y-2 opacity-100 scale-100"
                      : "translate-y-6 opacity-0 scale-90"
                  }`}
                >
                  <div className="animate-cute-excitement">
                    <svg
                      className="w-12 h-12 text-zinc-900 drop-shadow-md"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ shapeRendering: "crispEdges" }}
                    >
                      <rect x="5" y="4" width="12" height="3" fill="#18181b" />
                      <rect x="6" y="6" width="10" height="9" fill="#18181b" />
                      <rect x="8" y="9" width="2" height="2.5" fill="#ffffff" />
                      <rect x="13" y="9" width="2" height="2.5" fill="#ffffff" />
                      <rect x="9" y="9" width="1" height="1" fill="#18181b" />
                      <rect x="14" y="9" width="1" height="1" fill="#18181b" />
                      <rect x="10" y="13" width="3" height="1" fill="#ffffff" />
                      <rect x="7" y="15" width="8" height="8" fill="#3f3f46" />
                      <rect x="4" y="15" width="3" height="2" fill="#18181b" />
                      <g className="animate-cute-fast-wave">
                        <rect x="15" y="11" width="4" height="2" fill="#18181b" />
                        <rect x="17" y="7" width="2" height="5" fill="#18181b" />
                        <rect x="16" y="5" width="4" height="3" fill="#18181b" />
                      </g>
                    </svg>
                  </div>
                </div>
              )}

              {/* Main Bento Feature Card */}
              <div
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onMouseMove={handleMouseMove}
                className="group relative rounded-3xl border border-[#e8e2d8] bg-white p-7 hover:border-[#d8cfc0] transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-sm z-10 h-full overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-[#f4efe6] border border-[#e2dacd]">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 tracking-tight group-hover:text-black transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100">
                  <div className="text-[11px] font-mono text-zinc-500 font-semibold flex items-center gap-1.5">
                    <span className="text-zinc-900">✓</span>
                    <span>{item.highlight}</span>
                  </div>
                  {item.widget}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}