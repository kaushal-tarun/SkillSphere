"use client";

import React, { useState, useEffect } from "react";

export default function StarterSplash({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0); 

  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Animation timing sequence
    const t1 = setTimeout(() => setStep(1), 200);   // Show logo
    const t2 = setTimeout(() => setStep(2), 900);   // Show "SkillSphere"
    const t3 = setTimeout(() => setStep(3), 1600);  // Show "Showcase"
    const t4 = setTimeout(() => setStep(4), 2300);  // Show "Connect"
    const t5 = setTimeout(() => setStep(5), 3000);  // Show "Build & Grow"
    const t6 = setTimeout(() => setStep(6), 3900);  // Automatic zoom-in transition
    const t7 = setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 4600); // Animation complete

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
      clearTimeout(t7);
    };
  }, [onComplete]);

  const handleSkip = () => {
    setStep(6);
    setTimeout(() => {
      setIsDone(true);
      if (onComplete) onComplete();
    }, 500);
  };

  if (isDone) return null;

  return (
    <div
      onClick={handleSkip}
      className={`fixed inset-0 z-50 bg-[#faf6f0] flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden transition-all duration-700 ease-in-out ${
        step === 6 ? "scale-150 opacity-0 pointer-events-none" : "scale-100 opacity-100"
      }`}
    >
      {/* Ambient Glow behind Logo */}
      <div
        className={`absolute w-96 h-96 rounded-full bg-amber-200/20 blur-[130px] pointer-events-none transition-all duration-1000 ${
          step >= 1 ? "opacity-100 scale-110" : "opacity-0 scale-50"
        }`}
      />

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg -translate-y-8 sm:-translate-y-14">
        {/* Step 1: Starter Logo */}
        <div
          className={`relative transition-all duration-700 ease-out mb-6 ${
            step >= 1 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4"
          }`}
        >
          <img
            src="/SSblacky.png"
            alt="SkillSphere Starter Logo"
            className="w-32 h-32 sm:w-44 sm:h-44 object-contain"
          />
        </div>

        {/* Step 2: Main Brand Title */}
        <h1
          className={`text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-900 transition-all duration-700 ease-out mb-6 ${
            step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          SkillSphere
        </h1>

        {/* Step 3, 4, 5: Phrase Sequence */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-base sm:text-xl font-medium tracking-wide">
          <span
            className={`px-4 py-1.5 rounded-full bg-white border border-[#e2dacd] text-zinc-800 shadow-sm transition-all duration-500 ease-out ${
              step >= 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
            }`}
          >
            Compete & Rank
          </span>

          <span
            className={`text-zinc-400 font-bold transition-all duration-500 ${
              step >= 4 ? "opacity-100" : "opacity-0"
            }`}
          >
            •
          </span>

          <span
            className={`px-4 py-1.5 rounded-full bg-white border border-[#e2dacd] text-zinc-800 shadow-sm transition-all duration-500 ease-out ${
              step >= 4 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
            }`}
          >
            Connect Builders
          </span>

          <span
            className={`text-zinc-400 font-bold transition-all duration-500 ${
              step >= 5 ? "opacity-100" : "opacity-0"
            }`}
          >
            •
          </span>

          <span
            className={`px-4 py-1.5 rounded-full bg-white border border-[#e2dacd] text-zinc-800 shadow-sm transition-all duration-500 ease-out ${
              step >= 5 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
            }`}
          >
            Build & Grow
          </span>
        </div>
      </div>

      {/* Skip Prompt */}
      <div className="absolute bottom-8 text-xs font-mono text-zinc-500 animate-pulse">
        Click anywhere to skip
      </div>
    </div>
  );
}
