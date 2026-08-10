"use client";

import React, { useState } from "react";

export default function InteractiveBackgroundGrid() {
  const [hoveredBoxes, setHoveredBoxes] = useState<Record<string, boolean>>({});

  const totalRows = 36;
  const rows = Array.from({ length: totalRows });
  const boxesPerRow = [0, 1, 2]; // 3 boxes cluster per row

  const handleMouseEnter = (id: string) => {
    setHoveredBoxes((prev) => ({ ...prev, [id]: true }));
  };

  const handleMouseLeave = (id: string) => {
    // Fading light trail effect
    setTimeout(() => {
      setHoveredBoxes((prev) => ({ ...prev, [id]: false }));
    }, 450);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {/* LEFT CURVY SNAKE PATH: 3 Boxes Cluster */}
      <div className="absolute inset-y-0 left-0 w-72 pointer-events-auto flex flex-col justify-between py-16 px-2">
        {rows.map((_, rowIdx) => {
          const progress = rowIdx / (totalRows - 1);
          // Modest 75px amplitude curve taking a balanced side portion
          const offsetPx = Math.sin(progress * 2.5 * Math.PI) * 75 + 15;

          return (
            <div
              key={`left-row-${rowIdx}`}
              style={{ transform: `translateX(${offsetPx}px)` }}
              className="flex items-center gap-1.5 transition-transform duration-300"
            >
              {boxesPerRow.map((boxIdx) => {
                const id = `left-${rowIdx}-${boxIdx}`;
                const isHovered = hoveredBoxes[id];

                return (
                  <div
                    key={id}
                    onMouseEnter={() => handleMouseEnter(id)}
                    onMouseLeave={() => handleMouseLeave(id)}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md border transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? "bg-white border-white shadow-[0_0_20px_rgba(255,255,255,1)] scale-125 z-40"
                        : "bg-zinc-900/90 border-zinc-700/80 hover:border-zinc-300 hover:bg-zinc-800"
                    }`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* RIGHT CURVY SNAKE PATH: 3 Boxes Cluster */}
      <div className="absolute inset-y-0 right-0 w-72 pointer-events-auto flex flex-col items-end justify-between py-16 px-2">
        {rows.map((_, rowIdx) => {
          const progress = rowIdx / (totalRows - 1);
          // Modest -75px amplitude curve taking a balanced side portion
          const offsetPx = -(Math.sin(progress * 2.5 * Math.PI) * 75 + 15);

          return (
            <div
              key={`right-row-${rowIdx}`}
              style={{ transform: `translateX(${offsetPx}px)` }}
              className="flex items-center gap-1.5 transition-transform duration-300"
            >
              {boxesPerRow.map((boxIdx) => {
                const id = `right-${rowIdx}-${boxIdx}`;
                const isHovered = hoveredBoxes[id];

                return (
                  <div
                    key={id}
                    onMouseEnter={() => handleMouseEnter(id)}
                    onMouseLeave={() => handleMouseLeave(id)}
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md border transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? "bg-white border-white shadow-[0_0_20px_rgba(255,255,255,1)] scale-125 z-40"
                        : "bg-zinc-900/90 border-zinc-700/80 hover:border-zinc-300 hover:bg-zinc-800"
                    }`}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
