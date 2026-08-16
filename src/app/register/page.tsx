"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"register" | "login">("register");

  // Registration Form State
  const [regData, setRegData] = useState({
    username: "",
    name: "",
    university: "",
    password: "",
    confirmPassword: "",
  });

  // Login Form State
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

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

    if (!regData.username || !regData.password) {
      setError("Please enter a username and password.");
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
          name: regData.name || regData.username,
          username: regData.username,
          university: regData.university,
          password: regData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
      } else {
        const signInRes = await signIn("credentials", {
          identifier: regData.username,
          password: regData.password,
          redirect: false,
        });

        if (signInRes?.error) {
          setError(signInRes.error);
        } else {
          // Save registered account profile into skillsphere_users_db in localStorage
          try {
            const newAcc = {
              id: data.user?.id || `usr_${Date.now()}`,
              name: regData.name || regData.username,
              username: regData.username.toLowerCase().trim().replace(/\s+/g, "_"),
              university: regData.university || "University Student",
              xp: 1000,
              level: 1,
              projects: 0,
              avatar: (regData.name || regData.username).slice(0, 2).toUpperCase(),
            };
            const existingUsers = JSON.parse(localStorage.getItem("skillsphere_users_db") || "[]");
            const updatedUsers = [newAcc, ...existingUsers.filter((u: any) => u.username.toLowerCase() !== newAcc.username)];
            localStorage.setItem("skillsphere_users_db", JSON.stringify(updatedUsers));
            localStorage.setItem("user", JSON.stringify(newAcc));
          } catch (e) {
            console.error("Failed to store user profile in localStorage", e);
          }

          setSuccess("Account created successfully! Redirecting...");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 800);
        }
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

    if (!loginData.username || !loginData.password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    try {
      const cleanUsername = loginData.username.toLowerCase().trim().replace(/\s+/g, "_");

      const res = await signIn("credentials", {
        identifier: cleanUsername,
        password: loginData.password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid username or password.");
      } else {
        try {
          const existingUsers = JSON.parse(localStorage.getItem("skillsphere_users_db") || "[]");
          const matchedUser = existingUsers.find((u: any) => u.username.toLowerCase() === cleanUsername);

          const loggedInProfile = matchedUser || {
            id: `usr_${cleanUsername}`,
            name: loginData.username,
            username: cleanUsername,
            university: "University Student",
            xp: 1000,
            level: 1,
            projects: 0,
            avatar: loginData.username.slice(0, 2).toUpperCase(),
          };

          localStorage.setItem("user", JSON.stringify(loggedInProfile));
          const updatedUsers = [loggedInProfile, ...existingUsers.filter((u: any) => u.username.toLowerCase() !== cleanUsername)];
          localStorage.setItem("skillsphere_users_db", JSON.stringify(updatedUsers));
        } catch (e) {
          console.error("Failed to update user session on login", e);
        }

        setSuccess("Welcome back! Redirecting to Dashboard...");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError("");
    signIn("google", { callbackUrl: "/dashboard" });
  };

  const toggleAuthMode = (mode: "register" | "login") => {
    setError("");
    setSuccess("");
    setAuthMode(mode);
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans bg-black relative overflow-hidden select-none">
      {/* Top-Left Navigation */}
      <div className="absolute top-6 left-6 sm:left-10 z-40">
        <Link
          href="/"
          className={`inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-full shadow-xl transition-all group border ${
            authMode === "register"
              ? "text-zinc-200 bg-black hover:bg-zinc-900 border-zinc-800"
              : "text-black bg-white hover:bg-zinc-100 border-zinc-200"
          }`}
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Split Screen Grid */}
      <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2 flex-1 relative z-10">
        
        {/* LEFT COLUMN */}
        <div className="bg-white text-black px-6 sm:px-12 lg:px-16 pt-6 pb-8 flex flex-col justify-between relative z-10 min-h-[550px] lg:min-h-full transition-all duration-700 ease-in-out">
          {/* Brand Header */}
          <div className="flex items-center justify-end w-full pt-2">
            <div className="inline-flex items-center gap-2.5">
              <img src="/SSblacky.png" alt="SkillSphere Logo" className="h-7 w-auto object-contain" />
              <span className="text-xs font-extrabold tracking-widest text-black uppercase font-mono">SKILLSPHERE</span>
            </div>
          </div>

          {/* REGISTER MODE: Headline & Animations */}
          {authMode === "register" ? (
            <div className="space-y-6 my-auto max-w-lg -translate-y-4 animate-in fade-in slide-in-from-left-6 duration-500">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none space-y-1">
                <span className="block text-black">Build.</span>
                <span className="block bg-gradient-to-r from-black via-zinc-800 to-zinc-600 bg-clip-text text-transparent">
                  Compete.
                </span>
                <span className="block text-zinc-400">Rise.</span>
              </h1>

              {/* 3 Retro 8-Bit Pixel Animations */}
              <div className="pt-2 pb-2">
                <div className="inline-flex items-center gap-3 sm:gap-4 p-3 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm">
                  {/* Hammer Builder */}
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
                    </svg>
                  </div>

                  <span className="text-zinc-400 font-mono text-sm">➔</span>

                  {/* Runner */}
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

                  {/* Rising Sun */}
                  <div className="p-2 rounded-xl bg-white border border-zinc-200 shadow-sm flex items-center justify-center" title="Rise">
                    <svg className="w-10 h-10 sm:w-12 sm:h-12 text-black animate-sun-rise" viewBox="0 0 24 24" fill="currentColor" style={{ shapeRendering: "crispEdges" }}>
                      <rect x="1" y="19" width="22" height="2" fill="#71717a" />
                      <rect x="4" y="21" width="16" height="1" fill="#52525b" />
                      <rect x="8" y="8" width="8" height="8" fill="#000000" />
                      <rect x="9" y="7" width="6" height="1" fill="#000000" />
                      <rect x="9" y="16" width="6" height="1" fill="#000000" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* LOGIN CARD IN LEFT COLUMN */
            <div className="w-full max-w-md mx-auto my-auto relative p-[1.5px] rounded-[28px] overflow-hidden group animate-in fade-in slide-in-from-left-8 duration-500">
              {/* Rotating Conic Gradient Beam creating traveling dark border line */}
              <div className="absolute -inset-[150%] animate-spin-border bg-[conic-gradient(from_90deg_at_50%_50%,#ffffff_0%,#ffffff_70%,#000000_92%,#ffffff_100%)] opacity-90 pointer-events-none" />

              <div className="w-full rounded-[26px] border border-zinc-200 bg-white p-6 sm:p-8 shadow-2xl relative overflow-hidden z-10 space-y-4">
                <div className="text-center mb-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-black">Log in to your account</h2>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
                    ⚠️ {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono">
                    ✓ {success}
                  </div>
                )}

                {/* Google Sign-in Option */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-900 font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:border-zinc-400 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-3 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200" /></div>
                  <span className="relative bg-white px-3 font-mono text-[10px] text-zinc-400 uppercase">OR</span>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-700 mb-1">Username</label>
                    <input
                      type="text"
                      name="username"
                      value={loginData.username}
                      onChange={handleLoginChange}
                      placeholder="e.g. advait_d"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-700 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter password"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-300 text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-bold text-xs sm:text-sm shadow-xl transition-all cursor-pointer"
                  >
                    {loading ? "Signing In..." : "Log In ➔"}
                  </button>
                </form>

                <div className="mt-4 pt-3 border-t border-zinc-200 text-center font-mono text-xs text-zinc-600">
                  <span>Don't have an account? </span>
                  <button
                    onClick={() => toggleAuthMode("register")}
                    className="text-black font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign up ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-xs font-mono text-zinc-400 pt-2">
            SkillSphere © {new Date().getFullYear()} • Student Developer Network
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="bg-black text-white p-4 sm:p-8 lg:p-12 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-700 ease-in-out">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-white/5 blur-[140px] rounded-full pointer-events-none" />

          {authMode === "register" ? (
            /* REGISTER CARD IN RIGHT COLUMN */
            <div className="w-full max-w-md my-auto relative p-[1.5px] rounded-[28px] overflow-hidden group animate-in fade-in slide-in-from-right-8 duration-500">
              {/* Rotating Conic Gradient Beam creating traveling white border line */}
              <div className="absolute -inset-[150%] animate-spin-border bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#000000_70%,#ffffff_92%,#000000_100%)] opacity-90 pointer-events-none" />

              <div className="w-full rounded-[26px] border border-zinc-800/90 bg-zinc-950/95 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl shadow-black relative overflow-hidden z-10 space-y-3">
                {/* Top Ambient Glow Line */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                <div className="text-center mb-2">
                  <h2 className="text-xl font-extrabold tracking-tight text-white">Create an account</h2>
                </div>

                {error && (
                  <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-mono">
                    ⚠️ {error}
                  </div>
                )}
                {success && (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-mono">
                    ✓ {success}
                  </div>
                )}

                {/* Google Sign-in Option */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="w-full py-2.5 px-4 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <div className="relative my-2 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-800" /></div>
                  <span className="relative bg-zinc-950 px-3 font-mono text-[10px] text-zinc-500 uppercase">OR</span>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">Username *</label>
                    <input
                      type="text"
                      name="username"
                      value={regData.username}
                      onChange={handleRegChange}
                      placeholder="e.g. advait_d"
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={regData.name}
                      onChange={handleRegChange}
                      placeholder="Advait Deshmukh"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-zinc-300 mb-1">University / Campus</label>
                    <input
                      type="text"
                      name="university"
                      value={regData.university}
                      onChange={handleRegChange}
                      placeholder="e.g. IIT Bombay '26"
                      className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-300 mb-1">Password *</label>
                      <input
                        type="password"
                        name="password"
                        value={regData.password}
                        onChange={handleRegChange}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-zinc-300 mb-1">Confirm *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={regData.confirmPassword}
                        onChange={handleRegChange}
                        placeholder="••••••••"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white font-sans"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-white text-black font-bold font-mono text-xs shadow-lg hover:bg-zinc-200 transition-all cursor-pointer mt-2"
                  >
                    {loading ? "Registering..." : "Create Account ➔"}
                  </button>
                </form>

                <div className="mt-3 pt-3 border-t border-zinc-800 text-center font-mono text-xs text-zinc-400">
                  <span>Already have an account? </span>
                  <button
                    onClick={() => toggleAuthMode("login")}
                    className="text-white font-bold hover:underline cursor-pointer ml-1"
                  >
                    Log In ➔
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* RIGHT COLUMN SLOGAN IN LOGIN MODE */
            <div className="space-y-6 my-auto max-w-lg -translate-y-4 animate-in fade-in slide-in-from-right-6 duration-500 text-center">
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-none">
                Build. Compete. Rise.
              </h1>
              <p className="text-zinc-400 text-sm font-normal">
                Join student developers showcasing verified proof-of-work on SkillSphere.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}