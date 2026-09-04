"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "@/types/dashboard";

interface NewProjectModalProps {
  isOpen: boolean;
  user?: UserProfile;
  onClose: () => void;
  onSubmit: (projectData: {
    name: string;
    description: string;
    tech: string;
    github: string;
    problemSolved?: string;
    inspiration?: string;
    biggestChallenge?: string;
    teamType?: "solo" | "team";
    teamMembers?: string[];
    screenshots?: string[];
  }) => void;
}

// Alphabetical list of popular technologies
const ALL_POPULAR_TECH = [
  "Angular", "Anthropic Claude", "Apache Kafka", "Astro", "AWS", "Azure",
  "Bun", "C", "C++", "C#", "Cassandra", "ClickHouse", "Clojure", "CockroachDB", "CSS3", "CUDA",
  "Dart", "Deno", "Django", "Docker", "Elasticsearch", "Elixir", "Expo", "Express.js",
  "FastAPI", "Firebase", "Flask", "Flutter", "GCP", "Git", "Go", "GraphQL", "gRPC",
  "Haskell", "HTML5", "HuggingFace", "Ionic", "Java", "JavaScript", "KMP", "Kotlin", "Kubernetes",
  "LangChain", "Laravel", "LlamaIndex", "MongoDB", "MySQL", "Neo4j", "Neon DB", "NestJS", "Next.js", "Node.js", "Nuxt.js", "NumPy",
  "OpenAI API", "Pandas", "PHP", "Pinecone", "PostgreSQL", "Prisma", "Python", "PyTorch",
  "React", "React Native", "Redis", "Ruby", "Ruby on Rails", "Rust",
  "Scala", "Scikit-Learn", "SolidJS", "Spring Boot", "SQLite", "Supabase", "Svelte", "SvelteKit", "Swift", "SwiftUI",
  "TailwindCSS", "TensorFlow", "Three.js", "tRPC", "TypeScript",
  "Vercel", "Vite", "Vue.js", "WebAssembly", "Zig"
].sort((a, b) => a.localeCompare(b));

// List of non-technical food/nonsense items to block in Tech Stack
const NON_TECH_WORDS = new Set([
  "pizza", "burger", "fries", "pasta", "sandwich", "food", "soda", "cookie",
  "cake", "donut", "junk", "apple", "banana", "cat", "dog", "garbage", "trash", "random"
]);

// Profanity / Abusive Words Filter List
const ABUSIVE_WORDS = [
  "fuck", "shit", "bitch", "asshole", "bastard", "crap", "dick", "pussy",
  "cock", "slut", "whore", "idiot", "stupid", "dumb", "hate", "scam",
  "nigger", "faggot", "chink", "retard", "cunt"
];

function containsAbusiveWords(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return ABUSIVE_WORDS.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lower);
  });
}

function isValidTechItem(item: string): boolean {
  const normalized = item.toLowerCase().trim();
  if (!normalized) return true;
  return !NON_TECH_WORDS.has(normalized);
}

function isValidGithubLink(url: string): boolean {
  if (!url || !url.trim()) return true;
  const trimmed = url.trim();
  const GITHUB_URL_REGEX = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\/.*)?$/i;
  return GITHUB_URL_REGEX.test(trimmed);
}

