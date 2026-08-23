"use client";

import React, { useState } from "react";
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
  onDeleteProject?: (id: string) => void;
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
  onDeleteProject,
}: ProjectsViewProps) {
  const [isTechOpen, setIsTechOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<ProjectItem | null>(null);

  const techOptions = [
    { value: "all", label: "All Tech Stack" },
    { value: "next", label: "Next.js" },
    { value: "python", label: "Python" },
    { value: "rust", label: "Rust" },
    { value: "typescript", label: "TypeScript" },
  ];

  const sortOptions = [
    { value: "updated", label: "Recently Updated" },
    { value: "stars", label: "Most Stars" },
    { value: "commits", label: "Most Commits" },
  ];

  const communityProjects: CommunityProject[] = [];

  const filteredProjects = projectsList.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTech = techFilter === "all" || p.tech.some((t) => t.toLowerCase().includes(techFilter.toLowerCase()));
    const matchesStatus = statusFilter === "all" || p.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesTech && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* FILTER BAR WITH + NEW PROJECT BUTTON */}
      <div className="p-3.5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full px-3.5 py-1.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans pl-8"
          />
          <svg className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* CUSTOM STYLED TECH STACK DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setIsTechOpen(!isTechOpen);
                setIsSortOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 font-mono text-xs font-bold focus:outline-none flex items-center gap-1.5 cursor-pointer shadow-xs hover:border-zinc-400 transition-all"
            >
              <span>{techOptions.find((t) => t.value === techFilter)?.label || "All Tech Stack"}</span>
              <span className={`text-[10px] transition-transform duration-200 ${isTechOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {isTechOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 p-1.5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xl z-40 font-mono text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {techOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTechFilter(opt.value);
                      setIsTechOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all font-medium flex items-center justify-between cursor-pointer ${
                      techFilter === opt.value
                        ? "bg-zinc-900 text-white font-bold shadow-xs"
                        : "text-zinc-800 hover:bg-[#f4efe6]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {techFilter === opt.value && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* CUSTOM STYLED SORT BY DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => {
                setIsSortOpen(!isSortOpen);
                setIsTechOpen(false);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 font-mono text-xs font-bold focus:outline-none flex items-center gap-1.5 cursor-pointer shadow-xs hover:border-zinc-400 transition-all"
            >
              <span>{sortOptions.find((s) => s.value === sortBy)?.label || "Recently Updated"}</span>
              <span className={`text-[10px] transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}>▾</span>
            </button>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-48 p-1.5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xl z-40 font-mono text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all font-medium flex items-center justify-between cursor-pointer ${
                      sortBy === opt.value
                        ? "bg-zinc-900 text-white font-bold shadow-xs"
                        : "text-zinc-800 hover:bg-[#f4efe6]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.value && <span className="text-[10px]">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onOpenNewProjectModal}
            className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono shadow-sm transition-all cursor-pointer"
          >
            + New Project
          </button>
        </div>
      </div>

      {/* 1. MY PROJECTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <span>My Projects</span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#e8e2d8] text-xs font-mono text-zinc-600">
              {filteredProjects.length}
            </span>
          </h2>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm hover:border-zinc-400 transition-all space-y-3.5 flex flex-col justify-between"
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
                        : "bg-[#f4efe6] text-zinc-800 border-[#e2dacd]"
                    }`}>
                      ● {project.status}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 font-normal leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2 border-t border-zinc-100 font-mono text-xs">
                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-[#f4efe6] border border-[#e2dacd] text-[10px] text-zinc-800 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                    <span>★ {project.stars} Stars</span>
                    <div className="flex items-center gap-3">
                      {onDeleteProject && (
                        <button
                          onClick={() => setProjectToDelete(project)}
                          className="text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer text-[10px]"
                        >
                          Delete
                        </button>
                      )}
                      <button
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="text-zinc-900 font-bold hover:underline cursor-pointer"
                      >
                        Details ➔
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm text-center space-y-4">
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">No projects listed yet</h3>
              <p className="text-xs text-zinc-600 font-sans leading-relaxed">
                {projectsList.length === 0
                  ? "Things look empty here. Start by building or showcasing your first project repository."
                  : "No projects match your current search or filter options."}
              </p>
            </div>
            {projectsList.length === 0 ? (
              <button
                onClick={onOpenNewProjectModal}
                className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white font-mono text-xs font-bold shadow-sm hover:bg-black transition-all cursor-pointer"
              >
                + Add Your First Project
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setTechFilter("all");
                  setStatusFilter("all");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white font-mono text-xs font-bold cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* 2. FEATURED PROJECT SECTION */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-5 relative overflow-hidden group">
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
                <span key={t} className="px-2 py-0.5 rounded bg-[#f4efe6] border border-[#e2dacd] text-zinc-800 font-medium">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1 flex flex-col justify-between bg-[#f4efe6] p-4 rounded-xl border border-[#e2dacd] space-y-3">
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

      {/* 3. COMMUNITY PROJECTS SECTION */}
      <div className="space-y-4 pt-4 border-t border-[#e8e2d8]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 tracking-tight">Community Discoveries</h2>
          <span className="text-xs font-mono text-zinc-500">Popular Student Repositories</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {communityProjects.map((comm) => (
            <div
              key={comm.id}
              className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm hover:border-zinc-400 transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900">{comm.name}</h3>
                    <div className="text-[10px] font-mono text-zinc-500">
                      by {comm.creatorName} • {comm.university}
                    </div>
                  </div>

                  <a
                    href={comm.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-[#f4efe6] border border-[#e2dacd] text-zinc-800 text-[10px] font-mono font-bold hover:bg-zinc-900 hover:text-white transition-all cursor-pointer"
                  >
                    GitHub ↗
                  </a>
                </div>

                <p className="text-xs text-zinc-600 line-clamp-2 font-normal">
                  {comm.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 font-mono text-[10px] pt-1">
                {comm.tech.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-[#f4efe6] border border-[#e2dacd] text-zinc-800 font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DELETE PROJECT CONFIRMATION WARNING MODAL */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white border border-[#e8e2d8] rounded-2xl p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-700 flex items-center justify-center font-bold text-lg shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-base font-bold text-zinc-900 tracking-tight">Delete Project?</h3>
                <p className="text-xs font-mono text-zinc-500">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 leading-relaxed font-sans">
              Are you sure you want to delete <strong className="font-bold text-red-950">"{projectToDelete.name}"</strong> from your portfolio? It will be removed from community showcase and standings.
            </div>

            <div className="flex items-center justify-end gap-2.5 font-mono text-xs pt-1">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#e8e2d8] hover:bg-zinc-100 text-zinc-700 font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteProject) {
                    onDeleteProject(projectToDelete.id);
                  }
                  setProjectToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-sm cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
