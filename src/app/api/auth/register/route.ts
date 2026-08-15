import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, username, email, password, university } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and Password are required" },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim().toLowerCase();
    const userEmail = email ? email.trim().toLowerCase() : `${cleanUsername}@skillsphere.user`;

    // Check if Username already exists
    const existingUsername = await prisma.user.findFirst({
      where: { username: cleanUsername },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name || cleanUsername,
        username: cleanUsername,
        email: userEmail,
        password: hashedPassword,
        university: university || null,
      },
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          university: user.university,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}