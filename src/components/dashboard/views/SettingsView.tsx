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
    profileVisibility: "public", // "public" | "campus" | "private"
    showUniversity: true,
    showActivityFeed: true,
    allowSearchIndexing: true,
  });

  // Appearance State
  const [themeMode, setThemeMode] = useState<"light" | "slate" | "system">("light");
  const [codeTheme, setCodeTheme] = useState<"github" | "monokai" | "onedark">("github");

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
    { id: "appearance", label: "Appearance", icon: "☀️" },
    { id: "connected", label: "Connected Accounts", icon: "🔗" },
    { id: "danger", label: "Danger Zone", icon: "⚠️" },
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
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* PAGE HEADER */}
      <div className="border-b border-zinc-200 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">Settings</h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Manage your account and personalize your experience.
          </p>
        </div>

        {/* Saved Success Indicator Toast */}
        {savedSuccess && (
          <div className="px-3.5 py-1.5 rounded-xl bg-zinc-900 text-white font-mono text-xs flex items-center gap-2 animate-in fade-in duration-200 shadow-sm">
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
                    ? "bg-rose-100 text-rose-800 border border-rose-200 font-bold"
                    : "bg-zinc-900 text-white font-extrabold shadow-sm"
                  : item.id === "danger"
                  ? "text-rose-600 hover:bg-rose-50"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
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
            <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Profile Settings</h2>
                <p className="text-zinc-500 text-[11px]">Manage how your developer profile appears across SkillSphere.</p>
              </div>

              {/* Profile Picture Upload Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-base flex items-center justify-center uppercase shrink-0">
                  {getInitials(profileForm.name)}
                </div>
                <div className="space-y-1">
                  <div className="text-zinc-900 font-bold text-xs">Profile Picture</div>
                  <div className="text-[10px] text-zinc-500 font-sans">JPG, PNG or GIF under 5MB. Rendered in high-res across leaderboards.</div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => alert("Avatar upload dialog open.")}
                      className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-black text-white text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                    >
                      Upload New
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 text-[11px] font-bold transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">Username Handle *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.username}
                    onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">University / College *</label>
                  <input
                    type="text"
                    required
                    value={profileForm.university}
                    onChange={(e) => setProfileForm({ ...profileForm, university: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={profileForm.role}
                    onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                  />
                </div>

                <div>
                  <label className="block text-zinc-600 mb-1">Portfolio Website</label>
                  <input
                    type="text"
                    value={profileForm.portfolioUrl}
                    onChange={(e) => setProfileForm({ ...profileForm, portfolioUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1">Bio Summary</label>
                <textarea
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs resize-none"
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
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Account Preferences</h2>
                <p className="text-zinc-500 text-[11px]">Primary email credentials, membership tier, and data exports.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Email Address</div>
                  <div className="text-zinc-900 font-bold">{user.email}</div>
                  <div className="pt-2">
                    <button
                      onClick={() => alert("Change email flow initialized.")}
                      className="text-[11px] text-zinc-900 underline font-bold"
                    >
                      Change Email Address
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Account ID</div>
                  <div className="text-zinc-900 font-bold">usr_skillsphere_8f9a</div>
                  <div className="text-[10px] text-zinc-500">Unique platform hash</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Membership Tier</div>
                  <div className="text-zinc-900 font-bold">Verified Student Builder</div>
                  <div className="text-[10px] text-zinc-500">Unlimited public repositories</div>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1">
                  <div className="text-zinc-500 text-[10px]">Account Created</div>
                  <div className="text-zinc-900 font-bold">Jan 14, 2026</div>
                  <div className="text-[10px] text-zinc-500">Season 4 participant</div>
                </div>
              </div>

              {/* Data Export Box */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="text-zinc-900 font-bold">Export Account Archive</div>
                  <div className="text-[10px] text-zinc-500">Download a full JSON copy of your projects, XP records, and achievements.</div>
                </div>
                <button
                  onClick={() => triggerSuccessToast()}
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Download JSON
                </button>
              </div>
            </div>
          )}

          {/* SECTION 3: SECURITY SETTINGS */}
          {activeSection === "security" && (
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Security & Authentication</h2>
                <p className="text-zinc-500 text-[11px]">Manage password security, two-factor authentication, and active browser sessions.</p>
              </div>

              {/* Password Change Form */}
              <form onSubmit={(e) => { e.preventDefault(); triggerSuccessToast(); }} className="space-y-4">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Change Account Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-zinc-600 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={securityForm.currentPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 mb-1">New Password</label>
                    <input
                      type="password"
                      value={securityForm.newPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-600 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={securityForm.confirmPassword}
                      onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Update Password
                </button>
              </form>

              {/* Two-Factor Authentication */}
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between pt-4 border-t border-zinc-100">
                <div>
                  <div className="text-zinc-900 font-bold flex items-center gap-2">
                    <span>Two-Factor Authentication (2FA)</span>
                    <span className="px-2 py-0.2 rounded bg-emerald-100 border border-emerald-200 text-emerald-800 text-[10px]">Active</span>
                  </div>
                  <div className="text-[10px] text-zinc-500">Secured via Authenticator App (TOTP codes).</div>
                </div>

                <button
                  onClick={() => setSecurityForm({ ...securityForm, twoFactorEnabled: !securityForm.twoFactorEnabled })}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 font-bold hover:bg-zinc-100 cursor-pointer"
                >
                  {securityForm.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </button>
              </div>

              {/* Active Sessions */}
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Active Browser Sessions</h3>
                  <button onClick={() => triggerSuccessToast()} className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer">
                    Revoke All Other Sessions
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-900 font-bold">Chrome on Windows (Current Session)</div>
                      <div className="text-[10px] text-zinc-500">Mumbai, India • IP 103.24.xx.xx</div>
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">● Active Now</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-900 font-bold">Safari on iPhone 15 Pro</div>
                      <div className="text-[10px] text-zinc-500">Mumbai, India • 2 hours ago</div>
                    </div>
                    <button onClick={() => triggerSuccessToast()} className="text-[10px] text-zinc-500 hover:text-zinc-900 cursor-pointer">Revoke</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Notification Preferences</h2>
                <p className="text-zinc-500 text-[11px]">Choose how and when you receive email and push updates.</p>
              </div>

              {/* Email Notifications */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Email Notifications</h3>
                
                <div className="space-y-2">
                  {[
                    { key: "emailStars", label: "Project Stars & Forks", desc: "Receive email when someone stars or forks your repository." },
                    { key: "emailDMs", label: "Direct Messages", desc: "Receive email when another builder sends you a DM." },
                    { key: "emailRank", label: "Leaderboard Rank Updates", desc: "Weekly notification when your campus rank shifts." },
                    { key: "emailWeeklyDigest", label: "Weekly SkillSphere Digest", desc: "Curated newsletter of top projects and hackathon news." },
                  ].map((item) => (
                    <div key={item.key} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                      <div>
                        <div className="text-zinc-900 font-bold">{item.label}</div>
                        <div className="text-[10px] text-zinc-500">{item.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifState[item.key as keyof typeof notifState]}
                        onChange={(e) => setNotifState({ ...notifState, [item.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-zinc-900 focus:ring-0 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Push / In-App Notifications */}
              <div className="space-y-3 pt-2 border-t border-zinc-100">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">In-App Activity Notifications</h3>

                <div className="space-y-2">
                  {[
                    { key: "pushMentions", label: "Direct Mentions (@handle)", desc: "Notify when mentioned in community posts." },
                    { key: "pushBattles", label: "Project Battle Invites", desc: "Alert when challenged to a 1v1 repository duel." },
                    { key: "pushFriendRequests", label: "Friend Requests", desc: "Alert when developers add you to their network." },
                  ].map((item) => (
                    <div key={item.key} className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                      <div>
                        <div className="text-zinc-900 font-bold">{item.label}</div>
                        <div className="text-[10px] text-zinc-500">{item.desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifState[item.key as keyof typeof notifState]}
                        onChange={(e) => setNotifState({ ...notifState, [item.key]: e.target.checked })}
                        className="w-4 h-4 rounded text-zinc-900 focus:ring-0 cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => triggerSuccessToast()}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Save Notification Preferences
                </button>
              </div>
            </div>
          )}

          {/* SECTION 5: PRIVACY */}
          {activeSection === "privacy" && (
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Privacy Settings</h2>
                <p className="text-zinc-500 text-[11px]">Control public portfolio visibility, search indexing, and campus data.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-600 mb-1.5 font-bold">Profile Visibility</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "public", title: "Public to All", desc: "Visible to all student builders & tech recruiters." },
                      { id: "campus", title: "Campus Only", desc: "Only visible to verified students at " + user.university },
                      { id: "private", title: "Private Mode", desc: "Hidden from search and community feeds." },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setPrivacyState({ ...privacyState, profileVisibility: mode.id })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          privacyState.profileVisibility === mode.id
                            ? "bg-zinc-900 text-white border-zinc-900 font-bold shadow-sm"
                            : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="font-bold text-xs">{mode.title}</div>
                        <div className={`text-[10px] mt-1 ${privacyState.profileVisibility === mode.id ? "text-zinc-300" : "text-zinc-500"}`}>
                          {mode.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-3 border-t border-zinc-100">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-900 font-bold">Display Campus Badge</div>
                      <div className="text-[10px] text-zinc-500">Show {user.university} on public portfolio cards.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacyState.showUniversity}
                      onChange={(e) => setPrivacyState({ ...privacyState, showUniversity: e.target.checked })}
                      className="w-4 h-4 rounded text-zinc-900 focus:ring-0 cursor-pointer"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <div className="text-zinc-900 font-bold">Allow Search Engine Indexing</div>
                      <div className="text-[10px] text-zinc-500">Allow Google/Bing to index your public portfolio link.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={privacyState.allowSearchIndexing}
                      onChange={(e) => setPrivacyState({ ...privacyState, allowSearchIndexing: e.target.checked })}
                      className="w-4 h-4 rounded text-zinc-900 focus:ring-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => triggerSuccessToast()}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Save Privacy Settings
                </button>
              </div>
            </div>
          )}

          {/* SECTION 6: APPEARANCE */}
          {activeSection === "appearance" && (
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Appearance Preferences</h2>
                <p className="text-zinc-500 text-[11px]">Customize platform color themes, code syntax highlighting, and layout density.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-zinc-600 mb-2 font-bold">Platform Color Theme</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "light", title: "Clean Light & Slate", desc: "Minimalist white cards & soft slate grey canvas." },
                      { id: "slate", title: "Medium Slate Mode", desc: "Dark charcoal cards with high contrast text." },
                      { id: "system", title: "System Sync", desc: "Automatically match OS color preferences." },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setThemeMode(mode.id as any)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          themeMode === mode.id
                            ? "bg-zinc-900 text-white border-zinc-900 font-bold shadow-sm"
                            : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        <div className="font-bold text-xs">{mode.title}</div>
                        <div className={`text-[10px] mt-1 ${themeMode === mode.id ? "text-zinc-300" : "text-zinc-500"}`}>
                          {mode.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-100">
                  <label className="block text-zinc-600 mb-2 font-bold">Code Block Syntax Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: "github", label: "GitHub Light" },
                      { id: "monokai", label: "Monokai Pro" },
                      { id: "onedark", label: "One Dark Pro" },
                    ].map((stx) => (
                      <button
                        key={stx.id}
                        type="button"
                        onClick={() => setCodeTheme(stx.id as any)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer font-bold ${
                          codeTheme === stx.id
                            ? "bg-zinc-900 text-white border-zinc-900"
                            : "bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100"
                        }`}
                      >
                        {stx.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 flex justify-end">
                <button
                  onClick={() => triggerSuccessToast()}
                  className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                >
                  Apply Appearance Theme
                </button>
              </div>
            </div>
          )}

          {/* SECTION 7: CONNECTED ACCOUNTS */}
          {activeSection === "connected" && (
            <div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-6 font-mono text-xs">
              <div className="border-b border-zinc-100 pb-3">
                <h2 className="text-base font-bold text-zinc-900 tracking-tight">Connected Accounts & OAuth</h2>
                <p className="text-zinc-500 text-[11px]">Sync repositories, proof-of-work badges, and authentication providers.</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center shrink-0">
                      🐙
                    </div>
                    <div>
                      <div className="text-zinc-900 font-bold text-xs">GitHub Repository Sync</div>
                      <div className="text-[10px] text-zinc-500">Connected as <strong className="text-zinc-900">@{user.username}</strong> • 12 Repos Synced</div>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerSuccessToast()}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Re-sync Repositories 🔄
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
                      in
                    </div>
                    <div>
                      <div className="text-zinc-900 font-bold text-xs">LinkedIn Professional Profile</div>
                      <div className="text-[10px] text-zinc-500">Connected • Auto-publishes portfolio milestones</div>
                    </div>
                  </div>

                  <button
                    onClick={() => alert("LinkedIn disconnect dialog.")}
                    className="px-3.5 py-1.5 rounded-xl bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100 font-bold text-xs transition-all cursor-pointer"
                  >
                    Disconnect
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-bold flex items-center justify-center shrink-0">
                      N
                    </div>
                    <div>
                      <div className="text-zinc-900 font-bold text-xs">Notion Workspace Sync</div>
                      <div className="text-[10px] text-zinc-500">Not Connected • Sync project notes & docs</div>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerSuccessToast()}
                    className="px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    Connect Notion
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 8: DANGER ZONE */}
          {activeSection === "danger" && (
            <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-6 font-mono text-xs text-rose-900">
              <div className="border-b border-rose-200 pb-3">
                <h2 className="text-base font-bold text-rose-900 tracking-tight">Danger Zone</h2>
                <p className="text-rose-700 text-[11px]">Irreversible and destructive account actions.</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white border border-rose-200 flex items-center justify-between">
                  <div>
                    <div className="text-zinc-900 font-bold">Deactivate Account</div>
                    <div className="text-[10px] text-zinc-500">Temporarily disable your profile and hide projects.</div>
                  </div>
                  <button
                    onClick={() => alert("Deactivation request initialized.")}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    Deactivate Account
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-white border border-rose-200 flex items-center justify-between">
                  <div>
                    <div className="text-zinc-900 font-bold">Delete Account</div>
                    <div className="text-[10px] text-zinc-500">Permanently delete user profile, XP stats, and data.</div>
                  </div>
                  <button
                    onClick={() => alert("Account deletion requires password verification.")}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
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
