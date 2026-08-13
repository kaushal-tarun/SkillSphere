"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/dashboard";

interface SettingsViewProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
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

export function SettingsView({ user, setUser }: SettingsViewProps) {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    username: user.username,
    university: user.university,
    role: user.role || "Full-Stack Engineer & AI Developer",
    location: user.location || "Mumbai, India",
    bio: user.bio || "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
    portfolioUrl: "https://advait.dev",
    githubUrl: `https://github.com/${user.username}`,
    linkedinUrl: `https://linkedin.com/in/${user.username}`,
  });

  // Notifications Toggles State
  const [notifications, setNotifications] = useState({
    projectUpdates: true,
    leaderboardAlerts: true,
    communityActivity: true,
    platformAnnouncements: false,
    emailDigest: true,
  });

  // Privacy Toggles State
  const [privacy, setPrivacy] = useState({
    publicProfile: true,
    publicProjects: true,
    showCollege: true,
    showActivity: true,
    showRanking: true,
  });

  // Appearance State
  const [themeMode, setThemeMode] = useState<"dark" | "light" | "system">("dark");

  // Connected Accounts State
  const [connections, setConnections] = useState({
    github: true,
    google: true,
    linkedin: false,
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: profileForm.name,
      username: profileForm.username,
      university: profileForm.university,
      role: profileForm.role,
      location: profileForm.location,
      bio: profileForm.bio,
    };

    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    triggerSuccessToast();
  };

  const triggerSuccessToast = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const navItems: { id: SettingsSection; label: string; icon: string }[] = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "account", label: "Account", icon: "💳" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "👁️" },
    { id: "appearance", label: "Appearance", icon: "🌙" },
    { id: "connected", label: "Connected Accounts", icon: "🔗" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* PAGE HEADER */}
      <div className="border-b border-zinc-900/90 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Settings</h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Manage your account details, privacy, security, and platform preferences.
          </p>
        </div>

        {/* Saved Success Indicator Toast */}
        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-xs flex items-center gap-2 animate-in fade-in duration-200">
            <span>✓</span>
            <span>Settings saved successfully</span>
          </div>
        )}
      </div>

      {/* TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* LEFT VERTICAL SUB-NAVIGATION */}
        <div className="md:col-span-1 space-y-1 font-mono text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all text-left cursor-pointer ${
                activeSection === item.id
                  ? item.id === "danger"
                    ? "bg-rose-950/60 text-rose-300 border border-rose-900/80 font-bold"
                    : "bg-white text-black font-extrabold shadow-sm"
                  : item.id === "danger"
                  ? "text-rose-400 hover:bg-rose-950/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/80"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* RIGHT CONTENT PANEL */}
        <div className="md:col-span-3">
          
          {/* SECTION 1: PROFILE SETTINGS */}
          {activeSection === "profile" && (
            <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Profile Settings</h2>
                <p className="text-zinc-400 text-[11px]">Manage how your developer profile appears across SkillSphere.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Username Handle</label>
                  <input
                    type="text"
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">University / College</label>
                  <input
                    type="text"
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">Portfolio Website</label>
                  <input
                    type="text"
                    value={profileForm.portfolioUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">GitHub Profile Link</label>
                  <input
                    type="text"
                    value={profileForm.githubUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-400 mb-1">LinkedIn Profile Link</label>
                  <input
                    type="text"
                    value={profileForm.linkedinUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Bio Summary</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs resize-none"
                />
              </div>

              <div className="pt-2 border-t border-zinc-900">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}

          {/* SECTION 2: ACCOUNT SETTINGS */}
          {activeSection === "account" && (
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Account Overview</h2>
                <p className="text-zinc-400 text-[11px]">Primary credentials and platform membership data.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Email Address</div>
                  <div className="text-white font-bold">{user.email}</div>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Account ID</div>
                  <div className="text-white font-bold">usr_skillsphere_8f9a</div>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Account Creation Date</div>
                  <div className="text-white font-bold">Jan 14, 2026</div>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Membership Status</div>
                  <div className="text-white font-bold">Verified Student Builder</div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900 flex items-center gap-3">
                <button
                  onClick={triggerSuccessToast}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 transition-all cursor-pointer"
                >
                  Change Email
                </button>
                <button
                  onClick={triggerSuccessToast}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 transition-all cursor-pointer"
                >
                  Change Handle
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: SECURITY SETTINGS */}
          {activeSection === "security" && (
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Security & Authentication</h2>
                <p className="text-zinc-400 text-[11px]">Manage password, sessions, and multi-factor authentication.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">Password Management</div>
                    <div className="text-[10px] text-zinc-500">Last changed 30 days ago</div>
                  </div>
                  <button
                    onClick={triggerSuccessToast}
                    className="px-3 py-1 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer"
                  >
                    Change Password
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">Two-Factor Authentication (2FA)</div>
                    <div className="text-[10px] text-zinc-500">Secure your account with authenticator apps</div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[10px]">
                    Enabled
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 space-y-2">
                  <div className="text-white font-bold">Active Sessions</div>
                  <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                    <span>Chrome / Windows (Current Active Session)</span>
                    <span className="text-emerald-400 font-bold">● Active Now</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-900">
                <button
                  onClick={triggerSuccessToast}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 transition-all cursor-pointer"
                >
                  Sign Out From All Devices
                </button>
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS SETTINGS */}
          {activeSection === "notifications" && (
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Notification Preferences</h2>
                <p className="text-zinc-400 text-[11px]">Control email and platform alert notifications.</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "projectUpdates", label: "Project & Repository Updates", desc: "Notify when peer developers review or fork your code." },
                  { key: "leaderboardAlerts", label: "Rank & Skill Points Alerts", desc: "Notify upon rank advancements or XP milestones." },
                  { key: "communityActivity", label: "Community Mentions & Replies", desc: "Alert when builders reply to your posts." },
                  { key: "emailDigest", label: "Weekly Builder Email Digest", desc: "Receive weekly summary of top campus projects." },
                ].map((item) => (
                  <div key={item.key} className="p-4 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{item.label}</div>
                      <div className="text-[10px] text-zinc-500">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => {
                        setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof typeof notifications],
                        });
                        triggerSuccessToast();
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        notifications[item.key as keyof typeof notifications] ? "bg-white" : "bg-zinc-900 border border-zinc-800"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full absolute top-1 transition-all ${
                        notifications[item.key as keyof typeof notifications]
                          ? "bg-black right-1"
                          : "bg-zinc-600 left-1"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: PRIVACY SETTINGS */}
          {activeSection === "privacy" && (
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Privacy Controls</h2>
                <p className="text-zinc-400 text-[11px]">Manage public visibility of your portfolio and statistics.</p>
              </div>

              <div className="space-y-3">
                {[
                  { key: "publicProfile", label: "Public Profile Visibility", desc: "Allow anyone to view your skillsphere.dev/u/ handle." },
                  { key: "publicProjects", label: "Public Project Showcase", desc: "Display your repositories in the Discover feed." },
                  { key: "showCollege", label: "Display University Information", desc: "Show college name on your cards & rank badges." },
                  { key: "showRanking", label: "Public Ranking Standings", desc: "Include your profile on Campus & Global Leaderboards." },
                ].map((item) => (
                  <div key={item.key} className="p-4 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{item.label}</div>
                      <div className="text-[10px] text-zinc-500">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => {
                        setPrivacy({
                          ...privacy,
                          [item.key]: !privacy[item.key as keyof typeof privacy],
                        });
                        triggerSuccessToast();
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                        privacy[item.key as keyof typeof privacy] ? "bg-white" : "bg-zinc-900 border border-zinc-800"
                      }`}
                    >
                      <span className={`w-4 h-4 rounded-full absolute top-1 transition-all ${
                        privacy[item.key as keyof typeof privacy]
                          ? "bg-black right-1"
                          : "bg-zinc-600 left-1"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: APPEARANCE SETTINGS */}
          {activeSection === "appearance" && (
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Appearance Preferences</h2>
                <p className="text-zinc-400 text-[11px]">Select your preferred platform interface visual mode.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "dark", label: "Dark Mode", detail: "Pure high-contrast OLED black theme (Default)" },
                  { id: "light", label: "Light Mode", detail: "High-contrast clean white background" },
                  { id: "system", label: "System Preference", detail: "Sync with your operating system settings" },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setThemeMode(mode.id as "dark" | "light" | "system");
                      triggerSuccessToast();
                    }}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      themeMode === mode.id
                        ? "bg-white text-black border-white font-bold"
                        : "bg-black text-zinc-300 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="text-sm font-bold">{mode.label}</div>
                    <div className={`text-[10px] mt-1 ${themeMode === mode.id ? "text-zinc-700" : "text-zinc-500"}`}>
                      {mode.detail}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 7: CONNECTED ACCOUNTS */}
          {activeSection === "connected" && (
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-900 pb-3">
                <h2 className="text-base font-bold text-white tracking-tight">Connected Accounts</h2>
                <p className="text-zinc-400 text-[11px]">Link external developer accounts and authentication providers.</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold flex items-center justify-center">
                      GH
                    </div>
                    <div>
                      <div className="text-white font-bold">GitHub</div>
                      <div className="text-[10px] text-zinc-500">Connected as @{user.username}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setConnections({ ...connections, github: !connections.github });
                      triggerSuccessToast();
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      connections.github
                        ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                        : "bg-white text-black shadow-sm"
                    }`}
                  >
                    {connections.github ? "Disconnect" : "Connect"}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold flex items-center justify-center">
                      G
                    </div>
                    <div>
                      <div className="text-white font-bold">Google</div>
                      <div className="text-[10px] text-zinc-500">Connected as {user.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setConnections({ ...connections, google: !connections.google });
                      triggerSuccessToast();
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      connections.google
                        ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                        : "bg-white text-black shadow-sm"
                    }`}
                  >
                    {connections.google ? "Disconnect" : "Connect"}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black border border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold flex items-center justify-center">
                      IN
                    </div>
                    <div>
                      <div className="text-white font-bold">LinkedIn</div>
                      <div className="text-[10px] text-zinc-500">Not connected</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setConnections({ ...connections, linkedin: !connections.linkedin });
                      triggerSuccessToast();
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      connections.linkedin
                        ? "bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                        : "bg-white text-black shadow-sm"
                    }`}
                  >
                    {connections.linkedin ? "Disconnect" : "Connect"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: DANGER ZONE */}
          {activeSection === "danger" && (
            <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/60 space-y-6 font-mono text-xs text-rose-300">
              <div className="border-b border-rose-900/60 pb-3">
                <h2 className="text-base font-bold text-rose-200 tracking-tight">Danger Zone</h2>
                <p className="text-rose-400/80 text-[11px]">Irreversible and destructive account actions.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-black/80 border border-rose-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">Deactivate Account</div>
                    <div className="text-[10px] text-zinc-400">Temporarily disable your profile and hide projects.</div>
                  </div>
                  <button
                    onClick={() => alert("Deactivation request initialized.")}
                    className="px-3 py-1.5 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Deactivate Account
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-black/80 border border-rose-900/60 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold">Delete Account</div>
                    <div className="text-[10px] text-zinc-400">Permanently delete user profile, XP stats, and data.</div>
                  </div>
                  <button
                    onClick={() => alert("Account deletion requires password verification.")}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
