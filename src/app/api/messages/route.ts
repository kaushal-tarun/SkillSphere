import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/messages - Fetch direct messages between active user and friend from Neon PostgreSQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const friendUsername = searchParams.get("friendUsername");
    const username = searchParams.get("username");

    if (!friendUsername) {
      return NextResponse.json({ messages: [] }, { status: 200 });
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
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const friendUser = await prisma.user.findFirst({
      where: { username: friendUsername.toLowerCase().trim() },
    });

    if (!friendUser) {
      return NextResponse.json({ messages: [] }, { status: 200 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUser.id, receiverId: friendUser.id },
          { senderId: friendUser.id, receiverId: currentUser.id },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const formatted = messages.map((m) => ({
      id: m.id,
      sender: m.senderId === currentUser.id ? ("me" as const) : ("friend" as const),
      text: m.content,
      time: new Date(m.createdAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    }));

    return NextResponse.json({ messages: formatted }, { status: 200 });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

// POST /api/messages - Send a direct message in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { friendUsername, text, username } = body;

    if (!friendUsername || !text || !text.trim()) {
      return NextResponse.json({ error: "Friend username and message text are required" }, { status: 400 });
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

    const friendUser = await prisma.user.findFirst({
      where: { username: friendUsername.toLowerCase().trim() },
    });

    if (!friendUser) {
      return NextResponse.json({ error: "Friend not found" }, { status: 404 });
    }

    const newMessage = await prisma.message.create({
      data: {
        senderId: currentUser.id,
        receiverId: friendUser.id,
        content: text.trim(),
        isRead: false,
      },
    });

    const formatted = {
      id: newMessage.id,
      sender: "me" as const,
      text: newMessage.content,
      time: "Just now",
    };

    return NextResponse.json({ message: formatted }, { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
