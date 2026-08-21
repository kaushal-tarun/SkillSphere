"use client";

import React, { useState, useEffect } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";

interface CommunityViewProps {
  user: UserProfile;
  onNavigateToProfile?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
}

interface CommentItem {
  id: string;
  authorName: string;
  authorHandle: string;
  text: string;
  time: string;
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
  isLiked?: boolean;
  isReposted?: boolean;
  projectTag?: string;
  comments: CommentItem[];
}

export function CommunityView({ user, onNavigateToProfile, onSelectProject }: CommunityViewProps) {
  const [activeTab, setActiveTab] = useState<"foryou" | "launches" | "campus" | "trending">("foryou");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [openCommentInput, setOpenCommentInput] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const [posts, setPosts] = useState<PostItem[]>([]);

  useEffect(() => {
    async function loadCommunityPosts() {
      try {
        const res = await fetch("/api/posts");
        if (res.ok) {
          const data = await res.json();
          if (data.posts && Array.isArray(data.posts)) {
            setPosts(data.posts);
          }
        }
      } catch (e) {
        console.error("Failed to load community posts from PostgreSQL", e);
      }
    }
    loadCommunityPosts();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPostText,
          username: user.username,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.post) {
          setPosts((prev) => [data.post, ...prev]);
        }
      }
    } catch (e) {
      console.error("Failed to save post to PostgreSQL", e);
    } finally {
      setNewPostText("");
    }
  };

  const handleDeletePost = async (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    try {
      await fetch(`/api/posts?id=${encodeURIComponent(postId)}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to delete post in PostgreSQL", e);
    }
  };

  const handleToggleLike = (id: string) => {
    const updated = posts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1,
          isLiked: !p.isLiked,
        };
      }
      return p;
    });
    setPosts(updated);
  };

  const handleToggleRepost = (id: string) => {
    const updated = posts.map((p) => {
      if (p.id === id) {
        return {
          ...p,
          reposts: p.isReposted ? p.reposts - 1 : p.reposts + 1,
          isReposted: !p.isReposted,
        };
      }
      return p;
    });
    setPosts(updated);
  };

  const handleAddComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      authorName: user.name,
      authorHandle: user.username,
      text: text.trim(),
      time: "Just now",
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, newComment],
        };
      }
      return p;
    });

    setPosts(updated);
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const trendingTopics = [
    { tag: "#BuildInPublic", posts: "1.4k posts" },
    { tag: "#NextJS16", posts: "890 posts" },
    { tag: "#RustGang", posts: "640 posts" },
    { tag: "#ETHIndia2026", posts: "520 posts" },
    { tag: "#pgvector", posts: "310 posts" },
  ];

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "trending" && selectedTopic) {
      return post.content.toLowerCase().includes(selectedTopic.toLowerCase());
    }
    if (activeTab === "launches") {
      return post.projectTag !== undefined;
    }
    if (activeTab === "campus") {
      return post.campus.toLowerCase().includes(user.university.toLowerCase());
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* TAB SWITCHER WITH CUSTOM STYLED TRENDING TOPICS DROPDOWN BUTTON */}
      <div className="border-b border-[#e8e2d8] pb-1 flex flex-wrap items-center gap-2 font-mono text-xs">
        <button
          onClick={() => {
            setActiveTab("foryou");
            setSelectedTopic("");
            setIsDropdownOpen(false);
          }}
          className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
            activeTab === "foryou" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          For You
        </button>
        <button
          onClick={() => {
            setActiveTab("launches");
            setSelectedTopic("");
            setIsDropdownOpen(false);
          }}
          className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
            activeTab === "launches" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          Project Launches
        </button>
        <button
          onClick={() => {
            setActiveTab("campus");
            setSelectedTopic("");
            setIsDropdownOpen(false);
          }}
          className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer ${
            activeTab === "campus" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
          }`}
        >
          My Campus ({user.university})
        </button>

        {/* SLEEK CUSTOM TRENDING TOPICS POPOVER BUTTON */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`pb-2.5 px-3 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "trending" ? "border-zinc-900 text-zinc-900" : "border-transparent text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <span>{selectedTopic || "Trending Topics"}</span>
            <span className={`text-[10px] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}>▾</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 p-1.5 rounded-2xl bg-white border border-[#e8e2d8] shadow-lg z-30 font-mono text-xs space-y-1 animate-in fade-in zoom-in-95 duration-150">
              {selectedTopic && (
                <button
                  onClick={() => {
                    setSelectedTopic("");
                    setActiveTab("foryou");
                    setIsDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-zinc-100 text-zinc-500 text-[11px] cursor-pointer"
                >
                  ✕ Clear Topic Filter
                </button>
              )}
              {trendingTopics.map((topic) => (
                <button
                  key={topic.tag}
                  onClick={() => {
                    setSelectedTopic(topic.tag);
                    setActiveTab("trending");
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                    selectedTopic === topic.tag ? "bg-zinc-900 text-white font-bold" : "hover:bg-[#f4efe6] text-zinc-800"
                  }`}
                >
                  <span className="font-bold">{topic.tag}</span>
                  <span className={`text-[10px] ${selectedTopic === topic.tag ? "text-zinc-300" : "text-zinc-500"}`}>{topic.posts}</span>
                </button>
              ))}
            </div>
          )}
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
        {filteredPosts.map((post) => {
          const isCommentOpen = !!openCommentInput[post.id];

          return (
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

                <div className="flex items-center gap-2">
                  {post.authorHandle.toLowerCase() === user.username.toLowerCase() && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="px-2 py-0.5 rounded text-[10px] font-mono text-red-600 hover:text-red-800 font-bold hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  )}
                  {post.projectTag && (
                    <span className="px-2.5 py-0.5 rounded bg-[#f4efe6] border border-[#e2dacd] text-[10px] font-mono text-zinc-800 font-bold">
                      {post.projectTag}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-800 font-sans leading-relaxed">
                {post.content}
              </p>

              {post.codeSnippet && (
                <div className="p-3.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] font-mono text-[11px] text-zinc-900 overflow-x-auto shadow-inner">
                  <pre>{post.codeSnippet}</pre>
                </div>
              )}

              {/* LIKES, REPOSTS, & COMMENT ACTION BAR WITH SVG ICONS */}
              <div className="flex items-center gap-6 pt-3 border-t border-zinc-100 font-mono text-xs">
                <button
                  onClick={() => handleToggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    post.isLiked ? "text-zinc-900 font-bold" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <svg className={`w-4 h-4 ${post.isLiked ? "fill-zinc-900 text-zinc-900" : "fill-none stroke-current"}`} strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likes}</span>
                </button>

                <button
                  onClick={() => handleToggleRepost(post.id)}
                  className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                    post.isReposted ? "text-zinc-900 font-bold" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M4.5 12c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l-2.25 2.25M4.5 12l2.25-2.25m15 2.25l2.25 2.25m-2.25-2.25l-2.25-2.25" />
                  </svg>
                  <span>{post.reposts}</span>
                </button>

                <button
                  onClick={() => setOpenCommentInput((prev) => ({ ...prev, [post.id]: !prev[post.id] }))}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 0012 20.25z" />
                  </svg>
                  <span>{post.comments.length} Comments</span>
                </button>
              </div>

              {/* COMMENTS THREAD & INPUT */}
              {isCommentOpen && (
                <div className="pt-3 border-t border-zinc-100 space-y-3 font-mono text-xs animate-in fade-in duration-200">
                  {post.comments.length > 0 && (
                    <div className="space-y-2">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="p-2.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-zinc-900">{comm.authorName} <span className="text-zinc-500 font-normal">@{comm.authorHandle}</span></span>
                            <span className="text-[9px] text-zinc-500">{comm.time}</span>
                          </div>
                          <p className="text-xs text-zinc-800 font-sans">{comm.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[post.id] || ""}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddComment(post.id, commentInputs[post.id] || "");
                        }
                      }}
                      placeholder="Write a comment..."
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans"
                    />
                    <button
                      onClick={() => handleAddComment(post.id, commentInputs[post.id] || "")}
                      className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-black transition-all cursor-pointer"
                    >
                      Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
