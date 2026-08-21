"use client";

import React from "react";
import { UserProfile, ProjectItem, LeaderboardItem, ActivityItem } from "@/types/dashboard";
import { getBuilderTitle } from "@/lib/titles";

interface DashboardViewProps {
  user: UserProfile;
  projectsList: ProjectItem[];
  projectFilter: "all" | "active" | "shipped";
  setProjectFilter: (filter: "all" | "active" | "shipped") => void;
  leaderboardTop5: LeaderboardItem[];
  leaderboardTab: "global" | "campus";
  setLeaderboardTab: (tab: "global" | "campus") => void;
  activityFeed: ActivityItem[];
  onNavigateToProfile: () => void;
  onNavigateToDiscover?: () => void;
  onSelectProject?: (proj: ProjectItem) => void;
  onOpenNewProjectModal?: () => void;
  onLoadDemoProjects?: () => void;
}

export function DashboardView({
  user,
  projectsList,
  projectFilter,
  setProjectFilter,
  activityFeed,
  onNavigateToProfile,
  onNavigateToDiscover,
  onSelectProject,
  onOpenNewProjectModal,
}: DashboardViewProps) {
  const filteredProjects = projectsList.filter(
    (p) => projectFilter === "all" || p.status.toLowerCase() === projectFilter
  );

  const hasProjects = projectsList.length > 0;
  const titleInfo = getBuilderTitle(projectsList.length);

  return (
    <div className="animate-in fade-in duration-300 w-full">
      {!hasProjects ? (
        /* EMPTY STATE: PERFECTLY CENTERED & BALANCED POSITIONING FOR THE 2 CARDS */
        <div className="min-h-[75vh] flex flex-col justify-center max-w-2xl mx-auto space-y-6 py-6">
          {/* CARD 1: EMPTY PROJECTS CARD WITH SIGNATURE TRAVELING BORDER BEAM ANIMATION */}
          <div className="relative p-[2px] rounded-3xl overflow-hidden shadow-sm group">
            {/* Traveling Conic Gradient Border Beam */}
            <div className="absolute inset-0 w-[200%] h-[200%] top-[-50%] left-[-50%] bg-[conic-gradient(from_0deg,#e8e2d8_0deg,#e8e2d8_120deg,#171717_180deg,#e8e2d8_240deg,#e8e2d8_360deg)] animate-spin-border" />
            
            <div className="relative z-10 p-8 sm:p-12 rounded-[22px] bg-white text-center space-y-5">
              <div className="space-y-2 max-w-md mx-auto">
                <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">
                  Things look pretty empty here
                </h2>
                <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                  You haven't added any projects yet. Start building your portfolio or show off something you've been working on.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 font-mono text-xs">
                {onOpenNewProjectModal && (
                  <button
                    onClick={onOpenNewProjectModal}
                    className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    Add Your First Project
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* CARD 2: OUT OF IDEAS? DISCOVER PROMPT CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1 max-w-md">
              <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">Out of ideas?</h3>
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                Explore community discoveries, tech stack categories, and student repositories for inspiration.
              </p>
            </div>

            {onNavigateToDiscover && (
              <button
                onClick={onNavigateToDiscover}
                className="px-4 py-2.5 rounded-xl bg-[#f4efe6] hover:bg-zinc-900 hover:text-white border border-[#e2dacd] text-zinc-800 font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                Explore ➔
              </button>
            )}
          </div>
        </div>
      ) : (
        /* POPULATED DASHBOARD VIEW (WHEN PROJECTS EXIST) */
        <div className="max-w-4xl mx-auto space-y-6">

          <div className="flex items-center justify-between border-b border-[#e8e2d8] pb-4">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight flex items-center gap-2">
              <span>Your Projects</span>
              <span className="px-2 py-0.5 rounded bg-white border border-[#e8e2d8] text-xs font-mono text-zinc-600 shadow-xs">
                {projectsList.length}
              </span>
            </h2>

            <div className="flex gap-1 font-mono text-xs">
              {(["all", "active", "shipped"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setProjectFilter(filter)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    projectFilter === filter
                      ? "bg-zinc-900 text-white font-bold shadow-sm"
                      : "text-zinc-700 hover:text-zinc-900 bg-white border border-[#e8e2d8]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm hover:border-zinc-400 transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="text-base font-bold text-zinc-900 group-hover:text-black transition-colors hover:underline cursor-pointer truncate"
                      >
                        {project.name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border shrink-0 ${
                        project.status === "Shipped"
                          ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                          : "bg-[#f4efe6] text-zinc-800 border-[#e2dacd]"
                      }`}>
                        ● {project.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 line-clamp-1 font-normal">
                      {project.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onSelectProject && onSelectProject(project)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-zinc-900 hover:text-white border border-[#e8e2d8] text-zinc-800 text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <span>➔</span>
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-100 font-mono text-xs">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[#f4efe6] border border-[#e2dacd] text-[10px] text-zinc-800 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-zinc-500 shrink-0">
                    <span>★ {project.stars}</span>
                    <span>Updated {project.updatedAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CARD 2: DISCOVER PROMPT CARD */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8e2d8] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mt-6">
            <div className="space-y-1 max-w-lg">
              <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">Out of ideas?</h3>
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                Explore community discoveries, tech stack categories, and student repositories for inspiration.
              </p>
            </div>

            {onNavigateToDiscover && (
              <button
                onClick={onNavigateToDiscover}
                className="px-4 py-2.5 rounded-xl bg-[#f4efe6] hover:bg-zinc-900 hover:text-white border border-[#e2dacd] text-zinc-800 font-mono text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs"
              >
                Explore Discover ➔
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
