"use client";

import React from "react";

// Base Shimmer Block
export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[#ebe5da] rounded-xl animate-pulse ${className}`}
    />
  );
}

// 1. Full Dashboard Startup Skeleton (Used for initial boot and route transitions)
export function DashboardStartupSkeleton() {
  return (
    <div className="min-h-screen flex bg-[#f8f5ee] font-sans antialiased text-zinc-900">
      {/* Sidebar Skeleton */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#e8e2d8] bg-[#faf6f0] p-5 space-y-6 shrink-0 h-screen sticky top-0">
        {/* Brand Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-[#e8e2d8]">
          <SkeletonBlock className="w-9 h-9 rounded-xl !bg-zinc-800" />
          <div className="space-y-1.5 flex-1">
            <SkeletonBlock className="h-4 w-28 rounded-md !bg-zinc-800" />
            <SkeletonBlock className="h-3 w-16 rounded-md" />
          </div>
        </div>

        {/* Nav Items */}
        <div className="space-y-2 flex-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent">
              <SkeletonBlock className="w-5 h-5 rounded-lg" />
              <SkeletonBlock className={`h-3.5 rounded-md ${i === 1 ? "w-24 !bg-zinc-400" : "w-20"}`} />
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar Skeleton */}
        <header className="sticky top-0 z-30 bg-[#f8f5ee]/80 backdrop-blur-xs px-4 sm:px-8 py-3 flex items-center justify-end">
          <SkeletonBlock className="w-8 h-8 rounded-xl shrink-0" />
        </header>

        {/* Main Content View Skeleton */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-8 py-8 space-y-8">
          <DashboardViewSkeleton />
        </main>
      </div>
    </div>
  );
}

// 2. Dashboard Home View Skeleton (Greeting + 4 Metric Cards + Activity/Standings)
export function DashboardViewSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 w-full">
      {/* Welcome Banner Skeleton */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-7 w-56 rounded-lg" />
              <SkeletonBlock className="h-5 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="h-4 w-72 sm:w-96 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-9 w-32 rounded-xl" />
            <SkeletonBlock className="h-9 w-32 rounded-xl !bg-zinc-800" />
          </div>
        </div>

        {/* Stat Pill Row Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3.5 rounded-2xl bg-[#f8f5ee] border border-[#e8e2d8] space-y-2">
              <SkeletonBlock className="h-3 w-16 rounded-md" />
              <SkeletonBlock className="h-6 w-20 rounded-lg" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Projects List + Activity Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Project Cards Skeleton */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <SkeletonBlock className="h-5 w-36 rounded-md" />
            <SkeletonBlock className="h-4 w-20 rounded-md" />
          </div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <SkeletonBlock className="w-8 h-8 rounded-xl" />
                  <SkeletonBlock className="h-4 w-40 rounded-md" />
                </div>
                <SkeletonBlock className="h-5 w-16 rounded-full" />
              </div>
              <SkeletonBlock className="h-3.5 w-full rounded-md" />
              <SkeletonBlock className="h-3.5 w-3/4 rounded-md" />
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <SkeletonBlock className="h-4 w-14 rounded-md" />
                  <SkeletonBlock className="h-4 w-14 rounded-md" />
                </div>
                <SkeletonBlock className="h-4 w-24 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Right 1 Col: Community Feed / Leaderboard Skeleton */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <SkeletonBlock className="h-4 w-28 rounded-md" />
              <SkeletonBlock className="h-3 w-12 rounded-md" />
            </div>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 py-1">
                <SkeletonBlock className="w-8 h-8 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <SkeletonBlock className="h-3 w-24 rounded-md" />
                  <SkeletonBlock className="h-2.5 w-16 rounded-md" />
                </div>
                <SkeletonBlock className="h-4 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Community Feed View Skeleton
export function CommunityFeedSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      {/* Category Pills Header Skeleton */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBlock key={i} className="h-9 w-24 rounded-2xl" />
          ))}
        </div>
        <SkeletonBlock className="h-9 w-32 rounded-2xl hidden sm:block" />
      </div>

      {/* Post Composer Box Skeleton */}
      <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <SkeletonBlock className="w-10 h-10 rounded-xl shrink-0" />
          <div className="flex-1 space-y-2">
            <SkeletonBlock className="h-16 w-full rounded-xl" />
          </div>
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
          <div className="flex items-center gap-3">
            <SkeletonBlock className="h-7 w-24 rounded-lg" />
            <SkeletonBlock className="h-7 w-24 rounded-lg" />
          </div>
          <SkeletonBlock className="h-8 w-28 rounded-xl !bg-zinc-800" />
        </div>
      </div>

      {/* Feed Post Skeletons */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
            {/* Post Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="w-10 h-10 rounded-xl shrink-0" />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <SkeletonBlock className="h-4 w-28 rounded-md" />
                    <SkeletonBlock className="h-3 w-20 rounded-md" />
                  </div>
                  <SkeletonBlock className="h-2.5 w-32 rounded-md" />
                </div>
              </div>
              <SkeletonBlock className="h-6 w-20 rounded-lg" />
            </div>

            {/* Post Content */}
            <div className="space-y-2 pt-1">
              <SkeletonBlock className="h-3.5 w-full rounded-md" />
              <SkeletonBlock className="h-3.5 w-5/6 rounded-md" />
              <SkeletonBlock className="h-3.5 w-2/3 rounded-md" />
            </div>

            {/* Engagement Action Bar */}
            <div className="flex items-center gap-6 pt-2 border-t border-zinc-100">
              <SkeletonBlock className="h-5 w-16 rounded-md" />
              <SkeletonBlock className="h-5 w-20 rounded-md" />
              <SkeletonBlock className="h-5 w-16 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Projects Grid View Skeleton
export function ProjectsGridSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 w-full">
      {/* Featured Spotlight Banner Skeleton */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <SkeletonBlock className="h-5 w-36 rounded-md !bg-zinc-800" />
          <SkeletonBlock className="h-4 w-28 rounded-md" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <SkeletonBlock className="h-6 w-64 rounded-lg" />
            <SkeletonBlock className="h-3.5 w-full rounded-md" />
            <SkeletonBlock className="h-3.5 w-4/5 rounded-md" />
            <div className="flex gap-2 pt-2">
              <SkeletonBlock className="h-5 w-16 rounded-md" />
              <SkeletonBlock className="h-5 w-16 rounded-md" />
              <SkeletonBlock className="h-5 w-16 rounded-md" />
            </div>
          </div>
          <div className="lg:col-span-1 p-4 rounded-xl bg-[#f4efe6] border border-[#e2dacd] space-y-3">
            <SkeletonBlock className="h-3 w-16 rounded-md" />
            <SkeletonBlock className="h-4 w-32 rounded-md" />
            <SkeletonBlock className="h-8 w-full rounded-xl !bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Filter / Search Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SkeletonBlock className="h-9 w-28 rounded-xl" />
          <SkeletonBlock className="h-9 w-28 rounded-xl" />
        </div>
        <SkeletonBlock className="h-9 w-36 rounded-xl !bg-zinc-800" />
      </div>

      {/* Projects Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <SkeletonBlock className="h-5 w-32 rounded-md" />
              <SkeletonBlock className="h-4 w-16 rounded-full" />
            </div>
            <div className="space-y-1.5">
              <SkeletonBlock className="h-3 w-full rounded-md" />
              <SkeletonBlock className="h-3 w-4/5 rounded-md" />
            </div>
            <div className="flex gap-1.5 pt-1">
              <SkeletonBlock className="h-4 w-12 rounded-md" />
              <SkeletonBlock className="h-4 w-12 rounded-md" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-zinc-100">
              <SkeletonBlock className="h-3.5 w-20 rounded-md" />
              <SkeletonBlock className="h-6 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Discover Showcase View Skeleton
export function DiscoverShowcaseSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      {/* Search and Sort Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <SkeletonBlock className="h-10 w-full sm:w-80 rounded-2xl" />
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-9 w-24 rounded-2xl" />
          <SkeletonBlock className="h-9 w-24 rounded-2xl" />
          <SkeletonBlock className="h-9 w-24 rounded-2xl" />
        </div>
      </div>

      {/* Count Indicator Skeleton */}
      <div className="flex items-center justify-between border-b border-[#e8e2d8] pb-3">
        <SkeletonBlock className="h-4 w-40 rounded-md" />
        <SkeletonBlock className="h-4 w-32 rounded-md" />
      </div>

      {/* Repository Showcase Cards Skeleton */}
      <div className="space-y-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <SkeletonBlock className="h-6 w-48 rounded-lg" />
                  <SkeletonBlock className="h-5 w-20 rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <SkeletonBlock className="h-3.5 w-24 rounded-md" />
                  <SkeletonBlock className="h-3.5 w-32 rounded-md" />
                </div>
              </div>
              <SkeletonBlock className="h-8 w-20 rounded-xl" />
            </div>

            <div className="space-y-1.5">
              <SkeletonBlock className="h-3.5 w-full rounded-md" />
              <SkeletonBlock className="h-3.5 w-3/4 rounded-md" />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <SkeletonBlock className="h-5 w-16 rounded-md" />
                <SkeletonBlock className="h-5 w-16 rounded-md" />
                <SkeletonBlock className="h-5 w-16 rounded-md" />
              </div>
              <SkeletonBlock className="h-6 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Friends & Chat View Skeleton
export function FriendsChatSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      {/* Tabs Skeleton */}
      <div className="flex items-center justify-between border-b border-[#e8e2d8] pb-4">
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-9 w-24 rounded-xl" />
          <SkeletonBlock className="h-9 w-32 rounded-xl !bg-zinc-800" />
          <SkeletonBlock className="h-9 w-28 rounded-xl" />
        </div>
        <SkeletonBlock className="h-9 w-48 rounded-xl hidden sm:block" />
      </div>

      {/* Chat Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px]">
        {/* Left Friends List Drawer Skeleton */}
        <div className="lg:col-span-1 rounded-2xl bg-white border border-[#e8e2d8] p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-3">
            <SkeletonBlock className="h-4 w-28 rounded-md" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl border border-transparent">
                <SkeletonBlock className="w-9 h-9 rounded-xl shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <SkeletonBlock className="h-3.5 w-24 rounded-md" />
                  <SkeletonBlock className="h-2.5 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Active Chat Drawer Skeleton */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#e8e2d8] flex flex-col justify-between p-5 space-y-4">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-10 h-10 rounded-xl" />
              <div className="space-y-1.5">
                <SkeletonBlock className="h-4 w-32 rounded-md" />
                <SkeletonBlock className="h-2.5 w-20 rounded-md" />
              </div>
            </div>
            <SkeletonBlock className="h-7 w-24 rounded-xl" />
          </div>

          {/* Message Thread Placeholders */}
          <div className="flex-1 space-y-4 py-4 overflow-hidden">
            <div className="flex items-start gap-2.5 max-w-[70%]">
              <SkeletonBlock className="w-7 h-7 rounded-lg shrink-0" />
              <SkeletonBlock className="h-12 w-64 rounded-2xl rounded-tl-xs !bg-[#f4efe6]" />
            </div>
            <div className="flex items-start gap-2.5 max-w-[70%] ml-auto flex-row-reverse">
              <SkeletonBlock className="w-7 h-7 rounded-lg shrink-0" />
              <SkeletonBlock className="h-14 w-72 rounded-2xl rounded-tr-xs !bg-zinc-800" />
            </div>
            <div className="flex items-start gap-2.5 max-w-[70%]">
              <SkeletonBlock className="w-7 h-7 rounded-lg shrink-0" />
              <SkeletonBlock className="h-10 w-48 rounded-2xl rounded-tl-xs !bg-[#f4efe6]" />
            </div>
          </div>

          {/* Input Box Skeleton */}
          <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
            <SkeletonBlock className="h-11 flex-1 rounded-xl" />
            <SkeletonBlock className="h-11 w-20 rounded-xl !bg-zinc-800" />
          </div>
        </div>
      </div>
    </div>
  );
}

// 7. Profile View Skeleton (Viewing User or Self)
export function ProfileViewSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column Skeleton */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">
          {/* Top Banner & Identity Card Skeleton */}
          <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <SkeletonBlock className="w-14 h-14 rounded-2xl shrink-0" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <SkeletonBlock className="h-6 w-40 rounded-lg" />
                    <SkeletonBlock className="h-5 w-16 rounded-full" />
                  </div>
                  <SkeletonBlock className="h-3.5 w-32 rounded-md" />
                  <SkeletonBlock className="h-3 w-48 rounded-md" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SkeletonBlock className="h-8 w-24 rounded-xl" />
                <SkeletonBlock className="h-8 w-20 rounded-xl" />
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-zinc-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] space-y-1.5">
                  <SkeletonBlock className="h-2.5 w-14 rounded-md" />
                  <SkeletonBlock className="h-5 w-20 rounded-lg" />
                </div>
              ))}
            </div>
          </div>

          {/* Status Box Skeleton */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <SkeletonBlock className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl shrink-0" />
              <div className="space-y-1.5">
                <SkeletonBlock className="h-3 w-16 rounded-md" />
                <SkeletonBlock className="h-5 w-24 rounded-md" />
              </div>
            </div>
            <SkeletonBlock className="h-8 w-24 rounded-xl" />
          </div>

          {/* Projects Showcase Skeleton */}
          <div className="space-y-4">
            <SkeletonBlock className="h-5 w-36 rounded-md" />
            <div className="space-y-3.5">
              {[1, 2].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <SkeletonBlock className="h-5 w-36 rounded-md" />
                      <SkeletonBlock className="h-3.5 w-3/4 rounded-md" />
                    </div>
                    <SkeletonBlock className="h-7 w-16 rounded-xl shrink-0" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                    <div className="flex gap-1.5">
                      <SkeletonBlock className="h-4 w-12 rounded-md" />
                      <SkeletonBlock className="h-4 w-12 rounded-md" />
                    </div>
                    <SkeletonBlock className="h-3.5 w-16 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-6">
          {/* Tech Stack Skeleton */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
            <SkeletonBlock className="h-4 w-28 rounded-md" />
            <div className="flex flex-wrap gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <SkeletonBlock key={i} className="h-6 w-16 rounded-lg" />
              ))}
            </div>
          </div>

          {/* Badges Skeleton */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
            <SkeletonBlock className="h-4 w-24 rounded-md" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="p-3 rounded-xl bg-[#f4efe6] border border-[#e2dacd] space-y-1.5">
                  <SkeletonBlock className="h-3.5 w-28 rounded-md" />
                  <SkeletonBlock className="h-3 w-40 rounded-md" />
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline Skeleton */}
          <div className="p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs space-y-4">
            <SkeletonBlock className="h-4 w-28 rounded-md" />
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-3 items-start">
                  <SkeletonBlock className="w-2 h-2 rounded-full mt-1.5 shrink-0" />
                  <div className="space-y-1 flex-1">
                    <SkeletonBlock className="h-3.5 w-24 rounded-md" />
                    <SkeletonBlock className="h-3 w-36 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
