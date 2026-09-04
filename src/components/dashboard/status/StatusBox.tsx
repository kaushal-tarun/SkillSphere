"use client";

import React, { useState, useEffect } from "react";
import { UserProfile } from "@/types/dashboard";
import {
  StatusAnimationRenderer,
  StatusType,
} from "./PixelStatusAnimations";
import {
  SetStatusModal,
  DeveloperStatusData,
} from "./SetStatusModal";

interface StatusBoxProps {
  user: UserProfile;
  isOwnProfile?: boolean;
}

const DEFAULT_LABELS: Record<StatusType, string> = {
  busy: "Busy",
  tired: "Tired",
  competing: "Competing",
  focused: "Focused",
};

export function StatusBox({ user, isOwnProfile = true }: StatusBoxProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusData, setStatusData] = useState<DeveloperStatusData>({
    type: "busy",
    label: "Busy",
  });

  const storageKey = `skillsphere_dev_status_${user.username.toLowerCase()}`;

  // Load saved status from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.type && DEFAULT_LABELS[parsed.type as StatusType]) {
          setStatusData({
            type: parsed.type,
            label: DEFAULT_LABELS[parsed.type as StatusType],
          });
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load developer status from localStorage", e);
    }

    // Default fallback
    setStatusData({
      type: "busy",
      label: "Busy",
    });
  }, [storageKey, user.username]);

  const handleSaveStatus = (newStatus: DeveloperStatusData) => {
    setStatusData({
      type: newStatus.type,
      label: DEFAULT_LABELS[newStatus.type] || newStatus.label,
    });
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          type: newStatus.type,
          label: DEFAULT_LABELS[newStatus.type] || newStatus.label,
        })
      );
    } catch (e) {
      console.warn("Failed to persist developer status", e);
    }
  };

  const handleClearStatus = () => {
    const cleared: DeveloperStatusData = {
      type: "busy",
      label: "Busy",
    };
    setStatusData(cleared);
    try {
      localStorage.removeItem(storageKey);
    } catch (e) {
      console.warn("Failed to clear developer status", e);
    }
  };

  const getStatusDot = (type: StatusType) => {
    switch (type) {
      case "tired":
        return "bg-amber-500 ring-amber-500/20";
      case "busy":
        return "bg-orange-500 ring-orange-500/20";
      case "competing":
        return "bg-emerald-500 ring-emerald-500/20";
      case "focused":
        return "bg-indigo-500 ring-indigo-500/20";
      default:
        return "bg-emerald-500 ring-emerald-500/20";
    }
  };

  return (
    <>
      <div
        onClick={() => {
          if (isOwnProfile) setIsModalOpen(true);
        }}
        className={`p-5 sm:p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm space-y-4 font-mono transition-all ${
          isOwnProfile ? "hover:border-zinc-400 cursor-pointer group" : ""
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`flex h-2 w-2 rounded-full ring-4 ${getStatusDot(
                statusData.type
              )}`}
            />
            <h3 className="text-sm font-bold text-zinc-900 tracking-tight">
              Status
            </h3>
          </div>

          {isOwnProfile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#f4efe6] group-hover:bg-zinc-900 group-hover:text-white border border-[#e2dacd] text-zinc-700 text-[11px] font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
              title="Change your status"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              <span>Set Status</span>
            </button>
          )}
        </div>

        {/* Status Content Card: Large Animation + Only Clean Status Label */}
        <div className="p-4 sm:p-5 rounded-xl bg-[#f4efe6] border border-[#e2dacd] flex items-center gap-5">
          {/* Animated Pixel Sprite Container (Significantly Enlarged) */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-[#e2dacd] shadow-xs flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform p-1">
            <StatusAnimationRenderer
              type={statusData.type}
              size={88}
              className="drop-shadow-xs"
            />
          </div>

          {/* Only the clean status label */}
          <div>
            <span className="text-lg sm:text-xl font-black text-zinc-900 tracking-tight">
              {statusData.label}
            </span>
          </div>
        </div>
      </div>

      {/* Set Status Modal */}
      {isOwnProfile && (
        <SetStatusModal
          isOpen={isModalOpen}
          currentStatus={statusData}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStatus}
          onClear={handleClearStatus}
        />
      )}
    </>
  );
}
