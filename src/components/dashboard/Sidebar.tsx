"use client";

import React from "react";
import Link from "next/link";
import { UserProfile } from "@/types/dashboard";
import { getBuilderTitle } from "@/lib/titles";

export type NavTab = "dashboard" | "discover" | "projects" | "friends" | "community" | "profile" | "settings";

interface SidebarProps {
  activeNav: NavTab;
  setActiveNav: (tab: NavTab) => void;
  user: UserProfile;
  projectsCount: number;
}

export function Sidebar({ activeNav, setActiveNav, user, projectsCount }: SidebarProps) {
  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const Icons = {
    dashboard: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" strokeWidth="1.5" rx="1" />
        <rect x="14" y="3" width="7" height="7" strokeWidth="1.5" rx="1" />
        <rect x="14" y="14" width="7" height="7" strokeWidth="1.5" rx="1" />
        <rect x="3" y="14" width="7" height="7" strokeWidth="1.5" rx="1" />
      </svg>
    ),
    discover: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    projects: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    friends: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    community: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    profile: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    settings: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  interface NavItem {
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "discover", label: "Discover", icon: Icons.discover },
    { id: "projects", label: "Projects", icon: Icons.projects, badge: projectsCount },
    { id: "friends", label: "Friends", icon: Icons.friends },
    { id: "community", label: "Community", icon: Icons.community },
    { id: "profile", label: "Profile", icon: Icons.profile },
  ];

  return (
    <>
      <aside className="w-60 bg-[#faf6f0] border-r border-[#e8e2d8] flex flex-col justify-between hidden md:flex sticky top-0 h-screen select-none z-30 shrink-0">
        <div className="p-5 space-y-6">
          {/* Brand Header */}
          <Link href="/dashboard" onClick={() => setActiveNav("dashboard")} className="flex items-center gap-2.5 px-2 group">
            <img src="/SSblacky.png" alt="SkillSphere Logo" className="h-6 w-auto object-contain shrink-0" />
            <span className="text-sm font-bold text-zinc-900 tracking-tight">SkillSphere</span>
          </Link>

          {/* Navigation Item List (Without Settings) */}
          <nav className="space-y-1 font-mono text-xs">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-medium text-left cursor-pointer ${
                  activeNav === item.id
                    ? "bg-zinc-900 text-white font-extrabold shadow-xs"
                    : "text-zinc-700 hover:text-zinc-900 hover:bg-[#f4efe6]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                      activeNav === item.id ? "bg-white text-zinc-900" : "bg-[#f4efe6] text-zinc-800 border border-[#e2dacd]"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom Profile Snippet */}
        <div className="p-4 border-t border-[#e8e2d8] bg-white/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase overflow-hidden">
                {user.avatar && (user.avatar.startsWith("data:") || user.avatar.startsWith("http") || user.avatar.startsWith("/")) ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 truncate">{user.name}</div>
                <div className="text-[10px] font-mono text-zinc-500 truncate flex items-center gap-1">
                  <span>@{user.username}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getBuilderTitle(projectsCount).badgeClass}`}>
                    {getBuilderTitle(projectsCount).title}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveNav("settings")}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition-colors cursor-pointer shrink-0"
              title="Settings"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (FLUID RESPONSIVE) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#faf6f0]/95 backdrop-blur-md border-t border-[#e8e2d8] px-2 py-1.5 flex items-center justify-around font-mono text-[10px] shadow-lg overflow-x-auto">
        {[...navItems, { id: "settings", label: "Settings", icon: Icons.settings }].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id as NavTab)}
            className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all shrink-0 ${
              activeNav === item.id ? "text-zinc-900 font-extrabold" : "text-zinc-500 hover:text-zinc-900"
            }`}
          >
            <span className="text-sm">{item.icon}</span>
            <span className="capitalize text-[9px]">{item.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
