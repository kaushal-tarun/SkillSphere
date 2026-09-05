"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserProfile, ProjectItem, LeaderboardItem, ActivityItem } from "@/types/dashboard";
import { Sidebar, NavTab } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { NewProjectModal } from "@/components/dashboard/NewProjectModal";

// Modular Views
import { DashboardView } from "@/components/dashboard/views/DashboardView";
import { DiscoverView } from "@/components/dashboard/views/DiscoverView";
import { ProjectsView } from "@/components/dashboard/views/ProjectsView";
import { ProfileView } from "@/components/dashboard/views/ProfileView";
import { FriendsView } from "@/components/dashboard/views/FriendsView";
import { CommunityView } from "@/components/dashboard/views/CommunityView";
import { SettingsView } from "@/components/dashboard/views/SettingsView";
import { ProjectDetailsView } from "@/components/dashboard/views/ProjectDetailsView";
import {
  DashboardStartupSkeleton,
  ProfileViewSkeleton,
} from "@/components/dashboard/skeletons/DashboardSkeletons";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeNav, setActiveNav] = useState<NavTab>("dashboard");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isNavigatingProfile, setIsNavigatingProfile] = useState(false);

  // Dynamic Logged-In User Session State
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.name) {
            return {
              id: parsed.id || "",
              name: parsed.name,
              username: parsed.username || parsed.name.toLowerCase().replace(/\s+/g, "_"),
              email: parsed.email || "builder@skillsphere.dev",
              university: parsed.university || "University Student",
              role: parsed.role || "Full-Stack Engineer",
              location: parsed.location || "India",
              bio: parsed.bio || "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
              avatar: parsed.avatar || undefined,
              xp: parsed.xp || 0,
              level: parsed.level || 1,
              portfolioUrl: parsed.portfolioUrl || undefined,
              githubUrl: parsed.githubUrl || undefined,
              createdAt: parsed.createdAt || undefined,
            };
          }
        } catch (e) {
          console.error("Failed to parse cached user", e);
        }
      }
    }
    return {
      name: "Campus Builder",
      username: "builder",
      email: "builder@skillsphere.dev",
      university: "University Student",
      role: "Full-Stack Engineer & AI Developer",
      location: "India",
      bio: "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
      xp: 0,
      level: 1,
    };
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    async function loadUserProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            const liveUser: UserProfile = {
              id: data.profile.id,
              name: data.profile.name,
              username: data.profile.username,
              email: data.profile.email,
              university: data.profile.university || "University Student",
              role: data.profile.role || "Full-Stack Engineer & AI Developer",
              location: data.profile.location || "India",
              bio: data.profile.bio || "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
              avatar: data.profile.avatar || undefined,
              xp: data.profile.xp ?? 0,
              level: data.profile.level ?? 1,
              status: data.profile.status ?? null,
              portfolioUrl: data.profile.portfolioUrl || undefined,
              githubUrl: data.profile.githubUrl || undefined,
              createdAt: data.profile.createdAt || undefined,
            };
            setUser(liveUser);
            localStorage.setItem("user", JSON.stringify(liveUser));
          }
        } else if (session?.user) {
          setUser((prev) => {
            const fallback: UserProfile = {
              ...prev,
              name: session.user?.name || prev.name,
              email: session.user?.email || prev.email,
              username: (session.user as any).username || prev.username,
              university: (session.user as any).university || prev.university,
              createdAt: prev.createdAt,
            };
            localStorage.setItem("user", JSON.stringify(fallback));
            return fallback;
          });
        }
      } catch (e) {
        console.error("Failed to fetch profile from PostgreSQL", e);
      }
    }

    if (status === "authenticated") {
      loadUserProfile();
    }
  }, [status, session, router]);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Shared State
  const [searchQuery, setSearchQuery] = useState("");
  const [techFilter, setTechFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  const [leaderboardTab, setLeaderboardTab] = useState<"global" | "campus">("global");
  const [projectFilter, setProjectFilter] = useState<"all" | "active" | "shipped">("all");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  const SAMPLE_PROJECTS: ProjectItem[] = [
    {
      id: "proj-1",
      name: "SkillSphere Platform",
      description: "Developer network platform for student builders to showcase side projects, verify proof-of-work, and track rankings.",
      progress: 92,
      updatedAt: "2h ago",
      visibility: "Public",
      stars: 342,
      forks: 48,
      commits: 142,
      daysActive: 38,
      views: 1240,
      likes: 289,
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
      commits: 96,
      daysActive: 22,
      views: 890,
      likes: 164,
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
      commits: 210,
      daysActive: 45,
      views: 2450,
      likes: 412,
      status: "Active",
      tech: ["Rust", "WebSockets", "Docker", "Next.js"],
      github: "https://github.com/advait/algorank-core",
    },
  ];

  // Projects State - Connects to Neon PostgreSQL API
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);

  useEffect(() => {
    async function loadProjects() {
      if (!user.username) return;
      setIsLoadingProjects(true);
      try {
        const res = await fetch(`/api/projects?username=${encodeURIComponent(user.username)}&scope=user`);
        if (res.ok) {
          const data = await res.json();
          if (data.projects && Array.isArray(data.projects)) {
            setProjectsList(data.projects);
          }
        }
      } catch (e) {
        console.error("Failed to load projects from PostgreSQL", e);
      } finally {
        setIsLoadingProjects(false);
      }
    }
    loadProjects();
  }, [user.username]);

  const handleCreateProject = async (projectData: {
    name: string;
    description: string;
    tech: string;
    github: string;
    problemSolved?: string;
    inspiration?: string;
    biggestChallenge?: string;
    teamType?: "solo" | "team";
    teamMembers?: string[];
    screenshots?: string[];
  }) => {
    const techArray = projectData.tech ? projectData.tech.split(",").map((t) => t.trim()).filter(Boolean) : [];

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description,
          tech: techArray,
          githubUrl: projectData.github,
          problemSolved: projectData.problemSolved,
          inspiration: projectData.inspiration,
          biggestChallenge: projectData.biggestChallenge,
          teamType: projectData.teamType,
          teamMembers: projectData.teamMembers,
          screenshots: projectData.screenshots,
          username: user.username,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.project) {
          setProjectsList((prev) => [data.project, ...prev]);
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.error("Failed to save project to PostgreSQL:", errData.error);
        throw new Error(errData.error || "Failed to publish project. Please check input.");
      }
    } catch (e: any) {
      console.error("Failed to save project to PostgreSQL", e);
      throw e;
    }
  };

  const handleDeleteProject = async (id: string) => {
    setProjectsList((prev) => prev.filter((p) => p.id !== id));
    try {
      await fetch(`/api/projects?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to delete project in PostgreSQL", e);
    }
  };

  // Real Top 5 Leaderboard Data
  const leaderboardTop5: LeaderboardItem[] = [
    { rank: 1, name: user.name, username: user.username, campus: user.university, points: 14250, projects: projectsList.length, avatar: getInitials(user.name) },
    { rank: 2, name: "Tanvi Kulkarni", username: "tanvi_kulkarni", campus: "BITS Pilani '25", points: 12800, projects: 9, avatar: "TK" },
    { rank: 3, name: "Tushar Somani", username: "tushar_somani", campus: "IIIT Hyderabad '26", points: 11450, projects: 8, avatar: "TS" },
    { rank: 4, name: "Rudra Sengupta", username: "rudra_sengupta", campus: "NIT Trichy '26", points: 9820, projects: 7, avatar: "RS" },
    { rank: 5, name: "Ananya Vasisht", username: "ananya_vasisht", campus: "IISc Bangalore '25", points: 8900, projects: 6, avatar: "AV" },
  ];

  // Activity Timeline
  const activityFeed: ActivityItem[] = [
    { id: 1, actor: user.name, action: "logged in to", target: "SkillSphere Platform", time: "Just now" },
    { id: 2, actor: "Rahul Verma", action: "reached", target: "500 Skill Points", time: "4 hours ago" },
    { id: 3, actor: "Ananya Vasisht", action: "published", target: "Distributed Systems Notes", time: "6 hours ago" },
    { id: 4, actor: "Tanvi Kulkarni", action: "updated", target: "Nexa Study Engine", time: "Yesterday" },
    { id: 5, actor: "Tushar Somani", action: "merged pull request in", target: "CodeCollab", time: "2 days ago" },
  ];

  // Viewing another user's profile state
  const [viewingProfileUser, setViewingProfileUser] = useState<UserProfile | null>(null);
  const [viewingProfileProjects, setViewingProfileProjects] = useState<ProjectItem[]>([]);

  const handleNavigateToUser = async (targetUsername: string) => {
    const cleanUsername = targetUsername.replace(/^@/, "").toLowerCase().trim();
    if (cleanUsername === user.username.toLowerCase()) {
      setViewingProfileUser(null);
      setViewingProfileProjects([]);
      setSelectedProject(null);
      setActiveNav("profile");
      return;
    }

    setIsNavigatingProfile(true);
    setSelectedProject(null);
    setActiveNav("profile");

    try {
      const profRes = await fetch(`/api/profile?username=${encodeURIComponent(cleanUsername)}`);
      let fetchedUser: UserProfile | null = null;
      if (profRes.ok) {
        const profData = await profRes.json();
        if (profData.profile) {
          fetchedUser = profData.profile;
        }
      }

      if (!fetchedUser) {
        fetchedUser = {
          name: targetUsername.replace(/^@/, ""),
          username: cleanUsername,
          email: `${cleanUsername}@skillsphere.dev`,
          university: "University Student",
          role: "Full-Stack Engineer & AI Developer",
          bio: "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
        };
      }

      const projRes = await fetch(`/api/projects?username=${encodeURIComponent(cleanUsername)}&scope=user`);
      let fetchedProjects: ProjectItem[] = [];
      if (projRes.ok) {
        const projData = await projRes.json();
        if (projData.projects && Array.isArray(projData.projects)) {
          fetchedProjects = projData.projects;
        }
      }

      setViewingProfileUser(fetchedUser);
      setViewingProfileProjects(fetchedProjects);
    } catch (e) {
      console.error("Failed to load user profile", e);
      setViewingProfileUser(null);
    } finally {
      setIsNavigatingProfile(false);
    }
  };

  if (status === "loading") {
    return <DashboardStartupSkeleton />;
  }

  if (activeNav === "settings") {
    return (
      <div className="min-h-screen bg-[#f8f5ee] font-sans antialiased text-zinc-900 selection:bg-zinc-900 selection:text-white flex flex-col">
        {/* Dedicated Standalone Settings Top Navigation Bar */}
        <header className="sticky top-0 z-40 bg-[#f8f5ee]/80 backdrop-blur-md border-b border-[#e8e2d8] px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveNav("dashboard")}
              className="px-3.5 py-1.5 rounded-xl bg-[#f4efe6] hover:bg-[#e8e2d8] border border-[#e2dacd] text-zinc-800 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white font-mono text-xs font-bold flex items-center justify-center uppercase overflow-hidden shrink-0">
              {user.avatar && (user.avatar.startsWith("data:") || user.avatar.startsWith("http")) ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                user.avatar || user.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div className="hidden sm:block font-mono text-xs">
              <div className="font-bold text-zinc-900 leading-tight">{user.name}</div>
              <div className="text-[10px] text-zinc-500">@{user.username}</div>
            </div>
          </div>
        </header>

        {/* Dedicated Standalone Settings Content Area */}
        <main className="flex-1 w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
          <SettingsView user={user} setUser={setUser} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8f5ee] font-sans antialiased text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* 1. SIDEBAR NAVIGATION (Hidden when viewing profile) */}
      {activeNav !== "profile" && (
        <Sidebar
          activeNav={activeNav}
          setActiveNav={(tab) => {
            setSelectedProject(null);
            if (tab === "profile") {
              setViewingProfileUser(null);
              setViewingProfileProjects([]);
            }
            setActiveNav(tab);
          }}
          user={user}
          projectsCount={projectsList.length}
        />
      )}

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER BAR */}
        <Header
          user={user}
          projectsCount={projectsList.length}
          activeNav={activeNav}
          setActiveNav={(tab) => {
            setSelectedProject(null);
            if (tab === "profile" || tab === "dashboard") {
              setViewingProfileUser(null);
              setViewingProfileProjects([]);
            }
            setActiveNav(tab);
          }}
          selectedProjectName={selectedProject?.name}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        />

        {/* DYNAMIC VIEW ROUTER */}
        <main className={`flex-1 w-full mx-auto px-4 sm:px-8 py-8 space-y-8 ${activeNav === "profile" ? "max-w-none" : "max-w-5xl"}`}>
          {selectedProject ? (
            <ProjectDetailsView
              project={selectedProject}
              user={user}
              onBack={() => setSelectedProject(null)}
              onNavigateToProfile={() => {
                setSelectedProject(null);
                setViewingProfileUser(null);
                setActiveNav("profile");
              }}
              onNavigateToUser={(username) => {
                handleNavigateToUser(username);
              }}
            />
          ) : (
            <>
              {activeNav === "dashboard" && (
                <DashboardView
                  user={user}
                  projectsList={projectsList}
                  projectFilter={projectFilter}
                  setProjectFilter={setProjectFilter}
                  leaderboardTop5={leaderboardTop5}
                  leaderboardTab={leaderboardTab}
                  setLeaderboardTab={setLeaderboardTab}
                  activityFeed={activityFeed}
                  onNavigateToProfile={() => setActiveNav("profile")}
                  onNavigateToDiscover={() => setActiveNav("discover")}
                  onSelectProject={(proj) => setSelectedProject(proj)}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                  onLoadDemoProjects={() => setProjectsList(SAMPLE_PROJECTS)}
                  isLoadingProjects={isLoadingProjects}
                />
              )}

              {activeNav === "discover" && (
                <DiscoverView
                  user={user}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSelectProject={(proj) => setSelectedProject(proj)}
                  onNavigateToProfile={() => setActiveNav("profile")}
                  onNavigateToUser={(username) => handleNavigateToUser(username)}
                />
              )}

              {activeNav === "projects" && (
                <ProjectsView
                  user={user}
                  projectsList={projectsList}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  techFilter={techFilter}
                  setTechFilter={setTechFilter}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
                  onSelectProject={(proj) => setSelectedProject(proj)}
                  onDeleteProject={handleDeleteProject}
                  isLoadingProjects={isLoadingProjects}
                />
              )}

              {activeNav === "profile" && (
                isNavigatingProfile ? (
                  <ProfileViewSkeleton />
                ) : (
                  <ProfileView
                    user={viewingProfileUser || user}
                    currentUser={user}
                    projectsList={viewingProfileUser ? viewingProfileProjects : projectsList}
                    onSelectProject={(proj) => setSelectedProject(proj)}
                    isOwnProfile={!viewingProfileUser || viewingProfileUser.username.toLowerCase() === user.username.toLowerCase()}
                    onBackToOwnProfile={() => {
                      setViewingProfileUser(null);
                      setViewingProfileProjects([]);
                    }}
                    onNavigateToSettings={() => setActiveNav("settings")}
                  />
                )
              )}

              {activeNav === "friends" && (
                <FriendsView user={user} projectsCount={projectsList.length} searchQuery={searchQuery} setSearchQuery={setSearchQuery} onNavigateToUser={(username) => handleNavigateToUser(username)} />
              )}

              {activeNav === "community" && (
                <CommunityView user={user} onSelectProject={(proj) => setSelectedProject(proj)} onNavigateToUser={(username) => handleNavigateToUser(username)} />
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. NEW PROJECT MODAL */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        user={user}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
