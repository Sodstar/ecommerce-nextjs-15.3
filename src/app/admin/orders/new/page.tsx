"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  PackagePlus,
  ArrowLeft,
  Loader2,
  Check,
  ChevronsUpDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createOrder } from "@/actions/order-action";
import { getAllProducts } from "@/actions/product-action";

// Define the form schema
const orderFormSchema = z.object({
  code: z
    .string()
    .min(3, {
      message: "Захиалгын код доод тал нь 3 тэмдэгт байх ёстой.",
    })
    .max(50, {
      message: "Захиалгын код 50 тэмдэгтээс хэтрэх ёсгүй.",
    }),
  product_id: z.string({
    required_error: "Бүтээгдэхүүнээ сонгоно уу.",
  }),
  qty: z.coerce.number().int().positive({
    message: "Тоо ширхэг нь эерэг бүхэл тоо байх ёстой.",
  }),
  total_price: z.coerce.number().int().positive({
    message: "Мөнгөн дүн эерэг бүхэл тоо байх ёстой.",
  }),
  description: z.string().optional(),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

type Product = {
  _id: string;
  title: string;
  code: string;
};

export default function NewOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Initialize the form with default values
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      code: "",
      product_id: "",
      qty: 1,
      total_price: 0,
      description: "",
    },
  });

  // Fetch products for dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productList = await getAllProducts();
        setProducts(productList);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Бүтээгдэхүүний жагсаалтыг авахад алдаа гарлаа");
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle form submission
  async function onSubmit(data: OrderFormValues) {
    setIsSubmitting(true);
    try {
      await createOrder(data);
      toast.success("Захиалга амжилттай үүсгэгдлээ");
      router.push("/admin/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Захиалга үүсгэхэд алдаа гарлаа";
      toast.error(errorMessage);
      setIsSubmitting(false);
    }
  }

  // Generate a unique order code
  const generateOrderCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const randomDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");

    const orderCode = `ORD-${year}${month}${day}-${randomDigits}`;
    form.setValue("code", orderCode);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <PackagePlus className="mr-2 h-6 w-6" />
            Шинэ захиалга үүсгэх
          </h1>
        </div>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Захиалгын мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Захиалгын код</FormLabel>
                        <FormControl>
                          <Input placeholder="ORD-230501-0001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateOrderCode}
                  >
                    Код үүсгэх
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name="product_id"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Бүтээгдэхүүн</FormLabel>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className={cn(
                                "w-full justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? products.find(
                                    (product) => product._id === field.value
                                  )?.title
                                : "Бүтээгдэхүүн сонгох"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput
                              placeholder="Хайх..."
                              onValueChange={setSearchValue}
                            />
                            <CommandEmpty>Бүтээгдэхүүн олдсонгүй.</CommandEmpty>
                            <CommandGroup className="max-h-60 overflow-auto">
                              {products.map((product) => (
                                <CommandItem
                                  key={product._id}
                                  value={product.title}
                                  onSelect={() => {
                                    form.setValue("product_id", product._id);
                                    setOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      product._id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {product.title} ({product.code})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тоо ширхэг</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="total_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Нийт мөнгөн дүн</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          placeholder="1"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Тайлбар (заавал биш)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Захиалгын талаар нэмэлт мэдээлэл..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Захиалгын талаар нэмэлт тайлбар, тэмдэглэл бичих
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/orders")}
                    disabled={isSubmitting}
                  >
                    Цуцлах
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Хадгалж байна...
                      </>
                    ) : (
                      "Захиалга үүсгэх"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
