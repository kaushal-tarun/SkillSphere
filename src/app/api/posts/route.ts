import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/posts - Fetch all community posts from Neon PostgreSQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const session = await auth();
    let currentUser = null;

    if (session?.user?.email) {
      currentUser = await prisma.user.findFirst({
        where: { email: session.user.email },
      });
    }

    let likedPostIdsSet = new Set<string>();
    if (currentUser) {
      const userLikes = await prisma.like.findMany({
        where: { userId: currentUser.id, postId: { not: null } },
        select: { postId: true },
      });
      likedPostIdsSet = new Set(userLikes.map((l) => l.postId as string));
    }

    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
            name: true,
            username: true,
            university: true,
            avatar: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formatted = posts.map((p) => {
      let postImages: string[] = [];
      if (p.image) {
        try {
          if (p.image.startsWith("[")) {
            const parsed = JSON.parse(p.image);
            if (Array.isArray(parsed)) {
              postImages = parsed.filter((img) => typeof img === "string" && Boolean(img.trim()));
            } else {
              postImages = [p.image];
            }
          } else {
            postImages = [p.image];
          }
        } catch {
          postImages = [p.image];
        }
      }

      return {
        id: p.id,
        authorName: p.user?.name || "Student Developer",
        authorHandle: p.user?.username || "developer",
        campus: p.user?.university || "University",
        avatar: p.user?.avatar || (p.user?.name || p.user?.username || "US").slice(0, 2).toUpperCase(),
        time: new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        content: p.content,
        image: postImages[0] || undefined,
        images: postImages.length > 0 ? postImages.slice(0, 2) : undefined,
        codeSnippet: p.codeSnippet || undefined,
        projectTag: p.projectTag || undefined,
        likes: p.likesCount,
        reposts: p.repostsCount,
        isLiked: likedPostIdsSet.has(p.id),
        comments: p.comments.map((c) => ({
          id: c.id,
          authorName: c.user?.name || "Developer",
          authorHandle: c.user?.username || "user",
          avatar: c.user?.avatar || undefined,
          text: c.content,
          time: new Date(c.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
        })),
      };
    });

    return NextResponse.json({ posts: formatted }, { status: 200 });
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json({ error: "Failed to fetch community posts" }, { status: 500 });
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

// POST /api/posts - Create a new community post in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, image, images, codeSnippet, projectTag, username } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Post content is required" }, { status: 400 });
    }

    if (containsAbusiveWords(content) || containsAbusiveWords(codeSnippet) || containsAbusiveWords(projectTag)) {
      return NextResponse.json({ error: "Inappropriate or abusive language is not allowed" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in to post." }, { status: 401 });
    }

    const targetUser = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User account not found." }, { status: 404 });
    }

    // Process images (up to 2 images)
    let processedImages: string[] = [];
    if (Array.isArray(images)) {
      processedImages = images.filter((img) => typeof img === "string" && Boolean(img.trim())).slice(0, 2);
    } else if (image && typeof image === "string" && image.trim()) {
      processedImages = [image.trim()];
    }

    const storedImageData = processedImages.length > 0 ? JSON.stringify(processedImages) : null;

    const newPost = await prisma.post.create({
      data: {
        userId: targetUser.id,
        content: content.trim(),
        image: storedImageData,
        codeSnippet: codeSnippet || null,
        projectTag: projectTag || null,
        likesCount: 0,
        repostsCount: 0,
      },
      include: {
        user: true,
        comments: true,
      },
    });

    const formatted = {
      id: newPost.id,
      authorName: targetUser.name,
      authorHandle: targetUser.username,
      campus: targetUser.university || "University Student",
      avatar: targetUser.avatar || (targetUser.name || targetUser.username).slice(0, 2).toUpperCase(),
      time: "Just now",
      content: newPost.content,
      image: processedImages[0] || undefined,
      images: processedImages.length > 0 ? processedImages : undefined,
      codeSnippet: newPost.codeSnippet || undefined,
      projectTag: newPost.projectTag || undefined,
      likes: 0,
      reposts: 0,
      isLiked: false,
      comments: [],
    };

    return NextResponse.json({ post: formatted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return NextResponse.json({ error: "Failed to create community post" }, { status: 500 });
  }
}

// DELETE /api/posts - Delete a community post in Neon PostgreSQL with ownership check
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("id");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

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

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    if (post.userId !== currentUser.id) {
      return NextResponse.json({ error: "Forbidden: You do not have permission to delete this post." }, { status: 403 });
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/posts error:", error);
    return NextResponse.json({ error: "Failed to delete community post" }, { status: 500 });
  }
}
