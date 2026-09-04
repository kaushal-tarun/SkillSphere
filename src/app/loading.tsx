import React from "react";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 bg-[#faf6f0] flex flex-col items-center justify-center font-sans antialiased text-zinc-900 select-none">
      <div className="flex flex-col items-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Icon Mark */}
        <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-white flex items-center justify-center font-mono font-black text-xl shadow-lg border border-zinc-800 animate-pulse">
          S
        </div>

        {/* Brand Name & Loading Indicator */}
        <div className="space-y-2 text-center">
          <div className="font-mono text-xs font-bold tracking-widest text-zinc-900 uppercase">
            SkillSphere
          </div>
          <div className="w-36 h-1 bg-[#e8e2d8] rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-zinc-900 rounded-full w-1/2 animate-[shimmer_1.5s_infinite_linear]" 
                 style={{
                   animation: "loadingProgress 1.4s ease-in-out infinite alternate"
                 }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loadingProgress {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 70%; }
          100% { transform: translateX(200%); width: 40%; }
        }
      `}</style>
    </div>
  );
}
