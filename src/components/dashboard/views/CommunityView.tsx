"use client";

import React, { useState } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";

interface CommunityViewProps {
  user: UserProfile;
  onNavigateToProfile?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

interface PostItem {
  id: string;
  authorName: string;
  authorHandle: string;
  campus: string;
  avatar: string;
  time: string;
  content: string;
  image?: string;
  codeSnippet?: string;
  likes: number;
  reposts: number;
  replies: number;
  isLiked?: boolean;
  isReposted?: boolean;
  projectTag?: string;
}

export function CommunityView({ user, onNavigateToProfile, onSelectProject }: CommunityViewProps) {
  const [activeTab, setActiveTab] = useState<"foryou" | "launches" | "campus">("foryou");
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<string | undefined>(undefined);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Authentic Gen Z Builder Feed Posts
  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: "p1",
      authorName: "Tanvi Kulkarni",
      authorHandle: "tanvi_kulkarni",
      campus: "BITS Pilani '25",
      avatar: "TK",
      time: "25m ago",
      content: "just pushed Nexa Study Engine v2 at 3:45 AM cause sleeping is for people who aren't rewriting Notion sync algorithms 😭💀 how is the dark mode UI looking guys?? roast my code",
      projectTag: "Nexa Study Engine",
      likes: 84,
      reposts: 12,
      replies: 19,
    },
    {
      id: "p2",
      authorName: "Tushar Somani",
      authorHandle: "tushar_somani",
      campus: "IIIT Hyderabad '26",
      avatar: "TS",
      time: "1h ago",
      content: "rewrote our WebSockets AST parser in Rust and latency dropped from 140ms to 12ms... python bros in shambles rn 🦀🔥 who wants to test the realtime editor multiplayer with me?",
      projectTag: "CodeCollab",
      codeSnippet: "pub fn parse_ast(buffer: &[u8]) -> Result<ASTNode, ParseError> {\n    let lexer = Lexer::new(buffer);\n    lexer.tokenize_simd()\n}",
      likes: 142,
      reposts: 28,
      replies: 34,
    },
    {
      id: "p3",
      authorName: "Advait Deshmukh",
      authorHandle: "advait_d",
      campus: "IIT Bombay '26",
      avatar: "AD",
      time: "3h ago",
      content: "hey guys! built KnowledgeVault AI over the weekend using Next.js 16 + pgvector. it indexes 500-page engineering PDFs and gives Q&A under 100ms with exact page citations 🚀 drop your hardest CS paper to test it!",
      projectTag: "KnowledgeVault AI",
      likes: 210,
      reposts: 45,
      replies: 52,
    },
    {
      id: "p4",
      authorName: "Rudra Sengupta",
      authorHandle: "rudra_sengupta",
      campus: "NIT Trichy '26",
      avatar: "RS",
      time: "5h ago",
      content: "ETHIndia hackathon squad application is open! looking for 1 solid frontend dev who knows Next.js & Tailwind. we already built the Go OpenTelemetry telemetry pipeline 🛠️ DM me if you wanna win this year!!",
      likes: 67,
      reposts: 15,
      replies: 22,
    },
    {
      id: "p5",
      authorName: "Ananya Vasisht",
      authorHandle: "ananya_vasisht",
      campus: "IISc Bangalore '25",
      avatar: "AV",
      time: "8h ago",
      content: "browser WebAssembly sandbox is live on GitHub! running untrusted C++ / Rust code directly in client side JS with zero server overhead. Wasm is literally magic ✨",
      projectTag: "Aura Kernel Wasm",
      likes: 189,
      reposts: 31,
      replies: 27,
    },
  ]);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const created: PostItem = {
      id: `p-${Date.now()}`,
      authorName: user.name,
      authorHandle: user.username,
      campus: user.university,
      avatar: getInitials(user.name),
      time: "Just now",
      content: newPostText.trim(),
      likes: 1,
      reposts: 0,
      replies: 0,
      isLiked: true,
    };

    setPosts([created, ...posts]);
    setNewPostText("");
  };

  const handleToggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            likes: p.isLiked ? p.likes - 1 : p.likes + 1,
            isLiked: !p.isLiked,
          };
        }
        return p;
      })
    );
  };

  const handleToggleRepost = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            reposts: p.isReposted ? p.reposts - 1 : p.reposts + 1,
            isReposted: !p.isReposted,
          };
        }
        return p;
      })
    );
  };

  const trendingTopics = [
    { tag: "#BuildInPublic", posts: "1.4k posts" },
    { tag: "#NextJS16", posts: "890 posts" },
    { tag: "#RustGang", posts: "640 posts" },
    { tag: "#ETHIndia2026", posts: "520 posts" },
    { tag: "#pgvector", posts: "310 posts" },
  ];

  const suggestedBuilders = [
    { name: "Tanvi Kulkarni", handle: "tanvi_kulkarni", campus: "BITS Pilani", avatar: "TK" },
    { name: "Tushar Somani", handle: "tushar_somani", campus: "IIIT Hyderabad", avatar: "TS" },
    { name: "Ananya Vasisht", handle: "ananya_vasisht", campus: "IISc Bangalore", avatar: "AV" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-300">
      
      {/* LEFT 2 COLUMNS: TWITTER/X STYLE FEED */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* FEED HEADER & TAB SWITCHER */}
        <div className="border-b border-zinc-900/90 pb-4 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Community</h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">
              Developer feed. Share project updates, ask for feedback, and connect with student builders.
            </p>
          </div>

          <div className="flex gap-2 font-mono text-xs border-b border-zinc-900 pb-1">
            <button
              onClick={() => setActiveTab("foryou")}
              className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
                activeTab === "foryou" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              For You 🔥
            </button>
            <button
              onClick={() => setActiveTab("launches")}
              className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
                activeTab === "launches" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Project Launches 🚀
            </button>
            <button
              onClick={() => setActiveTab("campus")}
              className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
                activeTab === "campus" ? "border-white text-white" : "border-transparent text-zinc-500 hover:text-zinc-300"
              }`}
            >
              My Campus ({user.university}) 🏫
            </button>
          </div>
        </div>

        {/* POST COMPOSER ("What are you building today?") */}
        <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center uppercase shrink-0">
              {getInitials(user.name)}
            </div>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Hey! What are you building today? Share project updates, ask for code feedback..."
              rows={3}
              className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none font-sans resize-none pt-2"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-900/90 font-mono text-xs">
            <div className="flex items-center gap-3 text-zinc-400">
              <button type="button" className="hover:text-white flex items-center gap-1 cursor-pointer">
                <span>📷 Image</span>
              </button>
              <button type="button" className="hover:text-white flex items-center gap-1 cursor-pointer">
                <span>💻 Code Snippet</span>
              </button>
              <button type="button" className="hover:text-white flex items-center gap-1 cursor-pointer">
                <span>🚀 Tag Project</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!newPostText.trim()}
              className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                newPostText.trim()
                  ? "bg-white text-black shadow-sm"
                  : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
              }`}
            >
              Ship Post 🚀
            </button>
          </div>
        </form>

        {/* FEED POSTS LIST */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700 transition-all space-y-3.5 group"
            >
              {/* Post Author Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center uppercase shrink-0">
                    {post.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm tracking-tight">{post.authorName}</span>
                      <span className="text-xs font-mono text-zinc-500">@{post.authorHandle}</span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-500">
                      {post.campus} • {post.time}
                    </div>
                  </div>
                </div>

                {post.projectTag && (
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-300 font-bold">
                    🚀 {post.projectTag}
                  </span>
                )}
              </div>

              {/* Post Content */}
              <p className="text-xs sm:text-sm text-zinc-200 font-sans leading-relaxed">
                {post.content}
              </p>

              {/* Code Snippet Box (if present) */}
              {post.codeSnippet && (
                <div className="p-3.5 rounded-xl bg-black border border-zinc-800/90 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <pre>{post.codeSnippet}</pre>
                </div>
              )}

              {/* Interactive Actions (Like, Repost, Reply, DM Builder) */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-900/90 font-mono text-xs text-zinc-400">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.isLiked ? "text-rose-400 font-bold" : "hover:text-rose-400"
                    }`}
                  >
                    <span>{post.isLiked ? "❤️" : "🤍"}</span>
                    <span>{post.likes}</span>
                  </button>

                  <button
                    onClick={() => handleToggleRepost(post.id)}
                    className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                      post.isReposted ? "text-emerald-400 font-bold" : "hover:text-emerald-400"
                    }`}
                  >
                    <span>🔁</span>
                    <span>{post.reposts}</span>
                  </button>

                  <button className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                    <span>💬</span>
                    <span>{post.replies}</span>
                  </button>
                </div>

                {/* Direct Message Builder Button */}
                <button
                  onClick={onNavigateToProfile}
                  className="px-3 py-1 rounded-xl bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 text-zinc-300 text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <span>DM Builder</span>
                  <span>📩</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR: TRENDING TOPICS & SUGGESTED BUILDERS */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* TRENDING TECH HASHTAGS */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3 font-mono text-xs">
          <div className="text-sm font-bold text-white tracking-tight border-b border-zinc-900/90 pb-2">
            Trending Tech Topics 🔥
          </div>

          <div className="space-y-2.5">
            {trendingTopics.map((topic, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-zinc-800/60 hover:border-zinc-700 transition-all cursor-pointer">
                <div>
                  <div className="text-white font-bold">{topic.tag}</div>
                  <div className="text-[10px] text-zinc-500">{topic.posts}</div>
                </div>
                <span className="text-zinc-600">➔</span>
              </div>
            ))}
          </div>
        </div>

        {/* WHO TO FOLLOW / CONNECT */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-3 font-mono text-xs">
          <div className="text-sm font-bold text-white tracking-tight border-b border-zinc-900/90 pb-2">
            Builders to Connect 👥
          </div>

          <div className="space-y-3">
            {suggestedBuilders.map((b, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-black/60 border border-zinc-800/60">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                    {b.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-white font-bold truncate text-xs">{b.name}</div>
                    <div className="text-[10px] text-zinc-500 truncate">@{b.handle} • {b.campus}</div>
                  </div>
                </div>

                <button
                  onClick={onNavigateToProfile}
                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 text-black font-bold text-[11px] transition-all cursor-pointer shrink-0"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
