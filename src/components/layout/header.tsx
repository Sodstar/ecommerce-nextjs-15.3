"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  LogInIcon, 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X,
  LogOut, 
  Package, 
  UserCircle,
  ChevronRight
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { toast } from "sonner";

function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <img src="/logo.jpg" className="w-18" />
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-10">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Ухаалаг хайлт хийх..."
                className="pl-10 pr-8 py-2 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/categories"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods") ? " text-orange-500 font-medium" : "font-medium"
              }`}
            >
              Судалгааны аргууд
            </Link>
            <Link
              href="/categories"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods") ? " text-orange-500 font-medium" : "font-medium"
              }`}
            >
              Мэргэжлийн номууд
            </Link>
            <Link
              href="/bestsellers"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods") ? " text-orange-500 font-medium" : "font-medium"
              }`}
            >
              Нийтлэл
            </Link>
            <Link
              href="/bestsellers"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods") ? " text-orange-500 font-medium" : "font-medium"
              }`}
            >
              Подкаст
            </Link>
            <Link
              href="/sellers"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods") ? " text-orange-500 font-medium" : "font-medium"
              }`}
            >
              Цаг захиалах
            </Link>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="relative cursor-pointer"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative cursor-pointer"
                  >
                    <User className="h-5 w-5 text-gray-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Хэрэглэгчийн профайл</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>Захиалгын түүх</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600"
                    onClick={() => {
                      toast.success("Гарах үйлдэл амжилттай боллоо");
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Гарах</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center space-x-2 ">
              <button className="gradientButton hover:before:blur relative rounded-[4px]">
                <div className="flex items-center w-full px-4 py-1.5 z-20 bg-white rounded-[4px] font-semibold cursor-pointer">
                  <LogInIcon className="h-5 w-5 mr-2" /> Нэвтрэх
                </div>
              </button>
            </div>
          </nav>

          {/* Mobile Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5 text-gray-600" />
            </Button>
            
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative"
              >
                <ShoppingCart className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            
            {/* Mobile Menu with Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden" 
                  id="mobile-menu-button"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[85%] sm:w-[385px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex justify-between items-center">
                    <div>Цэс</div>
                    <SheetClose className="rounded-full hover:bg-gray-100 p-1">
                      <X className="h-5 w-5" />
                    </SheetClose>
                  </SheetTitle>
                </SheetHeader>
                
                <div className="overflow-y-auto h-[calc(100vh-10rem)]">
                  {/* Mobile Navigation Links */}
                  <div className="py-2">
                    <div className="px-4 py-3">
                      <div className="relative w-full">
                        <Input
                          type="text"
                          placeholder="Хайлт хийх..."
                          className="pl-10 pr-4 py-2 w-full"
                        />
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    
                    <nav className="space-y-1">
                      <Link href="/categories" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                        <div className="font-medium">Судалгааны аргууд</div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      <Link href="/categories" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                        <div className="font-medium">Мэргэжлийн номууд</div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      <Link href="/blog" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                        <div className="font-medium">Нийтлэл</div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      <Link href="/podcast" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                        <div className="font-medium">Подкаст</div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                      <Link href="/appointment" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                        <div className="font-medium">Цаг захиалах</div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </Link>
                    </nav>
                    
                    <Separator className="my-2" />
                    
                    <div className="space-y-1">
                      <Link href="/account" className="flex items-center px-4 py-3 hover:bg-gray-50">
                        <UserCircle className="mr-3 h-5 w-5 text-gray-500" />
                        <div className="font-medium">Хэрэглэгчийн профайл</div>
                      </Link>
                      <Link href="/order/downloads" className="flex items-center px-4 py-3 hover:bg-gray-50">
                        <Package className="mr-3 h-5 w-5 text-gray-500" />
                        <div className="font-medium">Захиалгын түүх</div>
                      </Link>
                    </div>
                  </div>
                </div>
                
                <SheetFooter className="px-4 py-4 border-t mt-auto">
                  <Button className="bg-white w-full gradientButton hover:before:blur relative rounded-[4px]  hover:bg-white">
                    <div className="flex items-center justify-center w-full px-4 py-1.5 z-20  rounded-[4px] font-semibold cursor-pointer text-black bg-white">
                      <LogInIcon className="h-5 w-5 mr-2 text-black" /> Нэвтрэх
                    </div>
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Mobile Search - Expandable */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t mt-4 animate-in slide-in-from-top">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Ухаалаг хайлт хийх..."
                className="pl-10 pr-8 py-2 w-full"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={() => setIsSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;