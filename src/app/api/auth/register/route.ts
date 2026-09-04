import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, username, email, password, university } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and Password are required." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase().replace(/\s+/g, "_");

    if (cleanUsername.length < 3 || cleanUsername.length > 30) {
      return NextResponse.json(
        { error: "Username must be between 3 and 30 characters long." },
        { status: 400 }
      );
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "Username can only contain letters, numbers, underscores, hyphens, and dots." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const cleanEmail = email && typeof email === "string" && email.trim()
      ? email.trim().toLowerCase()
      : `${cleanUsername}@skillsphere.dev`;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Check if Username already exists
    const existingUsername = await prisma.user.findFirst({
      where: { username: cleanUsername },
    });

    if (existingUsername) {
      return NextResponse.json(
        { error: "Username is already taken. Please choose another." },
        { status: 400 }
      );
    }

    // Check if Email already exists
    const existingEmail = await prisma.user.findFirst({
      where: { email: cleanEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email address already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name && typeof name === "string" && name.trim() ? name.trim() : cleanUsername,
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
        university: university && typeof university === "string" ? university.trim() : null,
        profile: {
          create: {
            university: university && typeof university === "string" && university.trim() ? university.trim() : "University Student",
            role: "Full-Stack Engineer & AI Developer",
            location: "India",
            bio: "Building high-impact developer tools, distributed systems, and AI-powered web applications.",
          },
        },
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
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}