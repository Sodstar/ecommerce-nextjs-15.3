"use client";

import { use, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Save, Layers, Tag, Barcode, Download } from "lucide-react";
import React from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { getProductById, updateProduct } from "@/actions/product-action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUploader } from "@/components/ui/uploadthing";
import { getAllCategories } from "@/actions/category-action";
import { getAllBrands } from "@/actions/brand-action";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import BarcodeImage from "@/components/barcode";
import { generateBarcode } from "@/utils/barcode";
import { toMongolianCurrency } from "@/utils/formatter";

// Define form schema with validation
const formSchema = z.object({
  code: z.string().min(2, {
    message: "Код 2 тэмдэгтээс урт байх ёстой",
  }),
  barcode: z.string().min(2, {
    message: "Баркод 2 тэмдэгтээс урт байх ёстой",
  }),
  title: z.string().min(2, {
    message: "Нэр 2 тэмдэгтээс урт байх ёстой",
  }),
  description: z.string().optional(),
  price: z.coerce.number().positive({
    message: "Үнэ нь эерэг тоо байх ёстой",
  }),
  stock: z.coerce.number().nonnegative({
    message: "Үлдэгдэл тоо хэмжээ 0 эсвэл түүнээс их байх ёстой",
  }),
  stock_alert: z.coerce.number().nonnegative({
    message: "Мэдэгдэл хязгаар 0 эсвэл түүнээс их байх ёстой",
  }),
  category: z.string().min(1, {
    message: "Ангилал сонгоно уу",
  }),
  brand: z.string().min(1, {
    message: "Бренд сонгоно уу",
  }),
  image: z.string().optional(),
  views: z.coerce.number().nonnegative({
    message: "Харагдах тоо 0 эсвэл түүнээс их байх ёстой",
  }),
});

