import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import SaleModel from "@/models/Sale";
import ProductModel from "@/models/Product";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Get the authenticated user
    const authSession = await getServerSession(authConfig);
    if (!authSession || !authSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { code, total_price, discount, phone, cartItems } = await request.json();

    // Validate required fields
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Invalid request: cartItems must be a non-empty array" },
        { status: 400 }
      );
    }

    if (typeof total_price !== "number" || total_price < 0) {
      return NextResponse.json(
        { error: "Invalid request: total_price must be a non-negative number" },
        { status: 400 }
      );
    }

    // Start a database transaction
    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      // Update product stock for each item in the cart
      for (const item of cartItems) {
        const product = await ProductModel.findById(item.product_id).session(
          dbSession
        );

        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.title}. Available: ${product.stock}, Requested: ${item.quantity}`
          );
        }

        // Decrease the product stock
        await ProductModel.findByIdAndUpdate(
          item.product_id,
          { $inc: { stock: -item.quantity } }, // Decrement stock by quantity
          { session: dbSession, new: true }
        );

        // Increase the product view count
        await ProductModel.findByIdAndUpdate(
          item.product_id,
          { $inc: { views: 1 } }, // Decrement stock by quantity
          { session: dbSession, new: true }
        );
      }

      const sale = await SaleModel.create(
        [
          {
            code,
            total_price,
            discount,
            phone,
            cartItems,
            user_id: authSession.user.id, // Assuming user ID is available in the session
          },
        ],
        { session: dbSession }
      );

      // Commit the transaction
      await dbSession.commitTransaction();
      dbSession.endSession();

      return NextResponse.json(sale[0], { status: 201 });
    } catch (error) {
      // If any error occurs, abort the transaction
      await dbSession.abortTransaction();
      dbSession.endSession();

      console.error("Transaction error:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to create sale",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error creating sale:", error);
    return NextResponse.json(
      { error: "Failed to create sale" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();

    // Get the authenticated user
    const authSession = await getServerSession(authConfig);
    if (!authSession || !authSession.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all sales
    const sales = await SaleModel.find().sort({ createdAt: -1 });

    return NextResponse.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    return NextResponse.json(
      { error: "Failed to fetch sales" },
      { status: 500 }
    );
  }
}
