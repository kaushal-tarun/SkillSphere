"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"register" | "login">("register");

  // Registration Form State
  const [regData, setRegData] = useState({
    name: "",
    username: "",
    university: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Login Form State
  const [loginData, setLoginData] = useState({
    identifier: "", // Email OR Username
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!regData.name || !regData.email || !regData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (regData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (regData.password !== regData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regData.name,
          username: regData.username,
          university: regData.university,
          email: regData.email,
          password: regData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
      } else {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setSuccess("Account created successfully! Redirecting to Dashboard...");
        setRegData({ name: "", username: "", university: "", email: "", password: "", confirmPassword: "" });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginData.identifier || !loginData.password) {
      setError("Please enter your email/username and password.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: loginData.identifier,
          password: loginData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid email/username or password.");
      } else {
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        setSuccess(`Welcome back, ${data.user.name}! Redirecting to Dashboard...`);
        setLoginData({ identifier: "", password: "" });
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1000);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = (mode: "register" | "login") => {
    setError("");
    setSuccess("");
    setAuthMode(mode);
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-black relative overflow-hidden">
      {/* Absolute Top-Left 'Back to Arena' Navigation */}
      <div className="absolute top-6 left-6 sm:left-10 z-40">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-full shadow-xl transition-all group border ${
            authMode === "register"
              ? "text-zinc-200 bg-black hover:bg-zinc-900 border-zinc-800"
              : "text-black bg-white hover:bg-zinc-100 border-zinc-200"
          }`}
        >
          <span className="group-hover:-translate-x-1 transition-transform">‹</span>
          <span>Back to Arena</span>
        </Link>
      </div>

      {/* Split Screen 2-Column Gliding Grid */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 flex-1 relative z-10">
        
        {/* LEFT COLUMN (White Side in Register Mode / Contains Login Box when in Login Mode) */}
        <div className="bg-white text-black px-6 sm:px-12 lg:px-16 pt-6 pb-8 flex flex-col justify-between relative z-10 min-h-[550px] lg:min-h-full transition-all duration-700 ease-in-out">
          
          {/* Top Header of Left Column */}
          <div className="flex items-center justify-end w-full pt-2">
            <div className="inline-flex items-center gap-2.5">
              <img src="/SSblacky.png" alt="SkillSphere Logo" className="h-7 w-auto object-contain" />
              <span className="text-xs font-extrabold tracking-widest text-black uppercase font-mono">SKILLSPHERE</span>
            </div>
          </div>

          {/* LEFT COLUMN CONTENT: REGISTER MODE (Brand Slogan + 3 Pixel Animations) */}
          {authMode === "register" ? (
            <div className="space-y-6 my-auto max-w-lg -translate-y-4 animate-in fade-in slide-in-from-left-6 duration-500">
              {/* Build. Compete. Rise. Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none space-y-1">
                <span className="block text-black">Build.</span>
                <span className="block bg-gradient-to-r from-black via-zinc-800 to-zinc-600 bg-clip-text text-transparent">
                  Compete.
                </span>
                <span className="block text-zinc-400">Rise.</span>
              </h1>

              {/* 3 Retro 8-Bit Pixel Animations in Sequence */}
              <div className="pt-2 pb-2">
                <div className="inline-flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
                  {/* 1. Hammer Builder */}
                  <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center" title="Build">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
                      <rect x="14" y="18" width="7" height="3" fill="#000000" />
                      <rect x="15" y="16" width="5" height="2" fill="#52525b" />
                      <rect x="2" y="7" width="5" height="5" fill="#000000" />
                      <rect x="2" y="5" width="6" height="2" fill="#000000" />
                      <rect x="3" y="12" width="5" height="8" fill="#27272a" />
                      <g className="animate-hammer-swing">
                        <rect x="7" y="10" width="5" height="2" fill="#000000" />
                        <rect x="12" y="5" width="2" height="7" fill="#71717a" />
                        <rect x="10" y="3" width="6" height="4" fill="#000000" />
                      </g>
                      <rect x="17" y="14" width="2" height="2" className="animate-spark-flash fill-black" />
                    </svg>
                  </div>

                  <span className="text-zinc-400 font-mono text-sm">➔</span>

                  {/* 2. Running Man */}
                  <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center" title="Compete">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
                      <rect x="2" y="21" width="6" height="1" fill="#71717a" />
                      <rect x="10" y="21" width="8" height="1" fill="#52525b" />
                      <rect x="11" y="4" width="5" height="5" fill="#000000" />
                      <rect x="8" y="9" width="7" height="6" fill="#27272a" />
                      <rect x="4" y="10" width="5" height="2" fill="#000000" />
                      <rect x="14" y="11" width="5" height="2" fill="#000000" />
                      <g className="animate-runner-leg1">
                        <rect x="8" y="15" width="2" height="6" fill="#000000" />
                        <rect x="6" y="19" width="3" height="2" fill="#000000" />
                      </g>
                      <g className="animate-runner-leg2">
                        <rect x="12" y="15" width="2" height="6" fill="#000000" />
                        <rect x="13" y="19" width="3" height="2" fill="#000000" />
                      </g>
                    </svg>
                  </div>

                  <span className="text-zinc-400 font-mono text-sm">➔</span>

                  {/* 3. Rising Sun */}
                  <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center" title="Rise">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black animate-sun-rise" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
                      <rect x="1" y="19" width="22" height="2" fill="#71717a" />
                      <rect x="4" y="21" width="16" height="1" fill="#52525b" />
                      <rect x="8" y="8" width="8" height="8" fill="#000000" />
                      <rect x="9" y="7" width="6" height="1" fill="#000000" />
                      <rect x="9" y="16" width="6" height="1" fill="#000000" />
                      <g className="animate-sun-rays">
                        <rect x="11" y="3" width="2" height="3" fill="#000000" />
                        <rect x="11" y="18" width="2" height="1" fill="#000000" />
                        <rect x="3" y="11" width="3" height="2" fill="#000000" />
                        <rect x="18" y="11" width="3" height="2" fill="#000000" />
                        <rect x="5" y="5" width="2" height="2" fill="#27272a" />
                        <rect x="17" y="5" width="2" height="2" fill="#27272a" />
                        <rect x="5" y="17" width="2" height="2" fill="#27272a" />
                        <rect x="17" y="17" width="2" height="2" fill="#27272a" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* LEFT COLUMN CONTENT: LOGIN MODE (Login Card Glides into White Column) */
            <div className="w-full max-w-md mx-auto my-auto relative p-[1.5px] rounded-[28px] overflow-hidden group animate-in fade-in slide-in-from-left-8 duration-500">
              {/* Rotating Conic Gradient Beam creating a tiny moving black border line */}
              <div className="absolute -inset-[150%] animate-spin-border bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#ffffff_70%,#000000_92%,#ffffff_100%)] opacity-90 pointer-events-none" />

              {/* Inner Login Card Container */}
              <div className="w-full rounded-[26px] border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl relative overflow-hidden z-10">
                
                {/* Form Header Badge */}
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-zinc-200 bg-zinc-100 text-[11px] font-mono text-zinc-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
                    WELCOME BACK BUILDER
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-black mt-2">Log In to SkillSphere</h2>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
                    <svg className="w-4 h-4 shrink-0 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Alert */}
                {success && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
                    <svg className="w-4 h-4 shrink-0 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  {/* Email Address OR Username */}
                  <div>
                    <label className="block text-xs font-mono text-zinc-700 mb-1">Email Address or Username</label>
                    <input
                      type="text"
                      name="identifier"
                      value={loginData.identifier}
                      onChange={handleLoginChange}
                      placeholder="e.g. advait@gmail.com or advait_deshmukh"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-sans"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-mono text-zinc-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Enter your password"
                        required
                        className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all font-sans pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-black transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.047 10.047 0 013.68-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          <span>Logging In...</span>
                        </>
                      ) : (
                        <>
                          <span>Log In</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Switch to Register Link */}
                <div className="mt-5 pt-4 border-t border-zinc-200 text-center font-mono text-xs text-zinc-600">
                  <span>Don&apos;t have an account? </span>
                  <button
                    onClick={() => toggleAuthMode("register")}
                    className="text-black font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Left Footer copyright */}
          <div className="text-xs font-mono text-zinc-400 pt-2">
            SkillSphere © {new Date().getFullYear()} • Engineered for Ambitious Builders
          </div>
        </div>

        {/* RIGHT COLUMN (Black Side in Register Mode / Contains Slogan when in Login Mode) */}
        <div className="bg-black text-white p-4 sm:p-8 lg:p-12 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-700 ease-in-out">
          {/* Subtle Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-white/5 blur-[140px] rounded-full pointer-events-none" />

          {authMode === "register" ? (
            /* RIGHT COLUMN CONTENT: REGISTER MODE (Register Box Card with Traveling White Border Spinner) */
            <div className="w-full max-w-md my-auto relative p-[1.5px] rounded-[28px] overflow-hidden group animate-in fade-in slide-in-from-right-8 duration-500">
              {/* Rotating Conic Gradient Beam creating a tiny moving white border line */}
              <div className="absolute -inset-[150%] animate-spin-border bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#000000_70%,#ffffff_92%,#000000_100%)] opacity-90 pointer-events-none" />

              {/* Inner Register Card Container */}
              <div className="w-full rounded-[26px] border border-zinc-800/90 bg-zinc-950/95 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl shadow-black relative overflow-hidden z-10">
                {/* Top Ambient Glow Line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                {/* Form Header Badge */}
                <div className="text-center mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-[10px] font-mono text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    STUDENT DEVELOPER ARENA
                  </div>
                </div>

                {/* Error Alert */}
                {error && (
                  <div className="mb-3 p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
                    <svg className="w-4 h-4 shrink-0 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                {/* Success Alert */}
                {success && (
                  <div className="mb-3 p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in duration-200">
                    <svg className="w-4 h-4 shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{success}</span>
                  </div>
                )}

                {/* Registration Form */}
                <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={regData.name}
                      onChange={handleRegChange}
                      placeholder="e.g. Advait Deshmukh"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans"
                    />
                  </div>

                  {/* Username Handle */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={regData.username}
                      onChange={handleRegChange}
                      placeholder="e.g. advait_deshmukh"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans"
                    />
                  </div>

                  {/* University / College Name */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">University / College Name</label>
                    <input
                      type="text"
                      name="university"
                      value={regData.university}
                      onChange={handleRegChange}
                      placeholder="e.g. IIT Bombay / BITS Pilani"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans"
                    />
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={regData.email}
                      onChange={handleRegChange}
                      placeholder="e.g. advait@gmail.com"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans"
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={regData.password}
                        onChange={handleRegChange}
                        placeholder="At least 6 characters"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.047 10.047 0 013.68-.763c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">Confirm Password</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={regData.confirmPassword}
                      onChange={handleRegChange}
                      placeholder="Re-enter your password"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-sans"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-black font-bold text-xs sm:text-sm shadow-[0_0_25px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Account</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Footer Navigation */}
                <div className="mt-4 pt-3 border-t border-zinc-900 text-center font-mono text-xs text-zinc-400">
                  <span>Already have an account? </span>
                  <button
                    onClick={() => toggleAuthMode("login")}
                    className="text-white hover:underline font-semibold cursor-pointer ml-1"
                  >
                    Log in
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* RIGHT COLUMN CONTENT: LOGIN MODE (Brand Slogan Glides onto Black Side) */
            <div className="space-y-6 my-auto max-w-lg -translate-y-4 animate-in fade-in slide-in-from-right-6 duration-500">
              {/* Logo Header */}
              <div className="inline-flex items-center gap-2.5 mb-1">
                <img src="/SSwhitey.png" alt="SkillSphere Logo" className="h-8 w-auto object-contain" />
                <span className="text-xs font-extrabold tracking-widest text-white uppercase font-mono">SKILLSPHERE</span>
              </div>

              {/* Build. Compete. Rise. Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none space-y-1">
                <span className="block text-white">Build.</span>
                <span className="block bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                  Compete.
                </span>
                <span className="block text-zinc-400">Rise.</span>
              </h1>

              {/* 3 Retro 8-Bit Pixel Animations in Sequence */}
              <div className="pt-2 pb-2">
                <div className="inline-flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl">
                  {/* 1. Hammer Builder */}
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center" title="Build">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
                      <rect x="14" y="18" width="7" height="3" fill="#ffffff" />
                      <rect x="15" y="16" width="5" height="2" fill="#a1a1aa" />
                      <rect x="2" y="7" width="5" height="5" fill="#ffffff" />
                      <rect x="2" y="5" width="6" height="2" fill="#ffffff" />
                      <rect x="3" y="12" width="5" height="8" fill="#e4e4e7" />
                      <g className="animate-hammer-swing">
                        <rect x="7" y="10" width="5" height="2" fill="#ffffff" />
                        <rect x="12" y="5" width="2" height="7" fill="#71717a" />
                        <rect x="10" y="3" width="6" height="4" fill="#ffffff" />
                      </g>
                      <rect x="17" y="14" width="2" height="2" className="animate-spark-flash fill-white" />
                    </svg>
                  </div>

                  <span className="text-zinc-600 font-mono text-sm">➔</span>

                  {/* 2. Running Man */}
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center" title="Compete">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
                      <rect x="2" y="21" width="6" height="1" fill="#71717a" />
                      <rect x="10" y="21" width="8" height="1" fill="#e4e4e7" />
                      <rect x="11" y="4" width="5" height="5" fill="#ffffff" />
                      <rect x="8" y="9" width="7" height="6" fill="#e4e4e7" />
                      <rect x="4" y="10" width="5" height="2" fill="#ffffff" />
                      <rect x="14" y="11" width="5" height="2" fill="#ffffff" />
                      <g className="animate-runner-leg1">
                        <rect x="8" y="15" width="2" height="6" fill="#ffffff" />
                        <rect x="6" y="19" width="3" height="2" fill="#ffffff" />
                      </g>
                      <g className="animate-runner-leg2">
                        <rect x="12" y="15" width="2" height="6" fill="#ffffff" />
                        <rect x="13" y="19" width="3" height="2" fill="#ffffff" />
                      </g>
                    </svg>
                  </div>

                  <span className="text-zinc-600 font-mono text-sm">➔</span>

                  {/* 3. Rising Sun */}
                  <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center" title="Rise">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-sun-rise" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
                      <rect x="1" y="19" width="22" height="2" fill="#71717a" />
                      <rect x="4" y="21" width="16" height="1" fill="#52525b" />
                      <rect x="8" y="8" width="8" height="8" fill="#ffffff" />
                      <rect x="9" y="7" width="6" height="1" fill="#ffffff" />
                      <rect x="9" y="16" width="6" height="1" fill="#ffffff" />
                      <g className="animate-sun-rays">
                        <rect x="11" y="3" width="2" height="3" fill="#ffffff" />
                        <rect x="11" y="18" width="2" height="1" fill="#ffffff" />
                        <rect x="3" y="11" width="3" height="2" fill="#ffffff" />
                        <rect x="18" y="11" width="3" height="2" fill="#ffffff" />
                        <rect x="5" y="5" width="2" height="2" fill="#e4e4e7" />
                        <rect x="17" y="5" width="2" height="2" fill="#e4e4e7" />
                        <rect x="5" y="17" width="2" height="2" fill="#e4e4e7" />
                        <rect x="17" y="17" width="2" height="2" fill="#e4e4e7" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}