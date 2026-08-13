import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, username, email, password, university } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Full Name, Email, and Password are required" },
        { status: 400 }
      );
    }

    // Check if Email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Check if Username already exists (if provided)
    if (username) {
      const cleanUsername = username.trim().toLowerCase();
      const existingUsername = await prisma.user.findFirst({
        where: { username: cleanUsername },
      });

      if (existingUsername) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cleanUsername = username ? username.trim().toLowerCase() : null;

    const user = await prisma.user.create({
      data: {
        name,
        username: cleanUsername,
        email,
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