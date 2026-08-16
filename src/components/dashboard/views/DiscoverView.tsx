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
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>("");
  
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "likes">("trending");
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({});

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
      description: "Lightweight WebAssembly execution sandbox for untrusted user-submitted code in browser environments with CPU time caps.",
      tech: ["Rust", "Wasm", "TypeScript", "Vite"],
      progress: 92,
      stars: 420,
      status: "Shipped",
      visibility: "Public",
      updatedAt: "4 days ago",
      likes: 380,
      views: 2310,
      forks: 64,
      commits: 165,
      daysActive: 50,
      github: "https://github.com/ananya/aura-sandbox",
      campus: "IISc Bangalore '25",
      creatorHandle: "ananya_vasisht",
    },
  ];

  const toggleLike = (id: string) => {
    setLikedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProjects = discoverProjects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.campus.toLowerCase().includes(q) ||
      p.creatorHandle.toLowerCase().includes(q) ||
      p.tech.some((t) => t.toLowerCase().includes(q))
    );
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "likes") return (b.likes + (likedProjects[b.id] ? 1 : 0)) - (a.likes + (likedProjects[a.id] ? 1 : 0));
    if (sortBy === "newest") return b.daysActive - a.daysActive;
    return b.stars - a.stars;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* SEARCH BAR WITH FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discoverable repositories by title, tech stack, or campus..."
            className="w-full px-4 py-3 rounded-2xl bg-white border border-[#e8e2d8] text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans pl-11 shadow-sm"
          />
          <svg className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex gap-2 font-mono text-xs">
          {(["trending", "newest", "likes"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSortBy(tab)}
              className={`px-3 py-2 rounded-2xl capitalize transition-all cursor-pointer ${
                sortBy === tab
                  ? "bg-zinc-900 text-white font-bold shadow-sm"
                  : "bg-white text-zinc-700 hover:text-zinc-900 border border-[#e8e2d8]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* FEED LIST WITH MICRO-ANIMATIONS */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 border-b border-[#e8e2d8] pb-3">
          <span>Student Software Showcase</span>
          <span>{sortedProjects.length} Verified Repositories</span>
        </div>

        <div className="space-y-5">
          {sortedProjects.map((project) => {
            const isLiked = likedProjects[project.id];
            const currentLikes = project.likes + (isLiked ? 1 : 0);

            return (
              <div
                key={project.id}
                className="p-6 rounded-3xl bg-white border border-[#e8e2d8] shadow-sm hover:border-zinc-400 hover:-translate-y-1 hover:shadow-md transition-all duration-300 space-y-4 group"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="text-xl sm:text-2xl font-extrabold text-zinc-900 group-hover:text-black transition-colors hover:underline cursor-pointer tracking-tight"
                      >
                        {project.name}
                      </h2>
                      <span className={`px-2.5 py-0.5 rounded text-xs font-mono border shrink-0 ${
                        project.status === "Shipped"
                          ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                          : "bg-[#f4efe6] text-zinc-800 border-[#e2dacd]"
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

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => toggleLike(project.id)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isLiked
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-xs scale-105"
                          : "bg-[#f4efe6] text-zinc-800 border-[#e2dacd] hover:bg-zinc-900 hover:text-white"
                      }`}
                    >
                      <span className={isLiked ? "animate-heart-pulse text-red-400" : ""}>♥</span>
                      <span>{currentLikes}</span>
                    </button>

                    <button
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono transition-all shrink-0 shadow-sm cursor-pointer"
                    >
                      View Case Study ➔
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-700 font-sans leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 font-mono text-xs">
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-800 font-medium group-hover:border-zinc-300 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Bottom Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-zinc-100 font-mono text-xs text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-900 font-bold">★ {project.stars}</span>
                    <span>Stars</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-900 font-bold">{currentLikes}</span>
                    <span>Likes</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
