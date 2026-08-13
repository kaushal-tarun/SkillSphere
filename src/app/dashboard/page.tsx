"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState<
    "dashboard" | "projects" | "showcase" | "leaderboard" | "community" | "profile" | "settings"
  >("dashboard");

  // Dynamic Logged-In User Session State
  const [user, setUser] = useState<{
    id?: string;
    name: string;
    username: string;
    email: string;
    university: string;
  }>({
    name: "Advait Deshmukh",
    username: "advait_deshmukh",
    email: "advait@gmail.com",
    university: "IIT Bombay '26",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.name) {
          setUser({
            id: parsed.id || "",
            name: parsed.name,
            username: parsed.username || parsed.name.toLowerCase().replace(/\s+/g, "_"),
            email: parsed.email || "user@skillsphere.dev",
            university: parsed.university || "University Student",
          });
        }
      } catch (e) {
        console.error("Failed to parse user session", e);
      }
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [leaderboardTab, setLeaderboardTab] = useState<"global" | "campus">("global");
  const [projectFilter, setProjectFilter] = useState<"all" | "active" | "shipped">("all");

  // New Project Modal State
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [projectsList, setProjectsList] = useState([
    {
      id: "proj-1",
      name: "SkillSphere Platform",
      description: "Developer network platform for student builders to showcase side projects, verify proof-of-work, and track rankings.",
      progress: 92,
      updatedAt: "2h ago",
      visibility: "Public",
      stars: 342,
      forks: 48,
      status: "Shipped",
      tech: ["Next.js 16", "TypeScript", "Prisma", "PostgreSQL"],
      github: "https://github.com/skillsphere/platform",
    },
    {
      id: "proj-2",
      name: "KnowledgeVault",
      description: "Document indexing and semantic search platform for university research papers, lecture notes, and codebase queries.",
      progress: 78,
      updatedAt: "1d ago",
      visibility: "Public",
      stars: 189,
      forks: 24,
      status: "Active",
      tech: ["Python", "FastAPI", "Vector DB", "React"],
      github: "https://github.com/advait/knowledge-vault",
    },
    {
      id: "proj-3",
      name: "Algorank Core",
      description: "Competitive coding platform evaluating algorithmic solutions with real-time WebSocket test execution.",
      progress: 65,
      updatedAt: "3d ago",
      visibility: "Public",
      stars: 512,
      forks: 89,
      status: "Active",
      tech: ["Rust", "WebSockets", "Docker", "Next.js"],
      github: "https://github.com/advait/algorank-core",
    },
  ]);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    tech: "",
    github: "",
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name) return;

    const created = {
      id: `proj-${Date.now()}`,
      name: newProject.name,
      description: newProject.description || "Developer tool for student software projects.",
      progress: 10,
      updatedAt: "Just now",
      visibility: "Public",
      stars: 1,
      forks: 0,
      status: "Active",
      tech: newProject.tech ? newProject.tech.split(",").map((t) => t.trim()) : ["TypeScript", "Next.js"],
      github: newProject.github || "https://github.com",
    };

    setProjectsList((prev) => [created, ...prev]);
    setNewProject({ name: "", description: "", tech: "", github: "" });
    setIsNewProjectModalOpen(false);
  };

  // Real Top 5 Leaderboard Data (Monochrome & Minimal)
  const leaderboardTop5 = [
    { rank: 1, name: user.name, username: user.username, campus: user.university, points: 14250, projects: projectsList.length, avatar: getInitials(user.name) },
    { rank: 2, name: "Tanvi Kulkarni", username: "tanvi_kulkarni", campus: "BITS Pilani '25", points: 12800, projects: 9, avatar: "TK" },
    { rank: 3, name: "Tushar Somani", username: "tushar_somani", campus: "IIIT Hyderabad '26", points: 11450, projects: 8, avatar: "TS" },
    { rank: 4, name: "Rudra Sengupta", username: "rudra_sengupta", campus: "NIT Trichy '26", points: 9820, projects: 7, avatar: "RS" },
    { rank: 5, name: "Ananya Vasisht", username: "ananya_vasisht", campus: "IISc Bangalore '25", points: 8900, projects: 6, avatar: "AV" },
  ];

  // Activity Timeline (Clean monochrome formatting)
  const activityFeed = [
    { id: 1, actor: user.name, action: "logged in to", target: "SkillSphere Platform", time: "Just now" },
    { id: 2, actor: "Rahul Verma", action: "reached", target: "500 Skill Points", time: "4 hours ago" },
    { id: 3, actor: "Ananya Vasisht", action: "published", target: "Distributed Systems Notes", time: "6 hours ago" },
    { id: 4, actor: "Tanvi Kulkarni", action: "updated", target: "Nexa Study Engine", time: "Yesterday" },
    { id: 5, actor: "Tushar Somani", action: "merged pull request in", target: "CodeCollab", time: "2 days ago" },
  ];

  // Simple Clean Monochrome SVG Icons
  const Icons = {
    dashboard: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" strokeWidth="1.5" rx="1" />
        <rect x="14" y="3" width="7" height="7" strokeWidth="1.5" rx="1" />
        <rect x="14" y="14" width="7" height="7" strokeWidth="1.5" rx="1" />
        <rect x="3" y="14" width="7" height="7" strokeWidth="1.5" rx="1" />
      </svg>
    ),
    projects: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    showcase: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    leaderboard: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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

  return (
    <div className="min-h-screen bg-black text-white font-sans flex selection:bg-white selection:text-black">
      
      {/* 1. LEFT SIDEBAR (Linear / GitHub / Vercel Monochromatic Style) */}
      <aside className="w-60 bg-black border-r border-zinc-800/90 flex flex-col justify-between hidden md:flex sticky top-0 h-screen select-none z-30 shrink-0">
        <div className="p-5 space-y-6">
          {/* Brand Header */}
          <Link href="/dashboard" onClick={() => setActiveNav("dashboard")} className="flex items-center gap-2.5 px-2 group">
            <img src="/SSwhitey.png" alt="SkillSphere Logo" className="h-6 w-auto object-contain transition-transform group-hover:scale-105" />
            <span className="text-sm font-bold text-white tracking-tight">SkillSphere</span>
          </Link>

          {/* Navigation Item List */}
          <nav className="space-y-1 font-mono text-xs">
            {[
              { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
              { id: "projects", label: "Projects", icon: Icons.projects, badge: projectsList.length },
              { id: "showcase", label: "Showcase", icon: Icons.showcase },
              { id: "leaderboard", label: "Leaderboard", icon: Icons.leaderboard },
              { id: "community", label: "Community", icon: Icons.community },
              { id: "profile", label: "Profile", icon: Icons.profile },
              { id: "settings", label: "Settings", icon: Icons.settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveNav(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all font-mono cursor-pointer ${
                  activeNav === item.id
                    ? "bg-white text-black font-extrabold"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                    activeNav === item.id ? "bg-black text-white font-bold" : "bg-zinc-900 text-zinc-500 border border-zinc-800"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom Profile Snippet (Dynamic Real User Info) */}
        <div className="p-4 border-t border-zinc-900 bg-black">
          <div className="flex items-center gap-3 p-2 rounded-xl border border-zinc-800/80 bg-zinc-950">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-200 font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1 font-mono">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[10px] text-zinc-500 truncate">{user.university}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* 2. TOP NAVIGATION HEADER */}
        <header className="sticky top-0 z-20 bg-black/90 border-b border-zinc-800/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
          {/* Left Breadcrumb Title */}
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-zinc-500">SkillSphere</span>
            <span className="text-zinc-700">/</span>
            <span className="text-white font-bold capitalize">{activeNav}</span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input Bar (⌘K Linear Style) */}
            <div className="relative hidden sm:block w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, builders, skills..."
                className="w-full px-3.5 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans pl-8 pr-12 transition-all"
              />
              <svg className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                ⌘K
              </span>
            </div>

            {/* Notification Button */}
            <button className="p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white transition-colors relative cursor-pointer" title="Notifications">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>

            {/* New Project Action Button */}
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs font-mono transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>+ New Project</span>
            </button>
          </div>
        </header>

        {/* 3. DASHBOARD MAIN CONTENT BODY */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
          
          {/* WELCOME SECTION (Dynamic Real Logged-In User Name & Handle) */}
          <div className="border-b border-zinc-900 pb-6 space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, {user.name}.
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm font-mono text-zinc-400">
              <span className="text-white font-bold">Build. Compete. Rise.</span>
              <span>•</span>
              <span className="text-zinc-300">@{user.username}</span>
              <span>•</span>
              <span>{user.university}</span>
            </div>
          </div>

          {/* STATS ROW (4 High-Contrast Clean Cards) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Projects Built */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2 hover:border-zinc-700 transition-all">
              <div className="text-xs font-mono text-zinc-400">Projects Built</div>
              <div className="text-3xl font-extrabold text-white tracking-tight">{projectsList.length}</div>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                <span className="text-white font-semibold">+2</span> this month
              </div>
            </div>

            {/* Card 2: Current Rank */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2 hover:border-zinc-700 transition-all">
              <div className="text-xs font-mono text-zinc-400">Current Rank</div>
              <div className="text-3xl font-extrabold text-white tracking-tight">#1 Campus</div>
              <div className="text-[11px] font-mono text-zinc-500">
                {user.university}
              </div>
            </div>

            {/* Card 3: Skill Points */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2 hover:border-zinc-700 transition-all">
              <div className="text-xs font-mono text-zinc-400">Skill Points</div>
              <div className="text-3xl font-extrabold text-white tracking-tight">14,250 <span className="text-xs font-mono text-zinc-400 font-normal">XP</span></div>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                <span className="text-white font-semibold">+850 XP</span> this week
              </div>
            </div>

            {/* Card 4: Achievements */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-2 hover:border-zinc-700 transition-all">
              <div className="text-xs font-mono text-zinc-400">Achievements</div>
              <div className="text-3xl font-extrabold text-white tracking-tight">18 <span className="text-xs font-mono text-zinc-400 font-normal">Badges</span></div>
              <div className="text-[11px] font-mono text-zinc-500">
                Verified Proof-of-Work
              </div>
            </div>
          </div>

          {/* MAIN 2-COLUMN SECTION: CURRENT PROJECTS vs LEADERBOARD + ACTIVITY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT 2 COLUMNS: CURRENT PROJECTS SECTION (GitHub / Vercel style repository cards) */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Current Projects</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400">
                    {projectsList.length}
                  </span>
                </h2>

                {/* Filter Pills */}
                <div className="flex gap-1.5 font-mono text-xs">
                  {(["all", "active", "shipped"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setProjectFilter(filter)}
                      className={`px-3 py-1 rounded-lg capitalize transition-all ${
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

              {/* Projects Repository Cards */}
              <div className="space-y-4">
                {projectsList
                  .filter((p) => projectFilter === "all" || p.status.toLowerCase() === projectFilter)
                  .map((project) => (
                    <div
                      key={project.id}
                      className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all space-y-4 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-base font-bold text-white group-hover:text-zinc-200 transition-colors">
                              {project.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400">
                              {project.visibility}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                              project.status === "Shipped"
                                ? "bg-white text-black border-white font-bold"
                                : "bg-black text-zinc-400 border-zinc-800"
                            }`}>
                              ● {project.status}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                            {project.description}
                          </p>
                        </div>

                        {/* View Project Action */}
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 text-xs font-mono transition-all shrink-0 flex items-center gap-1.5"
                        >
                          <span>View Project</span>
                          <span>➔</span>
                        </a>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2 pt-2 border-t border-zinc-900">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400">Completion</span>
                          <span className="text-white font-bold">{project.progress}%</span>
                        </div>

                        <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Tech Stack & Updated Time */}
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono pt-1">
                        <div className="flex flex-wrap gap-1.5">
                          {project.tech.map((t, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-[10px] text-zinc-400">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-4 text-zinc-500 text-[11px]">
                          <span>Stars: {project.stars}</span>
                          <span>Forks: {project.forks}</span>
                          <span>Updated {project.updatedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* RIGHT COLUMN: PROFILE SNAPSHOT + LEADERBOARD PREVIEW + ACTIVITY FEED */}
            <div className="lg:col-span-1 space-y-8">
              
              {/* PROFILE SNAPSHOT CARD (Dynamic Real User Credentials) */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                    {getInitials(user.name)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-bold text-white tracking-tight truncate">{user.name}</h3>
                    <div className="text-xs font-mono text-zinc-400 truncate">@{user.username}</div>
                    <div className="text-[11px] font-mono text-zinc-500 truncate">{user.university}</div>
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

                <div className="flex items-center justify-between text-xs font-mono pt-1 text-zinc-400">
                  <a href={`https://github.com/${user.username}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1 truncate">
                    <span className="truncate">github.com/{user.username}</span>
                    <span>↗</span>
                  </a>
                </div>
              </div>

              {/* LEADERBOARD PREVIEW (Top 5 Only) */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white tracking-tight">Leaderboard Top 5</h3>
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

                <div className="space-y-2.5 font-mono text-xs">
                  {leaderboardTop5.map((usr) => (
                    <div
                      key={usr.rank}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-black border border-zinc-800/80 hover:border-zinc-700 transition-all"
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

                      <div className="text-right shrink-0">
                        <div className="text-white font-bold text-xs">{usr.points.toLocaleString()} XP</div>
                        <div className="text-[9px] text-zinc-500">{usr.projects} Projects</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ACTIVITY FEED (Simple Linear Timeline Layout) */}
              <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-4">
                <h3 className="text-base font-bold text-white tracking-tight">Recent Activity</h3>

                <div className="space-y-3 font-mono text-xs">
                  {activityFeed.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 border-l border-zinc-800 pl-3 py-1 relative">
                      <div className="w-1.5 h-1.5 rounded-full bg-white absolute -left-[4px] top-2" />
                      <div className="space-y-0.5">
                        <div className="text-zinc-300">
                          <span className="text-white font-bold">{item.actor}</span> {item.action}{" "}
                          <span className="text-white font-semibold">{item.target}</span>.
                        </div>
                        <div className="text-[10px] text-zinc-500">{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

      {/* NEW PROJECT MODAL */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">Create New Project</h3>
                <p className="text-xs text-zinc-400 font-mono">Add a new repository to your SkillSphere showcase.</p>
              </div>
              <button
                onClick={() => setIsNewProjectModalOpen(false)}
                className="text-zinc-500 hover:text-white text-sm font-mono cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. SkillSphere"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Brief summary of what your project solves..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans resize-none"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">GitHub Repository Link</label>
                <input
                  type="url"
                  value={newProject.github}
                  onChange={(e) => setNewProject({ ...newProject, github: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Tech Stack Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newProject.tech}
                  onChange={(e) => setNewProject({ ...newProject, tech: e.target.value })}
                  placeholder="Next.js 16, TypeScript, PostgreSQL"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
