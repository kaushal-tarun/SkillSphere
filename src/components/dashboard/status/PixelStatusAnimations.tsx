"use client";

import React from "react";

export type StatusType = "tired" | "busy" | "competing" | "focused";

interface AnimationProps {
  size?: number;
  className?: string;
}

/**
 * 1. TIRED: Black pixelated person sleeping with rhythmic breathing,
 * floating pixel 'Zzz', and an expanding/popping nose bubble.
 */
export function SleepingPersonAnimation({ size = 56, className = "" }: AnimationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{ shapeRendering: "crispEdges" }}
      >
        <defs>
          <style>{`
            @keyframes breatheAnim {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-1.5px); }
            }
            @keyframes bubbleAnim {
              0%, 15% { transform: scale(0.2); opacity: 0; }
              20% { opacity: 0.85; }
              75% { transform: scale(1.1); opacity: 0.9; }
              88% { transform: scale(1.35); opacity: 1; }
              92% { transform: scale(1.5); opacity: 0; }
              100% { transform: scale(0.2); opacity: 0; }
            }
            @keyframes z1Anim {
              0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
              25% { opacity: 1; }
              75% { opacity: 0.85; }
              100% { transform: translate(-10px, -20px) scale(1); opacity: 0; }
            }
            @keyframes z2Anim {
              0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
              25% { opacity: 1; }
              75% { opacity: 0.85; }
              100% { transform: translate(-8px, -22px) scale(1.1); opacity: 0; }
            }
            @keyframes z3Anim {
              0% { transform: translate(0, 0) scale(0.6); opacity: 0; }
              25% { opacity: 1; }
              75% { opacity: 0.9; }
              100% { transform: translate(-6px, -24px) scale(1.25); opacity: 0; }
            }
            .sleep-body {
              animation: breatheAnim 2.4s ease-in-out infinite;
              transform-origin: bottom center;
            }
            .sleep-bubble {
              animation: bubbleAnim 2.8s ease-in-out infinite;
              transform-origin: 22px 34px;
            }
            .z-letter-1 {
              animation: z1Anim 2.6s linear infinite;
            }
            .z-letter-2 {
              animation: z2Anim 2.6s linear infinite 0.85s;
            }
            .z-letter-3 {
              animation: z3Anim 2.6s linear infinite 1.7s;
            }
          `}</style>
        </defs>

        {/* Floor/Mattress line */}
        <rect x="6" y="50" width="52" height="3" fill="#18181b" />
        <rect x="8" y="53" width="48" height="2" fill="#71717a" opacity="0.3" />

        {/* Pillow */}
        <rect x="10" y="42" width="16" height="8" rx="2" fill="#e4e4e7" stroke="#18181b" strokeWidth="1.5" />

        {/* Sleeper Body (Rhythmic breathing) */}
        <g className="sleep-body">
          {/* Head */}
          <rect x="20" y="34" width="14" height="12" rx="2" fill="#18181b" />
          {/* Sleeping eye closed (- -) */}
          <rect x="22" y="39" width="4" height="1.5" fill="#fafafa" />
          
          {/* Blanket / Torso curled up */}
          <rect x="30" y="38" width="22" height="12" rx="3" fill="#18181b" />
          <rect x="34" y="40" width="16" height="8" fill="#27272a" />
          {/* Blanket fold stripes */}
          <rect x="38" y="40" width="2" height="8" fill="#3f3f46" />
          <rect x="44" y="40" width="2" height="8" fill="#3f3f46" />

          {/* Sleeping nose bubble */}
          <g className="sleep-bubble">
            <circle cx="20" cy="34" r="5.5" fill="#38bdf8" fillOpacity="0.45" stroke="#0284c7" strokeWidth="1.2" />
            <circle cx="18.5" cy="32.5" r="1.5" fill="#ffffff" fillOpacity="0.8" />
          </g>
        </g>

        {/* Floating Zzz letters */}
        <g transform="translate(18, 28)">
          <g className="z-letter-1">
            <path
              d="M0,0 H4 L1,3 H4 V4 H0 L3,1 H0 Z"
              fill="#0ea5e9"
            />
          </g>
          <g className="z-letter-2">
            <path
              d="M0,0 H5 L1.5,4 H5 V5 H0 L3.5,1 H0 Z"
              fill="#38bdf8"
            />
          </g>
          <g className="z-letter-3">
            <path
              d="M0,0 H6 L2,5 H6 V6 H0 L4,1 H0 Z"
              fill="#0284c7"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * 2. BUSY: Black pixelated person with a hammer hammering down on an anvil/block
 * with strike impact recoil and flying sparks!
 */
