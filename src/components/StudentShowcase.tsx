"use client";

import React, { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";

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
        avatarBg: "bg-zinc-900",
      },
      description:
        "AI-powered document indexing & semantic search platform for university research papers, lecture notes, and codebase queries.",
      stats: {
        baseLikes: 342,
        comments: 48,
        xp: "+1,850 XP",
      },
      tags: ["Next.js 16", "Python", "Vector DB"],
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
        avatarBg: "bg-zinc-900",
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
        avatarBg: "bg-zinc-900",
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
        avatarBg: "bg-zinc-900",
      },
      description:
        "Low-overhead developer performance telemetry tool tracking real-time API latency and microservices execution.",
      stats: {
        baseLikes: 412,
        comments: 52,
        xp: "+2,100 XP",
      },
      tags: ["Go", "OpenTelemetry", "Docker"],
    },
    {
      id: 5,
      name: "Algorank",
      tagline: "Algorithmic Duel Arena",
      screenshots: ["/algorank_ss.jpg"],
      creator: {
        name: "Ananya Vasisht",
        school: "IISc Bangalore '25",
        avatar: "AV",
        avatarBg: "bg-zinc-900",
      },
      description:
        "Head-to-head competitive coding battleground with real-time testcase execution engine in isolated WebAssembly sandboxes.",
      stats: {
        baseLikes: 640,
        comments: 98,
        xp: "+3,200 XP",
      },
      tags: ["Rust", "Wasm", "TypeScript"],
    },
  ];

  const handleNextProject = () => {
    setActiveProjectIndex((prev) => (prev + 1) % projects.length);
  };

  const handlePrevProject = () => {
    setActiveProjectIndex((prev) => (prev - 1 + projects.length) % projects.length);
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
    <section id="showcase" className="py-20 bg-[#faf6f0] text-zinc-900 relative overflow-hidden border-t border-[#e8e2d8]">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-200/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal>
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-900">
              What Students Build Here
            </h2>
            <p className="text-sm sm:text-base text-zinc-700">
              Browse live project screenshot previews, test feature walkthroughs, like student creations, and see proof of work.
            </p>

          {/* Project Quick Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-4 font-mono">
            {projects.map((proj, idx) => (
              <button
                key={proj.id}
                onClick={() => setActiveProjectIndex(idx)}
                className={`px-4 py-1.5 rounded-xl text-xs transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  activeProjectIndex === idx
                    ? "bg-zinc-900 text-white font-bold shadow-md scale-105"
                    : "bg-white text-zinc-700 border border-[#e8e2d8] hover:text-zinc-900 hover:border-zinc-400"
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
          {/* Previous Project Arrow Button */}
          <button
            onClick={handlePrevProject}
            className="hidden sm:flex absolute left-2 md:left-6 lg:left-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-zinc-900 hover:bg-black text-white font-bold items-center justify-center text-2xl shadow-md transition-all duration-300 group cursor-pointer"
            title="Previous Project"
          >
            <span className="group-hover:-translate-x-0.5 transition-transform">‹</span>
          </button>

          {/* Next Project Arrow Button */}
          <button
            onClick={handleNextProject}
            className="hidden sm:flex absolute right-2 md:right-6 lg:right-12 top-1/2 -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-zinc-900 hover:bg-black text-white font-bold items-center justify-center text-2xl shadow-md transition-all duration-300 group cursor-pointer"
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

              let positionStyles = "";
              if (isActive) {
                positionStyles = "z-30 scale-100 opacity-100 translate-x-0 shadow-lg border-[#e8e2d8]";
              } else if (isNext) {
                positionStyles = "z-10 scale-[0.85] opacity-50 hover:opacity-80 translate-x-[55%] sm:translate-x-[50%] md:translate-x-[45%] border-[#e8e2d8] cursor-pointer hidden sm:flex";
              } else if (isPrev) {
                positionStyles = "z-10 scale-[0.85] opacity-50 hover:opacity-80 -translate-x-[55%] sm:-translate-x-[50%] md:-translate-x-[45%] border-[#e8e2d8] cursor-pointer hidden sm:flex";
              } else {
                positionStyles = "z-0 scale-75 opacity-0 pointer-events-none hidden";
              }

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (!isActive) setActiveProjectIndex(index);
                  }}
                  className={`absolute w-full group rounded-3xl border bg-white text-zinc-900 overflow-hidden shadow-md transition-all duration-500 flex flex-col justify-between ${positionStyles}`}
                >
                  {/* TOP: Screenshot Preview Container */}
                  <div
                    onClick={() => {
                      if (isActive) openLightbox(project.id, activeScreenshotIndex);
                    }}
                    className="relative aspect-[16/9.5] w-full max-h-[360px] bg-zinc-100 overflow-hidden cursor-pointer group/img"
                  >
                    <img
                      src={currentScreenshot}
                      alt={`${project.name} Screenshot`}
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.02]"
                    />

                    {/* Top Bar Overlay */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                      <span className="px-2.5 py-0.5 rounded-md bg-white/90 border border-zinc-200 text-[11px] font-mono text-zinc-800 shadow-sm">
                        Project {index + 1} of {projects.length} • Slide {activeScreenshotIndex + 1}/{project.screenshots.length}
                      </span>
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-md bg-white/90 border border-zinc-200 text-[11px] font-mono text-zinc-800 font-bold shadow-sm">
                          🔍 Expand
                        </span>
                      )}
                    </div>

                    {/* Screenshot Navigation Arrows */}
                    {isActive && project.screenshots.length > 1 && (
                      <>
                        <button
                          onClick={(e) => handlePrevSlide(project.id, project.screenshots.length, e)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white font-bold flex items-center justify-center text-sm transition-all shadow-md cursor-pointer"
                        >
                          ‹
                        </button>
                        <button
                          onClick={(e) => handleNextSlide(project.id, project.screenshots.length, e)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-900 text-white font-bold flex items-center justify-center text-sm transition-all shadow-md cursor-pointer"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* BOTTOM: Content & Details */}
                  <div className="p-6 bg-white space-y-4">
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center">
                            {project.creator.avatar}
                          </div>
                          <div>
                            <span className="text-zinc-900 font-bold text-sm tracking-tight">{project.creator.name}</span>
                            <span className="text-[11px] font-mono text-zinc-500 ml-2">{project.creator.school}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono text-zinc-500 font-medium">{project.tagline}</span>
                      </div>

                      <h3 className="text-xl font-bold text-zinc-900 tracking-tight">{project.name}</h3>

                      <p className="text-xs text-zinc-600 font-normal leading-relaxed mt-1 line-clamp-2">
                        {project.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {project.tags.map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 rounded-md bg-[#f4efe6] text-[11px] font-mono text-zinc-800 border border-[#e2dacd]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Engagement Bar */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs font-mono">
                      <button
                        onClick={(e) => toggleLike(project.id, e)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                          isLiked
                            ? "bg-zinc-900 border-zinc-900 text-white font-bold shadow-sm"
                            : "bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-800"
                        }`}
                      >
                        <svg className={`w-3.5 h-3.5 ${isLiked ? "fill-white stroke-white" : "fill-none stroke-current"}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{likeCount} Likes</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-zinc-500">
                        <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <span>{project.stats.comments} Comments</span>
                      </div>

                      <div className="flex items-center gap-1 text-zinc-900 font-bold bg-[#f4efe6] px-2.5 py-1 rounded-lg border border-[#e2dacd] text-xs">
                        <span>{project.stats.xp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex sm:hidden justify-center items-center gap-4 mt-6 font-mono text-xs">
          <button
            onClick={handlePrevProject}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold shadow-sm"
          >
            ‹ Prev
          </button>
          <span className="text-zinc-500">
            {activeProjectIndex + 1} / {projects.length}
          </span>
          <button
            onClick={handleNextProject}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white font-bold shadow-sm"
          >
            Next ›
          </button>
        </div>
        </ScrollReveal>
      </div>

      {/* FULL-SCREEN LIGHTBOX MODAL */}
      {lightbox.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={closeLightbox} />

          <div className="relative z-10 w-full max-w-5xl bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div>
                <h3 className="text-base font-bold text-zinc-900">{currentLightboxProject.name}</h3>
                <p className="text-xs font-mono text-zinc-500">{currentLightboxProject.tagline}</p>
              </div>
              <button
                onClick={closeLightbox}
                className="text-zinc-500 hover:text-zinc-900 font-mono text-sm px-2 py-1 cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto max-h-[70vh] flex items-center justify-center bg-zinc-100">
              <img
                src={currentLightboxProject.screenshots[lightbox.slideIndex]}
                alt="Expanded Screenshot"
                className="w-full h-auto object-contain rounded-xl shadow-md max-h-[65vh]"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
