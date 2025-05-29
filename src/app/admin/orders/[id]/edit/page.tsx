"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Package, Save, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

// Actions and utilities
import { getOrderById, updateOrder } from "@/actions/order-action";
import { toMongolianCurrency } from "@/utils/formatter";

// Form schema
const formSchema = z.object({
  qty: z.coerce
    .number()
    .min(1, { message: "Тоо хэмжээ хамгийн багадаа 1 байх ёстой" }),
  description: z.string().optional(),
  total_price: z.coerce.number().min(0, { message: "Нийт дүн 0 эсвэл түүнээс их байх ёстой" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      qty: 1,
      description: "",
      total_price: 0,
    },
  });

  // Fetch order data
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderData = await getOrderById(id);
        setOrder(orderData);

        // Set form default values from order data
        form.reset({
          qty: orderData.qty,
          description: orderData.description || "",
          total_price: orderData.total_price || 0,
        });
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Захиалгын мэдээллийг авахад алдаа гарлаа");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id, form]);

  // Handle form submission
  async function onSubmit(values: FormValues) {
    if (!order) {
      toast.error("Захиалгын мэдээлэл олдсонгүй");
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData = {
        qty: values.qty,
        description: values.description,
        total_price: values.total_price,
      };

      await updateOrder(id, orderData);
      toast.success("Захиалга амжилттай шинэчлэгдлээ");
      router.push("/admin/orders");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Захиалга шинэчлэхэд алдаа гарлаа");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/orders")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Захиалгууд руу буцах
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-2">Захиалга олдсонгүй</h2>
          <p className="text-gray-500 mb-4">
            Энэ ID-тай захиалга олдсонгүй эсвэл устгагдсан байж магадгүй.
          </p>
          <Button onClick={() => router.push("/admin/orders")}>
            Захиалгын жагсаалт руу буцах
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
        </Button>
        <h1 className="text-2xl font-bold flex items-center">
          <Package className="h-5 w-5 mr-2" />
          Захиалга засах
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Захиалгын мэдээлэл</CardTitle>
            <CardDescription>Одоогийн захиалгын мэдээлэл</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Захиалгын код
              </h3>
              <p className="text-lg font-medium">{order.code}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Бүтээгдэхүүн
              </h3>
              <p className="font-medium">{order.product_id?.title}</p>
              <p className="text-sm text-muted-foreground">
                Код: {order.product_id?.code}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Зарагдаж байгаа үнэ</h3>
              <p className="text-lg font-bold">
                {order.product_id?.price
                  ? `${toMongolianCurrency(order.product_id.price)}₮`
                  : "N/A"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Төлөв
              </h3>
              <p
                className={`font-medium ${
                  order.status === "ordered"
                    ? "text-blue-600"
                    : order.status === "finishied"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {order.status === "ordered"
                  ? "Захиалсан"
                  : order.status === "finishied"
                  ? "Дууссан"
                  : "Цуцалсан"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Үүсгэсэн огноо
              </h3>
              <p>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("mn-MN", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Edit Form Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Захиалга засах</CardTitle>
            <CardDescription>Захиалгын мэдээллийг шинэчлэх</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="qty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тоо хэмжээ</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>Захиалгын тоо хэмжээ</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нийт дүн</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="0"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Захиалгийн нийт мөнгөн дүн
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Дэлгэрэнгүй тайлбар</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Захиалгын тайлбар..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Захиалгын нэмэлт тайлбар
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Separator className="mb-4" />
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/admin/orders")}
                      disabled={isSubmitting}
                    >
                      Цуцлах
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="md:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Хадгалж байна...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Шинэчлэх
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