export function HammeringPersonAnimation({ size = 56, className = "" }: AnimationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{ shapeRendering: "crispEdges" }}
      >
        <defs>
          <style>{`
            @keyframes armHammerSwing {
              0%, 15% { transform: rotate(-55deg); }
              38% { transform: rotate(-65deg); }
              48% { transform: rotate(18deg); }
              54% { transform: rotate(18deg); }
              72% { transform: rotate(-15deg); }
              100% { transform: rotate(-55deg); }
            }
            @keyframes anvilImpact {
              0%, 47% { transform: translateY(0); }
              48% { transform: translateY(1.5px); }
              55% { transform: translateY(0); }
              100% { transform: translateY(0); }
            }
            @keyframes sparkA {
              0%, 47% { opacity: 0; transform: translate(0, 0) scale(0); }
              49% { opacity: 1; transform: translate(-8px, -10px) scale(1.2); }
              68% { opacity: 0; transform: translate(-14px, -16px) scale(0.4); }
              100% { opacity: 0; }
            }
            @keyframes sparkB {
              0%, 47% { opacity: 0; transform: translate(0, 0) scale(0); }
              49% { opacity: 1; transform: translate(6px, -12px) scale(1.2); }
              68% { opacity: 0; transform: translate(12px, -18px) scale(0.4); }
              100% { opacity: 0; }
            }
            @keyframes sparkC {
              0%, 47% { opacity: 0; transform: translate(0, 0) scale(0); }
              49% { opacity: 1; transform: translate(-2px, -14px) scale(1.4); }
              68% { opacity: 0; transform: translate(-4px, -22px) scale(0.5); }
              100% { opacity: 0; }
            }
            .hammer-arm {
              animation: armHammerSwing 0.9s cubic-bezier(0.4, 0, 0.2, 1) infinite;
              transform-origin: 38px 30px;
            }
            .anvil-group {
              animation: anvilImpact 0.9s ease-out infinite;
            }
            .spark-1 {
              animation: sparkA 0.9s ease-out infinite;
            }
            .spark-2 {
              animation: sparkB 0.9s ease-out infinite;
            }
            .spark-3 {
              animation: sparkC 0.9s ease-out infinite;
            }
          `}</style>
        </defs>

        {/* Floor line */}
        <rect x="4" y="52" width="56" height="3" fill="#18181b" />

        {/* Anvil on the left */}
        <g className="anvil-group">
          {/* Anvil top horn/plate */}
          <rect x="8" y="38" width="18" height="5" rx="1" fill="#27272a" stroke="#18181b" strokeWidth="1" />
          <rect x="6" y="39" width="3" height="3" fill="#3f3f46" />
          {/* Anvil neck & base */}
          <rect x="12" y="43" width="10" height="5" fill="#18181b" />
          <rect x="9" y="48" width="16" height="4" fill="#27272a" stroke="#18181b" strokeWidth="1" />

          {/* Glowing Red/Orange Metal Workpiece being hammered */}
          <rect x="14" y="35" width="7" height="3" fill="#f97316" stroke="#ea580c" strokeWidth="0.8" />
        </g>

        {/* Sparks on impact */}
        <g transform="translate(18, 35)">
          <rect className="spark-1" x="0" y="0" width="2.5" height="2.5" fill="#eab308" />
          <rect className="spark-2" x="0" y="0" width="2.5" height="2.5" fill="#f97316" />
          <rect className="spark-3" x="0" y="0" width="3" height="3" fill="#ffffff" />
        </g>

        {/* Black Pixel Person (Standing at right) */}
        {/* Legs */}
        <rect x="36" y="44" width="4" height="8" fill="#18181b" />
        <rect x="43" y="44" width="4" height="8" fill="#18181b" />
        {/* Torso */}
        <rect x="35" y="28" width="12" height="16" rx="2" fill="#18181b" />
        {/* Belt */}
        <rect x="35" y="38" width="12" height="2" fill="#e4e4e7" opacity="0.4" />
        {/* Head */}
        <rect x="37" y="17" width="9" height="10" rx="1" fill="#18181b" />
        {/* Focus eye */}
        <rect x="38" y="21" width="2" height="2" fill="#ffffff" />

        {/* Arm & Hammer (Swings down on the anvil) */}
        <g className="hammer-arm">
          {/* Arm */}
          <rect x="35" y="28" width="12" height="4" rx="1" fill="#18181b" />
          {/* Hammer Handle */}
          <rect x="22" y="27" width="14" height="2.5" rx="0.5" fill="#d97706" />
          {/* Hammer Head (Iron mallet) */}
          <rect x="18" y="22" width="6" height="12" rx="1" fill="#27272a" stroke="#18181b" strokeWidth="1" />
          <rect x="17" y="25" width="8" height="6" fill="#52525b" />
        </g>
      </svg>
    </div>
  );
}

/**
 * 3. COMPETING: The iconic Google Chrome Running Pixel Dinosaur (T-Rex)!
 * Alternating running pixel legs, running ground dots, and dust particles.
 */
