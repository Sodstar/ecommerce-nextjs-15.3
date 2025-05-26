"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  Star,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home2Page() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Add user data
  const userData = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    membership: "Premium Member",
  };

  // Add cart data with more details
  const cartItems = [
    {
      id: 1,
      name: "Ergonomic Chair",
      price: 189.99,
      originalPrice: 239.99,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop",
      quantity: 1,
      variant: "Classic Gray",
      inStock: true,
    },
    {
      id: 2,
      name: "Modern Pendant Light",
      price: 149.99,
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=300&auto=format&fit=crop",
      quantity: 1,
      variant: "Brass Finish",
      inStock: true,
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
    },
  ];

  // Calculate cart totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.08; // 8% tax rate
  const total = subtotal + shipping + tax;
  const savedAmount = cartItems.reduce(
    (sum, item) =>
      sum +
      (item.originalPrice ? item.originalPrice - item.price : 0) *
        item.quantity,
    0
  );

  // Handle quantity change in cart
  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    // In a real app, this would update your cart state
    console.log(`Changed quantity for item ${itemId} to ${newQuantity}`);
  };

  // Handle item removal from cart
  const handleRemoveItem = (itemId: number) => {
    // In a real app, this would remove the item from your cart state
    console.log(`Removed item ${itemId} from cart`);
  };

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Focus search input when expanded
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  // Close search on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      {/* Enhanced Modern Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-2 bg-white/95 backdrop-blur-md shadow-sm border-b border-zinc-100"
            : "py-4 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo with animation */}
            <motion.div
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Link href="/" className="group flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg bg-black flex items-center justify-center 
                  group-hover:bg-amber-500 transition-colors duration-300"
                >
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <h1 className="text-lg font-bold tracking-tight">
                  MODRN<span className="text-amber-500">.</span>
                </h1>
              </Link>
            </motion.div>

            {/* Desktop Navigation - centered for modern look */}
            <nav className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
              <ul className="flex space-x-8">
                {["Shop", "Collections", "Bestsellers", "About", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="text-sm font-medium text-zinc-800 hover:text-black relative group py-1"
                      >
                        {item}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </li>
                  )
                )}
              </ul>
            </nav>

            {/* Action Buttons with enhanced styling */}
            <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
              {/* Expandable Search Component */}
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{
                    width: searchOpen ? "200px" : "32px",
                    borderRadius: searchOpen ? "9999px" : "9999px",
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative overflow-hidden"
                >
                  {searchOpen ? (
                    <div className="bg-white shadow-md rounded-full flex items-center border border-zinc-100 pr-2">
                      <Input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Бүтээгдэхүүн хайх..."
                        className="border-0 shadow-none pl-4 pr-8 h-8 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 h-8 w-8 rounded-full hover:bg-transparent"
                        onClick={() => setSearchOpen(false)}
                      >
                        <X className="h-4 w-4 text-zinc-500" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-zinc-100 hidden sm:flex"
                      onClick={() => setSearchOpen(true)}
                    >
                      <Search className="h-[18px] w-[18px]" />
                      <span className="sr-only">Search</span>
                    </Button>
                  )}
                </motion.div>
              </div>

              {/* Account with modern dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-zinc-100 hidden md:flex relative group"
                  >
                    <User className="h-[18px] w-[18px]" />
                    <span className="sr-only">Account</span>
                    <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      Account
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 mt-1 p-0 overflow-hidden bg-white rounded-xl"
                >
                  {/* User profile section */}
                  <div className="p-4 border-b border-zinc-100 bg-zinc-50/50">
                    <div className="flex items-center gap-3">
                      <div className="relative rounded-full h-12 w-12 overflow-hidden bg-zinc-100 flex-shrink-0">
                        <Image
                          src={userData.avatar}
                          alt="Profile"
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base truncate">
                          {userData.name}
                        </p>
                        <p className="text-zinc-500 text-sm truncate">
                          {userData.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge
                        variant="secondary"
                        className="bg-amber-50 text-amber-700 hover:bg-amber-100"
                      >
                        {userData.membership}
                      </Badge>
                    </div>
                  </div>

                  {/* Account links */}
                  <div className="p-2">
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer rounded-lg py-2 px-3 focus:bg-zinc-50 hover:bg-zinc-50">
                        <User className="mr-3 h-4 w-4 text-zinc-500" />
                        <div>
                          <div>My Profile</div>
                          <div className="text-xs text-zinc-400">
                            Manage your profile details
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer rounded-lg py-2 px-3 focus:bg-zinc-50 hover:bg-zinc-50">
                        <ShoppingBag className="mr-3 h-4 w-4 text-zinc-500" />
                        <div>
                          <div>Orders</div>
                          <div className="text-xs text-zinc-400">
                            View order history
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer rounded-lg py-2 px-3 focus:bg-zinc-50 hover:bg-zinc-50">
                        <Heart className="mr-3 h-4 w-4 text-zinc-500" />
                        <div>
                          <div>Wishlist</div>
                          <div className="text-xs text-zinc-400">
                            Saved items
                          </div>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer rounded-lg py-2 px-3 focus:bg-zinc-50 hover:bg-zinc-50">
                        <ArrowRight className="mr-3 h-4 w-4 text-zinc-500" />
                        <div>
                          <div>Track Order</div>
                          <div className="text-xs text-zinc-400">
                            Check shipping status
                          </div>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </div>

                  {/* Footer/Actions */}
                  <div className="p-2 border-t border-zinc-100">
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-2 px-3 text-red-500 focus:bg-red-50 focus:text-red-600 hover:bg-red-50 hover:text-red-600">
                      <div className="flex items-center w-full justify-between">
                        <div>Sign out</div>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Cart with modernized design */}
              <Sheet open={cartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-zinc-100 relative group"
                    onClick={() => setCartOpen(true)}
                  >
                    <ShoppingBag className="h-[18px] w-[18px]" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-500 text-[10px] text-white flex items-center justify-center font-medium">
                      {cartItems.length}
                    </span>
                    <span className="sr-only">Cart</span>
                    <span className="absolute -bottom-10 right-0 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                      Cart (${subtotal.toFixed(2)})
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-md p-0 bg-white"
                >
                  <div className="flex flex-col h-full">
                    {/* Enhanced Cart header */}
                    <div className="sticky top-0 bg-white z-10 p-4 border-b border-zinc-100">
                      <SheetHeader>
                        <div className="flex justify-between items-center">
                          <SheetTitle className="text-xl flex items-center gap-2">
                            <div className="relative">
                              <ShoppingBag className="h-5 w-5" />
                              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-500 text-[8px] text-white flex items-center justify-center font-medium">
                                {cartItems.length}
                              </span>
                            </div>
                            <span>Your Cart</span>
                          </SheetTitle>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full hover:bg-zinc-100"
                              onClick={() => setCartOpen(false)}
                            >
                              <X className="h-5 w-5" />
                              <span className="sr-only">Close cart</span>
                            </Button>
                          </SheetTrigger>
                        </div>
                        {savedAmount > 0 && (
                          <div className="mt-2 py-1.5 px-3 bg-green-50 border border-green-100 rounded-lg">
                            <p className="text-xs text-green-700 flex items-center">
                              <span className="font-medium">
                                You're saving ${savedAmount.toFixed(2)}
                              </span>
                              <span className="mx-2">•</span>
                              <span>Get free shipping on orders over $50</span>
                            </p>
                          </div>
                        )}
                      </SheetHeader>
                    </div>

                    {/* Modern Cart items */}
                    <div className="flex-1 overflow-auto">
                      <div className="divide-y divide-zinc-100">
                        {cartItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 group hover:bg-zinc-50/50 transition-colors"
                          >
                            <div className="flex gap-4">
                              {/* Product image with badge */}
                              <div className="relative h-24 w-24 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                                {item.originalPrice && (
                                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-medium py-0.5 px-1.5 rounded-br-lg">
                                    -
                                    {Math.round(
                                      (1 - item.price / item.originalPrice) *
                                        100
                                    )}
                                    %
                                  </div>
                                )}
                              </div>

                              {/* Product details */}
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between">
                                  <div className="space-y-1">
                                    <h4 className="font-medium text-base leading-tight truncate pr-4">
                                      {item.name}
                                    </h4>
                                    <p className="text-xs text-zinc-500">
                                      {item.variant}
                                    </p>

                                    {/* Price display */}
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-semibold">
                                        ${item.price.toFixed(2)}
                                      </span>
                                      {item.originalPrice && (
                                        <span className="text-xs text-zinc-400 line-through">
                                          ${item.originalPrice.toFixed(2)}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Remove button */}
                                  <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-zinc-300 hover:text-red-500 transition-colors h-5 w-5 rounded-full flex items-center justify-center"
                                    aria-label="Remove item"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Bottom row with quantity selector and stock info */}
                                <div className="mt-3 flex items-center justify-between">
                                  <div className="flex items-center gap-2 border rounded-lg bg-white">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-none"
                                      disabled={item.quantity <= 1}
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity - 1
                                        )
                                      }
                                    >
                                      <span className="font-medium text-sm">
                                        −
                                      </span>
                                    </Button>
                                    <span className="w-5 text-center text-sm">
                                      {item.quantity}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7 rounded-none"
                                      onClick={() =>
                                        handleQuantityChange(
                                          item.id,
                                          item.quantity + 1
                                        )
                                      }
                                    >
                                      <span className="font-medium text-sm">
                                        +
                                      </span>
                                    </Button>
                                  </div>

                                  {!item.inStock ? (
                                    <Badge
                                      variant="outline"
                                      className="bg-red-50 text-red-600 border-red-100"
                                    >
                                      Low Stock
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-600 border-green-100"
                                    >
                                      In Stock
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Empty state now has better styling and clear CTA */}
                        {cartItems.length === 0 && (
                          <div className="flex flex-col items-center justify-center p-8 py-16">
                            <div className="w-20 h-20 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
                              <ShoppingBag className="h-10 w-10 text-zinc-300" />
                            </div>
                            <h3 className="text-xl font-medium mb-2">
                              Your cart is empty
                            </h3>
                            <p className="text-zinc-500 text-center mb-6 max-w-xs">
                              Looks like you haven't added any products to your
                              cart yet.
                            </p>
                            <Button
                              onClick={() => setCartOpen(false)}
                              className="rounded-full px-8 bg-black hover:bg-zinc-800"
                            >
                              Start Shopping
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Modern cart footer with enhanced summary */}
                    {cartItems.length > 0 && (
                      <div className="border-t border-zinc-100 bg-white sticky bottom-0">
                        <div className="p-4">
                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-zinc-500">Subtotal</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-zinc-500">Shipping</span>
                              <span className="text-green-600">Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-zinc-500">
                                Estimated Tax
                              </span>
                              <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="h-px bg-zinc-100 my-2"></div>
                            <div className="flex justify-between font-medium text-base">
                              <span>Total</span>
                              <span>${total.toFixed(2)}</span>
                            </div>
                          </div>

                          <div className="grid gap-3">
                            <Button
                              className="w-full bg-black hover:bg-zinc-800 rounded-full relative overflow-hidden group"
                              size={"lg"}
                            >
                              <span className="relative z-10">Checkout</span>
                            </Button>
                            <div className="flex gap-2 items-center mt-1">
                              <Button
                                variant="outline"
                                className="flex-1 border-zinc-200 hover:bg-zinc-50 rounded-full text-sm"
                                onClick={() => setCartOpen(false)}
                                size={"lg"}
                              >
                                Continue Shopping
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Enhanced mobile menu button with animation */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full lg:hidden hover:bg-zinc-100 ml-1"
                    onClick={() => setMobileMenuOpen(true)}
                  >
                    <div className="w-5 flex flex-col items-end gap-[5px]">
                      <span
                        className={`h-[2px] bg-black transition-all duration-300 ${
                          mobileMenuOpen
                            ? "w-full rotate-45 translate-y-[7px]"
                            : "w-full"
                        }`}
                      ></span>
                      <span
                        className={`h-[2px] bg-black transition-all duration-300 ${
                          mobileMenuOpen ? "opacity-0" : "w-3/4"
                        }`}
                      ></span>
                      <span
                        className={`h-[2px] bg-black transition-all duration-300 ${
                          mobileMenuOpen
                            ? "w-full -rotate-45 -translate-y-[7px]"
                            : "w-1/2"
                        }`}
                      ></span>
                    </div>
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full sm:max-w-sm p-0 overflow-auto"
                >
                  <div className="flex flex-col h-full">
                    {/* Mobile menu header with search */}
                    <div className="sticky top-0 bg-white z-10 p-4 border-b border-zinc-100">
                      <SheetHeader className="mb-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                M
                              </span>
                            </div>
                            <SheetTitle className="text-xl">
                              МОДЕРН<span className="text-amber-500">.</span>
                            </SheetTitle>
                          </div>
                          <SheetTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <X className="h-5 w-5" />
                              <span className="sr-only">Цэсийг хаах</span>
                            </Button>
                          </SheetTrigger>
                        </div>
                      </SheetHeader>

                      {/* Mobile Search */}
                      <div className="relative mb-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                        <Input
                          placeholder="Бүтээгдэхүүн хайх..."
                          className="pl-10 bg-zinc-50 border-zinc-100"
                          aria-label="Бүтээгдэхүүн хайх"
                        />
                      </div>
                    </div>

                    {/* Mobile menu content with scroll */}
                    <div className="p-4 overflow-auto flex-1">
                      <nav className="flex flex-col">
                        {[
                          { name: "Shop", icon: ShoppingBag },
                          { name: "Collections", icon: ArrowUpRight },
                          { name: "Bestsellers", icon: Star },
                          { name: "About", icon: User },
                          { name: "Contact", icon: ArrowRight },
                        ].map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.name}
                              href={`#${item.name.toLowerCase()}`}
                              className="flex items-center justify-between text-lg font-medium py-4 border-b border-zinc-100 hover:text-amber-600 transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <span>{item.name}</span>
                              <Icon className="h-4 w-4" />
                            </a>
                          );
                        })}
                      </nav>

                      {/* Quick category links */}
                      <div className="my-6">
                        <h4 className="text-xs uppercase tracking-wider text-zinc-500 mb-3">
                          Popular Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {[
                            "Living Room",
                            "Bedroom",
                            "Kitchen",
                            "Office",
                            "Sale",
                          ].map((cat) => (
                            <Badge
                              key={cat}
                              variant="secondary"
                              className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700"
                            >
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Mobile menu footer */}
                    <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-4">
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <Button variant="outline" className="justify-center">
                          <User className="mr-2 h-4 w-4" /> Account
                        </Button>
                        <Button
                          variant="default"
                          className="justify-center bg-amber-500 hover:bg-amber-600"
                        >
                          <ShoppingBag className="mr-2 h-4 w-4" /> Cart (3)
                        </Button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <a href="#" className="hover:underline">
                          Help Center
                        </a>
                        <span>•</span>
                        <a href="#" className="hover:underline">
                          Contact
                        </a>
                        <span>•</span>
                        <a href="#" className="hover:underline">
                          Terms
                        </a>
                        <span>•</span>
                        <a href="#" className="hover:underline">
                          Privacy
                        </a>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Secondary navigation - responsive categories shown on mobile/tablet only */}
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 mt-3 lg:hidden">
            <div className="flex space-x-6 whitespace-nowrap pb-3">
              {[
                "New In",
                "Bestsellers",
                "Living Room",
                "Bedroom",
                "Kitchen",
                "Office",
                "Sale",
              ].map((category) => (
                <a
                  key={category}
                  href={`#${category.toLowerCase().replace(" ", "-")}`}
                  className="text-xs text-zinc-600 hover:text-black transition-colors"
                >
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Announcement bar - optional */}
        {!scrolled && !searchOpen && (
          <motion.div
            className="bg-amber-500 text-white text-xs text-center py-1 hidden sm:block mt-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            ₮50,000-с дээш захиалгад үнэгүй хүргэлт • 30 хоногийн буцаалт • 5 жилийн баталгаа
          </motion.div>
        )}
      </header>

      {/* Adjust top padding to compensate for variable header height */}
      <div className={`pt-24 sm:pt-${searchOpen ? "28" : "32"} lg:pt-32`}></div>

      {/* Redesigned Hero Section - Smaller Height & More Modern */}
      <section className="py-12 md:py-16 relative overflow-hidden">
        {/* Decoration elements */}
        <div className="absolute top-0 right-0 w-1/3 h-48 bg-amber-50/40 blur-3xl rounded-full -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-10 w-24 h-24 bg-zinc-100 rounded-full"></div>
        <div className="absolute top-1/4 left-1/4 w-6 h-6 border-2 border-amber-200 rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-3 h-12 bg-zinc-100 rounded-full"></div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            {/* Left content */}
            <div className="w-full md:w-1/2 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 hover:bg-amber-200 mb-4 px-3 py-1.5">
                  Хязгаарлагдмал Хугацаатай Цуглуулга
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-800">
                    Шинэ
                  </span>
                  <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-amber-400">
                    Орон зайгаа
                  </span>
                </h1>
              </motion.div>

              <motion.p
                className="text-zinc-600 max-w-md text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Өдөр тутмын амьдралыг онцгой туршлага болгон хувиргах, танд хүргэгдэх сонгомол дизайнууд.
              </motion.p>

              <motion.div
                className="flex flex-wrap gap-3 mt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <Button
                  size="lg"
                  className="bg-black hover:bg-zinc-800 text-white rounded-full px-8 shadow-sm"
                >
                  Shop Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 border-zinc-300 hover:border-zinc-800"
                >
                  New Arrivals
                </Button>
              </motion.div>

              <motion.div
                className="flex items-center gap-6 pt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <div className="flex -space-x-3">
                  {[
                    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop",
                  ].map((url, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-white overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt={`Customer ${i + 1}`}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium">4.9</span>
                  <span className="text-xs text-zinc-500">
                    from 2.5k+ reviews
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right content - Product Image */}
            <motion.div
              className="w-full md:w-1/2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                {/* Main product image */}
                <div className="rounded-2xl overflow-hidden aspect-[4/3] md:aspect-[16/10] relative">
                  <Image
                    src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2070&auto=format&fit=crop"
                    alt="Modern furniture collection"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-transparent"></div>
                </div>

                {/* Floating product tag */}
                <div className="absolute -bottom-5 -right-5 md:bottom-5 md:right-5 bg-white shadow-lg rounded-xl p-3 max-w-[160px]">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="font-medium text-sm">Premium Pick</span>
                  </div>
                  <p className="text-xs text-zinc-500">
                    Featured in our summer collection
                  </p>
                </div>

                {/* Price tag */}
                <div className="absolute top-5 left-5 bg-black/80 text-white text-sm font-medium py-1 px-3 rounded-full backdrop-blur-sm">
                  From $149.99
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 container px-4 mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold">Shop by Category</h2>
          <Button variant="ghost" className="text-zinc-600 hover:text-black">
            View all <ArrowUpRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {["Furniture", "Lighting", "Decor", "Kitchenware"].map(
            (category, index) => (
              <Link href={`/category/${category.toLowerCase()}`} key={index}>
                <div className="group relative overflow-hidden rounded-3xl">
                  <div className="aspect-square bg-zinc-100 rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors z-10" />
                    <Image
                      src={
                        [
                          "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1170&auto=format&fit=crop", // Furniture
                          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1170&auto=format&fit=crop", // Lighting
                          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1170&auto=format&fit=crop", // Decor
                          "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=1170&auto=format&fit=crop", // Kitchenware
                        ][index]
                      }
                      alt={category}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-end p-6 z-20">
                    {/* Modern gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    <div className="relative z-10 w-full">
                      <div className="transform group-hover:translate-y-[-8px] transition-transform duration-300">
                        <h3 className="text-xl font-medium text-white drop-shadow-lg">
                          {category}
                        </h3>
                        <div className="flex items-center mt-2">
                          <p className="text-white/90 text-sm drop-shadow-lg">
                            Explore Collection
                          </p>
                          <div className="ml-2 w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transform group-hover:translate-x-1 transition-transform">
                            <ArrowRight className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      </div>

                      {/* Modern indicator bar */}
                      <div className="h-1 w-0 bg-white mt-3 group-hover:w-16 transition-all duration-300 rounded-full" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 bg-gradient-to-b from-zinc-50/70 to-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
            <div className="relative">
              <span className="text-sm font-medium text-amber-600 uppercase tracking-wider mb-2 block">
                Handpicked for you
              </span>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Trending Now
                </h2>
                <div className="hidden md:flex items-center justify-center h-8 w-8 rounded-full bg-amber-100/70">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1 w-12 bg-gradient-to-r from-amber-400 to-amber-200 rounded-full"></div>
                <span className="text-xs text-zinc-500">Updated daily</span>
              </div>
            </div>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <div className="flex justify-end mb-6">
              <TabsList className="bg-white border border-zinc-200 shadow-sm p-1 rounded-full">
                <TabsTrigger
                  value="all"
                  className="rounded-full text-sm px-4 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="new"
                  className="rounded-full text-sm px-4 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  New Arrivals
                </TabsTrigger>
                <TabsTrigger
                  value="sale"
                  className="rounded-full text-sm px-4 data-[state=active]:bg-black data-[state=active]:text-white"
                >
                  On Sale
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <Carousel opts={{ loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-4 md:basis-1/2 lg:basis-1/4"
                    >
                      <div className="group">
                        <div className="relative rounded-2xl overflow-hidden mb-3 bg-zinc-100">
                          <div className="aspect-square">
                            <Image
                              src={
                                [
                                  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1770&auto=format&fit=crop",
                                  "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1587&auto=format&fit=crop",
                                  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop",
                                  "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=1470&auto=format&fit=crop",
                                ][index % 4]
                              }
                              alt={`Product ${index + 1}`}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                            <Button className="w-full bg-black/90 backdrop-blur-sm hover:bg-black rounded-xl">
                              Add to Cart{" "}
                              <ShoppingBag className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                          {index % 3 === 0 && (
                            <Badge className="absolute top-3 left-3 bg-red-500">
                              -20%
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-zinc-700">
                          Ergonomic Chair
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-zinc-900 font-medium">
                              $189.99
                            </span>
                            {index % 3 === 0 && (
                              <span className="text-zinc-400 line-through text-sm">
                                $239.99
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm text-zinc-600 ml-1">
                              4.8
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-8">
                  <CarouselPrevious className="static translate-y-0 mx-2" />
                  <CarouselNext className="static translate-y-0 mx-2" />
                </div>
              </Carousel>
            </TabsContent>

            <TabsContent value="new">
              <Carousel opts={{ loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-4 md:basis-1/2 lg:basis-1/4"
                    >
                      <div className="group">
                        <div className="relative rounded-2xl overflow-hidden mb-3 bg-zinc-100">
                          <div className="aspect-square">
                            <Image
                              src={`/images/product-${(index % 4) + 1}.jpg`}
                              alt={`New Product ${index + 1}`}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                            <Button className="w-full bg-black/90 backdrop-blur-sm hover:bg-black rounded-xl">
                              Add to Cart{" "}
                              <ShoppingBag className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                          <Badge className="absolute top-3 left-3 bg-green-500">
                            New
                          </Badge>
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-zinc-700">
                          Modern Pendant Light
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-zinc-900 font-medium">
                              $149.99
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm text-zinc-600 ml-1">
                              4.9
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-8">
                  <CarouselPrevious className="static translate-y-0 mx-2" />
                  <CarouselNext className="static translate-y-0 mx-2" />
                </div>
              </Carousel>
            </TabsContent>

            <TabsContent value="sale">
              <Carousel opts={{ loop: true }} className="w-full">
                <CarouselContent className="-ml-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-4 md:basis-1/2 lg:basis-1/4"
                    >
                      <div className="group">
                        <div className="relative rounded-2xl overflow-hidden mb-3 bg-zinc-100">
                          <div className="aspect-square">
                            <Image
                              src={`/images/product-${(index % 4) + 1}.jpg`}
                              alt={`Sale Product ${index + 1}`}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                            <Button className="w-full bg-black/90 backdrop-blur-sm hover:bg-black rounded-xl">
                              Add to Cart{" "}
                              <ShoppingBag className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                          <Badge className="absolute top-3 left-3 bg-red-500">
                            -30%
                          </Badge>
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-zinc-700">
                          Designer Coffee Table
                        </h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-zinc-900 font-medium">
                              $219.99
                            </span>
                            <span className="text-zinc-400 line-through text-sm">
                              $319.99
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm text-zinc-600 ml-1">
                              4.7
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-8">
                  <CarouselPrevious className="static translate-y-0 mx-2" />
                  <CarouselNext className="static translate-y-0 mx-2" />
                </div>
              </Carousel>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="py-20 container px-4 mx-auto">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          <Image
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop"
            alt="Scandinavian Collection"
            width={1920}
            height={600}
            className="w-full h-[500px] object-cover object-center"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-xl mx-auto md:ml-16">
              <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm">
                New Collection
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Scandinavian Simplicity
              </h2>
              <p className="text-white/80 mb-8 max-w-md text-lg">
                Clean lines, natural materials, and functional beauty that
                embodies Nordic design philosophy.
              </p>
              <Button
                size="lg"
                className="rounded-full px-8 bg-white text-black hover:bg-white/90"
              >
                Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-zinc-50/50">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-zinc-600">
              Join thousands of satisfied customers who have transformed their
              spaces with our curated collections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-none shadow-sm bg-white">
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {Array(5)
                      .fill(0)
                      .map((_, j) => (
                        <Star
                          key={j}
                          className="h-5 w-5 text-amber-400 fill-amber-400"
                        />
                      ))}
                  </div>
                  <p className="mb-6 text-zinc-600">
                    "The attention to detail and quality of materials exceeded
                    my expectations. The pieces have transformed my living space
                    completely."
                  </p>
                  <div className="flex items-center">
                    <div className="rounded-full overflow-hidden h-12 w-12 mr-4 bg-zinc-200">
                      <Image
                        src={
                          [
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop",
                          ][i - 1]
                        }
                        alt={`Customer ${i}`}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-sm text-zinc-500">Verified Customer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 container px-4 mx-auto">
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" />
          <div className="relative z-10 text-center max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">
              Манай хамт олонд нэгдээрэй
            </h2>
            <p className="text-zinc-300 mb-8">
              Бүртгүүлээд анхны захиалгадаа 10% хөнгөлөлт авахаас гадна онцгой санал, дизайны зөвлөгөө болон барааны нөхөн дүүргэлтийн мэдэгдлийг хүлээн авах боломжтой.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="И-мэйл хаягаа оруулна уу"
                className="h-12 bg-white/10 border-white/20 text-white placeholder:text-zinc-400"
              />
              <Button
                size={"lg"}
                className="bg-white text-black hover:bg-white/90 py-6"
              >
                Бүртгүүлэх
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white mt-12">
        <div className="container px-4 py-12 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold mb-4">MODRN.</h3>
              <p className="text-zinc-600 mb-6 max-w-md">
                Curated home decor and furniture collections that blend modern
                aesthetics with timeless craftsmanship.
              </p>
              <div className="flex gap-4">
                {["facebook", "instagram", "pinterest", "twitter"].map(
                  (social) => (
                    <Link
                      href={`#${social}`}
                      key={social}
                      className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200"
                    >
                      <span className="sr-only">{social}</span>
                      <i className={`icon-${social}`}></i>
                    </Link>
                  )
                )}
              </div>
            </div>

            {["Shop", "Company", "Support"].map((category) => (
              <div key={category}>
                <h3 className="font-medium mb-4">{category}</h3>
                <ul className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i}>
                      <Link
                        href="#"
                        className="text-zinc-600 hover:text-black transition-colors"
                      >
                        {
                          [
                            "New Arrivals",
                            "Best Sellers",
                            "Sale",
                            "Collections",
                            "About Us",
                            "Contact",
                            "FAQ",
                            "Shipping",
                          ][i + (category === "Company" ? 4 : 0)]
                        }
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-zinc-500 text-sm mb-4 md:mb-0">
              © 2023 MODRN. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Terms of Service
              </Link>
              <Link href="#" className="text-zinc-500 text-sm hover:text-black">
                Cookies Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
