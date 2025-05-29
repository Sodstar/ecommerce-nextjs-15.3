"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getDeliveryById } from "@/actions/delivery-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  CalendarClock,
  Edit,
  Loader2,
  MapPin,
  Package,
  Phone,
  Printer,
  ShoppingCart,
  Tag,
  Truck,
  User,
  DollarSign,
  ClipboardList,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toMongolianCurrency } from "@/utils/formatter";
import { DeliveryStatus, TDelivery } from "@/models/Delivery";

// Type for the populated delivery data
type DeliveryWithPopulatedData = TDelivery & {
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
    createdAt?: string;
  };
  driver_id?: {
    _id: string;
    name: string;
    phone?: string;
  };
};

export default function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [delivery, setDelivery] = useState<DeliveryWithPopulatedData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const { id } = use(params);
  useEffect(() => {
    const fetchDeliveryData = async () => {
      try {
        const fetchedDelivery = await getDeliveryById(id);
        setDelivery(fetchedDelivery);
      } catch (error) {
        console.error("Error fetching delivery:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeliveryData();
  }, [id]);

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
            Хүргэлт хийгдэж байна
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

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="p-6">
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <Package className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold">Хүргэлт олдсонгүй</h2>
          <p className="text-gray-500 mt-2 mb-6">
            Энэ хүргэлтийн мэдээлэл олдсонгүй эсвэл устгагдсан байна.
          </p>
          <Button onClick={() => router.push("/admin/deliveries")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Хүргэлтүүд рүү буцах
          </Button>
        </div>
      </div>
    );
  }

  const saleDate = delivery.sale_id?.createdAt
    ? format(new Date(delivery.sale_id.createdAt), "yyyy-MM-dd HH:mm")
    : "N/A";

  const deliveryDate = delivery.createdAt
    ? format(new Date(delivery.createdAt), "yyyy-MM-dd HH:mm")
    : "N/A";

  return (
    <div className="p-6 container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin/deliveries")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Буцах
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Truck className="h-6 w-6 mr-3" />
            Хүргэлтийн дэлгэрэнгүй
          </h1>
        </div>

        <div className="flex space-x-2">
          <Button onClick={() => router.push(`/admin/deliveries/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Засах
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Хүргэлтийн мэдээлэл
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Tag className="h-4 w-4 mr-2" />
                  Хүргэлтийн код:
                </div>
                <div className="font-medium">{delivery.code}</div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Төлөв:
                </div>
                <div>{getStatusBadge(delivery.status)}</div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  Утас:
                </div>
                <div>{delivery.phone}</div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  Хаяг:
                </div>
                <div className="text-right max-w-[250px]">
                  {delivery.address}
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  Жолооч:
                </div>
                <div>
                  {delivery.driver_id ? (
                    <span className="font-medium">
                      {delivery.driver_id.name}
                      {delivery.driver_id.phone
                        ? ` (${delivery.driver_id.phone})`
                        : ""}
                    </span>
                  ) : (
                    <span className="text-gray-500">Тодорхойгүй</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarClock className="h-4 w-4 mr-2" />
                  Хүргэлт үүсгэсэн:
                </div>
                <div>{deliveryDate}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Төлбөрийн мэдээлэл
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Борлуулалтын дүн:
                </div>
                <div className="font-medium">
                  {toMongolianCurrency(delivery.sale_id?.total_price || 0)}₮
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Truck className="h-4 w-4 mr-2" />
                  Хүргэлтийн төлбөр:
                </div>
                <div className="font-medium">
                  {toMongolianCurrency(delivery.deliveryPrice)}₮
                </div>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="h-4 w-4 mr-2" />
                  Жолоочид өгөх:
                </div>
                <div className="font-medium">
                  {toMongolianCurrency(delivery.driverPrice)}₮
                </div>
              </div>
              <div className="flex justify-between items-center pt-3">
                <div className="font-medium text-lg flex items-center">
                  Нийт дүн:
                </div>
                <div className="font-bold text-green-600 text-lg">
                  {toMongolianCurrency((delivery.sale_id?.total_price || 0)+delivery.deliveryPrice-delivery.driverPrice)}₮
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2" />
            Борлуулалтын мэдээлэл
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center text-sm text-gray-500">
                <Tag className="h-4 w-4 mr-2" />
                Борлуулалтын код:
              </div>
              <div className="font-medium flex items-center">
                <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() =>
                    router.push(`/admin/sales/${delivery.sale_id._id}`)
                  }
                >
                  {delivery.sale_id?.code}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center text-sm text-gray-500">
                <User className="h-4 w-4 mr-2" />
                Борлуулсан ажилтан:
              </div>
              <div>{delivery.sale_id?.user_id?.name || "N/A"}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Package className="h-5 w-5 mr-2" />
            Захиалгын бараанууд
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Код</th>
                  <th className="py-2 text-left">Барааны нэр</th>
                  <th className="py-2 text-right">Үнэ</th>
                  <th className="py-2 text-right">Тоо ширхэг</th>
                  <th className="py-2 text-right">Нийт дүн</th>
                </tr>
              </thead>
              <tbody>
                {delivery.sale_id?.cartItems?.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.product_code}</td>
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-right">
                      {toMongolianCurrency(item.price)}₮
                    </td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right font-medium">
                      {toMongolianCurrency(item.price * item.quantity)}₮
                    </td>
                  </tr>
                ))}
                <tr className="font-medium text-green-600">
                  <td colSpan={4} className="py-3 text-right">
                    Нийт дүн:
                  </td>
                  <td className="py-3 text-right">
                    {toMongolianCurrency(delivery.sale_id?.total_price || 0)}₮
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
