"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Heart,
  Info,
  Minus,
  Plus,
  Share2,
  ShoppingBag,
  Star,
  Truck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";

export default function ProductDetail() {
  // Product data (would come from an API in a real app)
  const product = {
    id: "ergonomic-chair-1",
    name: "Modern Ergonomic Chair",
    price: 189.99,
    originalPrice: 239.99,
    rating: 4.8,
    reviewCount: 128,
    description:
      "Discover unparalleled comfort with our modern ergonomic chair. Crafted with premium materials and designed with your wellbeing in mind, this chair offers exceptional lumbar support, breathable mesh backing, and fully adjustable features to suit your unique posture needs.",
    features: [
      "Premium breathable mesh back",
      "Adjustable lumbar support",
      "Synchronous tilt mechanism",
      "Height-adjustable armrests",
      "360° swivel with smooth-rolling casters",
      "Weight capacity: 300 lbs",
    ],
    sku: "EC-MODX-2023",
    availability: "In Stock",
    shippingTime: "2-4 business days",
    freeShipping: true,
    colors: [
      { name: "Classic Gray", value: "#6B7280", inStock: true },
      { name: "Midnight Black", value: "#1F2937", inStock: true },
      { name: "Navy Blue", value: "#1E3A8A", inStock: false },
      { name: "Slate White", value: "#F9FAFB", inStock: true },
    ],
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop&flip=true",
    ],
    materials: ["Premium Mesh", "High-Grade Aluminum", "Engineered Plastic"],
    dimensions: {
      width: "27.5 inches",
      depth: "29.1 inches",
      height: "45.3 inches",
      weight: "42.7 lbs",
    },
    warranty: "5 Year Limited Warranty",
    careInstructions: "Clean with damp cloth. Avoid harsh chemicals.",
    specifications: {
      assembly: "Required, tools included",
      countryOfOrigin: "Designed in Sweden, Made in China",
      certifications: ["BIFMA Certified", "GREENGUARD Certified"],
    },
  };

  // State for selected options
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Image zooming
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleImageHover = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (!imageContainerRef.current) return;

    const { left, top, width, height } =
      imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  // Handle quantity change
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Modern Breadcrumb with Animation */}
      <div className="bg-gradient-to-r from-zinc-50/90 to-white border-b border-zinc-100 py-5">
        <div className="container mx-auto px-4">
          <motion.nav
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap items-center text-sm"
          >
            <Link
              href="/home2"
              className="text-zinc-500 hover:text-black transition-colors flex items-center group"
            >
              <span className="group-hover:underline underline-offset-2 decoration-amber-400 decoration-2">
                Home
              </span>
            </Link>

            <div className="flex items-center mx-2 text-zinc-300">
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            <Link
              href="/home2"
              className="text-zinc-500 hover:text-black transition-colors flex items-center group"
            >
              <span className="group-hover:underline underline-offset-2 decoration-amber-400 decoration-2">
                Furniture
              </span>
            </Link>

            <div className="flex items-center mx-2 text-zinc-300">
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            <Link
              href="/home2"
              className="text-zinc-500 hover:text-black transition-colors flex items-center group"
            >
              <span className="group-hover:underline underline-offset-2 decoration-amber-400 decoration-2">
                Office
              </span>
            </Link>

            <div className="flex items-center mx-2 text-zinc-300">
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            <span className="font-medium text-zinc-900 truncate max-w-[180px] sm:max-w-none">
              {product.name}
            </span>

            {/* Product Availability Badge */}
            <div className="ml-auto hidden sm:flex items-center">
              <div
                className={`w-2 h-2 rounded-full ${
                  product.availability.toLowerCase().includes("stock")
                    ? "bg-green-500"
                    : "bg-amber-500"
                } animate-pulse mr-1.5`}
              ></div>
              <span className="text-xs text-zinc-600">
                {product.availability}
              </span>
            </div>
          </motion.nav>
        </div>
      </div>

      {/* Product main section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="w-full lg:w-3/5 space-y-6">
              {/* Main image */}
              <div
                ref={imageContainerRef}
                className="relative bg-zinc-50 rounded-2xl overflow-hidden aspect-square cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleImageHover}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${product.images[activeImageIndex]})`,
                    backgroundPosition: isZoomed
                      ? `${zoomPosition.x}% ${zoomPosition.y}%`
                      : "center",
                    backgroundSize: isZoomed ? "150%" : "cover",
                    backgroundRepeat: "no-repeat",
                    transition: isZoomed
                      ? "none"
                      : "background-size 0.2s ease-out",
                  }}
                />
              </div>

              {/* Thumbnail Carousel */}
              <Carousel className="w-full">
                <CarouselContent className="-ml-4">
                  {product.images.map((image, index) => (
                    <CarouselItem
                      key={index}
                      className="pl-4 basis-1/4 md:basis-1/5 lg:basis-1/5"
                    >
                      <div
                        className={`aspect-square bg-zinc-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          index === activeImageIndex
                            ? "border-amber-500 ring-2 ring-amber-500/20"
                            : "border-transparent hover:border-zinc-200"
                        }`}
                        onClick={() => setActiveImageIndex(index)}
                      >
                        <Image
                          src={image}
                          alt={`Product image ${index + 1}`}
                          width={200}
                          height={200}
                          className="object-cover h-full w-full"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="hidden sm:flex justify-end mt-3 gap-2">
                  <CarouselPrevious className="static translate-y-0 rounded-full" />
                  <CarouselNext className="static translate-y-0 rounded-full" />
                </div>
              </Carousel>
            </div>

            {/* Product Info */}
            <div className="w-full lg:w-2/5 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-amber-100 text-amber-800 hover:bg-amber-200"
                  >
                    Top Rated
                  </Badge>
                  {product.originalPrice && (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800 hover:bg-red-200"
                    >
                      {discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(product.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-zinc-200"
                          }`}
                        />
                      ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">{product.rating}</span>
                    <span className="text-zinc-500 ml-1">
                      ({product.reviewCount} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-zinc-400 line-through mb-0.5">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Short description */}
              <p className="text-zinc-600">{product.description}</p>

              {/* Color selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Color:{" "}
                    <span className="text-zinc-600">{selectedColor.name}</span>
                  </span>
                  <span className="text-xs text-zinc-500">
                    {product.colors.filter((c) => c.inStock).length} colors
                    available
                  </span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <TooltipProvider key={color.name} delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className={`w-9 h-9 rounded-full relative flex items-center justify-center ${
                              !color.inStock
                                ? "cursor-not-allowed opacity-50"
                                : "cursor-pointer"
                            } ${
                              selectedColor.name === color.name
                                ? "ring-2 ring-offset-2 ring-zinc-900"
                                : ""
                            }`}
                            onClick={() =>
                              color.inStock && setSelectedColor(color)
                            }
                            disabled={!color.inStock}
                            style={{ backgroundColor: color.value }}
                            aria-label={color.name}
                          >
                            {selectedColor.name === color.name && (
                              <Check
                                className={`h-4 w-4 ${
                                  color.name === "Slate White"
                                    ? "text-black"
                                    : "text-white"
                                }`}
                              />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="bg-zinc-900 text-white text-xs"
                        >
                          {color.name} {!color.inStock && "(Out of Stock)"}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4 sm:flex-nowrap">
                  {/* Quantity selector */}
                  <div className="flex items-center border border-zinc-200 rounded-full bg-white h-12 px-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Add to cart button */}
                  <Button className="flex-1 bg-black hover:bg-zinc-800 text-white h-12 rounded-full font-medium">
                    Add to Cart
                    <ShoppingBag className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                {/* Wishlist & Share */}
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full border-zinc-200 flex-1"
                  >
                    <Heart className="mr-2 h-4 w-4" /> Add to Wishlist
                  </Button>
                  <Button
                    variant="outline"
                    className="rounded-full border-zinc-200 w-12 h-12 p-0 flex items-center justify-center"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Product highlights & shipping info */}
              <div className="space-y-4 border-t border-zinc-100 pt-6">
                {/* Shipping & Returns */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <Truck className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div>
                    <p className="font-medium">Free Shipping & Returns</p>
                    <p className="text-zinc-500">On orders over $50</p>
                  </div>
                </div>

                {/* SKU & Availability */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">SKU</p>
                    <p className="font-medium">{product.sku}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Availability</p>
                    <p className="font-medium text-green-600">
                      {product.availability}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details - Tabs */}
      <section className="bg-zinc-50/70 py-16">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full flex justify-center bg-white border border-zinc-200 shadow-sm p-1 rounded-full mb-10 max-w-2xl mx-auto">
              <TabsTrigger
                value="details"
                className="flex-1 rounded-full text-sm px-6 py-2 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="specifications"
                className="flex-1 rounded-full text-sm px-6 py-2 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Specifications
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 rounded-full text-sm px-6 py-2 data-[state=active]:bg-black data-[state=active]:text-white"
              >
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-0">
              <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm max-w-4xl mx-auto">
                <div className="prose prose-zinc max-w-none">
                  <h3 className="text-2xl font-bold mb-6">
                    About This Product
                  </h3>
                  <p className="mb-6">
                    The {product.name} combines stylish design with scientific
                    ergonomics to create a chair that looks as good as it feels.
                    Ideal for long work sessions, this chair helps maintain
                    proper posture while providing exceptional comfort
                    throughout your day.
                  </p>

                  <h4 className="text-xl font-semibold mt-8 mb-4">
                    Key Features
                  </h4>
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          <Check className="h-3 w-3 text-amber-600" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <h4 className="text-xl font-semibold mt-8 mb-4">
                    Materials & Craftsmanship
                  </h4>
                  <p>
                    Crafted from premium materials, each {product.name} is built
                    to last. The frame combines lightweight aluminum with
                    high-strength engineered polymers, while the seating
                    surfaces use advanced breathable mesh that contours to your
                    body's unique shape.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div>
                      <h4 className="text-lg font-semibold mb-3">
                        Premium Materials
                      </h4>
                      <ul className="space-y-2">
                        {product.materials.map((material, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-1 w-1 rounded-full bg-amber-500 mr-2"></div>
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-3">Dimensions</h4>
                      <ul className="space-y-2">
                        <li className="flex justify-between border-b border-zinc-100 pb-2">
                          <span className="text-zinc-500">Width</span>
                          <span className="font-medium">
                            {product.dimensions.width}
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-100 pb-2">
                          <span className="text-zinc-500">Depth</span>
                          <span className="font-medium">
                            {product.dimensions.depth}
                          </span>
                        </li>
                        <li className="flex justify-between border-b border-zinc-100 pb-2">
                          <span className="text-zinc-500">Height</span>
                          <span className="font-medium">
                            {product.dimensions.height}
                          </span>
                        </li>
                        <li className="flex justify-between pb-2">
                          <span className="text-zinc-500">Weight</span>
                          <span className="font-medium">
                            {product.dimensions.weight}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="mt-0">
              <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-6">
                  Technical Specifications
                </h3>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value="dimensions"
                    className="border-b border-zinc-200"
                  >
                    <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                      Dimensions & Weight
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-zinc-500 mb-1">Width</p>
                          <p className="font-medium">
                            {product.dimensions.width}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500 mb-1">Depth</p>
                          <p className="font-medium">
                            {product.dimensions.depth}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500 mb-1">Height</p>
                          <p className="font-medium">
                            {product.dimensions.height}
                          </p>
                        </div>
                        <div>
                          <p className="text-zinc-500 mb-1">Weight</p>
                          <p className="font-medium">
                            {product.dimensions.weight}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="materials"
                    className="border-b border-zinc-200"
                  >
                    <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                      Materials
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <ul className="space-y-2">
                        {product.materials.map((material, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2"></div>
                            <span>{material}</span>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="assembly"
                    className="border-b border-zinc-200"
                  >
                    <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                      Assembly & Care
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-1">Assembly Required</p>
                          <p className="text-zinc-600">
                            {product.specifications.assembly}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Care Instructions</p>
                          <p className="text-zinc-600">
                            {product.careInstructions}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem
                    value="warranty"
                    className="border-b border-zinc-200"
                  >
                    <AccordionTrigger className="text-base font-medium hover:no-underline py-4">
                      Warranty & Support
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-1">Warranty</p>
                          <p className="text-zinc-600">{product.warranty}</p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Origin</p>
                          <p className="text-zinc-600">
                            {product.specifications.countryOfOrigin}
                          </p>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Certifications</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {product.specifications.certifications.map(
                              (cert, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="bg-zinc-50"
                                >
                                  {cert}
                                </Badge>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row gap-10">
                  {/* Overall rating summary */}
                  <div className="md:w-1/3 flex flex-col items-center p-6 bg-zinc-50 rounded-xl">
                    <h3 className="text-6xl font-bold text-zinc-900">
                      {product.rating}
                    </h3>
                    <div className="flex items-center mt-3 mb-2">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(product.rating)
                                ? "text-amber-400 fill-amber-400"
                                : "text-zinc-200"
                            }`}
                          />
                        ))}
                    </div>
                    <p className="text-sm text-zinc-500">
                      Based on {product.reviewCount} reviews
                    </p>

                    <Separator className="my-6" />

                    {/* Rating breakdown */}
                    <div className="w-full space-y-3">
                      {[5, 4, 3, 2, 1].map((star) => {
                        // Sample distribution - in a real app this would come from API
                        const percentage =
                          star === 5
                            ? 65
                            : star === 4
                            ? 25
                            : star === 3
                            ? 7
                            : star === 2
                            ? 2
                            : 1;

                        return (
                          <div key={star} className="flex items-center gap-3">
                            <div className="flex items-center gap-1 w-8">
                              <span className="font-medium">{star}</span>
                              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                            </div>
                            <div className="flex-1 h-2 bg-zinc-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-zinc-500 w-9 text-right">
                              {percentage}%
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Button className="mt-6 w-full rounded-full bg-black hover:bg-zinc-800">
                      Write a Review
                    </Button>
                  </div>

                  {/* Reviews list */}
                  <div className="md:w-2/3">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold">Customer Reviews</h3>
                      <div className="text-sm text-zinc-500">
                        Showing 3 of {product.reviewCount} reviews
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Sample reviews - in a real app these would come from an API */}
                      {[
                        {
                          name: "Sarah J.",
                          avatar:
                            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
                          rating: 5,
                          date: "3 weeks ago",
                          title: "Exceptional comfort and quality",
                          content:
                            "I've been using this chair for my home office for about a month now and I'm impressed with the comfort level, especially for longer work sessions. Assembly was straightforward and the materials feel premium.",
                        },
                        {
                          name: "Michael T.",
                          avatar:
                            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
                          rating: 4,
                          date: "2 months ago",
                          title:
                            "Great ergonomics, slightly difficult assembly",
                          content:
                            "The chair provides excellent support for my lower back which has significantly reduced the pain I used to experience. The only downside was the assembly which took longer than expected. Overall, I'm very satisfied with my purchase.",
                        },
                        {
                          name: "Lauren K.",
                          avatar:
                            "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
                          rating: 5,
                          date: "4 months ago",
                          title: "Worth every penny",
                          content:
                            "After trying several office chairs, this one stands out for its adjustability and comfort. The mesh back provides great breathability during long work sessions. The lumbar support is positioned perfectly for my needs.",
                        },
                      ].map((review, index) => (
                        <div
                          key={index}
                          className="border-b border-zinc-100 pb-6 last:border-0"
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <Image
                                src={review.avatar}
                                alt={review.name}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{review.name}</h4>
                                <span className="text-xs text-zinc-500">
                                  {review.date}
                                </span>
                              </div>
                              <div className="flex my-1">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < review.rating
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-zinc-200"
                                      }`}
                                    />
                                  ))}
                              </div>
                              <h5 className="font-medium mt-2">
                                {review.title}
                              </h5>
                              <p className="text-zinc-600 text-sm mt-1">
                                {review.content}
                              </p>

                              <div className="flex gap-2 mt-3">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-8 rounded-full hover:bg-zinc-50"
                                >
                                  Helpful (12)
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs h-8 rounded-full hover:bg-zinc-50"
                                >
                                  Report
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      className="mt-6 rounded-full w-full"
                    >
                      Load More Reviews
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* You may also like */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold">You May Also Like</h2>
          <Button variant="ghost" className="text-zinc-600 hover:text-black">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <Carousel opts={{ loop: true }} className="w-full">
          <CarouselContent className="-ml-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="group">
                  <div className="relative rounded-2xl overflow-hidden mb-3 bg-zinc-100">
                    <div className="aspect-square">
                      <Image
                        src={
                          [
                            "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1558&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1558&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=1558&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=1470&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1770&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=1587&auto=format&fit=crop",
                          ][index % 6]
                        }
                        alt={`Related product ${index + 1}`}
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
                        Add to Cart <ShoppingBag className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                    {index % 3 === 1 && (
                      <Badge className="absolute top-3 left-3 bg-amber-500">
                        New
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-medium mb-1 group-hover:text-zinc-700">
                    {
                      [
                        "Adjustable Task Chair",
                        "Modern Desk Lamp",
                        "Ergonomic Mouse Pad",
                        "Standing Desk Converter",
                        "Leather Office Chair",
                        "Wooden Monitor Stand",
                      ][index % 6]
                    }
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span className="text-zinc-900 font-medium">
                        $
                        {
                          [149.99, 79.99, 29.99, 199.99, 249.99, 59.99][
                            index % 6
                          ]
                        }
                      </span>
                      {index % 3 === 0 && (
                        <span className="text-zinc-400 line-through text-sm">
                          $
                          {
                            [189.99, 99.99, 39.99, 249.99, 299.99, 79.99][
                              index % 6
                            ]
                          }
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm text-zinc-600 ml-1">
                        {[4.8, 4.5, 4.9, 4.7, 4.6, 4.8][index % 6]}
                      </span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-8">
            <CarouselPrevious className="static translate-y-0 mx-2 rounded-full" />
            <CarouselNext className="static translate-y-0 mx-2 rounded-full" />
          </div>
        </Carousel>
      </section>

      {/* Highlight Banner */}
      <section className="bg-zinc-50/80 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Truck,
                title: "Free Shipping",
                description: "On all orders over $50",
              },
              {
                icon: ArrowLeft,
                title: "30-Day Returns",
                description: "Hassle-free return policy",
              },
              {
                icon: Info,
                title: "5-Year Warranty",
                description: "Protecting your investment",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-sm"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-zinc-700" />
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{feature.title}</h3>
                    <p className="text-zinc-500 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recently viewed */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="aspect-square bg-zinc-100 rounded-lg overflow-hidden mb-2 relative">
                  <Image
                    src={
                      [
                        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?q=80&w=600&auto=format&fit=crop",
                        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=600&auto=format&fit=crop",
                      ][index]
                    }
                    alt={`Recent product ${index + 1}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-medium truncate">
                  {
                    [
                      "Modern Ergonomic Chair",
                      "Adjustable Desk Lamp",
                      "Minimalist Bookshelf",
                      "Designer Coffee Table",
                      "Smart Home Hub",
                    ][index]
                  }
                </h3>
                <p className="text-sm text-zinc-500">
                  ${[189.99, 79.99, 149.99, 249.99, 129.99][index]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* "Back to Top" button */}
      <div className="text-center mb-12">
        <Button
          variant="outline"
          className="rounded-full border-zinc-200"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to Top
        </Button>
      </div>
    </div>
  );
}
