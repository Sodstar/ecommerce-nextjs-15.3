"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  LayoutGrid,
  List,
  Search,
  ShoppingBag,
  Sliders,
  SlidersHorizontal,
  SortAsc,
  Star,
  User,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Import shared header component
import Header from "../components/header";

// Sample product data
const products = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  name: [
    "Эргономик Сандал",
    "Орчин үеийн Гэрлийн Чимэглэл",
    "Дизайнерийн Кофены Ширээ",
    "Энгийн Номын Тавиур",
    "Дугуй Хоолны Ширээ",
    "Хөвөн Диван",
    "Модон Шөнийн Ширээ",
    "Шавар Ваар",
    "Ханын Толь",
    "Шалны Гэрэл",
  ][i % 10],
  price: Math.floor(Math.random() * 300) + 49.99,
  originalPrice: Math.random() > 0.6 ? Math.floor(Math.random() * 400) + 99.99 : null,
  image: [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1770&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=1470&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop",
  ][i % 5],
  colors: ["Хар", "Байгалийн", "Саарал", "Цагаан"].slice(0, Math.floor(Math.random() * 3) + 1),
  rating: (Math.random() * 1 + 4).toFixed(1),
  reviewCount: Math.floor(Math.random() * 500) + 10,
  inStock: Math.random() > 0.2,
  isNew: Math.random() > 0.8,
  category: ["Тавилга", "Гэрэлтүүлэг", "Гоёл чимэглэл", "Гал тогооны хэрэгсэл"][Math.floor(Math.random() * 4)],
  freeShipping: Math.random() > 0.5,
}));

// Filter categories data
const filterCategories = [
  {
    name: "Ангилал",
    options: [
      { label: "Тавилга", count: 124 },
      { label: "Гэрэлтүүлэг", count: 86 },
      { label: "Гоёл чимэглэл", count: 75 },
      { label: "Гал тогооны хэрэгсэл", count: 53 },
      { label: "Даавуун эдлэл", count: 41 },
    ],
  },
  {
    name: "Өнгө",
    options: [
      { label: "Хар", count: 84, color: "#000000" },
      { label: "Цагаан", count: 76, color: "#FFFFFF" },
      { label: "Саарал", count: 68, color: "#888888" },
      { label: "Байгалийн", count: 58, color: "#D4B996" },
      { label: "Цэнхэр", count: 42, color: "#1E3A8A" },
      { label: "Ногоон", count: 36, color: "#166534" },
    ],
  },
  {
    name: "Материал",
    options: [
      { label: "Мод", count: 96 },
      { label: "Метал", count: 82 },
      { label: "Шил", count: 63 },
      { label: "Даавуу", count: 48 },
      { label: "Шавар", count: 35 },
    ],
  },
  {
    name: "Үнэ",
    type: "range",
    min: 0,
    max: 1000,
  },
  {
    name: "Үнэлгээ",
    type: "rating",
    options: [
      { label: "4 ба дээш", value: 4 },
      { label: "3 ба дээш", value: 3 },
      { label: "2 ба дээш", value: 2 },
      { label: "1 ба дээш", value: 1 },
    ],
  },
  {
    name: "Онцлог",
    options: [
      { label: "Хямдралтай", count: 47 },
      { label: "Шинэ ирсэн", count: 36 },
      { label: "Үнэгүй хүргэлт", count: 89 },
      { label: "Байгальд ээлтэй", count: 42 },
      { label: "Монголд үйлдвэрлэсэн", count: 28 },
    ],
  },
];

