"use server";

import { connectDB } from "@/lib/mongodb";
import DriverModel from "@/models/Driver";
import DeliveryModel from "@/models/Delivery";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import mongoose from "mongoose";

// Helper function to convert MongoDB ObjectIds to strings

export const getAllDrivers = unstable_cache(
  async () => {
    try {
      await connectDB();
      const drivers = await DriverModel.find({}).sort({ name: 1 });
      if (!drivers) throw new Error("Drivers not found");

      // Convert MongoDB documents to plain JavaScript objects
      return JSON.parse(JSON.stringify(drivers));
    } catch (error) {
      throw new Error(`Failed to fetch drivers: ${error}`);
    }
  },
  ["all-drivers"],
  { revalidate: 60 }
);

export async function getDrivers() {
  try {
    await connectDB();
    const drivers = await DriverModel.find({}).sort({ name: 1 });
    return JSON.parse(JSON.stringify(drivers));
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
    throw new Error("Failed to fetch drivers");
  }
}

export async function getDriverById(id: string) {
  try {
    await connectDB();
    const driver = await DriverModel.findById(id);
    if (!driver) throw new Error("Driver not found");
    return JSON.parse(JSON.stringify(driver));
  } catch (error) {
    console.error("Failed to fetch driver:", error);
    throw new Error("Failed to fetch driver");
  }
}

export async function checkExistingDriverByPin(pin: string) {
  try {
    await connectDB();
    return await DriverModel.findOne({ pin });
  } catch (error) {
    throw new Error("Failed to check driver existence");
  }
}

export async function checkExistingDriverByVehicle(vehicle: string) {
  try {
    await connectDB();
    return await DriverModel.findOne({ vehicle });
  } catch (error) {
    throw new Error("Failed to check vehicle existence");
  }
}

export async function createDriver(
  newData: Partial<{
    name: string;
    phone: string;
    pin: string;
    vehicle: string;
  }>
) {
  try {
    await connectDB();

    const existingDriverWithVehicle = await checkExistingDriverByVehicle(
      newData?.vehicle || ""
    );
    if (existingDriverWithVehicle)
      throw new Error("Vehicle is already assigned to another driver");

    const newDriver = new DriverModel(newData);
    await newDriver.save();
    // Clear the cache for drivers
    revalidateTag("all-drivers");
    revalidatePath("/admin/drivers");
    return JSON.parse(JSON.stringify(newDriver));
  } catch (error) {
    throw new Error(`Failed to create driver: ${error}`);
  }
}

export async function updateDriver(
  _id: string,
  updateData: Partial<{
    name: string;
    phone: string;
    pin: string;
    vehicle: string;
  }>
) {
  try {
    await connectDB();

    // Check if vehicle already exists (if updating vehicle)
    if (updateData.vehicle) {
      const existingDriverWithVehicle = await DriverModel.findOne({
        vehicle: updateData.vehicle,
        _id: { $ne: _id },
      });
      if (existingDriverWithVehicle)
        throw new Error("Vehicle is already assigned to another driver");
    }

    const driverUpdate = await DriverModel.findByIdAndUpdate(_id, updateData, {
      new: true,
    });
    if (!driverUpdate) throw new Error("Driver not found");

    // Clear the cache for drivers
    revalidateTag("all-drivers");
    revalidatePath("/admin/drivers");

    return JSON.parse(JSON.stringify(driverUpdate));
  } catch (error) {
    throw new Error(`Failed to update driver: ${error}`);
  }
}

export async function deleteDriver(driverId: string) {
  try {
    await connectDB();
    const deletedDriver = await DriverModel.findByIdAndDelete(driverId);

    if (!deletedDriver) throw new Error("Driver not found");

    // Clear the cache for drivers
    revalidateTag("all-drivers");
    revalidatePath("/admin/drivers");

    return { success: true };
  } catch (error) {
    throw new Error("Failed to delete driver");
  }
}

