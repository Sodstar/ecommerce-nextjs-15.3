"use server";

import { connectDB } from "@/lib/mongodb";
import SaleModel, { Item } from "@/models/Sale";
import ProductModel from "@/models/Product";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { Types } from "mongoose";

export const getAllSales = unstable_cache(
  async () => {
    try {
      await connectDB();
      const sales = await SaleModel.find({})
        .populate("user_id", "name email -_id")
        .sort({ createdAt: -1 })
        .limit(1000);

      if (!sales) throw new Error("Sales not found");

      return JSON.parse(JSON.stringify(sales));
    } catch (error) {
      throw new Error(`Failed to fetch sales: ${error}`);
    }
  },
  ["all-sales"],
  { revalidate: 1 } // Revalidate after 60 seconds
);

export async function getSaleById(saleId: string) {
  try {
    await connectDB();

    const sale = await SaleModel.findById(saleId).populate(
      "user_id",
      "name email"
    );
    console.log(sale);
    if (!sale) throw new Error("Sale not found");

    return JSON.parse(JSON.stringify(sale));
  } catch (error) {
    console.error("Error fetching sale:", error);
    throw new Error(`Failed to fetch sale: ${error}`);
  }
}

export async function createSales(saleData: {
  code: string;
  total_price: number;
  cartItems: Item[];
  user_id: string;
}) {
  try {
    await connectDB();

    // Create the sale
    const newSale = new SaleModel({
      code: saleData.code,
      total_price: saleData.total_price,
      cartItems: saleData.cartItems,
      user_id: new Types.ObjectId(saleData.user_id),
    });

    await newSale.save();

    // Update product stock for each item in cart
    for (const item of saleData.cartItems) {
      await ProductModel.findByIdAndUpdate(item.product_id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Clear the cache for sales and products
    revalidateTag("all-sales");
    revalidateTag("all-products");
    revalidatePath("/admin/sales");

    return JSON.parse(JSON.stringify(newSale));
  } catch (error) {
    console.error("Error creating sale:", error);
    throw new Error(`Failed to create sale: ${error}`);
  }
}

export async function updateSale(
  saleId: string,
  updateData: Partial<{
    total_price: number;
    cartItems: Item[];
    user_id: string;
    discount: number;
    phone: string;
  }>
) {
  try {
    await connectDB();

    // Get original sale to handle stock updates correctly
    const originalSale = await SaleModel.findById(saleId);
    if (!originalSale) throw new Error("Sale not found");

    // If cart items are being updated, adjust product stock accordingly
    if (updateData.cartItems) {
      // Create maps for easier comparison
      const originalItems = new Map();
      originalSale.cartItems.forEach((item) => {
        originalItems.set(item.product_id.toString(), item.quantity);
      });

      const newItems = new Map();
      updateData.cartItems.forEach((item) => {
        newItems.set(item.product_id.toString(), item.quantity);
      });

      // Process stock adjustments
      for (const [productId, origQty] of originalItems) {
        const newQty = newItems.get(productId) || 0;
        const stockDiff = origQty - newQty;

        if (stockDiff !== 0) {
          await ProductModel.findByIdAndUpdate(productId, {
            $inc: { stock: stockDiff },
          });
        }
      }

      // Handle new items in updated cart
      for (const [productId, newQty] of newItems) {
        if (!originalItems.has(productId)) {
          await ProductModel.findByIdAndUpdate(productId, {
            $inc: { stock: -newQty },
          });
        }
      }
    }

    // Update the sale
    const updatedSale = await SaleModel.findByIdAndUpdate(saleId, updateData, {
      new: true,
    });

    if (!updatedSale) throw new Error("Sale not found");

    // Invalidate caches
    revalidateTag("all-sales");
    revalidateTag("all-products");
    revalidatePath("/admin/sales");

    return JSON.parse(JSON.stringify(updatedSale));
  } catch (error) {
    throw new Error(`Failed to update sale: ${error}`);
  }
}

export async function deleteSale(saleId: string) {
  try {
    await connectDB();

    // Get the sale to restore stock
    const sale = await SaleModel.findById(saleId);
    if (!sale) throw new Error("Sale not found");

    // Restore product stock quantities
    for (const item of sale.cartItems) {
      await ProductModel.findByIdAndUpdate(item.product_id, {
        $inc: { stock: item.quantity },
      });
    }

    // Delete the sale
    const deletedSale = await SaleModel.findByIdAndDelete(saleId);

    // Invalidate caches
    revalidateTag("all-sales");
    revalidateTag("all-products");
    revalidatePath("/admin/sales");

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete sale: ${error}`);
  }
}

export async function getSalesByDateRange(startDate: Date, endDate: Date) {
  try {
    await connectDB();
    const sales = await SaleModel.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("user_id", "name");

    return JSON.parse(JSON.stringify(sales));
  } catch (error) {
    throw new Error(`Failed to fetch sales by date range: ${error}`);
  }
}

export async function updateSaleStatus(saleId: string, status: boolean) {
  try {
    await connectDB();
    const updatedSale = await SaleModel.findByIdAndUpdate(
      saleId,
      { submited: status },
      { new: true }
    );
    if (!updatedSale) throw new Error("Sale not found");

    // Invalidate caches
    revalidateTag("all-sales");
    revalidatePath("/admin/sales");

    return JSON.parse(JSON.stringify(updatedSale));
  } catch (error) {
    throw new Error(`Failed to update sale status: ${error}`);
  }
}
