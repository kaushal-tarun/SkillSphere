"use client";

import React, { useState } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";

interface DiscoverViewProps {
  user: UserProfile;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onSelectProject?: (proj: ProjectItem) => void;
  onNavigateToProfile?: () => void;
  onNavigateToUser?: (username: string) => void;
}

export function DiscoverView({
  user,
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
  onSelectProject,
  onNavigateToUser,
}: DiscoverViewProps) {
  const [internalSearchQuery, setInternalSearchQuery] = useState<string>("");
  
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;
  const [sortBy, setSortBy] = useState<"trending" | "newest" | "stars">("trending");
  const [starredProjects, setStarredProjects] = useState<Record<string, boolean>>({});

  const [discoverProjects, setDiscoverProjects] = useState<(ProjectItem & { campus?: string; creatorHandle?: string })[]>([]);

  React.useEffect(() => {
    async function fetchDiscoverProjects() {
      try {
        const res = await fetch("/api/projects?scope=all");
        if (res.ok) {
          const data = await res.json();
          if (data.projects && Array.isArray(data.projects)) {
            setDiscoverProjects(data.projects);
          }
        }
      } catch (e) {
        console.error("Failed to load discover projects from PostgreSQL", e);
      }
    }
    fetchDiscoverProjects();
  }, []);

  const toggleStar = async (id: string) => {
    setStarredProjects((prev) => ({ ...prev, [id]: !prev[id] }));
    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: id, username: user.username }),
      });
    } catch (e) {
      console.error("Failed to update star in PostgreSQL", e);
    }
  };

  const filteredProjects = discoverProjects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.campus && p.campus.toLowerCase().includes(q)) ||
      (p.creatorHandle && p.creatorHandle.toLowerCase().includes(q)) ||
      p.tech.some((t) => t.toLowerCase().includes(q))
    );
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const starsA = (a.stars || 0) + (starredProjects[a.id] ? 1 : 0);
    const starsB = (b.stars || 0) + (starredProjects[b.id] ? 1 : 0);
    if (sortBy === "stars") return starsB - starsA;
    if (sortBy === "newest") return b.daysActive - a.daysActive;
    return starsB - starsA;
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
          {(["trending", "newest", "stars"] as const).map((tab) => (
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
          {sortedProjects.length > 0 ? (
            sortedProjects.map((project) => {
              const isStarred = starredProjects[project.id];
              const currentStars = (project.stars || 0) + (isStarred ? 1 : 0);

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
                      <span>
                        Built by{" "}
                        <button
                          type="button"
                          onClick={() => onNavigateToUser && onNavigateToUser(project.creatorHandle || "")}
                          className="text-zinc-900 font-bold hover:underline cursor-pointer"
                        >
                          @{project.creatorHandle}
                        </button>
                      </span>
                      <span>•</span>
                      <span>{project.campus}</span>
                      <span>•</span>
                      <span>Updated {project.updatedAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => toggleStar(project.id)}
                      className={`px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isStarred
                          ? "bg-amber-100 border-amber-300 text-amber-900 shadow-xs"
                          : "bg-[#f4efe6] text-zinc-800 border-[#e2dacd] hover:bg-zinc-200"
                      }`}
                    >
                      <span>★</span>
                      <span>{currentStars}</span>
                    </button>

                    <button
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono transition-all shrink-0 shadow-sm cursor-pointer"
                    >
                      View ➔
                    </button>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-700 font-sans leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                {project.tech && project.tech.length > 0 && (
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
                )}

                {/* Bottom Metrics */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 font-mono text-xs text-zinc-600">
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-900 font-bold">★ {currentStars}</span>
                    <span>Stars</span>
                  </div>
                </div>
              </div>
              );
            })
          ) : (
            <div className="p-12 rounded-3xl bg-white border border-[#e8e2d8] text-center space-y-3 shadow-sm">
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">No discoverable repositories found</h3>
              <p className="text-xs text-zinc-600 font-sans">
                Try adjusting your search query or switching filter tabs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
