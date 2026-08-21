import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/profile - Fetch profile, total XP, level, and repos from Neon PostgreSQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const session = await auth();
    let targetUser = null;

    if (session?.user?.email) {
      targetUser = await prisma.user.findFirst({
        where: { email: session.user.email },
        include: { profile: true, projects: true },
      });
    }

    if (!targetUser && username) {
      targetUser = await prisma.user.findFirst({
        where: { username: username.toLowerCase().trim() },
        include: { profile: true, projects: true },
      });
    }

    if (!targetUser) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const projectsCount = targetUser.projects.length;
    const totalXp = targetUser.xp || targetUser.profile?.totalXp || projectsCount * 500;
    const level = Math.floor(totalXp / 500) + 1;

    return NextResponse.json({
      profile: {
        id: targetUser.id,
        name: targetUser.name,
        username: targetUser.username,
        email: targetUser.email,
        university: targetUser.profile?.university || targetUser.university || "University Student",
        role: targetUser.profile?.role || targetUser.role || "Full-Stack Engineer & AI Developer",
        location: targetUser.profile?.location || targetUser.location || "India",
        bio: targetUser.profile?.bio || "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
        xp: totalXp,
        level,
        projectsCount,
        verified: targetUser.verified,
        createdAt: new Date(targetUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

// PUT /api/profile - Update profile details in Neon PostgreSQL
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, username, bio, university, role, location } = body;

    const session = await auth();
    let currentUser = null;

    if (session?.user?.email) {
      currentUser = await prisma.user.findFirst({
        where: { email: session.user.email },
      });
    }

    if (!currentUser && username) {
      currentUser = await prisma.user.findFirst({
        where: { username: username.toLowerCase().trim() },
      });
    }

    if (!currentUser) {
      return NextResponse.json({ error: "User session not found" }, { status: 404 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name: name !== undefined ? name.trim() : undefined,
        university: university !== undefined ? university.trim() : undefined,
        role: role !== undefined ? role.trim() : undefined,
        location: location !== undefined ? location.trim() : undefined,
      },
    });

    const updatedProfile = await prisma.profile.upsert({
      where: { userId: currentUser.id },
      update: {
        bio: bio !== undefined ? bio.trim() : undefined,
        university: university !== undefined ? university.trim() : undefined,
        role: role !== undefined ? role.trim() : undefined,
        location: location !== undefined ? location.trim() : undefined,
      },
      create: {
        userId: currentUser.id,
        bio: bio !== undefined ? bio.trim() : "",
        university: university !== undefined ? university.trim() : "University Student",
        role: role !== undefined ? role.trim() : "Developer",
        location: location !== undefined ? location.trim() : "India",
      },
    });

    return NextResponse.json({
      success: true,
      profile: {
        id: updatedUser.id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        university: updatedProfile.university || updatedUser.university || "University Student",
        role: updatedProfile.role || updatedUser.role || "Developer",
        location: updatedProfile.location || updatedUser.location || "India",
        bio: updatedProfile.bio || "",
      },
    }, { status: 200 });
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
