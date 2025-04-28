"use client";

import Link from "next/link";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Heart, LogInIcon, Search, ShoppingCart, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Package, UserCircle } from "lucide-react";
import { toast } from "sonner"

function Header() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
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
                isActive("/goods")
                  ? " text-orange-500 font-medium"
                  : "font-medium"
              }`}
            >
              Судалгааны аргууд
            </Link>
            <Link
              href="/categories"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods")
                  ? " text-orange-500 font-medium"
                  : "font-medium"
              }`}
            >
              Бараа бүтээгдэхүүн
            </Link>
            <Link
              href="/bestsellers"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods")
                  ? " text-orange-500 font-medium"
                  : "font-medium"
              }`}
            >
              Нийтлэл
            </Link>
            <Link
              href="/bestsellers"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods")
                  ? " text-orange-500 font-medium"
                  : "font-medium"
              }`}
            >
              Подкаст
            </Link>
            <Link
              href="/sellers"
              className={`text-gray-600 hover:text-orange-500 font-medium" ${
                isActive("/goods")
                  ? " text-orange-500 font-medium"
                  : "font-medium"
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
                  <DropdownMenuItem className="cursor-pointer text-red-600" onClick={() => {
                    toast.success("Гарах үйлдэл амжилттай боллоо");
                  }}>
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

          {/* Mobile menu button - would be expanded in a full implementation */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