export function GoogleRunningDinoAnimation({ size = 56, className = "" }: AnimationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{ shapeRendering: "crispEdges" }}
      >
        <defs>
          <style>{`
            @keyframes dinoLegsRun {
              0%, 49% { opacity: 1; }
              50%, 100% { opacity: 0; }
            }
            @keyframes dinoLegsRunAlt {
              0%, 49% { opacity: 0; }
              50%, 100% { opacity: 1; }
            }
            @keyframes groundScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-24px); }
            }
            @keyframes dustPuff {
              0% { opacity: 0.8; transform: translate(0, 0) scale(1); }
              50% { opacity: 0.5; transform: translate(-4px, -2px) scale(1.2); }
              100% { opacity: 0; transform: translate(-8px, -4px) scale(0.4); }
            }
            @keyframes miniCactus {
              0% { transform: translateX(45px); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateX(-45px); opacity: 0; }
            }
            .dino-leg-frame-1 {
              animation: dinoLegsRun 0.22s steps(1) infinite;
            }
            .dino-leg-frame-2 {
              animation: dinoLegsRunAlt 0.22s steps(1) infinite;
            }
            .ground-track {
              animation: groundScroll 0.4s linear infinite;
            }
            .dino-dust {
              animation: dustPuff 0.3s ease-out infinite;
            }
            .passing-cactus {
              animation: miniCactus 2.4s linear infinite;
            }
          `}</style>
        </defs>

        {/* Scrolling Ground Line with gaps */}
        <g className="ground-track">
          <rect x="0" y="50" width="16" height="2" fill="#18181b" />
          <rect x="20" y="50" width="8" height="2" fill="#18181b" />
          <rect x="32" y="50" width="24" height="2" fill="#18181b" />
          <rect x="60" y="50" width="16" height="2" fill="#18181b" />
          <rect x="80" y="50" width="12" height="2" fill="#18181b" />
          {/* Ground bump dots */}
          <rect x="8" y="53" width="2" height="1" fill="#71717a" />
          <rect x="36" y="53" width="3" height="1" fill="#71717a" />
          <rect x="68" y="53" width="2" height="1" fill="#71717a" />
        </g>

        {/* Passing mini obstacle in background */}
        <g className="passing-cactus">
          <rect x="52" y="44" width="2.5" height="6" fill="#18181b" opacity="0.75" />
          <rect x="50" y="46" width="2" height="2.5" fill="#18181b" opacity="0.75" />
          <rect x="54.5" y="45" width="2" height="2.5" fill="#18181b" opacity="0.75" />
        </g>

        {/* Dust behind running dino */}
        <g className="dino-dust" transform="translate(10, 48)">
          <rect x="0" y="0" width="2" height="2" fill="#a1a1aa" />
          <rect x="-3" y="1" width="1.5" height="1.5" fill="#d4d4d8" />
        </g>

        {/* GOOGLE DINO PIXEL SILHOUETTE */}
        <g transform="translate(16, 12)">
          {/* Head & Snout */}
          <rect x="14" y="2" width="14" height="12" fill="#18181b" />
          {/* Snout lower jaw */}
          <rect x="20" y="14" width="8" height="3" fill="#18181b" />
          {/* Dino Eye (Classic square white cut-out) */}
          <rect x="16" y="4" width="2" height="2" fill="#ffffff" />

          {/* Neck & Body */}
          <rect x="10" y="12" width="6" height="18" fill="#18181b" />
          <rect x="6" y="16" width="8" height="14" fill="#18181b" />
          {/* Tail */}
          <rect x="0" y="14" width="4" height="4" fill="#18181b" />
          <rect x="2" y="18" width="6" height="6" fill="#18181b" />
          {/* Little Front Arm */}
          <rect x="16" y="20" width="4" height="2" fill="#18181b" />
          <rect x="18" y="22" width="2" height="3" fill="#18181b" />

          {/* LEG ANIMATION: Frame 1 (Left Leg Down, Right Leg Bent) */}
          <g className="dino-leg-frame-1">
            {/* Left Leg: straight down to ground */}
            <rect x="8" y="28" width="3" height="10" fill="#18181b" />
            <rect x="8" y="36" width="5" height="2" fill="#18181b" />
            {/* Right Leg: bent backward */}
            <rect x="13" y="28" width="3" height="6" fill="#18181b" />
            <rect x="15" y="32" width="3" height="2" fill="#18181b" />
          </g>

          {/* LEG ANIMATION: Frame 2 (Right Leg Down, Left Leg Bent) */}
          <g className="dino-leg-frame-2">
            {/* Left Leg: bent forward/up */}
            <rect x="7" y="28" width="3" height="6" fill="#18181b" />
            <rect x="5" y="32" width="3" height="2" fill="#18181b" />
            {/* Right Leg: straight down to ground */}
            <rect x="12" y="28" width="3" height="10" fill="#18181b" />
            <rect x="12" y="36" width="5" height="2" fill="#18181b" />
          </g>
        </g>
      </svg>
    </div>
  );
}

