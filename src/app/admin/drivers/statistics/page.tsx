"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  CalendarIcon,
  Car,
  CircleDollarSign,
  ClipboardCheck,
  Clock,
  Download,
  FileText,
  Truck,
  TruckIcon,
  Wallet,
} from "lucide-react";
import { DateRange } from "react-day-picker";
import { format, subDays } from "date-fns";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getDriverPerformanceStats,
  getIndividualDriverStats,
  getDeliveryTrends,
  getTopPerformingDrivers,
} from "@/actions/driver-action";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { exportToExcel, exportToPDF } from "@/utils/exportHelpers";
import { getCurrentDateTime } from "@/utils/datetime";

// Define types for our statistics
type DateRangeType = "today" | "week" | "month" | "year" | "custom";

interface PerformanceStats {
  totalDeliveries: number;
  totalRevenue: number;
  totalDriverPayments: number;
  totalProfit: number;
  statusBreakdown: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  averages: {
    deliveryPrice: number;
    driverPayment: number;
    timeToComplete: number;
  };
  dateRange: {
    start: Date;
    end: Date;
  };
}

interface DriverStats {
  _id: string;
  name: string;
  phone: string;
  vehicle: string;
  stats: {
    totalDeliveries: number;
    completedDeliveries: number;
    inProgressDeliveries: number;
    pendingDeliveries: number;
    cancelledDeliveries: number;
    totalEarnings: number;
    revenueGenerated: number;
    profit: number;
    completionRate: number;
  };
}

interface DeliveryTrend {
  period: string;
  count: number;
  revenue: number;
  driverPayments: number;
  profit: number;
}

interface TopDriver {
  _id: string;
  name: string;
  phone: string;
  vehicle: string;
  totalDeliveries: number;
  totalEarnings: number;
  revenueGenerated: number;
  profit: number;
}

// Color constants
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BFC"];
const STATUS_COLORS = {
  pending: "#FFBB28",
  inProgress: "#0088FE",
  completed: "#00C49F",
  cancelled: "#FF8042",
  failed: "#FF4842",
  returned: "#A28BFC",
  assigned: "#82ca9d",
  processing: "#8884d8",
};

