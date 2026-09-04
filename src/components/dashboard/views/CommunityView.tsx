"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile, ProjectItem } from "@/types/dashboard";

interface CommunityViewProps {
  user: UserProfile;
  onNavigateToProfile?: () => void;
  onSelectProject?: (project: ProjectItem) => void;
  onNavigateToUser?: (username: string) => void;
}

interface CommentItem {
  id: string;
  authorName: string;
  authorHandle: string;
  avatar?: string;
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
  images?: string[];
  codeSnippet?: string;
  likes: number;
  reposts: number;
  isLiked?: boolean;
  isReposted?: boolean;
  projectTag?: string;
  comments: CommentItem[];
}

export function CommunityView({ user, onNavigateToProfile, onSelectProject, onNavigateToUser }: CommunityViewProps) {
  const [activeTab, setActiveTab] = useState<"foryou" | "launches" | "campus" | "trending">("foryou");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [postImages, setPostImages] = useState<string[]>([]);
  const [selectedProjectTag, setSelectedProjectTag] = useState<string | null>(null);
  const [isProjectTagDropdownOpen, setIsProjectTagDropdownOpen] = useState(false);
  const [userProjects, setUserProjects] = useState<ProjectItem[]>([]);
  const [openCommentInput, setOpenCommentInput] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const imageInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => {
    if (!name) return "US";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Load user's own published projects for Tag Project dropdown
  useEffect(() => {
    async function loadUserProjects() {
      if (!user.username) return;
      try {
        const res = await fetch(`/api/projects?username=${encodeURIComponent(user.username)}&scope=user`);
        if (res.ok) {
          const data = await res.json();
          if (data.projects && Array.isArray(data.projects)) {
            setUserProjects(data.projects);
          }
        }
      } catch (e) {
        console.error("Failed to load user projects for tagging", e);
      }
    }
    loadUserProjects();
  }, [user.username]);

  // Load posts
  useEffect(() => {
    async function loadCommunityPosts() {
      setIsLoadingPosts(true);
      try {
        const res = await fetch(`/api/posts?username=${encodeURIComponent(user.username)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.posts && Array.isArray(data.posts)) {
            let userReposts: Record<string, boolean> = {};
            try {
              userReposts = JSON.parse(localStorage.getItem(`skillsphere_reposts_${user.username.toLowerCase()}`) || "{}");
            } catch (e) {}

            const merged = data.posts.map((p: PostItem) => ({
              ...p,
              isReposted: !!userReposts[p.id],
            }));
            setPosts(merged);
          }
        }
      } catch (e) {
        console.error("Failed to load community posts from PostgreSQL", e);
      } finally {
        setIsLoadingPosts(false);
      }
    }
    loadCommunityPosts();
  }, [user.username]);

  // Helper to compress an image file to canvas JPEG (~40KB)
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event.target?.result) return resolve("");
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.7));
          } else {
            resolve(event.target!.result as string);
          }
        };
        img.onerror = () => resolve("");
        img.src = event.target?.result as string;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  // Handle Post Images Upload & Canvas Compression (Up to 2 images)
  const handlePostImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const availableSlots = 2 - postImages.length;
    if (availableSlots <= 0) {
      alert("You can only attach up to 2 images per post.");
      if (imageInputRef.current) imageInputRef.current.value = "";
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    if (files.length > availableSlots) {
      alert(`Only ${availableSlots} more image${availableSlots > 1 ? "s" : ""} can be added. Maximum 2 images allowed.`);
    }

    const newCompressedImages: string[] = [];
    for (const file of filesToProcess) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`Image "${file.name}" is over 10MB.`);
        continue;
      }
      const dataUrl = await compressImageFile(file);
      if (dataUrl) {
        newCompressedImages.push(dataUrl);
      }
    }

    if (newCompressedImages.length > 0) {
      setPostImages((prev) => [...prev, ...newCompressedImages].slice(0, 2));
    }

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setPostImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPosting || !newPostText.trim()) return;

    setIsPosting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newPostText,
          images: postImages,
          projectTag: selectedProjectTag || undefined,
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
      setPostImages([]);
      setSelectedProjectTag(null);
      setIsProjectTagDropdownOpen(false);
      setIsPosting(false);
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

  const handleToggleLike = async (id: string) => {
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

    try {
      await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: id,
          username: user.username,
        }),
      });
    } catch (e) {
      console.error("Failed to update post like in PostgreSQL", e);
    }
  };

  const handleToggleRepost = async (id: string) => {
    const storageKey = `skillsphere_reposts_${user.username.toLowerCase()}`;
    let userReposts: Record<string, boolean> = {};
    try {
      userReposts = JSON.parse(localStorage.getItem(storageKey) || "{}");
    } catch (e) {}

    const currentlyReposted = !!userReposts[id];
    const nextReposted = !currentlyReposted;

    if (nextReposted) {
      userReposts[id] = true;
    } else {
      delete userReposts[id];
    }
    localStorage.setItem(storageKey, JSON.stringify(userReposts));

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            reposts: nextReposted ? p.reposts + 1 : Math.max(0, p.reposts - 1),
            isReposted: nextReposted,
          };
        }
        return p;
      })
    );

    try {
      await fetch("/api/reposts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId: id,
          action: nextReposted ? "INCREMENT" : "DECREMENT",
        }),
      });
    } catch (e) {
      console.error("Failed to update repost in PostgreSQL", e);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const optimisticComment: CommentItem = {
      id: `tmp_${Date.now()}`,
      authorName: user.name,
      authorHandle: user.username,
      avatar: user.avatar,
      text: text.trim(),
      time: "Just now",
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, optimisticComment],
          };
        }
        return p;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));

    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          text: text.trim(),
          username: user.username,
        }),
      });
    } catch (e) {
      console.error("Failed to post comment to PostgreSQL", e);
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: p.comments.filter((c) => c.id !== commentId),
          };
        }
        return p;
      })
    );

    try {
      await fetch(`/api/comments?id=${encodeURIComponent(commentId)}`, {
        method: "DELETE",
      });
    } catch (e) {
      console.error("Failed to delete comment in PostgreSQL", e);
    }
  };

  const handleCopyComment = (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      }
    } catch (e) {
      console.warn("Failed to copy comment text", e);
    }
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
                  Clear filter
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
          <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono font-bold text-xs flex items-center justify-center uppercase shrink-0 overflow-hidden">
            {user.avatar && (user.avatar.startsWith("data:") || user.avatar.startsWith("http") || user.avatar.startsWith("/")) ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(user.name)
            )}
          </div>
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="Hey! What are you building today? Share project updates, ask for code feedback..."
            rows={3}
            className="w-full bg-transparent text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none font-sans resize-none pt-2"
          />
        </div>

        {/* ATTACHED IMAGES PREVIEW (UP TO 2 IMAGES) */}
        {postImages.length > 0 && (
          <div className={postImages.length === 1 ? "relative rounded-xl overflow-hidden border border-[#e2dacd] max-h-56 w-fit shadow-xs bg-zinc-50" : "grid grid-cols-2 gap-2 max-w-lg"}>
            {postImages.map((imgSrc, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden border border-[#e2dacd] bg-zinc-50 shadow-xs">
                <img
                  src={imgSrc}
                  alt={`Attachment ${idx + 1}`}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center text-xs font-bold hover:bg-black transition-all cursor-pointer shadow-sm"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAGGED PROJECT PREVIEW BADGE */}
        {selectedProjectTag && (
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-zinc-500 font-bold">Tagged Project:</span>
            <span className="px-2.5 py-1 rounded-xl bg-zinc-900 text-white font-bold flex items-center gap-1.5 shadow-xs">
              <span>@{selectedProjectTag}</span>
              <button
                type="button"
                onClick={() => setSelectedProjectTag(null)}
                className="hover:text-red-400 cursor-pointer font-extrabold"
              >
                ✕
              </button>
            </span>
          </div>
        )}

        {/* HIDDEN FILE INPUT FOR IMAGE UPLOAD (MULTIPLE, MAX 2) */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handlePostImageUpload}
        />

        <div className="flex items-center justify-between pt-3 border-t border-zinc-100 font-mono text-xs">
          <div className="flex items-center gap-3 text-zinc-500 relative">
            <button
              type="button"
              onClick={() => {
                if (postImages.length >= 2) {
                  alert("You can attach a maximum of 2 images per post.");
                  return;
                }
                imageInputRef.current?.click();
              }}
              disabled={postImages.length >= 2}
              className={`flex items-center gap-1.5 font-bold transition-colors ${
                postImages.length >= 2
                  ? "text-zinc-300 cursor-not-allowed"
                  : "hover:text-zinc-900 cursor-pointer"
              }`}
              title={postImages.length >= 2 ? "Maximum 2 images reached" : "Attach images (up to 2)"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span>{postImages.length > 0 ? `Images (${postImages.length}/2)` : "Images (max 2)"}</span>
            </button>

            {/* TAG PROJECT POPOVER BUTTON & DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProjectTagDropdownOpen(!isProjectTagDropdownOpen)}
                className="hover:text-zinc-900 flex items-center gap-1.5 cursor-pointer font-bold transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                </svg>
                <span>Tag Project</span>
              </button>

              {isProjectTagDropdownOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-56 p-2 rounded-2xl bg-white border border-[#e8e2d8] shadow-xl z-40 space-y-1 font-mono text-xs animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] text-zinc-400 font-bold px-2 py-1 uppercase">Select your project</div>
                  {userProjects.length > 0 ? (
                    userProjects.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setSelectedProjectTag(p.name);
                          setIsProjectTagDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-[#f4efe6] text-zinc-900 font-bold truncate transition-colors cursor-pointer"
                      >
                        @{p.name}
                      </button>
                    ))
                  ) : (
                    <div className="p-2 text-[11px] text-zinc-400 italic">No projects published yet</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPosting || !newPostText.trim()}
            className={`px-4 py-1.5 rounded-xl font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
              newPostText.trim() && !isPosting
                ? "bg-zinc-900 text-white shadow-sm hover:bg-black"
                : "bg-zinc-100 text-zinc-400 border border-[#e8e2d8]"
            }`}
          >
            {isPosting && (
              <svg className="w-3.5 h-3.5 animate-spin text-zinc-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            <span>{isPosting ? "Posting..." : "Post Update"}</span>
          </button>
        </div>
      </form>

      {/* POSTS FEED */}
      <div className="space-y-4">
        {isLoadingPosts ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#ebe5da]" />
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-28 rounded bg-[#ebe5da]" />
                        <div className="h-3 w-20 rounded bg-[#ebe5da]" />
                      </div>
                      <div className="h-2.5 w-32 rounded bg-[#ebe5da]" />
                    </div>
                  </div>
                  <div className="h-6 w-20 rounded bg-[#ebe5da]" />
                </div>
                <div className="space-y-2 pt-1">
                  <div className="h-3.5 w-full rounded bg-[#ebe5da]" />
                  <div className="h-3.5 w-5/6 rounded bg-[#ebe5da]" />
                  <div className="h-3.5 w-2/3 rounded bg-[#ebe5da]" />
                </div>
                <div className="flex items-center gap-6 pt-2 border-t border-zinc-100">
                  <div className="h-5 w-16 rounded bg-[#ebe5da]" />
                  <div className="h-5 w-20 rounded bg-[#ebe5da]" />
                  <div className="h-5 w-16 rounded bg-[#ebe5da]" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white border border-[#e8e2d8] text-xs font-mono text-zinc-500">
            No posts found in this category yet. Be the first to share an update!
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentOpen = !!openCommentInput[post.id];

          return (
            <div
              key={post.id}
              className="p-5 rounded-2xl bg-white border border-[#e8e2d8] text-zinc-900 shadow-sm space-y-3.5 hover:border-zinc-400 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={() => onNavigateToUser && onNavigateToUser(post.authorHandle)}
                  className="flex items-center gap-3 cursor-pointer group/author"
                >
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 uppercase overflow-hidden group-hover/author:opacity-80 transition-opacity">
                    {post.authorHandle.toLowerCase() === user.username.toLowerCase() && user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : post.avatar && (post.avatar.startsWith("data:") || post.avatar.startsWith("http")) ? (
                      <img src={post.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      post.avatar
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-zinc-900 group-hover/author:underline">{post.authorName}</span>
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
                    <button
                      type="button"
                      onClick={() => {
                        if (!onSelectProject) return;
                        const found = userProjects.find((p) => p.name.toLowerCase() === post.projectTag?.toLowerCase());
                        if (found) {
                          onSelectProject(found);
                        } else {
                          onSelectProject({
                            id: `proj_${post.projectTag}`,
                            name: post.projectTag || "",
                            description: "Community project tagged in post.",
                            progress: 100,
                            updatedAt: "Just now",
                            visibility: "Public",
                            stars: 0,
                            forks: 0,
                            commits: 0,
                            daysActive: 1,
                            likes: 0,
                            status: "Active",
                            tech: [],
                            github: "",
                          });
                        }
                      }}
                      className="px-2.5 py-0.5 rounded bg-zinc-900 text-white text-[10px] font-mono font-bold shadow-xs hover:bg-black cursor-pointer transition-all"
                    >
                      @{post.projectTag}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-800 font-sans leading-relaxed">
                {post.content}
              </p>

              {/* POST ATTACHED IMAGES (SUPPORT 1 OR 2 IMAGES) */}
              {(() => {
                const displayImages = post.images && post.images.length > 0 
                  ? post.images 
                  : post.image 
                    ? [post.image] 
                    : [];

                if (displayImages.length === 0) return null;

                if (displayImages.length === 1) {
                  return (
                    <div className="rounded-xl overflow-hidden border border-[#e2dacd] max-h-72 w-fit shadow-xs bg-zinc-50">
                      <img src={displayImages[0]} alt="Post media" className="w-full max-h-72 object-cover rounded-xl" />
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden max-w-2xl">
                    {displayImages.slice(0, 2).map((imgUrl, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-[#e2dacd] shadow-xs bg-zinc-50 h-48 sm:h-56">
                        <img src={imgUrl} alt={`Post media ${i + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                );
              })()}

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
                    post.isReposted ? "text-emerald-600 font-bold" : "text-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  <svg className={`w-4 h-4 ${post.isReposted ? "text-emerald-600 stroke-[2.2]" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.75" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{post.reposts}</span>
                </button>

                <button
                  onClick={() =>
                    setOpenCommentInput((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 007.5 20.25c.677 0 1.341-.122 1.968-.355.617-.229 1.306-.184 1.884.093A8.932 8.932 0 0012 20.25z" />
                  </svg>
                  <span>{post.comments ? post.comments.length : 0} Comments</span>
                </button>
              </div>

              {/* MODERN UPGRADED COMMENTS SECTION */}
              {isCommentOpen && (
                <div className="pt-4 border-t border-zinc-100 space-y-3.5 animate-in fade-in duration-200">
                  {/* Discussion Header */}
                  <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 px-0.5">
                    <span className="font-bold text-zinc-700 uppercase tracking-wider">
                      Discussion ({post.comments ? post.comments.length : 0})
                    </span>
                    {post.comments && post.comments.length > 3 && (
                      <span className="text-[10px] text-zinc-400">Scroll to view all</span>
                    )}
                  </div>

                  {/* Comment Input Bar */}
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-mono text-[10px] font-bold flex items-center justify-center uppercase shrink-0 overflow-hidden mt-0.5 shadow-2xs">
                      {user.avatar && (user.avatar.startsWith("data:") || user.avatar.startsWith("http") || user.avatar.startsWith("/")) ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <div className="flex-1 flex gap-2">
                      <input
                        type="text"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment(post.id);
                          }
                        }}
                        placeholder="Write a comment... (Press Enter to post)"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#f8f5ee] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        disabled={!commentInputs[post.id]?.trim()}
                        className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black disabled:bg-zinc-200 disabled:text-zinc-400 disabled:cursor-not-allowed text-white font-mono text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Reply
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Compact Comments List */}
                  {post.comments && post.comments.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto pr-1 space-y-2 font-mono text-xs divide-y-0">
                      {post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 rounded-xl bg-[#fbf9f5] border border-[#e8e2d8] hover:border-[#ded5c7] transition-all space-y-1.5 group/comment"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <div
                              onClick={() => onNavigateToUser && onNavigateToUser(comment.authorHandle)}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <div className="w-5 h-5 rounded-md bg-zinc-800 text-white font-bold text-[9px] flex items-center justify-center uppercase shrink-0 overflow-hidden">
                                {comment.avatar && (comment.avatar.startsWith("data:") || comment.avatar.startsWith("http")) ? (
                                  <img src={comment.avatar} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  (comment.authorName || comment.authorHandle).slice(0, 2).toUpperCase()
                                )}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-zinc-900 hover:underline">{comment.authorName}</span>
                                <span className="text-[10px] text-zinc-400 font-normal">@{comment.authorHandle}</span>
                                <span className="text-[10px] text-zinc-400">•</span>
                                <span className="text-[10px] text-zinc-400">{comment.time}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleCopyComment(comment.text)}
                                className="text-zinc-400 hover:text-zinc-800 text-[10px] font-mono hover:underline cursor-pointer transition-colors"
                                title="Copy comment"
                              >
                                Copy
                              </button>
                              {comment.authorHandle.toLowerCase() === user.username.toLowerCase() && (
                                <button
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                  className="text-red-500 hover:text-red-700 text-[10px] font-mono hover:underline cursor-pointer font-bold transition-colors"
                                  title="Delete comment"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-zinc-800 font-sans text-xs pl-7 leading-relaxed break-words whitespace-pre-wrap">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-2.5 text-center text-zinc-400 font-mono text-[11px]">
                      No comments yet. Start the discussion!
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }))}
      </div>
    </div>
  );
}
