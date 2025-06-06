"use client";

import { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { toast } from "sonner";
import { Save } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getDriverById, updateDriver } from "@/actions/driver-action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Define form schema with validation
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Нэр 2 тэмдэгтээс урт байх ёстой",
  }),
  phone: z.string().min(8, {
    message: "Утасны дугаар 8 тэмдэгтээс урт байх ёстой",
  }),
  pin: z.string().min(4, {
    message: "ПИН 4 тэмдэгтээс урт байх ёстой",
  }),
  vehicle: z.string().min(2, {
    message: "Тээврийн хэрэгслийн нэр 2 тэмдэгтээс урт байх ёстой",
  }),
});

export default function EditDriver({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { id } = use(params);

  const driverId = id;

  // Initialize form with default values
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      pin: "",
      vehicle: "",
    },
  });

  // Load driver data on mount
  useEffect(() => {
    const loadDriver = async () => {
      try {
        setLoading(true);

        const driverData = await getDriverById(driverId);
        if (driverData) {
          // Set form values from the fetched driver data
          form.reset({
            name: driverData.name,
            phone: driverData.phone,
            pin: driverData.pin,
            vehicle: driverData.vehicle,
          });
        } else {
          toast.error("Жолооч олдсонгүй");
          router.push("/admin/drivers");
        }
      } catch (error) {
        console.error("Error loading driver:", error);
        toast.error("Жолооч ачаалахад алдаа гарлаа");
      } finally {
        setLoading(false);
      }
    };

    loadDriver();
  }, [driverId, form, router]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await updateDriver(driverId, {
        name: values.name,
        phone: values.phone,
        pin: values.pin,
        vehicle: values.vehicle,
      });

      if (result) {
        toast.success("Жолооч амжилттай шинэчлэгдлээ");
        router.push("/admin/drivers");
      } else {
        toast.error("Жолооч шинэчлэхэд алдаа гарлаа");
      }
    } catch (error: any) {
      console.error("Error updating driver:", error);
      toast.error(error.message || "Системийн алдаа: Жолооч шинэчлэхэд алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card className="border shadow-sm pt-0">
        <CardHeader className="bg-muted/40 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-2xl font-bold mt-2">Жолооч засах</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Жолоочийн мэдээллийг шинэчлэх
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-xs">
              ID: {driverId}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading ? (
            <div className="space-y-4">
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
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Нэр <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Жолоочийн нэр"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Утас <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Утасны дугаар"
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
                  name="pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        ПИН <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Жолоочийн ПИН"
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
                  name="vehicle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1">
                        Тээврийн хэрэгсэл <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Тээврийн хэрэгслийн дугаар/нэр"
                          {...field}
                          className="focus:ring-2 focus:ring-primary/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/drivers")}
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
