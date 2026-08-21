import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/friends - Fetch added friends for active user from Neon PostgreSQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

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

    if (!targetUser) {
      return NextResponse.json({ friends: [] }, { status: 200 });
    }

    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [{ senderId: targetUser.id }, { receiverId: targetUser.id }],
        status: "ACCEPTED",
      },
      include: {
        sender: true,
        receiver: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const friendsList = friendships.map((f) => {
      const friend = f.senderId === targetUser.id ? f.receiver : f.sender;
      return {
        id: friend.id,
        name: friend.name,
        username: friend.username,
        university: friend.university || "University Student",
        xp: friend.xp || 1000,
        level: Math.floor((friend.xp || 0) / 500) + 1,
        projects: 0,
        status: "online" as const,
        isFriend: true,
        avatar: (friend.name || friend.username).slice(0, 2).toUpperCase(),
      };
    });

    return NextResponse.json({ friends: friendsList }, { status: 200 });
  } catch (error) {
    console.error("GET /api/friends error:", error);
    return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
  }
}

// POST /api/friends - Add a friend in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUsername, username } = body;

    if (!targetUsername) {
      return NextResponse.json({ error: "Target username is required" }, { status: 400 });
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
      return NextResponse.json({ error: "Current user session not found" }, { status: 404 });
    }

    const targetUser = await prisma.user.findFirst({
      where: { username: targetUsername.toLowerCase().trim() },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target builder not found" }, { status: 404 });
    }

    // Upsert friendship record
    const friendship = await prisma.friendship.upsert({
      where: {
        senderId_receiverId: {
          senderId: currentUser.id,
          receiverId: targetUser.id,
        },
      },
      update: { status: "ACCEPTED" },
      create: {
        senderId: currentUser.id,
        receiverId: targetUser.id,
        status: "ACCEPTED",
      },
    });

    return NextResponse.json({
      success: true,
      friendship,
      friend: {
        id: targetUser.id,
        name: targetUser.name,
        username: targetUser.username,
        university: targetUser.university || "University Student",
        xp: targetUser.xp || 1000,
        level: Math.floor((targetUser.xp || 0) / 500) + 1,
        projects: 0,
        status: "online",
        isFriend: true,
        avatar: (targetUser.name || targetUser.username).slice(0, 2).toUpperCase(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/friends error:", error);
    return NextResponse.json({ error: "Failed to add friend" }, { status: 500 });
  }
}

// DELETE /api/friends - Remove a friend in Neon PostgreSQL
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetUsername = searchParams.get("targetUsername");
    const username = searchParams.get("username");

    if (!targetUsername) {
      return NextResponse.json({ error: "Target username is required" }, { status: 400 });
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
      return NextResponse.json({ error: "Current user session not found" }, { status: 404 });
    }

    const targetUser = await prisma.user.findFirst({
      where: { username: targetUsername.toLowerCase().trim() },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "Target builder not found" }, { status: 404 });
    }

    await prisma.friendship.deleteMany({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: targetUser.id },
          { senderId: targetUser.id, receiverId: currentUser.id },
        ],
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/friends error:", error);
    return NextResponse.json({ error: "Failed to remove friend" }, { status: 500 });
  }
}
