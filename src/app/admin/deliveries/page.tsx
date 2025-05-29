"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Download,
  Edit,
  Trash,
  FileText,
  Plus,
  RefreshCcw,
  Truck,
  CalendarRange,
  FilterX,
  Package,
  Eye,
  CheckIcon,
  Radar,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { exportToExcel, exportToPDF } from "@/utils/exportHelpers";
import { getCurrentDateTime } from "@/utils/datetime";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toMongolianCurrency } from "@/utils/formatter";
import { DeliveryStatus, TDelivery } from "@/models/Delivery";
import {
  getAllDeliveries,
  getDeliveriesByDateRange,
  deleteDelivery,
  updateDelivery,
} from "@/actions/delivery-action";
import { getAllDrivers } from "@/actions/driver-action";
import { updateSaleStatus } from "@/actions/sale-action";

type DeliveryWithPopulatedSale = TDelivery & {
  sale_id: {
    _id: string;
    code: string;
    total_price: number;
    cartItems: Array<{
      product_code: string;
      product_id: string;
      name: string;
      quantity: number;
      price: number;
    }>;
    user_id: {
      name: string;
      email: string;
    };
  };
  driver_id?: {
    _id: string;
    name: string;
    phone?: string;
  };
};

export default function DeliveriesPage() {
  const router = useRouter();
  const [saleToRecover, setSaleToRecover] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deliveries, setDeliveries] = useState<DeliveryWithPopulatedSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deliveryToDelete, setDeliveryToDelete] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(15);
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | "all">(
    "all"
  );
  const [driverFilter, setDriverFilter] = useState<string>("all");
  const [drivers, setDrivers] = useState<Array<{ _id: string; name: string }>>(
    []
  );
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    fetchDeliveries();
    fetchDrivers();
  }, [dateRange]);

  const fetchDeliveries = async () => {
    setIsLoading(true);
    try {
      let fetchedDeliveries;

      if (dateRange.from && dateRange.to) {
        fetchedDeliveries = await getDeliveriesByDateRange(
          dateRange.from,
          dateRange.to
        );
      } else {
        fetchedDeliveries = await getAllDeliveries();
      }

      // Filter out any deliveries that don't have a populated sale_id
      const validDeliveries = fetchedDeliveries.filter(
        (delivery: { sale_id: { cartItems: any } }) =>
          delivery.sale_id && delivery.sale_id.cartItems
      );
      setDeliveries(validDeliveries);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      toast.error("Хүргэлтийн жагсаалтыг татаж авахад алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const allDrivers = await getAllDrivers();
      setDrivers(
        allDrivers.map((driver: { _id: any; name: any }) => ({
          _id: driver._id,
          name: driver.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Жолооч татахад алдаа гарлаа");
    }
  };

  const refreshData = async () => {
    await fetchDeliveries();
    toast.success("Шинэчлэгдлээ");
  };

  const resetDateFilter = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const handleDeleteClick = (id: string, sale_id: string) => {
    setDeliveryToDelete(id);
    setSaleToRecover(sale_id);
    setIsDeleteDialogOpen(true);
  };

  const handleStatusChange = async (
    deliveryId: string,
    newStatus: DeliveryStatus
  ) => {
    setIsLoading(true);
    try {
      await updateDelivery(deliveryId, { status: newStatus });
      toast.success(`Төлөв амжилттай шинэчлэгдлээ`);
      fetchDeliveries();
    } catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Төлөв шинэчлэхэд алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deliveryToDelete) {
      setIsLoading(true);
      try {
        await deleteDelivery(deliveryToDelete);
        await updateSaleStatus(saleToRecover as string, false);

        toast.success("Хүргэлт амжилттай устгагдлаа");
        fetchDeliveries();
      } catch (error) {
        console.error("Error deleting delivery:", error);
        toast.error("Хүргэлтийг устгахад алдаа гарлаа");
      } finally {
        setIsDeleteDialogOpen(false);
        setDeliveryToDelete(null);
        setIsLoading(false);
      }
    }
  };

  const getStatusBadge = (status: DeliveryStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-600 border-yellow-200"
          >
            Хүлээгдэж байна
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            Хүргэлтэд гарсан
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            Хүргэгдсэн
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            Цуцлагдсан
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: ColumnDef<DeliveryWithPopulatedSale>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "code",
      header: "Хүргэлийн код",
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
      accessorKey: "cartItemsList",
      header: "Бараанууд",
      cell: ({ row }) => (
        <div className="w-40 overflow-x-auto">
          {row.original.sale_id && row.original.sale_id.cartItems ? (
            row.original.sale_id.cartItems.map((item, index) => (
              <div key={item.product_id.toString() + index} className="text-sm">
                [{item?.product_code}] {item?.name}{" "}
                {toMongolianCurrency(item?.price)}₮ - {item.quantity} ширхэг
              </div>
            ))
          ) : (
            <div className="text-muted-foreground italic">Бараа байхгүй</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "driver_id",
      header: "Жолооч",
      cell: ({ row }) => {
        const driver = row.original.driver_id;
        return driver ? (
          <div className="font-medium">{driver.name}</div>
        ) : (
          <div className="text-muted-foreground italic">-</div>
        );
      },
      filterFn: (row, id, value) => {
        return value === "all" ? true : row.original.driver_id?._id === value;
      },
    },
    {
      accessorKey: "status",
      header: "Төлөв",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
      filterFn: (row, id, value) => {
        return value === "all" ? true : row.getValue(id) === value;
      },
    },
    {
      accessorKey: "phone",
      header: "Утас",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "address",
      header: "Хаяг",
      cell: ({ row }) => (
        <div className="w-30 overflow-x-auto">{row.getValue("address")}</div>
      ),
    },
    {
      accessorKey: "sale_id.total_price",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Борлуулалтын дүн
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => {
        const sale = row.original.sale_id;
        return (
          <div className="font-medium">
            {sale?.total_price
              ? `${toMongolianCurrency(sale.total_price)}₮`
              : "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "deliveryPrice",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Хүргэлт
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {toMongolianCurrency(row.getValue("deliveryPrice"))}₮
        </div>
      ),
    },
    {
      accessorKey: "driverPrice",
      header: "Жолоочид",
      cell: ({ row }) => (
        <div className="font-medium">
          {toMongolianCurrency(row.getValue("driverPrice"))}₮
        </div>
      ),
    },
    {
      accessorKey: "summaryPrice",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Эцсийн дүн
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium text-green-600">
          {toMongolianCurrency(row.getValue("summaryPrice"))}₮
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Огноо
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div>
          {row.original.createdAt
            ? format(new Date(row.original.createdAt), "yyyy-MM-dd HH:mm")
            : "N/A"}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const delivery = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Үйлдлүүд</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/admin/deliveries/${delivery._id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Харах
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/admin/deliveries/${delivery._id}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Засах
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Төлөв өөрчлөх</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleStatusChange(delivery._id, "pending")}
                disabled={delivery.status === "pending" || isLoading}
                className={delivery.status === "pending" ? "bg-yellow-50" : ""}
              >
                <Badge
                  variant="outline"
                  className="bg-yellow-50 text-yellow-600 border-yellow-200 mr-2"
                >
                  Хүлээгдэж байна
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(delivery._id, "in-progress")}
                disabled={delivery.status === "in-progress" || isLoading}
                className={
                  delivery.status === "in-progress" ? "bg-blue-50" : ""
                }
              >
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-600 border-blue-200 mr-2"
                >
                  Хүргэлтэд гарсан
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(delivery._id, "completed")}
                disabled={delivery.status === "completed" || isLoading}
                className={delivery.status === "completed" ? "bg-green-50" : ""}
              >
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-600 border-green-200 mr-2"
                >
                  Хүргэгдсэн
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(delivery._id, "cancelled")}
                disabled={delivery.status === "cancelled" || isLoading}
                className={delivery.status === "cancelled" ? "bg-red-50" : ""}
              >
                <Badge
                  variant="outline"
                  className="bg-red-50 text-red-600 border-red-200 mr-2"
                >
                  Цуцлагдсан
                </Badge>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  handleDeleteClick(delivery._id, row.original.sale_id._id)
                }
                className="text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Устгах
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleExportToExcel = () => {
    if (table.getFilteredSelectedRowModel().rows.length === 0) {
      toast.warning("Сонголт хийгээгүй байна");
      return;
    }
    try {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const hasSelected = selectedRows.length > 0;
      const rowsToExport = hasSelected
        ? selectedRows.map((row) => row.original)
        : deliveries;

      const exportData = rowsToExport.map((delivery) => ({
        delivery_code: delivery.code || "Unknown",
        products:
          delivery.sale_id && delivery.sale_id.cartItems
            ? delivery.sale_id.cartItems
                .map(
                  (item) =>
                    `[${item?.product_code}] ${
                      item?.name
                    } ${toMongolianCurrency(item?.price)}₮ - ${
                      item.quantity
                    } ширхэг`
                )
                .join("\n")
            : "No products",
        status:
          delivery.status === "pending"
            ? "Хүлээгдэж байна"
            : delivery.status === "in-progress"
            ? "Хүргэлтэд гарсан"
            : delivery.status === "completed"
            ? "Хүргэгдсэн"
            : "Цуцлагдсан",
        phone: delivery.phone,
        address: delivery.address,
        sale_amount:
          delivery.sale_id && delivery.sale_id.total_price
            ? `${(delivery.sale_id.total_price)}`
            : "N/A",
        delivery_price: `${(delivery.deliveryPrice)}`,
        driver_price: `${(delivery.driverPrice)}`,
        total_amount: `${(delivery.summaryPrice)}`,
        date: delivery.createdAt
          ? format(new Date(delivery.createdAt), "yyyy-MM-dd HH:mm")
          : "N/A",
      }));

      const exportColumns = [
        { header: "Хүргэлтийн код", accessor: "delivery_code" },
        { header: "Бараанууд", accessor: "products" },
        { header: "Төлөв", accessor: "status" },
        { header: "Утас", accessor: "phone" },
        { header: "Хаяг", accessor: "address" },
        { header: "Борлуулалтын дүн", accessor: "sale_amount" },
        { header: "Хүргэлтийн төлбөр", accessor: "delivery_price" },
        { header: "Жолоочид өгөх", accessor: "driver_price" },
        { header: "Нийт дүн", accessor: "total_amount" },
        { header: "Огноо", accessor: "date" },
      ];

      exportToExcel(null, [], {
        data: exportData,
        columns: exportColumns,
        filename: `deliveries_report_${getCurrentDateTime()}${
          hasSelected ? "_selected" : ""
        }`,
        sheetName: "Deliveries Report",
      });

      toast.success("Excel экспорт амжилттай хийгдлээ");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Жагсаалтыг Excel руу экспортлох үед алдаа гарлаа");
    }
  };

  const handleExportToPDF = () => {
    if (table.getFilteredSelectedRowModel().rows.length === 0) {
      toast.warning("Сонголт хийгээгүй байна");
      return;
    }
    try {
      const selectedRows = table.getFilteredSelectedRowModel().rows;
      const hasSelected = selectedRows.length > 0;
      const rowsToExport = hasSelected
        ? selectedRows.map((row) => row.original)
        : deliveries;

      const exportData = rowsToExport.map((delivery) => ({
        sale_code: delivery.code || "Unknown",
        products:
          delivery.sale_id && delivery.sale_id.cartItems
            ? delivery.sale_id.cartItems
                .map(
                  (item) =>
                    `[${item?.product_code}] ${
                      item?.name
                    } ${toMongolianCurrency(item?.price)}₮ - ${
                      item.quantity
                    } ширхэг`
                )
                .join("\n")
            : "No products",
        status:
          delivery.status === "pending"
            ? "Хүлээгдэж байна"
            : delivery.status === "in-progress"
            ? "Хүргэлтэд гарсан"
            : delivery.status === "completed"
            ? "Хүргэгдсэн"
            : "Цуцлагдсан",
        phone: delivery.phone,
        address: delivery.address,
        sale_amount:
          delivery.sale_id && delivery.sale_id.total_price
            ? `${toMongolianCurrency(delivery.sale_id.total_price)}₮`
            : "N/A",
        delivery_price: `${toMongolianCurrency(delivery.deliveryPrice)}₮`,
        driver_price: `${toMongolianCurrency(delivery.driverPrice)}₮`,
        total_amount: `${toMongolianCurrency(delivery.summaryPrice)}₮`,
      }));

      const exportColumns = [
        { header: "Хүргэлтийн код", accessor: "sale_code" },
        { header: "Бараанууд", accessor: "products" },
        { header: "Төлөв", accessor: "status" },
        { header: "Утас", accessor: "phone" },
        { header: "Хаяг", accessor: "address" },
        { header: "Борлуулалтын дүн", accessor: "sale_amount" },
        { header: "Хүргэлтийн төлбөр", accessor: "delivery_price" },
        { header: "Жолоочид өгөх", accessor: "driver_price" },
        { header: "Нийт дүн", accessor: "total_amount" },
      ];

      exportToPDF({
        data: exportData,
        columns: exportColumns,
        title: `Хүргэлтийн жагсаалт ${hasSelected ? " (сонгогдсон)" : ""}`,
        filename: `deliveries_report_${getCurrentDateTime()}${
          hasSelected ? "_selected" : ""
        }`,
      });

      toast.success(`PDF экспорт амжилттай хийгдлээ`);
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("PDF руу экспортлох үед алдаа гарлаа");
    }
  };

  const filteredDeliveries = React.useMemo(() => {
    let filtered = deliveries;

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (delivery) => delivery.status === statusFilter
      );
    }

    if (driverFilter !== "all") {
      filtered = filtered.filter(
        (delivery) =>
          delivery.driver_id && delivery.driver_id._id === driverFilter
      );
    }

    return filtered;
  }, [deliveries, statusFilter, driverFilter]);

  const table = useReactTable({
    data: filteredDeliveries,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold flex items-center">
          <Truck className="h-5 w-5 mr-4" />
          Хүргэлтийн удирдлага
        </h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Шинэчлэх
          </Button>
          <a href="/check" target="_blank" rel="">
                   <Button
            variant="outline"
            className="flex items-center"
          >
            <Radar className="mr-2 h-4 w-4" />
            Хүргэлт шалгах
          </Button>
          </a>
          <Button
            onClick={() => router.push("/admin/sales")}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Шинэ хүргэлт
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Download className="mr-2 h-4 w-4" />
                Экспорт
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportToExcel}>
                <FileText className="mr-2 h-4 w-4" />
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center py-4 gap-2 flex-wrap">
        <Input
          placeholder="Хүргэлтийн кодоор хайх..."
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("code")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as DeliveryStatus | "all")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Төлөвөөр шүүх" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүгд</SelectItem>
            <SelectItem value="pending">Хүлээгдэж байна</SelectItem>
            <SelectItem value="in-progress">Хүргэлтэд гарсан</SelectItem>
            <SelectItem value="completed">Хүргэгдсэн</SelectItem>
            <SelectItem value="cancelled">Цуцлагдсан</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={driverFilter}
          onValueChange={(value) => setDriverFilter(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Жолоочоор шүүх" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүх жолооч</SelectItem>
            {drivers.map((driver) => (
              <SelectItem key={driver._id} value={driver._id}>
                {driver.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center ml-auto space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[260px] justify-start text-left font-normal",
                  !dateRange.from && "text-muted-foreground"
                )}
              >
                <CalendarRange className="mr-2 h-4 w-4" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} -{" "}
                      {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  <span>Огноогоор хайлт хийх</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) =>
                  setDateRange({
                    from: range?.from,
                    to: range?.to,
                  })
                }
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          {(dateRange.from || dateRange.to) && (
            <Button
              variant="ghost"
              onClick={resetDateFilter}
              className="h-8 px-2 lg:px-3"
            >
              <FilterX className="h-4 w-4" />
              Цэвэрлэх
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Багана <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredDeliveries.length === 0 ? (
          <div className="flex justify-center items-center h-72">
            <div className="text-center">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">Хүргэлт олдсонгүй</p>
              <p className="text-gray-500 mt-1">
                Хайлт хийсэн үр дүнд хүргэлт олдсонгүй
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Хүргэлт олдсонгүй
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Сонгосон {table.getFilteredSelectedRowModel().rows.length} [нийт:{" "}
          {table.getRowCount()}]
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 15, 25, 50, 100, 250, 500, 1000].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Өмнөх
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Дараах
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Та итгэлтэй байна уу?</DialogTitle>
            <DialogDescription>
              Та энэ хүргэлтийг устгах гэж байна. Энэ үйлдлийг буцааж болохгүй.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isLoading}
            >
              Болих
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isLoading}
            >
              {isLoading ? "Устгаж байна..." : "Устгах"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
