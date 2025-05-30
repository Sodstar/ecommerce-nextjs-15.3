"use client";

import React, { use, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Plane, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toMongolianCurrency } from "@/utils/formatter";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import { DeliveryFormData } from "@/models/Delivery";
import { create } from "domain";
import { createDelivery, checkDeliveryExists } from "@/actions/delivery-action";
import { generateDeliveryNumber } from "@/utils/numberGenerator";
import { set } from "mongoose";
import { updateSaleStatus } from "@/actions/sale-action";
import { getAllDrivers } from "@/actions/driver-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  _id: string;
  code: string;
  cartItems: CartItem[];
  total_price: number;
}

interface MakeDeliveryButtonProps {
  data: OrderData;
  onDeliveryCreated?: (deliveryData: DeliveryFormData) => void;
}

function MakeDeliveryButton({ data }: any) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryPrice, setDeliveryPrice] = useState(6000);
  const [driverPrice, setDriverPrice] = useState(6000);
  const [summaryPrice, setSummaryPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();
  const deliveryId = data?._id || "";
  const [drivers, setDrivers] = useState<any[]>([]);
  const [selectedDriver, setSelectedDriver] = useState("");

  useEffect(() => {
    setSummaryPrice(data.total_price + deliveryPrice - driverPrice);
  }, [data, deliveryPrice, driverPrice]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const driversData = await getAllDrivers();
        setDrivers(driversData);
      } catch (error) {
        console.error("Error fetching drivers:", error);
        toast.error("Жолооч дуудахад алдаа гарлаа");
      }
    };

    fetchDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedDriver) {
      toast.warning("Жолооч сонгоно уу");
      setLoading(false);
      return;
    }

    if (!phone.trim()) {
      toast.warning("Утасны дугаар оруулна уу");
      setLoading(false);
      return;
    }

    if (!address.trim()) {
      toast.warning("Хаяг оруулна уу");
      setLoading(false);
      return;
    }

    try {
      setIsSubmitting(true);

      const deliveryData: DeliveryFormData = {
        code: `${generateDeliveryNumber("D")}`,
        sale_id: data._id,
        driver_id: selectedDriver,
        phone,
        address,
        deliveryPrice,
        driverPrice,
        summaryPrice,
      };

      const response = await createDelivery(deliveryData);
      if (!response) {
        toast.error("Хүргэлт үүсгэхэд алдаа гарлаа");
        return;
      }
      await updateSaleStatus(data._id, true);

      toast.success("Хүргэлт амжилттай үүслээ");

      setOpen(false);
      resetForm();
      setLoading(false);
      router.push("/admin/deliveries");
    } catch (error) {
      console.error("Error creating delivery:", error);
      toast("Алдаа гарлаа" + error);
      setLoading(false);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedDriver("");
    setPhone("");
    setAddress("");
    setDeliveryPrice(5000);
  };

  const handleCancel = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={(newOpen) => {
          if (!isSubmitting) {
            setOpen(newOpen);
            if (!newOpen) resetForm();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button
            size="sm"
            className="flex items-center gap-1"
            disabled={loading}
            title={"Хүргэлтэд гаргах"}
          >
            <Plane className="h-4 w-4" />
            <span>Хүргэлтэд гаргах</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center">
                  <Plane className="h-4 w-4 mr-2" /> Хүргэлтэд гаргах
                </div>
              </DialogTitle>
              <DialogDescription>
                <Badge variant="outline">{data.code}</Badge> дугаартай{" "}
                {data.cartItems.length} бараатай нийт{" "}
                <strong>{toMongolianCurrency(data.total_price)}₮</strong> үнийн
                дүнтэй борлуулалтыг хүргэлтэд гаргах
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="driver" className="text-right">
                  Жолооч <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedDriver}
                  onValueChange={(value) => setSelectedDriver(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Жолооч сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((driver) => (
                      <SelectItem key={driver._id} value={driver._id}>
                        {driver.name} - {driver.vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Утас <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="col-span-3"
                  placeholder="Утасны дугаар"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Хаяг <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="col-span-3"
                  placeholder="Дэлгэрэнгүй хаяг"
                />
              </div>
              <Separator className="my-2" />
              <div className="grid gap-3">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="delivery" className="text-right col-span-2">
                    Хүргэлтийн төлбөр
                  </Label>
                  <Input
                    id="delivery"
                    type="number"
                    min={0}
                    value={deliveryPrice}
                    onChange={(e) => setDeliveryPrice(Number(e.target.value))}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[4000, 5000, 6000, 7000, 8000, 9000, 10000, 11000].map(
                    (price) => (
                      <Button
                        key={price}
                        type="button"
                        size={"sm"}
                        variant={
                          deliveryPrice === price ? "default" : "outline"
                        }
                        onClick={() => setDeliveryPrice(price)}
                        className="col-span-1"
                      >
                        {toMongolianCurrency(price)}₮
                      </Button>
                    )
                  )}
                </div>
              </div>
              <div className="grid gap-3">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="driver" className="text-right col-span-2">
                    Жолоочийн төлбөр
                  </Label>
                  <Input
                    id="driver"
                    type="number"
                    min={0}
                    value={driverPrice}
                    onChange={(e) => setDriverPrice(Number(e.target.value))}
                    className="col-span-2"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[6000, 8000, 10000, 12000, 15000, 16000, 18000, 20000].map(
                    (price) => (
                      <Button
                        key={price}
                        type="button"
                        size={"sm"}
                        variant={driverPrice === price ? "default" : "outline"}
                        onClick={() => setDriverPrice(price)}
                        className="col-span-1"
                      >
                        {toMongolianCurrency(price)}₮
                      </Button>
                    )
                  )}
                </div>
              </div>
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Хүлээж авах мөнгөн дүн!</AlertTitle>
                <AlertDescription>
                  {toMongolianCurrency(summaryPrice)}₮
                </AlertDescription>
              </Alert>
            </div>
            <DialogFooter>
              <div className="flex flex-row justify-between w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Болих
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Түр хүлээнэ үү..." : "Баталгаажуулах"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MakeDeliveryButton;
