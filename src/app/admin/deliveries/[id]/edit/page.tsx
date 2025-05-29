"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getDeliveryById, updateDelivery } from "@/actions/delivery-action";
import { getAllDrivers } from "@/actions/driver-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Save, Truck } from "lucide-react";
import { TDelivery, DeliveryFormData } from "@/models/Delivery";
import { toast } from "sonner";
import { z } from "zod";

// Type for a driver
type Driver = {
  _id: string;
  name: string;
  phone?: string;
};

// Type for the populated delivery data
type DeliveryWithPopulatedData = TDelivery & {
  sale_id: {
    _id: string;
    code: string;
    total_price: number;
  };
  driver_id: {
    _id: string;
    name: string;
    phone?: string;
  };
};

const deliveryFormSchema = z.object({
  phone: z
    .string()
    .min(8, "Утасны дугаар хамгийн багадаа 8 тэмдэгт байх ёстой"),
  address: z.string().min(5, "Хаяг хамгийн багадаа 5 тэмдэгт байх ёстой"),
  deliveryPrice: z.number().nonnegative("Үнэ нь эерэг тоо байх ёстой"),
  driverPrice: z.number().nonnegative("Үнэ нь эерэг тоо байх ёстой"),
  driver_id: z.string().min(1, "Жолооч сонгоно уу"),
  status: z.enum(["pending", "in-progress", "completed", "cancelled"] as const),
});

