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
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                {project.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono border ${
                project.status === "Shipped"
                  ? "bg-zinc-900 text-white border-zinc-900 font-bold"
                  : "bg-zinc-100 text-zinc-700 border-zinc-200"
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
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>GitHub Repository</span>
              <span>↗</span>
            </a>

            <button
              onClick={handleShare}
              className="px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-800 font-bold transition-all cursor-pointer"
            >
              {copiedLink ? "✓ Link Copied" : "Share Case Study"}
            </button>
          </div>
        </div>

        {/* STATS METRICS ROW */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 font-mono text-xs pt-4 border-t border-zinc-100">
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="text-[10px] text-zinc-500">Views</div>
            <div className="text-zinc-900 font-bold mt-0.5">{project.views.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="text-[10px] text-zinc-500">Likes</div>
            <div className="text-zinc-900 font-bold mt-0.5">{project.likes}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="text-[10px] text-zinc-500">Forks</div>
            <div className="text-zinc-900 font-bold mt-0.5">{project.forks}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="text-[10px] text-zinc-500">Commits</div>
            <div className="text-zinc-900 font-bold mt-0.5">{project.commits}</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="text-[10px] text-zinc-500">Days Active</div>
            <div className="text-zinc-900 font-bold mt-0.5">{project.daysActive} Days</div>
          </div>
          <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
            <div className="text-[10px] text-zinc-500">Completion</div>
            <div className="text-zinc-900 font-bold mt-0.5">{project.progress}%</div>
          </div>
        </div>
      </div>

      {/* PROJECT OVERVIEW & GOAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OVERVIEW CONTENT (2 Columns) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-3">
            Project Overview & Case Study
          </h2>

          <div className="space-y-4 text-xs font-sans text-zinc-700 leading-relaxed">
            <div>
              <h3 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider mb-1">
                The Problem Statement
              </h3>
              <p>
                Engineering students and university researchers often deal with hundreds of complex PDFs, research papers, and codebase repositories. Existing search engines only look at exact keyword matches, missing semantic context and deep conceptual linkages.
              </p>
            </div>

            <div>
              <h3 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider mb-1">
                The Solution
              </h3>
              <p>
                {project.name} indexes documents into a vector space with pgvector embeddings, enabling instant multi-document Q&A, automatic citation extraction, and natural language code exploration under 100ms.
              </p>
            </div>
          </div>

          {/* KEY FEATURES GRID */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-mono font-bold text-zinc-900 uppercase tracking-wider">
              Core Architecture Features
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="text-zinc-900 font-bold">● Document Indexing Engine</div>
                <div className="text-[11px] text-zinc-600">Parses PDF, Markdown, and source code into AST chunks.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="text-zinc-900 font-bold">● Vector Similarity RAG</div>
                <div className="text-[11px] text-zinc-600">Performs cosine similarity searches across pgvector embeddings.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="text-zinc-900 font-bold">● Source Citation Verifier</div>
                <div className="text-[11px] text-zinc-600">Attaches exact page and line number references to answers.</div>
              </div>
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                <div className="text-zinc-900 font-bold">● Multi-Tenant Auth</div>
                <div className="text-[11px] text-zinc-600">Secured via Prisma schema with JWT authorization.</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: TECH STACK & CREATOR SNAPSHOT */}
        <div className="lg:col-span-1 space-y-6">
          {/* TECH STACK TAGS */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-3">
              Technology Stack
            </h3>

            <div className="flex flex-wrap gap-1.5 font-mono text-xs">
              {project.tech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CREATOR PROFILE SNAPSHOT */}
          <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-3">
              About the Creator
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                {getInitials(user.name)}
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

      {/* CHALLENGES & LEARNINGS */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-3">
          Engineering Challenges & Learnings
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-sans text-zinc-700 leading-relaxed">
          <div className="space-y-2">
            <h3 className="font-mono font-bold text-zinc-900 text-xs">What challenges were faced?</h3>
            <p className="text-zinc-600">
              When indexing multi-gigabyte research papers, embedding lookup latency spiked above 600ms due to un-indexed vector columns and duplicate chunk embeddings.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-mono font-bold text-zinc-900 text-xs">How were they solved?</h3>
            <p className="text-zinc-600">
              Configured HNSW (Hierarchical Navigable Small World) indexing in PostgreSQL via pgvector and implemented an in-memory Redis cache for frequent query ASTs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
