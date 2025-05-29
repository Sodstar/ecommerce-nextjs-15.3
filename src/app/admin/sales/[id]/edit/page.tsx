"use client";

import * as React from "react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ArrowLeft, Minus, Plus, Save, Trash } from "lucide-react";
import { TSale, Item } from "@/models/Sale";
import { getSaleById, updateSale } from "@/actions/sale-action";
import { toMongolianCurrency } from "@/utils/formatter";

export default function EditSalePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [sale, setSale] = useState<TSale | null>(null);
  const [cartItems, setCartItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [phone, setPhone] = useState("");
  const { id } = use(params);

  // Fetch sale data
  useEffect(() => {
    const fetchSaleData = async () => {
      setIsLoading(true);
      try {
        const saleData = await getSaleById(id);
        setSale(saleData);
        setCartItems([...saleData.cartItems]);
        setDiscount(saleData.discount || 0);
        setPhone(saleData.phone || "");
        calculateTotal([...saleData.cartItems]);
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

  // Calculate total price based on cart items
  const calculateTotal = (items: Item[]) => {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setTotalPrice(total);
    return total;
  };

  // Handle quantity change
  const handleQuantityChange = (index: number, newQuantity: number) => {
    if (newQuantity < 1) newQuantity = 1;
    
    const updatedItems = [...cartItems];
    updatedItems[index].quantity = newQuantity;
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Remove item from cart
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...cartItems];
    updatedItems.splice(index, 1);
    setCartItems(updatedItems);
    calculateTotal(updatedItems);
  };

  // Handle discount change
  const handleDiscountChange = (value: string) => {
    const numValue = parseInt(value);
    if (isNaN(numValue)) {
      setDiscount(0);
    } else {
      // Limit discount to 0-100%
      setDiscount(Math.min(Math.max(numValue, 0), 100));
    }
  };

  // Calculate final price with discount
  const calculateFinalPrice = () => {
    const discountAmount = totalPrice * (discount / 100);
    return totalPrice - discountAmount;
  };

  // Save changes
  const handleSave = async () => {
    if (!sale) return;
    
    setIsSaving(true);
    try {
      // When saving, include discount and phone in the update data
      const updateData = {
        cartItems: cartItems,
        total_price: calculateFinalPrice(),
        discount: discount,
        phone: phone
      };
      
      await updateSale(id, updateData);
      toast.success("Борлуулалт амжилттай шинэчлэгдлээ");
      router.push(`/admin/sales/${id}`);
    } catch (error) {
      console.error("Error updating sale:", error);
      toast.error("Борлуулалтыг шинэчлэхэд алдаа гарлаа");
    } finally {
      setIsSaving(false);
    }
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="outline"
          onClick={() => router.push(`/admin/sales/${id}`)}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Буцах
        </Button>
        <div className="flex space-x-2">
          <Button 
            variant="default" 
            onClick={handleSave}
            disabled={isSaving || cartItems.length === 0}
            className="flex items-center"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Хадгалж байна..." : "Хадгалах"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Sale Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Борлуулалтын мэдээлэл</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="code">Борлуулалтын код</Label>
                <Input id="code" value={sale.code} disabled />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="user">Борлуулсан ажилтан</Label>
                <Input id="user" value={String(userName)} disabled />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="phone">Утасны дугаар</Label>
                <Input 
                  id="phone" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Утасны дугаар оруулах" 
                />
              </div>
              <div className="flex flex-col space-y-2">
                <Label htmlFor="discount">Хямдрал (%)</Label>
                <Input 
                  id="discount" 
                  type="number" 
                  min="0" 
                  max="100" 
                  value={discount} 
                  onChange={(e) => handleDiscountChange(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cart Items Card */}
        <Card>
          <CardHeader>
            <CardTitle>Бараанууд</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length > 0 ? (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[400px]">Бараа</TableHead>
                      <TableHead className="text-right">Нэгж үнэ</TableHead>
                      <TableHead className="w-[180px] text-center">Тоо</TableHead>
                      <TableHead className="text-right">Нийт</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {cartItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div>
                            <div>{item.name}</div>
                            <div className="text-sm text-muted-foreground">Код: {item.product_code}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{toMongolianCurrency(item.price)}₮</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(index, item.quantity - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(index, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {toMongolianCurrency(item.price * item.quantity)}₮
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-muted-foreground mb-4">Сагс хоосон байна</p>
              </div>
            )}

            {cartItems.length > 0 && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-end space-x-4 items-center">
                  <div className="text-lg">Нийт:</div>
                  <div className="text-lg font-medium">{toMongolianCurrency(totalPrice)}₮</div>
                </div>
                {discount > 0 && (
                  <div className="flex justify-end space-x-4 items-center text-orange-600">
                    <div className="text-lg">Хямдрал ({discount}%):</div>
                    <div className="text-lg font-medium">
                      -{toMongolianCurrency(totalPrice * (discount / 100))}₮
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-4 items-center">
                  <div className="text-lg font-semibold">Төлөх дүн:</div>
                  <div className="text-2xl font-bold text-green-600">
                    {toMongolianCurrency(calculateFinalPrice())}₮
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Discard Changes Dialog */}
      <Dialog open={isDiscardDialogOpen} onOpenChange={setIsDiscardDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Өөрчлөлтийг хадгалахгүй гарах уу?</DialogTitle>
            <DialogDescription>
              Таны хийсэн өөрчлөлтүүд хадгалагдахгүй. Та итгэлтэй байна уу?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDiscardDialogOpen(false)}
            >
              Үгүй, үргэлжлүүлэх
            </Button>
            <Button 
              variant="destructive"
              onClick={() => router.push(`/admin/sales/${id}`)}
            >
              Тийм, хадгалахгүй гарах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
