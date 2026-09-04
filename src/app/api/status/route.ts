import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// GET /api/status?username=<username> - Fetch user's status from Neon PostgreSQL
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username || !username.trim()) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const cleanUsername = username.replace(/^@/, "").toLowerCase().trim();

    const rows = await prisma.$queryRawUnsafe<any[]>(
      `SELECT "status", "updatedAt" FROM "UserStatus" WHERE LOWER("username") = LOWER($1) LIMIT 1`,
      cleanUsername
    );

    if (rows && rows.length > 0) {
      return NextResponse.json({
        status: rows[0].status,
        updatedAt: rows[0].updatedAt,
      });
    }

    return NextResponse.json({
      status: "busy",
      updatedAt: null,
    });
  } catch (error) {
    console.error("GET /api/status error:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}

// POST /api/status - Save user's status in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, status } = body;

    const validStatuses = ["busy", "tired", "competing", "focused"];
    const targetStatus = validStatuses.includes(status?.toLowerCase())
      ? status.toLowerCase()
      : "busy";

    const session = await auth();

    // Verify authenticated user
    let targetUsername = username ? username.replace(/^@/, "").toLowerCase().trim() : null;

    if (!targetUsername && session?.user?.email) {
      const dbUser = await prisma.user.findFirst({
        where: { email: session.user.email },
      });
      if (dbUser) {
        targetUsername = dbUser.username.toLowerCase().trim();
      }
    }

    if (!targetUsername) {
      return NextResponse.json({ error: "User identity not found" }, { status: 400 });
    }

    const id = `status_${targetUsername}`;

    await prisma.$executeRawUnsafe(
      `INSERT INTO "UserStatus" ("id", "username", "status", "updatedAt")
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
       ON CONFLICT ("username")
       DO UPDATE SET "status" = EXCLUDED."status", "updatedAt" = CURRENT_TIMESTAMP`,
      id,
      targetUsername,
      targetStatus
    );

    return NextResponse.json({
      success: true,
      status: targetStatus,
      username: targetUsername,
    });
  } catch (error) {
    console.error("POST /api/status error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
