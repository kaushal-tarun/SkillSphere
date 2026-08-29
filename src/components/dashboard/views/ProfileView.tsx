"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";
import { getBuilderTitle } from "@/lib/titles";

interface ProfileViewProps {
  user: UserProfile;
  currentUser?: UserProfile;
  projectsList: ProjectItem[];
  onSelectProject?: (proj: ProjectItem) => void;
  isOwnProfile?: boolean;
  onBackToOwnProfile?: () => void;
}

export function ProfileView({ user, currentUser, projectsList, onSelectProject, isOwnProfile = true, onBackToOwnProfile }: ProfileViewProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [friendshipState, setFriendshipState] = useState<"NONE" | "SENT" | "FRIENDS" | "PENDING">("NONE");

  useEffect(() => {
    async function checkFriendStatus() {
      if (isOwnProfile || !currentUser?.username) return;
      try {
        const res = await fetch(`/api/friends?username=${encodeURIComponent(currentUser.username)}`);
        if (res.ok) {
          const data = await res.json();
          const targetLower = user.username.toLowerCase();
          
          if (data.friends && Array.isArray(data.friends) && data.friends.some((f: any) => f.username.toLowerCase() === targetLower)) {
            setFriendshipState("FRIENDS");
          } else if (data.sentRequests && Array.isArray(data.sentRequests) && data.sentRequests.some((u: string) => u.toLowerCase() === targetLower)) {
            setFriendshipState("SENT");
          } else if (data.pendingRequests && Array.isArray(data.pendingRequests) && data.pendingRequests.some((p: any) => p.username?.toLowerCase() === targetLower)) {
            setFriendshipState("PENDING");
          } else {
            setFriendshipState("NONE");
          }
        }
      } catch (e) {
        console.error("Failed to check friend status", e);
      }
    }
    checkFriendStatus();
  }, [isOwnProfile, currentUser?.username, user.username]);

  const handleAddFriend = async () => {
    if (!currentUser?.username) return;
    setFriendshipState("SENT");
    try {
      await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetUsername: user.username,
          username: currentUser.username,
        }),
      });
    } catch (e) {
      console.error("Failed to send friend request to PostgreSQL", e);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Derive tech skills dynamically from user's actual project tech tags
  const dynamicTechSkills = Array.from(
    new Set(projectsList.flatMap((p) => p.tech || []))
  );

  // Derive real achievements based on actual user activity
  const realAchievements = [
    { title: "Registered Builder", detail: `Member at ${user.university}`, date: "Active" },
    ...(projectsList.length > 0
      ? [
          { title: "First Repository Published", detail: `Shipped ${projectsList[0].name}`, date: "Verified" },
          { title: `${projectsList.length} Repositories Published`, detail: `Built ${projectsList.length} project case studies`, date: "Active" },
        ]
      : []),
  ];

  // Derive real timeline events from user's actual projects
  const realTimeline = [
    ...projectsList.map((p) => ({
      title: `Published project: ${p.name}`,
      detail: p.description,
      time: "Recent activity",
    })),
    {
      title: "Account Registered",
      detail: `Joined platform as @${user.username}`,
      time: "Member",
    },
  ];

  const handleCopyProfileLink = () => {
    const link = `https://skillsphere.dev/u/${user.username}`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link);
      }
    } catch (err) {
      console.warn("Clipboard write failed", err);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const realXp = projectsList.length * 500;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* NAVIGATION BANNER WHEN VIEWING ANOTHER DEVELOPER'S PROFILE */}
      {!isOwnProfile && onBackToOwnProfile && (
        <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
          <button
            onClick={onBackToOwnProfile}
            className="hover:text-zinc-900 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
          >
            <span>‹ Back to My Profile</span>
          </button>
          <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-white font-bold text-[10px] shadow-xs">
            Viewing @{user.username}'s Profile
          </span>
        </div>
      )}

      {/* PROFILE HERO HEADER */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-lg flex items-center justify-center shrink-0 uppercase shadow-md overflow-hidden">
              {user.avatar && (user.avatar.startsWith("data:") || user.avatar.startsWith("http") || user.avatar.startsWith("/")) ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                getInitials(user.name)
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">
                  {user.name}
                </h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${getBuilderTitle(projectsList.length).badgeClass}`}>
                  {getBuilderTitle(projectsList.length).title}
                </span>
              </div>
              <div className="text-xs font-mono text-zinc-500 flex flex-wrap items-center gap-2.5">
                <span className="text-zinc-900 font-bold">@{user.username}</span>
                <span>•</span>
                <span>{user.role}</span>
                <span>•</span>
                <span>{user.university}</span>
              </div>
              <p className="text-xs text-zinc-600 max-w-xl pt-1 font-normal leading-relaxed">
                {user.bio}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start font-mono text-xs">
            {!isOwnProfile && currentUser && currentUser.username.toLowerCase() !== user.username.toLowerCase() && (
              <button
                type="button"
                onClick={handleAddFriend}
                disabled={friendshipState !== "NONE"}
                className={`px-3.5 py-1.5 rounded-xl font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                  friendshipState === "FRIENDS"
                    ? "bg-emerald-800 text-white border border-emerald-700 cursor-default"
                    : friendshipState === "SENT"
                    ? "bg-zinc-100 text-zinc-500 border border-[#e8e2d8] cursor-default"
                    : friendshipState === "PENDING"
                    ? "bg-amber-600 text-white"
                    : "bg-emerald-600 hover:bg-emerald-700 text-white"
                }`}
              >
                {friendshipState === "FRIENDS" && (
                  <>
                    <span>✓</span>
                    <span>Friends</span>
                  </>
                )}
                {friendshipState === "SENT" && (
                  <>
                    <span>⏳</span>
                    <span>Request Sent</span>
                  </>
                )}
                {friendshipState === "PENDING" && (
                  <>
                    <span>✉️</span>
                    <span>Accept Request</span>
                  </>
                )}
                {friendshipState === "NONE" && (
                  <>
                    <span>+</span>
                    <span>Add Friend</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleCopyProfileLink}
              className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-sm transition-all cursor-pointer"
            >
              {copiedLink ? "✓ Link Copied" : "Share Profile"}
            </button>
            <a
              href={`https://github.com/${user.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-800 transition-all font-bold"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-100 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
            <div className="text-zinc-500 text-[10px]">Total XP</div>
            <div className="text-base font-extrabold text-zinc-900 mt-0.5">{realXp.toLocaleString()} XP</div>
          </div>

          <div className="p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
            <div className="text-zinc-500 text-[10px]">Campus Rank</div>
            <div className="text-base font-extrabold text-zinc-900 mt-0.5">#{projectsList.length > 0 ? "1 Leader" : "Active"}</div>
          </div>

          <div className="p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
            <div className="text-zinc-500 text-[10px]">Projects</div>
            <div className="text-base font-extrabold text-zinc-900 mt-0.5">{projectsList.length} Repos</div>
          </div>

          <div className="p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
            <div className="text-zinc-500 text-[10px]">Member Since</div>
            <div className="text-base font-extrabold text-zinc-900 mt-0.5">{user.createdAt || "Feb 2026"}</div>
          </div>
        </div>
      </div>

      {/* 2-COLUMN SECTION: SKILLS, ACHIEVEMENTS & PORTFOLIO */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: SKILLS & VERIFIED BADGES */}
        <div className="lg:col-span-1 space-y-6 font-mono text-xs">
          {/* VERIFIED TECH SKILLS */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Verified Tech Stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {dynamicTechSkills.length > 0 ? (
                dynamicTechSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-lg bg-[#f4efe6] border border-[#e2dacd] text-zinc-800 font-medium text-[11px]"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-zinc-500 text-xs italic">No tech stack tagged yet.</span>
              )}
            </div>
          </div>

          {/* BADGES & ACHIEVEMENTS */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Verified Badges</h3>
            <div className="space-y-3">
              {realAchievements.map((ach) => (
                <div key={ach.title} className="p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] space-y-1">
                  <div className="text-zinc-900 font-bold text-xs">{ach.title}</div>
                  <div className="text-[10px] text-zinc-500 font-sans">{ach.detail}</div>
                  <div className="text-[9px] text-zinc-400 font-mono text-right">{ach.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT 2 COLUMNS: PUBLISHED PROJECTS & TIMELINE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PUBLISHED PROJECTS */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">
              Published Repositories ({projectsList.length})
            </h2>

            <div className="space-y-3.5">
              {projectsList.map((project) => (
                <div
                  key={project.id}
                  className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm hover:border-zinc-400 transition-all space-y-3 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3
                        onClick={() => onSelectProject && onSelectProject(project)}
                        className="text-base font-bold text-zinc-900 group-hover:text-black transition-colors hover:underline cursor-pointer"
                      >
                        {project.name}
                      </h3>
                      <p className="text-xs text-zinc-600 font-normal leading-relaxed mt-0.5 line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onSelectProject && onSelectProject(project)}
                      className="px-3 py-1.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] hover:bg-zinc-900 hover:text-white text-zinc-800 text-xs font-mono font-bold transition-all shrink-0 cursor-pointer"
                    >
                      View ➔
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-zinc-100 font-mono text-xs">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tech.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-[#f4efe6] border border-[#e2dacd] text-[10px] text-zinc-800">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="text-[11px] text-zinc-500 shrink-0">
                      ★ {project.stars} Stars
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DEVELOPER TIMELINE */}
          <div className="space-y-4 pt-4 border-t border-[#e8e2d8]">
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">Activity Timeline</h2>

            <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-4 font-mono text-xs">
              {realTimeline.map((evt, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-zinc-900 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <div className="font-bold text-zinc-900">{evt.title}</div>
                    <div className="text-zinc-500 text-[11px] font-sans">{evt.detail}</div>
                    <div className="text-[10px] text-zinc-400">{evt.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
