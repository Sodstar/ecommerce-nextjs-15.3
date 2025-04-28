// File: app/products/page.tsx
"use client";

import Link from "next/link";
import {
  Search,
  ChevronDown,
  X,
  Grid2x2,
  LayoutList,
  SlidersHorizontal,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

// Define types
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  author: string;
  sales: number;
  rating: number;
  dateAdded: string;
  tags: string[];
}

interface Category {
  id: string;
  name: string;
  count: number;
}

// Mock data for products
const products: Product[] = [
  {
    id: "1",
    title: "Premium UI Kit",
    description:
      "A comprehensive UI kit with 300+ components for modern web applications",
    price: 49.99,
    category: "UI Kits",
    image: "/api/placeholder/600/400",
    author: "DesignLab",
    sales: 1240,
    rating: 4.8,
    dateAdded: "2025-01-15",
    tags: ["ui", "design", "web"],
  },
  {
    id: "2",
    title: "eCommerce Template",
    description:
      "Complete Next.js template for online stores with shopping cart functionality",
    price: 79.99,
    category: "Templates",
    image: "/api/placeholder/600/400",
    author: "WebCrafters",
    sales: 856,
    rating: 4.9,
    dateAdded: "2025-02-03",
    tags: ["ecommerce", "nextjs", "template"],
  },
  {
    id: "3",
    title: "Icon Pack Pro",
    description: "1000+ vector icons in multiple styles and formats",
    price: 29.99,
    category: "Icons",
    image: "/api/placeholder/600/400",
    author: "IconWorks",
    sales: 2150,
    rating: 4.7,
    dateAdded: "2025-01-20",
    tags: ["icons", "vector", "design"],
  },
  {
    id: "4",
    title: "Digital Marketing Toolkit",
    description:
      "Social media templates, ad designs, and email templates for marketers",
    price: 59.99,
    category: "Marketing",
    image: "/api/placeholder/600/400",
    author: "GrowthGurus",
    sales: 785,
    rating: 4.6,
    dateAdded: "2025-03-10",
    tags: ["marketing", "social", "templates"],
  },
  {
    id: "5",
    title: "Photography Preset Collection",
    description:
      "Professional Lightroom presets for portrait and landscape photography",
    price: 39.99,
    category: "Photography",
    image: "/api/placeholder/600/400",
    author: "LensLegends",
    sales: 1560,
    rating: 4.8,
    dateAdded: "2025-02-15",
    tags: ["photography", "presets", "lightroom"],
  },
  {
    id: "6",
    title: "Font Bundle",
    description:
      "25 premium fonts for branding, web design, and print projects",
    price: 69.99,
    category: "Fonts",
    image: "/api/placeholder/600/400",
    author: "TypeFoundry",
    sales: 920,
    rating: 4.7,
    dateAdded: "2025-01-05",
    tags: ["fonts", "typography", "design"],
  },
  {
    id: "7",
    title: "Admin Dashboard Template",
    description:
      "Responsive admin dashboard template with charts, tables, and UI components",
    price: 89.99,
    category: "Templates",
    image: "/api/placeholder/600/400",
    author: "DevTeam",
    sales: 645,
    rating: 4.5,
    dateAdded: "2025-03-01",
    tags: ["admin", "dashboard", "template"],
  },
  {
    id: "8",
    title: "3D Character Models",
    description:
      "Set of 10 low-poly 3D character models for games and animations",
    price: 49.99,
    category: "3D Assets",
    image: "/api/placeholder/600/400",
    author: "3DStudio",
    sales: 512,
    rating: 4.6,
    dateAdded: "2025-02-20",
    tags: ["3d", "models", "characters"],
  },
  {
    id: "9",
    title: "Social Media Graphics Kit",
    description:
      "Templates for Instagram, Facebook, and Twitter posts and stories",
    price: 34.99,
    category: "Graphics",
    image: "/api/placeholder/600/400",
    author: "SocialStudio",
    sales: 1120,
    rating: 4.4,
    dateAdded: "2025-01-25",
    tags: ["social media", "graphics", "templates"],
  },
  {
    id: "10",
    title: "Corporate Presentation Templates",
    description:
      "Professional PowerPoint and Keynote templates for business presentations",
    price: 24.99,
    category: "Templates",
    image: "/api/placeholder/600/400",
    author: "PresentPro",
    sales: 890,
    rating: 4.5,
    dateAdded: "2025-03-15",
    tags: ["presentation", "business", "templates"],
  },
  {
    id: "11",
    title: "UX/UI Wireframe Kit",
    description:
      "Comprehensive wireframe components for web and mobile app design",
    price: 39.99,
    category: "UI Kits",
    image: "/api/placeholder/600/400",
    author: "UXPro",
    sales: 760,
    rating: 4.8,
    dateAdded: "2025-02-10",
    tags: ["wireframe", "ux", "ui"],
  },
  {
    id: "12",
    title: "Stock Photo Bundle",
    description: "200 high-resolution stock photos for commercial use",
    price: 59.99,
    category: "Photos",
    image: "/api/placeholder/600/400",
    author: "PhotoStudio",
    sales: 1350,
    rating: 4.7,
    dateAdded: "2025-01-10",
    tags: ["photos", "stock", "commercial"],
  },
];

