"use client";

import React, { useState, useRef } from "react";

interface NewProjectModalProps {
  isOpen: boolean;
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
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith("https://github.com/") ||
    trimmed.startsWith("http://github.com/") ||
    trimmed.startsWith("github.com/")
  );
}

export function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  // Step Control (1: Basic Info, 2: Deep Dive, 3: Screenshots & Team)
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1 State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [github, setGithub] = useState("");

  // Step 2 State (Optional Details)
  const [problemSolved, setProblemSolved] = useState("");
  const [inspiration, setInspiration] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");

  // Step 3 State (Screenshots & Team Setup)
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [teamType, setTeamType] = useState<"solo" | "team">("solo");
  const [codeBuddies, setCodeBuddies] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const validateStep1 = (): boolean => {
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const trimmedTech = tech.trim();
    const trimmedGithub = github.trim();

    if (!trimmedName) {
      setErrorMessage("Project name is required.");
      return false;
    }

    if (
      containsAbusiveWords(trimmedName) ||
      containsAbusiveWords(trimmedDesc) ||
      containsAbusiveWords(trimmedTech) ||
      containsAbusiveWords(trimmedGithub)
    ) {
      setErrorMessage("Inappropriate or abusive language is not allowed.");
      return false;
    }

    if (trimmedTech) {
      const techItems = trimmedTech.split(",").map((t) => t.trim()).filter(Boolean);
      const invalidItems = techItems.filter((t) => !isValidTechItem(t));

      if (invalidItems.length > 0) {
        setErrorMessage(
          `Invalid technology "${invalidItems[0]}". Please enter real developer technologies (e.g. Next.js, React, Python, PostgreSQL).`
        );
        return false;
      }
    }

    if (trimmedGithub && !isValidGithubLink(trimmedGithub)) {
      setErrorMessage("Please enter a valid GitHub repository URL (e.g. https://github.com/username/project).");
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

  // Handle Screenshot Uploads
  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is over 5MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setScreenshots((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeScreenshot = (index: number) => {
    setScreenshots((prev) => prev.filter((_, i) => i !== index));
  };

  // Final Submit
  const handleFinalPublish = () => {
    setErrorMessage("");

    if (!validateStep1()) {
      return;
    }

    if (
      containsAbusiveWords(problemSolved) ||
      containsAbusiveWords(inspiration) ||
      containsAbusiveWords(biggestChallenge) ||
      containsAbusiveWords(codeBuddies)
    ) {
      setErrorMessage("Inappropriate or abusive language is not allowed.");
      return;
    }

    const teamMembersList = teamType === "team" && codeBuddies.trim()
      ? codeBuddies.split(",").map((u) => u.trim()).filter(Boolean)
      : [];

    onSubmit({
      name: name.trim(),
      description: description.trim() || `${name.trim()} - Student Project built on SkillSphere.`,
      tech: tech.trim(),
      github: github.trim(),
      problemSolved: problemSolved.trim() || undefined,
      inspiration: inspiration.trim() || undefined,
      biggestChallenge: biggestChallenge.trim() || undefined,
      teamType,
      teamMembers: teamMembersList,
      screenshots: screenshots.length > 0 ? screenshots : undefined,
    });

    // Reset Form
    setName("");
    setDescription("");
    setTech("");
    setGithub("");
    setProblemSolved("");
    setInspiration("");
    setBiggestChallenge("");
    setScreenshots([]);
    setTeamType("solo");
    setCodeBuddies("");
    setStep(1);
    setErrorMessage("");
  };

  const handleResetAndClose = () => {
    setStep(1);
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-[#e8e2d8] rounded-2xl shadow-xl p-6 space-y-5 font-mono text-xs text-zinc-900 overflow-hidden relative">
        
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
            <span>⚠️</span>
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
                placeholder="e.g. KnowledgeVault AI"
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

            <div>
              <label className="block text-zinc-600 mb-1 font-bold">Tech Stack (comma separated)</label>
              <input
                type="text"
                value={tech}
                onChange={(e) => {
                  setTech(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="Next.js, TypeScript, PostgreSQL, Prisma"
                className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs"
              />
              <p className="text-[10px] text-zinc-400 font-sans mt-1">Enter valid technologies (e.g. React, Python, Docker, PostgreSQL).</p>
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
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleFinalPublish}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all cursor-pointer shadow-xs"
                >
                  Publish Now
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

            {/* Code Buddies Input (If Team) */}
            {teamType === "team" && (
              <div className="animate-in fade-in duration-150">
                <label className="block text-zinc-600 mb-1 font-bold">Add Code Buddies (comma separated usernames)</label>
                <input
                  type="text"
                  value={codeBuddies}
                  onChange={(e) => {
                    setCodeBuddies(e.target.value);
                    if (errorMessage) setErrorMessage("");
                  }}
                  placeholder="tanvi_kulkarni, tushar_somani"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs"
                />
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
                className="px-5 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold transition-all shadow-md cursor-pointer"
              >
                Publish Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
