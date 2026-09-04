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

    if (rows && rows.length > 0 && rows[0].status) {
      const validStatuses = ["busy", "tired", "competing", "focused"];
      const s = rows[0].status.toLowerCase();
      if (validStatuses.includes(s)) {
        return NextResponse.json({
          status: s,
          updatedAt: rows[0].updatedAt,
        });
      }
    }

    // Default: Not set
    return NextResponse.json({
      status: null,
      updatedAt: null,
    });
  } catch (error) {
    console.error("GET /api/status error:", error);
    return NextResponse.json({ status: null, error: "Database offline fallback" }, { status: 200 });
  }
}

// POST /api/status - Save or clear user's status in Neon PostgreSQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, status } = body;

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

    const validStatuses = ["busy", "tired", "competing", "focused"];
    const targetStatus = status && validStatuses.includes(status.toLowerCase())
      ? status.toLowerCase()
      : null;

    if (!targetStatus) {
      // Clear status: remove record from database
      await prisma.$executeRawUnsafe(
        `DELETE FROM "UserStatus" WHERE LOWER("username") = LOWER($1)`,
        targetUsername
      );

      return NextResponse.json({
        success: true,
        status: null,
        username: targetUsername,
      });
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
    return NextResponse.json({ error: "Failed to update status in database" }, { status: 500 });
  }
}
