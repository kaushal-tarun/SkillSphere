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

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const [posts, setPosts] = useState<PostItem[]>([
    {
      id: "p1",
      authorName: "Tanvi Kulkarni",
      authorHandle: "tanvi_kulkarni",
      campus: "BITS Pilani '25",
      avatar: "TK",
      time: "25m ago",
      content: "Just pushed Nexa Study Engine v2 at 3:45 AM! Rewriting Notion sync algorithms for instant flashcard indexing.",
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
      content: "Rewrote our WebSockets AST parser in Rust and latency dropped from 140ms to 12ms! Who wants to test the multiplayer editor?",
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
      content: "Built KnowledgeVault AI using Next.js 16 + pgvector. It indexes 500-page engineering PDFs and gives instant Q&A with exact citations.",
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
      content: "ETHIndia hackathon squad application is open! Looking for 1 solid frontend dev who knows Next.js & Tailwind.",
      likes: 67,
      reposts: 15,
      replies: 22,
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
      content: newPostText,
      likes: 0,
      reposts: 0,
      replies: 0,
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
      
      {/* LEFT 2 COLUMNS: FEED */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* FEED HEADER & TAB SWITCHER */}
        <div className="border-b border-[#e8e2d8] pb-4 space-y-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900">Community</h1>
            <p className="text-xs font-mono text-zinc-500 mt-1">
              Developer feed. Share project updates, ask for feedback, and connect with student builders.
            </p>
          </div>

          <div className="flex gap-2 font-mono text-xs border-b border-[#e8e2d8] pb-1">
            <button
              onClick={() => setActiveTab("foryou")}
              className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
                activeTab === "foryou" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab("launches")}
              className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
                activeTab === "launches" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              Project Launches
            </button>
            <button
              onClick={() => setActiveTab("campus")}
              className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
                activeTab === "campus" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              My Campus ({user.university})
            </button>
          </div>
        </div>

        {/* POST COMPOSER */}
        <form onSubmit={handleCreatePost} className="p-5 rounded-2xl bg-white border border-[#e8e2d8] text-zinc-900 shadow-sm space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center uppercase shrink-0">
              {getInitials(user.name)}
            </div>
            <textarea
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="Hey! What are you building today? Share project updates, ask for code feedback..."
              rows={3}
              className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none font-sans resize-none pt-2"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-zinc-100 font-mono text-xs">
            <div className="flex items-center gap-3 text-zinc-500">
              <button type="button" className="hover:text-zinc-900 flex items-center gap-1 cursor-pointer">
                <span>Image</span>
              </button>
              <button type="button" className="hover:text-zinc-900 flex items-center gap-1 cursor-pointer">
                <span>Code Snippet</span>
              </button>
              <button type="button" className="hover:text-zinc-900 flex items-center gap-1 cursor-pointer">
                <span>Tag Project</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={!newPostText.trim()}
              className={`px-4 py-1.5 rounded-xl font-bold font-mono transition-all cursor-pointer ${
                newPostText.trim()
                  ? "bg-zinc-900 text-white shadow-sm hover:bg-black"
                  : "bg-zinc-100 text-zinc-400 border border-[#e8e2d8]"
              }`}
            >
              Post Update
            </button>
          </div>
        </form>

        {/* POSTS FEED */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-white border border-[#e8e2d8] text-zinc-900 shadow-sm space-y-3.5 hover:border-zinc-400 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                    {post.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900">{post.authorName}</span>
                      <span className="text-xs font-mono text-zinc-500">@{post.authorHandle}</span>
                    </div>
                    <div className="text-[10px] font-mono text-zinc-500">
                      {post.campus} • {post.time}
                    </div>
                  </div>
                </div>

                {post.projectTag && (
                  <span className="px-2.5 py-0.5 rounded bg-[#f4efe6] border border-[#e2dacd] text-[10px] font-mono text-zinc-800 font-bold">
                    {post.projectTag}
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-zinc-800 font-sans leading-relaxed">
                {post.content}
              </p>

              {post.codeSnippet && (
                <div className="p-3.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] font-mono text-[11px] text-zinc-900 overflow-x-auto shadow-inner">
                  <pre>{post.codeSnippet}</pre>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-zinc-100 font-mono text-xs text-zinc-500">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1.5 hover:text-zinc-900 transition-colors cursor-pointer ${
                    post.isLiked ? "text-zinc-900 font-bold" : ""
                  }`}
                >
                  <span>{post.likes} Likes</span>
                </button>

                <button
                  onClick={() => handleToggleRepost(post.id)}
                  className={`flex items-center gap-1.5 hover:text-zinc-900 transition-colors cursor-pointer ${
                    post.isReposted ? "text-zinc-900 font-bold" : ""
                  }`}
                >
                  <span>{post.reposts} Reposts</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <span>{post.replies} Replies</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDEBAR: TRENDING & BUILDERS */}
      <div className="lg:col-span-1 space-y-6">
        <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] text-zinc-900 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Trending Topics</h3>
          <div className="space-y-3">
            {trendingTopics.map((topic) => (
              <div key={topic.tag} className="flex items-center justify-between p-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
                <span className="font-bold text-zinc-900">{topic.tag}</span>
                <span className="text-[10px] text-zinc-500">{topic.posts}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] text-zinc-900 shadow-sm space-y-4 font-mono text-xs">
          <h3 className="text-sm font-bold text-zinc-900 tracking-tight">Suggested Builders</h3>
          <div className="space-y-3">
            {suggestedBuilders.map((builder) => (
              <div key={builder.handle} className="flex items-center justify-between p-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center">
                    {builder.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-zinc-900">{builder.name}</div>
                    <div className="text-[10px] text-zinc-500">@{builder.handle} • {builder.campus}</div>
                  </div>
                </div>
                <button className="px-2.5 py-1 rounded bg-zinc-900 text-white text-[10px] font-bold hover:bg-black transition-all cursor-pointer">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
