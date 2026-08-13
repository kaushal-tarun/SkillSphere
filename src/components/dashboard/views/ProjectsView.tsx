"use client";

import React from "react";
import { UserProfile, ProjectItem, CommunityProject } from "@/types/dashboard";

interface ProjectsViewProps {
  user: UserProfile;
  projectsList: ProjectItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  techFilter: string;
  setTechFilter: (t: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  onOpenNewProjectModal: () => void;
  onSelectProject?: (proj: ProjectItem) => void;
}

export function ProjectsView({
  user,
  projectsList,
  searchQuery,
  setSearchQuery,
  techFilter,
  setTechFilter,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
  onOpenNewProjectModal,
  onSelectProject,
}: ProjectsViewProps) {
  const communityProjects: CommunityProject[] = [
    {
      id: "comm-1",
      name: "Nexa Study Engine",
      creatorName: "Tanvi Kulkarni",
      creatorHandle: "tanvi_kulkarni",
      university: "BITS Pilani '25",
      description: "AI-assisted flashcard generation engine syncing directly with Notion databases and Markdown notes.",
      tech: ["React", "FastAPI", "PostgreSQL", "Tailwind"],
      likes: 198,
      views: 1120,
      updatedAt: "Yesterday",
      github: "https://github.com/tanvi/nexa-engine",
    },
    {
      id: "comm-2",
      name: "CodeCollab Workspace",
      creatorName: "Tushar Somani",
      creatorHandle: "tushar_somani",
      university: "IIIT Hyderabad '26",
      description: "Real-time collaborative code editor with WebRTC audio channels and synchronized AST parsing.",
      tech: ["Node.js", "WebSockets", "Monaco Editor", "Redis"],
      likes: 245,
      views: 1540,
      updatedAt: "2 days ago",
      github: "https://github.com/tushar/codecollab",
    },
    {
      id: "comm-3",
      name: "HyperTrace Distributed APM",
      creatorName: "Rudra Sengupta",
      creatorHandle: "rudra_sengupta",
      university: "NIT Trichy '26",
      description: "Low-overhead distributed tracing collector for microservices with OpenTelemetry exporter plugin.",
      tech: ["Go", "OpenTelemetry", "ClickHouse", "Docker"],
      likes: 312,
      views: 1890,
      updatedAt: "3 days ago",
      github: "https://github.com/rudra/hypertrace",
    },
    {
      id: "comm-4",
      name: "Aura Kernel Sandbox",
      creatorName: "Ananya Vasisht",
      creatorHandle: "ananya_vasisht",
      university: "IISc Bangalore '25",
      description: "Lightweight WebAssembly execution sandbox for untrusted user-submitted code in browser environments.",
      tech: ["Rust", "Wasm", "TypeScript", "Vite"],
      likes: 420,
      views: 2780,
      updatedAt: "4 days ago",
      github: "https://github.com/ananya/aura-sandbox",
    },
  ];

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = techFilter === "all" || p.tech.some((t) => t.toLowerCase().includes(techFilter.toLowerCase()));
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesTech && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">Projects</h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Showcase your work. Track your progress. Learn from others.
          </p>
        </div>

        <button
          onClick={onOpenNewProjectModal}
          className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono shadow-sm transition-all cursor-pointer self-start sm:self-auto"
        >
          + New Project
        </button>
      </div>

      {/* FILTER BAR (Clean inputs, NO text-box hover clutter) */}
      <div className="p-3.5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full px-3.5 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans pl-8"
          />
          <svg className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={techFilter}
            onChange={(e) => setTechFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 font-mono text-xs focus:outline-none focus:border-zinc-400"
          >
            <option value="all">All Tech Stack</option>
            <option value="next">Next.js</option>
            <option value="python">Python</option>
            <option value="rust">Rust</option>
            <option value="typescript">TypeScript</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 font-mono text-xs focus:outline-none focus:border-zinc-400"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="shipped">Shipped</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-800 font-mono text-xs focus:outline-none focus:border-zinc-400"
          >
            <option value="updated">Recently Updated</option>
            <option value="stars">Most Stars</option>
            <option value="progress">Highest Progress</option>
          </select>
        </div>
      </div>

      {/* FEATURED PROJECT SECTION */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-5 relative overflow-hidden group">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
          <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-white font-bold">
            FEATURED CASE STUDY
          </span>
          <span>Spotlight Repository</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
              SkillSphere Platform Engine v1.0
            </h2>
            <p className="text-xs text-zinc-600 leading-relaxed font-normal line-clamp-2">
              A high-contrast developer networking platform built for university builders to verify proof-of-work, compete in 1v1 project battles, and showcase side projects to founders.
            </p>
            
            <div className="flex flex-wrap gap-1.5 font-mono text-[10px] pt-1">
              {["Next.js 16", "TypeScript", "Prisma", "PostgreSQL"].map((t) => (
                <span key={t} className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col justify-between bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-3">
            <div className="font-mono text-xs space-y-1">
              <div className="text-zinc-500 text-[10px]">Built By</div>
              <div className="text-zinc-900 font-bold">{user.name}</div>
              <div className="text-zinc-500 text-[10px]">{user.university}</div>
            </div>

            <button
              onClick={() => onSelectProject && projectsList[0] && onSelectProject(projectsList[0])}
              className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono text-center shadow-sm transition-all cursor-pointer"
            >
              View Case Study ➔
            </button>
          </div>
        </div>
      </div>

      {/* MY PROJECTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <span>My Projects</span>
            <span className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-600">
              {filteredProjects.length}
            </span>
          </h2>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="text-base font-bold text-zinc-900 hover:underline cursor-pointer"
                      >
                        {project.name}
                      </h3>
                      <span className="text-[10px] font-mono text-zinc-500">Updated {project.updatedAt}</span>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                      project.status === "Shipped"
                        ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                        : "bg-zinc-100 text-zinc-700 border-zinc-200"
                    }`}>
                      ● {project.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 font-normal leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {project.tech.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5 pt-3 border-t border-zinc-100 font-mono text-xs">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-zinc-500">Completion</span>
                      <span className="text-zinc-900 font-bold">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div
                        className="h-full bg-zinc-900 rounded-full transition-all duration-500"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="px-3 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-900 hover:text-white border border-zinc-200 text-zinc-800 text-xs font-mono font-bold transition-all cursor-pointer"
                    >
                      View Case Study ➔
                    </button>
                    <span className="text-[11px] text-zinc-500">★ {project.stars} Stars</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-white border border-zinc-200 text-center space-y-3 shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900">Your portfolio starts here.</h3>
            <p className="text-xs font-mono text-zinc-500 max-w-sm mx-auto">
              No projects found matching your filter criteria. Build and showcase your software repositories.
            </p>
            <button
              onClick={onOpenNewProjectModal}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono transition-all cursor-pointer shadow-sm"
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>

      {/* COMMUNITY SHOWCASE SECTION */}
      <div className="space-y-4 pt-2">
        <div className="border-b border-zinc-200 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">Discover Student Projects</h2>
            <p className="text-xs font-mono text-zinc-500">Curated showcase of software built by university developers across India.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityProjects.map((cp) => (
            <div
              key={cp.id}
              className="p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-zinc-900">{cp.name}</h3>
                    <div className="text-[11px] font-mono text-zinc-500">
                      by <span className="text-zinc-900 font-bold">@{cp.creatorHandle}</span> • {cp.university}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-zinc-500">
                    ★ {cp.likes} Likes
                  </span>
                </div>

                <p className="text-xs text-zinc-600 font-normal leading-relaxed line-clamp-2">
                  {cp.description}
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {cp.tech.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-600 font-medium">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 font-mono text-xs">
                <a
                  href={cp.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-900 hover:text-white border border-zinc-200 text-zinc-800 text-xs font-mono font-bold transition-all"
                >
                  View Project ➔
                </a>
                <span className="text-[11px] text-zinc-500">Updated {cp.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