// Get date range helper function
function getDateRange(
  range: "today" | "week" | "month" | "year" | "custom",
  startDate?: Date,
  endDate?: Date
) {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  // For custom date range
  if (range === "custom" && startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }

  // Set end time to end of day
  end.setHours(23, 59, 59, 999);

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "week":
      start.setDate(now.getDate() - 7);
      start.setHours(0, 0, 0, 0);
      break;
    case "month":
      start.setMonth(now.getMonth() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "year":
      start.setFullYear(now.getFullYear() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    default:
      // Default to last 30 days
      start.setDate(now.getDate() - 30);
      start.setHours(0, 0, 0, 0);
  }

  return { startDate: start, endDate: end };
}

// Get overall driver performance stats
export async function getDriverPerformanceStats(
  range: "today" | "week" | "month" | "year" | "custom" = "month",
  customStart?: Date,
  customEnd?: Date
) {
  try {
    await connectDB();
    const { startDate, endDate } = getDateRange(range, customStart, customEnd);

    // Get all deliveries within date range
    const deliveries = await DeliveryModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).lean();

    const totalDeliveries = deliveries.length;
    const totalRevenue = deliveries.reduce(
      (sum, delivery) => sum + (delivery.deliveryPrice || 0),
      0
    );
    const totalDriverPayments = deliveries.reduce(
      (sum, delivery) => sum + (delivery.driverPrice || 0),
      0
    );
    const totalProfit = totalRevenue - totalDriverPayments;

    // Status breakdown
    const pendingDeliveries = deliveries.filter(
      (d) => d.status === "pending"
    ).length;
    const inProgressDeliveries = deliveries.filter(
      (d) => d.status === "in-progress"
    ).length;
    const completedDeliveries = deliveries.filter(
      (d) => d.status === "completed"
    ).length;
    const cancelledDeliveries = deliveries.filter(
      (d) => d.status === "cancelled"
    ).length;

    // Averages
    const avgDeliveryPrice =
      totalDeliveries > 0 ? totalRevenue / totalDeliveries : 0;
    const avgDriverPayment =
      totalDeliveries > 0 ? totalDriverPayments / totalDeliveries : 0;
    const avgTimeToComplete = 0; // This would require additional data analysis

    return {
      totalDeliveries,
      totalRevenue,
      totalDriverPayments,
      totalProfit,
      statusBreakdown: {
        pending: pendingDeliveries,
        inProgress: inProgressDeliveries,
        completed: completedDeliveries,
        cancelled: cancelledDeliveries,
      },
      averages: {
        deliveryPrice: avgDeliveryPrice,
        driverPayment: avgDriverPayment,
        timeToComplete: avgTimeToComplete,
      },
      dateRange: {
        start: startDate,
        end: endDate,
      },
    };
  } catch (error) {
    console.error("Failed to fetch driver performance stats:", error);
    throw new Error(`Failed to fetch driver performance stats: ${error}`);
  }
}

// Get individual driver statistics
export async function getIndividualDriverStats(
  range: "today" | "week" | "month" | "year" | "custom" = "month",
  customStart?: Date,
  customEnd?: Date
) {
  try {
    await connectDB();
    const { startDate, endDate } = getDateRange(range, customStart, customEnd);

    // Get all drivers
    const drivers = await DriverModel.find({}).lean();

    // Get all deliveries in date range
    const deliveries = await DeliveryModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).lean();

    // Group deliveries by driver
    const driverStats = drivers.map((driver) => {
      const driverDeliveries = deliveries.filter(
        (d) => d.driver_id && d.driver_id.toString() === driver._id.toString()
      );

      const totalDeliveries = driverDeliveries.length;
      const completedDeliveries = driverDeliveries.filter(
        (d) => d.status === "completed"
      ).length;
      const inProgressDeliveries = driverDeliveries.filter(
        (d) => d.status === "in-progress"
      ).length;
      const pendingDeliveries = driverDeliveries.filter(
        (d) => d.status === "pending"
      ).length;
      const cancelledDeliveries = driverDeliveries.filter(
        (d) => d.status === "cancelled"
      ).length;

      const totalEarnings = driverDeliveries.reduce(
        (sum, delivery) => sum + (delivery.driverPrice || 0),
        0
      );
      const revenueGenerated = driverDeliveries.reduce(
        (sum, delivery) => sum + (delivery.deliveryPrice || 0),
        0
      );

      const completionRate =
        totalDeliveries > 0 ? (completedDeliveries / totalDeliveries) * 100 : 0;

      return {
        _id: driver._id.toString(), // Convert ObjectId to string
        name: driver.name,
        phone: driver.phone,
        vehicle: driver.vehicle,
        stats: {
          totalDeliveries,
          completedDeliveries,
          inProgressDeliveries,
          pendingDeliveries,
          cancelledDeliveries,
          totalEarnings,
          revenueGenerated,
          profit: revenueGenerated - totalEarnings,
          completionRate,
        },
      };
    });

    return driverStats;
  } catch (error) {
    console.error("Failed to fetch individual driver stats:", error);
    throw new Error(`Failed to fetch individual driver stats: ${error}`);
  }
}

