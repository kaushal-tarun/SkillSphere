"use client";

import React, { useState } from "react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: { name: string; description: string; tech: string; github: string }) => void;
}

// List of recognized developer technologies
const VALID_TECH_STACK = new Set([
  "react", "react.js", "reactjs", "next.js", "nextjs", "vue", "vue.js", "vuejs",
  "svelte", "sveltekit", "angular", "typescript", "ts", "javascript", "js",
  "node.js", "nodejs", "express", "express.js", "nest.js", "nestjs",
  "python", "django", "flask", "fastapi", "c++", "cpp", "c#", "csharp", "c",
  "java", "spring", "spring boot", "kotlin", "swift", "go", "golang", "rust",
  "ruby", "rails", "ruby on rails", "php", "laravel", "sql", "postgresql", "postgres",
  "mysql", "sqlite", "mongodb", "mongo", "redis", "prisma", "orm", "graphql", "rest api",
  "docker", "kubernetes", "k8s", "aws", "amazon web services", "firebase", "supabase",
  "gcp", "google cloud", "azure", "tailwind", "tailwindcss", "css", "css3", "html", "html5",
  "git", "github", "gitlab", "pytorch", "tensorflow", "opencv", "pandas", "numpy",
  "scikit-learn", "scikit", "machine learning", "ml", "ai", "artificial intelligence",
  "deep learning", "nlp", "webassembly", "wasm", "solidity", "web3", "blockchain",
  "flutter", "react native", "android", "ios", "shell", "bash", "linux", "vite", "webpack",
  "trpc", "zod", "drizzle", "truffle", "hardhat", "chakra ui", "shadcn", "mui", "material ui"
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
  return VALID_TECH_STACK.has(normalized);
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [github, setGithub] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedName = name.trim();
    const trimmedDesc = description.trim();
    const trimmedTech = tech.trim();
    const trimmedGithub = github.trim();

    // 1. Mandatory Name Validation
    if (!trimmedName) {
      setErrorMessage("Project name is required.");
      return;
    }

    // 2. Abusive / Profanity Content Check
    if (
      containsAbusiveWords(trimmedName) ||
      containsAbusiveWords(trimmedDesc) ||
      containsAbusiveWords(trimmedTech) ||
      containsAbusiveWords(trimmedGithub)
    ) {
      setErrorMessage("Inappropriate or abusive language is not allowed.");
      return;
    }

    // 3. Tech Stack Validation
    if (trimmedTech) {
      const techItems = trimmedTech.split(",").map((t) => t.trim()).filter(Boolean);
      const invalidItems = techItems.filter((t) => !isValidTechItem(t));

      if (invalidItems.length > 0) {
        setErrorMessage(
          `Invalid technology "${invalidItems[0]}". Please enter real developer technologies (e.g. Next.js, React, Python, PostgreSQL).`
        );
        return;
      }
    }

    // 4. GitHub Repository Link Validation
    if (trimmedGithub && !isValidGithubLink(trimmedGithub)) {
      setErrorMessage("Please enter a valid GitHub repository URL (e.g. https://github.com/username/project).");
      return;
    }

    onSubmit({
      name: trimmedName,
      description: trimmedDesc,
      tech: trimmedTech,
      github: trimmedGithub,
    });

    setName("");
    setDescription("");
    setTech("");
    setGithub("");
    setErrorMessage("");
  };

  const handleClose = () => {
    setErrorMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white border border-[#e8e2d8] rounded-2xl shadow-xl p-6 space-y-6 font-mono text-xs text-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-zinc-900">Add New Project</h2>
            <p className="text-xs text-zinc-500 font-sans mt-0.5">Publish your repository to your developer portfolio.</p>
          </div>
          <button
            onClick={handleClose}
            className="text-zinc-400 hover:text-zinc-900 text-base transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold flex items-center gap-2 animate-in fade-in duration-150">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-white border border-[#e8e2d8] hover:bg-zinc-50 text-zinc-700 font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold transition-all shadow-md cursor-pointer"
            >
              Publish Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