export function NewProjectModal({ isOpen, user, onClose, onSubmit }: NewProjectModalProps) {
  // Step Control (1: Basic Info, 2: Deep Dive, 3: Screenshots & Team)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [github, setGithub] = useState("");

  // Tech Stack Interactive Multi-Select State
  const [selectedTechList, setSelectedTechList] = useState<string[]>([]);
  const [techDropdownOpen, setTechDropdownOpen] = useState(false);
  const [techSearchInput, setTechSearchInput] = useState("");

  // Step 2 State (Optional Details)
  const [problemSolved, setProblemSolved] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");

  // Step 3 State (Screenshots & Team Setup)
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [teamType, setTeamType] = useState<"solo" | "team">("solo");

  // Code Buddies Interactive Multi-Select Dropdown State
  const [dbFriendsList, setDbFriendsList] = useState<any[]>([]);
  const [selectedBuddies, setSelectedBuddies] = useState<any[]>([]);
  const [buddyDropdownOpen, setBuddyDropdownOpen] = useState(false);
  const [buddySearchInput, setBuddySearchInput] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  // Fetch accepted friends from Neon PostgreSQL when modal opens
  useEffect(() => {
    if (!isOpen || !user?.username) return;
    async function fetchFriends() {
      try {
        const res = await fetch(`/api/friends?username=${encodeURIComponent(user!.username)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.friends && Array.isArray(data.friends)) {
            setDbFriendsList(data.friends);
          }
        }
      } catch (e) {
        console.error("Failed to load friends for code buddies dropdown", e);
      }
    }
    fetchFriends();
  }, [isOpen, user?.username]);

  const handleSelectBuddy = (friend: any) => {
    setErrorMessage("");
    if (selectedBuddies.length >= 5) {
      setErrorMessage("Maximum 5 code buddies allowed per team.");
      return;
    }
    const exists = selectedBuddies.some((b) => b.username.toLowerCase() === friend.username.toLowerCase());
    if (!exists) {
      setSelectedBuddies((prev) => [...prev, friend]);
    }
    setBuddyDropdownOpen(false);
    setBuddySearchInput("");
  };

  const handleSelectTech = (item: string) => {
    setErrorMessage("");
    if (selectedTechList.length >= 10) {
      setErrorMessage("Maximum 10 technology tags allowed.");
      return;
    }
    const exists = selectedTechList.some((t) => t.toLowerCase() === item.toLowerCase());
    if (!exists) {
      setSelectedTechList((prev) => [...prev, item]);
    }
    setTechSearchInput("");
  };

  const handleAddCustomTech = (inputTech: string) => {
    setErrorMessage("");
    const clean = inputTech.trim();
    if (!clean) return;
    if (!isValidTechItem(clean)) {
      setErrorMessage(`Invalid technology "${clean}". Please enter real developer technologies.`);
      return;
    }
    if (selectedTechList.length >= 10) {
      setErrorMessage("Maximum 10 technology tags allowed.");
      return;
    }
    const exists = selectedTechList.some((t) => t.toLowerCase() === clean.toLowerCase());
    if (!exists) {
      setSelectedTechList((prev) => [...prev, clean]);
    }
    setTechSearchInput("");
  };

  const handleRemoveTech = (targetTech: string) => {
    setSelectedTechList((prev) => prev.filter((t) => t.toLowerCase() !== targetTech.toLowerCase()));
  };

  const handleAddCustomBuddy = (inputUsername: string) => {
    setErrorMessage("");
    const clean = inputUsername.replace(/^@/, "").trim().toLowerCase();
    if (!clean) return;
    if (selectedBuddies.length >= 5) {
      setErrorMessage("Maximum 5 code buddies allowed per team.");
      return;
    }
    const exists = selectedBuddies.some((b) => b.username.toLowerCase() === clean);
    if (!exists) {
      setSelectedBuddies((prev) => [...prev, { name: clean, username: clean }]);
    }
    setBuddyDropdownOpen(false);
    setBuddySearchInput("");
  };

  const handleRemoveBuddy = (targetUsername: string) => {
    setSelectedBuddies((prev) => prev.filter((b) => b.username.toLowerCase() !== targetUsername.toLowerCase()));
  };

  if (!isOpen) return null;

  const resetForm = () => {
    setStep(1);
    setName("");
    setDescription("");
    setSelectedTechList([]);
    setTechSearchInput("");
    setTechDropdownOpen(false);
    setGithub("");
    setProblemSolved("");
    setInspiration("");
    setBiggestChallenge("");
    setScreenshots([]);
    setTeamType("solo");
    setSelectedBuddies([]);
    setBuddySearchInput("");
    setBuddyDropdownOpen(false);
    setIsSubmitting(false);
  };

  const validateStep1 = (): boolean => {
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const trimmedGithub = github.trim();

    if (!trimmedName) {
      setErrorMessage("Project name is required.");
      return false;
    }

    if (trimmedName.length < 3 || trimmedName.length > 100) {
      setErrorMessage("Project name must be between 3 and 100 characters long.");
      return false;
    }

    if (/\s/.test(trimmedName)) {
      setErrorMessage("Project name cannot contain spaces. Use camelCase or hyphens (e.g. KnowledgeVaultAI or my-project).");
      return false;
    }

    if (!trimmedDesc) {
      setErrorMessage("Project description is required.");
      return false;
    }

    if (trimmedDesc.length < 10 || trimmedDesc.length > 2000) {
      setErrorMessage("Project description must be between 10 and 2000 characters long.");
      return false;
    }

    if (selectedTechList.length < 1) {
      setErrorMessage("At least 1 technology tag is required.");
      return false;
    }

    if (selectedTechList.length > 10) {
      setErrorMessage("Maximum 10 technology tags allowed.");
      return false;
    }

    if (trimmedGithub && !isValidGithubLink(trimmedGithub)) {
      setErrorMessage("Invalid GitHub URL format. Must be like https://github.com/user/repo");
      return false;
    }

    if (
      containsAbusiveWords(trimmedName) ||
      containsAbusiveWords(trimmedDesc) ||
      containsAbusiveWords(trimmedGithub)
    ) {
      setErrorMessage("Inappropriate or abusive language is not allowed.");
      return false;
    }

    return true;
  };

  // Step 1 Validation & Next
  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  // Step 2 Validation & Next
  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      containsAbusiveWords(problemSolved) ||
      containsAbusiveWords(inspiration) ||
      containsAbusiveWords(biggestChallenge)
    ) {
      setErrorMessage("Inappropriate or abusive language is not allowed.");
      return;
    }

    setStep(3);
  };

  // Compress screenshot to max width 800px & JPEG 0.7 quality (~40KB)
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
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
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  };

  // Handle Screenshot Uploads
  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is over 10MB.`);
        continue;
      }
      try {
        const compressedBase64 = await compressImage(file);
        if (compressedBase64) {
          setScreenshots((prev) => [...prev, compressedBase64]);
        }
      } catch (err) {
        console.error("Failed to compress image", err);
      }
    }
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  // Final Submit
  const handleFinalPublish = async () => {
    if (isSubmitting) return;
    setErrorMessage("");

    if (!validateStep1()) {
      return;
    }

    const teamMembersList = teamType === "team"
      ? selectedBuddies.map((b) => b.username)
      : [];

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        tech: selectedTechList.join(", "),
        github: github.trim(),
        problemSolved: problemSolved.trim() || undefined,
        inspiration: inspiration.trim() || undefined,
        biggestChallenge: biggestChallenge.trim() || undefined,
        teamType,
        teamMembers: teamMembersList,
        screenshots: screenshots.length > 0 ? screenshots : undefined,
      });

      setShowSuccessToast(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccessToast(false);
        resetForm();
        onClose();
      }, 1500);
    } catch (e: any) {
      setIsSubmitting(false);
      setErrorMessage(e?.message || "Failed to publish project. Please try again.");
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-[#e8e2d8] rounded-2xl shadow-xl p-6 space-y-5 font-mono text-xs text-zinc-900 max-h-[90vh] overflow-y-auto overflow-x-hidden relative">
        
        {/* Header & Step Indicator */}
        <div className="border-b border-zinc-100 pb-3 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-zinc-900">Add New Project</h2>
              <p className="text-xs text-zinc-500 font-sans mt-0.5">Publish your repository to your developer portfolio.</p>
            </div>
            <button
              onClick={handleResetAndClose}
              className="text-zinc-400 hover:text-zinc-900 text-base transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* STEP PROGRESS BAR */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 1 ? "bg-zinc-900" : "bg-zinc-200"}`} />
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 2 ? "bg-zinc-900" : "bg-zinc-200"}`} />
            <div className={`flex-1 h-1.5 rounded-full transition-all ${step >= 3 ? "bg-zinc-900" : "bg-zinc-200"}`} />
            <span className="text-zinc-500 font-bold ml-1">Step {step} of 3</span>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: CORE PROJECT INFO */}
        {step === 1 && (
          <form onSubmit={handleNextStep1} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <label className="block text-zinc-600 mb-1 font-bold">Project Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="e.g. KnowledgeVaultAI or my-project"
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs"
              />
            </div>

            <div>
              <label className="block text-zinc-600 mb-1 font-bold">Tagline & Description</label>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Short description of what you built and how it works..."
                rows={3}
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs resize-none transition-colors"
              />
            </div>

            {/* Tech Stack Multi-Select Dropdown Selector */}
            <div className="space-y-2 relative font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-600 font-bold">
                <label>Tech Stack *</label>
                <span className="text-[10px] text-zinc-400 font-normal">Max 10 technologies</span>
              </div>

              {/* Selected Tech Pills */}
              {selectedTechList.length > 0 && (
                <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
                  {selectedTechList.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 text-white font-mono text-xs font-bold shadow-2xs"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="hover:text-red-300 ml-0.5 cursor-pointer text-xs font-bold"
                        title="Remove technology"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Dropdown Input Toggle */}
              <div className="relative">
                <div
                  onClick={() => setTechDropdownOpen(!techDropdownOpen)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 flex items-center justify-between cursor-pointer text-xs hover:border-zinc-400 transition-colors"
                >
                  <span className={selectedTechList.length === 0 ? "text-zinc-400" : "text-zinc-900 font-bold"}>
                    {selectedTechList.length === 0
                      ? "Select tech stack (e.g. Next.js, React, Python)..."
                      : `${selectedTechList.length} Technolog${selectedTechList.length > 1 ? "ies" : "y"} Selected`}
                  </span>
                  <svg
                    className={`w-4 h-4 text-zinc-500 transition-transform ${techDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Upward Floating Dropdown Options List */}
                {techDropdownOpen && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 p-2.5 rounded-2xl bg-white border border-[#e8e2d8] shadow-2xl z-50 max-h-52 overflow-y-auto space-y-1.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
                    {/* Search / Custom Tag Bar */}
                    <div className="p-1">
                      <input
                        type="text"
                        value={techSearchInput}
                        onChange={(e) => setTechSearchInput(e.target.value)}
                        placeholder="Search technology (e.g. PyTorch, Rust)..."
                        className="w-full px-3 py-1.5 rounded-lg bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none font-mono"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            if (techSearchInput.trim()) {
                              handleAddCustomTech(techSearchInput.trim());
                            }
                          }
                        }}
                      />
                    </div>

                    {/* Filtered Alphabetical List */}
                    {ALL_POPULAR_TECH.filter(
                      (t) =>
                        !selectedTechList.some((st) => st.toLowerCase() === t.toLowerCase()) &&
                        t.toLowerCase().includes(techSearchInput.toLowerCase())
                    ).length > 0 ? (
                      <div className="grid grid-cols-2 gap-1 p-1">
                        {ALL_POPULAR_TECH.filter(
                          (t) =>
                            !selectedTechList.some((st) => st.toLowerCase() === t.toLowerCase()) &&
                            t.toLowerCase().includes(techSearchInput.toLowerCase())
                        ).map((techItem) => (
                          <button
                            key={techItem}
                            type="button"
                            onClick={() => handleSelectTech(techItem)}
                            className="px-2.5 py-1.5 rounded-lg hover:bg-[#f4efe6] text-left flex items-center justify-between text-zinc-800 hover:text-zinc-900 font-mono text-xs transition-colors cursor-pointer"
                          >
                            <span>{techItem}</span>
                            <span className="text-emerald-700 font-bold text-[10px]">+ Add</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center text-zinc-500 text-xs">
                        {techSearchInput.trim() ? (
                          <button
                            type="button"
                            onClick={() => handleAddCustomTech(techSearchInput.trim())}
                            className="text-zinc-900 font-bold underline cursor-pointer"
                          >
                            Add custom tech "{techSearchInput.trim()}"
                          </button>
                        ) : (
                          "All technologies selected."
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-zinc-600 mb-1 font-bold">GitHub Repository Link</label>
              <input
                type="text"
                value={github}
                onChange={(e) => {
                  setGithub(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="https://github.com/username/project"
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-4 py-2 rounded-xl bg-white border border-[#e8e2d8] hover:bg-zinc-50 text-zinc-700 font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <span>Next</span>
                <span>➔</span>
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: DEEP DIVE (OPTIONAL DETAILS) */}
        {step === 2 && (
          <form onSubmit={handleNextStep2} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-200">
            <div>
              <label className="block text-zinc-600 mb-1 font-bold">What problem does this solve?</label>
              <textarea
                value={problemSolved}
                onChange={(e) => {
                  setProblemSolved(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Students build amazing projects but have nowhere to showcase their work and connect with other builders."
                rows={2.5}
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-zinc-600 mb-1 font-bold">What inspired you to build it?</label>
              <textarea
                value={inspiration}
                onChange={(e) => {
                  setInspiration(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="I wanted a platform where students could compete, share projects and gain recognition."
                rows={2.5}
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-zinc-600 mb-1 font-bold">Biggest challenge faced?</label>
              <textarea
                value={biggestChallenge}
                onChange={(e) => {
                  setBiggestChallenge(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Designing a social platform database with friendships, likes and messaging."
                rows={2.5}
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setStep(1);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-[#e8e2d8] hover:bg-zinc-50 text-zinc-700 font-bold transition-all cursor-pointer"
              >
                ← Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage("");
                    setStep(3);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-700 hover:bg-zinc-200 font-bold transition-all cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Next</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 3: SCREENSHOTS & TEAM SETUP */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-200">
            {/* Screenshots Upload */}
            <div className="space-y-2">
              <label className="block text-zinc-600 font-bold">Project Screenshots</label>
              <input
                type="file"
                ref={screenshotInputRef}
                onChange={handleScreenshotUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <div className="flex flex-wrap gap-2.5 items-center">
                {screenshots.map((src, idx) => (
                  <div key={idx} className="w-16 h-16 rounded-xl border border-[#e2dacd] overflow-hidden relative group shrink-0">
                    <img src={src} alt="Screenshot" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeScreenshot(idx)}
                      className="absolute inset-0 bg-black/60 text-white font-bold text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => screenshotInputRef.current?.click()}
                  className="w-16 h-16 rounded-xl border-2 border-dashed border-zinc-300 hover:border-zinc-500 bg-[#f4efe6] text-zinc-600 font-bold text-xs flex flex-col items-center justify-center gap-1 cursor-pointer transition-all shrink-0"
                >
                  <span>+</span>
                  <span className="text-[9px]">Upload</span>
                </button>
              </div>
            </div>

            {/* Team Type Selection */}
            <div className="space-y-2 pt-2 border-t border-zinc-100">
              <label className="block text-zinc-600 font-bold">Team Setup</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTeamType("solo")}
                  className={`p-3 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer text-center ${
                    teamType === "solo"
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                      : "bg-[#f4efe6] border-[#e2dacd] text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  Solo Project
                </button>
                <button
                  type="button"
                  onClick={() => setTeamType("team")}
                  className={`p-3 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer text-center ${
                    teamType === "team"
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                      : "bg-[#f4efe6] border-[#e2dacd] text-zinc-700 hover:border-zinc-400"
                  }`}
                >
                  Team Project
                </button>
              </div>
            </div>

            {/* Code Buddies Multi-Select Dropdown Selector */}
            {teamType === "team" && (
              <div className="space-y-2 animate-in fade-in duration-150 relative font-mono text-xs">
                <div className="flex items-center justify-between text-zinc-600 font-bold">
                  <label>Add Code Buddies</label>
                  <span className="text-[10px] text-zinc-400 font-normal">Max 5 team members</span>
                </div>

                {/* Selected Buddies Pills */}
                {selectedBuddies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd]">
                    {selectedBuddies.map((buddy) => (
                      <span
                        key={buddy.username}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 text-white font-mono text-xs font-bold shadow-2xs"
                      >
                        <span className="w-4 h-4 rounded-full bg-zinc-700 text-[9px] flex items-center justify-center uppercase shrink-0 overflow-hidden">
                          {buddy.avatar && (buddy.avatar.startsWith("data:") || buddy.avatar.startsWith("http")) ? (
                            <img src={buddy.avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            buddy.username.slice(0, 2).toUpperCase()
                          )}
                        </span>
                        <span>@{buddy.username}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveBuddy(buddy.username)}
                          className="hover:text-red-300 ml-0.5 cursor-pointer text-xs font-bold"
                          title="Remove buddy"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Dropdown Input Toggle */}
                <div className="relative">
                  <div
                    onClick={() => setBuddyDropdownOpen(!buddyDropdownOpen)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 flex items-center justify-between cursor-pointer text-xs hover:border-zinc-400 transition-colors"
                  >
                    <span className={selectedBuddies.length === 0 ? "text-zinc-400" : "text-zinc-900 font-bold"}>
                      {selectedBuddies.length === 0
                        ? "Select friends or search @username..."
                        : `${selectedBuddies.length} Buddy${selectedBuddies.length > 1 ? "ies" : ""} Selected`}
                    </span>
                    <svg
                      className={`w-4 h-4 text-zinc-500 transition-transform ${buddyDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>

                  {/* Upward Floating Dropdown Menu */}
                  {buddyDropdownOpen && (
                    <div className="absolute bottom-full mb-2 left-0 right-0 p-2.5 rounded-2xl bg-white border border-[#e8e2d8] shadow-2xl z-50 max-h-52 overflow-y-auto space-y-1.5 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
                      {/* Search / Manual Input */}
                      <div className="p-1">
                        <input
                          type="text"
                          value={buddySearchInput}
                          onChange={(e) => setBuddySearchInput(e.target.value)}
                          placeholder="Search friends or type handle..."
                          className="w-full px-3 py-1.5 rounded-lg bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 text-xs focus:outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              if (buddySearchInput.trim()) {
                                handleAddCustomBuddy(buddySearchInput.trim());
                              }
                            }
                          }}
                        />
                      </div>

                      {/* Filtered Available Friends */}
                      {dbFriendsList.filter(
                        (f) =>
                          !selectedBuddies.some((sb) => sb.username.toLowerCase() === f.username.toLowerCase()) &&
                          (f.name.toLowerCase().includes(buddySearchInput.toLowerCase()) ||
                            f.username.toLowerCase().includes(buddySearchInput.toLowerCase()))
                      ).length > 0 ? (
                        dbFriendsList
                          .filter(
                            (f) =>
                              !selectedBuddies.some((sb) => sb.username.toLowerCase() === f.username.toLowerCase()) &&
                              (f.name.toLowerCase().includes(buddySearchInput.toLowerCase()) ||
                                f.username.toLowerCase().includes(buddySearchInput.toLowerCase()))
                          )
                          .map((friend) => (
                            <button
                              key={friend.username}
                              type="button"
                              onClick={() => handleSelectBuddy(friend)}
                              className="w-full p-2 rounded-xl hover:bg-[#f4efe6] text-left flex items-center justify-between transition-colors cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-lg bg-zinc-900 text-white font-bold text-[10px] flex items-center justify-center uppercase shrink-0 overflow-hidden">
                                  {friend.avatar && (friend.avatar.startsWith("data:") || friend.avatar.startsWith("http")) ? (
                                    <img src={friend.avatar} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    friend.avatar || friend.username.slice(0, 2).toUpperCase()
                                  )}
                                </div>
                                <div>
                                  <div className="font-bold text-zinc-900 text-xs">{friend.name}</div>
                                  <div className="text-[10px] text-zinc-500">@{friend.username}</div>
                                </div>
                              </div>
                              <span className="text-emerald-700 font-bold text-xs">+ Add</span>
                            </button>
                          ))
                      ) : (
                        <div className="p-3 text-center text-zinc-500 text-xs">
                          {buddySearchInput.trim() ? (
                            <button
                              type="button"
                              onClick={() => handleAddCustomBuddy(buddySearchInput.trim())}
                              className="text-zinc-900 font-bold underline cursor-pointer"
                            >
                              Add "@{buddySearchInput.trim()}" to team
                            </button>
                          ) : (
                            "No more friends available to add."
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setStep(2);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-[#e8e2d8] hover:bg-zinc-50 text-zinc-700 font-bold transition-all cursor-pointer"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinalPublish}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-black disabled:bg-zinc-400 text-white font-mono text-xs font-bold transition-all shadow-md cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span></span>
                    <span>Publish Repository</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {showSuccessToast && (
          <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-emerald-900 text-white font-mono text-xs font-bold shadow-2xl border border-emerald-700 flex items-center gap-3 animate-in slide-in-from-top duration-300">
            <span className="text-lg">✅</span>
            <div>
              <div className="text-sm font-bold">Project Published Successfully!</div>
              <div className="text-[10px] text-emerald-200 font-normal">Your repository is now live on SkillSphere.</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
