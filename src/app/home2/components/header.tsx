"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  Heart,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Add user data
  const userData = {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    membership: "Premium Member",
  };
  
  // Track page scroll for header styling
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
            <Link href="/home2" className="group flex items-center gap-2">
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
                      placeholder="Search products..."
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
                        <div>Профайл</div>
                        <div className="text-xs text-zinc-400">
                          Профайлын дэлгэрэнгүй мэдээллийг удирдах
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer rounded-lg py-2 px-3 focus:bg-zinc-50 hover:bg-zinc-50">
                      <ShoppingBag className="mr-3 h-4 w-4 text-zinc-500" />
                      <div>
                        <div>Захиалгууд</div>
                        <div className="text-xs text-zinc-400">
                          Захиалгын түүхийг харах
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

            {/* Cart with improved count badge and sheet */}
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
                    3
                  </span>
                  <span className="sr-only">Сагс</span>
                  <span className="absolute -bottom-10 right-0 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    Сагс ($459.97)
                  </span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-md p-0">
                <div className="flex flex-col h-full">
                  {/* Cart header */}
                  <div className="sticky top-0 bg-white z-10 p-4 border-b border-zinc-100">
                    <SheetHeader>
                      <div className="flex justify-between items-center">
                        <SheetTitle className="text-xl flex items-center gap-2">
                          <ShoppingBag className="h-5 w-5" /> Таны сагс
                          <Badge variant="secondary" className="ml-2">3 бараа</Badge>
                        </SheetTitle>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => setCartOpen(false)}
                          >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close cart</span>
                          </Button>
                        </SheetTrigger>
                      </div>
                    </SheetHeader>
                  </div>
                  
                  {/* Cart content placeholder */}
                  <div className="p-4">
                    <p className="text-center text-zinc-500">Cart items would be displayed here</p>
                  </div>
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
              <SheetContent side="right" className="w-full sm:max-w-sm p-0 overflow-auto">
                <div className="flex flex-col h-full">
                  {/* Mobile menu header with search */}
                  <div className="sticky top-0 bg-white z-10 p-4 border-b border-zinc-100">
                    <SheetHeader className="mb-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-black flex items-center justify-center">
                            <span className="text-white font-bold text-xs">M</span>
                          </div>
                          <SheetTitle className="text-xl">
                            MODRN<span className="text-amber-500">.</span>
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
                            <span className="sr-only">Close menu</span>
                          </Button>
                        </SheetTrigger>
                      </div>
                    </SheetHeader>

                    {/* Mobile Search */}
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                      <Input
                        placeholder="Search products..."
                        className="pl-10 bg-zinc-50 border-zinc-100"
                        aria-label="Search products"
                      />
                    </div>
                  </div>
                  
                  {/* Mobile menu content placeholder */}
                  <div className="p-4">
                    <nav className="flex flex-col">
                      {[
                        { name: "Shop", icon: ShoppingBag },
                        { name: "Collections", icon: ArrowRight },
                        { name: "Bestsellers", icon: Heart },
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
    </header>
  );
}
