// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CategoryModel from "@/models/Category";

const categories = [
  {
    name: "Айдас, уур бухимдал, ганцаардлыг үнэлэх",
    description: "Айдас, уур бухимдал, ганцаардлыг үнэлэх",
    slug: "emotions",
    icon: "😡",
  },
  {
    name: "Анги хамт олныг судлах",
    description: "Анги хамт олныг судлах",
    slug: "community",
    icon: "🏫",
  },
  {
    name: "Донтолт хамаарлыг судлах",
    description: "Донтолт хамаарлыг судлах",
    slug: "addiction",
    icon: "🫩",
  },
  {
    name: "Мэргэжил сонголт",
    description: "Мэргэжил сонголт",
    slug: "career",
    icon: "💼",
  },
  {
    name: "Танин мэдэхүйн процесс",
    description: "Танин мэдэхүйн процесс",
    slug: "cognitive",
    icon: "💡",
  },
  {
    name: "Хувь хүний онцлог",
    description: "Хувь хүний онцлог",
    slug: "personality",
    icon: "🧍",
  },
  {
    name: "Сэтгэл хөдлөлийн оюун ухаан /EQ/",
    description: "Сэтгэл хөдлөлийн оюун ухаан /EQ/",
    slug: "eq",
    icon: "😄",
  }
];

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: "Seeding not allowed in categories" }, { status: 403 });
  }

  try {
    await connectDB();

    // Clear existing users
    await CategoryModel.deleteMany({});

    // Hash passwords and create users
    const createdCategories = await Promise.all(
      categories.map(async (cat) => {

        return CategoryModel.create({
          name: cat.name,
          description: cat.description,
          slug: cat.slug,
          icon: cat.icon
        });
      })
    );

    return NextResponse.json({
      success: true,
      message: `Seeded ${createdCategories.length} categories`,
      categories: categories.map(cat => ({
        name: cat.name, icon: cat.icon, desc: cat.description, slug: cat.slug
      }))
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}