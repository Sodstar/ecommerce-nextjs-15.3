"use server";

import { connectDB } from "@/lib/mongodb";
import DeliveryModel, { DeliveryFormData } from "@/models/Delivery";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { Types } from "mongoose";

export const getAllDeliveries = unstable_cache(
  async () => {
    try {
      await connectDB();
      const deliveries = await DeliveryModel.find({})
        .populate({
          path: "sale_id",
          select: "code total_price cartItems user_id",
          populate: {
            path: "user_id",
            select: "name email -_id",
          },
        })
        .populate({
          path: "driver_id",
          select: "name phone",
        })
        .sort({ createdAt: -1 })
        .limit(1000);

      if (!deliveries) throw new Error("Deliveries not found");

      // Convert MongoDB documents to plain JavaScript objects
      return JSON.parse(JSON.stringify(deliveries));
    } catch (error) {
      throw new Error(`Failed to fetch deliveries: ${error}`);
    }
  },
  ["all-deliveries"],
  { revalidate: 60 } // Revalidate cache after 60 seconds
);

export async function getDeliveryById(deliveryId: string) {
  try {
    await connectDB();

    const delivery = await DeliveryModel.findById(deliveryId)
      .populate({
        path: "sale_id",
        select: "code total_price cartItems user_id",
        populate: {
          path: "user_id",
          select: "name email",
        },
      })
      .populate({
        path: "driver_id",
        select: "name phone",
      });

    if (!delivery) throw new Error("Delivery not found");

    return JSON.parse(JSON.stringify(delivery));
  } catch (error) {
    console.error("Error fetching delivery:", error);
    throw new Error(`Failed to fetch delivery: ${error}`);
  }
}

export async function getDeliveryByCode(deliveryCode: string) {
  try {
    await connectDB();

    const delivery = await DeliveryModel.find({ code: deliveryCode })
      .populate({
        path: "sale_id",
        select: "code total_price cartItems user_id",
        populate: {
          path: "user_id",
          select: "name email",
        },
      })
      .populate({
        path: "driver_id",
        select: "name phone",
      });

    if (!delivery) throw new Error("Delivery not found");

    return JSON.parse(JSON.stringify(delivery));
  } catch (error) {
    console.error("Error fetching delivery:", error);
    throw new Error(`Failed to fetch delivery: ${error}`);
  }
}

export async function getDeliveriesBySale(saleId: string) {
  try {
    await connectDB();
    const deliveries = await DeliveryModel.find({ sale_id: saleId }).sort({
      createdAt: -1,
    });

    return JSON.parse(JSON.stringify(deliveries));
  } catch (error) {
    throw new Error(`Failed to fetch deliveries for sale: ${error}`);
  }
}

