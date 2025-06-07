"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CreditCard,
  Heart,
  Info,
  Minus,
  Plus,
  Shield,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Ergonomic Office Chair",
      price: 189.99,
      originalPrice: 239.99,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop",
      quantity: 1,
      variant: "Classic Gray",
      inStock: true,
      maxQuantity: 10,
    },
    {
      id: 2,
      name: "Modern Pendant Light",
      price: 149.99,
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=300&auto=format&fit=crop",
      quantity: 2,
      variant: "Brass Finish",
      inStock: true,
      maxQuantity: 5,
    },
    {
      id: 3,
      name: "Designer Coffee Table",
      price: 119.99,
      originalPrice: 149.99,
      image:
        "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=300&auto=format&fit=crop",
      quantity: 1,
      variant: "Natural Oak",
      inStock: false,
      maxQuantity: 0,
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax - discount;
  const savedAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.originalPrice
        ? (item.originalPrice - item.price) * item.quantity
        : 0),
    0
  );

  // Handle quantity change
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? {
              ...item,
              quantity: Math.min(Math.max(1, newQuantity), item.maxQuantity),
            }
          : item
      )
    );
  };

  // Remove item from cart
  const removeItem = (itemId: number) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  // Move to wishlist (just demo function)
  const moveToWishlist = (itemId: number) => {
    removeItem(itemId);
    // In a real app, would also add to wishlist
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "save10") {
      setDiscount(subtotal * 0.1); // 10% discount
      setPromoApplied(true);
    } else {
      setDiscount(0);
      setPromoApplied(false);
      alert("Invalid promo code");
    }
  };

  // Recommended products
  const recommendedProducts = [
    {
      id: 101,
      name: "Desk Lamp",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1534189289-18e4dbe8f1fc?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 102,
      name: "Office Desk",
      price: 249.99,
      image:
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: 103,
      name: "Bookshelf",
      price: 129.99,
      image:
        "https://images.unsplash.com/photo-1616150638538-ffb0679a3fc4?q=80&w=200&auto=format&fit=crop",
    },
  ];

  // Add animation states
  const [animateRemove, setAnimateRemove] = useState<number | null>(null);

  // Enhanced remove item with animation
  const removeItemWithAnimation = (itemId: number) => {
    setAnimateRemove(itemId);
    setTimeout(() => {
      removeItem(itemId);
      setAnimateRemove(null);
    }, 300);
  };

  // Add quantity animation feedback
  const [animateQuantity, setAnimateQuantity] = useState<number | null>(null);

  // Enhanced quantity change with animation
  const handleQuantityChangeWithAnimation = (
    itemId: number,
    newQuantity: number
  ) => {
    if (
      newQuantity >= 1 &&
      newQuantity <= cartItems.find((item) => item.id === itemId)?.maxQuantity!
    ) {
      setAnimateQuantity(itemId);
      handleQuantityChange(itemId, newQuantity);
      setTimeout(() => setAnimateQuantity(null), 300);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50/50 to-white py-20">
      <div className="container px-4 mx-auto max-w-6xl">
        {/* Enhanced Header with Animation */}
        <div className="mb-12 text-center">
          <motion.h1
            className="text-4xl font-bold mb-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Shopping Cart
          </motion.h1>
          <motion.p
            className="text-zinc-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cartItems.length > 0
              ? `You have ${cartItems.length} item${
                  cartItems.length > 1 ? "s" : ""
                } in your cart`
              : "Your cart is empty"}
          </motion.p>
        </div>

        {/* Modern Back to Shopping Link */}
        <div className="mb-10">
          <Link
            href="/home2"
            className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-black group rounded-full py-2 px-4 hover:bg-zinc-100 transition-all"
          >
            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center mr-2 group-hover:bg-zinc-200 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Continue Shopping
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Modernized Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden">
                <div className="p-6 border-b border-zinc-100">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Cart Items</h2>
                    <Badge
                      variant="secondary"
                      className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    >
                      {cartItems.length} items
                    </Badge>
                  </div>
                </div>

                <div className="divide-y divide-zinc-100">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      className="p-6 group hover:bg-zinc-50/50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: animateRemove === item.id ? 0 : 1,
                        height: animateRemove === item.id ? 0 : "auto",
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex gap-6">
                        {/* Enhanced Product Image with Badge */}
                        <div className="relative h-28 w-28 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0 group-hover:shadow-md transition-all">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {item.originalPrice && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium py-1 px-2 rounded-full">
                              -
                              {Math.round(
                                (1 - item.price / item.originalPrice) * 100
                              )}
                              %
                            </div>
                          )}
                        </div>

                        {/* Enhanced Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium text-lg leading-tight">
                                <Link
                                  href="/home2/detail"
                                  className="hover:text-amber-600 transition-colors"
                                >
                                  {item.name}
                                </Link>
                              </h3>
                              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                                <span
                                  className="w-3 h-3 rounded-full inline-block"
                                  style={{
                                    backgroundColor:
                                      item.variant === "Classic Gray"
                                        ? "#6B7280"
                                        : "#1F2937",
                                  }}
                                ></span>
                                {item.variant}
                              </p>

                              {/* Enhanced Price Display */}
                              <div className="flex items-center gap-2 mt-2">
                                <span className="font-semibold text-lg">
                                  ${item.price.toFixed(2)}
                                </span>
                                {item.originalPrice && (
                                  <span className="text-sm text-zinc-400 line-through">
                                    ${item.originalPrice.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Modern Remove Button for Mobile */}
                            <button
                              className="text-zinc-300 hover:text-red-500 transition-colors h-8 w-8 rounded-full flex items-center justify-center lg:hidden"
                              onClick={() => removeItemWithAnimation(item.id)}
                              aria-label="Remove item"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>

                          {/* Improved Bottom Row with Quantity and Actions */}
                          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                            <motion.div
                              className="flex items-center gap-2 border rounded-full bg-white overflow-hidden"
                              animate={{
                                scale: animateQuantity === item.id ? 1.05 : 1,
                              }}
                              transition={{ duration: 0.2 }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                disabled={item.quantity <= 1}
                                onClick={() =>
                                  handleQuantityChangeWithAnimation(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                disabled={
                                  item.quantity >= item.maxQuantity ||
                                  !item.inStock
                                }
                                onClick={() =>
                                  handleQuantityChangeWithAnimation(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </motion.div>

                            <div className="flex items-center gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 rounded-full bg-zinc-50 border-zinc-100 hover:border-amber-200 hover:bg-amber-50 text-zinc-600 hover:text-amber-600"
                                onClick={() => moveToWishlist(item.id)}
                              >
                                <Heart className="h-4 w-4 mr-1" />
                                <span>Save for Later</span>
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-9 rounded-full border-zinc-100 hover:border-red-200 hover:bg-red-50 text-zinc-600 hover:text-red-600 hidden lg:flex"
                                onClick={() => removeItemWithAnimation(item.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                <span>Remove</span>
                              </Button>
                            </div>
                          </div>

                          {/* Enhanced Availability Badge */}
                          {!item.inStock && (
                            <div className="mt-3">
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-600 border-red-100 gap-1 py-1.5"
                              >
                                <Info className="h-3.5 w-3.5" />
                                Currently Out of Stock
                              </Badge>
                            </div>
                          )}
                          {item.inStock && item.maxQuantity <= 3 && (
                            <div className="mt-3">
                              <Badge
                                variant="outline"
                                className="bg-amber-50 text-amber-600 border-amber-100 gap-1 py-1.5"
                              >
                                <Info className="h-3.5 w-3.5" />
                                Only {item.maxQuantity} left in stock
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced Order Summary */}
            <div>
              <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden sticky top-20">
                <div className="p-6 border-b border-zinc-100 bg-zinc-50/50">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>

                <div className="p-6 space-y-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">
                      Subtotal (
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                      items)
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  {savedAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600 flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Savings
                      </span>
                      <span className="text-green-600 font-medium">
                        -${savedAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Shipping</span>
                    {shipping > 0 ? (
                      <span>${shipping.toFixed(2)}</span>
                    ) : (
                      <span className="text-green-600 font-medium">Free</span>
                    )}
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Estimated Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  {promoApplied && (
                    <div className="flex justify-between text-sm">
                      <span className="text-amber-600 flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Promo (SAVE10)
                      </span>
                      <span className="text-amber-600 font-medium">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <Separator className="bg-zinc-100" />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>

                  {/* Enhanced Promo Code */}
                  <div className="mt-6 pt-4 border-t border-dashed border-zinc-100">
                    <p className="text-sm font-medium mb-2 flex items-center gap-1.5">
                      <span className="h-5 w-5 rounded-full bg-zinc-100 flex items-center justify-center">
                        <CreditCard className="h-3 w-3" />
                      </span>
                      Apply Promo Code
                    </p>
                    <div className="flex gap-2">
                      <Input
                        className="flex-1 bg-zinc-50/50 border-zinc-200 rounded-l-full focus-visible:ring-amber-500"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                      />
                      <Button
                        onClick={applyPromoCode}
                        className="rounded-r-full bg-black hover:bg-zinc-800"
                      >
                        Apply
                      </Button>
                    </div>
                    <motion.p
                      className="text-xs text-zinc-500 mt-2 flex items-center gap-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Info className="h-3 w-3" />
                      Try "SAVE10" for 10% off your order
                    </motion.p>
                  </div>

                  {/* Enhanced Checkout Button */}
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="mt-6"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-black hover:bg-zinc-800 rounded-full text-white py-6 text-base font-medium shadow-sm"
                    >
                      Proceed to Checkout
                    </Button>
                  </motion.div>
                </div>

                {/* Enhanced Shipping and Returns Info */}
                <div className="p-6 bg-zinc-50 border-t border-zinc-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <Truck className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Free shipping on orders over $50
                      </p>
                      <p className="text-xs text-zinc-500">
                        Expected delivery: 3-5 business days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-5 w-5 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">30-day easy returns</p>
                      <p className="text-xs text-zinc-500">
                        Shop with confidence
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Enhanced Empty Cart State
          <motion.div
            className="text-center py-20 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-gradient-to-br from-zinc-50 to-zinc-100 w-32 h-32 rounded-full mx-auto flex items-center justify-center mb-8 shadow-inner"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <ShoppingBag className="h-14 w-14 text-zinc-300" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-zinc-600 mb-8 max-w-xs mx-auto">
              Looks like you haven't added anything to your cart yet. Browse our
              products and find something you'll love.
            </p>
            <motion.div
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                size="lg"
                className="rounded-full px-8 py-6 bg-black hover:bg-zinc-800 text-base"
                asChild
              >
                <Link href="/home2">Explore Our Collection</Link>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* Enhanced Recommended Products */}
        {cartItems.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-bold mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {recommendedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative rounded-3xl overflow-hidden mb-4 bg-zinc-100 shadow-sm">
                    <div className="aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Button className="w-full bg-black/80 backdrop-blur-sm hover:bg-black rounded-full shadow-lg">
                        Add to Cart
                        <ShoppingBag className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-medium text-lg mb-1 group-hover:text-amber-600 transition-colors">
                    {product.name}
                  </h3>
                  <span className="text-zinc-900 font-semibold">
                    ${product.price}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced FAQ Section */}
        {cartItems.length > 0 && (
          <div className="mt-20 bg-zinc-50/50 py-12 px-6 rounded-3xl">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="max-w-3xl mx-auto">
              <Accordion
                type="single"
                collapsible
                className="bg-white rounded-2xl shadow-sm"
              >
                <AccordionItem
                  value="shipping"
                  className="border-b border-zinc-100"
                >
                  <AccordionTrigger className="py-5 px-6 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0">
                        <Truck className="h-4 w-4 text-zinc-500" />
                      </div>
                      <span className="font-medium">
                        How long does shipping take?
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-zinc-600">
                    <div className="pl-11">
                      Standard shipping takes 3-5 business days. Expedited
                      shipping options are available at checkout for faster
                      delivery. All orders are processed within 24 hours.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem
                  value="returns"
                  className="border-b border-zinc-100"
                >
                  <AccordionTrigger className="py-5 px-6 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0">
                        <Shield className="h-4 w-4 text-zinc-500" />
                      </div>
                      <span className="font-medium">
                        What is your return policy?
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-zinc-600">
                    <div className="pl-11">
                      We offer a 30-day return policy for most items. Products
                      must be in original condition with tags attached and
                      original packaging. Return shipping is free for orders
                      over $50.
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="payment" className="border-0">
                  <AccordionTrigger className="py-5 px-6 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-50 flex items-center justify-center flex-shrink-0">
                        <CreditCard className="h-4 w-4 text-zinc-500" />
                      </div>
                      <span className="font-medium">
                        What payment methods do you accept?
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 pt-0 text-zinc-600">
                    <div className="pl-11">
                      We accept all major credit cards (Visa, Mastercard,
                      American Express), PayPal, and Apple Pay. All transactions
                      are secure and encrypted. We never store your complete
                      credit card information.
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
