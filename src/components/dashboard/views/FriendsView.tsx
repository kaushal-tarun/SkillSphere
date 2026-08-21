"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, FriendItem, ChatMessage } from "@/types/dashboard";
import { getBuilderTitle } from "@/lib/titles";

interface FriendsViewProps {
  user: UserProfile;
  projectsCount?: number;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

export function FriendsView({ user, projectsCount = 0, searchQuery: externalSearchQuery, setSearchQuery: externalSetSearchQuery }: FriendsViewProps) {
  const [activeTab, setActiveTab] = useState<"ranking" | "chat" | "add">("chat");
  const [internalSearchQuery, setInternalSearchQuery] = useState("");

  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearchQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalSearchQuery;

  // Added friends state - connects to Neon PostgreSQL API
  const [addedFriends, setAddedFriends] = useState<FriendItem[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  // Load added friends and incoming requests from Neon PostgreSQL API
  const loadFriendsFromApi = async () => {
    try {
      const res = await fetch(`/api/friends?username=${encodeURIComponent(user.username)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.friends && Array.isArray(data.friends)) {
          setAddedFriends(data.friends);
        }
        if (data.pendingRequests && Array.isArray(data.pendingRequests)) {
          setPendingRequests(data.pendingRequests);
        }
      }
    } catch (e) {
      console.error("Failed to load added friends from PostgreSQL", e);
    }
  };

  useEffect(() => {
    loadFriendsFromApi();
  }, [user.username]);

  const [selectedFriend, setSelectedFriend] = useState<FriendItem | null>(null);
  const [inputMessage, setInputMessage] = useState("");

  const [chatHistories, setChatHistories] = useState<Record<string, ChatMessage[]>>({});

  const activeChatFriend = selectedFriend && addedFriends.some((f) => f.username.toLowerCase() === selectedFriend.username.toLowerCase())
    ? selectedFriend
    : addedFriends[0] || null;

  // Load chat history from Neon PostgreSQL API whenever active chat friend changes
  useEffect(() => {
    if (!activeChatFriend) return;
    async function loadMessages() {
      try {
        const res = await fetch(`/api/messages?username=${encodeURIComponent(user.username)}&friendUsername=${encodeURIComponent(activeChatFriend!.username)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.messages && Array.isArray(data.messages)) {
            setChatHistories((prev) => ({
              ...prev,
              [activeChatFriend!.username]: data.messages,
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load messages from PostgreSQL", e);
      }
    }
    loadMessages();
  }, [user.username, activeChatFriend?.username]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatFriend) return;

    const msgText = inputMessage.trim();
    setInputMessage("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          friendUsername: activeChatFriend.username,
          text: msgText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setChatHistories((prev) => ({
            ...prev,
            [activeChatFriend.username]: [...(prev[activeChatFriend.username] || []), data.message],
          }));
        }
      }
    } catch (e) {
      console.error("Failed to send message to PostgreSQL", e);
    }
  };

  const handleAddFriendToggle = async (targetUser: FriendItem) => {
    const isAlreadyFriend = addedFriends.some((f) => f.username.toLowerCase() === targetUser.username.toLowerCase());

    if (isAlreadyFriend) {
      // Unfriend in PostgreSQL
      setAddedFriends((prev) => prev.filter((f) => f.username.toLowerCase() !== targetUser.username.toLowerCase()));
      if (selectedFriend && selectedFriend.username.toLowerCase() === targetUser.username.toLowerCase()) {
        setSelectedFriend(null);
      }
      try {
        await fetch(`/api/friends?username=${encodeURIComponent(user.username)}&targetUsername=${encodeURIComponent(targetUser.username)}`, {
          method: "DELETE",
        });
      } catch (e) {
        console.error("Failed to remove friend in PostgreSQL", e);
      }
    } else {
      // Send Friend Request (Pending) in PostgreSQL
      setSentRequests((prev) => ({ ...prev, [targetUser.username.toLowerCase()]: true }));

      try {
        await fetch("/api/friends", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: user.username,
            targetUsername: targetUser.username,
          }),
        });
      } catch (e) {
        console.error("Failed to send friend request in PostgreSQL", e);
      }
    }
  };

  const handleAcceptRequest = async (senderUsername: string) => {
    setPendingRequests((prev) => prev.filter((req) => req.username.toLowerCase() !== senderUsername.toLowerCase()));
    try {
      await fetch("/api/friends", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ACCEPT",
          username: user.username,
          senderUsername,
        }),
      });
      loadFriendsFromApi();
    } catch (e) {
      console.error("Failed to accept friend request", e);
    }
  };

  const handleDeclineRequest = async (senderUsername: string) => {
    setPendingRequests((prev) => prev.filter((req) => req.username.toLowerCase() !== senderUsername.toLowerCase()));
    try {
      await fetch("/api/friends", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DECLINE",
          username: user.username,
          senderUsername,
        }),
      });
    } catch (e) {
      console.error("Failed to decline friend request", e);
    }
  };

  const realXp = projectsCount * 500;
  const realLevel = Math.floor(realXp / 500) + 1;

  const currentUserItem: FriendItem = {
    id: "me",
    name: user.name,
    username: user.username,
    university: user.university,
    xp: realXp,
    level: realLevel,
    projects: projectsCount,
    status: "online",
    isFriend: true,
    avatar: "ME",
  };

  const friendsRankingList = [...addedFriends, currentUserItem].sort((a, b) => b.xp - a.xp);

  // Load registered users from localStorage database (skillsphere_users_db)
  const getRegisteredUsersPool = (): FriendItem[] => {
    let registeredUsers: FriendItem[] = [];
    try {
      const stored = JSON.parse(localStorage.getItem("skillsphere_users_db") || "[]");
      registeredUsers = stored.map((u: any) => ({
        id: u.id || `usr_${u.username}`,
        name: u.name || u.username,
        username: u.username,
        university: u.university || "University Student",
        xp: u.xp || 1000,
        level: u.level || 1,
        projects: u.projects || 0,
        status: "online" as const,
        isFriend: false,
        avatar: (u.name || u.username).slice(0, 2).toUpperCase(),
      }));
    } catch (e) {
      console.error(e);
    }

    // Filter out current logged-in user from Add Friends search pool
    return registeredUsers.filter((f) => f.username.toLowerCase() !== user.username.toLowerCase());
  };

  const registeredPool = getRegisteredUsersPool();

  const searchResults = searchQuery.trim()
    ? registeredPool.filter((f) => {
        const q = searchQuery.trim().toLowerCase();
        return (
          f.username.toLowerCase().includes(q) ||
          f.name.toLowerCase().includes(q) ||
          f.university.toLowerCase().includes(q)
        );
      })
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* TOP CONTROLS BAR (RANKING, DIRECT MESSAGES, ADD FRIENDS) */}
      <div className="flex flex-wrap items-center justify-start gap-2 bg-white p-1.5 rounded-2xl border border-[#e8e2d8] font-mono text-xs shadow-sm w-fit">
        <button
          onClick={() => setActiveTab("ranking")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "ranking" ? "bg-zinc-900 text-white font-bold shadow-xs" : "text-zinc-600 hover:text-zinc-900 hover:bg-[#f4efe6]"
          }`}
        >
          Friends Ranking
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "chat" ? "bg-zinc-900 text-white font-bold shadow-xs" : "text-zinc-600 hover:text-zinc-900 hover:bg-[#f4efe6]"
          }`}
        >
          Direct Messages ({addedFriends.length})
        </button>
        <button
          onClick={() => setActiveTab("add")}
          className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
            activeTab === "add" ? "bg-zinc-900 text-white font-bold shadow-xs" : "text-zinc-600 hover:text-zinc-900 hover:bg-[#f4efe6]"
          }`}
        >
          + Add Friends
        </button>
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
                    <tr key={friend.id || friend.username} className={`group hover:bg-[#f4efe6]/50 transition-colors ${
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
                            <div className="text-[10px] text-zinc-500 flex items-center gap-1.5">
                              <span>@{friend.username}</span>
                              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${getBuilderTitle(friend.projects).badgeClass}`}>
                                {getBuilderTitle(friend.projects).title}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 text-zinc-600">{friend.university}</td>
                      <td className="py-3.5 text-center text-zinc-900 font-bold">LVL {friend.level}</td>
                      <td className="py-3.5 text-center text-zinc-800 font-bold">{friend.projects} Repos</td>
                      <td className="py-3.5 text-right text-zinc-900 font-bold">{friend.xp.toLocaleString()} XP</td>
                      <td className="py-3.5 text-right">
                        {friend.id !== "me" && (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleAddFriendToggle(friend)}
                              className="px-2.5 py-1 rounded-xl bg-red-50 text-red-700 border border-red-200 hover:bg-red-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
                            >
                              Unfriend
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFriend(friend);
                                setActiveTab("chat");
                              }}
                              className="px-3 py-1 rounded-xl bg-[#f4efe6] border border-[#e2dacd] hover:bg-zinc-900 hover:text-white text-zinc-800 text-xs font-bold transition-all cursor-pointer"
                            >
                              Chat ➔
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {addedFriends.length === 0 && (
              <div className="pt-4 text-center border-t border-zinc-100 font-mono text-xs text-zinc-500 flex items-center justify-between">
                <span>No added friends to compare yet.</span>
                <button
                  onClick={() => setActiveTab("add")}
                  className="text-zinc-900 font-bold underline hover:text-black cursor-pointer"
                >
                  + Add Friends
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT MESSAGES & CHAT DRAWER */}
      {activeTab === "chat" && (
        <div className="animate-in fade-in duration-200">
          {addedFriends.length === 0 ? (
            /* EMPTY FRIENDS STATE CARD */
            <div className="p-16 sm:p-20 text-center rounded-3xl bg-white border border-[#e8e2d8] shadow-sm space-y-8 max-w-3xl min-h-[380px] flex flex-col items-center justify-center mx-auto my-6">
              <div className="space-y-2">
                <h3 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight">
                  No Code Buddies?
                </h3>
                <h4 className="text-2xl sm:text-3xl font-extrabold text-zinc-700 tracking-tight">
                  Feeling lonely?
                </h4>
              </div>
              <button
                onClick={() => setActiveTab("add")}
                className="px-8 py-4 rounded-2xl bg-zinc-900 hover:bg-black text-white font-mono font-bold text-base shadow-md hover:scale-105 transition-all cursor-pointer"
              >
                + Add Friends
              </button>
            </div>
          ) : (
            /* ACTIVE FRIENDS DIRECT MESSAGING UI */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px] font-mono text-xs">
              {/* Left Friends List Drawer */}
              <div className="lg:col-span-1 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm p-4 space-y-3 flex flex-col justify-between overflow-hidden">
                <div className="space-y-3">
                  <div className="text-xs font-bold text-zinc-900 tracking-tight border-b border-zinc-100 pb-2">
                    Added Friends ({addedFriends.length})
                  </div>

                  <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1">
                    {addedFriends.map((friend) => (
                      <button
                        key={friend.username}
                        onClick={() => setSelectedFriend(friend)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          activeChatFriend && activeChatFriend.username.toLowerCase() === friend.username.toLowerCase()
                            ? "bg-zinc-900 text-white border-zinc-900 font-bold shadow-sm"
                            : "bg-[#f4efe6] border-[#e2dacd] text-zinc-800 hover:border-zinc-400"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase relative">
                            {friend.avatar}
                            <span className={`w-2 h-2 rounded-full absolute -top-0.5 -right-0.5 border border-white ${
                              friend.status === "online" ? "bg-emerald-500" : "bg-zinc-400"
                            }`} />
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
              {activeChatFriend && (
                <div className="lg:col-span-2 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm p-5 flex flex-col justify-between">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white font-bold text-xs flex items-center justify-center uppercase">
                        {activeChatFriend.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-zinc-900 text-sm">{activeChatFriend.name}</div>
                        <div className="text-[10px] text-zinc-500">@{activeChatFriend.username} • {activeChatFriend.university}</div>
                      </div>
                    </div>
                  </div>

                  {/* Messages Feed */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans text-xs my-3">
                    {(chatHistories[activeChatFriend.username] || []).length === 0 ? (
                      <div className="h-full flex items-center justify-center text-zinc-400 font-mono text-xs">
                        Start your conversation with @{activeChatFriend.username}!
                      </div>
                    ) : (
                      (chatHistories[activeChatFriend.username] || []).map((msg) => (
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
                      ))
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={handleSendMessage} className="flex gap-2 pt-3 border-t border-zinc-100">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={`Message @${activeChatFriend.username}...`}
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
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SEARCH-DRIVEN ADD FRIENDS */}
      {activeTab === "add" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* INCOMING FRIEND REQUESTS NOTIFICATION BANNER */}
          {pendingRequests.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-xs space-y-3 font-mono text-xs">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <span>Incoming Friend Requests ({pendingRequests.length})</span>
              </h3>
              <div className="space-y-2">
                {pendingRequests.map((req) => (
                  <div key={req.username} className="p-3 rounded-xl bg-white border border-amber-200 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-zinc-900">{req.name} (@{req.username})</div>
                      <div className="text-[10px] text-zinc-500">{req.university}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAcceptRequest(req.username)}
                        className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(req.username)}
                        className="px-3 py-1 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold transition-all cursor-pointer"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type username (e.g. advait_deshmukh)..."
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-[#e8e2d8] text-xs sm:text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-mono pl-11 shadow-sm"
            />
            <svg className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {!searchQuery.trim() ? (
            /* EMPTY SEARCH PROMPT */
            <div className="p-12 text-center rounded-3xl bg-white border border-[#e8e2d8] shadow-sm space-y-2 max-w-lg mx-auto my-4 font-mono text-xs">
              <h3 className="text-base font-bold text-zinc-900 tracking-tight">
                Search Builders by Username
              </h3>
              <p className="text-zinc-500 leading-relaxed">
                Type an exact username above to find student developers and send a friend request.
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            /* NO RESULTS MATCH */
            <div className="p-12 text-center rounded-3xl bg-white border border-[#e8e2d8] shadow-sm space-y-2 max-w-lg mx-auto my-4 font-mono text-xs">
              <h3 className="text-base font-bold text-zinc-900">
                No builder found matching "{searchQuery}"
              </h3>
              <p className="text-zinc-500">
                Make sure the username or university handle is spelled correctly.
              </p>
            </div>
          ) : (
            /* SEARCH RESULTS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((friend) => {
                const isAlreadyFriend = addedFriends.some((f) => f.username.toLowerCase() === friend.username.toLowerCase());
                const isRequestSent = sentRequests[friend.username.toLowerCase()];

                return (
                  <div
                    key={friend.username}
                    className="p-5 rounded-2xl bg-white border border-[#e8e2d8] text-zinc-900 shadow-sm space-y-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center uppercase shrink-0">
                        {friend.avatar}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-zinc-900 truncate">{friend.name}</div>
                        <div className="text-xs font-mono text-zinc-500 truncate">@{friend.username} • {friend.university}</div>
                        <div className="text-[10px] font-mono text-zinc-400 mt-0.5">LVL {friend.level} • {friend.xp.toLocaleString()} XP</div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleAddFriendToggle(friend)}
                      disabled={isRequestSent && !isAlreadyFriend}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all shrink-0 ${
                        isAlreadyFriend
                          ? "bg-[#f4efe6] border border-[#e2dacd] text-zinc-700 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                          : isRequestSent
                          ? "bg-amber-100 text-amber-900 border border-amber-300 font-bold"
                          : "bg-zinc-900 text-white shadow-sm hover:bg-black cursor-pointer"
                      }`}
                    >
                      {isAlreadyFriend ? "Added (Unfriend)" : isRequestSent ? "Pending Request" : "+ Add Friend"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