export default function DriverStatistics() {
  const router = useRouter();

  // Use state to track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  // State for date range and loading
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>("month");
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [loading, setLoading] = useState<boolean>(true);

  // State for statistics data
  const [performanceStats, setPerformanceStats] =
    useState<PerformanceStats | null>(null);
  const [driverStats, setDriverStats] = useState<DriverStats[]>([]);
  const [deliveryTrends, setDeliveryTrends] = useState<DeliveryTrend[]>([]);
  const [topDrivers, setTopDrivers] = useState<TopDriver[]>([]);
  const [periodType, setPeriodType] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );

  // Set mounted state when component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load data based on selected date range
  const loadData = async () => {
    if (!isMounted) return;

    try {
      setLoading(true);

      // Determine date parameters
      let start, end;
      if (dateRangeType === "custom" && date?.from && date?.to) {
        start = date.from;
        end = date.to;
      }

      // Fetch all statistics data in parallel
      const [stats, drivers, trends, topPerformers] = await Promise.all([
        getDriverPerformanceStats(dateRangeType, start, end),
        getIndividualDriverStats(dateRangeType, start, end),
        getDeliveryTrends(
          periodType,
          dateRangeType === "today" ? "week" : dateRangeType,
          start,
          end
        ),
        getTopPerformingDrivers(dateRangeType, 5, start, end),
      ]);

      // Update state with fetched data
      setPerformanceStats(stats);
      setDriverStats(
        drivers.map((driver) => ({
          ...driver,
          _id: String(driver._id),
        }))
      );
      setDeliveryTrends(trends);
      setTopDrivers(topPerformers);
    } catch (error) {
      console.error("Error loading driver statistics:", error);
      toast.error("Жолоочийн статистик ачаалахад алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  // Update data when date range or period type changes, but only after mounting
  useEffect(() => {
    if (isMounted) {
      loadData();
    }
  }, [dateRangeType, periodType, isMounted]);

  // Handle date range selection change
  const handleDateRangeChange = (newRange: DateRangeType) => {
    setDateRangeType(newRange);

    // Reset custom date range if switching to predefined range
    if (newRange !== "custom") {
      setDate(undefined);
    } else if (!date) {
      // If switching to custom but no date set, initialize with last 30 days
      setDate({
        from: subDays(new Date(), 30),
        to: new Date(),
      });
    }
  };

  // Handle custom date selection
  const handleCustomDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    if (newDate?.from && newDate?.to && isMounted) {
      loadData();
    }
  };

  // Handle period type change for trends
  const handlePeriodTypeChange = (
    newPeriod: "daily" | "weekly" | "monthly"
  ) => {
    setPeriodType(newPeriod);
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("mn-MN", {
      style: "currency",
      currency: "MNT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format percentage for display
  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  // Prepare data for status breakdown pie chart
  const getStatusData = () => {
    if (!performanceStats) return [];

    return [
      {
        name: "Хүлээгдэж буй",
        value: performanceStats.statusBreakdown.pending,
        color: STATUS_COLORS.pending,
      },
      {
        name: "Хүргэж буй",
        value: performanceStats.statusBreakdown.inProgress,
        color: STATUS_COLORS.inProgress,
      },
      {
        name: "Хүргэсэн",
        value: performanceStats.statusBreakdown.completed,
        color: STATUS_COLORS.completed,
      },
      {
        name: "Цуцалсан",
        value: performanceStats.statusBreakdown.cancelled,
        color: STATUS_COLORS.cancelled,
      },
    ];
  };

  // Format date display
  const formatDateDisplay = () => {
    if (dateRangeType === "custom" && date?.from && date?.to) {
      return `${format(date.from, "yyyy.MM.dd")} - ${format(
        date.to,
        "yyyy.MM.dd"
      )}`;
    }

    switch (dateRangeType) {
      case "today":
        return "Өнөөдөр";
      case "week":
        return "Сүүлийн 7 хоног";
      case "month":
        return "Сүүлийн 30 хоног";
      case "year":
        return "Сүүлийн 365 хоног";
      default:
        return "";
    }
  };

  // If not mounted yet (server-side), render a loading state or placeholder
  if (!isMounted) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Жолоочийн гүйцэтгэл</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-4 w-3/4 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Car className="h-5 w-5 mr-4" />
          Жолоочийн гүйцэтгэл
        </h1>
        <div className="flex gap-2">
          <Select
            value={dateRangeType}
            onValueChange={(value: DateRangeType) =>
              handleDateRangeChange(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Хугацааны интервал" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Өнөөдөр</SelectItem>
              <SelectItem value="week">7 хоног</SelectItem>
              <SelectItem value="month">30 хоног</SelectItem>
              <SelectItem value="year">1 жил</SelectItem>
              <SelectItem value="custom">Тусгай</SelectItem>
            </SelectContent>
          </Select>

          {dateRangeType === "custom" && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-[300px] justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "yyyy-MM-dd")} -{" "}
                        {format(date.to, "yyyy-MM-dd")}
                      </>
                    ) : (
                      format(date.from, "yyyy-MM-dd")
                    )
                  ) : (
                    <span>Огноо сонгох</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleCustomDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      <div className="flex items-center py-2 bg-muted/20 px-4 mb-6 rounded-md">
        <p className="text-sm font-medium flex-1">
          Статистик үзүүлэлтүүд:{" "}
          <span className="font-bold">{formatDateDisplay()}</span>
        </p>
      </div>

      {/* Stats overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Нийт хүргэлт</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-1/2" />
            ) : (
              <div className="text-2xl font-bold">
                {performanceStats?.totalDeliveries || 0}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {performanceStats &&
              performanceStats.statusBreakdown.completed > 0
                ? `${
                    performanceStats.statusBreakdown.completed
                  } хүргэлт дууссан (${Math.round(
                    (performanceStats.statusBreakdown.completed /
                      performanceStats.totalDeliveries) *
                      100
                  )}%)`
                : "Хүргэлт бүртгэгдээгүй байна"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Нийт орлого</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-3/4" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(performanceStats?.totalRevenue || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Дундаж хүргэлт{" "}
              {formatCurrency(performanceStats?.averages.deliveryPrice || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Жолоочийн орлого
            </CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-3/4" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(performanceStats?.totalDriverPayments || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Дундаж{" "}
              {formatCurrency(performanceStats?.averages.driverPayment || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ашиг</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-10 w-3/4" />
            ) : (
              <div className="text-2xl font-bold">
                {formatCurrency(performanceStats?.totalProfit || 0)}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {performanceStats && performanceStats.totalRevenue > 0
                ? `Ашгийн хувь ${Math.round(
                    (performanceStats.totalProfit /
                      performanceStats.totalRevenue) *
                      100
                  )}%`
                : "Орлого бүртгэгдээгүй байна"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and tables */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Бүтээмж</TabsTrigger>
          <TabsTrigger value="trends">Граф</TabsTrigger>
          <TabsTrigger value="drivers">Жолоочдийн гүйцэтгэл</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Хүргэлтийн төлөвийн харьцаа</CardTitle>
                <CardDescription>
                  Төлөв бүрээрх хүргэлтийн харьцаа
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="w-full h-[300px] flex items-center justify-center">
                    <Skeleton className="h-[250px] w-[250px] rounded-full" />
                  </div>
                ) : performanceStats && performanceStats.totalDeliveries > 0 ? (
                  <div className="w-full h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getStatusData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={(entry) => `${entry.name}: ${entry.value}`}
                        >
                          {getStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [`${value} хүргэлт`, ""]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground">
                    Хүргэлтийн мэдээлэл хоосон байна
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle>Шилдэг жолоочид</CardTitle>
                <CardDescription>
                  Хүргэлтээр тэргүүлж буй жолоочид
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : topDrivers && topDrivers.length > 0 ? (
                  <div className="space-y-4">
                    {topDrivers.map((driver, index) => (
                      <div
                        key={driver._id}
                        className="flex items-center justify-between border-b pb-2 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-8 w-8 rounded-full items-center justify-center text-white font-medium text-xs`}
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{driver.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {driver.vehicle}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {driver.totalDeliveries} хүргэлт
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatCurrency(driver.totalEarnings)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    Жолоочийн мэдээлэл хоосон байна
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <div className="flex justify-end">
            <Select
              value={periodType}
              onValueChange={(value: "daily" | "weekly" | "monthly") =>
                handlePeriodTypeChange(value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Үзүүлэлтийн интервал" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Өдрөөр</SelectItem>
                <SelectItem value="weekly">7 хоногоор</SelectItem>
                <SelectItem value="monthly">Сараар</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Хүргэлтийн тоо</CardTitle>
              <CardDescription>
                {periodType === "daily"
                  ? "Өдөр тутмын"
                  : periodType === "weekly"
                  ? "Долоо хоног тутмын"
                  : "Сар тутмын"}{" "}
                хүргэлтийн тоо
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[350px] w-full" />
              ) : deliveryTrends && deliveryTrends.length > 0 ? (
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={deliveryTrends}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="period"
                        tickFormatter={(value) => {
                          // Format based on period type
                          if (periodType === "monthly") {
                            const [year, month] = value.split("-");
                            return `${month}/${year.substring(2)}`;
                          } else if (periodType === "weekly") {
                            const [year, week] = value.split("-W");
                            return `W${week}`;
                          } else {
                            // For daily, show just the day and month
                            const date = new Date(value);
                            return format(date, "MM.dd");
                          }
                        }}
                      />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => {
                          if (name === "count")
                            return [`${value} хүргэлт`, "Хүргэлтийн тоо"];
                          return [
                            formatCurrency(Number(value)),
                            name === "revenue"
                              ? "Нийт орлого"
                              : name === "driverPayments"
                              ? "Жолоочийн орлого"
                              : "Ашиг",
                          ];
                        }}
                      />
                      <Legend
                        formatter={(value) => {
                          if (value === "count") return "Хүргэлтийн тоо";
                          if (value === "revenue") return "Нийт орлого";
                          if (value === "driverPayments")
                            return "Жолоочийн орлого";
                          if (value === "profit") return "Ашиг";
                          return value;
                        }}
                      />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[350px] flex items-center justify-center text-muted-foreground">
                  Хүргэлтийн мэдээлэл хоосон байна
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Жолооч бүрийн гүйцэтгэл</CardTitle>
              <CardDescription>
                Жолооч бүрийн дэлгэрэнгүй гүйцэтгэл
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-96 w-full" />
                </div>
              ) : driverStats && driverStats.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Жолооч</TableHead>
                        <TableHead>Мэдээлэл</TableHead>
                        <TableHead>Нийт хүргэлт</TableHead>
                        <TableHead>Дууссан</TableHead>
                        <TableHead>Гүйцэтгэл %</TableHead>
                        <TableHead className="text-right">Орлого</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {driverStats.map((driver) => (
                        <TableRow key={driver._id}>
                          <TableCell className="font-medium">
                            {driver.name}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{driver.phone}</span>
                              <span className="text-xs text-muted-foreground">
                                {driver.vehicle}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{driver.stats.totalDeliveries}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{driver.stats.completedDeliveries}</span>
                              <span className="text-xs text-muted-foreground">
                                {driver.stats.pendingDeliveries} хүлээгдэж буй
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-16 bg-muted overflow-hidden rounded-full">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${driver.stats.completionRate}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium">
                                {driver.stats.completionRate.toFixed(1)}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex flex-col items-end">
                              <span>
                                {formatCurrency(driver.stats.totalEarnings)}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatCurrency(driver.stats.revenueGenerated)}{" "}
                                орлого
                              </span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-96 flex items-center justify-center text-muted-foreground">
                  Жолоочийн мэдээлэл хоосон байна
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
