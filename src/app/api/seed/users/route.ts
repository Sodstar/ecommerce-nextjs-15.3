// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

const users = [
  {
    name: "Sod-Od Batzorig",
    email: "sodstar@gmail.com",
    password: "91629162",
    image: "https://ui-avatars.com/api/?name=Сод-Од+Батзориг&background=random",
    role: "admin"
  },
  {
    name: "Tester 1",
    email: "tester1@example.com",
    password: "91629162",
    image: "https://ui-avatars.com/api/?name=Бат+Болд&background=random",
    role: "user"

  },
  {
    name: "Tester 2",
    email: "tester2@example.com",
    password: "91629162",
    image: "https://ui-avatars.com/api/?name=Саран+Наран&background=random",
    role: "user"

  },
];

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Seeding not allowed in production" }, { status: 403 });
  }

  try {
    await connectDB();
    await User.deleteMany({});

    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);

        return User.create({
          ...user,
          password: hashedPassword,
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdUsers.length} users`,
      users: users.map(user => ({
        email: user.email, password: user.password, role: user.role
      }))
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}