import { NextResponse } from "next/server";

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Seeding not allowed in production" }, { status: 403 });
  }

  try {
    const results = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/seed/users`, { method: 'GET' }).then(res => res.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/seed/categories`, { method: 'GET' }).then(res => res.json())
      // fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/seed/products`, { method: 'GET' }).then(res => res.json())
    ]);

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      results
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}