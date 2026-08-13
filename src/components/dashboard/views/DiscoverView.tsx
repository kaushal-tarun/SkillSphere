"use client";

import React, { useState } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";

interface DiscoverViewProps {
  user: UserProfile;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSelectProject?: (proj: ProjectItem) => void;
  onNavigateToProfile?: () => void;
}

export function DiscoverView({
  user,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSelectProject,
  onNavigateToProfile,
}: DiscoverViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>("");
  
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "likes">("trending");

  const discoverProjects: (ProjectItem & { campus: string; creatorHandle: string })[] = [
    {
      id: "disc-1",
      name: "KnowledgeVault AI",
      description: "Enterprise PDF & research paper indexing engine using PostgreSQL pgvector. Performs sub-100ms vector similarity searches with instant AST citations.",
      tech: ["Next.js 16", "TypeScript", "PostgreSQL", "pgvector", "Prisma"],
      progress: 95,
      stars: 340,
      status: "Shipped",
      visibility: "Public",
      updatedAt: "2 hours ago",
      likes: 210,
      views: 1420,
      forks: 48,
      commits: 112,
      daysActive: 38,
      github: "https://github.com/advait/knowledge-vault",
      campus: "IIT Bombay '26",
      creatorHandle: "advait_d",
    },
    {
      id: "disc-2",
      name: "Nexa Study Engine",
      description: "AI-assisted flashcard generation engine syncing directly with Notion databases and Markdown notes for university exams.",
      tech: ["React", "FastAPI", "PostgreSQL", "TailwindCSS"],
      progress: 90,
      stars: 285,
      status: "Shipped",
      visibility: "Public",
      updatedAt: "Yesterday",
      likes: 198,
      views: 1120,
      forks: 34,
      commits: 86,
      daysActive: 24,
      github: "https://github.com/tanvi/nexa-engine",
      campus: "BITS Pilani '25",
      creatorHandle: "tanvi_kulkarni",
    },
    {
      id: "disc-3",
      name: "CodeCollab Workspace",
      description: "Real-time collaborative code editor with WebRTC mesh audio channels and synchronized AST syntax parsing.",
      tech: ["Node.js", "WebSockets", "Monaco Editor", "Redis"],
      progress: 85,
      stars: 410,
      status: "Active",
      visibility: "Public",
      updatedAt: "2 days ago",
      likes: 245,
      views: 1540,
      forks: 59,
      commits: 144,
      daysActive: 45,
      github: "https://github.com/tushar/codecollab",
      campus: "IIIT Hyderabad '26",
      creatorHandle: "tushar_somani",
    },
    {
      id: "disc-4",
      name: "HyperTrace Distributed APM",
      description: "Low-overhead distributed tracing collector for microservices with OpenTelemetry exporter plugin and ClickHouse analytics backend.",
      tech: ["Go", "OpenTelemetry", "ClickHouse", "Docker"],
      progress: 88,
      stars: 520,
      status: "Shipped",
      visibility: "Public",
      updatedAt: "3 days ago",
      likes: 312,
      views: 1890,
      forks: 72,
      commits: 190,
      daysActive: 60,
      github: "https://github.com/rudra/hypertrace",
      campus: "NIT Trichy '26",
      creatorHandle: "rudra_sengupta",
    },
    {
      id: "disc-5",
      name: "Aura Kernel Sandbox",
      description: "Lightweight WebAssembly execution sandbox for untrusted user-submitted code directly in browser environments.",
      tech: ["Rust", "Wasm", "TypeScript", "Vite"],
      progress: 92,
      stars: 640,
      status: "Shipped",
      visibility: "Public",
      updatedAt: "4 days ago",
      likes: 420,
      views: 2780,
      forks: 94,
      commits: 215,
      daysActive: 75,
      github: "https://github.com/ananya/aura-sandbox",
      campus: "IISc Bangalore '25",
      creatorHandle: "ananya_vasisht",
    },
  ];

  const filteredProjects = discoverProjects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tech.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.campus.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === "all") return matchesSearch;
    if (activeCategory === "ai") return matchesSearch && (p.tech.includes("pgvector") || p.description.includes("AI") || p.name.includes("AI"));
    if (activeCategory === "systems") return matchesSearch && (p.tech.includes("Go") || p.tech.includes("Rust") || p.tech.includes("Docker"));
    if (activeCategory === "web3") return matchesSearch && (p.tech.includes("WebSockets") || p.description.includes("collaborative"));
    return matchesSearch;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "likes") return b.likes - a.likes;
    if (sortBy === "newest") return b.daysActive - a.daysActive;
    return b.stars - a.stars;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">
            Discover Projects
          </h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Explore verified software repositories built by top student engineers across India.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 font-mono text-xs">
          {[
            { id: "all", label: "All Projects" },
            { id: "ai", label: "AI & Vector DB" },
            { id: "systems", label: "Systems & Infrastructure" },
            { id: "web3", label: "Realtime & Web Apps" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? "bg-zinc-900 text-white font-bold shadow-sm"
                  : "bg-white text-zinc-600 hover:text-zinc-900 border border-zinc-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH BAR (NO text-box hover clutter) */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search discoverable repositories by title, tech stack, or campus..."
          className="w-full px-4 py-3 rounded-2xl bg-white border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans pl-11 shadow-sm"
        />
        <svg className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* SINGLE COLUMN LARGE PROJECT SHOWCASE FEED (Pure White Cards) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-b border-zinc-200 pb-3">
          <span>Student Software Showcase</span>
          <span>{sortedProjects.length} Verified Repositories</span>
        </div>

        {/* 1 Big Card per row! */}
        <div className="space-y-6">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 text-zinc-900 shadow-sm hover:border-zinc-300 transition-all space-y-5 group"
            >
              {/* Top Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="text-xl sm:text-2xl font-extrabold text-zinc-900 hover:underline cursor-pointer tracking-tight"
                    >
                      {project.name}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono border shrink-0 ${
                      project.status === "Shipped"
                        ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200"
                    }`}>
                      ● {project.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-zinc-500 flex items-center gap-2">
                    <span>Built by <strong className="text-zinc-900 font-bold">@{project.creatorHandle}</strong></span>
                    <span>•</span>
                    <span>{project.campus}</span>
                    <span>•</span>
                    <span>Updated {project.updatedAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProject && onSelectProject(project)}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono transition-all shrink-0 shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  View Case Study ➔
                </button>
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm text-zinc-700 font-sans leading-relaxed">
                {project.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                {project.tech.map((t, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Bottom Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-100 font-mono text-xs text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-bold">★ {project.stars}</span>
                  <span>Stars</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-bold">❤️ {project.likes}</span>
                  <span>Likes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-bold">👁️ {project.views.toLocaleString()}</span>
                  <span>Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-bold">⚡ {project.progress}%</span>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
