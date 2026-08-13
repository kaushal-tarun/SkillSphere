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
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="3" y="3" width="3" height="3" fill="#ffffff" />
            <rect x="6" y="6" width="3" height="3" fill="#ffffff" />
            <rect x="9" y="9" width="3" height="3" fill="#d4d4d8" />
            <rect x="12" y="12" width="3" height="3" fill="#ffffff" />
            <rect x="15" y="15" width="3" height="3" fill="#a1a1aa" />
            <rect x="18" y="18" width="3" height="3" fill="#ffffff" />
            <rect x="18" y="3" width="3" height="3" fill="#ffffff" />
            <rect x="15" y="6" width="3" height="3" fill="#ffffff" />
            <rect x="6" y="15" width="3" height="3" fill="#ffffff" />
            <rect x="3" y="18" width="3" height="3" fill="#ffffff" />
          </svg>
        </div>
      ),
      badge: "ARENA MODE",
      highlight: "Head-to-head project battles & live peer rankings",
      widget: (
        <div className="mt-4 p-3.5 rounded-xl bg-black/80 border border-zinc-800/90 flex items-center justify-between font-mono text-xs shadow-inner">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white font-bold tracking-tight">DevPulse</span>
            <span className="text-zinc-600 font-extrabold text-[10px]">VS</span>
            <span className="text-zinc-300 font-bold tracking-tight">Algorank</span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-white text-black font-extrabold text-[10px] shadow-[0_0_12px_rgba(255,255,255,0.4)]">
            ⚡ 842 Votes Today
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
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="2" y="4" width="20" height="16" fill="#000000" stroke="#ffffff" strokeWidth="2" />
            <rect x="5" y="8" width="3" height="2" fill="#ffffff" />
            <rect x="7" y="10" width="3" height="2" fill="#ffffff" />
            <rect x="5" y="12" width="3" height="2" fill="#ffffff" />
            <rect x="11" y="12" width="5" height="2" className="animate-terminal-blink fill-white" />
          </svg>
        </div>
      ),
      badge: "GITHUB SYNCED",
      highlight: "Auto-synced contribution graph & code stats",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-black/80 border border-zinc-800/90 flex items-center gap-1.5 justify-center shadow-inner">
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-800" />
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-700" />
          <span className="w-3.5 h-3.5 rounded-xs bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-400" />
          <span className="w-3.5 h-3.5 rounded-xs bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
          <span className="w-3.5 h-3.5 rounded-xs bg-zinc-700" />
          <span className="text-[10px] font-mono text-zinc-300 ml-2">1,240 Commits</span>
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
        <div className="animate-heart-pulse">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="5" y="5" width="5" height="4" fill="#ffffff" />
            <rect x="14" y="5" width="5" height="4" fill="#ffffff" />
            <rect x="3" y="9" width="18" height="5" fill="#ffffff" />
            <rect x="5" y="14" width="14" height="4" fill="#ffffff" />
            <rect x="8" y="18" width="8" height="3" fill="#ffffff" />
            <rect x="10" y="21" width="4" height="2" fill="#ffffff" />
          </svg>
        </div>
      ),
      badge: "MATCHMAKING",
      highlight: "Filter by Tech Stack, University & Timezone",
      widget: (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {["React", "Next.js", "Python", "AI / ML", "Rust"].map((skill) => (
            <span key={skill} className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 hover:border-white hover:text-white transition-colors cursor-default">
              {skill}
            </span>
          ))}
        </div>
      ),
    },
    {
      id: "skill-badges",
      title: "Verified Skill Reputation",
      category: "grow",
      colSpan: "lg:col-span-2",
      desc: "Earn XP, unlock verified badges from hackathon wins, peer code reviews, and open-source merged pull requests.",
      icon: (
        <div className="animate-trophy-sparkle">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="5" y="3" width="14" height="7" fill="#ffffff" />
            <rect x="8" y="10" width="8" height="5" fill="#ffffff" />
            <rect x="10" y="15" width="4" height="4" fill="#d4d4d8" />
            <rect x="6" y="19" width="12" height="3" fill="#ffffff" />
            <rect x="3" y="4" width="2" height="4" fill="#ffffff" />
            <rect x="19" y="4" width="2" height="4" fill="#ffffff" />
          </svg>
        </div>
      ),
      badge: "VERIFIED REPUTATION",
      highlight: "Tamper-proof developer rank & certificates",
      widget: (
        <div className="mt-4 p-3.5 rounded-xl bg-black/80 border border-zinc-800/90 flex items-center justify-between font-mono text-xs shadow-inner">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">🏆 LEVEL 42</span>
            <span className="text-zinc-600">•</span>
            <span className="text-zinc-300 font-bold">14,250 XP</span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 text-[10px]">
            RANK #1 • IIT BOMBAY
          </span>
        </div>
      ),
    },
    {
      id: "peer-review",
      title: "Peer Code Reviews",
      category: "grow",
      colSpan: "lg:col-span-1",
      desc: "Get feedback on your architecture and code readability from senior student mentors and experienced campus leads.",
      icon: (
        <div className="animate-bubble-bounce">
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="3" y="4" width="18" height="13" fill="#ffffff" />
            <rect x="5" y="17" width="5" height="4" fill="#ffffff" />
            <rect x="9" y="9" width="2" height="4" fill="#000000" />
            <rect x="11" y="11" width="4" height="2" fill="#000000" />
          </svg>
        </div>
      ),
      badge: "MENTORSHIP",
      highlight: "Constructive feedback & code audits",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-black/80 border border-zinc-800/90 flex items-center justify-between font-mono text-xs shadow-inner">
          <span className="text-emerald-400 font-semibold">+ 12 Audits Done</span>
          <span className="text-amber-300 font-bold">4.9 ★ Rating</span>
        </div>
      ),
    },
    {
      id: "recruiter-spotlight",
      title: "Recruiter & Founder Access",
      category: "connect",
      colSpan: "lg:col-span-1",
      desc: "Get discovered directly by tech recruiters, YC founders, and hackathon judges seeking top engineering talent.",
      icon: (
        <div>
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="3" y="3" width="18" height="18" fill="none" stroke="#ffffff" strokeWidth="2" />
            <circle cx="12" cy="12" r="4" fill="none" stroke="#a1a1aa" strokeWidth="1.5" />
            <g className="animate-radar-scan">
              <line x1="12" y1="12" x2="20" y2="6" stroke="#ffffff" strokeWidth="2" />
            </g>
          </svg>
        </div>
      ),
      badge: "DIRECT PIPELINE",
      highlight: "Bypass resume screening with real code",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-black/80 border border-zinc-800/90 flex items-center justify-between font-mono text-xs shadow-inner">
          <span className="text-zinc-300 font-semibold">14 Founder Inbounds</span>
          <span className="px-2 py-0.5 rounded bg-white text-black font-extrabold text-[10px]">
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
          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
            <rect x="10" y="3" width="4" height="4" fill="#ffffff" />
            <rect x="8" y="7" width="8" height="5" fill="#ffffff" />
            <rect x="6" y="12" width="12" height="6" fill="#ffffff" />
            <rect x="8" y="18" width="8" height="3" fill="#d4d4d8" />
          </svg>
        </div>
      ),
      badge: "HACKATHONS",
      highlight: "Live tracking & trophy showcases",
      widget: (
        <div className="mt-4 p-3 rounded-xl bg-black/80 border border-zinc-800/90 flex items-center justify-between font-mono text-xs shadow-inner">
          <span className="text-zinc-300 font-semibold">🔥 ETHIndia 2026</span>
          <span className="text-emerald-400 font-bold">3d 14h left</span>
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

      // Hide after 2.8s of gentle waving
      setTimeout(() => {
        setIsWaving(false);
        setTimeout(() => {
          setPeekBoxIndex(null);
        }, 700);
      }, 2800);
    };

    const interval = setInterval(triggerPeek, 6500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [filteredFeatures.length]);

  return (
    <section id="features" className="py-24 bg-black text-white relative overflow-hidden border-t border-zinc-900">
      {/* Subtle Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            POWERFUL CAPABILITIES
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
            Engineered for Ambitious Builders
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Everything student developers need to build, showcase side projects, match with teammates, and accelerate their tech career.
          </p>

          {/* Filter Pills with Counts */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {[
              { id: "all", label: "All Features", count: features.length },
              { id: "showcase", label: "Showcase", count: features.filter(f => f.category === "showcase").length },
              { id: "connect", label: "Connect", count: features.filter(f => f.category === "connect").length },
              { id: "grow", label: "Grow & Learn", count: features.filter(f => f.category === "grow").length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-2 ${
                  activeFilter === tab.id
                    ? "bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                    : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeFilter === tab.id ? "bg-black text-white" : "bg-zinc-900 text-zinc-500"
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
              {/* Cute Waving & Jumping 8-Bit Pixel Guy Peeking BEHIND Box (z-0) */}
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
                      className="w-12 h-12 text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ shapeRendering: "crispEdges" }}
                    >
                      {/* Hair / Cap */}
                      <rect x="5" y="4" width="12" height="3" fill="#ffffff" />
                      {/* Head */}
                      <rect x="6" y="6" width="10" height="9" fill="#ffffff" />

                      {/* Cute Eyes */}
                      <rect x="8" y="9" width="2" height="2.5" fill="#000000" />
                      <rect x="13" y="9" width="2" height="2.5" fill="#000000" />
                      <rect x="9" y="9" width="1" height="1" fill="#ffffff" />
                      <rect x="14" y="9" width="1" height="1" fill="#ffffff" />

                      {/* Cute Smile */}
                      <rect x="10" y="13" width="3" height="1" fill="#000000" />

                      {/* Torso (Hidden behind card top edge) */}
                      <rect x="7" y="15" width="8" height="8" fill="#e4e4e7" />

                      {/* Left Hand Resting on Edge */}
                      <rect x="4" y="15" width="3" height="2" fill="#ffffff" />

                      {/* Right Waving Hand in High Excitement */}
                      <g className="animate-cute-fast-wave">
                        <rect x="15" y="11" width="4" height="2" fill="#ffffff" />
                        <rect x="17" y="7" width="2" height="5" fill="#ffffff" />
                        <rect x="16" y="5" width="4" height="3" fill="#ffffff" />
                      </g>
                    </svg>
                  </div>
                </div>
              )}

              {/* Main Bento Feature Card Container with Mouse Spotlight Glow */}
              <div
                onMouseEnter={() => setHoveredCardId(item.id)}
                onMouseLeave={() => setHoveredCardId(null)}
                onMouseMove={handleMouseMove}
                className="group relative rounded-3xl border border-zinc-800/90 bg-zinc-950/90 p-7 backdrop-blur-2xl hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-2xl shadow-black/90 z-10 h-full overflow-hidden"
              >
                {/* Interactive Cursor Spotlight Glow */}
                {hoveredCardId === item.id && (
                  <div
                    className="absolute pointer-events-none transition-opacity duration-300 -inset-px rounded-3xl opacity-100 z-0"
                    style={{
                      background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 80%)`,
                    }}
                  />
                )}

                {/* Subtle top ambient glow line on hover */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

                <div className="relative z-10">
                  {/* Header 8-bit gamified animation icon & badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-b from-zinc-800 to-zinc-900 border border-zinc-700/80 group-hover:border-zinc-500 group-hover:scale-110 transition-all shadow-md">
                      {item.icon}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-zinc-900/90 text-[10px] font-mono text-zinc-300 border border-zinc-800 tracking-wider">
                      {item.badge}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2.5 group-hover:text-zinc-100 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                    {item.desc}
                  </p>

                  {/* Interactive Micro-Widget preview */}
                  {item.widget}
                </div>

                {/* Bottom Feature Highlight */}
                <div className="pt-5 mt-6 border-t border-zinc-900 text-xs font-mono text-zinc-400 flex items-center gap-2 relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span className="group-hover:text-zinc-200 transition-colors">{item.highlight}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}