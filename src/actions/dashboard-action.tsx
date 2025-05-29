"use server";

import { connectDB } from "@/lib/mongodb";
import SaleModel from "@/models/Sale";
import ProductModel from "@/models/Product";
import OrderModel from "@/models/Orders";
import DeliveryModel from "@/models/Delivery";
import UserModel from "@/models/User";
import { unstable_cache } from "next/cache";
import { formatDistanceToNow } from "date-fns";

// Types for dashboard data
export interface DashboardStats {
  sales: {
    total: number;
    count: number;
    trend: number; // percentage change
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  users: {
    total: number;
    newUsers: number;
  };
  deliveries: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    revenue: number;
  };
}

export interface RecentSale {
  _id: string;
  code: string;
  date: any;
  relativeTime: string;
  userName: any;
  items: number;
  total_price?: number; // Added total_price property
}

export interface TopProduct {
  _id: string;
  title: string;
  price: number;
  stock: number;
  soldCount: number;
  totalRevenue: number;
}

export interface SalesByPeriod {
  period: string;
  amount: number;
}

// Helper function to get date range
function getDateRange(
  range: "today" | "week" | "month" | "year" | "custom",
  startDate?: Date,
  endDate?: Date
) {
  const now = new Date();
  let start = new Date(now);
  let end = new Date(now);

  // Ensure proper Date objects
  if (range === "custom" && startDate && endDate) {
    start = new Date(startDate);
    end = new Date(endDate);
    // Set end date to end of day
    end.setHours(23, 59, 59, 999);
    return { startDate: start, endDate: end };
  }

  // Set end time to end of day for accurate range
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

// Main dashboard stats
export const getDashboardStats = unstable_cache(
  async (
    range: "today" | "week" | "month" | "year" | "custom" = "month",
    customStart?: Date,
    customEnd?: Date
  ) => {
    try {
      await connectDB();
      const { startDate, endDate } = getDateRange(
        range,
        customStart,
        customEnd
      );

      // Calculate previous period for trends
      const periodDuration = endDate.getTime() - startDate.getTime();
      const previousStartDate = new Date(startDate.getTime() - periodDuration);
      const previousEndDate = new Date(endDate.getTime() - periodDuration);

      // Get current period sales with explicit date handling
      const sales = await SaleModel.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },

      })
        .select("createdAt total_price cartItems")
        .lean();

      // Get previous period sales for trend calculation
      const previousSales = await SaleModel.find({
        createdAt: {
          $gte: previousStartDate,
          $lte: previousEndDate,
        },

      }).lean();

      // Ensure total_price is a number and handle potential nulls
      const totalSales = sales.reduce(
        (sum, sale) => sum + (sale.total_price || 0),
        0
      );
      const previousTotalSales = previousSales.reduce(
        (sum, sale) => sum + (sale.total_price || 0),
        0
      );

      // Calculate trend percentage
      let salesTrend = 0;
      if (previousTotalSales > 0) {
        salesTrend = Math.round(
          ((totalSales - previousTotalSales) / previousTotalSales) * 100
        );
      }

      // Products statistics
      const products = await ProductModel.countDocuments();
      const lowStockProducts = await ProductModel.countDocuments({
        $expr: { $lt: ["$stock", "$stock_alert"] },
      });
      const outOfStockProducts = await ProductModel.countDocuments({
        stock: 0,
      });

      // Orders statistics
      const totalOrders = await OrderModel.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      });
      const pendingOrders = await OrderModel.countDocuments({
        status: "ordered",
        createdAt: { $gte: startDate, $lte: endDate },
      });
      const completedOrders = await OrderModel.countDocuments({
        status: "finishied",
        createdAt: { $gte: startDate, $lte: endDate },
      });
      const cancelledOrders = await OrderModel.countDocuments({
        status: "cancelled",
        createdAt: { $gte: startDate, $lte: endDate },
      });

      // Users statistics
      const totalUsers = await UserModel.countDocuments();
      const newUsers = await UserModel.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      });

      // Deliveries statistics
      const deliveries = await DeliveryModel.find({
        createdAt: { $gte: startDate, $lte: endDate },
      });

      const totalDeliveries = deliveries.length;
      const pendingDeliveries = deliveries.filter(
        (d) => d.status === "pending"
      ).length;
      const inProgressDeliveries = deliveries.filter(
        (d) => d.status === "in-progress"
      ).length;
      const completedDeliveries = deliveries.filter(
        (d) => d.status === "completed"
      ).length;
      const deliveryRevenue = deliveries.reduce(
        (sum, delivery) => sum + delivery.deliveryPrice,
        0
      );

      return {
        sales: {
          total: totalSales,
          count: sales.length,
          trend: salesTrend,
        },
        products: {
          total: products,
          lowStock: lowStockProducts,
          outOfStock: outOfStockProducts,
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          cancelled: cancelledOrders,
        },
        users: {
          total: totalUsers,
          newUsers,
        },
        deliveries: {
          total: totalDeliveries,
          pending: pendingDeliveries,
          inProgress: inProgressDeliveries,
          completed: completedDeliveries,
          revenue: deliveryRevenue,
        },
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw new Error(
        `Failed to fetch dashboard statistics: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  },
  ["dashboard-stats"],
  { revalidate: 60 } // Revalidate after 60 seconds
);

// Recent sales with customer info
export const getRecentSales = unstable_cache(
  async (limit = 10) => {
    try {
      await connectDB();
      const sales = await SaleModel.find()
        .select("createdAt code total_price user_id cartItems")
        .populate("user_id", "name email")
        .sort({ createdAt: -1 })
        .limit(limit);

      return sales.map((sale) => ({
        _id: sale._id.toString(),
        code: sale.code,
        total_price: sale.total_price,
        date:  (sale as any).createdAt,
        relativeTime: formatDistanceToNow(
          (sale as any).createdAt || new Date(),
          { addSuffix: true }
        ),
        userName: sale.user_id ? (sale.user_id as any).name : "Unknown",
        items: sale.cartItems.length,
      }));
    } catch (error) {
      console.error("Error fetching recent sales:", error);
      throw new Error(`Failed to fetch recent sales: ${error}`);
    }
  },
  ["recent-sales"],
  { revalidate: 1 }
);

// Top selling products
export const getTopProducts = unstable_cache(
  async (
    limit = 5,
    range: "today" | "week" | "month" | "year" | "custom" = "month",
    customStart?: Date,
    customEnd?: Date
  ) => {
    try {
      await connectDB();
      const { startDate, endDate } = getDateRange(
        range,
        customStart,
        customEnd
      );

      // Get sales within date range - explicitly select cartItems
      const sales = await SaleModel.find({
        createdAt: { $gte: startDate, $lte: endDate }
      }).select("createdAt total_price cartItems").lean();

      // Aggregate product sales
      const productSales: Record<
        string,
        {
          productId: string;
          title: string;
          price: number;
          quantity: number;
          revenue: number;
        }
      > = {};

      // Process all sales and their cart items, with null checking
      sales.forEach((sale) => {
        // Make sure cartItems exists before attempting to iterate
        if (sale.cartItems && Array.isArray(sale.cartItems)) {
          sale.cartItems.forEach((item) => {
            const productId = item.product_id.toString();
            if (!productSales[productId]) {
              productSales[productId] = {
                productId,
                title: item.name,
                price: item.price,
                quantity: 0,
                revenue: 0,
              };
            }
            productSales[productId].quantity += item.quantity;
            productSales[productId].revenue += item.quantity * item.price;
          });
        }
      });

      // Convert to array and sort by quantity sold
      const topProducts = Object.values(productSales)
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, limit);

      // Get current stock levels
      const productsWithStock = await Promise.all(
        topProducts.map(async (product) => {
          const dbProduct = await ProductModel.findById(product.productId);
          return {
            _id: product.productId,
            title: product.title,
            price: product.price,
            stock: dbProduct?.stock || 0,
            soldCount: product.quantity,
            totalRevenue: product.revenue,
          };
        })
      );

      return productsWithStock;
    } catch (error) {
      console.error("Error fetching top products:", error);
      throw new Error(`Failed to fetch top products: ${error}`);
    }
  },
  ["top-products"],
  { revalidate: 300 } // Revalidate after 5 minutes
);

// Get sales by period (daily/monthly)
export const getSalesByPeriod = unstable_cache(
  async (
    periodType: "daily" | "monthly" = "daily",
    range: "week" | "month" | "year" | "custom" = "month",
    customStart?: Date,
    customEnd?: Date
  ) => {
    try {
      await connectDB();
      const { startDate, endDate } = getDateRange(
        range,
        customStart,
        customEnd
      );

      // Fetch all sales within the range - using lean() for better performance
      const sales = await SaleModel.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      })
        .select("createdAt total_price cartItems") // Ensure createdAt is selected
        .lean();

      let result: SalesByPeriod[] = [];

      // Group by period (daily or monthly)
      if (periodType === "daily") {
        // Create a map for each day in the range
        const dailyMap: Record<string, number> = {};
        let currentDate = new Date(startDate);

        // Initialize all days with zero
        while (currentDate <= endDate) {
          const dateKey = currentDate.toISOString().split("T")[0];
          dailyMap[dateKey] = 0;
          currentDate.setDate(currentDate.getDate() + 1);
        }

        // Sum sales by day
        sales.forEach((sale) => {
          const saleDate =
              (sale as any).createdAt
              ? new Date((sale as any).createdAt)
              : new Date((sale as any).createdAt);
          if (saleDate && !isNaN(saleDate.getTime())) {
            const dateKey = saleDate.toISOString().split("T")[0];
            dailyMap[dateKey] =
              (dailyMap[dateKey] || 0) + (sale.total_price || 0);
          }
        });

        // Convert to array format
        result = Object.entries(dailyMap).map(([date, amount]) => ({
          period: date,
          amount,
        }));
      } else {
        // Monthly grouping
        const monthlyMap: Record<string, number> = {};

        // Sum sales by month
        sales.forEach((sale) => {
          const saleDate =
            (sale as any).createdAt instanceof Date
              ? (sale as any).createdAt // Cast to any if type mismatch persists
              : new Date((sale as any).createdAt);
          if (saleDate && !isNaN(saleDate.getTime())) {
            const monthKey = `${saleDate.getFullYear()}-${String(
              saleDate.getMonth() + 1
            ).padStart(2, "0")}`;
            monthlyMap[monthKey] =
              (monthlyMap[monthKey] || 0) + (sale.total_price || 0);
          }
        });

        // Convert to array format
        result = Object.entries(monthlyMap).map(([month, amount]) => ({
          period: month,
          amount,
        }));
      }

      return result.sort((a, b) => a.period.localeCompare(b.period));
    } catch (error) {
      console.error("Error fetching sales by period:", error);
      throw new Error(
        `Failed to fetch sales by period: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  },
  ["sales-by-period"],
  { revalidate: 3600 } // Revalidate after 1 hour
);

