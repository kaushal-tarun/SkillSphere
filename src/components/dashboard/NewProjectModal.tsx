"use client";

import React, { useState } from "react";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: { name: string; description: string; tech: string; github: string }) => void;
}

export function NewProjectModal({ isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tech, setTech] = useState("");
  const [github, setGithub] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({ name, description, tech, github });
    setName("");
    setDescription("");
    setTech("");
    setGithub("");
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
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-900 text-base transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-zinc-600 mb-1">Project Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. KnowledgeVault AI"
              className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-600 mb-1">Tagline & Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of what you built and how it works..."
              rows={3}
              className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-zinc-600 mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="Next.js, TypeScript, PostgreSQL, Prisma"
              className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs"
            />
          </div>

          <div>
            <label className="block text-zinc-600 mb-1">GitHub Repository Link</label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="https://github.com/username/project"
              className="w-full px-3.5 py-2 rounded-xl bg-[#f4efe6] border border-[#e2dacd] text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-400 font-sans text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
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
