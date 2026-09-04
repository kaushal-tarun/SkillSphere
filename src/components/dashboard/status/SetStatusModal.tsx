"use client";

import React, { useState, useEffect } from "react";
import {
  StatusType,
  StatusAnimationRenderer,
} from "./PixelStatusAnimations";

export interface DeveloperStatusData {
  type: StatusType;
  label: string;
  message?: string;
  updatedAt?: string;
}

interface SetStatusModalProps {
  isOpen: boolean;
  currentStatus: DeveloperStatusData;
  onClose: () => void;
  onSave: (status: DeveloperStatusData) => void;
  onClear?: () => void;
}

const STATUS_PRESETS: {
  type: StatusType;
  label: string;
}[] = [
  {
    type: "tired",
    label: "Tired",
  },
  {
    type: "busy",
    label: "Busy",
  },
  {
    type: "competing",
    label: "Competing",
  },
  {
    type: "focused",
    label: "Focused",
  },
];

export function SetStatusModal({
  isOpen,
  currentStatus,
  onClose,
  onSave,
  onClear,
}: SetStatusModalProps) {
  const [selectedType, setSelectedType] = useState<StatusType>(currentStatus.type || "busy");

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedType(currentStatus.type || "busy");
    }
  }, [isOpen, currentStatus]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentPreset = STATUS_PRESETS.find((p) => p.type === selectedType) || STATUS_PRESETS[0];

  const handleSave = () => {
    onSave({
      type: selectedType,
      label: currentPreset.label,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white border border-[#e8e2d8] rounded-2xl shadow-2xl p-6 space-y-5 font-mono text-xs text-zinc-900 relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
            <h2 className="text-base font-bold text-zinc-900 tracking-tight">Set Status</h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="w-7 h-7 rounded-lg bg-[#f4efe6] hover:bg-zinc-900 hover:text-white text-zinc-600 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* 4 Status Animation Option Cards */}
        <div className="grid grid-cols-2 gap-3">
          {STATUS_PRESETS.map((preset) => {
            const isSelected = selectedType === preset.type;
            return (
              <div
                key={preset.type}
                onClick={() => setSelectedType(preset.type)}
                className={`relative p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-between text-center gap-2.5 group ${
                  isSelected
                    ? "bg-white border-zinc-900 shadow-md ring-2 ring-zinc-900/10"
                    : "bg-[#faf7f2] border-[#e8e2d8] hover:border-zinc-400 hover:bg-white"
                }`}
              >
                {/* Selected Indicator Dot */}
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-zinc-900" />
                )}

                {/* Animated Pixel Sprite Canvas */}
                <div className="w-16 h-16 rounded-xl bg-white border border-[#e2dacd] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform overflow-hidden p-1">
                  <StatusAnimationRenderer type={preset.type} size={58} />
                </div>

                {/* Only Clean Status Label */}
                <span className="text-xs font-extrabold text-zinc-900 block">
                  {preset.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Live Active Preview */}
        <div className="p-3.5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white border border-[#e2dacd] flex items-center justify-center shrink-0 shadow-2xs p-1">
            <StatusAnimationRenderer type={selectedType} size={52} />
          </div>
          <div>
            <span className="text-sm font-black text-zinc-900 block">
              {currentPreset.label}
            </span>
            <span className="text-[10px] text-zinc-400">Selected</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <div>
            {onClear && (
              <button
                type="button"
                onClick={() => {
                  onClear();
                  onClose();
                }}
                className="px-3 py-1.5 rounded-xl text-zinc-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-[#f4efe6] hover:bg-[#e8e2d8] text-zinc-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Save Status</span>
              <span>✓</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
