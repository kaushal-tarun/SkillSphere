import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/friends - Fetch accepted friends & pending incoming requests from Neon PostgreSQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    const session = await auth();
    let sessionUser = null;

    if (session?.user?.email) {
      sessionUser = await prisma.user.findFirst({
        where: { email: session.user.email },
      });
    }

    let targetUser = null;
    if (username && username.trim()) {
      targetUser = await prisma.user.findFirst({
        where: { username: username.toLowerCase().trim() },
      });
    } else {
      targetUser = sessionUser;
    }

    if (!targetUser) {
      return NextResponse.json({ friends: [], pendingRequests: [], sentRequests: [], registeredUsers: [] }, { status: 200 });
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
        avatar: friend.avatar || (friend.name || friend.username).slice(0, 2).toUpperCase(),
      };
    });

    const isOwner = Boolean(sessionUser && sessionUser.id === targetUser.id);

    // Pending incoming friend requests (only visible to owner)
    let pendingRequests: any[] = [];
    if (isOwner) {
      const incomingPending = await prisma.friendship.findMany({
        where: {
          receiverId: targetUser.id,
          status: "PENDING",
        },
        include: {
          sender: { include: { projects: true } },
        },
      });

      pendingRequests = incomingPending.map((f) => {
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
          avatar: sender.avatar || (sender.name || sender.username).slice(0, 2).toUpperCase(),
        };
      });
    }

    // Pending outgoing friend requests (only visible to owner)
    let sentRequests: string[] = [];
    if (isOwner) {
      const outgoingPending = await prisma.friendship.findMany({
        where: {
          senderId: targetUser.id,
          status: "PENDING",
        },
        include: {
          receiver: true,
        },
      });

      sentRequests = outgoingPending.map((f) => f.receiver.username.toLowerCase());
    }

    // All registered users in Neon PostgreSQL with live DB avatars & project counts
    const registeredUsersDb = await prisma.user.findMany({
      include: {
        projects: true,
      },
    });

    const registeredUsersPool = registeredUsersDb.map((u) => {
      const projCount = u.projects ? u.projects.length : 0;
      const xp = projCount * 500;
      const level = Math.floor(xp / 500) + 1;

      return {
        id: u.id,
        name: u.name,
        username: u.username,
        university: u.university || "University Student",
        xp,
        level,
        projects: projCount,
        status: "online" as const,
        isFriend: false,
        avatar: u.avatar || (u.name || u.username).slice(0, 2).toUpperCase(),
      };
    });

    return NextResponse.json({ friends: friendsList, pendingRequests, sentRequests, registeredUsers: registeredUsersPool }, { status: 200 });
  } catch (error) {
    console.error("GET /api/friends error:", error);
    return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
  }
}

// POST /api/friends - Send a Friend Request (PENDING) in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetUsername } = body;

    if (!targetUsername) {
      return NextResponse.json({ error: "Target username is required" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in to send friend requests." }, { status: 401 });
    }

    const currentUser = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

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
    const { action, senderUsername } = body; // action: "ACCEPT" | "DECLINE"

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

    if (!targetUsername) {
      return NextResponse.json({ error: "Target username is required" }, { status: 400 });
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }

    const currentUser = await prisma.user.findFirst({
      where: { email: session.user.email },
    });

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
