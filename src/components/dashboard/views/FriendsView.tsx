"use client";

import React, { useState } from "react";
import { UserProfile, FriendItem, ChatMessage } from "@/types/dashboard";

interface FriendsViewProps {
  user: UserProfile;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export function FriendsView({ user, searchQuery: externalSearchQuery, setSearchQuery: externalSetSearchQuery }: FriendsViewProps) {
  const [activeTab, setActiveTab] = useState<"ranking" | "chat" | "add">("ranking");
  const [internalSearchQuery, setInternalSearchQuery] = useState("");

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;

  const [friendsList, setFriendsList] = useState<FriendItem[]>([
    {
      id: "f1",
      name: "Tanvi Kulkarni",
      username: "tanvi_kulkarni",
      university: "BITS Pilani '25",
      xp: 12800,
      level: 40,
      projects: 9,
      status: "online",
      isFriend: true,
      avatar: "TK",
    },
    {
      id: "f2",
      name: "Tushar Somani",
      username: "tushar_somani",
      university: "IIIT Hyderabad '26",
      xp: 11450,
      level: 36,
      projects: 8,
      status: "online",
      isFriend: true,
      avatar: "TS",
    },
    {
      id: "f3",
      name: "Rudra Sengupta",
      username: "rudra_sengupta",
      university: "NIT Trichy '26",
      xp: 9820,
      level: 31,
      projects: 7,
      status: "offline",
      isFriend: true,
      avatar: "RS",
    },
    {
      id: "f4",
      name: "Ananya Vasisht",
      username: "ananya_vasisht",
      university: "IISc Bangalore '25",
      xp: 8900,
      level: 28,
      projects: 6,
      status: "online",
      isFriend: true,
      avatar: "AV",
    },
    {
      id: "f5",
      name: "Kabir Sharma",
      username: "kabir_sharma",
      university: "IIT Delhi '26",
      xp: 7650,
      level: 24,
      projects: 5,
      status: "offline",
      isFriend: false,
      avatar: "KS",
    },
    {
      id: "f6",
      name: "Siddharth Verma",
      username: "siddharth_v",
      university: "IIT Kharagpur '26",
      xp: 6890,
      level: 21,
      projects: 4,
      status: "offline",
      isFriend: false,
      avatar: "SV",
    },
  ]);

  const [selectedFriend, setSelectedFriend] = useState<FriendItem>(friendsList[0]);
  const [inputMessage, setInputMessage] = useState("");

  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    f1: [
      { id: "m1", sender: "friend", text: "Hey! Loved KnowledgeVault AI. How are you vectorizing pages?", time: "10:24 AM" },
      { id: "m2", sender: "me", text: "Using pgvector with Next.js 16! Performs sub-100ms similarity searches.", time: "10:26 AM" },
    ],
    f2: [
      { id: "m3", sender: "friend", text: "Yo, tested CodeCollab multiplayer AST sync?", time: "Yesterday" },
    ],
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedFriend) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "me",
      text: inputMessage,
      time: "Just now",
    };

    setChatHistories((prev) => ({
      ...prev,
      [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMsg],
    }));

    setInputMessage("");
  };

  const handleAddFriendToggle = (id: string) => {
    setFriendsList((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return { ...f, isFriend: !f.isFriend };
        }
        return f;
      })
    );
  };

  const myFriends = friendsList.filter((f) => f.isFriend);

  const currentUserItem: FriendItem = {
    id: "me",
    name: user.name,
    username: user.username,
    university: user.university,
    xp: 14250,
    level: 42,
    projects: 12,
    status: "online",
    isFriend: true,
    avatar: "ME",
  };

  const friendsRankingList = [...myFriends, currentUserItem].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e8e2d8] pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">Friends & Campus Network</h1>
          <p className="text-xs font-mono text-zinc-500 mt-1">
            Connect with student builders, compare XP ranks, and chat in real-time.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-[#e8e2d8] font-mono text-xs shadow-sm self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("ranking")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "ranking" ? "bg-zinc-900 text-white font-bold" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Friends Ranking
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "chat" ? "bg-zinc-900 text-white font-bold" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Direct Messages ({myFriends.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "add" ? "bg-zinc-900 text-white font-bold" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            + Add Friends
          </button>
        </div>
      </div>

      {/* TAB 1: FRIENDS RANKING */}
      {activeTab === "ranking" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-500">
            <span>Friends XP & Level Standings</span>
            <span>Sorted by Skill Points</span>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#e8e2d8] text-zinc-500 text-[11px]">
                    <th className="pb-3 font-semibold">RANK</th>
                    <th className="pb-3 font-semibold">FRIEND</th>
                    <th className="pb-3 font-semibold">UNIVERSITY</th>
                    <th className="pb-3 font-semibold text-center">LEVEL</th>
                    <th className="pb-3 font-semibold text-center">PROJECTS</th>
                    <th className="pb-3 font-semibold text-right">SKILL POINTS</th>
                    <th className="pb-3 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {friendsRankingList.map((friend, idx) => (
                    <tr key={friend.id} className={`group hover:bg-[#f4efe6]/50 transition-colors ${
                      friend.id === "me" ? "bg-[#f4efe6] font-bold" : ""
                    }`}>
                      <td className="py-3.5">
                        <span className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                          idx === 0 ? "bg-zinc-900 text-white font-extrabold" : "bg-zinc-200 text-zinc-800"
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase relative">
                            {friend.id === "me" ? "ME" : friend.avatar}
                            <span className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-white ${
                              friend.status === "online" ? "bg-emerald-500" : "bg-zinc-400"
                            }`} />
                          </div>
                          <div>
                            <div className="text-zinc-900 font-bold flex items-center gap-1.5">
                              <span>{friend.name}</span>
                              {friend.id === "me" && <span className="text-[10px] text-zinc-500 font-normal">(YOU)</span>}
                            </div>
                            <div className="text-[10px] text-zinc-500">@{friend.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-zinc-600">{friend.university}</td>
                      <td className="py-3.5 text-center text-zinc-900 font-bold">LVL {friend.level}</td>
                      <td className="py-3.5 text-center text-zinc-800 font-bold">{friend.projects} Repos</td>
                      <td className="py-3.5 text-right text-zinc-900 font-bold">{friend.xp.toLocaleString()} XP</td>
                      <td className="py-3.5 text-right">
                        {friend.id !== "me" && (
                          <button
                            onClick={() => {
                              setSelectedFriend(friend);
                              setActiveTab("chat");
                            }}
                            className="px-3 py-1 rounded-xl bg-[#f4efe6] border border-[#e2dacd] hover:bg-zinc-900 hover:text-white text-zinc-800 text-xs font-bold transition-all cursor-pointer"
                          >
                            Chat ➔
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT MESSAGES & CHAT DRAWER */}
      {activeTab === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px] animate-in fade-in duration-200 font-mono text-xs">
          {/* Left Friends List Drawer */}
          <div className="lg:col-span-1 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm p-4 space-y-3 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3">
              <div className="text-xs font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-2">
                Added Friends ({myFriends.length})
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1">
                {myFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedFriend.id === friend.id
                        ? "bg-zinc-900 text-white border-zinc-900 font-bold shadow-sm"
                        : "bg-[#f4efe6] border-[#e2dacd] text-zinc-800 hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                        {friend.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-bold text-xs">{friend.name}</div>
                        <div className="text-[10px] opacity-70 truncate">@{friend.username}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Chat Viewport */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm p-5 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                  {selectedFriend.avatar}
                </div>
                <div>
                  <div className="font-bold text-zinc-900 text-sm">{selectedFriend.name}</div>
                  <div className="text-[10px] text-zinc-500">@{selectedFriend.username} • {selectedFriend.university}</div>
                </div>
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs my-3">
              {(chatHistories[selectedFriend.id] || []).map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
                >
                  <div className={`max-w-[75%] p-3 rounded-2xl ${
                    msg.sender === "me"
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "bg-[#f4efe6] border border-[#e2dacd] text-zinc-900"
                  }`}>
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-zinc-100">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message @${selectedFriend.username}...`}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-mono font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                Send ➔
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ADD FRIENDS */}
      {activeTab === "add" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student builders by name, campus, or username..."
              className="w-full px-4 py-3 rounded-2xl bg-white border border-[#e8e2d8] text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans pl-11 shadow-sm"
            />
            <svg className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friendsList.map((friend) => (
              <div
                key={friend.id}
                className="p-5 rounded-2xl bg-white border border-[#e8e2d8] text-zinc-900 shadow-sm space-y-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center uppercase shrink-0">
                    {friend.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-900">{friend.name}</div>
                    <div className="text-xs font-mono text-zinc-500">@{friend.username} • {friend.university}</div>
                    <div className="text-[10px] font-mono text-zinc-400 mt-0.5">LVL {friend.level} • {friend.xp.toLocaleString()} XP</div>
                  </div>
                </div>

                <button
                  onClick={() => handleAddFriendToggle(friend.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                    friend.isFriend
                      ? "bg-[#f4efe6] border border-[#e2dacd] text-zinc-700 hover:bg-rose-50 hover:text-rose-700"
                      : "bg-zinc-900 text-white shadow-sm hover:bg-black"
                  }`}
                >
                  {friend.isFriend ? "Added ✓" : "+ Add"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
