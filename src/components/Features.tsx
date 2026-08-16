"use client";

import React, { useState, useEffect, useRef } from "react";

interface FeatureItem {
  id: string;
  title: string;
  desc: string;
  highlight: string;
  widget: React.ReactNode;
}

function ScrollPopFeatureCard({ item, index }: { item: FeatureItem; index: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-16 scale-95"
      }`}
    >
      <div className="group relative h-full rounded-2xl bg-white border border-[#e8e2d8] p-6 sm:p-8 text-zinc-900 shadow-sm transition-all duration-300 hover:border-zinc-400 hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden">
        <div className="space-y-3">
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-zinc-900 group-hover:text-black transition-colors">
            {item.title}
          </h3>
          <p className="text-sm sm:text-base text-zinc-600 font-normal leading-relaxed">
            {item.desc}
          </p>
        </div>

        <div className="pt-6 mt-6 border-t border-zinc-100">
          <div className="text-xs font-mono text-zinc-500 flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-900" />
            <span>{item.highlight}</span>
          </div>
          {item.widget}
        </div>
      </div>
    </div>
  );
}

export default function Features() {
  const [starred, setStarred] = useState(false);

  const features: FeatureItem[] = [
    {
      id: "project-portfolio",
      title: "Project Portfolio & Case Studies",
      desc: "Publish your side projects, highlight tech stacks, and feature detailed case studies with live repository and demo links.",
      highlight: "Organized project cards & tech stack tags",
      widget: (
        <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-zinc-900" />
            <span className="text-zinc-900 font-bold tracking-tight">Nexa Study Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-white font-bold text-[11px]">
              Next.js 16
            </span>
            <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-white font-bold text-[11px]">
              pgvector
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "discover-engine",
      title: " Discover ",
      desc: "Explore community student repositories across AI, Web Development, Open Source, and Mobile Applications.",
      highlight: "Filter by categories & interactive star likes",
      widget: (
        <button
          onClick={() => setStarred(!starred)}
          className="w-full p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-xs hover:border-zinc-400 transition-all cursor-pointer"
        >
          <span className="text-zinc-800 font-semibold truncate">KnowledgeVault AI</span>
          <span className={`px-3 py-1 rounded-md font-bold text-[11px] transition-all ${
            starred ? "bg-zinc-900 text-white" : "bg-white text-zinc-900 border border-[#e8e2d8]"
          }`}>
            ★ {starred ? "211 Stars" : "210 Stars"}
          </span>
        </button>
      ),
    },
    {
      id: "campus-leaderboard",
      title: "Friends Leaderboard",
      desc: "View student builder rankings and compare project contributions across universities.",
      highlight: "Campus rankings across BITS, IIIT, IIT, & NIT",
      widget: (
        <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-xs">
          <span className="text-zinc-800 font-semibold">Campus Leaderboard</span>
          <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-white font-bold text-[11px]">
            #1 IIT Bombay
          </span>
        </div>
      ),
    },
    {
      id: "community-feed",
      title: "Community Developer Feed",
      desc: "Share project launches, code snippets, and updates. Filter feed by trending hashtags like #BuildInPublic and #NextJS16.",
      highlight: "Hashtag filters, code snippets, & comments",
      widget: (
        <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-xs">
          <span className="text-zinc-800 font-semibold">Trending Topic</span>
          <span className="text-zinc-900 font-bold bg-white px-2.5 py-1 rounded-md border border-[#e8e2d8]">
            #BuildInPublic (1.4k)
          </span>
        </div>
      ),
    },
    {
      id: "direct-messaging",
      title: "Direct Peer Messaging",
      desc: "Connect directly with student developers, send friend requests, and start project collaboration.",
      highlight: "Direct messaging & friend connections",
      widget: (
        <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-zinc-800 font-semibold truncate">Tanvi Kulkarni</span>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-zinc-900 text-white font-bold text-[11px] shrink-0">
            Direct Message
          </span>
        </div>
      ),
    },
    {
      id: "profile-settings",
      title: "Custom Profile & Preferences",
      desc: "Customize your public builder profile, university affiliation, portfolio links, and privacy settings.",
      highlight: "Custom profile bio, credentials, & privacy",
      widget: (
        <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center justify-between font-mono text-xs shadow-xs">
          <span className="text-zinc-800 font-semibold truncate">Advait Deshmukh</span>
          <span className="text-zinc-900 font-bold text-[11px] bg-white px-2.5 py-1 rounded-md border border-[#e8e2d8] shrink-0">
            ✓ Verified Builder
          </span>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-28 bg-[#faf6f0] text-zinc-900 relative overflow-hidden border-t border-[#e8e2d8]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-amber-200/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-zinc-900">
            Engineered for Student Builders
          </h2>
          <p className="text-base sm:text-lg text-zinc-700 font-normal leading-relaxed">
            Everything student developers need to manage projects, explore peer code, connect with campus builders, and share progress updates.
          </p>
        </div>

        {/* SCROLL-REVEAL SEQUENTIAL FEATURE CARDS */}
        <div className="space-y-8">
          {features.map((item, idx) => (
            <ScrollPopFeatureCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}