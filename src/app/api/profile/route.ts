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

    if (username && username.trim()) {
      targetUser = await prisma.user.findFirst({
        where: { username: username.toLowerCase().trim() },
        include: { profile: true, projects: true },
      });
    }

    if (!targetUser && session?.user?.email) {
      targetUser = await prisma.user.findFirst({
        where: { email: session.user.email },
        include: { profile: true, projects: true },
      });
    }

    if (!targetUser) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const projectsCount = targetUser.projects.length;
    const totalXp = projectsCount * 500;
    const level = Math.floor(totalXp / 500) + 1;

    if (targetUser.xp !== totalXp) {
      await prisma.user.update({
        where: { id: targetUser.id },
        data: { xp: totalXp },
      }).catch(() => {});
    }

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
        avatar: targetUser.avatar || undefined,
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

const ABUSIVE_WORDS = [
  "fuck", "shit", "bitch", "asshole", "bastard", "crap", "dick", "pussy",
  "cock", "slut", "whore", "idiot", "stupid", "dumb", "hate", "scam",
  "nigger", "faggot", "chink", "retard", "cunt"
];

function containsAbusiveWords(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return ABUSIVE_WORDS.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    return regex.test(lower);
  });
}

// PUT /api/profile - Update profile details in Neon PostgreSQL
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name, username, bio, university, role, location, avatar } = body;

    if (
      containsAbusiveWords(name) ||
      containsAbusiveWords(username) ||
      containsAbusiveWords(bio) ||
      containsAbusiveWords(university) ||
      containsAbusiveWords(role) ||
      containsAbusiveWords(location)
    ) {
      return NextResponse.json({ error: "Inappropriate or abusive language is not allowed" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const currentUser = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

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
        avatar: avatar !== undefined ? avatar.trim() : undefined,
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

// DELETE /api/profile - Permanently delete active user account and all cascading data from PostgreSQL
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const currentUser = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Delete user from PostgreSQL (cascades to profile, projects, posts, comments, likes, messages, friendships)
    await prisma.user.delete({
      where: { id: currentUser.id },
    });

    return NextResponse.json({ success: true, message: "Account successfully deleted" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/profile error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
