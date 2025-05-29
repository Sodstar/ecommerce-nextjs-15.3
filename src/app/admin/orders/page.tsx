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
  PackageCheck,
  CalendarRange,
  FilterX,
  Check,
  X,
  Clock,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { exportToExcel, exportToPDF } from "@/utils/exportHelpers";
import { getCurrentDateTime } from "@/utils/datetime";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { toMongolianCurrency } from "@/utils/formatter";
import { OrderStatus, TOrder } from "@/models/Orders";
import {
  getAllOrders,
  getOrdersByDateRange,
  getOrdersByStatus,
  deleteOrder,
  changeOrderStatus,
} from "@/actions/order-action";

type OrderWithPopulatedProduct = TOrder & {
  product_id: {
    _id: string;
    title: string;
    code: string;
    price: number;
  };
  createdAt: string;
  updatedAt: string;
};

export default function OrdersPage() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [orders, setOrders] = useState<OrderWithPopulatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(15);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, dateRange]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      let fetchedOrders;

      if (dateRange.from && dateRange.to && statusFilter !== "all") {
        // Apply both date range and status filters together
        fetchedOrders = await getOrdersByDateRange(
          dateRange.from,
          dateRange.to,
          statusFilter
        );
      } else if (dateRange.from && dateRange.to) {
        // Apply only date range filter
        fetchedOrders = await getOrdersByDateRange(
          dateRange.from,
          dateRange.to
        );
      } else if (statusFilter !== "all") {
        // Apply only status filter
        fetchedOrders = await getOrdersByStatus(statusFilter);
      } else {
        // Default: get all orders
        fetchedOrders = await getAllOrders();
      }

      setOrders(fetchedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Захиалгын жагсаалтыг татаж авахад алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchOrders();
    toast.success("Шинэчлэгдлээ");
  };

  const resetDateFilter = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (orderToDelete) {
      setIsLoading(true);
      try {
        await deleteOrder(orderToDelete);
        toast.success("Захиалга амжилттай устгагдлаа");
        fetchOrders();
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error("Захиалгыг устгахад алдаа гарлаа");
      } finally {
        setIsDeleteDialogOpen(false);
        setOrderToDelete(null);
        setIsLoading(false);
      }
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      await changeOrderStatus(orderId, newStatus);
      toast.success("Захиалгын төлөв амжилттай шинэчлэгдлээ");
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      console.error("Error changing order status:", error);
      toast.error("Захиалгын төлөвийг өөрчлөхөд алдаа гарлаа");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "ordered":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-600 border-blue-200"
          >
            <Clock className="w-3 h-3 mr-1" /> Захиалсан
          </Badge>
        );
      case "finishied":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 border-green-200"
          >
            <Check className="w-3 h-3 mr-1" /> Дууссан
          </Badge>
        );
      case "cancelled":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-600 border-red-200"
          >
            <X className="w-3 h-3 mr-1" /> Цуцалсан
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const columns: ColumnDef<OrderWithPopulatedProduct>[] = [
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
      header: "Захиалгын код",
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
      accessorKey: "product_id",
      header: "Бүтээгдэхүүн",
      cell: ({ row }) => {
        const product = row.original.product_id;
        return (
          <div>
            <div className="font-medium">{product?.title}</div>
            <div className="text-sm text-muted-foreground">
              Код: {product?.code}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "qty",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Тоо
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("qty")}</div>
      ),
    },
    {
      accessorKey: "total_price",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Нийт мөнгөн дүн
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("total_price") ? (
            `${toMongolianCurrency(row.getValue("total_price"))}₮`
          ) : (
            <div>-</div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer">Тайлбар</div>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("description") || "-"}</div>
      ),
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
        const order = row.original;
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
                onClick={() => router.push(`/admin/orders/${order._id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Засах
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Төлөв өөрчлөх</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => handleStatusChange(order._id, "ordered")}
                disabled={order.status === "ordered"}
                className={order.status === "ordered" ? "bg-blue-50" : ""}
              >
                <Clock className="mr-2 h-4 w-4 text-blue-500" />
                Захиалсан
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleStatusChange(order._id, "finishied")}
                disabled={order.status === "finishied"}
                className={order.status === "finishied" ? "bg-green-50" : ""}
              >
                <Check className="mr-2 h-4 w-4 text-green-500" />
                Дууссан
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleStatusChange(order._id, "cancelled")}
                disabled={order.status === "cancelled"}
                className={order.status === "cancelled" ? "bg-red-50" : ""}
              >
                <X className="mr-2 h-4 w-4 text-red-500" />
                Цуцалсан
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => handleDeleteClick(order._id)}
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
        : orders;

      const exportData = rowsToExport.map((order) => ({
        code: order.code,
        product: order.product_id?.title || "Unknown",
        product_code: order.product_id?.code || "Unknown",
        quantity: order.qty,
        price: order.product_id?.price
          ? `${order.product_id.price}`
          : "N/A",
        status:
          order.status === "ordered"
            ? "Захиалсан"
            : order.status === "finishied"
            ? "Дууссан"
            : "Цуцалсан",
        date: order.createdAt
          ? format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")
          : "N/A",
      }));

      const exportColumns = [
        { header: "Захиалгын код", accessor: "code" },
        { header: "Бүтээгдэхүүн", accessor: "product" },
        { header: "Бүтээгдэхүүний код", accessor: "product_code" },
        { header: "Тоо", accessor: "quantity" },
        { header: "Үнэ", accessor: "price" },
        { header: "Төлөв", accessor: "status" },
        { header: "Огноо", accessor: "date" },
      ];

      exportToExcel(null, [], {
        data: exportData,
        columns: exportColumns,
        filename: `orders_report_${getCurrentDateTime()}${
          hasSelected ? "_selected" : ""
        }`,
        sheetName: "Orders Report",
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
        : orders;

      const exportData = rowsToExport.map((order) => ({
        code: order.code,
        product: order.product_id?.title || "Unknown",
        quantity: order.qty,
        total_price: order.total_price,
        description: order.description || "-",
        status:
          order.status === "ordered"
            ? "Захиалсан"
            : order.status === "finishied"
            ? "Дууссан"
            : "Цуцалсан",
        date: order.createdAt
          ? format(new Date(order.createdAt), "yyyy-MM-dd HH:mm")
          : "N/A",
      }));

      const exportColumns = [
        { header: "Захиалгын код", accessor: "code" },
        { header: "Бүтээгдэхүүн", accessor: "product" },
        { header: "Тоо", accessor: "quantity" },
        { header: "Нийн мөнгөн дүн", accessor: "total_price" },
        { header: "Тайлбар", accessor: "description" },
        { header: "Төлөв", accessor: "status" },
        { header: "Огноо", accessor: "date" },
      ];

      exportToPDF({
        data: exportData,
        columns: exportColumns,
        title: `Захиалгын жагсаалт ${hasSelected ? " (сонгогдсон)" : ""}`,
        filename: `orders_report_${getCurrentDateTime()}${
          hasSelected ? "_selected" : ""
        }`,
      });

      toast.success(`PDF экспорт амжилттай хийгдлээ`);
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("PDF руу экспортлох үед алдаа гарлаа");
    }
  };

  const table = useReactTable({
    data: orders,
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
          <PackageCheck className="h-5 w-5 mr-4" />
          Захиалгын удирдлага
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
          <Button
            onClick={() => router.push("/admin/orders/new")}
            className="flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Шинэ захиалга
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
          placeholder="Кодоор хайх..."
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("code")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <Select
          value={statusFilter}
          onValueChange={(value) =>
            setStatusFilter(value as OrderStatus | "all")
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Төлөвөөр шүүх" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">Бүгд</SelectItem>
              <SelectItem value="ordered">Захиалсан</SelectItem>
              <SelectItem value="finishied">Дууссан</SelectItem>
              <SelectItem value="cancelled">Цуцалсан</SelectItem>
            </SelectGroup>
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
        ) : orders.length === 0 ? (
          <div className="flex justify-center items-center h-72">
            <p className="text-lg">Захиалга олдсонгүй</p>
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
                    Захиалга олдсонгүй
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
              {[5, 10, 15, 25, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Та итгэлтэй байна уу?</DialogTitle>
            <DialogDescription>
              Та энэ захиалгыг устгах гэж байна. Энэ үйлдлийг буцааж болохгүй.
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