export default function ProductListPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Add filter function
  const toggleFilter = (filterName: string) => {
    setActiveFilters(prev => 
      prev.includes(filterName) 
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters([]);
    setPriceRange([0, 1000]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      {/* Use the shared Header component */}
      <Header />

      <div className="pt-24 lg:pt-28">
        {/* Breadcrumb and page title */}
        <div className="container mx-auto px-4 py-6 lg:py-10">
          <div className="flex flex-col gap-2">
            <nav className="flex items-center text-sm text-zinc-500">
              <Link href="/home2" className="hover:text-black transition-colors">
                Нүүр
              </Link>
              <ChevronRight className="h-3.5 w-3.5 mx-2" />
              <span className="font-medium text-black">Бүх Бүтээгдэхүүн</span>
            </nav>
            
            <div className="flex justify-between items-center">
              <h1 className="text-2xl md:text-3xl font-bold">Бүх Бүтээгдэхүүн</h1>
              <p className="text-zinc-500 text-sm">{products.length} илэрц</p>
            </div>
          </div>
        </div>
        
        {/* Filter bar for mobile */}
        <div className="sticky top-16 z-40 bg-white border-y border-zinc-200 py-3 lg:hidden">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 border-zinc-200 hover:bg-zinc-50"
                    onClick={() => setMobileFiltersOpen(true)}
                  >
                    <Sliders className="h-4 w-4" />
                    <span>Шүүлтүүр</span>
                    {activeFilters.length > 0 && (
                      <Badge className="ml-1 bg-black text-white hover:bg-zinc-800">
                        {activeFilters.length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                
                <SheetContent side="left" className="w-full max-w-md p-0">
                  <div className="flex flex-col h-full">
                    <SheetHeader className="sticky top-0 z-10 bg-white border-b border-zinc-100 p-4">
                      <div className="flex justify-between items-center">
                        <SheetTitle>Шүүлтүүр</SheetTitle>
                        <SheetTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={() => setMobileFiltersOpen(false)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </SheetTrigger>
                      </div>
                      {activeFilters.length > 0 && (
                        <div className="pt-2">
                          <Button 
                            variant="link" 
                            className="text-zinc-500 p-0 h-auto" 
                            onClick={clearAllFilters}
                          >
                            Бүх шүүлтүүрийг цэвэрлэх
                          </Button>
                        </div>
                      )}
                    </SheetHeader>
                    
                    <div className="flex-1 overflow-auto">
                      {/* Mobile filter content */}
                      <div className="divide-y divide-zinc-100">
                        {filterCategories.map((category, i) => (
                          <div key={i} className="p-4">
                            <Accordion type="single" collapsible defaultValue={i === 0 ? category.name : undefined}>
                              <AccordionItem value={category.name} className="border-none">
                                <AccordionTrigger className="py-2 hover:no-underline">
                                  <span className="font-medium">{category.name}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                  {category.type === "range" ? (
                                    <div className="py-4">
                                      <Slider
                                        defaultValue={[0, 1000]}
                                        min={category.min}
                                        max={category.max}
                                        step={10}
                                        value={priceRange}
                                        onValueChange={(value) => setPriceRange(value as [number, number])}
                                        className="my-6"
                                      />
                                      <div className="flex items-center justify-between">
                                        <div className="border rounded-md p-2 w-24 text-center">
                                          ₮{priceRange[0]}
                                        </div>
                                        <span className="text-zinc-400">-с</span>
                                        <div className="border rounded-md p-2 w-24 text-center">
                                          ₮{priceRange[1]}
                                        </div>
                                      </div>
                                    </div>
                                  ) : category.type === "rating" ? (
                                    <div className="space-y-4 pt-2">
                                      {category.options?.map((option, j) => (
                                        <div key={j} className="flex gap-2 items-center">
                                          <Checkbox 
                                            id={`${category.name}-${option.label}`}
                                            checked={activeFilters.includes(option.label)}
                                            onCheckedChange={() => toggleFilter(option.label)}
                                          />
                                          <label 
                                            htmlFor={`${category.name}-${option.label}`}
                                            className="flex items-center cursor-pointer"
                                          >
                                            <div className="flex">
                                              {Array.from({ length: 5 }).map((_, starIndex) => (
                                                <Star 
                                                  key={starIndex}
                                                  className={`h-4 w-4 ${starIndex < option.value ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`}
                                                />
                                              ))}
                                            </div>
                                            <span className="ml-2">{option.label}</span>
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="space-y-2 pt-2">
                                      {category.options?.map((option, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                          <Checkbox 
                                            id={`${category.name}-${option.label}`}
                                            checked={activeFilters.includes(option.label)}
                                            onCheckedChange={() => toggleFilter(option.label)}
                                          />
                                          <label 
                                            htmlFor={`${category.name}-${option.label}`}
                                            className="flex items-center justify-between w-full cursor-pointer"
                                          >
                                            <div className="flex items-center gap-2">
                                              {'color' in option && (
                                                <span 
                                                  className="block w-4 h-4 rounded-full border"
                                                  style={{ backgroundColor: option.color }}
                                                />
                                              )}
                                              <span>{option.label}</span>
                                            </div>
                                            {"count" in option && (
                                              <span className="text-zinc-400 text-sm">({option.count})</span>
                                            )}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="sticky bottom-0 bg-white border-t border-zinc-100 p-4">
                      <Button 
                        className="w-full rounded-full bg-black hover:bg-zinc-800" 
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        Үр дүнг үзэх ({products.length})
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              
              <div className="flex items-center gap-3">
                <Select defaultValue={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-auto border-zinc-200 hover:bg-zinc-50">
                    <div className="flex items-center gap-2">
                      <SortAsc className="h-4 w-4" />
                      <SelectValue placeholder="Эрэмбэлэх" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Онцлох</SelectItem>
                    <SelectItem value="price-low">Үнэ: Доогуураас дээш</SelectItem>
                    <SelectItem value="price-high">Үнэ: Дээгүүрээс доош</SelectItem>
                    <SelectItem value="newest">Шинээр нэмэгдсэн</SelectItem>
                    <SelectItem value="rating">Өндөр үнэлгээтэй</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="border rounded-md flex overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none h-9 w-9 ${viewMode === "grid" ? "bg-zinc-100" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">Хүснэгт харагдац</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none h-9 w-9 ${viewMode === "list" ? "bg-zinc-100" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">Жагсаалт харагдац</span>
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Active filters display */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {activeFilters.map((filter) => (
                  <Badge
                    key={filter}
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 pl-2 pr-1.5 py-1.5 rounded-md flex items-center gap-1"
                  >
                    {filter}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full hover:bg-zinc-300"
                      onClick={() => toggleFilter(filter)}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="link"
                  className="text-zinc-500 p-0 h-auto text-xs"
                  onClick={clearAllFilters}
                >
                  Бүгдийг цэвэрлэх
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Main content with filters and products */}
        <div className="container mx-auto px-4 pb-20">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop filters sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-2">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-semibold text-lg">Шүүлтүүр</h2>
                  {activeFilters.length > 0 && (
                    <Button
                      variant="link"
                      className="text-zinc-500 p-0 h-auto text-sm"
                      onClick={clearAllFilters}
                    >
                      Бүгдийг цэвэрлэх
                    </Button>
                  )}
                </div>
                
                {/* Desktop filter accordions */}
                <div className="space-y-4">
                  {filterCategories.map((category, i) => (
                    <Accordion
                      key={i}
                      type="single"
                      collapsible
                      defaultValue={i < 3 ? category.name : undefined}
                      className="border border-zinc-200 rounded-lg overflow-hidden"
                    >
                      <AccordionItem value={category.name} className="border-0">
                        <AccordionTrigger className="px-4 py-3 hover:no-underline bg-zinc-50/50 text-sm font-medium">
                          {category.name}
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pt-2 pb-3">
                          {category.type === "range" ? (
                            <div className="py-2">
                              <Slider
                                defaultValue={[0, 1000]}
                                min={category.min}
                                max={category.max}
                                step={10}
                                value={priceRange}
                                onValueChange={(value) => setPriceRange(value as [number, number])}
                                className="my-6"
                              />
                              <div className="flex items-center justify-between">
                                <div className="border rounded-md p-2 w-20 text-center text-sm">
                                  ₮{priceRange[0]}
                                </div>
                                <span className="text-zinc-400">-с</span>
                                <div className="border rounded-md p-2 w-20 text-center text-sm">
                                  ₮{priceRange[1]}
                                </div>
                              </div>
                            </div>
                          ) : category.type === "rating" ? (
                            <div className="space-y-3">
                              {category.options?.map((option, j) => (
                                <div key={j} className="flex gap-2 items-center">
                                  <Checkbox 
                                    id={`desktop-${category.name}-${option.label}`}
                                    checked={activeFilters.includes(option.label)}
                                    onCheckedChange={() => toggleFilter(option.label)}
                                  />
                                  <label 
                                    htmlFor={`desktop-${category.name}-${option.label}`}
                                    className="flex items-center cursor-pointer text-sm"
                                  >
                                    <div className="flex">
                                      {Array.from({ length: 5 }).map((_, starIndex) => (
                                        <Star 
                                          key={starIndex}
                                          className={`h-3.5 w-3.5 ${starIndex < option.value ? 'text-amber-400 fill-amber-400' : 'text-zinc-200'}`}
                                        />
                                      ))}
                                    </div>
                                    <span className="ml-2">{option.label}</span>
                                  </label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {category.options?.map((option, j) => (
                                <div key={j} className="flex items-center gap-2">
                                  <Checkbox 
                                    id={`desktop-${category.name}-${option.label}`}
                                    checked={activeFilters.includes(option.label)}
                                    onCheckedChange={() => toggleFilter(option.label)}
                                  />
                                  <label 
                                    htmlFor={`desktop-${category.name}-${option.label}`}
                                    className="flex items-center justify-between w-full cursor-pointer text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      {'color' in option && (
                                        <span 
                                          className="block w-3.5 h-3.5 rounded-full border border-zinc-200"
                                          style={{ backgroundColor: option.color }}
                                        />
                                      )}
                                      <span>{option.label}</span>
                                    </div>
                                    {"count" in option && (
                                      <span className="text-zinc-400 text-xs">({option.count})</span>
                                    )}
                                  </label>
                                </div>
                              ))}
                            </div>
                          )}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Products grid */}
            <div className="flex-1">
              {/* Desktop sort options & view toggle */}
              <div className="hidden lg:flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-500 text-sm">Эрэмбэлэх:</span>
                  <Select defaultValue={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-36 border-zinc-200 hover:bg-zinc-50 h-9">
                      <SelectValue placeholder="Эрэмбэлэх" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Онцлох</SelectItem>
                      <SelectItem value="price-low">Үнэ: Доогуураас дээш</SelectItem>
                      <SelectItem value="price-high">Үнэ: Дээгүүрээс доош</SelectItem>
                      <SelectItem value="newest">Шинээр нэмэгдсэн</SelectItem>
                      <SelectItem value="rating">Өндөр үнэлгээтэй</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="border rounded-md flex overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none h-9 w-9 ${viewMode === "grid" ? "bg-zinc-100" : ""}`}
                    onClick={() => setViewMode("grid")}
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">Хүснэгт харагдац</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-none h-9 w-9 ${viewMode === "list" ? "bg-zinc-100" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                    <span className="sr-only">Жагсаалт харагдац</span>
                  </Button>
                </div>
              </div>
              
              {/* Active filters for desktop */}
              {activeFilters.length > 0 && (
                <div className="hidden lg:flex flex-wrap gap-2 mb-6">
                  {activeFilters.map((filter) => (
                    <Badge
                      key={filter}
                      variant="secondary"
                      className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 pl-3 pr-2 py-1.5 rounded-md flex items-center gap-1"
                    >
                      {filter}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full hover:bg-zinc-300"
                        onClick={() => toggleFilter(filter)}
                      >
                        <X className="h-2.5 w-2.5" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Grid view for products */}
              {viewMode === "grid" ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35 }}
                      className="group"
                    >
                      <Link href={`/product/${product.id}`} className="block">
                        <div className="relative rounded-2xl overflow-hidden mb-3 bg-zinc-100">
                          <div className="aspect-square">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute top-3 right-3 z-10">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white h-8 w-8"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                            <Button className="w-full bg-black/90 backdrop-blur-sm hover:bg-black rounded-xl">
                              Сагсанд нэмэх{" "}
                              <ShoppingBag className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Status badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {product.originalPrice && (
                              <Badge className="bg-red-500">
                                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                              </Badge>
                            )}
                            {product.isNew && (
                              <Badge className="bg-green-500">Шинэ</Badge>
                            )}
                            {!product.inStock && (
                              <Badge variant="outline" className="bg-white/80 backdrop-blur-sm">
                                Үлдэгдэл бага
                              </Badge>
                            )}
                          </div>
                        </div>
                        <h3 className="font-medium mb-1 group-hover:text-zinc-700">{product.name}</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-zinc-900 font-semibold">
                              ₮{product.price.toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="text-zinc-400 line-through text-sm">
                                ₮{product.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm text-zinc-600 ml-1">{product.rating}</span>
                          </div>
                        </div>
                        {product.colors.length > 0 && (
                          <div className="mt-2 flex items-center gap-1">
                            {product.colors.map((color, i) => (
                              <div key={i} className="flex gap-1 items-center">
                                {i > 0 && <span className="text-zinc-300 text-xs">•</span>}
                                <span className="text-zinc-500 text-xs">{color}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* List view for products */
                <div className="space-y-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.35 }}
                      className="group border border-zinc-200 rounded-xl p-4 hover:border-zinc-300 hover:shadow-sm transition-all"
                    >
                      <Link href={`/product/${product.id}`} className="flex gap-4 md:gap-6">
                        <div className="relative rounded-lg overflow-hidden bg-zinc-100 h-24 w-24 md:h-36 md:w-36 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover object-center"
                          />
                          
                          {/* Status badges */}
                          <div className="absolute top-2 left-2">
                            {product.originalPrice && (
                              <Badge className="bg-red-500 text-xs">
                                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg mb-1 group-hover:text-zinc-700">{product.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center">
                                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                                  <span className="text-sm text-zinc-600 ml-1">{product.rating}</span>
                                </div>
                                <span className="text-zinc-300">•</span>
                                <span className="text-sm text-zinc-500">{product.reviewCount} сэтгэгдэл</span>
                                <span className="text-zinc-300">•</span>
                                <span className="text-sm text-zinc-500">{product.category}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="rounded-full hover:bg-zinc-100 h-8 w-8"
                              >
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="space-x-1">
                              <span className="text-lg font-semibold">
                                ₮{product.price.toFixed(2)}
                              </span>
                              {product.originalPrice && (
                                <span className="text-zinc-400 line-through text-sm">
                                  ₮{product.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {product.freeShipping && (
                              <Badge variant="outline" className="text-green-600 bg-green-50 border-green-100 text-xs">
                                Үнэгүй хүргэлт
                              </Badge>
                            )}
                            {product.isNew && (
                              <Badge className="bg-green-500 text-xs">Шинэ</Badge>
                            )}
                            {!product.inStock && (
                              <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 text-xs">
                                Үлдэгдэл бага
                              </Badge>
                            )}
                          </div>
                          
                          {product.colors.length > 0 && (
                            <div className="mt-3 flex items-center gap-3">
                              <span className="text-sm text-zinc-500">Өнгө:</span>
                              <div className="flex items-center gap-2">
                                {product.colors.map((color, i) => (
                                  <span key={i} className="text-xs px-2 py-1 bg-zinc-100 rounded-md">{color}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="md:absolute md:bottom-4 md:right-4 mt-4 md:mt-0">
                            <Button className="bg-black hover:bg-zinc-800 rounded-full">
                              Сагсанд нэмэх
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
              
              {/* Pagination */}
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="rounded-full w-9 h-9 border-zinc-200">
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Өмнөх хуудас</span>
                  </Button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <Button
                      key={page}
                      variant={page === 1 ? "default" : "outline"}
                      className={`rounded-full w-9 h-9 ${page === 1 ? "bg-black hover:bg-zinc-800" : "border-zinc-200"}`}
                    >
                      {page}
                    </Button>
                  ))}
                  <Button variant="outline" size="icon" className="rounded-full w-9 h-9 border-zinc-200">
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Дараагийн хуудас</span>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Simple footer */}
      <footer className="border-t border-zinc-200 bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <Link href="/home2" className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 rounded-lg bg-black flex items-center justify-center">
                <span className="text-white font-bold text-xs">М</span>
              </div>
              <h3 className="text-sm font-bold tracking-tight">
                МОДЕРН<span className="text-amber-500">.</span>
              </h3>
            </Link>
            <p className="text-zinc-500 text-sm">
              © 2023 МОДЕРН. Бүх эрх хамгаалагдсан.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
