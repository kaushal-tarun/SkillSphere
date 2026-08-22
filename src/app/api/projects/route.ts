import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/projects - Fetch all projects from Neon PostgreSQL
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true,
            university: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = projects.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      visibility: p.visibility,
      stars: p.stars,
      commits: p.commits,
      likes: p.likesCount,
      daysActive: Math.max(1, Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24))),
      tech: p.tech,
      githubUrl: p.githubUrl || undefined,
      creatorName: p.user?.name || "Student Builder",
      creatorHandle: p.user?.username || "builder",
      university: p.user?.university || "University",
      updatedAt: new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

    return NextResponse.json({ projects: formatted }, { status: 200 });
  } catch (error) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
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

// POST /api/projects - Create a new project in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, tech, githubUrl, demoUrl, status, problemSolved, inspiration, biggestChallenge, teamType, teamMembers, screenshots, username } = body;

    if (!name || !description) {
      return NextResponse.json({ error: "Project name and description are required" }, { status: 400 });
    }

    if (
      containsAbusiveWords(name) ||
      containsAbusiveWords(description) ||
      containsAbusiveWords(JSON.stringify(tech)) ||
      containsAbusiveWords(problemSolved) ||
      containsAbusiveWords(inspiration) ||
      containsAbusiveWords(biggestChallenge) ||
      containsAbusiveWords(JSON.stringify(teamMembers))
    ) {
      return NextResponse.json({ error: "Inappropriate or abusive language is not allowed" }, { status: 400 });
    }

    const session = await auth();
    let targetUser = null;

    if (session?.user?.email) {
      targetUser = await prisma.user.findFirst({
        where: { email: session.user.email },
      });
    }

    if (!targetUser && username) {
      targetUser = await prisma.user.findFirst({
        where: { username: username.toLowerCase().trim() },
      });
    }

    // Fallback: if user doesn't exist in DB yet, create or find first user
    if (!targetUser) {
      const fallbackUsername = username ? username.toLowerCase().trim() : "builder";
      targetUser = await prisma.user.upsert({
        where: { username: fallbackUsername },
        update: {},
        create: {
          name: username || "Student Builder",
          username: fallbackUsername,
          email: `${fallbackUsername}@skillsphere.dev`,
          password: "hashed_placeholder",
          university: "University Student",
        },
      });
    }

    const newProject = await prisma.project.create({
      data: {
        userId: targetUser.id,
        name: name.trim(),
        description: description.trim(),
        tech: Array.isArray(tech) ? tech : [],
        githubUrl: githubUrl || null,
        status: status || "Active",
        stars: 1,
        commits: 1,
        likesCount: 0,
      },
      include: {
        user: true,
      },
    });

    // Increment user XP by 500 for shipping a project
    await prisma.user.update({
      where: { id: targetUser.id },
      data: {
        xp: { increment: 500 },
      },
    }).catch(() => {});

    const formatted = {
      id: newProject.id,
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      visibility: newProject.visibility,
      stars: newProject.stars,
      commits: newProject.commits,
      likes: newProject.likesCount,
      daysActive: 1,
      tech: newProject.tech,
      githubUrl: newProject.githubUrl || undefined,
      creatorName: targetUser.name,
      creatorHandle: targetUser.username,
      university: targetUser.university || "University",
      updatedAt: "Just now",
      problemSolved,
      inspiration,
      biggestChallenge,
      teamType,
      teamMembers,
      screenshots,
    };

    return NextResponse.json({ project: formatted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

// DELETE /api/projects - Delete a project in Neon PostgreSQL
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
