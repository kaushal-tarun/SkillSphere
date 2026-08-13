"use client";

import React, { useState } from "react";
import { UserProfile, LeaderboardItem } from "@/types/dashboard";

interface LeaderboardViewProps {
  user: UserProfile;
  leaderboardTop5: LeaderboardItem[];
}

export function LeaderboardView({ user, leaderboardTop5 }: LeaderboardViewProps) {
  const [timePeriod, setTimePeriod] = useState<"all" | "monthly" | "weekly">("all");
  const [category, setCategory] = useState("all");

  const top3Developers = [
    { rank: 1, name: user.name, username: user.username, campus: user.university, points: 14250, projects: 12, achievements: 18, streak: 14, avatar: "AD" },
    { rank: 2, name: "Tanvi Kulkarni", username: "tanvi_kulkarni", campus: "BITS Pilani '25", points: 12800, projects: 9, achievements: 15, streak: 12, avatar: "TK" },
    { rank: 3, name: "Tushar Somani", username: "tushar_somani", campus: "IIIT Hyderabad '26", points: 11450, projects: 8, achievements: 12, streak: 9, avatar: "TS" },
  ];

  const fullRankings = [
    ...top3Developers,
    { rank: 4, name: "Rudra Sengupta", username: "rudra_sengupta", campus: "NIT Trichy '26", points: 9820, projects: 7, achievements: 10, streak: 8, avatar: "RS" },
    { rank: 5, name: "Ananya Vasisht", username: "ananya_vasisht", campus: "IISc Bangalore '25", points: 8900, projects: 6, achievements: 9, streak: 7, avatar: "AV" },
    { rank: 6, name: "Kabir Sharma", username: "kabir_sharma", campus: "IIT Delhi '26", points: 7650, projects: 5, achievements: 8, streak: 5, avatar: "KS" },
    { rank: 7, name: "Siddharth Verma", username: "siddharth_v", campus: "IIT Kharagpur '26", points: 6890, projects: 4, achievements: 7, streak: 6, avatar: "SV" },
    { rank: 8, name: "Meera Nair", username: "meera_nair", campus: "NIT Calicut '25", points: 5920, projects: 4, achievements: 5, streak: 4, avatar: "MN" },
    { rank: 9, name: "Yash Mehta", username: "yash_mehta", campus: "VJTI Mumbai '26", points: 4890, projects: 3, achievements: 4, streak: 3, avatar: "YM" },
    { rank: 10, name: "Pooja Reddy", username: "pooja_reddy", campus: "HYD Tech '25", points: 4120, projects: 3, achievements: 4, streak: 2, avatar: "PR" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* PAGE HEADER */}
      <div className="border-b border-zinc-900 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Leaderboard</h1>
        <p className="text-xs font-mono text-zinc-400 mt-1">
          Discover the most active builders in the community.
        </p>
      </div>

      {/* STICKY CURRENT USER STANDING CARD */}
      <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold flex items-center justify-center shrink-0">
              #1
            </div>
            <div>
              <div className="text-white font-bold flex items-center gap-2">
                <span>{user.name}</span>
                <span className="text-[10px] text-zinc-500 font-normal">({user.university})</span>
              </div>
              <div className="text-[10px] text-zinc-400">Your Current Rank • Top 1% Developer</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-300">
            <div>Points: <span className="text-white font-bold">14,250 XP</span></div>
            <div>Projects: <span className="text-white font-bold">3 Shipped</span></div>
            <div>Streak: <span className="text-white font-bold">14 Days</span></div>
          </div>
        </div>

        {/* Rank Advancement Progress Bar */}
        <div className="space-y-1 font-mono text-[11px] pt-2 border-t border-zinc-900">
          <div className="flex justify-between text-zinc-400">
            <span>Rank Progress</span>
            <span className="text-white font-bold">750 XP to Level Up</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden">
            <div className="h-full bg-white rounded-full w-[88%]" />
          </div>
        </div>
      </div>

      {/* TOP 3 DEVELOPERS SECTION (Clean High-Contrast Cards, NO Gold Podium Slop) */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-zinc-400">Top Builders This Season</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          {top3Developers.map((dev) => (
            <div
              key={dev.rank}
              className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-4 hover:border-zinc-700 transition-all flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center justify-center uppercase shrink-0">
                  {dev.avatar}
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-extrabold border ${
                  dev.rank === 1
                    ? "bg-white text-black border-white"
                    : "bg-zinc-900 text-zinc-300 border-zinc-800"
                }`}>
                  #{dev.rank}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white tracking-tight">{dev.name}</h3>
                <div className="text-xs text-zinc-400">@{dev.username}</div>
                <div className="text-[10px] text-zinc-500">{dev.campus}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-zinc-900 text-zinc-300">
                <div>
                  <div className="text-[10px] text-zinc-500">Skill Points</div>
                  <div className="text-white font-bold">{dev.points.toLocaleString()} XP</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-500">Projects Built</div>
                  <div className="text-white font-bold">{dev.projects} Repos</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER BAR (Time Period & Category) */}
      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="text-zinc-500 text-[11px] mr-1">Time Period:</span>
          {(["all", "monthly", "weekly"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setTimePeriod(period)}
              className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                timePeriod === period
                  ? "bg-white text-black font-bold"
                  : "text-zinc-400 hover:text-white bg-black border border-zinc-800"
              }`}
            >
              {period === "all" ? "All Time" : period}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-zinc-500 text-[11px]">Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-black border border-zinc-800 text-zinc-300 font-mono text-xs focus:outline-none focus:border-zinc-500"
          >
            <option value="all">All Categories</option>
            <option value="web">Web Development</option>
            <option value="ai">AI / ML</option>
            <option value="mobile">Mobile</option>
            <option value="opensource">Open Source</option>
          </select>
        </div>
      </div>

      {/* RANKINGS TABLE (GitHub / LeetCode Clean Style) */}
      <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-zinc-900 text-zinc-500 text-[11px]">
                <th className="pb-3 font-semibold">RANK</th>
                <th className="pb-3 font-semibold">DEVELOPER</th>
                <th className="pb-3 font-semibold text-center">PROJECTS</th>
                <th className="pb-3 font-semibold text-center">ACHIEVEMENTS</th>
                <th className="pb-3 font-semibold text-center">STREAK</th>
                <th className="pb-3 font-semibold text-right">SKILL POINTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {fullRankings.map((item) => (
                <tr key={item.rank} className="group hover:bg-black/60 transition-colors">
                  <td className="py-3.5">
                    <span className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                      item.rank === 1 ? "bg-white text-black font-extrabold" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                    }`}>
                      #{item.rank}
                    </span>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                        {item.avatar}
                      </div>
                      <div>
                        <div className="text-white font-bold">{item.name}</div>
                        <div className="text-[10px] text-zinc-500">@{item.username} • {item.campus}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 text-center text-zinc-300 font-bold">{item.projects}</td>
                  <td className="py-3.5 text-center text-zinc-300 font-bold">{item.achievements} Badges</td>
                  <td className="py-3.5 text-center text-zinc-400">{item.streak} Days</td>
                  <td className="py-3.5 text-right text-white font-bold">{item.points.toLocaleString()} XP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
