"use client";

import React, { useState } from "react";

export default function StudentShowcase() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  // Screenshot slide index per project
  const [currentSlide, setCurrentSlide] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
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

  const projects = [
    {
      id: 1,
      name: "KnowledgeVault",
      tagline: "AI RAG Research Engine",
      screenshots: ["/kvss1.png", "/kvss2.png", "/kvss3.png"],
      creator: {
        name: "Advait Deshmukh",
        school: "IIT Bombay '26",
        avatar: "AD",
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
        name: "Tanvi Kulkarni",
        school: "BITS Pilani '25",
        avatar: "TK",
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
        name: "Tushar Somani",
        school: "IIIT Hyderabad '26",
        avatar: "TS",
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
    {
      id: 4,
      name: "DevPulse",
      tagline: "Developer Telemetry & Analytics",
      screenshots: ["/devpulse_ss.jpg"],
      creator: {
        name: "Rudra Sengupta",
        school: "NIT Trichy '26",
        avatar: "RS",
        avatarBg: "bg-cyan-600",
      },
      description:
        "Real-time telemetry engine tracking commit velocity, code review throughput, and automated codebase health scores for student software teams.",
      stats: {
        baseLikes: 418,
        comments: 59,
        xp: "+2,100 XP",
      },
      tags: ["Next.js 16", "GraphQL", "Tailwind"],
    },
    {
      id: 5,
      name: "Algorank",
      tagline: "Competitive Coding Arena",
      screenshots: ["/algorank_ss.jpg"],
      creator: {
        name: "Ananya Vasisht",
        school: "IISc Bangalore '25",
        avatar: "AV",
        avatarBg: "bg-rose-600",
      },
      description:
        "Gamified competitive arena where student devs duel live in 1v1 algorithmic battles, solve architecture problems, and climb global university rank ladders.",
      stats: {
        baseLikes: 645,
        comments: 92,
        xp: "+2,850 XP",
      },
      tags: ["Rust", "WebSockets", "Docker"],
    },
  ];

  const handleNextProject = () => {
    setActiveProjectIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1));
  };

  const handlePrevProject = () => {
    setActiveProjectIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1));
  };

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

  const currentLightboxProject = projects.find((p) => p.id === lightbox.projectId) || projects[0];

  return (
    <section id="showcase" className="py-20 bg-black text-white relative overflow-hidden border-t border-zinc-900">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
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

          {/* Project Quick Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-4">
            {projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => setActiveProjectIndex(idx)}
                className={`px-4 py-1.5 rounded-xl text-xs font-mono transition-all duration-300 flex items-center gap-2 ${
                  activeProjectIndex === idx
                    ? "bg-white text-black font-bold shadow-lg shadow-white/10 scale-105"
                    : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                }`}
              >
                <span>0{idx + 1}.</span>
                <span>{proj.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Peek Carousel Coverflow Container */}
        <div className="relative max-w-6xl mx-auto min-h-[580px] sm:min-h-[620px] flex items-center justify-center py-6">
          {/* Lively Previous Project Arrow Button */}
          <button
            onClick={handlePrevProject}
            className="hidden sm:flex absolute left-2 md:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white hover:bg-zinc-100 text-black font-bold items-center justify-center text-2xl shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.8)] hover:scale-125 active:scale-90 transition-all duration-300 group cursor-pointer"
            title="Previous Project"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">‹</span>
          </button>

          {/* Lively Next Project Arrow Button */}
          <button
            onClick={handleNextProject}
            className="hidden sm:flex absolute right-2 md:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-white hover:bg-zinc-100 text-black font-bold items-center justify-center text-2xl shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.8)] hover:scale-125 active:scale-90 transition-all duration-300 group cursor-pointer"
            title="Next Project"
          >
            <span className="group-hover:translate-x-0.5 transition-transform">›</span>
          </button>

          {/* Carousel Cards Stack */}
          <div className="relative w-full max-w-2xl flex items-center justify-center">
            {projects.map((project, index) => {
              const total = projects.length;
              const diff = (index - activeProjectIndex + total) % total;
              const isActive = diff === 0;
              const isNext = diff === 1 || (diff === total - 1 && total === 2);
              const isPrev = diff === total - 1 && total > 2;

              const activeScreenshotIndex = currentSlide[project.id] || 0;
              const currentScreenshot = project.screenshots[activeScreenshotIndex];
              const isLiked = likedProjects[project.id] || false;
              const likeCount = project.stats.baseLikes + (isLiked ? 1 : 0);

              // Responsive positioning for peek layout
              let positionStyles = "";
              if (isActive) {
                positionStyles = "z-30 scale-100 opacity-100 translate-x-0 shadow-2xl shadow-black border-zinc-700";
              } else if (isNext) {
                positionStyles = "z-10 scale-[0.85] opacity-45 hover:opacity-80 translate-x-[55%] sm:translate-x-[50%] md:translate-x-[45%] blur-[1px] hover:blur-none border-zinc-800 cursor-pointer hidden sm:flex";
              } else if (isPrev) {
                positionStyles = "z-10 scale-[0.85] opacity-45 hover:opacity-80 -translate-x-[55%] sm:-translate-x-[50%] md:-translate-x-[45%] blur-[1px] hover:blur-none border-zinc-800 cursor-pointer hidden sm:flex";
              } else {
                positionStyles = "z-0 scale-75 opacity-0 pointer-events-none hidden";
              }

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (!isActive) setActiveProjectIndex(index);
                  }}
                  className={`absolute w-full group rounded-2xl border bg-zinc-950/95 overflow-hidden backdrop-blur-2xl transition-all duration-500 flex flex-col justify-between ${positionStyles}`}
                >
                  {/* Top Ambient Glow Line */}
                  <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  {/* TOP: Screenshot Preview Carousel Container */}
                  <div
                    onClick={() => {
                      if (isActive) openLightbox(project.id, activeScreenshotIndex);
                    }}
                    className="relative aspect-[16/9.5] w-full max-h-[360px] bg-zinc-900 overflow-hidden cursor-pointer group/img"
                  >
                    {/* Current Screenshot */}
                    <img
                      src={currentScreenshot}
                      alt={`${project.name} Screenshot`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
                    />

                    {/* Top Bar Overlay: Counter & Zoom Hint */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-200 shadow-md">
                        Project {index + 1} of {projects.length} • Screenshot {activeScreenshotIndex + 1}/{project.screenshots.length}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-zinc-800 text-[11px] font-mono text-zinc-300 group-hover/img:text-white transition-colors shadow-md">
                          🔍 Expand
                        </span>
                      )}
                    </div>

                    {/* Left & Right Screenshot Navigation Arrows inside image */}
                    {isActive && project.screenshots.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handlePrevSlide(project.id, project.screenshots.length, e)}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-black border border-zinc-700 text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-all shadow-xl z-10 text-sm"
                          title="Previous Screenshot"
                        >
                          ‹
                        </button>

                        <button
                          onClick={(e) => handleNextSlide(project.id, project.screenshots.length, e)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-black border border-zinc-700 text-white flex items-center justify-center opacity-85 hover:opacity-100 transition-all shadow-xl z-10 text-sm"
                          title="Next Screenshot"
                        >
                          ›
                        </button>
                      </>
                    )}

                    {/* Bottom Screenshot Indicator Dots */}
                    {isActive && project.screenshots.length > 1 && (
                      <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 pointer-events-none">
                        {project.screenshots.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              activeScreenshotIndex === i ? "w-5 bg-white" : "w-1.5 bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* BODY: Creator Info & Description */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
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
                            <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                              {project.name}
                            </h3>
                            <span className="text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 rounded-md">
                              {project.tagline}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 font-mono mt-0.5">
                            by <span className="text-white font-semibold">{project.creator.name}</span> • <span className="text-zinc-400">{project.creator.school}</span>
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4 font-normal">
                        {project.description}
                      </p>

                      {/* Tech Stack Badges */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-md bg-zinc-900 text-[11px] font-mono text-zinc-300 border border-zinc-800"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* BOTTOM: Mobile Next/Prev Arrows & Engagement Bar */}
                    <div className="pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
                      {/* Clear Visible Like Button */}
                      <button
                        onClick={(e) => toggleLike(project.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                          isLiked
                            ? "bg-rose-950/80 border-rose-700 text-rose-300 shadow-sm shadow-rose-950"
                            : "bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white"
                        }`}
                      >
                        <svg
                          className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 stroke-rose-500" : "fill-none stroke-current"}`}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                        <span className="font-semibold">{likeCount} Likes</span>
                      </button>

                      {/* Comment Count */}
                      <div className="flex items-center gap-1.5 text-zinc-400">
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span>{project.stats.comments} Comments</span>
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

        {/* Mobile Next / Prev Project Navigation Buttons */}
        <div className="flex sm:hidden justify-center items-center gap-4 mt-6">
          <button
            onClick={handlePrevProject}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs flex items-center gap-1.5"
          >
            ‹ Prev Project
          </button>
          <span className="text-xs font-mono text-zinc-500">
            {activeProjectIndex + 1} / {projects.length}
          </span>
          <button
            onClick={handleNextProject}
            className="px-5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-mono text-xs flex items-center gap-1.5"
          >
            Next Project ›
          </button>
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