export async function createDelivery(deliveryData: DeliveryFormData) {
  try {
    await connectDB();

    // Validate required fields
    if (!deliveryData.sale_id) {
      throw new Error("Sale ID is required");
    }

    if (!deliveryData.phone) {
      throw new Error("Phone number is required");
    }

    if (!deliveryData.address) {
      throw new Error("Delivery address is required");
    }

    // Create the delivery
    const newDelivery = new DeliveryModel({
      code: deliveryData.code,
      sale_id: new Types.ObjectId(deliveryData.sale_id),
      driver_id: new Types.ObjectId(deliveryData.driver_id),
      phone: deliveryData.phone,
      address: deliveryData.address,
      deliveryPrice: deliveryData.deliveryPrice || 0,
      driverPrice: deliveryData.driverPrice || 0,
      summaryPrice: deliveryData.summaryPrice || 0,
      status: deliveryData.status || "pending", // Add default status if not provided
    });

    const savedDelivery = await newDelivery.save();

    if (!savedDelivery) {
      throw new Error("Failed to save delivery");
    }

    // Clear the cache for deliveries
    revalidateTag("all-deliveries");
    revalidatePath("/admin/deliveries");

    return JSON.parse(JSON.stringify(savedDelivery));
  } catch (error: any) {
    console.error("Error creating delivery:", error);
    if (error.name === "ValidationError") {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw new Error(`Failed to create delivery: ${error.message || error}`);
  }
}

// New function to check if a delivery exists for a sale
export async function checkDeliveryExists(saleId: string) {
  try {
    await connectDB();
    const delivery = await DeliveryModel.findOne({ sale_id: saleId });
    return !!delivery; // Return true if delivery exists, false otherwise
  } catch (error) {
    console.error("Error checking delivery:", error);
    return false;
  }
}

export async function updateDelivery(
  deliveryId: string,
  updateData: Partial<DeliveryFormData>
) {
  try {
    await connectDB();

    if (!deliveryId) {
      throw new Error("Delivery ID is required");
    }

    // Create an update object with only the provided fields
    const updateFields: Record<string, any> = {};

    if (updateData.phone !== undefined) updateFields.phone = updateData.phone;
    if (updateData.address !== undefined)
      updateFields.address = updateData.address;
    if (updateData.deliveryPrice !== undefined)
      updateFields.deliveryPrice = updateData.deliveryPrice;
    if (updateData.driverPrice !== undefined)
      updateFields.driverPrice = updateData.driverPrice;
    if (updateData.summaryPrice !== undefined)
      updateFields.summaryPrice = updateData.summaryPrice;
    if (updateData.status !== undefined)
      updateFields.status = updateData.status;
    if (updateData.driver_id !== undefined)
      updateFields.driver_id = new Types.ObjectId(updateData.driver_id);

    const updatedDelivery = await DeliveryModel.findByIdAndUpdate(
      deliveryId,
      updateFields,
      { new: true, runValidators: true }
    ).populate("sale_id");

    if (!updatedDelivery)
      throw new Error(`Delivery with ID ${deliveryId} not found`);

    // Clear the cache for deliveries
    revalidateTag("all-deliveries");
    revalidatePath("/admin/deliveries");

    return JSON.parse(JSON.stringify(updatedDelivery));
  } catch (error: any) {
    console.error("Error updating delivery:", error);
    if (error.name === "ValidationError") {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw new Error(`Failed to update delivery: ${error.message || error}`);
  }
}

export async function deleteDelivery(deliveryId: string) {
  try {
    await connectDB();
    const deletedDelivery = await DeliveryModel.findByIdAndDelete(deliveryId);

    if (!deletedDelivery) throw new Error("Delivery not found");

    // Clear the cache for deliveries
    revalidateTag("all-deliveries");
    revalidatePath("/admin/deliveries");

    return { success: true };
  } catch (error) {
    throw new Error(`Failed to delete delivery: ${error}`);
  }
}

export async function getDeliveriesByDateRange(startDate: Date, endDate: Date) {
  try {
    await connectDB();

    // Adjust the end date to include the entire day
    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setHours(23, 59, 59, 999);

    const deliveries = await DeliveryModel.find({
      createdAt: {
        $gte: startDate,
        $lte: adjustedEndDate,
      },
    })
      .populate({
        path: "sale_id",
        select: "code total_price cartItems user_id",
        populate: {
          path: "user_id",
          select: "name email -_id",
        },
      })
      .populate({
        path: "driver_id",
        select: "name phone",
      })
      .sort({ createdAt: -1 })
      .limit(1000);

    if (!deliveries) throw new Error("Deliveries not found");

    return JSON.parse(JSON.stringify(deliveries));
  } catch (error) {
    console.error("Error fetching deliveries by date range:", error);
    throw new Error(`Failed to fetch deliveries by date range: ${error}`);
  }
}

export async function getDeliveryStats() {
  try {
    await connectDB();
    const stats = await DeliveryModel.aggregate([
      {
        $group: {
          _id: null,
          totalDeliveries: { $sum: 1 },
          totalRevenue: { $sum: "$deliveryPrice" },
          totalDriverCost: { $sum: "$driverPrice" },
          profit: { $sum: { $subtract: ["$deliveryPrice", "$driverPrice"] } },
        },
      },
    ]);

    return stats.length > 0
      ? stats[0]
      : {
          totalDeliveries: 0,
          totalRevenue: 0,
          totalDriverCost: 0,
          profit: 0,
        };
  } catch (error) {
    throw new Error(`Failed to fetch delivery statistics: ${error}`);
  }
}
