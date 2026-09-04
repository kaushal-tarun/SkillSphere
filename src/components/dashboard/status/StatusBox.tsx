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
  const [statusData, setStatusData] = useState<DeveloperStatusData>(() => {
    if (user.status && DEFAULT_LABELS[user.status as StatusType]) {
      return {
        type: user.status as StatusType,
        label: DEFAULT_LABELS[user.status as StatusType],
      };
    }
    return {
      type: null,
      label: "Not Set",
    };
  });

  const storageKey = `skillsphere_dev_status_${user.username.toLowerCase()}`;

  // 1. Load initial status (local cache for instant render + Neon DB for source of truth)
  useEffect(() => {
    if (user.status && DEFAULT_LABELS[user.status as StatusType]) {
      setStatusData({
        type: user.status as StatusType,
        label: DEFAULT_LABELS[user.status as StatusType],
      });
    }
    // A. Check local cache first to avoid any flicker
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.type && DEFAULT_LABELS[parsed.type as StatusType]) {
          setStatusData({
            type: parsed.type,
            label: DEFAULT_LABELS[parsed.type as StatusType],
          });
        } else if (parsed && parsed.type === null) {
          setStatusData({
            type: null,
            label: "Not Set",
          });
        }
      }
    } catch (e) {
      console.warn("Local storage status read error", e);
    }

    // B. Fetch from Neon PostgreSQL database for the specific user
    let isSubscribed = true;
    async function fetchDatabaseStatus() {
      try {
        const res = await fetch(`/api/status?username=${encodeURIComponent(user.username)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.status && DEFAULT_LABELS[data.status as StatusType] && isSubscribed) {
            const dbStatus: DeveloperStatusData = {
              type: data.status as StatusType,
              label: DEFAULT_LABELS[data.status as StatusType],
            };
            setStatusData(dbStatus);
            try {
              localStorage.setItem(storageKey, JSON.stringify(dbStatus));
            } catch {}
          } else if (data && data.status === null && isSubscribed) {
            // DB has no status set for this user -> default to Not Set
            setStatusData({
              type: null,
              label: "Not Set",
            });
            try {
              localStorage.removeItem(storageKey);
            } catch {}
          }
        }
      } catch (err) {
        console.error("Failed to fetch status from database", err);
      }
    }

    fetchDatabaseStatus();

    return () => {
      isSubscribed = false;
    };
  }, [storageKey, user.username]);

  // 2. Save status to Neon PostgreSQL & sync local cache
  const handleSaveStatus = async (newStatus: DeveloperStatusData) => {
    if (!newStatus.type) {
      await handleClearStatus();
      return;
    }

    const updatedStatus: DeveloperStatusData = {
      type: newStatus.type,
      label: DEFAULT_LABELS[newStatus.type] || newStatus.label,
    };

    // Optimistic UI update
    setStatusData(updatedStatus);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedStatus));
    } catch {}

    // Persist to Neon PostgreSQL
    try {
      await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          status: newStatus.type,
        }),
      });
    } catch (e) {
      console.error("Failed to persist status to Neon database", e);
    }
  };

  const handleClearStatus = async () => {
    const cleared: DeveloperStatusData = {
      type: null,
      label: "Not Set",
    };
    setStatusData(cleared);
    try {
      localStorage.removeItem(storageKey);
    } catch {}

    try {
      await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user.username,
          status: null,
        }),
      });
    } catch (e) {
      console.error("Failed to reset status in Neon database", e);
    }
  };

  const getStatusDot = (type: StatusType | null) => {
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
        return "bg-zinc-300 ring-zinc-300/30";
    }
  };

  return (
    <>
      <div
        onClick={() => {
          if (isOwnProfile) setIsModalOpen(true);
        }}
        className={`p-4 sm:p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm flex items-center justify-between gap-4 font-mono transition-all ${
          isOwnProfile ? "hover:border-zinc-400 cursor-pointer group" : ""
        }`}
      >
        {/* Left: Pixel Animation Sprite + Status Title */}
        <div className="flex items-center gap-4 sm:gap-5 min-w-0">
          <div
            className={`w-18 h-18 sm:w-20 sm:h-20 rounded-2xl ${
              statusData.type
                ? "bg-[#f4efe6] border border-[#e2dacd] shadow-2xs"
                : "bg-[#f4efe6]/60 border border-dashed border-[#d5cbbe]"
            } flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform p-1`}
          >
            {statusData.type ? (
              <StatusAnimationRenderer
                type={statusData.type}
                size={76}
                className="drop-shadow-xs"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-400 select-none">
                <svg
                  className="w-5 h-5 stroke-[1.75]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span className="text-[9px] uppercase font-bold tracking-wider mt-0.5 text-zinc-400">
                  None
                </span>
              </div>
            )}
          </div>

          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-2 w-2 rounded-full ring-4 ${getStatusDot(
                  statusData.type
                )}`}
              />
              <span className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider">
                Status
              </span>
            </div>
            <div
              className={`text-base sm:text-xl font-black tracking-tight truncate ${
                statusData.type ? "text-zinc-900" : "text-zinc-400"
              }`}
            >
              {statusData.label}
            </div>
          </div>
        </div>

        {/* Right: Set Status Action or Status Indicator */}
        {isOwnProfile ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 shrink-0 ${
              statusData.type
                ? "bg-[#f4efe6] group-hover:bg-zinc-900 group-hover:text-white border border-[#e2dacd] text-zinc-800"
                : "bg-zinc-900 hover:bg-black text-white border border-zinc-900"
            }`}
            title="Set status"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {statusData.type ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              )}
            </svg>
            <span>Set Status</span>
          </button>
        ) : (
          <span className="px-2.5 py-1 rounded-lg bg-[#f4efe6] border border-[#e2dacd] text-zinc-500 text-[11px] font-bold shrink-0">
            {statusData.type ? "Active" : "Not Set"}
          </span>
        )}
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
