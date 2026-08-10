"use client";

import React, { useState, useEffect } from "react";

export default function StarterSplash({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(0); 
  // Step 0: Initial state
  // Step 1: Logo visible
  // Step 2: "SkillSphere" title visible
  // Step 3: "Showcase" visible
  // Step 4: "Connect" visible
  // Step 5: "Build & Grow" visible
  // Step 6: Automatic zoom-in transition out

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
      className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden transition-all duration-700 ease-in-out ${
        step === 6 ? "scale-150 opacity-0 pointer-events-none" : "scale-100 opacity-100"
      }`}
    >
      {/* Ambient Glow behind Logo */}
      <div
        className={`absolute w-96 h-96 rounded-full bg-white/10 blur-[130px] pointer-events-none transition-all duration-1000 ${
          step >= 1 ? "opacity-100 scale-110" : "opacity-0 scale-50"
        }`}
      />

      {/* Main Content Container (Shifted slightly upward) */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg -translate-y-8 sm:-translate-y-14">
        {/* Step 1: Starter Logo (Black Logo, Clean Transparent, No Box) */}
        <div
          className={`relative transition-all duration-700 ease-out mb-6 ${
            step >= 1 ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 translate-y-4"
          }`}
        >
          <img
            src="/SSblacky.png"
            alt="SkillSphere Starter Logo"
            className="w-32 h-32 sm:w-44 sm:h-44 object-contain drop-shadow-[0_10px_25px_rgba(255,255,255,0.15)]"
          />
        </div>

        {/* Step 2: Main Brand Title */}
        <h1
          className={`text-4xl sm:text-6xl font-extrabold tracking-tight text-white transition-all duration-700 ease-out mb-6 ${
            step >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          SkillSphere
        </h1>

        {/* Step 3, 4, 5: One-by-One Phrase Sequence */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-base sm:text-xl font-medium tracking-wide">
          {/* Word 1: Compete & Rank */}
          <span
            className={`px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-200 transition-all duration-500 ease-out ${
              step >= 3 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
            }`}
          >
            Compete & Rank
          </span>

          {/* Dot divider 1 */}
          <span
            className={`text-zinc-600 transition-opacity duration-300 ${
              step >= 4 ? "opacity-100" : "opacity-0"
            }`}
          >
            •
          </span>

          {/* Word 2: Earn XP & Badges */}
          <span
            className={`px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-200 transition-all duration-500 ease-out ${
              step >= 4 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
            }`}
          >
            Earn XP & Badges
          </span>

          {/* Dot divider 2 */}
          <span
            className={`text-zinc-600 transition-opacity duration-300 ${
              step >= 5 ? "opacity-100" : "opacity-0"
            }`}
          >
            •
          </span>

          {/* Word 3: Connect & Rise */}
          <span
            className={`px-4 py-1.5 rounded-full bg-white text-black font-semibold shadow-lg shadow-white/10 transition-all duration-500 ease-out ${
              step >= 5 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90"
            }`}
          >
            Connect & Rise
          </span>
        </div>
      </div>

      {/* Skip Hint */}
      <div
        className={`absolute bottom-8 text-xs font-mono text-zinc-500 transition-opacity duration-500 ${
          step >= 2 ? "opacity-70" : "opacity-0"
        }`}
      >
        Click anywhere to skip
      </div>
    </div>
  );
}
