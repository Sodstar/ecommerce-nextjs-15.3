"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Save,
  Layers,
  Package,
  Barcode,
  Search,
  ArrowLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchFilteredProducts, updateProduct } from "@/actions/product-action";
import { toMongolianCurrency } from "@/utils/formatter";

// Define form schema for the search
const searchSchema = z.object({
  identifier: z.string().min(1, {
    message: "Код эсвэл баркод оруулна уу",
  }),
});

// Define form schema for updating stock
const stockUpdateSchema = z.object({
  stock: z.coerce.number().nonnegative({
    message: "Үлдэгдэл тоо хэмжээ 0 эсвэл түүнээс их байх ёстой",
  }),
  stock_alert: z.coerce.number().nonnegative({
    message: "Мэдэгдэл хязгаар 0 эсвэл түүнээс их байх ёстой",
  }),
});

export default function ProductStockUpdate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [product, setProduct] = useState<any | null>(null);

  // Form for searching products
  const searchForm = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      identifier: "",
    },
  });

  // Form for updating stock
  const stockForm = useForm<z.infer<typeof stockUpdateSchema>>({
    resolver: zodResolver(stockUpdateSchema),
    defaultValues: {
      stock: 0,
      stock_alert: 5,
    },
  });

  // Reset stock form when product changes
  useEffect(() => {
    if (product) {
      stockForm.reset({
        stock: product.stock || 0,
        stock_alert: product.stock_alert || 5,
      });
    }
  }, [product, stockForm]);

  // Handle product search
  async function onSearch(values: z.infer<typeof searchSchema>) {
    try {
      setSearchLoading(true);
      const identifier = values.identifier.trim();

      // Search by code or barcode
      const filters = {
        $or: [{ code: identifier }, { barcode: identifier }],
      };

      // Use the existing filters functionality to search for products
      const results = await fetchFilteredProducts({
        code: identifier,
        orderBy: "title_asc",
      });

      // Check if we found a product by code
      if (!results || results.length === 0) {
        // Try searching by barcode
        const barcodeResults = await fetchFilteredProducts({
          barcode: identifier,
          orderBy: "title_asc",
        });

        if (!barcodeResults || barcodeResults.length === 0) {
          toast.error("Бүтээгдэхүүн олдсонгүй");
          setProduct(null);
          return;
        }

        setProduct(barcodeResults[0]);
        toast.success("Бүтээгдэхүүн амжилттай олдлоо");
        // Clear the search field after successful search
        searchForm.reset({ identifier: "" });
      } else {
        setProduct(results[0]);
        toast.success("Бүтээгдэхүүн амжилттай олдлоо");
        // Clear the search field after successful search
        searchForm.reset({ identifier: "" });
      }
    } catch (error) {
      console.error("Error searching for product:", error);
      toast.error("Бүтээгдэхүүн хайхад алдаа гарлаа");
    } finally {
      setSearchLoading(false);
    }
  }

  // Handle stock update
  async function onUpdateStock(values: z.infer<typeof stockUpdateSchema>) {
    if (!product) {
      toast.error("Шинэчлэх бүтээгдэхүүн олдсонгүй");
      return;
    }

    try {
      setLoading(true);
      const result = await updateProduct(product._id, {
        stock: values.stock,
        stock_alert: values.stock_alert,
      });

      if (result) {
        toast.success("Үлдэгдэл амжилттай шинэчлэгдлээ");
        // Update the local product data
        setProduct({
          ...product,
          stock: values.stock,
          stock_alert: values.stock_alert,
        });
      } else {
        toast.error("Үлдэгдэл шинэчлэхэд алдаа гарлаа");
      }
    } catch (error: any) {
      console.error("Error updating stock:", error);
      const errorMessage =
        error?.message || "Системийн алдаа: Үлдэгдэл шинэчлэхэд алдаа гарлаа";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card className="border shadow-sm pt-0">
        <CardHeader className="bg-muted/40 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-2xl font-bold mt-2 flex items-center">
                  <Package className="h-6 w-6 mr-2" />
                  Бүтээгдэхүүний тооллого
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Бүтээгдэхүүний үлдэгдэл, анхааруулга хязгаар шинэчлэх
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <Form {...searchForm}>
            <form
              onSubmit={searchForm.handleSubmit(onSearch)}
              className="space-y-4"
            >
              <div className="flex items-end gap-2">
                <FormField
                  control={searchForm.control}
                  name="identifier"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel className="flex items-center gap-1">
                        Код эсвэл Баркод <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <Barcode className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Бүтээгдэхүүний код эсвэл баркод оруулах"
                              {...field}
                              className="focus:ring-2 focus:ring-primary/20 pl-8"
                            />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={searchLoading}
                  className="mb-[2px]"
                >
                  {searchLoading ? (
                    <span className="flex items-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                      Хайж байна
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" />
                      Хайх
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </Form>

          <Separator className="my-6" />

          {product ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      Код:
                    </span>
                    <span className="font-medium">{product.code}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      Баркод:
                    </span>
                    <span className="font-medium">{product.barcode}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      Нэр:
                    </span>
                    <span className="font-medium">{product.title}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                      Брэнд:
                    </span>
                    <span className="font-medium">
                      {product.brand && typeof product.brand === "object"
                        ? product.brand.name
                        : "Хоосон"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-muted/20 p-4 rounded-md mb-6">
                <h2 className="text-lg font-medium mb-4 flex items-center">
                  <Layers className="mr-2 h-5 w-5" /> Үлдэгдэл шинэчлэх
                </h2>

                <Form {...stockForm}>
                  <form
                    onSubmit={stockForm.handleSubmit(onUpdateStock)}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={stockForm.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Үлдэгдэл <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                className="focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormDescription>
                              Барааны эцсийн тооллогын үлдэгдэл{" "}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={stockForm.control}
                        name="stock_alert"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Мэдэгдэл хязгаар{" "}
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="5"
                                {...field}
                                className="focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormDescription>
                              Үлдэгдэл энэ хэмжээнд хүрэхэд анхааруулга өгнө
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="submit" disabled={loading} className="w-28">
                        {loading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full"></span>
                            Хадгалж байна
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Save className="mr-2 h-4 w-4" />
                            Хадгалах
                          </span>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">Бүтээгдэхүүн олдсонгүй</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Бүтээгдэхүүний код эсвэл баркод оруулж хайна уу
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/products")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" /> Бүтээгдэхүүн удирдлага руу
                буцах
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
