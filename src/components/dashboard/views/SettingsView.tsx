"use client";

import React, { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { UserProfile } from "@/types/dashboard";

interface SettingsViewProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onBackToDashboard?: () => void;
}

type SettingsSection = 
  | "profile" 
  | "account" 
  | "security" 
  | "notifications" 
  | "privacy" 
  | "appearance" 
  | "connected" 
  | "danger";

export function SettingsView({ user, setUser, onBackToDashboard }: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please select an image under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setProfileForm((prev) => ({ ...prev, avatar: event.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    username: user.username,
    university: user.university,
    role: user.role || "Full-Stack Engineer",
    location: user.location || "Mumbai, India",
    bio: user.bio || "Building web tools, distributed systems, and open-source applications.",
    avatar: user.avatar || "",
    portfolioUrl: "https://skillsphere.dev",
    githubUrl: `https://github.com/${user.username}`,
    linkedinUrl: `https://linkedin.com/in/${user.username}`,
  });

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: true,
  });

  // Notifications State
  const [notifState, setNotifState] = useState({
    emailStars: true,
    emailDMs: true,
    emailRank: true,
    emailWeeklyDigest: false,
    pushMentions: true,
    pushBattles: true,
    pushFriendRequests: true,
  });

  // Privacy State
  const [privacyState, setPrivacyState] = useState({
    profileVisibility: "public",
    showUniversity: true,
    showActivityFeed: true,
    allowSearchIndexing: true,
  });

  // Appearance State
  const [themeMode, setThemeMode] = useState<"warm" | "dark">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("skillsphere_theme");
      if (saved === "dark") return "dark";
      if (saved === "warm" || saved === "light") return "warm";
    }
    return "warm";
  });
  const [codeTheme, setCodeTheme] = useState<"github" | "monokai" | "onedark">("github");

  // Sync theme with DOM on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("skillsphere_theme");
      if (saved === "dark") {
        setThemeMode("dark");
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        setThemeMode("warm");
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "warm");
      }
    } catch {}
  }, []);

  const handleSelectTheme = (mode: "warm" | "dark") => {
    setThemeMode(mode);
    try {
      localStorage.setItem("skillsphere_theme", mode);
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-theme", "warm");
      }
    } catch {}
    triggerSuccessToast();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: profileForm.name,
      username: profileForm.username,
      university: profileForm.university,
      role: profileForm.role,
      location: profileForm.location,
      bio: profileForm.bio,
      avatar: profileForm.avatar,
    };

    setUser(updated);
    try {
      localStorage.setItem("user", JSON.stringify(updated));
      await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          name: profileForm.name,
          university: profileForm.university,
          role: profileForm.role,
          location: profileForm.location,
          bio: profileForm.bio,
          avatar: profileForm.avatar,
        }),
      });
    } catch (err) {
      console.error("Failed to update profile in PostgreSQL", err);
    }
    triggerSuccessToast();
  };

  const triggerSuccessToast = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const navIcons = {
    profile: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    account: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 8h10M7 12h6" />
      </svg>
    ),
    security: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 11V7a4 4 0 118 0v4" />
      </svg>
    ),
    notifications: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    privacy: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    appearance: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    connected: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    danger: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  };

  const navItems: { id: SettingsSection; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Profile", icon: navIcons.profile },
    { id: "account", label: "Account", icon: navIcons.account },
    { id: "security", label: "Security", icon: navIcons.security },
    { id: "notifications", label: "Notifications", icon: navIcons.notifications },
    { id: "privacy", label: "Privacy", icon: navIcons.privacy },
    { id: "appearance", label: "Appearance", icon: navIcons.appearance },
    { id: "connected", label: "Connected Accounts", icon: navIcons.connected },
    { id: "danger", label: "Danger Zone", icon: navIcons.danger },
  ];

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full font-sans relative">
      
      {/* Saved Success Toast */}
      {savedSuccess && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-zinc-900 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top duration-200 border border-zinc-700">
          <span>✓</span>
          <span>Settings saved successfully</span>
        </div>
      )}

      {/* 2-COLUMN GRID MATCHING PROFILE VIEW STRUCTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        
        {/* LEFT COLUMN: SUB-NAVIGATION UNDER DASHBOARD LINE */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm w-full space-y-1 font-mono text-xs sticky top-20">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                  activeSection === item.id
                    ? item.id === "danger"
                      ? "bg-rose-100 text-rose-800 border border-rose-200 font-bold"
                      : "bg-zinc-900 text-white font-extrabold shadow-sm"
                    : item.id === "danger"
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-zinc-700 hover:text-zinc-900 hover:bg-[#f4efe6]"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: SETTINGS CONTENT PANEL UNDER AVATAR LINE */}
        <div className="lg:col-span-8 xl:col-span-9 w-full min-w-0 space-y-6">
          
          {/* SECTION 1: PROFILE SETTINGS */}
          {activeSection === "profile" && (
            <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Profile Information</h2>
                <p className="text-zinc-500 text-[11px]">Update your public profile details and bio.</p>
              </div>

              {/* Profile Picture Upload Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-base flex items-center justify-center uppercase shrink-0 overflow-hidden shadow-sm">
                  {profileForm.avatar && (profileForm.avatar.startsWith("data:") || profileForm.avatar.startsWith("http") || profileForm.avatar.startsWith("/")) ? (
                    <img src={profileForm.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(profileForm.name)
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-900 font-bold text-xs">Profile Picture</div>
                  <div className="text-[10px] text-zinc-500 font-sans">JPG, PNG or GIF under 5MB.</div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-black text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Upload New
                    </button>
                    {profileForm.avatar && (
                      <button
                        type="button"
                        onClick={() => setProfileForm({ ...profileForm, avatar: "" })}
                        className="px-3 py-1 rounded-lg bg-white border border-[#e8e2d8] text-zinc-700 hover:bg-rose-50 hover:text-rose-700 text-[11px] font-bold transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">Username Handle</label>
                  <input
                    type="text"
                    required
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">University / Institute</label>
                  <input
                    type="text"
                    required
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">Portfolio Link</label>
                  <input
                    type="text"
                    value={profileForm.portfolioUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1">Bio</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs resize-none"
                />
              </div>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* SECTION 2: ACCOUNT SETTINGS */}
          {activeSection === "account" && (
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Account Overview</h2>
                <p className="text-zinc-500 text-[11px]">Primary login details and database verification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] space-y-1">
                  <div className="text-zinc-500 text-[10px]">Email Address</div>
                  <div className="text-zinc-900 font-bold">{user.email}</div>
                  <div className="text-[9px] text-zinc-500">Verified</div>
                </div>

                <div className="p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] space-y-1">
                  <div className="text-zinc-500 text-[10px]">Account ID</div>
                  <div className="text-zinc-900 font-bold font-mono truncate">{user.id}</div>
                  <div className="text-[9px] text-zinc-500">PostgreSQL Verified</div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: SECURITY SETTINGS */}
          {activeSection === "security" && (
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Security & Authentication</h2>
                <p className="text-zinc-500 text-[11px]">Manage password credentials and active sessions.</p>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); triggerSuccessToast(); }} className="space-y-4">
                <div>
                  <label className="block text-zinc-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-600 mb-1">New Password</label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-zinc-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 focus:outline-none focus:border-zinc-900 font-sans text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold shadow-sm transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Notification Preferences</h2>
                <p className="text-zinc-500 text-[11px]">Choose when and how you receive project updates.</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "emailStars", label: "Email when someone stars your repository" },
                  { key: "emailDMs", label: "Email on direct messages" },
                  { key: "emailRank", label: "Email when campus rank changes" },
                  { key: "pushFriendRequests", label: "Push notifications on new friend requests" },
                ].map((item) => (
                  <label key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] cursor-pointer">
                    <span className="text-zinc-800 font-medium">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={(notifState as any)[item.key]}
                      onChange={(e) => {
                        setNotifState({ ...notifState, [item.key]: e.target.checked });
                        triggerSuccessToast();
                      }}
                      className="w-4 h-4 accent-zinc-900 rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: PRIVACY */}
          {activeSection === "privacy" && (
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Privacy Settings</h2>
                <p className="text-zinc-500 text-[11px]">Control profile visibility and campus indexing.</p>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] space-y-2">
                  <div className="font-bold text-zinc-900">Profile Visibility</div>
                  <div className="flex gap-2">
                    {(["public", "campus", "private"] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setPrivacyState({ ...privacyState, profileVisibility: v });
                          triggerSuccessToast();
                        }}
                        className={`px-3 py-1.5 rounded-lg capitalize transition-all cursor-pointer ${
                          privacyState.profileVisibility === v
                            ? "bg-zinc-900 text-white font-bold shadow-xs"
                            : "bg-white text-zinc-700 border border-[#e8e2d8]"
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: APPEARANCE */}
          {activeSection === "appearance" && (
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Appearance Theme</h2>
                <p className="text-zinc-500 text-[11px]">Customize interface contrast and code themes.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-zinc-900 font-bold mb-2">Color Mode</div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectTheme("warm")}
                      className={`px-4 py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                        themeMode === "warm"
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                          : "bg-white text-zinc-800 border-[#e8e2d8] hover:border-zinc-400"
                      }`}
                    >
                      Warm Skin
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectTheme("dark")}
                      className={`px-4 py-2 rounded-xl border font-bold transition-all cursor-pointer ${
                        themeMode === "dark"
                          ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                          : "bg-white text-zinc-800 border-[#e8e2d8] hover:border-zinc-400"
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: CONNECTED ACCOUNTS */}
          {activeSection === "connected" && (
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Connected Accounts</h2>
                <p className="text-zinc-500 text-[11px]">OAuth providers linked to your account.</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center">
                      GH
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900">GitHub</div>
                      <div className="text-[10px] text-zinc-500">github.com/{user.username}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-zinc-900 text-white font-bold text-[10px]">Connected</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: DANGER ZONE & SIGN OUT */}
          {activeSection === "danger" && (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-rose-200 pb-3">
                <h2 className="text-base font-bold text-rose-900 tracking-tight">Account Session & Danger Zone</h2>
                <p className="text-rose-700 text-[11px]">Manage active login session or delete your account.</p>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-rose-200">
                <div>
                  <div className="text-zinc-900 font-bold">Sign Out of Account</div>
                  <div className="text-[10px] text-zinc-600 font-sans">Log out of @{user.username} to log in as another user.</div>
                </div>
                <button
                  onClick={async () => {
                    localStorage.removeItem("user");
                    await signOut({ callbackUrl: "/login" });
                  }}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Sign Out ➔
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <div className="text-rose-900 font-bold">Delete Account</div>
                  <div className="text-[10px] text-rose-700 font-sans">Permanently delete your profile and published repositories.</div>
                </div>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                      try {
                        const res = await fetch("/api/profile", {
                          method: "DELETE",
                        });
                        if (res.ok) {
                          localStorage.removeItem("user");
                          await signOut({ callbackUrl: "/register" });
                        } else {
                          const errData = await res.json().catch(() => ({}));
                          alert(errData.error || "Failed to delete account. Please try again.");
                        }
                      } catch (err) {
                        alert("Network error while deleting account.");
                      }
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
