"use client";

import { useState, useEffect } from "react";
import {
  BarChart,
  Calendar,
  CreditCard,
  ShoppingBag,
  Box,
  Users,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAllDashboardData,
  DashboardStats,
  RecentSale,
  TopProduct,
} from "@/actions/dashboard-action";
import { DateRangePicker } from "@/components/date-range-picker";
import { DateRange } from "react-day-picker";
import Link from "next/link";
import { convertDate } from "@/utils/datetime";
import { toMongolianCurrency } from "@/utils/formatter";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const [timeRange, setTimeRange] = useState<
    "today" | "week" | "month" | "year" | "custom"
  >("month");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSales, setRecentSales] = useState<RecentSale[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        let customStart, customEnd;

        if (timeRange === "custom" && dateRange?.from && dateRange?.to) {
          customStart = dateRange.from;
          customEnd = dateRange.to;
        }

        const data = await getAllDashboardData(
          timeRange,
          customStart,
          customEnd
        );

        setStats(data.stats);
        setRecentSales(data.recentSales);
        setTopProducts(data.topProducts);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange, dateRange]);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (range?.from && range?.to) {
      setTimeRange("custom");
    }
  };

  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value as "today" | "week" | "month" | "year" | "custom");
    // If changing to predefined range, clear custom date range
    if (value !== "custom") {
      setDateRange(undefined);
    }
  };

  return (
    <main className="p-6 space-y-6">
      {/* Time range selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Ерөнхий статистик</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <Select value={timeRange} onValueChange={handleTimeRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Хугацааны интервал" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Интервал</SelectLabel>
                <SelectItem value="today">Өнөөдөр</SelectItem>
                <SelectItem value="week">Сүүлийн 7 хоног</SelectItem>
                <SelectItem value="month">Сүүлийн 30 хоног</SelectItem>
                <SelectItem value="year">Сүүлийн 1 жил</SelectItem>
                <SelectItem value="custom">Өөрийн сонголт</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {timeRange === "custom" && (
            <DateRangePicker
              date={dateRange}
              onDateChange={handleDateRangeChange}
            />
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Нийт борлуулалт</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-24 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold mt-1">
                    {`${stats?.sales.total.toLocaleString()}₮`}
                  </h3>
                )}
                {isLoading ? (
                  <div className="flex items-center mt-1">
                    <ArrowUpRight className="h-3 w-3 mr-1 text-green-600" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                ) : (
                  <p
                    className={`text-xs mt-1 flex items-center ${
                      stats?.sales.trend && stats.sales.trend > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {stats?.sales.trend && stats.sales.trend > 0 ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {`${Math.abs(stats?.sales.trend || 0)}% ${
                      timeRange === "today" ? "өчигдрөөс" : "өмнөх үеэс"
                    }`}
                  </p>
                )}
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Нийт захиалга</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold mt-1">
                    {stats?.orders.total}
                  </h3>
                )}
                {isLoading ? (
                  <div className="flex items-center mt-1 text-green-600">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ) : (
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {`${stats?.orders.pending || 0} шийдвэрлэх хүлээгдэж буй`}
                  </p>
                )}
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <ShoppingBag className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Бүтээгдэхүүн</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold mt-1">
                    {stats?.products.total}
                  </h3>
                )}
                {isLoading ? (
                  <div className="flex items-center mt-1 text-amber-600">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ) : (
                  <p className="text-xs text-amber-600 mt-1 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {`${stats?.products.lowStock || 0} бараа дуусах дөхсөн`}
                  </p>
                )}
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Box className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Хүргэлт</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 mt-1" />
                ) : (
                  <h3 className="text-2xl font-bold mt-1">
                    {stats?.deliveries.total}
                  </h3>
                )}
                {isLoading ? (
                  <div className="flex items-center mt-1 text-purple-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                ) : (
                  <p className="text-xs text-purple-600 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {`${stats?.deliveries.revenue.toLocaleString()}₮ орлого`}
                  </p>
                )}
              </div>
              <div className="bg-amber-500/10 p-3 rounded-full">
                <Users className="h-5 w-5 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Топ бүтээгдэхүүнүүд</CardTitle>
            <CardDescription>
              Хамгийн их борлуулалттай бүтээгдэхүүнүүд
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topProducts.map((product) => (
                  <div
                    key={product._id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{product.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Үлдэгдэл: {product.stock}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{product.soldCount} ширхэг</p>
                      <p className="text-sm text-muted-foreground">
                        {product.totalRevenue.toLocaleString()}₮
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Sales */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Сүүлийн борлуулалтууд</CardTitle>
            <Link href="/admin/sales">
              {" "}
              <Button variant="outline" size="sm">
                Бүгдийг харах
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Код</TableHead>
                    <TableHead>Борлуулагч</TableHead>
                    <TableHead>Огноо</TableHead>
                    <TableHead className="text-right">Дүн</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="p-0 px-4 py-4">
                          <Skeleton className="h-5 w-16" />
                        </TableCell>
                        <TableCell className="p-0 px-4 py-4">
                          <Skeleton className="h-5 w-24" />
                        </TableCell>
                        <TableCell className="p-0 px-4 py-4">
                          <Skeleton className="h-5 w-32" />
                        </TableCell>
                        <TableCell className="text-right p-0 px-4 py-4">
                          <Skeleton className="h-5 w-20 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Код</TableHead>
                    <TableHead>Борлуулагч</TableHead>
                    <TableHead>Огноо</TableHead>
                    <TableHead className="text-right">Дүн</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentSales.map((sale) => (
                    <TableRow key={sale._id}>
                      <TableCell className="font-medium">{sale.code}</TableCell>
                      <TableCell>{sale.userName}</TableCell>
                      <TableCell>{convertDate(sale.date)}</TableCell>
                      <TableCell className="text-right">
                        {toMongolianCurrency(sale.total_price || 0)}₮
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Захиалгын статистик</CardTitle>
            <CardDescription>Захиалгын төлөв байдал</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 font-medium">Биелсэн</p>
                    <Skeleton className="h-8 w-16 mt-2" />
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-amber-600 font-medium">Хүлээгдэж буй</p>
                    <Skeleton className="h-8 w-16 mt-2" />
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-600 font-medium">Цуцлагдсан</p>
                    <Skeleton className="h-8 w-16 mt-2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-600 font-medium">Биелсэн</p>
                    <h4 className="text-2xl font-bold">
                      {stats?.orders.completed || 0}
                    </h4>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-amber-600 font-medium">Хүлээгдэж буй</p>
                    <h4 className="text-2xl font-bold">
                      {stats?.orders.pending || 0}
                    </h4>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-600 font-medium">Цуцлагдсан</p>
                    <h4 className="text-2xl font-bold">
                      {stats?.orders.cancelled || 0}
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Бүтээгдэхүүний статистик</CardTitle>
            <CardDescription>Агуулахын мэдээлэл</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-600 font-medium">Нийт</p>
                    <Skeleton className="h-8 w-16 mt-2" />
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-amber-600 font-medium">Дуусах дөхсөн</p>
                    <Skeleton className="h-8 w-16 mt-2" />
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-600 font-medium">Дууссан</p>
                    <Skeleton className="h-8 w-16 mt-2" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-600 font-medium">Нийт</p>
                    <h4 className="text-2xl font-bold">
                      {stats?.products.total || 0}
                    </h4>
                  </div>
                  <div className="bg-amber-50 p-4 rounded-lg">
                    <p className="text-amber-600 font-medium">Дуусах дөхсөн</p>
                    <h4 className="text-2xl font-bold">
                      {stats?.products.lowStock || 0}
                    </h4>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-600 font-medium">Дууссан</p>
                    <h4 className="text-2xl font-bold">
                      {stats?.products.outOfStock || 0}
                    </h4>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delivery Status */}
      <Card>
        <CardHeader>
          <CardTitle>Хүргэлтийн статистик</CardTitle>
          <CardDescription>Хүргэлтийн төлөв байдал</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-600 font-medium">Нийт</p>
                  <Skeleton className="h-8 w-16 mt-2" />
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-amber-600 font-medium">Хүлээгдэж буй</p>
                  <Skeleton className="h-8 w-16 mt-2" />
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-600 font-medium">Хүргэлтэд</p>
                  <Skeleton className="h-8 w-16 mt-2" />
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-600 font-medium">Хүргэгдсэн</p>
                  <Skeleton className="h-8 w-16 mt-2" />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-600 font-medium">Нийт</p>
                  <h4 className="text-2xl font-bold">
                    {stats?.deliveries.total || 0}
                  </h4>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-amber-600 font-medium">Хүлээгдэж буй</p>
                  <h4 className="text-2xl font-bold">
                    {stats?.deliveries.pending || 0}
                  </h4>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-purple-600 font-medium">Хүргэлтэд</p>
                  <h4 className="text-2xl font-bold">
                    {stats?.deliveries.inProgress || 0}
                  </h4>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-600 font-medium">Хүргэгдсэн</p>
                  <h4 className="text-2xl font-bold">
                    {stats?.deliveries.completed || 0}
                  </h4>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
