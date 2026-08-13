"use client";

import React, { useState } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";

interface ProfileViewProps {
  user: UserProfile;
  projectsList: ProjectItem[];
  onSelectProject?: (proj: ProjectItem) => void;
}

export function ProfileView({ user, projectsList, onSelectProject }: ProfileViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userSkills = [
    "Next.js 16", "TypeScript", "Python", "FastAPI", "PostgreSQL", 
    "Prisma", "Rust", "Docker", "Vector DB", "RAG Architecture", "TailwindCSS", "Git"
  ];

  const userAchievements = [
    { title: "First Project Published", detail: "Shipped SkillSphere v1.0 to production", date: "Jan 2026" },
    { title: "10,000+ XP Milestone", detail: "Earned 14,250 Skill Points in Season 4", date: "Feb 2026" },
    { title: "Top #1 Campus Leader", detail: "Ranked #1 developer at " + user.university, date: "Feb 2026" },
    { title: "ETHIndia Hackathon Finalist", detail: "Built real-time WebSockets telemetry engine", date: "Dec 2025" },
  ];

  const timelineEvents = [
    { title: "Published SkillSphere Platform Engine v1.0", detail: "Verified repository & deployed core platform", time: "2 hours ago" },
    { title: "Completed KnowledgeVault AI Indexing Engine", detail: "Integrated vector search pipeline", time: "Yesterday" },
    { title: "Reached 14,250 Skill Points Milestone", detail: "Crossed top 1% developer threshold", time: "3 days ago" },
    { title: "Joined SkillSphere Developer Arena", detail: "Verified developer account at " + user.university, time: "Jan 2026" },
  ];

  const handleCopyProfileLink = () => {
    const link = `https://skillsphere.dev/u/${user.username}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* PROFILE HERO HEADER */}
      <div className="p-6 sm:p-7 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            {/* Avatar Initials Badge */}
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-lg flex items-center justify-center shrink-0 uppercase shadow-md">
              {getInitials(user.name)}
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                {user.name}
              </h1>
              <div className="text-xs font-mono text-zinc-400 flex flex-wrap items-center gap-2.5">
                <span className="text-white font-bold">@{user.username}</span>
                <span>•</span>
                <span>{user.role}</span>
                <span>•</span>
                <span>{user.university}</span>
              </div>
              <p className="text-xs text-zinc-400 max-w-xl pt-1 font-normal leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>

          {/* Profile Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start font-mono text-xs">
            <button
              onClick={handleCopyProfileLink}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold shadow-sm transition-all cursor-pointer"
            >
              {copiedLink ? "✓ Link Copied" : "Share Profile"}
            </button>
            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition-all"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        {/* Shareable Public Portfolio Link Box */}
        <div className="p-3 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between font-mono text-xs text-zinc-400">
          <div className="flex items-center gap-2 truncate">
            <span className="text-zinc-500">Public Portfolio:</span>
            <span className="text-white font-semibold truncate">skillsphere.dev/u/{user.username}</span>
          </div>
          <button
            onClick={handleCopyProfileLink}
            className="text-xs text-zinc-400 hover:text-white shrink-0 ml-2 cursor-pointer"
          >
            Copy
          </button>
        </div>
      </div>

      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 font-mono">
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
          <div className="text-[11px] text-zinc-400">Projects Built</div>
          <div className="text-xl font-extrabold text-white">{projectsList.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
          <div className="text-[11px] text-zinc-400">Skill Points</div>
          <div className="text-xl font-extrabold text-white">14,250 XP</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
          <div className="text-[11px] text-zinc-400">Leaderboard Rank</div>
          <div className="text-xl font-extrabold text-white">#1 Campus</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5">
          <div className="text-[11px] text-zinc-400">Achievements</div>
          <div className="text-xl font-extrabold text-white">18 Badges</div>
        </div>
        <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-0.5 col-span-2 lg:col-span-1">
          <div className="text-[11px] text-zinc-400">Current Streak</div>
          <div className="text-xl font-extrabold text-white">14 Days</div>
        </div>
      </div>

      {/* ABOUT & SKILLS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight border-b border-zinc-900/90 pb-3">
            About & Career Goals
          </h3>

          <div className="space-y-3 text-xs font-sans text-zinc-300 leading-relaxed">
            <p>
              Student software developer specializing in modern full-stack web applications, vector databases, and real-time backend infrastructure. Passionate about building developer tools that scale.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
              <div className="p-3 rounded-xl bg-black border border-zinc-800/80 space-y-1">
                <div className="text-zinc-500 text-[10px]">Interests</div>
                <div className="text-white font-semibold">Distributed Systems, RAG Pipelines, Developer Tools</div>
              </div>
              <div className="p-3 rounded-xl bg-black border border-zinc-800/80 space-y-1">
                <div className="text-zinc-500 text-[10px]">Career Goal</div>
                <div className="text-white font-semibold">Building venture-backed developer infrastructure</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight border-b border-zinc-900/90 pb-3">
            Tech Stack & Skills
          </h3>

          <div className="flex flex-wrap gap-1.5 font-mono text-xs">
            {userSkills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-black border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PROJECTS SHOWCASE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900/90 pb-3">
          <h2 className="text-base font-bold text-white tracking-tight">Projects Showcase</h2>
          <span className="text-xs font-mono text-zinc-400">{projectsList.length} Repositories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectsList.map((project) => (
            <div
              key={project.id}
              className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3.5 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-white">{project.name}</h3>
                    <span className="text-[10px] font-mono text-zinc-500">Updated {project.updatedAt}</span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                    project.status === "Shipped"
                      ? "bg-white text-black border-white font-bold"
                      : "bg-black text-zinc-400 border-zinc-800"
                  }`}>
                    ● {project.status}
                  </span>
                </div>

                <p className="text-xs text-zinc-400 font-normal leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                  {project.tech.map((t, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-900/90 font-mono text-xs">
                <button
                  onClick={() => onSelectProject && onSelectProject(project)}
                  className="px-3 py-1 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 text-xs transition-all cursor-pointer"
                >
                  View Case Study ➔
                </button>
                <span className="text-[11px] text-zinc-500">★ {project.stars} Stars</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACHIEVEMENTS & TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight border-b border-zinc-900/90 pb-3">
            Verified Achievements
          </h3>

          <div className="space-y-2.5 font-mono text-xs">
            {userAchievements.map((ach, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <div className="text-white font-bold">{ach.title}</div>
                  <div className="text-[10px] text-zinc-500">{ach.detail}</div>
                </div>
                <span className="text-[10px] text-zinc-400 shrink-0">{ach.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <h3 className="text-sm font-bold text-white tracking-tight border-b border-zinc-900/90 pb-3">
            Activity Timeline
          </h3>

          <div className="space-y-3 font-mono text-xs">
            {timelineEvents.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 border-l border-zinc-800 pl-3 py-1 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-white absolute -left-[4px] top-2" />
                <div className="space-y-0.5">
                  <div className="text-white font-bold">{item.title}</div>
                  <div className="text-zinc-400 text-[11px]">{item.detail}</div>
                  <div className="text-[10px] text-zinc-500">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
