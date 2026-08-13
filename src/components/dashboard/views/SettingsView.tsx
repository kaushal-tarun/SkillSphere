"use client";

import React, { useState } from "react";
import { UserProfile } from "@/types/dashboard";

interface SettingsViewProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

export function SettingsView({ user, setUser }: SettingsViewProps) {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    university: user.university,
    role: user.role || "Full-Stack Engineer & AI Developer",
    bio: user.bio || "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...user, ...formData };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-2xl">
      <div className="border-b border-zinc-900 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Settings</h1>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Manage your developer profile details, university credentials, and portfolio preferences.
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs font-mono">
          ✓ Profile settings updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90">
        <div>
          <label className="block text-zinc-400 mb-1">Full Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Username Handle</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">University / College</label>
          <input
            type="text"
            value={formData.university}
            onChange={(e) => setFormData({ ...formData, university: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Role Title</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs"
          />
        </div>

        <div>
          <label className="block text-zinc-400 mb-1">Bio Summary</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            className="w-full px-3.5 py-2 rounded-xl bg-black border border-zinc-800 text-white focus:outline-none focus:border-zinc-500 font-sans text-xs resize-none"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
