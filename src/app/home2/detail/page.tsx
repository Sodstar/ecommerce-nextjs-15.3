"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Classic Gray");

  const product = {
    name: "Ergonomic Office Chair",
    price: 189.99,
    originalPrice: 239.99,
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    colors: [
      { name: "Classic Gray", hex: "#6B7280" },
      { name: "Midnight Black", hex: "#1F2937" },
    ],
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=2000&auto=format&fit=crop",
    ],
    description:
      "Experience unparalleled comfort with our premium ergonomic office chair. Designed to provide optimal support for long work hours.",
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm mb-4">
        <Link href="/home2" className="text-zinc-500 hover:text-zinc-700">
          Home
        </Link>{" "}
        /{" "}
        <span className="text-zinc-800 font-medium">{product.name}</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div>
          <Image
            src={product.images[0]}
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg"
          />
          <div className="flex gap-2 mt-4">
            {product.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={`${product.name} ${index + 1}`}
                width={100}
                height={100}
                className="rounded-lg cursor-pointer"
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "text-amber-400"
                        : "text-zinc-200"
                    }`}
                  />
                ))}
            </div>
            <span className="ml-2 text-sm">{product.reviewCount} reviews</span>
          </div>
          <div className="flex items-center mt-4">
            <span className="text-2xl font-bold">${product.price}</span>
            {product.originalPrice && (
              <span className="ml-2 text-zinc-400 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          <p className="mt-4 text-zinc-600">{product.description}</p>

          {/* Color Selection */}
          <div className="mt-6">
            <h3 className="font-medium">Select Color</h3>
            <div className="flex gap-4 mt-2">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  className={`w-8 h-8 rounded-full border ${
                    selectedColor === color.name
                      ? "border-amber-500"
                      : "border-zinc-300"
                  }`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(color.name)}
                />
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <h3 className="font-medium">Quantity</h3>
            <div className="flex items-center mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus />
              </Button>
              <span className="mx-4">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <Plus />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mt-6">
            <Button className="flex-1 bg-black text-white">
              Add to Cart <ShoppingBag className="ml-2" />
            </Button>
            <Button variant="outline" className="flex-1">
              <Heart className="mr-2" /> Wishlist
            </Button>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 flex items-center">
            <Truck className="h-6 w-6 text-zinc-500" />
            <p className="ml-2 text-sm text-zinc-600">
              Free shipping on orders over $50
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <p className="mt-4 text-zinc-600">
              This ergonomic chair is designed for comfort and durability.
            </p>
          </TabsContent>
          <TabsContent value="reviews">
            <p className="mt-4 text-zinc-600">No reviews yet.</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