// Product category distribution
export const getProductCategoryDistribution = unstable_cache(
  async () => {
    try {
      await connectDB();

      const categoryDistribution = await ProductModel.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        {
          $unwind: "$categoryInfo",
        },
        {
          $group: {
            _id: "$category",
            name: { $first: "$categoryInfo.name" },
            count: { $sum: 1 },
            value: { $sum: { $multiply: ["$price", "$stock"] } },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            count: 1,
            value: 1,
          },
        },
      ]);

      return categoryDistribution;
    } catch (error) {
      console.error("Error fetching product category distribution:", error);
      throw new Error(
        `Failed to fetch product category distribution: ${error}`
      );
    }
  },
  ["product-categories"],
  { revalidate: 3600 } // Revalidate after 1 hour
);

// Get order status distribution
export const getOrderStatusDistribution = unstable_cache(
  async (
    range: "today" | "week" | "month" | "year" | "custom" = "month",
    customStart?: Date,
    customEnd?: Date
  ) => {
    try {
      await connectDB();
      const { startDate, endDate } = getDateRange(
        range,
        customStart,
        customEnd
      );

      const orderStatusDistribution = await OrderModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalValue: { $sum: "$total_price" },
          },
        },
      ]);

      return orderStatusDistribution;
    } catch (error) {
      console.error("Error fetching order status distribution:", error);
      throw new Error(`Failed to fetch order status distribution: ${error}`);
    }
  },
  ["order-status"],
  { revalidate: 300 } // Revalidate after 5 minutes
);

