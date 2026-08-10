"use client";

import React from "react";

export default function Stats() {
  const statItems = [
    {
      metric: "15,000+",
      label: "Active Student Builders",
      desc: "Across MIT, Stanford, IIT, Oxford, and 300+ global universities.",
      tag: "GLOBAL NETWORK",
    },
    {
      metric: "4,200+",
      label: "Projects Showcased",
      desc: "Live full-stack apps, AI models, open-source libraries, and Web3 protocols.",
      tag: "PROOF OF WORK",
    },
    {
      metric: "850+",
      label: "Hackathon Teams Formed",
      desc: "Matched through SkillSphere's skill-based co-founder finder algorithm.",
      tag: "MATCHMAKING",
    },
    {
      metric: "98%",
      label: "Verified Rep Accuracy",
      desc: "Automated GitHub commit verification & tamper-proof skill badges.",
      tag: "VERIFIED STATS",
    },
  ];

  return (
    <section id="stats" className="py-20 bg-black text-white relative overflow-hidden border-t border-zinc-900">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            MEASURABLE IMPACT
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Proven Growth & Momentum
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Real metrics from the fastest-growing student developer network.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statItems.map((item, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-zinc-800 bg-zinc-950/90 p-6 backdrop-blur-md hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono text-zinc-400 tracking-wider">
                  {item.tag}
                </span>
                <div className="text-4xl sm:text-5xl font-extrabold text-white my-3 tracking-tight group-hover:scale-105 transition-transform duration-300">
                  {item.metric}
                </div>
                <div className="text-base font-semibold text-zinc-200 mb-2">
                  {item.label}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-6 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>STATUS: VERIFIED</span>
                <span className="text-white">LIVE ★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}