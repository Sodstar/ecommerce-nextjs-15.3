// src/app/api/seed/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import ProductModel from "@/models/Product";
import mongoose from "mongoose";

const categoryIds = [
    new mongoose.Types.ObjectId('680f1f8868a68ccff3ef1784'),
    new mongoose.Types.ObjectId('680f1f8868a68ccff3ef1787'),
    new mongoose.Types.ObjectId('680f1f8868a68ccff3ef1785'),
];

const brandIds = [
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
    new mongoose.Types.ObjectId(),
];

const productSeedData = [
    {
        title: "Premium Wireless Headphones",
        shortDescription: "High-quality noise cancelling headphones",
        longDescription: "Experience premium audio with our wireless headphones featuring active noise cancellation, 30-hour battery life, and comfortable over-ear design. Perfect for travel, work, or relaxation.",
        download_link: null, // Physical product, no download
        price: 249.99,
        image: "https://3bsw6574qy.ufs.sh/f/Ih06gvMUd8G1JdyqcySmi3E9gTRhMutkdas6oZI0LvKSDUFG",
        stock: 45,
        rating:5,
        category: categoryIds[0], // Electronics
        brand: brandIds[0], // Premium Audio Brand
    },
    {
        title: "Smartphone Pro Max",
        shortDescription: "Latest flagship smartphone with pro-level camera",
        longDescription: "Our latest smartphone features a 6.7-inch Super AMOLED display, professional-grade camera system, 5G connectivity, and all-day battery life. Water and dust resistant with the most powerful processor we've ever put in a phone.",
        download_link: null, // Physical product, no download
        price: 999.99,
        image: "https://3bsw6574qy.ufs.sh/f/Ih06gvMUd8G1qzLl3satTLasyYnw8jpDmKRAHZdeukJ1350z",
        stock: 30,
        rating:5,
        category: categoryIds[0], // Electronics
        brand: brandIds[1], // Tech Giant Brand
    },
    {
        title: "Productivity Software Suite",
        shortDescription: "Complete office productivity package",
        longDescription: "Get everything you need for business productivity in one package. Includes word processing, spreadsheets, presentations, email, and cloud storage. Annual subscription with regular updates and premium support.",
        download_link: null,
        price: 149.99,
        image: "https://3bsw6574qy.ufs.sh/f/Ih06gvMUd8G10E3ZQNTbFxTUKai9vXSlC2wp4rMRukJsPyOq",
        stock: 999,
        rating:5,
        category: categoryIds[1], // Software
        brand: brandIds[2], // Software Corp
    },
    {
        title: "Ultra HD Smart TV",
        shortDescription: "55-inch 4K smart television with built-in streaming",
        longDescription: "Transform your home entertainment with this 55-inch Ultra HD smart television. Features Dolby Vision, HDR10+, and built-in access to all popular streaming services. Voice control compatible with major smart home systems.",
        download_link: null, // Physical product, no download
        price: 699.99,
        image: "https://3bsw6574qy.ufs.sh/f/Ih06gvMUd8G16xqzWjbKIdSPYXeM5Z2LyHxktRCp0fOjqWvh",
        stock: 15,
        rating:5,
        category: categoryIds[0], // Electronics
        brand: brandIds[1], // Tech Giant Brand
    },
    {
        title: "Professional DSLR Camera",
        shortDescription: "Full-frame professional camera for photography enthusiasts",
        longDescription: "Capture stunning images with our professional DSLR camera featuring a 45MP full-frame sensor, 4K video recording, advanced autofocus system, and weather-sealed body. Includes 24-70mm f/2.8 lens.",
        download_link: null, // Physical product, no download
        price: 1899.99,
        image: "https://3bsw6574qy.ufs.sh/f/Ih06gvMUd8G1Z7U57pogEPxRNHfBU7m1l2Y6XncGoFekhqIW",
        stock: 8,
        rating:5,
        category: categoryIds[0], // Electronics
        brand: brandIds[0], // Premium Photography Brand
    },
    {
        title: "E-Book: Web Development Masterclass",
        shortDescription: "Comprehensive guide to modern web development",
        longDescription: "Learn everything from HTML/CSS basics to advanced React, NextJS, and serverless architecture. This comprehensive e-book includes practical examples, code snippets, and hands-on projects to build your portfolio.",
        download_link: "https://example.com/download/web-dev-ebook",
        price: 29.99,
        image: "https://3bsw6574qy.ufs.sh/f/Ih06gvMUd8G1CFOAEK5BotbPxvjqfTzMns5cmw7O2EXDJAQL",
        stock: 999, // Unlimited digital product
        rating:5,
        category: categoryIds[2], // E-Books
        brand: brandIds[2], // Digital Publishing
    },
    {
        title: "Digital Art Software",
        shortDescription: "Professional digital art and illustration suite",
        longDescription: "The industry standard for digital artists, illustrators, and graphic designers. This software includes hundreds of digital brushes, powerful layer management, and advanced color tools. Lifetime license with 1 year of updates.",
        download_link: "https://example.com/download/digital-art-suite",
        price: 249.99,
        image: "https://3bsw6574qy.ufs.sh/f/Ih06gvMUd8G1jaWi0TQ6PK8YLXrnCAQWgNVldMzwceEmS2ak",
        stock: 500,
        rating:5,
        category: categoryIds[1], // Software
        brand: brandIds[2], // Software Corp
    }
];

export async function GET() {
    if (process.env.NODE_ENV === 'production') {
        return NextResponse.json({ error: "Seeding not allowed in production" }, { status: 403 });
    }

    try {
        await connectDB();
        await ProductModel.deleteMany({});

        await ProductModel.insertMany(productSeedData);

        return NextResponse.json({
            success: true,
            message: `Seeded ${productSeedData.length} products`,
            products: productSeedData.map(prod => ({
                title: prod.title,
                shortDescription: prod.shortDescription,
                longDescription: prod.longDescription,
                download_link: prod.download_link,
                price: prod.price,
            }))
        });
    } catch (error) {
        console.error("Error seeding database:", error);
        return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
    }
}