// Mock data for categories
const categories: Category[] = [
  { id: "1", name: "UI Kits", count: 24 },
  { id: "2", name: "Templates", count: 56 },
  { id: "3", name: "Icons", count: 38 },
  { id: "4", name: "Fonts", count: 29 },
  { id: "5", name: "Graphics", count: 47 },
  { id: "6", name: "Photos", count: 83 },
  { id: "7", name: "Marketing", count: 19 },
  { id: "8", name: "3D Assets", count: 31 },
  { id: "9", name: "Photography", count: 25 },
];

export default function ProductsPage() {
  const [range, setRange] = useState<[number, number]>([0, 100]);

  const handleMinChange = (e: any) => {
    const newMin = parseInt(e.target.value) || 0;
    setRange([newMin, range[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value) || 0;
    setRange([range[0], newMax]);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold">Digital Products</h1>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <Link href="/" className="hover:text-blue-600">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>Products</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="lg:flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-lg mb-4">Filters</h2>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  <RadioGroup defaultValue={`category-${categories[0].id}`}>
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <RadioGroupItem
                          value={`category-${category.id}`}
                          id={`category-${category.id}`}
                        />
                        <span className="text-xs text-gray-500 ml-2">
                          ({category.name})
                        </span>
                        <Label
                          htmlFor={`category-${category.id}`}
                          className="ml-2 flex-1 text-sm cursor-pointer"
                        ></Label>
                        <span className="text-xs text-gray-500">
                          ({category.count})
                        </span>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-4">
                  <Slider
                    value={range}
                    onValueChange={(value) => setRange([value[0], value[1]])}
                    min={0}
                    max={1000}
                    step={10}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-xs mr-1">$</span>
                      <Input
                        type="number"
                        value={range[0]}
                        onChange={handleMinChange}
                        className="w-16 h-8 text-xs"
                      />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="flex items-center">
                      <span className="text-xs mr-1">$</span>
                      <Input
                        type="number"
                        value={range[1]}
                        onChange={handleMaxChange}
                        className="w-16 h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Rating</h3>
                <RadioGroup defaultValue="all">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="r-all" />
                    <Label htmlFor="r-all">All Ratings</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4plus" id="r-4plus" />
                    <Label htmlFor="r-4plus" className="flex items-center">
                      <div className="flex mr-1">
                        {[...Array(4)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-3 w-3 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      & Up
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3plus" id="r-3plus" />
                    <Label htmlFor="r-3plus" className="flex items-center">
                      <div className="flex mr-1">
                        {[...Array(3)].map((_, i) => (
                          <svg
                            key={i}
                            className="h-3 w-3 text-yellow-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      & Up
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Date Added Filter */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Date Added</h3>
                <RadioGroup defaultValue="anytime">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="anytime" id="d-anytime" />
                    <Label htmlFor="d-anytime">Anytime</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last-week" id="d-last-week" />
                    <Label htmlFor="d-last-week">Last Week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="last-month" id="d-last-month" />
                    <Label htmlFor="d-last-month">Last Month</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="last-3-months"
                      id="d-last-3-months"
                    />
                    <Label htmlFor="d-last-3-months">Last 3 Months</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm" className="text-xs">
                  Reset All
                </Button>
                <Button size="sm" className="text-xs">
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Барааны шүүлт
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Filter products by category, price, and more.
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  {/* Mobile Category Filter */}
                  <Accordion
                    type="single"
                    collapsible
                    defaultValue="categories"
                  >
                    <AccordionItem value="categories">
                      <AccordionTrigger>Categories</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div
                              key={category.id}
                              className="flex items-center"
                            >
                              <Checkbox id={`m-category-${category.id}`} />
                              <Label
                                htmlFor={`m-category-${category.id}`}
                                className="ml-2 flex-1 text-sm cursor-pointer"
                              >
                                {category.name}
                              </Label>
                              <span className="text-xs text-gray-500">
                                ({category.count})
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="price">
                      <AccordionTrigger>Price Range</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <Slider defaultValue={[0, 100]} max={100} step={1} />
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className="text-xs mr-1">$</span>
                              <Input
                                type="number"
                                placeholder="Min"
                                className="w-16 h-8 text-xs"
                              />
                            </div>
                            <span className="text-gray-400">-</span>
                            <div className="flex items-center">
                              <span className="text-xs mr-1">$</span>
                              <Input
                                type="number"
                                placeholder="Max"
                                className="w-16 h-8 text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="rating">
                      <AccordionTrigger>Rating</AccordionTrigger>
                      <AccordionContent>
                        <RadioGroup defaultValue="all">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="all" id="m-r-all" />
                            <Label htmlFor="m-r-all">All Ratings</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4plus" id="m-r-4plus" />
                            <Label
                              htmlFor="m-r-4plus"
                              className="flex items-center"
                            >
                              <div className="flex mr-1">
                                {[...Array(4)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className="h-3 w-3 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              & Up
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3plus" id="m-r-3plus" />
                            <Label
                              htmlFor="m-r-3plus"
                              className="flex items-center"
                            >
                              <div className="flex mr-1">
                                {[...Array(3)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className="h-3 w-3 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              & Up
                            </Label>
                          </div>
                        </RadioGroup>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="date">
                      <AccordionTrigger>Date Added</AccordionTrigger>
                      <AccordionContent>
                        <RadioGroup defaultValue="anytime">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="anytime" id="m-d-anytime" />
                            <Label htmlFor="m-d-anytime">Anytime</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="last-week"
                              id="m-d-last-week"
                            />
                            <Label htmlFor="m-d-last-week">Last Week</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="last-month"
                              id="m-d-last-month"
                            />
                            <Label htmlFor="m-d-last-month">Last Month</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="last-3-months"
                              id="m-d-last-3-months"
                            />
                            <Label htmlFor="m-d-last-3-months">
                              Last 3 Months
                            </Label>
                          </div>
                        </RadioGroup>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" size="sm">
                      Reset All
                    </Button>
                    <Button size="sm">Apply Filters</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Content */}
          <div className="flex-1">
            {/* Sorting and Display options */}
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="mb-4 md:mb-0">
                <p className="text-gray-500 text-sm">
                  Showing <span className="font-medium">{products.length}</span>{" "}
                  of <span className="font-medium">347</span> products
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center">
                  <span className="text-sm mr-2">Sort by:</span>
                  <Select defaultValue="popular">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Grid2x2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-gray-100"
                  >
                    <LayoutList className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm font-medium">Active Filters:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                UI Kits
                <button className="ml-1 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: $30 - $80
                <button className="ml-1 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                4★ & Up
                <button className="ml-1 hover:text-gray-700">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
              <Button
                variant="link"
                size="sm"
                className="text-xs text-blue-600 p-0 h-auto"
              >
                Clear All
              </Button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link href={`/product/${product.id}`}>
                    <div className="aspect-video relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 right-2">
                        {product.category}
                      </Badge>
                    </div>
                  </Link>

                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">
                        <Link
                          href={`/product/${product.id}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {product.title}
                        </Link>
                      </CardTitle>
                      <div className="text-lg font-bold text-blue-600">
                        ${product.price}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      by {product.author}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-between border-t pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="h-4 w-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      {product.sales} sales
                    </div>
                    <div className="flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div key={i}>*</div>
                        ))}
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.rating} / 5
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
