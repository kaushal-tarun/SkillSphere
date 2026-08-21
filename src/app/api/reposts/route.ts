import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST /api/reposts - Toggle repost count on a post in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, isReposted } = body;

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    if (isReposted) {
      await prisma.post.update({
        where: { id: postId },
        data: { repostsCount: { increment: 1 } },
      });
    } else {
      await prisma.post.update({
        where: { id: postId },
        data: { repostsCount: { decrement: 1 } },
      });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("POST /api/reposts error:", error);
    return NextResponse.json({ error: "Failed to update repost" }, { status: 500 });
  }
}
