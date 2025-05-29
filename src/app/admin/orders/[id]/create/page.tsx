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
  CardFooter,
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
import { createOrder } from "@/actions/order-action";
import { getProductById } from "@/actions/product-action";
import { toMongolianCurrency } from "@/utils/formatter";
import { generateDeliveryNumber } from "@/utils/numberGenerator";

// Form schema
const formSchema = z.object({
  code: z.string().min(1, {
    message: "Захиалгын код хоосон байх боломжгүй",
  }),
  qty: z.coerce
    .number()
    .min(1, { message: "Тоо хэмжээ хамгийн багадаа 1 байх ёстой" }),
  description: z.string().optional(),
  total_price: z.coerce.number().min(0, { message: "Нийт үнэ 0-ээс бага байж болохгүй" }),
});

export default function CreateOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: generateDeliveryNumber("ORD"),
      qty: 1,
      description: "",
      total_price: 0,
    },
  });

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductById(id);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Бүтээгдэхүүний мэдээллийг авахад алдаа гарлаа");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!product) {
      toast.error("Бүтээгдэхүүн сонгогдоогүй байна");
      return;
    }

    try {
      setIsSubmitting(true);
      const orderData = {
        code: values.code,
        product_id: id,
        qty: values.qty,
        description: values.description,
        total_price: values.total_price,
      };

      await createOrder(orderData);
      toast.success("Захиалга амжилттай үүсгэгдлээ");
      router.push("/admin/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Захиалга үүсгэхэд алдаа гарлаа");
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

  if (!product) {
    return (
      <div className="p-6">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/products")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Бүтээгдэхүүн рүү буцах
        </Button>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-2">Бүтээгдэхүүн олдсонгүй</h2>
          <p className="text-gray-500 mb-4">
            Энэ ID-тай бүтээгдэхүүн олдсонгүй эсвэл устгагдсан байж магадгүй.
          </p>
          <Button onClick={() => router.push("/admin/products")}>
            Бүтээгдэхүүний жагсаалт руу буцах
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
          Шинэ захиалга
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Info Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Сонгосон бүтээгдэхүүн</CardTitle>
            <CardDescription>Бүтээгдэхүүний мэдээлэл</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Нэр</h3>
              <p className="text-lg font-medium">{product.title}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Код</h3>
              <p>{product.code}</p>
            </div>
            {product.barcode && (
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">
                  Баркод
                </h3>
                <p>{product.barcode}</p>
              </div>
            )}
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">Үнэ</h3>
              <p className="text-lg font-bold">
                {toMongolianCurrency(product.price)}₮
              </p>
            </div>
            <div>
              <h3 className="font-medium text-sm text-muted-foreground">
                Одоогийн үлдэгдэл
              </h3>
              <p
                className={
                  product.stock <= product.stock_alert
                    ? "text-red-500 font-bold"
                    : ""
                }
              >
                {product.stock} ширхэг
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Form Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Захиалгын мэдээлэл</CardTitle>
            <CardDescription>
              Захиалгын дэлгэрэнгүй мэдээллийг оруулна уу
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Захиалгын код</FormLabel>
                        <FormControl>
                          <Input placeholder="Захиалгын код" {...field} />
                        </FormControl>
                        <FormDescription>
                          Автоматаар үүсгэгдсэн код
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                        <FormDescription>Захиалах тоо хэмжээ</FormDescription>
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
                        <FormDescription>Захиалгийн нийт мөнгөн дүн</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full md:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Хадгалж байна...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Захиалга үүсгэх
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
