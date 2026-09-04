"use client";

import React, { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { UserProfile } from "@/types/dashboard";
import { NavTab } from "./Sidebar";
import { getBuilderTitle } from "@/lib/titles";

interface HeaderProps {
  user: UserProfile;
  projectsCount?: number;
  activeNav: NavTab;
  setActiveNav: (tab: NavTab) => void;
  selectedProjectName?: string | null;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onOpenNewProjectModal?: () => void;
}

export function Header({
  user,
  projectsCount = 0,
  activeNav,
  setActiveNav,
  selectedProjectName,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDropdownOpen]);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const titleInfo = getBuilderTitle(projectsCount);

  return (
    <header className="sticky top-0 z-40 bg-[#f8f5ee]/80 backdrop-blur-xs">
      <div className={`w-full mx-auto px-4 sm:px-8 py-3 flex items-center justify-end ${
        activeNav === "profile" ? "max-w-5xl" : ""
      }`}>
        {/* Right: Only the Avatar with Interactive Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0 uppercase overflow-hidden ring-2 ring-transparent hover:ring-zinc-400 focus:outline-none focus:ring-zinc-900 transition-all cursor-pointer shadow-2xs group"
            title={`${user.name} (@${user.username})`}
            aria-expanded={isDropdownOpen}
          >
            {user.avatar && (user.avatar.startsWith("data:") || user.avatar.startsWith("http") || user.avatar.startsWith("/")) ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            ) : (
              getInitials(user.name)
            )}
          </button>

          {/* Floating User Options Dropdown */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2.5 w-64 sm:w-72 rounded-2xl bg-white border border-[#e8e2d8] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-1 font-mono text-xs">
              {/* User Identity Header */}
              <div className="p-3 border-b border-zinc-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase overflow-hidden">
                  {user.avatar && (user.avatar.startsWith("data:") || user.avatar.startsWith("http") || user.avatar.startsWith("/")) ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-zinc-900 truncate">{user.name}</div>
                  <div className="text-[10px] font-mono text-zinc-500 truncate">@{user.username}</div>
                  <div className="mt-1">
                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${titleInfo.badgeClass}`}>
                      {titleInfo.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dropdown Menu Actions */}
              <div className="pt-1 space-y-0.5">
                {/* Dashboard: only visible when viewing profile */}
                {activeNav === "profile" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("dashboard");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left font-mono text-xs transition-colors cursor-pointer bg-[#f4efe6] hover:bg-[#e8e2d8] text-zinc-900 font-bold"
                  >
                    <svg className="w-4 h-4 text-zinc-800 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="3" y="3" width="7" height="7" strokeWidth="1.5" rx="1" />
                      <rect x="14" y="3" width="7" height="7" strokeWidth="1.5" rx="1" />
                      <rect x="14" y="14" width="7" height="7" strokeWidth="1.5" rx="1" />
                      <rect x="3" y="14" width="7" height="7" strokeWidth="1.5" rx="1" />
                    </svg>
                    <span>Dashboard</span>
                  </button>
                )}

                {/* Profile: only visible when not viewing profile */}
                {activeNav !== "profile" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveNav("profile");
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer text-zinc-700 hover:bg-[#faf6f0] hover:text-zinc-900"
                  >
                    <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </button>
                )}

                {/* Settings */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav("settings");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    activeNav === "settings"
                      ? "bg-[#f4efe6] text-zinc-900 font-bold"
                      : "text-zinc-700 hover:bg-[#faf6f0] hover:text-zinc-900"
                  }`}
                >
                  <svg className="w-4 h-4 text-zinc-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
              </div>

              <div className="my-1 border-t border-zinc-100" />

              {/* Sign Out */}
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors cursor-pointer font-bold"
              >
                <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
    );
  }
