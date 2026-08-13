"use client";

import React from "react";
import { UserProfile, ProjectItem, LeaderboardItem, ActivityItem } from "@/types/dashboard";

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
  onSelectProject?: (proj: ProjectItem) => void;
}

export function DashboardView({
  user,
  projectsList,
  projectFilter,
  setProjectFilter,
  leaderboardTop5,
  leaderboardTab,
  setLeaderboardTab,
  activityFeed,
  onNavigateToProfile,
  onSelectProject,
}: DashboardViewProps) {
  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* WELCOME BANNER (Clean & Breathable Header) */}
      <div className="border-b border-zinc-900/90 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs font-mono text-zinc-400">
            Build. Compete. Rise. • <span className="text-zinc-300">@{user.username}</span> • {user.university}
          </p>
        </div>

        <button
          onClick={onNavigateToProfile}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-xs font-mono text-zinc-300 transition-all self-start sm:self-auto cursor-pointer"
        >
          View Profile ➔
        </button>
      </div>

      {/* STATS ROW (4 Soft Minimalist Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5 hover:border-zinc-700 transition-all">
          <div className="text-xs font-mono text-zinc-400">Projects Built</div>
          <div className="text-2xl font-extrabold text-white tracking-tight">{projectsList.length}</div>
          <div className="text-[11px] font-mono text-zinc-500">
            <span className="text-white font-semibold">+2</span> this month
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5 hover:border-zinc-700 transition-all">
          <div className="text-xs font-mono text-zinc-400">Current Rank</div>
          <div className="text-2xl font-extrabold text-white tracking-tight">#1 Campus</div>
          <div className="text-[11px] font-mono text-zinc-500 truncate">
            {user.university}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5 hover:border-zinc-700 transition-all">
          <div className="text-xs font-mono text-zinc-400">Skill Points</div>
          <div className="text-2xl font-extrabold text-white tracking-tight">14,250 <span className="text-xs font-mono text-zinc-400 font-normal">XP</span></div>
          <div className="text-[11px] font-mono text-zinc-500">
            <span className="text-white font-semibold">+850 XP</span> this week
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-1.5 hover:border-zinc-700 transition-all">
          <div className="text-xs font-mono text-zinc-400">Achievements</div>
          <div className="text-2xl font-extrabold text-white tracking-tight">18 <span className="text-xs font-mono text-zinc-400 font-normal">Badges</span></div>
          <div className="text-[11px] font-mono text-zinc-500">
            Verified Proof-of-Work
          </div>
        </div>
      </div>

      {/* MAIN 2-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT 2 COLUMNS: CURRENT PROJECTS SECTION */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Current Projects</span>
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
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
                      ? "bg-white text-black font-bold"
                      : "text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-800"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {projectsList
              .filter((p) => projectFilter === "all" || p.status.toLowerCase() === projectFilter)
              .map((project) => (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          onClick={() => onSelectProject && onSelectProject(project)}
                          className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors hover:underline cursor-pointer truncate"
                        >
                          {project.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border shrink-0 ${
                          project.status === "Shipped"
                            ? "bg-white text-black border-white font-bold"
                            : "bg-black text-zinc-400 border-zinc-800"
                        }`}>
                          ● {project.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1 font-normal">
                        {project.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 text-xs font-mono transition-all shrink-0 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View</span>
                      <span>➔</span>
                    </button>
                  </div>

                  {/* Progress Bar & Tech Tags */}
                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-900/90 font-mono text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-[10px] text-zinc-400">
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
        </div>

        {/* RIGHT COLUMN: PROFILE SNAPSHOT & TOP 5 WIDGET */}
        <div className="lg:col-span-1 space-y-6">
          {/* PROFILE SNAPSHOT CARD */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white tracking-tight truncate">{user.name}</h3>
                <div className="text-xs font-mono text-zinc-400 truncate">@{user.username}</div>
                <div className="text-[10px] font-mono text-zinc-500 truncate">{user.university}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs pt-2 border-t border-zinc-900">
              <div className="p-2.5 rounded-xl bg-black border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500">Skill Points</div>
                <div className="text-white font-bold mt-0.5">14,250 XP</div>
              </div>
              <div className="p-2.5 rounded-xl bg-black border border-zinc-800/80">
                <div className="text-[10px] text-zinc-500">Current Streak</div>
                <div className="text-white font-bold mt-0.5">14 Days</div>
              </div>
            </div>
          </div>

          {/* LEADERBOARD TOP 5 PREVIEW */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white tracking-tight">Top Builders</h3>
              <div className="flex gap-1 font-mono text-[10px]">
                <button
                  onClick={() => setLeaderboardTab("global")}
                  className={`px-2 py-0.5 rounded ${leaderboardTab === "global" ? "bg-white text-black font-bold" : "text-zinc-400"}`}
                >
                  Global
                </button>
                <button
                  onClick={() => setLeaderboardTab("campus")}
                  className={`px-2 py-0.5 rounded ${leaderboardTab === "campus" ? "bg-white text-black font-bold" : "text-zinc-400"}`}
                >
                  Campus
                </button>
              </div>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {leaderboardTop5.map((usr) => (
                <div
                  key={usr.rank}
                  className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-zinc-800/60 hover:border-zinc-700 transition-all"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                      usr.rank === 1 ? "bg-white text-black font-extrabold" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }`}>
                      #{usr.rank}
                    </span>
                    <div className="min-w-0">
                      <div className="text-white font-bold truncate text-xs">{usr.name}</div>
                      <div className="text-[10px] text-zinc-500 truncate">@{usr.username}</div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-bold text-xs text-white">
                    {usr.points.toLocaleString()} XP
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
