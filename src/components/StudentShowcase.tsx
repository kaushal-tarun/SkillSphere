"use client";

import React, { useState } from "react";

export default function StudentShowcase() {
  // Screenshot slide index per project
  const [currentSlide, setCurrentSlide] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
  });

  // Interactive Likes state
  const [likedProjects, setLikedProjects] = useState<Record<number, boolean>>({});

  // Full-screen Lightbox Modal state
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    projectId: number;
    slideIndex: number;
  }>({
    isOpen: false,
    projectId: 1,
    slideIndex: 0,
  });

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedProjects((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePrevSlide = (projectId: number, totalSlides: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => {
      const current = prev[projectId] || 0;
      const nextIndex = current === 0 ? totalSlides - 1 : current - 1;
      return { ...prev, [projectId]: nextIndex };
    });
  };

  const handleNextSlide = (projectId: number, totalSlides: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => {
      const current = prev[projectId] || 0;
      const nextIndex = current === totalSlides - 1 ? 0 : current + 1;
      return { ...prev, [projectId]: nextIndex };
    });
  };

  const openLightbox = (projectId: number, slideIndex: number) => {
    setLightbox({ isOpen: true, projectId, slideIndex });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const projects = [
    {
      id: 1,
      name: "KnowledgeVault",
      tagline: "AI RAG Research Engine",
      screenshots: ["/kvss1.png", "/kvss2.png", "/kvss3.png"],
      creator: {
        name: "Alex Rivera",
        school: "MIT '26",
        avatar: "AR",
        avatarBg: "bg-indigo-600",
      },
      description:
        "AI-powered document indexing & semantic search platform for university research papers, lecture notes, and codebase queries.",
      stats: {
        baseLikes: 342,
        comments: 48,
        xp: "+1,850 XP",
      },
      tags: ["Next.js 19", "Python", "Vector DB"],
    },
    {
      id: 2,
      name: "Nexa AI",
      tagline: "Smart Student Study Partner",
      screenshots: ["/nexass1.png", "/nexass2.png", "/nexass3.png"],
      creator: {
        name: "Elena Chen",
        school: "Stanford '25",
        avatar: "EC",
        avatarBg: "bg-purple-600",
      },
      description:
        "Intelligent study assistant synthesizing lecture audio into interactive flashcards, practice quizzes, and knowledge graphs.",
      stats: {
        baseLikes: 512,
        comments: 76,
        xp: "+2,400 XP",
      },
      tags: ["React", "TypeScript", "FastAPI"],
    },
    {
      id: 3,
      name: "CodeCollab",
      tagline: "Real-time Hackathon Workspace",
      screenshots: ["/codecollab_ss.jpg"],
      creator: {
        name: "Rohan Kapoor",
        school: "IIT Bombay '26",
        avatar: "RK",
        avatarBg: "bg-emerald-600",
      },
      description:
        "Collaborative developer workspace matching student builders for hackathons based on skill matrices and availability.",
      stats: {
        baseLikes: 289,
        comments: 34,
        xp: "+1,620 XP",
      },
      tags: ["Node.js", "PostgreSQL", "WebSockets"],
    },
  ];

  const currentLightboxProject = projects.find((p) => p.id === lightbox.projectId) || projects[0];

  return (
    <section id="showcase" className="py-20 bg-black text-white relative overflow-hidden border-t border-zinc-900">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-800 bg-zinc-950 text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            FEATURED STUDENT PROJECTS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            What Students Build Here
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            Browse live project screenshot previews, test feature walkthroughs, like student creations, and see proof of work.
          </p>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project) => {
            const activeIndex = currentSlide[project.id] || 0;
            const currentScreenshot = project.screenshots[activeIndex];
            const isLiked = likedProjects[project.id] || false;
            const likeCount = project.stats.baseLikes + (isLiked ? 1 : 0);

            return (
              <div
                key={project.id}
                className="group relative rounded-2xl border border-zinc-800/90 bg-zinc-950/90 overflow-hidden backdrop-blur-xl hover:border-zinc-700 transition-all duration-300 flex flex-col justify-between shadow-2xl shadow-black/90 hover:-translate-y-1"
              >
                {/* TOP: Screenshot Preview Carousel Container */}
                <div
                  onClick={() => openLightbox(project.id, activeIndex)}
                  className="relative aspect-[16/10] w-full bg-zinc-900 overflow-hidden cursor-pointer group/img"
                >
                  {/* Current Screenshot */}
                  <img
                    src={currentScreenshot}
                    alt={`${project.name} Screenshot`}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
                  />

                  {/* Top Bar Overlay: Counter & Zoom Hint */}
                  <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-zinc-300">
                      Screenshot {activeIndex + 1} / {project.screenshots.length}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-zinc-400 group-hover/img:text-white transition-colors">
                      🔍 Expand
                    </span>
                  </div>

                  {/* Left & Right Screenshot Navigation Arrows */}
                  {project.screenshots.length > 1 && (
                    <>
                      <button
                        onClick={(e) => handlePrevSlide(project.id, project.screenshots.length, e)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black border border-zinc-700 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-all shadow-md z-10"
                        title="Previous Screenshot"
                      >
                        ‹
                      </button>

                      <button
                        onClick={(e) => handleNextSlide(project.id, project.screenshots.length, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/70 hover:bg-black border border-zinc-700 text-white flex items-center justify-center opacity-80 hover:opacity-100 transition-all shadow-md z-10"
                        title="Next Screenshot"
                      >
                        ›
                      </button>
                    </>
                  )}

                  {/* Bottom Indicator Dots */}
                  {project.screenshots.length > 1 && (
                    <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                      {project.screenshots.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all ${
                            activeIndex === i ? "w-5 bg-white" : "w-1.5 bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* BODY: Creator Info & Description */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Creator Header Bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-9 h-9 rounded-full ${project.creator.avatarBg} text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-md border border-white/10`}
                      >
                        {project.creator.avatar}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-white tracking-tight">
                            {project.name}
                          </h3>
                          <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                            {project.tagline}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-mono mt-0.5">
                          <span className="text-zinc-200">{project.creator.name}</span> • <span className="text-zinc-500">{project.creator.school}</span>
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                      {project.description}
                    </p>

                    {/* Tech Stack Badges */}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.tags.map((t, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-zinc-800"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* BOTTOM: Clear Like & Engagement Bar */}
                  <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
                    {/* Clear Visible Like Button */}
                    <button
                      onClick={(e) => toggleLike(project.id, e)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                        isLiked
                          ? "bg-rose-950/80 border-rose-700 text-rose-300 shadow-sm shadow-rose-950"
                          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
                      }`}
                    >
                      <svg
                        className={`w-4 h-4 ${isLiked ? "fill-rose-500 stroke-rose-500" : "fill-none stroke-current"}`}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      <span className="font-semibold text-xs">{likeCount} Likes</span>
                    </button>

                    {/* Comment Count */}
                    <div className="flex items-center gap-1.5 text-zinc-400">
                      <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                      <span>{project.stats.comments}</span>
                    </div>

                    {/* XP Tag */}
                    <div className="flex items-center gap-1 text-white font-semibold bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-xs">
                      ⚡ {project.stats.xp}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL-SCREEN LIGHTBOX SCREENSHOT PREVIEW MODAL */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={closeLightbox}
          />

          <div className="relative z-10 w-full max-w-5xl bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {currentLightboxProject.name} — Full Screenshot Preview
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  Screenshot {lightbox.slideIndex + 1} of {currentLightboxProject.screenshots.length} • by {currentLightboxProject.creator.name}
                </p>
              </div>
              <button
                onClick={closeLightbox}
                className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-mono transition-all"
              >
                Close ✕
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[400px] overflow-auto p-2">
              <img
                src={currentLightboxProject.screenshots[lightbox.slideIndex]}
                alt="Full Screenshot"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-xl"
              />

              {/* Prev / Next Modal Arrows */}
              {currentLightboxProject.screenshots.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightbox((prev) => ({
                        ...prev,
                        slideIndex:
                          prev.slideIndex === 0
                            ? currentLightboxProject.screenshots.length - 1
                            : prev.slideIndex - 1,
                      }))
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-900/90 border border-zinc-700 text-white text-xl flex items-center justify-center hover:bg-black transition-all shadow-xl"
                  >
                    ‹
                  </button>

                  <button
                    onClick={() =>
                      setLightbox((prev) => ({
                        ...prev,
                        slideIndex:
                          prev.slideIndex === currentLightboxProject.screenshots.length - 1
                            ? 0
                            : prev.slideIndex + 1,
                      }))
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-900/90 border border-zinc-700 text-white text-xl flex items-center justify-center hover:bg-black transition-all shadow-xl"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Modal Footer Thumbnail Strip */}
            {currentLightboxProject.screenshots.length > 1 && (
              <div className="p-3 border-t border-zinc-800 bg-black flex items-center justify-center gap-3">
                {currentLightboxProject.screenshots.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setLightbox((prev) => ({ ...prev, slideIndex: i }))}
                    className={`w-16 h-10 rounded-lg overflow-hidden border transition-all ${
                      lightbox.slideIndex === i
                        ? "border-white scale-105 shadow-md"
                        : "border-zinc-800 opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
