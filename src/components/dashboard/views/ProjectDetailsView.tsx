"use client";

import React, { useState } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";

interface ProjectDetailsViewProps {
  project: ProjectItem;
  user: UserProfile;
  onBack: () => void;
  onNavigateToProfile: () => void;
}

export function ProjectDetailsView({
  project,
  user,
  onBack,
  onNavigateToProfile,
}: ProjectDetailsViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [starsCount, setStarsCount] = useState(typeof project.stars === "number" ? project.stars : 0);
  const [isStarred, setIsStarred] = useState(false);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleShare = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href);
      }
    } catch (err) {
      console.warn("Clipboard access failed", err);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleToggleStar = async () => {
    const nextStarred = !isStarred;
    setIsStarred(nextStarred);
    setStarsCount((prev) => (nextStarred ? prev + 1 : Math.max(0, prev - 1)));

    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          username: user.username,
        }),
      });
    } catch (e) {
      console.error("Failed to update project star in PostgreSQL", e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* BREADCRUMB & BACK NAVIGATION */}
      <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
        <button
          onClick={onBack}
          className="hover:text-zinc-900 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
        >
          <span>‹ Back to Projects</span>
        </button>

        <span>Case Study ID: {project.id}</span>
      </div>

      {/* HERO SECTION */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                {project.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono border ${
                project.status === "Shipped"
                  ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                  : "bg-[#f4efe6] text-zinc-800 border-[#e2dacd]"
              }`}>
                ● {project.status}
              </span>
            </div>

            <p className="text-sm font-mono text-zinc-700">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-zinc-500 pt-1">
              <span>Created by <strong className="text-zinc-900 font-bold">{user.name}</strong></span>
              <span>•</span>
              <span>{user.university}</span>
              <span>•</span>
              <span>Updated {project.updatedAt}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start font-mono text-xs shrink-0">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>GitHub Repository</span>
                <span>↗</span>
              </a>
            )}

            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] hover:bg-zinc-100 text-zinc-800 font-bold transition-all cursor-pointer"
            >
              {copiedLink ? "✓ Link Copied" : "Share Case Study"}
            </button>
          </div>
        </div>

        {/* STARS ONLY METRICS ROW */}
        <div className="flex items-center gap-3 font-mono text-xs pt-4 border-t border-zinc-100">
          <button
            onClick={handleToggleStar}
            className={`p-3 px-5 rounded-xl border flex items-center gap-2.5 transition-all cursor-pointer font-mono font-bold ${
              isStarred
                ? "bg-amber-100 border-amber-300 text-amber-900 shadow-xs"
                : "bg-[#f4efe6] border-[#e2dacd] text-zinc-800 hover:bg-zinc-200"
            }`}
          >
            <span>★ {starsCount} Stars</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW & DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-3">
            Project Overview & Case Study
          </h2>

          {/* SCREENSHOTS GALLERY AT THE TOP (ABOVE STATEMENTS) */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div className="space-y-3 pb-4 border-b border-zinc-100">
              <h3 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
                Project Screenshots ({project.screenshots.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.screenshots.map((imgSrc, idx) => (
                  <div key={idx} className="rounded-xl border border-[#e2dacd] overflow-hidden shadow-xs">
                    <img src={imgSrc} alt={`Screenshot ${idx + 1}`} className="w-full h-48 object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STATEMENTS (BELOW SCREENSHOTS) */}
          <div className="space-y-5 text-xs font-sans leading-relaxed">
            <div>
              <h3 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider mb-1">
                The Problem Statement
              </h3>
              <p className={project.problemSolved ? "text-zinc-700 font-medium" : "text-zinc-400 italic"}>
                {project.problemSolved || "No problem statement added for this project."}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider mb-1">
                What Inspired This Project?
              </h3>
              <p className={project.inspiration ? "text-zinc-700 font-medium" : "text-zinc-400 italic"}>
                {project.inspiration || "No inspiration story provided."}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider mb-1">
                Biggest Challenge Faced
              </h3>
              <p className={project.biggestChallenge ? "text-zinc-700 font-medium" : "text-zinc-400 italic"}>
                {project.biggestChallenge || "No specific challenges noted."}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* TECH STACK CARD */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-3">
              Technology Stack
            </h3>

            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {project.tech && project.tech.length > 0 ? (
                project.tech.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-800 font-medium"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-zinc-400 italic text-xs">No tech stack listed</span>
              )}
            </div>
          </div>

          {/* TEAM MEMBERS CARD IF TEAM PROJECT */}
          {project.teamType === "team" && project.teamMembers && project.teamMembers.length > 0 && (
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-3">
                Code Buddies ({project.teamMembers.length})
              </h3>
              <div className="space-y-2">
                {project.teamMembers.map((member, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] font-bold text-zinc-800">
                    @{member}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ABOUT THE CREATOR CARD */}
          <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-3">
              About the Creator
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase overflow-hidden">
                {user.avatar && (user.avatar.startsWith("data:") || user.avatar.startsWith("http") || user.avatar.startsWith("/")) ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="min-w-0">
                <div className="text-zinc-900 font-bold truncate text-sm">{user.name}</div>
                <div className="text-xs font-mono text-zinc-500 truncate">@{user.username}</div>
                <div className="text-[11px] font-mono text-zinc-500 truncate">{user.university}</div>
              </div>
            </div>

            <button
              onClick={onNavigateToProfile}
              className="w-full py-2 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-mono font-bold transition-all cursor-pointer shadow-sm"
            >
              View Full Profile ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