export default function DeliveryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [delivery, setDelivery] = useState<DeliveryWithPopulatedData | null>(
    null
  );
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<DeliveryFormData>>({
    phone: "",
    address: "",
    deliveryPrice: 0,
    driverPrice: 0,
    driver_id: "",
    status: "pending",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deliveryData, driversData] = await Promise.all([
          getDeliveryById(id),
          getAllDrivers(),
        ]);

        setDelivery(deliveryData);
        setDrivers(driversData);

        // Initialize form data with existing delivery details
        setFormData({
          phone: deliveryData.phone,
          address: deliveryData.address,
          deliveryPrice: deliveryData.deliveryPrice,
          driverPrice: deliveryData.driverPrice,
          driver_id:
            typeof deliveryData.driver_id === "object"
              ? deliveryData.driver_id._id
              : deliveryData.driver_id,
          status: deliveryData.status,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Мэдээлэл ачаалахад алдаа гарлаа");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "deliveryPrice" || name === "driverPrice") {
      // Handle number inputs
      const numericValue = parseFloat(value);

      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numericValue) ? 0 : numericValue,
      }));

      // Recalculate summary price
      if (delivery) {
        const saleTotal = delivery.sale_id?.total_price || 0;
        const deliveryPrice =
          name === "deliveryPrice" ? numericValue : formData.deliveryPrice || 0;
        const driverPrice =
          name === "driverPrice" ? numericValue : formData.driverPrice || 0;

        // Update form data with new summary price
        setFormData((prev) => ({
          ...prev,
          summaryPrice: saleTotal + deliveryPrice-driverPrice,
        }));
      }
    } else {
      // Handle text inputs
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear the error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    try {
      deliveryFormSchema.parse({
        ...formData,
        deliveryPrice: Number(formData.deliveryPrice),
        driverPrice: Number(formData.driverPrice),
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Формын мэдээлэл буруу байна");
      return;
    }

    setIsSaving(true);

    try {
      // Calculate summary price
      const saleTotal = delivery?.sale_id?.total_price || 0;
      const deliveryPrice = Number(formData.deliveryPrice);
      const summaryPrice = saleTotal + deliveryPrice - (formData.driverPrice || 0);

      const updateData = {
        ...formData,
        summaryPrice,
        deliveryPrice: Number(formData.deliveryPrice),
        driverPrice: Number(formData.driverPrice),
      } as DeliveryFormData;

      // Update delivery using the server action instead of fetch API
      const updatedDelivery = await updateDelivery(id, updateData);

      if (!updatedDelivery) {
        throw new Error("Failed to update delivery");
      }

      toast.success("Хүргэлтийн мэдээлэл шинэчлэгдлээ");
      router.push(`/admin/deliveries/${id}`);
    } catch (error) {
      console.error("Error updating delivery:", error);
      toast.error("Хүргэлтийн мэдээлэл шинэчлэхэд алдаа гарлаа");
    } finally {
      setIsSaving(false);
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
          <Truck className="h-16 w-16 text-gray-300 mb-4" />
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

  return (
    <div className="p-6 container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            onClick={() => router.push(`/admin/deliveries/${id}`)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Буцах
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Truck className="h-6 w-6 mr-3" />
            Хүргэлтийн мэдээлэл засах
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Үндсэн мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery code - read-only */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="code">Хүргэлтийн код</Label>
                <Input
                  id="code"
                  value={delivery.code}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Sale code - read-only */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="sale_code">Борлуулалтын код</Label>
                <Input
                  id="sale_code"
                  value={delivery.sale_id?.code || "N/A"}
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="phone">Утасны дугаар</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Status */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="status">Төлөв</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger
                    id="status"
                    className={errors.status ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Төлөв сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Хүлээгдэж байна</SelectItem>
                    <SelectItem value="in-progress">
                      Хүргэлт хийгдэж байна
                    </SelectItem>
                    <SelectItem value="completed">Хүргэгдсэн</SelectItem>
                    <SelectItem value="cancelled">Цуцлагдсан</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && (
                  <p className="text-red-500 text-xs mt-1">{errors.status}</p>
                )}
              </div>

              {/* Driver */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="driver_id">Жолооч</Label>
                <Select
                  value={formData.driver_id}
                  onValueChange={(value) =>
                    handleSelectChange("driver_id", value)
                  }
                >
                  <SelectTrigger
                    id="driver_id"
                    className={errors.driver_id ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Жолооч сонгоно уу" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver._id} value={driver._id}>
                        {driver.name} {driver.phone && `(${driver.phone})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.driver_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.driver_id}
                  </p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-y-2">
              <Label htmlFor="address">Хүргэлтийн хаяг</Label>
              <Textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address || ""}
                onChange={handleChange}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Төлбөрийн мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Sale total - read-only */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="sale_total">Борлуулалтын дүн</Label>
                <Input
                  id="sale_total"
                  value={
                    delivery.sale_id?.total_price.toLocaleString() + "₮" || "0₮"
                  }
                  disabled
                  className="bg-gray-50"
                />
              </div>

              {/* Delivery price */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="deliveryPrice">Хүргэлтийн төлбөр</Label>
                <Input
                  id="deliveryPrice"
                  name="deliveryPrice"
                  type="number"
                  value={formData.deliveryPrice || 0}
                  onChange={handleChange}
                  className={errors.deliveryPrice ? "border-red-500" : ""}
                />
                {errors.deliveryPrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.deliveryPrice}
                  </p>
                )}
              </div>

              {/* Driver price */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="driverPrice">Жолоочид өгөх төлбөр</Label>
                <Input
                  id="driverPrice"
                  name="driverPrice"
                  type="number"
                  value={formData.driverPrice || 0}
                  onChange={handleChange}
                  className={errors.driverPrice ? "border-red-500" : ""}
                />
                {errors.driverPrice && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.driverPrice}
                  </p>
                )}
              </div>

              {/* Total price - calculated */}
              <div className="flex flex-col gap-y-2">
                <Label htmlFor="summaryPrice">Нийт дүн (Бараа + Хүргэлт - Жолоочийн төлбөр)</Label>
                <Input
                  id="summaryPrice"
                  value={
                    (
                      (delivery.sale_id?.total_price || 0) +
                      (Number(formData.deliveryPrice) || 0) - (formData.driverPrice || 0)
                    ).toLocaleString() + "₮"
                  }
                  disabled
                  className="bg-gray-50 font-bold"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardFooter className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/admin/deliveries/${id}`)}
            >
              Цуцлах
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Хадгалж байна...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Хадгалах
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
