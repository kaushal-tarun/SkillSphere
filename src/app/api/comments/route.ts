import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// POST /api/comments - Create a comment on a post in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId, text, username } = body;

    if (!postId || !text || !text.trim()) {
      return NextResponse.json({ error: "postId and comment text are required" }, { status: 400 });
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

    const newComment = await prisma.comment.create({
      data: {
        postId,
        userId: currentUser.id,
        content: text.trim(),
      },
      include: {
        user: {
          select: {
            name: true,
            username: true,
          },
        },
      },
    });

    const formatted = {
      id: newComment.id,
      authorName: currentUser.name,
      authorHandle: currentUser.username,
      text: newComment.content,
      time: "Just now",
    };

    return NextResponse.json({ comment: formatted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/comments error:", error);
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 });
  }
}

// DELETE /api/comments - Delete a comment in Neon PostgreSQL
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("id");

    if (!commentId) {
      return NextResponse.json({ error: "Comment ID is required" }, { status: 400 });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/comments error:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