/**
 * 4. FOCUSED: Black pixelated hacker with headphones typing rapidly on a glowing laptop,
 * with steaming coffee mug and blinking cursor.
 */
export function FocusedHackerAnimation({ size = 56, className = "" }: AnimationProps) {
  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 64 64"
        className="w-full h-full"
        style={{ shapeRendering: "crispEdges" }}
      >
        <defs>
          <style>{`
            @keyframes typingL {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-2px); }
            }
            @keyframes typingR {
              0%, 100% { transform: translateY(-2px); }
              50% { transform: translateY(0); }
            }
            @keyframes screenPulse {
              0%, 100% { opacity: 0.9; }
              50% { opacity: 1; filter: drop-shadow(0 0 3px rgba(34, 197, 94, 0.7)); }
            }
            @keyframes steamFloat {
              0% { opacity: 0; transform: translateY(0) scale(0.6); }
              40% { opacity: 0.8; }
              100% { opacity: 0; transform: translateY(-8px) scale(1.1); }
            }
            .type-hand-l {
              animation: typingL 0.18s ease-in-out infinite;
            }
            .type-hand-r {
              animation: typingR 0.18s ease-in-out infinite;
            }
            .laptop-screen {
              animation: screenPulse 1.2s ease-in-out infinite;
            }
            .steam-puff {
              animation: steamFloat 1.8s ease-out infinite;
            }
          `}</style>
        </defs>

        {/* Desk line */}
        <rect x="4" y="50" width="56" height="3" fill="#18181b" />

        {/* Steaming Coffee Mug on Left */}
        <rect x="8" y="42" width="6" height="8" rx="1" fill="#e4e4e7" stroke="#18181b" strokeWidth="1" />
        <path d="M14,44 Q17,46 14,48" fill="none" stroke="#18181b" strokeWidth="1" />
        {/* Steam */}
        <g className="steam-puff" transform="translate(10, 39)">
          <path d="M0,0 Q2,-3 0,-6" fill="none" stroke="#a1a1aa" strokeWidth="1" strokeDasharray="1 1" />
        </g>

        {/* Glowing Laptop */}
        {/* Base */}
        <rect x="18" y="47" width="18" height="3" rx="0.5" fill="#27272a" stroke="#18181b" strokeWidth="0.8" />
        {/* Screen */}
        <polygon points="20,47 23,32 37,32 34,47" fill="#18181b" />
        <polygon className="laptop-screen" points="21.5,45 24,34 35.5,34 33,45" fill="#15803d" />
        {/* Code lines on screen */}
        <line x1="25" y1="36" x2="33" y2="36" stroke="#4ade80" strokeWidth="1" />
        <line x1="24.5" y1="39" x2="31" y2="39" stroke="#86efac" strokeWidth="1" />
        <line x1="24" y1="42" x2="29" y2="42" stroke="#4ade80" strokeWidth="1" />

        {/* Pixel Developer with Headphones */}
        {/* Body */}
        <rect x="36" y="34" width="14" height="16" rx="2" fill="#18181b" />
        {/* Head */}
        <rect x="38" y="20" width="11" height="12" rx="2" fill="#18181b" />
        {/* Headband */}
        <path d="M37,24 C37,17 50,17 50,24" fill="none" stroke="#6366f1" strokeWidth="2" />
        {/* Earcups */}
        <rect x="36" y="23" width="2.5" height="6" rx="1" fill="#4f46e5" />
        <rect x="48.5" y="23" width="2.5" height="6" rx="1" fill="#4f46e5" />

        {/* Eyes (focused forward at screen) */}
        <rect x="38" y="25" width="2" height="2" fill="#ffffff" />

        {/* Hands typing fast */}
        <rect className="type-hand-l" x="26" y="44" width="4" height="3" rx="1" fill="#18181b" />
        <rect className="type-hand-r" x="30" y="43" width="4" height="3" rx="1" fill="#18181b" />
      </svg>
    </div>
  );
}

/**
 * Unified Status Animation Renderer
 */
export function StatusAnimationRenderer({
  type,
  size = 56,
  className = "",
}: {
  type: StatusType;
  size?: number;
  className?: string;
}) {
  switch (type) {
    case "tired":
      return <SleepingPersonAnimation size={size} className={className} />;
    case "busy":
      return <HammeringPersonAnimation size={size} className={className} />;
    case "competing":
      return <GoogleRunningDinoAnimation size={size} className={className} />;
    case "focused":
      return <FocusedHackerAnimation size={size} className={className} />;
    default:
      return <GoogleRunningDinoAnimation size={size} className={className} />;
  }
}