export default function EditProduct({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);
  const productId = id;

  const [categories, setCategories] = useState<any>([]);
  const [brands, setBrands] = useState<any>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [barcodeValue, setBarcodeValue] = useState<string>("");
  const [priceValue, setPriceValue] = useState<string>("");
  const [tempBarcode, setTempBarcode] = useState<string>("");
  const barcodeRef = useRef<HTMLDivElement>(null);
  const barcodeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      barcode: "",
      title: "",
      description: "",
      price: 0,
      stock: 0,
      stock_alert: 5,
      category: "",
      brand: "",
      image: "/product.png",
      views: 0,
    },
  });

  // Load product data and options on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch product data and options in parallel
        const [productData, categoriesData, brandsData] = await Promise.all([
          getProductById(productId as any),
          getAllCategories(),
          getAllBrands(),
        ]);

        // Set categories and brands for the dropdown menus
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        }

        if (Array.isArray(brandsData)) {
          setBrands(brandsData);
        }

        // Set form values from the fetched product data
        if (productData) {
          form.reset({
            code: productData.code || "",
            barcode: productData.barcode || "",
            title: productData.title || "",
            description: productData.description || "",
            price: productData.price || 0,
            stock: productData.stock || 0,
            stock_alert: productData.stock_alert || 5,
            category: productData.category.toString(),
            brand: productData.brand.toString(),
            image: productData.image || "/product.png",
            views: productData.view || 0,
          });

          // Set the barcode value for preview
          setBarcodeValue(productData.barcode || "");
        } else {
          toast.error("Бүтээгдэхүүн олдсонгүй");
          router.push("/admin/products");
        }
      } catch (error) {
        console.error("Error loading data:", error);
        toast.error("Мэдээлэл ачаалахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId, form, router]);

  // Handle debounced barcode input
  useEffect(() => {
    if (barcodeTimeoutRef.current) {
      clearTimeout(barcodeTimeoutRef.current);
    }

    if (tempBarcode) {
      barcodeTimeoutRef.current = setTimeout(() => {
        form.setValue("barcode", tempBarcode);
        setBarcodeValue(tempBarcode);
        barcodeTimeoutRef.current = null;
      }, 1000); // 1 second debounce
    }

    return () => {
      if (barcodeTimeoutRef.current) {
        clearTimeout(barcodeTimeoutRef.current);
      }
    };
  }, [tempBarcode, form]);

  const handleImageUpload = (url: string | undefined) => {
    if (url) {
      form.setValue("image", url);
      setUploadError(null);
    }
  };

  const handleImageError = (error: Error) => {
    console.error("Image upload error:", error);
    setUploadError("Зураг оруулахад алдаа гарлаа. Placeholder ашиглана.");
  };

  function generateBarcodeImage() {
    const result = generateBarcode();
    form.setValue("barcode", result);
    setBarcodeValue(result);
  }

  async function downloadBarcodeImage() {
    if (!barcodeValue) {
      toast.error("Баркод үүсгэнэ үү");
      return;
    }

    try {
      const barcodeElement = barcodeRef.current;
      if (!barcodeElement) return;

      const svg = barcodeElement.querySelector("svg");
      if (!svg) return;

      // Get the product code - using watch to get the current value
      const productCode = form.watch("code") || "code";
      const productTitle = form.watch("title") || "title";
      const productPrice = toMongolianCurrency(
        (form.watch("price") as number) || 0
      );

      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Set canvas dimensions with 50% of the width
      const svgWidth = svg.clientWidth * 0.5; // Reduced to 50%
      const svgHeight = svg.clientHeight; // Also scale height to maintain proportion
      const padding = 5; // Small padding
      canvas.width = svgWidth + padding * 2;
      canvas.height = svgHeight + padding * 2 + 25; // Extra space for text at bottom

      // Create a Blob from the SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const DOMURL = window.URL || window.webkitURL || window;
      const url = DOMURL.createObjectURL(svgBlob);

      // Create an image from the SVG
      const img = new Image();
      img.onload = () => {
        // Fill white background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image with reduced size
        ctx.drawImage(img, padding, padding, svgWidth, svgHeight);

        // Add product code as text under barcode
        ctx.font = "12px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.fillText(
          productCode + " үнэ: " + productPrice + "₮",
          canvas.width / 2,
          svgHeight + padding * 3
        );

        ctx.fillText(productTitle, canvas.width / 2, svgHeight + padding * 6);

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (!blob) return;
          const filename = `barcode-${productCode}.png`;

          const link = document.createElement("a");
          link.download = filename;
          link.href = URL.createObjectURL(blob);
          link.click();

          // Clean up
          URL.revokeObjectURL(link.href);
        }, "image/png");

        DOMURL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error("Error downloading barcode:", error);
      toast.error("Баркод татахад алдаа гарлаа");
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await updateProduct(productId, {
        code: values.code,
        barcode: values.barcode,
        title: values.title,
        description: values.description || "",
        price: values.price,
        stock: values.stock,
        stock_alert: values.stock_alert,
        category: values.category,
        brand: values.brand,
        image: values.image,
        views: values.views,
      });

      if (result) {
        toast.success("Бүтээгдэхүүн амжилттай шинэчлэгдлээ");
        router.push("/admin/products");
      } else {
        toast.error("Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа");
      }
    } catch (error: any) {
      console.error("Error updating product:", error);
      const errorMessage =
        error?.message ||
        "Системийн алдаа: Бүтээгдэхүүн шинэчлэхэд алдаа гарлаа";
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
                <h1 className="text-2xl font-bold mt-2">Бүтээгдэхүүн засах</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Бүтээгдэхүүний мэдээлэл шинэчлэх
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              ID: {productId}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-24 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-40 w-full" />
                </div>
              </div>
              <div className="col-span-2 flex justify-end space-x-2 pt-2">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-medium mb-4 flex items-center">
                      <Tag className="mr-2 h-5 w-5" /> Үндсэн мэдээлэл
                    </h2>

                    <div className="space-y-4">
                      {barcodeValue && (
                        <div className="border rounded-md p-2 bg-white">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">
                              Баркод урьдчилан харах
                            </span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={downloadBarcodeImage}
                              className="flex items-center gap-1 text-xs"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Татах
                            </Button>
                          </div>
                          <div ref={barcodeRef}>
                            <BarcodeImage value={barcodeValue} />
                          </div>
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Код <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Бүтээгдэхүүний код"
                                {...field}
                                className="focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="barcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Баркод <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder="Бүтээгдэхүүний баркод"
                                  {...field}
                                  onChange={(e) => {
                                    // Update the temp value immediately
                                    setTempBarcode(e.target.value);
                                    // Original onChange is still called to keep the form state updated
                                    field.onChange(e);
                                  }}
                                  className="focus:ring-2 focus:ring-primary/20"
                                />
                                <Button
                                  type="button"
                                  size="icon"
                                  variant="outline"
                                  onClick={generateBarcodeImage}
                                  title="Баркод үүсгэх"
                                >
                                  <Barcode className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Нэр <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Бүтээгдэхүүний нэр"
                                {...field}
                                className="focus:ring-2 focus:ring-primary/20"
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
                            <FormLabel>Тайлбар</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Бүтээгдэхүүний тайлбар"
                                {...field}
                                rows={4}
                                className="resize-none focus:ring-2 focus:ring-primary/20"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-6" />

                    <h2 className="text-lg font-medium mb-4 flex items-center">
                      <Layers className="mr-2 h-5 w-5" /> Ангилал, Брэнд
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Ангилал <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Ангилал сонгоно уу" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category: any) => (
                                  <SelectItem
                                    key={category._id}
                                    value={category._id}
                                  >
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Брэнд <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Брэнд сонгоно уу" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {brands.map((brand: any) => (
                                  <SelectItem key={brand._id} value={brand._id}>
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-medium mb-4">Үнэ, Үлдэгдэл</h2>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Үнэ <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  placeholder="0"
                                  {...field}
                                  onChange={(e) => {
                                    // Update the temp value immediately
                                    setPriceValue(e.target.value);
                                    // Original onChange is still called to keep the form state updated
                                    field.onChange(e);
                                  }}
                                  className="focus:ring-2 focus:ring-primary/20 pl-8"
                                />
                                <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                  ₮
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
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
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="stock_alert"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Мэдэгдэл хязгаар
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

                      <FormField
                        control={form.control}
                        name="views"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Харагдсан тоо
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
                              Бүтээгдэхүүний үзэлтийн тоо
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Separator className="my-6" />

                    <h2 className="text-lg font-medium mb-4">Зураг</h2>

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-2">
                              <div className="flex flex-col space-y-2">
                                {uploadError && (
                                  <div className="text-sm text-red-500">
                                    {uploadError}
                                  </div>
                                )}
                                {field.value && (
                                  <div className="relative w-full h-40 rounded-md overflow-hidden border mb-2">
                                    <img
                                      src={field.value}
                                      alt="Product image"
                                      className="w-full h-full object-contain"
                                    />
                                  </div>
                                )}
                                <div className="flex flex-col space-y-2">
                                  <Input
                                    type="text"
                                    placeholder="Зургийн URL оруулах..."
                                    value={field.value}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    className="focus:ring-2 focus:ring-primary/20"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    UploadThing татаж чадахгүй байвал URL
                                    оруулах боломжтой
                                  </p>
                                </div>

                                <div className="mt-2">
                                  <div className="text-xs text-muted-foreground">
                                    Эсвэл UploadThing ашиглах:
                                  </div>
                                  <div className="mt-1">
                                    <FileUploader
                                      endpoint="userImageUploader"
                                      value={field.value}
                                      onChange={handleImageUpload}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/products")}
                    className="w-28"
                  >
                    Цуцлах
                  </Button>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
