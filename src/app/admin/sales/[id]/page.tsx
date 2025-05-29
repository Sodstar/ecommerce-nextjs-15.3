"use client";

import * as React from "react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import { TSale } from "@/models/Sale";
import { getSaleById, deleteSale } from "@/actions/sale-action";
import { toMongolianCurrency } from "@/utils/formatter";
import { ArrowLeft, Edit, Printer, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SaleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [sale, setSale] = useState<TSale | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { id } = use(params);

  useEffect(() => {
    const fetchSaleData = async () => {
      setIsLoading(true);
      try {
        console.log(id, "hehe");
        const saleData = await getSaleById(id);
        setSale(saleData);
      } catch (error) {
        console.error("Error fetching sale:", error);
        toast.error("Борлуулалтын мэдээллийг татахад алдаа гарлаа");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchSaleData();
    }
  }, [id]);

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      await deleteSale(id);
      toast.success("Борлуулалт амжилттай устгагдлаа");
      router.push("/admin/sales");
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("Борлуулалтыг устгахад алдаа гарлаа");
    } finally {
      setIsDeleteDialogOpen(false);
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!sale) {
    return (
      <div className="p-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/sales")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-2">Борлуулалт олдсонгүй</h2>
          <p className="text-gray-500 mb-4">
            Хүсэлт гаргасан борлуулалт олдсонгүй эсвэл устгагдсан байж магадгүй.
          </p>
          <Button onClick={() => router.push("/admin/sales")}>
            Борлуулалтын жагсаалт руу буцах
          </Button>
        </div>
      </div>
    );
  }

  const userName =
    typeof sale.user_id === "object" &&
    sale.user_id !== null &&
    "name" in sale.user_id
      ? sale.user_id.name
      : "Unknown";

  const userEmail =
    typeof sale.user_id === "object" &&
    sale.user_id !== null &&
    "email" in sale.user_id
      ? sale.user_id.email
      : "Unknown";

  const formattedDate = sale.createdAt
    ? format(new Date(sale.createdAt), "yyyy-MM-dd HH:mm:ss")
    : "N/A";

  return (
    <div className="p-6">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/sales")}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
        </Button>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Хэвлэх
          </Button>
          <Button
            variant="default"
            onClick={() => router.push(`/admin/sales/${id}/edit`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Засах
          </Button>
          <Button variant="destructive" onClick={handleDeleteClick}>
            <Trash className="mr-2 h-4 w-4" />
            Устгах
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sale summary card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Борлуулалтын мэдээлэл</CardTitle>
            <CardDescription>Ерөнхий мэдээлэл</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Борлуулалтын код:</p>
              <div className="flex items-center">
                <Badge variant="outline" className="text-base py-1.5">
                  {sale.code}
                </Badge>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Огноо:</p>
              <p>{formattedDate}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Хямдралын %:</p>
              <p>{sale.discount}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Утасны дугаар:</p>
              <p>{sale.phone == "" ? "-" : sale.phone}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Борлуулсан ажилтан:</p>
              <p className="font-medium">{String(userName)}</p>
              <p className="text-sm text-muted-foreground">
                {String(userEmail)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Барааны тоо:</p>
              <p>{sale.cartItems.length} төрөл</p>
              <p className="text-sm text-muted-foreground">
                {sale.cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                ширхэг
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Нийт дүн:</p>
              <p className="text-xl font-bold text-green-600">
                {toMongolianCurrency(sale.total_price)}₮
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Items list card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Борлуулсан бараанууд</CardTitle>
            <CardDescription>
              Нийт {sale.cartItems.length} төрлийн бараа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left p-2 pl-4">Бараа</th>
                    <th className="text-right p-2">Тоо</th>
                    <th className="text-right p-2">Нэгж үнэ</th>
                    <th className="text-right p-2 pr-4">Дүн</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.cartItems.map((item, index) => (
                    <React.Fragment key={item.product_id.toString()}>
                      <tr>
                        <td className="p-2 pl-4">
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Код: {item.product_code}
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-2">{item.quantity}</td>
                        <td className="text-right p-2">
                          {toMongolianCurrency(item.price)}₮
                        </td>
                        <td className="text-right p-2 pr-4 font-medium">
                          {toMongolianCurrency(item.price * item.quantity)}₮
                        </td>
                      </tr>
                      {index < sale.cartItems.length - 1 && (
                        <tr>
                          <td colSpan={4} className="p-0">
                            <Separator />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={3} className="p-2 pl-4 font-bold text-right">
                      Нийт дүн:
                    </td>
                    <td className="p-2 pr-4 font-bold text-right text-green-600">
                      {toMongolianCurrency(sale.total_price)}₮
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Та итгэлтэй байна уу?</DialogTitle>
            <DialogDescription>
              Та энэ борлуулалтыг устгах гэж байна. Энэ үйлдлийг буцааж
              болохгүй. Устгасан тохиолдолд барааны үлдэгдэл буцаан нэмэгдэнэ.
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