// Get delivery status distribution
export const getDeliveryStatusDistribution = unstable_cache(
  async (
    range: "today" | "week" | "month" | "year" | "custom" = "month",
    customStart?: Date,
    customEnd?: Date
  ) => {
    try {
      await connectDB();
      const { startDate, endDate } = getDateRange(
        range,
        customStart,
        customEnd
      );

      const deliveryStatusDistribution = await DeliveryModel.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate, $lte: endDate },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            revenue: { $sum: "$deliveryPrice" },
            cost: { $sum: "$driverPrice" },
            profit: { $sum: { $subtract: ["$deliveryPrice", "$driverPrice"] } },
          },
        },
      ]);

      return deliveryStatusDistribution;
    } catch (error) {
      console.error("Error fetching delivery status distribution:", error);
      throw new Error(`Failed to fetch delivery status distribution: ${error}`);
    }
  },
  ["delivery-status"],
  { revalidate: 300 } // Revalidate after 5 minutes
);

// Get all dashboard data in one call for efficiency
export async function getAllDashboardData(
  range: "today" | "week" | "month" | "year" | "custom" = "month",
  customStart?: Date,
  customEnd?: Date
) {
  try {
    const [
      stats,
      recentSales,
      topProducts,
      salesByDay,
      categoryDistribution,
      orderStatusDistribution,
      deliveryStatusDistribution,
    ] = await Promise.all([
      getDashboardStats(range, customStart, customEnd),
      getRecentSales(8),
      getTopProducts(5, range, customStart, customEnd),
      getSalesByPeriod(
        "daily",
        range === "today" ? "month" : range,
        customStart,
        customEnd
      ),
      getProductCategoryDistribution(),
      getOrderStatusDistribution(range, customStart, customEnd),
      getDeliveryStatusDistribution(range, customStart, customEnd),
    ]);

    return {
      stats,
      recentSales,
      topProducts,
      salesByDay,
      categoryDistribution,
      orderStatusDistribution,
      deliveryStatusDistribution,
    };
  } catch (error) {
    console.error("Error fetching all dashboard data:", error);
    throw new Error(`Failed to fetch dashboard data: ${error}`);
  }
}
