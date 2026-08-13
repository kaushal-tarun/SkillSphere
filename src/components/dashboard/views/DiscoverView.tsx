"use client";

import React, { useState } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";

interface DiscoverViewProps {
  user: UserProfile;
  onSelectProject?: (proj: ProjectItem) => void;
  onNavigateToProfile?: () => void;
}

export function DiscoverView({ user, onSelectProject, onNavigateToProfile }: DiscoverViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"trending" | "liked" | "stars">("trending");

  // 12 Authentic Student Repositories across campuses for continuous single-column scrolling
  const discoverProjects: (ProjectItem & { creatorName: string; creatorHandle: string; campus: string })[] = [
    {
      id: "disc-1",
      name: "KnowledgeVault AI",
      creatorName: user.name,
      creatorHandle: user.username,
      campus: user.university,
      description: "Document intelligence platform indexing PDFs & codebase repositories with pgvector vector embeddings under 100ms. Supports natural language exploration and automated source citations.",
      progress: 92,
      updatedAt: "2h ago",
      visibility: "Public",
      stars: 640,
      forks: 82,
      commits: 164,
      daysActive: 38,
      views: 2890,
      likes: 412,
      status: "Shipped",
      tech: ["Python", "FastAPI", "Vector DB", "React", "PostgreSQL"],
      github: "https://github.com/skillsphere/knowledge-vault",
    },
    {
      id: "disc-2",
      name: "Algorank Core Engine",
      creatorName: "Advait Deshmukh",
      creatorHandle: "advait_d",
      campus: "IIT Bombay '26",
      description: "Competitive coding platform evaluating algorithmic solutions with real-time WebSocket test execution, memory profiling, and automated test runner sandboxing.",
      progress: 95,
      updatedAt: "Yesterday",
      visibility: "Public",
      stars: 512,
      forks: 89,
      commits: 210,
      daysActive: 45,
      views: 2450,
      likes: 389,
      status: "Shipped",
      tech: ["Rust", "WebSockets", "Docker", "Next.js 16", "TypeScript"],
      github: "https://github.com/advait/algorank-core",
    },
    {
      id: "disc-3",
      name: "Aura Kernel Wasm Sandbox",
      creatorName: "Ananya Vasisht",
      creatorHandle: "ananya_vasisht",
      campus: "IISc Bangalore '25",
      description: "Lightweight WebAssembly execution sandbox isolating untrusted user-submitted code in browser environments with strict CPU time & heap limits.",
      progress: 88,
      updatedAt: "4 days ago",
      visibility: "Public",
      stars: 480,
      forks: 56,
      commits: 142,
      daysActive: 31,
      views: 2780,
      likes: 420,
      status: "Shipped",
      tech: ["Rust", "Wasm", "TypeScript", "Vite", "WebGPU"],
      github: "https://github.com/ananya/aura-sandbox",
    },
    {
      id: "disc-4",
      name: "HyperTrace APM Telemetry",
      creatorName: "Rudra Sengupta",
      creatorHandle: "rudra_sengupta",
      campus: "NIT Trichy '26",
      description: "Low-overhead distributed tracing collector for microservices architectures featuring custom OpenTelemetry exporters and ClickHouse columnar storage.",
      progress: 82,
      updatedAt: "3 days ago",
      visibility: "Public",
      stars: 380,
      forks: 42,
      commits: 112,
      daysActive: 28,
      views: 1890,
      likes: 295,
      status: "Active",
      tech: ["Go", "OpenTelemetry", "ClickHouse", "Docker", "Linux"],
      github: "https://github.com/rudra/hypertrace",
    },
    {
      id: "disc-5",
      name: "Nexa Study Engine",
      creatorName: "Tanvi Kulkarni",
      creatorHandle: "tanvi_kulkarni",
      campus: "BITS Pilani '25",
      description: "AI-assisted study flashcard engine syncing directly with Notion databases and Markdown notes to generate active recall review queues.",
      progress: 76,
      updatedAt: "2 days ago",
      visibility: "Public",
      stars: 298,
      forks: 34,
      commits: 88,
      daysActive: 19,
      views: 1420,
      likes: 210,
      status: "Active",
      tech: ["React", "FastAPI", "PostgreSQL", "TailwindCSS"],
      github: "https://github.com/tanvi/nexa-engine",
    },
    {
      id: "disc-6",
      name: "CodeCollab Realtime Workspace",
      creatorName: "Tushar Somani",
      creatorHandle: "tushar_somani",
      campus: "IIIT Hyderabad '26",
      description: "Real-time collaborative code editor equipped with WebRTC peer-to-peer audio channels and synchronized AST syntax tree parsing.",
      progress: 90,
      updatedAt: "2 days ago",
      visibility: "Public",
      stars: 340,
      forks: 48,
      commits: 135,
      daysActive: 36,
      views: 1540,
      likes: 245,
      status: "Shipped",
      tech: ["Node.js", "WebSockets", "Monaco Editor", "Redis", "WebRTC"],
      github: "https://github.com/tushar/codecollab",
    },
    {
      id: "disc-7",
      name: "VectorPulse DB Proxy",
      creatorName: "Kabir Sharma",
      creatorHandle: "kabir_sharma",
      campus: "IIT Delhi '26",
      description: "In-memory caching proxy layer optimizing vector embedding lookup latency for LLM agents under high query throughput.",
      progress: 74,
      updatedAt: "5 days ago",
      visibility: "Public",
      stars: 265,
      forks: 28,
      commits: 78,
      daysActive: 18,
      views: 1120,
      likes: 180,
      status: "Active",
      tech: ["Python", "FastAPI", "Redis", "Vector DB", "Docker"],
      github: "https://github.com/kabir/vectorpulse",
    },
    {
      id: "disc-8",
      name: "DevForge CI/CD Micro-Runner",
      creatorName: "Siddharth Verma",
      creatorHandle: "siddharth_v",
      campus: "IIT Kharagpur '26",
      description: "Automated Kubernetes micro-runner executing containerized test suites on isolated cloud nodes with instant slack alert triggers.",
      progress: 85,
      updatedAt: "6 days ago",
      visibility: "Public",
      stars: 310,
      forks: 39,
      commits: 104,
      daysActive: 25,
      views: 1390,
      likes: 220,
      status: "Shipped",
      tech: ["Go", "Kubernetes", "Docker", "Linux", "gRPC"],
      github: "https://github.com/siddharth/devforge",
    },
    {
      id: "disc-9",
      name: "Lumina 3D WebCAD Engine",
      creatorName: "Meera Nair",
      creatorHandle: "meera_nair",
      campus: "NIT Calicut '25",
      description: "Browser-based 3D mesh rendering engine accelerated by WebGPU shaders and compiled Rust WebAssembly binaries.",
      progress: 89,
      updatedAt: "1 week ago",
      visibility: "Public",
      stars: 410,
      forks: 52,
      commits: 156,
      daysActive: 40,
      views: 2100,
      likes: 315,
      status: "Shipped",
      tech: ["Rust", "Wasm", "WebGPU", "TypeScript", "Three.js"],
      github: "https://github.com/meera/lumina-cad",
    },
    {
      id: "disc-10",
      name: "TelemetryStream SSH Dashboard",
      creatorName: "Yash Mehta",
      creatorHandle: "yash_m",
      campus: "VJTI Mumbai '26",
      description: "Terminal live dashboard monitoring system resource metrics over encrypted SSH sockets with zero memory latency overhead.",
      progress: 70,
      updatedAt: "1 week ago",
      visibility: "Public",
      stars: 185,
      forks: 18,
      commits: 62,
      daysActive: 14,
      views: 890,
      likes: 135,
      status: "Active",
      tech: ["Go", "Linux", "SSH", "Docker"],
      github: "https://github.com/yash/telemetry-stream",
    },
    {
      id: "disc-11",
      name: "Flux Zero-Downtime DB Migrator",
      creatorName: "Pooja Reddy",
      creatorHandle: "pooja_reddy",
      campus: "HYD Tech '25",
      description: "Zero-downtime database schema migration runner for PostgreSQL and MySQL production database clusters.",
      progress: 80,
      updatedAt: "2 weeks ago",
      visibility: "Public",
      stars: 220,
      forks: 25,
      commits: 74,
      daysActive: 20,
      views: 980,
      likes: 150,
      status: "Shipped",
      tech: ["Node.js", "PostgreSQL", "Prisma", "TypeScript"],
      github: "https://github.com/pooja/flux-db",
    },
    {
      id: "disc-12",
      name: "Quanta Quantum Circuit Sim",
      creatorName: "Rahul Verma",
      creatorHandle: "rahul_v",
      campus: "IIT Kanpur '26",
      description: "Qubit circuit matrix multiplier simulating quantum gates up to 24 qubits in parallel C++ threads.",
      progress: 91,
      updatedAt: "2 weeks ago",
      visibility: "Public",
      stars: 530,
      forks: 74,
      commits: 180,
      daysActive: 42,
      views: 2650,
      likes: 395,
      status: "Shipped",
      tech: ["C++", "OpenMP", "Python", "Docker"],
      github: "https://github.com/rahul/quanta-sim",
    },
  ];

  // Sorting Logic
  const filteredProjects = discoverProjects.filter((p) => {
    return p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           p.campus.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "trending") return (b.stars * 2 + b.likes * 3 + b.views) - (a.stars * 2 + a.likes * 3 + a.views);
    if (sortBy === "liked") return b.likes - a.likes;
    return b.stars - a.stars;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* PAGE HEADER */}
      <div className="border-b border-zinc-900/90 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Discover</h1>
          <p className="text-xs font-mono text-zinc-400">
            Explore trending student software repositories ranked by peer proof-of-work & likes.
          </p>
        </div>

        {/* Sort Switcher Tabs */}
        <div className="flex gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs self-start sm:self-auto">
          {(["trending", "liked", "stars"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setSortBy(mode)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                sortBy === mode ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
              }`}
            >
              {mode === "trending" ? "Trending 🔥" : mode === "liked" ? "Most Liked 👍" : "Top Stars ★"}
            </button>
          ))}
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search discoverable repositories by title, tech stack, or campus..."
          className="w-full px-4 py-3 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans pl-11 transition-all"
        />
        <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* SINGLE COLUMN LARGE PROJECT SHOWCASE FEED */}
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-900 pb-3">
          <span>Student Software Showcase</span>
          <span>{sortedProjects.length} Verified Repositories</span>
        </div>

        {/* 1 Big Card per row! */}
        <div className="space-y-6">
          {sortedProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 sm:p-7 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-5 group"
            >
              {/* Top Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h2
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-zinc-200 transition-colors hover:underline cursor-pointer tracking-tight"
                    >
                      {project.name}
                    </h2>
                    <span className={`px-2.5 py-0.5 rounded text-xs font-mono border shrink-0 ${
                      project.status === "Shipped"
                        ? "bg-white text-black border-white font-bold"
                        : "bg-black text-zinc-400 border-zinc-800"
                    }`}>
                      ● {project.status}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                    <span>Built by <strong className="text-white font-bold">@{project.creatorHandle}</strong></span>
                    <span>•</span>
                    <span>{project.campus}</span>
                    <span>•</span>
                    <span>Updated {project.updatedAt}</span>
                  </div>
                </div>

                <button
                  onClick={() => onSelectProject && onSelectProject(project)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs font-mono transition-all shrink-0 shadow-sm cursor-pointer self-start sm:self-auto"
                >
                  View Case Study ➔
                </button>
              </div>

              {/* Description Body */}
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed font-normal">
                {project.description}
              </p>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                {project.tech.map((t, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl bg-black border border-zinc-800 text-zinc-300 font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* Bottom Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-4 border-t border-zinc-900/90 font-mono text-xs text-zinc-400">
                <div className="p-2.5 rounded-xl bg-black border border-zinc-800/80">
                  <div className="text-[10px] text-zinc-500">Stars</div>
                  <div className="text-white font-bold mt-0.5">★ {project.stars}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black border border-zinc-800/80">
                  <div className="text-[10px] text-zinc-500">Likes</div>
                  <div className="text-white font-bold mt-0.5">👍 {project.likes}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black border border-zinc-800/80">
                  <div className="text-[10px] text-zinc-500">Views</div>
                  <div className="text-white font-bold mt-0.5">{project.views.toLocaleString()}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black border border-zinc-800/80">
                  <div className="text-[10px] text-zinc-500">Commits</div>
                  <div className="text-white font-bold mt-0.5">{project.commits}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-black border border-zinc-800/80 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-zinc-500">Days Active</div>
                  <div className="text-white font-bold mt-0.5">{project.daysActive} Days</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
