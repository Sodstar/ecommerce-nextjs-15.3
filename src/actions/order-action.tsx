"use server";

import { connectDB } from "@/lib/mongodb";
import OrderModel, { OrderStatus } from "@/models/Orders";
import ProductModel from "@/models/Product";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { Types } from "mongoose";

export const getAllOrders = unstable_cache(
  async () => {
    try {
      await connectDB();
      const orders = await OrderModel.find({})
        .populate({
          path: "product_id",
          select: "title code price -_id",
          model: ProductModel,
        })
        .sort({ createdAt: -1 })
        .limit(1000);

      if (!orders) throw new Error("Orders not found");

      // Convert MongoDB documents to plain JavaScript objects
      return JSON.parse(JSON.stringify(orders));
    } catch (error) {
      console.error("Error fetching all orders:", error);
      throw new Error(`Failed to fetch orders: ${error}`);
    }
  },
  ["all-orders"],
  { revalidate: 60 } // Revalidate after 1 second
);

export async function getOrderById(orderId: string) {
  try {
    await connectDB();

    const order = await OrderModel.findById(orderId).populate({
      path: "product_id",
      select: "title code price",
      model: ProductModel,
    });

    if (!order) throw new Error("Order not found");

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error(`Failed to fetch order: ${error}`);
  }
}

export async function getOrdersByStatus(status: OrderStatus) {
  try {
    await connectDB();
    const orders = await OrderModel.find({ status })
      .populate({
        path: "product_id",
        select: "title code price",
        model: ProductModel,
      })
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders by status:", error);
    throw new Error(`Failed to fetch orders by status: ${error}`);
  }
}

export async function createOrder(orderData: {
  code: string;
  product_id: string;
  qty: number;
  description?: string;
  total_price?: number;
}) {
  try {
    await connectDB();

    // Check if order code already exists
    const existingOrder = await OrderModel.findOne({ code: orderData.code });
    if (existingOrder) {
      throw new Error("Order with this code already exists");
    }

    // Validate product exists
    const product = await ProductModel.findById(orderData.product_id);
    if (!product) {
      throw new Error("Product not found");
    }

    // Create the order
    const newOrder = new OrderModel({
      code: orderData.code,
      product_id: new Types.ObjectId(orderData.product_id),
      qty: orderData.qty,
      description: orderData.description || "",
      total_price: orderData.total_price || 0,
      status: "ordered",
    });

    await newOrder.save();

    // Clear the cache for orders
    revalidateTag("all-orders");
    revalidatePath("/admin/orders");

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(`Failed to create order: ${error}`);
  }
}

export async function updateOrder(
  orderId: string,
  updateData: Partial<{
    product_id: string;
    qty: number;
    description: string;
    total_price: number;
  }>
) {
  try {
    await connectDB();

    // Validate product if provided
    if (updateData.product_id) {
      const product = await ProductModel.findById(updateData.product_id);
      if (!product) {
        throw new Error("Product not found");
      }
    }

    // Update the order
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      orderId,
      updateData,
      { new: true }
    );

    if (!updatedOrder) throw new Error("Order not found");

    // Invalidate caches
    revalidateTag("all-orders");
    revalidatePath("/admin/orders");

    return JSON.parse(JSON.stringify(updatedOrder));
  } catch (error) {
    throw new Error(`Failed to update order: ${error}`);
  }
}

export async function changeOrderStatus(
  orderId: string,
  newStatus: OrderStatus
) {
  try {
    await connectDB();
    const orderUpdate = await OrderModel.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!orderUpdate) throw new Error("Order not found");

    // Clear the cache for orders
    revalidateTag("all-orders");
    revalidatePath("/admin/orders");

    return JSON.parse(JSON.stringify(orderUpdate));
  } catch (error) {
    throw new Error("Failed to update order status");
  }
}

export async function deleteOrder(orderId: string) {
  try {
    await connectDB();
    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) throw new Error("Order not found");

    // Clear the cache for orders
    revalidateTag("all-orders");
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete order: ${error}`);
  }
}

export async function getOrdersByDateRange(
  startDate: Date,
  endDate: Date,
  status?: OrderStatus
) {
  try {
    await connectDB();

    // Build query object based on parameters
    const query: any = {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };

    // Add status filter if provided
    if (status) {
      query.status = status;
    }

    // Ensure the OrderModel is properly initialized
    const orders = await OrderModel.find(query)
      .populate({
        path: "product_id",
        select: "title code price",
        model: ProductModel,
      })
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error("Error fetching orders by date range:", error);
    throw new Error(`Failed to fetch orders by date range: ${error}`);
  }
}
