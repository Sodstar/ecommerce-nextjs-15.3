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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header({ simplified = false }: { simplified?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Mock cart data (simplified for header component)
  const cartItems = [
    { id: 1, name: "Ergonomic Chair", price: 189.99, quantity: 1 },
    { id: 2, name: "Modern Pendant Light", price: 149.99, quantity: 1 },
  ];

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

          {/* Desktop Navigation - only shown when not simplified */}
          {!simplified && (
            <nav className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
              <ul className="flex space-x-8">
                {["Shop", "Collections", "Bestsellers", "About", "Contact"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`/home2#${item.toLowerCase()}`}
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
          )}

          {/* Action Buttons - reduced set for simplified version */}
          <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
            {!simplified && (
              <>
                {/* Search Button */}
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

                {/* Cart Button */}
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
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-full sm:max-w-md p-0">
                    <div className="p-6">
                      <SheetHeader>
                        <SheetTitle>Your Cart</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <p>Cart items would appear here</p>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}

            {/* Account/User Button with dropdown */}
            {!simplified ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-zinc-100 hidden md:flex"
                  >
                    <User className="h-[18px] w-[18px]" />
                    <span className="sr-only">Account</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      <span>Orders</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <ArrowRight className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="font-medium rounded-full"
                >
                  <Link href="/home2/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  asChild
                  className="bg-black hover:bg-zinc-800 rounded-full"
                >
                  <Link href="/home2/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button - only when not simplified */}
            {!simplified && (
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full lg:hidden hover:bg-zinc-100"
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
                <SheetContent side="right" className="lg:hidden">
                  <SheetHeader>
                    <SheetTitle>Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6">
                    <ul className="space-y-4">
                      {["Shop", "Collections", "Bestsellers", "About", "Contact"].map(
                        (item) => (
                          <li key={item}>
                            <a
                              href={`/home2#${item.toLowerCase()}`}
                              className="block py-2 text-lg"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {item}
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </nav>
                </SheetContent>
              </Sheet>
            )}
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

      {/* Announcement bar */}
      {!simplified && !scrolled && !searchOpen && (
        <motion.div
          className="bg-amber-500 text-white text-xs text-center py-1 hidden sm:block mt-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Free shipping on orders over $50 • 30-day returns • 5-year warranty
        </motion.div>
      )}
    </header>
  );
}
