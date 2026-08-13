"use client";

import React, { useState } from "react";
import { UserProfile, FriendItem, ChatMessage } from "@/types/dashboard";

interface FriendsViewProps {
  user: UserProfile;
}

export function FriendsView({ user }: FriendsViewProps) {
  const [activeTab, setActiveTab] = useState<"ranking" | "chat" | "add">("ranking");
  const [searchQuery, setSearchQuery] = useState("");

  // Default Friends List with XP & Level
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

  // Selected Friend for Chat
  const [selectedFriend, setSelectedFriend] = useState<FriendItem>(friendsList[0]);
  const [inputMessage, setInputMessage] = useState("");

  // Mock Chat Messages per Friend ID
  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({
    f1: [
      { id: "m1", sender: "friend", text: "Hey! Loved your SkillSphere repository update.", time: "10:30 AM" },
      { id: "m2", sender: "me", text: "Thanks Tanvi! Working on pgvector embeddings right now.", time: "10:32 AM" },
      { id: "m3", sender: "friend", text: "Nice! Let me know if you want to test RAG latency.", time: "10:35 AM" },
    ],
    f2: [
      { id: "m1", sender: "friend", text: "Are you attending ETHIndia hackathon sprint?", time: "Yesterday" },
      { id: "m2", sender: "me", text: "Yes! Building WebSockets telemetry tools.", time: "Yesterday" },
    ],
    f3: [
      { id: "m1", sender: "friend", text: "Merged the OpenTelemetry pull request!", time: "2 days ago" },
    ],
    f4: [
      { id: "m1", sender: "friend", text: "Check out the Rust Wasm sandbox demo when free.", time: "3 days ago" },
    ],
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !selectedFriend) return;

    const newMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: "me",
      text: inputMessage.trim(),
      time: "Just now",
    };

    setChatHistories((prev) => ({
      ...prev,
      [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMsg],
    }));

    setInputMessage("");
  };

  const handleToggleAddFriend = (id: string) => {
    setFriendsList((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isFriend: !f.isFriend } : f))
    );
  };

  // Compute Friends Ranking List (User + Added Friends sorted by XP)
  const myFriends = friendsList.filter((f) => f.isFriend);
  
  const userAsFriend: FriendItem = {
    id: "me",
    name: user.name,
    username: user.username,
    university: user.university,
    xp: 14250,
    level: 42,
    projects: 3,
    status: "online",
    isFriend: true,
    avatar: "ME",
  };

  const friendsRankingList = [userAsFriend, ...myFriends].sort((a, b) => b.xp - a.xp);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const currentMessages = chatHistories[selectedFriend.id] || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">Friends & Network</h1>
          <p className="text-xs font-mono text-zinc-400 mt-1">
            Connect, rank, and chat with your developer friends across campuses.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-xl border border-zinc-800 font-mono text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("ranking")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "ranking" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Friends Ranking
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "chat" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Direct Messages ({myFriends.length})
          </button>
          <button
            onClick={() => setActiveTab("add")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeTab === "add" ? "bg-white text-black font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            + Add Friends
          </button>
        </div>
      </div>

      {/* TAB 1: FRIENDS RANKING */}
      {activeTab === "ranking" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
            <span>Friends XP & Level Standings</span>
            <span>Sorted by Skill Points</span>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800/90 space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-zinc-900 text-zinc-500 text-[11px]">
                    <th className="pb-3 font-semibold">RANK</th>
                    <th className="pb-3 font-semibold">FRIEND</th>
                    <th className="pb-3 font-semibold">UNIVERSITY</th>
                    <th className="pb-3 font-semibold text-center">LEVEL</th>
                    <th className="pb-3 font-semibold text-center">PROJECTS</th>
                    <th className="pb-3 font-semibold text-right">SKILL POINTS</th>
                    <th className="pb-3 font-semibold text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {friendsRankingList.map((friend, idx) => (
                    <tr key={friend.id} className={`group hover:bg-black/60 transition-colors ${
                      friend.id === "me" ? "bg-zinc-900/60" : ""
                    }`}>
                      <td className="py-3.5">
                        <span className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                          idx === 0 ? "bg-white text-black font-extrabold" : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                        }`}>
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase relative">
                            {friend.id === "me" ? getInitials(user.name) : friend.avatar}
                            <span className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-black ${
                              friend.status === "online" ? "bg-emerald-400" : "bg-zinc-600"
                            }`} />
                          </div>
                          <div>
                            <div className="text-white font-bold flex items-center gap-1.5">
                              <span>{friend.name}</span>
                              {friend.id === "me" && <span className="text-[10px] text-zinc-400 font-normal">(YOU)</span>}
                            </div>
                            <div className="text-[10px] text-zinc-500">@{friend.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-zinc-400">{friend.university}</td>
                      <td className="py-3.5 text-center text-zinc-300 font-bold">LVL {friend.level}</td>
                      <td className="py-3.5 text-center text-zinc-300 font-bold">{friend.projects} Repos</td>
                      <td className="py-3.5 text-right text-white font-bold">{friend.xp.toLocaleString()} XP</td>
                      <td className="py-3.5 text-right">
                        {friend.id !== "me" && (
                          <button
                            onClick={() => {
                              setSelectedFriend(friend);
                              setActiveTab("chat");
                            }}
                            className="px-3 py-1 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 text-xs transition-all cursor-pointer"
                          >
                            Chat 💬
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
          <div className="lg:col-span-1 rounded-2xl bg-zinc-950 border border-zinc-800/90 p-4 space-y-3 flex flex-col justify-between overflow-hidden">
            <div className="space-y-3">
              <div className="text-xs font-bold text-white tracking-tight border-b border-zinc-900 pb-2">
                Added Friends ({myFriends.length})
              </div>

              <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1">
                {myFriends.map((friend) => (
                  <button
                    key={friend.id}
                    onClick={() => setSelectedFriend(friend)}
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedFriend.id === friend.id
                        ? "bg-white text-black border-white font-bold"
                        : "bg-black text-zinc-300 border-zinc-800 hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center shrink-0 border relative ${
                        selectedFriend.id === friend.id ? "bg-black text-white border-zinc-800" : "bg-zinc-900 text-white border-zinc-800"
                      }`}>
                        {friend.avatar}
                        <span className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-black ${
                          friend.status === "online" ? "bg-emerald-400" : "bg-zinc-600"
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-bold">{friend.name}</div>
                        <div className={`text-[10px] truncate ${selectedFriend.id === friend.id ? "text-zinc-700" : "text-zinc-500"}`}>
                          LVL {friend.level} • {friend.xp.toLocaleString()} XP
                        </div>
                      </div>
                    </div>

                    <span className={`text-[9px] ${selectedFriend.id === friend.id ? "text-black font-bold" : "text-zinc-500"}`}>
                      {friend.status === "online" ? "● Online" : "○ Offline"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Direct Message Panel */}
          <div className="lg:col-span-2 rounded-2xl bg-zinc-950 border border-zinc-800/90 flex flex-col justify-between overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-zinc-900 flex items-center justify-between bg-black">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase relative">
                  {selectedFriend.avatar}
                  <span className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-black ${
                    selectedFriend.status === "online" ? "bg-emerald-400" : "bg-zinc-600"
                  }`} />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{selectedFriend.name}</div>
                  <div className="text-[10px] text-zinc-400">@{selectedFriend.username} • {selectedFriend.university}</div>
                </div>
              </div>

              <div className="text-right text-[10px] text-zinc-500">
                Level {selectedFriend.level} • {selectedFriend.xp.toLocaleString()} XP
              </div>
            </div>

            {/* Chat Messages Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3 bg-black/40">
              {currentMessages.length > 0 ? (
                currentMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === "me" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-md px-4 py-2.5 rounded-2xl text-xs font-sans ${
                        msg.sender === "me"
                          ? "bg-white text-black font-medium rounded-tr-none shadow-sm"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-tl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 mt-1 px-1">
                      {msg.time}
                    </span>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-zinc-500 font-mono text-xs">
                  No previous messages. Start the conversation with {selectedFriend.name}!
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-zinc-900 bg-black flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message @${selectedFriend.username}...`}
                className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs font-mono transition-all shadow-sm cursor-pointer shrink-0"
              >
                Send 💬
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ADD FRIENDS & DISCOVER */}
      {activeTab === "add" && (
        <div className="space-y-6 animate-in fade-in duration-200 font-mono text-xs">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search developers by name, username, or campus to add..."
              className="w-full px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 font-sans pl-11 transition-all"
            />
            <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friendsList
              .filter(
                (f) =>
                  f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  f.university.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((friend) => (
                <div
                  key={friend.id}
                  className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/90 hover:border-zinc-700 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                      {friend.avatar}
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">{friend.name}</div>
                      <div className="text-xs text-zinc-400">@{friend.username} • {friend.university}</div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">
                        Level {friend.level} • {friend.xp.toLocaleString()} XP
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleAddFriend(friend.id)}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      friend.isFriend
                        ? "bg-zinc-900 border border-zinc-800 text-zinc-300"
                        : "bg-white hover:bg-zinc-100 text-black shadow-sm"
                    }`}
                  >
                    {friend.isFriend ? "✓ Friend Added" : "+ Add Friend"}
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
