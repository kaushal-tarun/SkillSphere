import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/reposts - Toggle repost count on a post in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, action } = body; // action: "INCREMENT" | "DECREMENT"

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    const targetPost = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!targetPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let newCount = targetPost.repostsCount;
    if (action === "INCREMENT") {
      newCount = targetPost.repostsCount + 1;
    } else if (action === "DECREMENT") {
      newCount = Math.max(0, targetPost.repostsCount - 1);
    } else {
      // Fallback
      newCount = targetPost.repostsCount + 1;
    }

    await prisma.post.update({
      where: { id: postId },
      data: { repostsCount: newCount },
    });

    return NextResponse.json({ success: true, repostsCount: newCount }, { status: 200 });
  } catch (error) {
    console.error("POST /api/reposts error:", error);
    return NextResponse.json({ error: "Failed to update repost" }, { status: 500 });
  }
}