// Get delivery trend data (e.g., deliveries by day)
export async function getDeliveryTrends(
  period: "daily" | "weekly" | "monthly" = "daily",
  range: "week" | "month" | "year" | "custom" = "month",
  customStart?: Date,
  customEnd?: Date
) {
  try {
    await connectDB();
    const { startDate, endDate } = getDateRange(range, customStart, customEnd);

    // Fetch deliveries within the date range
    const deliveries = await DeliveryModel.find({
      createdAt: { $gte: startDate, $lte: endDate },
    }).lean();

    // Initialize period results
    const periodData: Record<
      string,
      { count: number; revenue: number; driverPayments: number }
    > = {};

    // Group by period (daily, weekly, monthly)
    deliveries.forEach((delivery) => {
      const date = new Date(delivery.createdAt);
      let periodKey: string;

      if (period === "daily") {
        periodKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
      } else if (period === "weekly") {
        // Get the week number
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear =
          (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNumber = Math.ceil(
          (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7
        );
        periodKey = `${date.getFullYear()}-W${weekNumber}`;
      } else {
        // Monthly
        periodKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
      }

      if (!periodData[periodKey]) {
        periodData[periodKey] = { count: 0, revenue: 0, driverPayments: 0 };
      }

      periodData[periodKey].count += 1;
      periodData[periodKey].revenue += delivery.deliveryPrice || 0;
      periodData[periodKey].driverPayments += delivery.driverPrice || 0;
    });

    // Convert to array and sort by period
    return Object.entries(periodData)
      .map(([period, data]) => ({
        period,
        count: data.count,
        revenue: data.revenue,
        driverPayments: data.driverPayments,
        profit: data.revenue - data.driverPayments,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));
  } catch (error) {
    console.error("Failed to fetch delivery trends:", error);
    throw new Error(`Failed to fetch delivery trends: ${error}`);
  }
}

// Get top performing drivers
export async function getTopPerformingDrivers(
  range: "today" | "week" | "month" | "year" | "custom" = "month",
  limit: number = 5,
  customStart?: Date,
  customEnd?: Date
) {
  try {
    await connectDB();
    const { startDate, endDate } = getDateRange(range, customStart, customEnd);

    // Aggregate deliveries by driver
    const topDrivers = await DeliveryModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: "$driver_id",
          totalDeliveries: { $sum: 1 },
          totalEarnings: { $sum: "$driverPrice" },
          revenueGenerated: { $sum: "$deliveryPrice" },
        },
      },
      {
        $sort: { totalDeliveries: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "drivers",
          localField: "_id",
          foreignField: "_id",
          as: "driverInfo",
        },
      },
      {
        $unwind: "$driverInfo",
      },
      {
        $project: {
          _id: { $toString: "$_id" }, // Convert ObjectId to string here
          name: "$driverInfo.name",
          phone: "$driverInfo.phone",
          vehicle: "$driverInfo.vehicle",
          totalDeliveries: 1,
          totalEarnings: 1,
          revenueGenerated: 1,
          profit: { $subtract: ["$revenueGenerated", "$totalEarnings"] },
        },
      },
    ]);

    return topDrivers;
  } catch (error) {
    console.error("Failed to fetch top performing drivers:", error);
    throw new Error(`Failed to fetch top performing drivers: ${error}`);
  }
}
