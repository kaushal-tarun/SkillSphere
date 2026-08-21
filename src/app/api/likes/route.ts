import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST /api/likes - Toggle like on a project or post in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { projectId, postId, username } = body;

    if (!projectId && !postId) {
      return NextResponse.json({ error: "projectId or postId is required" }, { status: 400 });
    }

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

    if (projectId) {
      const existingLike = await prisma.like.findFirst({
        where: { userId: currentUser.id, projectId },
      });

      if (existingLike) {
        await prisma.like.delete({ where: { id: existingLike.id } });
        await prisma.project.update({
          where: { id: projectId },
          data: { stars: { decrement: 1 }, likesCount: { decrement: 1 } },
        });
        return NextResponse.json({ liked: false }, { status: 200 });
      } else {
        await prisma.like.create({
          data: { userId: currentUser.id, projectId },
        });
        await prisma.project.update({
          where: { id: projectId },
          data: { stars: { increment: 1 }, likesCount: { increment: 1 } },
        });
        return NextResponse.json({ liked: true }, { status: 200 });
      }
    }

    if (postId) {
      const existingLike = await prisma.like.findFirst({
        where: { userId: currentUser.id, postId },
      });

      if (existingLike) {
        await prisma.like.delete({ where: { id: existingLike.id } });
        await prisma.post.update({
          where: { id: postId },
          data: { likesCount: { decrement: 1 } },
        });
        return NextResponse.json({ liked: false }, { status: 200 });
      } else {
        await prisma.like.create({
          data: { userId: currentUser.id, postId },
        });
        await prisma.post.update({
          where: { id: postId },
          data: { likesCount: { increment: 1 } },
        });
        return NextResponse.json({ liked: true }, { status: 200 });
      }
    }

    return NextResponse.json({ error: "Invalid like payload" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/likes error:", error);
    return NextResponse.json({ error: "Failed to process like" }, { status: 500 });
  }
}
