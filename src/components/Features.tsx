"use client";

import React, { useState } from "react";

export default function Features() {
  const [activeFilter, setActiveFilter] = useState("all");

  const features = [
    {
      id: "project-battles",
      title: "Project Battles & Rankings",
      category: "showcase",
      desc: "Submit your side projects to compete in community arena battles. Rank up based on peer votes, code craftsmanship, and live production demos.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      badge: "ARENA MODE",
      highlight: "Head-to-head project battles & rankings",
    },
    {
      id: "proof-of-work",
      title: "Live Proof-of-Work",
      category: "showcase",
      desc: "Connect your GitHub repositories to showcase verified commit histories, real-world contributions, and live production deployments.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      badge: "GITHUB SYNCED",
      highlight: "Auto-synced contribution graph & code stats",
    },
    {
      id: "teammate-match",
      title: "Co-Founder Matchmaking",
      category: "connect",
      desc: "Find ideal hackathon teammates, frontend wizards, backend architects, or AI researchers based on complementary skill sets.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      badge: "ALGORITHMIC MATCHING",
      highlight: "Filter by Tech Stack, University & Timezone",
    },
    {
      id: "skill-badges",
      title: "Verified Skill Reputation",
      category: "grow",
      desc: "Earn XP, unlock verified badges from hackathon wins, peer code reviews, and open-source merged pull requests.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      badge: "ON-CHAIN / VERIFIED",
      highlight: "Tamper-proof developer rank & certificates",
    },
    {
      id: "peer-review",
      title: "Peer Code Reviews",
      category: "grow",
      desc: "Get feedback on your architecture and code readability from senior student mentors and experienced campus leads.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      badge: "MENTORSHIP",
      highlight: "Constructive feedback & code audits",
    },
    {
      id: "recruiter-spotlight",
      title: "Recruiter & Founder Access",
      category: "connect",
      desc: "Get discovered directly by tech recruiters, YC founders, and hackathon judges seeking top engineering talent.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      badge: "DIRECT PIPELINE",
      highlight: "Bypass resume screening with real code",
    },
    {
      id: "hackathon-hub",
      title: "Global Hackathon Feed",
      category: "showcase",
      desc: "Discover upcoming student hackathons, submit project demos, and compete on live global leaderboards.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      badge: "HACKATHONS",
      highlight: "Live tracking & trophy showcases",
    },
  ];

  const filteredFeatures =
    activeFilter === "all"
      ? features
      : features.filter((f) => f.category === activeFilter);

  return (
    <section id="features" className="py-24 bg-black text-white relative overflow-hidden border-t border-zinc-900">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            POWERFUL CAPABILITIES
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Engineered for Ambitious Builders
          </h2>
          <p className="text-base sm:text-lg text-zinc-400">
            Everything student developers need to build, showcase, match with teammates, and accelerate their tech career.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {[
              { id: "all", label: "All Features" },
              { id: "showcase", label: "Showcase" },
              { id: "connect", label: "Connect" },
              { id: "grow", label: "Grow & Learn" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeFilter === tab.id
                    ? "bg-white text-black font-semibold shadow-md"
                    : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeatures.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl border border-zinc-800/80 bg-zinc-950/80 p-6 backdrop-blur-xl hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 shadow-xl shadow-black/60"
            >
              {/* Subtle top glow line on hover */}
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                {/* Header icon & badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800">
                    {item.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-200 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              {/* Bottom Feature Highlight */}
              <div className="pt-4 border-t border-zinc-900 text-xs font-mono text-zinc-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>{item.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}