import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/projects - Fetch projects from Neon PostgreSQL (filtered by user or all)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    const scope = searchParams.get("scope"); // "user" | "all"

    const session = await auth();
    let whereClause: any = {};

    if (username && username.trim()) {
      const targetUser = await prisma.user.findFirst({
        where: { username: username.toLowerCase().trim() },
      });
      if (targetUser) {
        whereClause = { userId: targetUser.id };
      } else {
        return NextResponse.json({ projects: [] }, { status: 200 });
      }
    } else if (scope === "user") {
      let currentUser = null;
      if (session?.user?.email) {
        currentUser = await prisma.user.findFirst({
          where: { email: session.user.email },
        });
      }
      if (currentUser) {
        whereClause = { userId: currentUser.id };
      } else {
        return NextResponse.json({ projects: [] }, { status: 200 });
      }
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
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

    const formatted = projects.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      status: p.status,
      visibility: p.visibility,
      stars: p.stars || 0,
      commits: p.commits,
      likes: p.likesCount,
      daysActive: Math.max(1, Math.floor((Date.now() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24))),
      tech: p.tech,
      githubUrl: p.githubUrl || undefined,
      github: p.githubUrl || "",
      creatorName: p.user?.name || "Student Builder",
      creatorHandle: p.user?.username || "builder",
      creatorAvatar: p.user?.avatar || undefined,
      university: p.user?.university || "University",
      updatedAt: new Date(p.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      problemSolved: p.problemSolved || undefined,
      inspiration: p.inspiration || undefined,
      biggestChallenge: p.biggestChallenge || undefined,
      teamType: p.teamType || undefined,
      teamMembers: p.teamMembers || [],
      screenshots: p.screenshots || [],
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

const GITHUB_URL_REGEX = /^https:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+(\/.*)?$/i;

// POST /api/projects - Create a new project in Neon PostgreSQL with professional validation & security
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, tech, githubUrl, demoUrl, status, problemSolved, inspiration, biggestChallenge, teamType, teamMembers, screenshots, username } = body;

    // Rule 5: Must Be Logged In (401 Unauthorized)
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in to publish a project." }, { status: 401 });
    }

    const targetUser = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Unauthorized. User account not found." }, { status: 401 });
    }

    // Rule 1: Project Name Validation (Min 3, Max 100, Trim, No Spaces)
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    if (trimmedName.length < 3 || trimmedName.length > 100) {
      return NextResponse.json({ error: "Project name must be between 3 and 100 characters long." }, { status: 400 });
    }

    if (/\s/.test(trimmedName)) {
      return NextResponse.json({ error: "Project name cannot contain spaces. Use camelCase or hyphens." }, { status: 400 });
    }

    // Rule 8: Prevent Empty Descriptions (Min 10, Max 2000)
    if (!description || !description.trim()) {
      return NextResponse.json({ error: "Project description is required." }, { status: 400 });
    }

    const trimmedDescription = description.trim();
    if (trimmedDescription.length < 10 || trimmedDescription.length > 2000) {
      return NextResponse.json({ error: "Project description must be between 10 and 2000 characters long." }, { status: 400 });
    }

    // Rule 2: GitHub Link Validation (Format: https://github.com/user/repo)
    const trimmedGithub = githubUrl ? githubUrl.trim() : "";
    if (trimmedGithub && !GITHUB_URL_REGEX.test(trimmedGithub)) {
      return NextResponse.json({ error: "Invalid GitHub URL format. Must be a valid link like https://github.com/username/repo" }, { status: 400 });
    }

    // Rule 3: Tech Stack Validation (Min 1, Max 10)
    const techArray = Array.isArray(tech)
      ? tech.map((t: string) => t.trim()).filter(Boolean)
      : typeof tech === "string"
      ? tech.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    if (techArray.length < 1) {
      return NextResponse.json({ error: "At least 1 technology tag is required." }, { status: 400 });
    }

    if (techArray.length > 10) {
      return NextResponse.json({ error: "Maximum 10 technology tags allowed." }, { status: 400 });
    }

    // Rule 4: Duplicate Project Prevention (Same Title + Same Owner)
    const existingProject = await prisma.project.findFirst({
      where: {
        userId: targetUser.id,
        name: { equals: trimmedName, mode: "insensitive" },
      },
    });

    if (existingProject) {
      return NextResponse.json({ error: "You have already published a project with this name." }, { status: 409 });
    }

    if (
      containsAbusiveWords(trimmedName) ||
      containsAbusiveWords(trimmedDescription) ||
      containsAbusiveWords(JSON.stringify(techArray)) ||
      containsAbusiveWords(problemSolved) ||
      containsAbusiveWords(inspiration) ||
      containsAbusiveWords(biggestChallenge) ||
      containsAbusiveWords(JSON.stringify(teamMembers))
    ) {
      return NextResponse.json({ error: "Inappropriate or abusive language is not allowed" }, { status: 400 });
    }

    let newProject;
    try {
      newProject = await (prisma.project as any).create({
        data: {
          userId: targetUser.id,
          name: trimmedName,
          description: trimmedDescription,
          tech: techArray,
          githubUrl: trimmedGithub || null,
          status: status || "Active",
          stars: 0,
          commits: 1,
          likesCount: 0,
          problemSolved: problemSolved || null,
          inspiration: inspiration || null,
          biggestChallenge: biggestChallenge || null,
          teamType: teamType || "solo",
          teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
          screenshots: Array.isArray(screenshots) ? screenshots : [],
        },
        include: {
          user: true,
        },
      });
    } catch (createErr) {
      console.warn("Prisma create with extended fields failed, falling back to basic fields:", createErr);
      newProject = await prisma.project.create({
        data: {
          userId: targetUser.id,
          name: trimmedName,
          description: trimmedDescription,
          tech: techArray,
          githubUrl: trimmedGithub || null,
          status: status || "Active",
          stars: 0,
          commits: 1,
          likesCount: 0,
        },
        include: {
          user: true,
        },
      });
    }

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

// DELETE /api/projects - Delete a project in Neon PostgreSQL with 403 Ownership check & Delete Cascade
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("id");
    const username = searchParams.get("username");

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Rule 5: Security — Must Be Logged In (401 Unauthorized)
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const currentUser = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Rule 6: Ownership Check (403 Forbidden)
    if (project.userId !== currentUser.id) {
      return NextResponse.json({ error: "Forbidden. You do not have permission to delete this project." }, { status: 403 });
    }

    // Rule 7: Delete Cascade (Delete associated Likes before deleting project)
    await prisma.like.deleteMany({
      where: { projectId: projectId },
    });

    await prisma.project.delete({
      where: { id: projectId },
    });

    // Sync user XP after deletion
    const remainingProjectsCount = await prisma.project.count({
      where: { userId: currentUser.id },
    });
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { xp: remainingProjectsCount * 500 },
    }).catch(() => {});

    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/projects error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
