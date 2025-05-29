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
  Package,
  FilterX,
  Eye,
  CalendarRange,
  RefreshCcw,
  Box,
  Plane,
} from "lucide-react";

import { Label } from "@/components/ui/label";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { exportToExcel, exportToPDF } from "@/utils/exportHelpers";
import { convertDate, getCurrentDateTime } from "@/utils/datetime";
import { toast } from "sonner";
import { TSale } from "@/models/Sale";
import {
  getAllSales,
  getSalesByDateRange,
  deleteSale,
} from "@/actions/sale-action";
import { toMongolianCurrency } from "@/utils/formatter";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import MakeDeliveryButton from "@/components/makeDeliveryButton";

export default function SalesPage() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [sales, setSales] = useState<TSale[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saleToDelete, setSaleToDelete] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(10);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    fetchSales();
  }, [dateRange]);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      if (dateRange.from && dateRange.to) {
        const filteredSales = await getSalesByDateRange(
          dateRange.from,
          dateRange.to
        );
        setSales(filteredSales);
      } else {
        const allSales = await getAllSales();

        setSales(allSales);
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Борлуулалтыг татаж авахад алдаа гарлаа");
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchSales();
    toast.success("Шинэчлэгдлээ");
  };

  const resetDateFilter = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  const handleDeleteClick = (id: string) => {
    setSaleToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (saleToDelete) {
      setIsLoading(true);
      try {
        await deleteSale(saleToDelete);
        toast.success("Борлуулалт амжилттай устгагдлаа");
        fetchSales();
      } catch (error) {
        console.error("Error deleting sale:", error);
        toast.error("Борлуулалтыг устгахад алдаа гарлаа");
      } finally {
        setIsDeleteDialogOpen(false);
        setSaleToDelete(null);
        setIsLoading(false);
      }
    }
  };

  const columns: ColumnDef<TSale>[] = [
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
      header: "Борлуулалтын код",
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
      accessorKey: "total_price",
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Нийт дүн
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="font-medium">
          {toMongolianCurrency(row.getValue("total_price"))}₮
        </div>
      ),
    },
    {
      accessorKey: "discount",
      header: "Х.%",
      cell: ({ row }) => <div>{row.getValue("discount")}%</div>,
    },
    {
      accessorKey: "phone",
      header: "Утас",
      cell: ({ row }) => (
        <div>
          {row.getValue("phone") == "" ? <div>-</div> : row.getValue("phone")}
        </div>
      ),
    },
    {
      accessorKey: "cartItems",
      header: "Бараанууд",
      cell: ({ row }) => <div>{row.original.cartItems.length} Бараа</div>,
    },
    {
      accessorKey: "cartItemsList",
      header: "Бараанууд",
      cell: ({ row }) => (
        <div>
          {row.original.cartItems.map((item, index) => (
            <div key={item.product_id.toString()} className="text-sm">
              [{item?.product_code}] {item?.name}{" "}
              {toMongolianCurrency(item?.price)}₮ - {item.quantity} ширхэг
            </div>
          ))}
        </div>
      ),
    },
    {
      accessorKey: "user_id",
      header: "Борлуулсан ажилтан",
      cell: ({ row }) => (
        <div>
          {typeof row.original.user_id === "object" &&
          row.original.user_id !== null &&
          "name" in (row.original.user_id as unknown as { name: string })
            ? (row.original.user_id as unknown as { name: string }).name
            : "Unknown"}
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
            ? format(new Date(row.original.createdAt), "yyyy-MM-dd HH:mm:ss")
            : "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "createDelivery",
      header: ({ column }) => (
        <div className="flex items-center cursor-pointer"></div>
      ),
      cell: ({ row }) => {
        console.log(row.original);
        const isSubmited = row.original.submited || false;
        if (!isSubmited) return <MakeDeliveryButton data={row.original} />;
        else
          return (
            <Button variant="outline" disabled size={"sm"}>
              <Plane className="h-4 w-4" />
              Хүргэлтэд гарсан
            </Button>
          );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sale = row.original;
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
                onClick={() => router.push(`/admin/sales/${sale._id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Харах
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/admin/sales/${sale._id}/edit`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Засах
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleDeleteClick(sale._id)}
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
        : sales;

      const exportData = rowsToExport.map((sale) => ({
        code: sale.code,
        total_price: sale.total_price,
        discount: sale.discount,
        phone: sale.phone,
        items: sale.cartItems?.length || 0,
        products: sale.cartItems
          .map(
            (item) =>
              `[${item?.product_code}] ${item?.name} ${toMongolianCurrency(
                item?.price
              )}₮ - ${item.quantity} ширхэг`
          )
          .join("\n"),
        salesperson:
          typeof sale.user_id === "object" &&
          sale.user_id &&
          "name" in sale.user_id
            ? (sale.user_id as any).name
            : "Unknown",
        date: sale.createdAt ? convertDate(sale.createdAt.toString()) : "N/A",
      }));

      const exportColumns = [
        { header: "Борлуулалтын дугаар", accessor: "code" },
        { header: "Дүн", accessor: "total_price" },
        { header: "Хямдрал", accessor: "discount" },
        { header: "Утасны дугаар", accessor: "phone" },
        { header: "Бараа", accessor: "items" },
        { header: "Бараануудын жагсаалт", accessor: "products" },
        { header: "Худалдагч", accessor: "salesperson" },
        { header: "Огноо", accessor: "date" },
      ];

      exportToExcel(null, [], {
        data: exportData,
        columns: exportColumns,
        filename: `sales_report_${getCurrentDateTime()}${
          hasSelected ? "_selected" : ""
        }`,
        sheetName: "Sales Report",
      });

      toast.success(
        `Амжилттай ${
          hasSelected ? "сонгогдсон" : "бүгд"
        } Excel руу экспортлогдлоо`
      );
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
        : sales;

      const exportData = rowsToExport.map((sale) => ({
        code: sale.code,
        total_price: toMongolianCurrency(sale.total_price) + "₮",
        discount: sale.discount,
        phone: sale.phone,
        items: sale.cartItems?.length || 0,
        products: sale.cartItems
          .map(
            (item) =>
              `[${item?.product_code}] ${item?.name} ${toMongolianCurrency(
                item?.price
              )}₮ - ${item.quantity} ширхэг`
          )
          .join("\n"),
        salesperson:
          typeof sale.user_id === "object" &&
          sale.user_id &&
          "name" in sale.user_id
            ? (sale.user_id as any).name
            : "Unknown",
        date: sale.createdAt ? format(new Date(sale.createdAt), "PPp") : "N/A",
      }));

      const exportColumns = [
        { header: "Борлуулалтын дугаар", accessor: "code" },
        { header: "Дүн", accessor: "total_price" },
        { header: "Хямдрал", accessor: "discount" },
        { header: "Утасны дугаар", accessor: "phone" },
        { header: "Бараа", accessor: "items" },
        { header: "Бараануудын жагсаалт", accessor: "products" },
        { header: "Худалдагч", accessor: "salesperson" },
        { header: "Огноо", accessor: "date" },
      ];

      exportToPDF({
        data: exportData,
        columns: exportColumns,
        title: `Борлуулалт ${hasSelected ? " (сонгогдсон)" : ""}`,
        filename: `sales_report_${getCurrentDateTime()}${
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
    data: sales,
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
          <Box className="h-5 w-5 mr-4" />
          Борлуулалт
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
                Excel{" "}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportToPDF}>
                <FileText className="mr-2 h-4 w-4" />
                PDF{" "}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Кодоор хайх..."
          value={(table.getColumn("code")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("code")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

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
        ) : sales.length === 0 ? (
          <div className="flex justify-center items-center h-72">
            <p className="text-lg">Борлуулалт олдсонгүй</p>
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
                    Борлуулалт олдсонгүй
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                {table.getState().pagination.pageSize}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[5, 10, 15, 25, 50, 100, 250, 500, 1000].map((size) => (
                <DropdownMenuItem key={size} onClick={() => setPageSize(size)}>
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
              Та энэ борлуулалтыг устгах гэж байна. Энэ үйлдлийг буцааж
              болохгүй.
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
