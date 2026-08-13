"use client";

import React, { useState, useEffect } from "react";
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

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState<NavTab>("dashboard");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  // Dynamic Logged-In User Session State
  const [user, setUser] = useState<UserProfile>({
    name: "Advait Deshmukh",
    username: "advait_deshmukh",
    email: "advait@gmail.com",
    university: "IIT Bombay '26",
    role: "Full-Stack Engineer & AI Developer",
    location: "Mumbai, India",
    bio: "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
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
            role: parsed.role || "Full-Stack Engineer & AI Developer",
            location: parsed.location || "India",
            bio: parsed.bio || "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
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

  // Shared State
  const [searchQuery, setSearchQuery] = useState("");
  const [techFilter, setTechFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  const [leaderboardTab, setLeaderboardTab] = useState<"global" | "campus">("global");
  const [projectFilter, setProjectFilter] = useState<"all" | "active" | "shipped">("all");
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Projects State
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([
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
  ]);

  const handleCreateProject = (projectData: { name: string; description: string; tech: string; github: string }) => {
    const created: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: projectData.name,
      description: projectData.description || "Developer tool built for student software projects.",
      progress: 10,
      updatedAt: "Just now",
      visibility: "Public",
      stars: 1,
      forks: 0,
      commits: 1,
      daysActive: 1,
      views: 12,
      likes: 1,
      status: "Active",
      tech: projectData.tech ? projectData.tech.split(",").map((t) => t.trim()) : ["TypeScript", "Next.js"],
      github: projectData.github || "https://github.com",
    };

    setProjectsList((prev) => [created, ...prev]);
    setIsNewProjectModalOpen(false);
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

  return (
    <div className="min-h-screen bg-black text-white font-sans flex selection:bg-white selection:text-black">
      {/* 1. SIDEBAR */}
      <Sidebar
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        user={user}
        projectsCount={projectsList.length}
      />

      {/* 2. MAIN CONTENT WRAPPER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER BAR */}
        <Header
          activeNav={activeNav}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
        />

        {/* DYNAMIC VIEW ROUTER */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
          {selectedProject ? (
            <ProjectDetailsView
              project={selectedProject}
              user={user}
              onBack={() => setSelectedProject(null)}
              onNavigateToProfile={() => {
                setSelectedProject(null);
                setActiveNav("profile");
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
                  onSelectProject={(proj) => setSelectedProject(proj)}
                />
              )}

              {activeNav === "discover" && (
                <DiscoverView
                  user={user}
                  onSelectProject={(proj) => setSelectedProject(proj)}
                  onNavigateToProfile={() => setActiveNav("profile")}
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
                />
              )}

              {activeNav === "profile" && (
                <ProfileView user={user} projectsList={projectsList} onSelectProject={(proj) => setSelectedProject(proj)} />
              )}

              {activeNav === "friends" && (
                <FriendsView user={user} />
              )}

              {activeNav === "community" && (
                <CommunityView user={user} />
              )}

              {activeNav === "settings" && (
                <SettingsView user={user} setUser={setUser} />
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. NEW PROJECT MODAL */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  );
}
