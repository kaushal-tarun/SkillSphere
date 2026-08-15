"use client";

import React from "react";
import { NavTab } from "./Sidebar";

interface HeaderProps {
  activeNav: NavTab;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenNewProjectModal: () => void;
}

export function Header({
  activeNav,
  searchQuery,
  setSearchQuery,
  onOpenNewProjectModal,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-[#faf6f0]/90 border-b border-[#e8e2d8] backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left Breadcrumb Title */}
      <div className="flex items-center gap-2 font-mono text-xs">
        <span className="text-zinc-500 font-medium">SkillSphere</span>
        <span className="text-zinc-400 font-bold">/</span>
        <span className="text-zinc-900 font-bold capitalize">{activeNav}</span>
      </div>

      {/* Right Header Actions */}
      <div className="flex items-center gap-3">
        {/* Search Input Bar */}
        <div className="relative hidden sm:block w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, builders..."
            className="w-full px-3.5 py-1.5 rounded-xl bg-white border border-[#e8e2d8] text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans pl-8 pr-12 shadow-xs"
          />
          <svg className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-50 text-zinc-500 border border-[#e8e2d8]">
            ⌘K
          </span>
        </div>

        {/* Notification Button */}
        <button className="p-2 rounded-xl bg-white border border-[#e8e2d8] text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-colors cursor-pointer" title="Notifications">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>

        {/* New Project Action Button */}
        <button
          onClick={onOpenNewProjectModal}
          className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <span>+ New Project</span>
        </button>
      </div>
    </header>
  );
}
