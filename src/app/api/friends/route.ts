import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/friends - Fetch accepted friends & pending incoming requests from Neon PostgreSQL
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
      return NextResponse.json({ friends: [], pendingRequests: [] }, { status: 200 });
    }

    // Accepted Friendships
    const acceptedFriendships = await prisma.friendship.findMany({
      where: {
        OR: [{ senderId: targetUser.id }, { receiverId: targetUser.id }],
        status: "ACCEPTED",
      },
      include: {
        sender: { include: { projects: true } },
        receiver: { include: { projects: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const friendsList = acceptedFriendships.map((f) => {
      const friend = f.senderId === targetUser.id ? f.receiver : f.sender;
      const projCount = friend.projects ? friend.projects.length : 0;
      const xp = projCount * 500;
      const level = Math.floor(xp / 500) + 1;

      return {
        id: friend.id,
        name: friend.name,
        username: friend.username,
        university: friend.university || "University Student",
        xp,
        level,
        projects: projCount,
        status: "online" as const,
        isFriend: true,
        avatar: (friend.name || friend.username).slice(0, 2).toUpperCase(),
      };
    });

    // Pending incoming friend requests (where current user is receiver)
    const incomingPending = await prisma.friendship.findMany({
      where: {
        receiverId: targetUser.id,
        status: "PENDING",
      },
      include: {
        sender: { include: { projects: true } },
      },
    });

    const pendingRequests = incomingPending.map((f) => {
      const sender = f.sender;
      const projCount = sender.projects ? sender.projects.length : 0;
      const xp = projCount * 500;

      return {
        friendshipId: f.id,
        senderId: sender.id,
        name: sender.name,
        username: sender.username,
        university: sender.university || "University Student",
        xp,
        avatar: (sender.name || sender.username).slice(0, 2).toUpperCase(),
      };
    });

    return NextResponse.json({ friends: friendsList, pendingRequests }, { status: 200 });
  } catch (error) {
    console.error("GET /api/friends error:", error);
    return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
  }
}

// POST /api/friends - Send a Friend Request (PENDING) in Neon PostgreSQL
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

    // Create a PENDING friendship request
    const friendship = await prisma.friendship.upsert({
      where: {
        senderId_receiverId: {
          senderId: currentUser.id,
          receiverId: targetUser.id,
        },
      },
      update: { status: "PENDING" },
      create: {
        senderId: currentUser.id,
        receiverId: targetUser.id,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, friendship, status: "PENDING" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/friends error:", error);
    return NextResponse.json({ error: "Failed to send friend request" }, { status: 500 });
  }
}

// PUT /api/friends - Accept or Decline a Friend Request in Neon PostgreSQL
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { action, senderUsername, username } = body; // action: "ACCEPT" | "DECLINE"

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

    const senderUser = await prisma.user.findFirst({
      where: { username: senderUsername.toLowerCase().trim() },
    });

    if (!senderUser) {
      return NextResponse.json({ error: "Sender user not found" }, { status: 404 });
    }

    if (action === "ACCEPT") {
      await prisma.friendship.updateMany({
        where: { senderId: senderUser.id, receiverId: currentUser.id },
        data: { status: "ACCEPTED" },
      });
      return NextResponse.json({ success: true, status: "ACCEPTED" }, { status: 200 });
    } else {
      await prisma.friendship.deleteMany({
        where: { senderId: senderUser.id, receiverId: currentUser.id },
      });
      return NextResponse.json({ success: true, status: "REJECTED" }, { status: 200 });
    }
  } catch (error) {
    console.error("PUT /api/friends error:", error);
    return NextResponse.json({ error: "Failed to update friend request" }, { status: 500 });
  }
}

// DELETE /api/friends - Unfriend / Remove a friend in Neon PostgreSQL
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
