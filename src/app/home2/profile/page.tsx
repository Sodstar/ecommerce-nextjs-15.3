"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  CreditCard,
  Edit,
  Heart,
  Home,
  LogOut,
  Map,
  Package,
  Settings,
  ShoppingBag,
  Trash2,
  Truck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@radix-ui/react-progress";
import { Switch } from "@radix-ui/react-switch";
import { Label } from "@/components/ui/label";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [editProfile, setEditProfile] = useState(false);

  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
    memberSince: "June 2021",
    loyaltyPoints: 2750,
    rewardsStatus: "Gold Member",
    addresses: [
      {
        id: 1,
        type: "Home",
        address: "123 Main Street, Apt 4B",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "United States",
        isDefault: true,
      },
      {
        id: 2,
        type: "Office",
        address: "456 Market Ave, Suite 301",
        city: "San Francisco",
        state: "CA",
        zip: "94103",
        country: "United States",
        isDefault: false,
      },
    ],
    paymentMethods: [
      {
        id: 1,
        cardType: "Visa",
        lastFour: "4242",
        expiryDate: "05/25",
        isDefault: true,
      },
      {
        id: 2,
        cardType: "MasterCard",
        lastFour: "8888",
        expiryDate: "12/24",
        isDefault: false,
      },
    ],
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      newsletterSubscribed: true,
      marketingOptIn: false,
    },
  };

  // Mock order data
  const ordersData = [
    {
      id: "ORD-2023112",
      date: "November 15, 2023",
      total: 349.97,
      status: "Delivered",
      items: [
        {
          name: "Ergonomic Office Chair",
          price: 189.99,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=100&auto=format&fit=crop",
        },
        {
          name: "Modern Pendant Light",
          price: 159.98,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=100&auto=format&fit=crop",
        },
      ],
      trackingInfo: {
        carrier: "FedEx",
        number: "7834298342",
        deliveredOn: "November 20, 2023",
      },
    },
    {
      id: "ORD-2023093",
      date: "October 3, 2023",
      total: 219.98,
      status: "Delivered",
      items: [
        {
          name: "Designer Coffee Table",
          price: 219.98,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1588854337236-6889d631faa8?q=80&w=100&auto=format&fit=crop",
        },
      ],
      trackingInfo: {
        carrier: "UPS",
        number: "1Z9823W42A",
        deliveredOn: "October 8, 2023",
      },
    },
    {
      id: "ORD-2023067",
      date: "August 17, 2023",
      total: 149.99,
      status: "Delivered",
      items: [
        {
          name: "Desk Lamp",
          price: 79.99,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1534189289-18e4dbe8f1fc?q=80&w=100&auto=format&fit=crop",
        },
        {
          name: "Wall Art Canvas",
          price: 70.0,
          quantity: 1,
          image:
            "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=100&auto=format&fit=crop",
        },
      ],
      trackingInfo: {
        carrier: "USPS",
        number: "9400123456",
        deliveredOn: "August 22, 2023",
      },
    },
  ];

  // Mock saved items
  const savedItems = [
    {
      id: 201,
      name: "Minimalist Desk",
      price: 299.99,
      originalPrice: 349.99,
      image:
        "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=100&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: 202,
      name: "Modern Floor Lamp",
      price: 129.99,
      originalPrice: null,
      image:
        "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=100&auto=format&fit=crop",
      inStock: true,
    },
    {
      id: 203,
      name: "Accent Chair",
      price: 249.99,
      originalPrice: 299.99,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=100&auto=format&fit=crop",
      inStock: false,
    },
  ];

  // Nav items
  const navItems = [
    { key: "overview", label: "Overview", icon: User },
    { key: "orders", label: "Orders", icon: Package },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "addresses", label: "Addresses", icon: Map },
    { key: "payment", label: "Payment", icon: CreditCard },
    { key: "settings", label: "Settings", icon: Settings },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50/50 to-white py-20">
      <div className="container px-4 mx-auto max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <Link
            href="/home2"
            className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-black group rounded-full py-2 px-4 hover:bg-zinc-100 transition-all mb-6"
          >
            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center mr-2 group-hover:bg-zinc-200 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </div>
            Back to Home
          </Link>

          <motion.h1
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Миний бүртгэл
          </motion.h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-3xl shadow-sm border border-zinc-100 overflow-hidden sticky top-20">
              {/* User Profile Summary */}
              <div className="p-6 bg-zinc-50/50 border-b border-zinc-100 flex items-center space-x-4">
                <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-lg truncate">
                    {userData.name}
                  </p>
                  <p className="text-sm text-zinc-500 truncate">
                    {userData.email}
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-colors ${
                        activeTab === item.key
                          ? "bg-black text-white"
                          : "text-zinc-600 hover:bg-zinc-50"
                      }`}
                      onClick={() => setActiveTab(item.key)}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>

                      {/* Show dot indicators for orders and wishlist */}
                      {item.key === "orders" && (
                        <Badge className="ml-auto bg-amber-500 text-white hover:bg-amber-600">
                          {ordersData.length}
                        </Badge>
                      )}
                      {item.key === "wishlist" && (
                        <Badge className="ml-auto bg-zinc-100 text-zinc-800 hover:bg-zinc-200">
                          {savedItems.length}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Sign Out */}
              <div className="p-4 border-t border-zinc-100">
                <button className="w-full flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Гарах</span>
                </button>
              </div>
            </div>

            {/* Loyalty Card (only on larger screens) */}
            <div className="hidden lg:block mt-6 ">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-md overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-x-10 -translate-y-10 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-x-6 translate-y-6 blur-xl"></div>

                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-amber-200 text-sm font-medium">
                      MODRN Rewards
                    </p>
                    <h3 className="text-xl font-bold mt-1">
                      {userData.rewardsStatus}
                    </h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Badge className="bg-white text-amber-600">Gold</Badge>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-amber-100">Rewards Points</span>
                    <span className="font-semibold">
                      {userData.loyaltyPoints}
                    </span>
                  </div>
                  <Progress
                    value={55}
                    className="h-2 bg-white/30"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-amber-100">
                    Next reward at 3000 points
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white/90 hover:bg-white text-amber-600 text-xs"
                  >
                    View Benefits
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-8"
              >
                {/* Quick Stats */}
                <motion.div
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <Card className="bg-white border-zinc-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5 text-zinc-400" />
                        Recent Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{ordersData.length}</p>
                      <p className="text-zinc-500 text-sm">
                        Last order on {ordersData[0].date}
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0"
                        onClick={() => setActiveTab("orders")}
                      >
                        View Orders
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-white border-zinc-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Heart className="h-5 w-5 text-zinc-400" />
                        Saved Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{savedItems.length}</p>
                      <p className="text-zinc-500 text-sm">
                        Items in your wishlist
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0"
                        onClick={() => setActiveTab("wishlist")}
                      >
                        View Wishlist
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="bg-white border-zinc-100">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-zinc-400" />
                        Loyalty Points
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {userData.loyaltyPoints}
                      </p>
                      <p className="text-zinc-500 text-sm">
                        Gold status member
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0"
                      >
                        Redeem Points
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>

                {/* Personal Information */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-white border-zinc-100">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle>Personal Information</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => setEditProfile(!editProfile)}
                        >
                          {editProfile ? (
                            "Cancel"
                          ) : (
                            <>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Profile
                            </>
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {editProfile ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="name">Full Name</Label>
                              <Input
                                id="name"
                                defaultValue={userData.name}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="email">Email Address</Label>
                              <Input
                                id="email"
                                type="email"
                                defaultValue={userData.email}
                                className="mt-1"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="phone">Phone Number</Label>
                              <Input
                                id="phone"
                                type="tel"
                                defaultValue={userData.phone}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="dob">Date of Birth</Label>
                              <Input id="dob" type="date" className="mt-1" />
                            </div>
                          </div>

                          <div className="pt-4">
                            <Button className="mr-4 bg-black hover:bg-zinc-800 rounded-full">
                              Save Changes
                            </Button>
                            <Button
                              variant="outline"
                              className="rounded-full"
                              onClick={() => setEditProfile(false)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-zinc-500">
                                  Full Name
                                </p>
                                <p className="font-medium">{userData.name}</p>
                              </div>

                              <div>
                                <p className="text-sm text-zinc-500">
                                  Email Address
                                </p>
                                <p className="font-medium">{userData.email}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <p className="text-sm text-zinc-500">
                                  Phone Number
                                </p>
                                <p className="font-medium">{userData.phone}</p>
                              </div>

                              <div>
                                <p className="text-sm text-zinc-500">
                                  Member Since
                                </p>
                                <p className="font-medium">
                                  {userData.memberSince}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Latest Orders */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-white border-zinc-100">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle>Recent Orders</CardTitle>
                        <Button
                          variant="ghost"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0"
                          onClick={() => setActiveTab("orders")}
                        >
                          View All
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="divide-y divide-zinc-100">
                        {ordersData.slice(0, 2).map((order) => (
                          <div
                            key={order.id}
                            className="p-4 hover:bg-zinc-50/50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">{order.id}</p>
                                <p className="text-sm text-zinc-500">
                                  {order.date}
                                </p>
                              </div>
                              <Badge
                                variant="outline"
                                className={`
                                  ${
                                    order.status === "Delivered"
                                      ? "bg-green-50 text-green-600 border-green-100"
                                      : ""
                                  }
                                  ${
                                    order.status === "Processing"
                                      ? "bg-blue-50 text-blue-600 border-blue-100"
                                      : ""
                                  }
                                  ${
                                    order.status === "Shipped"
                                      ? "bg-amber-50 text-amber-600 border-amber-100"
                                      : ""
                                  }
                                `}
                              >
                                {order.status}
                              </Badge>
                            </div>

                            <div className="flex items-center mt-3">
                              <div className="flex -space-x-3 mr-4">
                                {order.items.map((item, idx) => (
                                  <div
                                    key={idx}
                                    className="h-10 w-10 rounded-lg border-2 border-white overflow-hidden relative"
                                  >
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm">
                                  {order.items.length} item
                                  {order.items.length > 1 ? "s" : ""}
                                </p>
                                <p className="font-medium">
                                  ${order.total.toFixed(2)}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Addresses */}
                <motion.div variants={itemVariants}>
                  <Card className="bg-white border-zinc-100">
                    <CardHeader className="pb-4">
                      <div className="flex justify-between items-center">
                        <CardTitle>Shipping Addresses</CardTitle>
                        <Button
                          variant="ghost"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-0"
                          onClick={() => setActiveTab("addresses")}
                        >
                          Manage Addresses
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {userData.addresses.map((address) => (
                          <div
                            key={address.id}
                            className={`rounded-xl border p-4 ${
                              address.isDefault
                                ? "border-amber-200 bg-amber-50/30"
                                : "border-zinc-100"
                            }`}
                          >
                            <div className="flex justify-between">
                              <div className="flex items-center">
                                <Home className="h-4 w-4 text-zinc-400 mr-2" />
                                <p className="font-medium">{address.type}</p>
                              </div>
                              {address.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-600 border-amber-100"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                            <div className="mt-2 text-sm text-zinc-600 space-y-1">
                              <p>{address.address}</p>
                              <p>
                                {address.city}, {address.state} {address.zip}
                              </p>
                              <p>{address.country}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="space-y-8">
                <Card className="bg-white border-zinc-100">
                  <CardHeader>
                    <CardTitle>Захиалгын Түүх</CardTitle>
                    <CardDescription>
                      Өмнөх захиалгуудаа харах болон удирдах
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-zinc-100">
                      {ordersData.map((order) => (
                        <motion.div
                          key={order.id}
                          className="p-6 hover:bg-zinc-50/50 transition-colors"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">
                                  Захиалга {order.id}
                                </h3>
                                <Badge
                                  variant="outline"
                                  className={`
                                    ${
                                      order.status === "Delivered"
                                        ? "bg-green-50 text-green-600 border-green-100"
                                        : ""
                                    }
                                    ${
                                      order.status === "Processing"
                                        ? "bg-blue-50 text-blue-600 border-blue-100"
                                        : ""
                                    }
                                    ${
                                      order.status === "Shipped"
                                        ? "bg-amber-50 text-amber-600 border-amber-100"
                                        : ""
                                    }
                                  `}
                                >
                                  {order.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-zinc-500 mt-1">
                                Placed on {order.date}
                              </p>
                            </div>
                            <div className="mt-2 md:mt-0 flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                              >
                                Track Order
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full"
                              >
                                View Details
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-6">
                            <div>
                              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-3">
                                Items
                              </p>
                              <div className="space-y-3">
                                {order.items.map((item, idx) => (
                                  <div key={idx} className="flex gap-4">
                                    <div className="h-16 w-16 rounded-lg bg-zinc-100 overflow-hidden relative flex-shrink-0">
                                      <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium">{item.name}</p>
                                      <div className="flex items-center justify-between mt-1">
                                        <p className="text-sm text-zinc-500">
                                          Qty: {item.quantity}
                                        </p>
                                        <p className="font-medium">
                                          ${item.price.toFixed(2)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                                  Shipping Info
                                </p>
                                <div className="bg-zinc-50 rounded-lg p-3">
                                  <div className="flex items-center gap-2">
                                    <Truck className="h-4 w-4 text-zinc-400" />
                                    <span className="text-sm">
                                      {order.trackingInfo.carrier}
                                    </span>
                                  </div>
                                  <p className="text-xs mt-1 text-zinc-500">
                                    Tracking: {order.trackingInfo.number}
                                  </p>
                                  <p className="text-xs mt-1 text-zinc-500">
                                    Delivered: {order.trackingInfo.deliveredOn}
                                  </p>
                                </div>
                              </div>

                              <div>
                                <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                                  Order Summary
                                </p>
                                <div className="bg-zinc-50 rounded-lg p-3">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-zinc-500">
                                      Subtotal
                                    </span>
                                    <span>
                                      ${(order.total * 0.92).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-zinc-500">Tax</span>
                                    <span>
                                      ${(order.total * 0.08).toFixed(2)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="text-zinc-500">
                                      Shipping
                                    </span>
                                    <span className="text-green-600">Free</span>
                                  </div>
                                  <Separator className="my-2 bg-zinc-200" />
                                  <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-8">
                <Card className="bg-white border-zinc-100">
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription>
                      Items you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {savedItems.map((item, index) => (
                        <motion.div
                          key={item.id}
                          className="flex gap-4 group"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="relative h-24 w-24 md:h-32 md:w-32 bg-zinc-100 rounded-xl overflow-hidden flex-shrink-0">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
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
                          <div className="flex-1 flex flex-col">
                            <h3 className="font-medium group-hover:text-amber-600 transition-colors">
                              {item.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1 mb-2">
                              <span className="font-semibold">
                                ${item.price.toFixed(2)}
                              </span>
                              {item.originalPrice && (
                                <span className="text-xs text-zinc-400 line-through">
                                  ${item.originalPrice.toFixed(2)}
                                </span>
                              )}
                            </div>
                            {!item.inStock ? (
                              <Badge
                                variant="outline"
                                className="bg-red-50 text-red-600 border-red-100 self-start"
                              >
                                Out of Stock
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-600 border-green-100 self-start"
                              >
                                In Stock
                              </Badge>
                            )}
                            <div className="flex mt-auto pt-4 gap-2">
                              <Button
                                size="sm"
                                className="rounded-full bg-black hover:bg-zinc-800"
                                disabled={!item.inStock}
                              >
                                <ShoppingBag className="h-4 w-4 mr-1" />
                                Add to Cart
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border-zinc-200"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-8">
                <Card className="bg-white border-zinc-100">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle>Shipping Addresses</CardTitle>
                      <Button className="rounded-full bg-black hover:bg-zinc-800">
                        Add New Address
                      </Button>
                    </div>
                    <CardDescription>
                      Manage your shipping and billing addresses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {userData.addresses.map((address, index) => (
                        <motion.div
                          key={address.id}
                          className={`rounded-xl border p-4 relative ${
                            address.isDefault
                              ? "border-amber-200 bg-amber-50/30"
                              : "border-zinc-100"
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="absolute top-3 right-3 flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-full"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center mb-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center mr-2">
                              {address.type === "Home" ? (
                                <Home className="h-4 w-4 text-zinc-500" />
                              ) : (
                                <ShoppingBag className="h-4 w-4 text-zinc-500" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{address.type}</p>
                              {address.isDefault && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-50 text-amber-600 border-amber-100 mt-1"
                                >
                                  Default
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="text-sm text-zinc-600 space-y-1 mb-4">
                            <p>{address.address}</p>
                            <p>
                              {address.city}, {address.state} {address.zip}
                            </p>
                            <p>{address.country}</p>
                          </div>

                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="rounded-full text-sm"
                            >
                              Set as Default
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === "payment" && (
              <div className="space-y-8">
                <Card className="bg-white border-zinc-100">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle>Payment Methods</CardTitle>
                      <Button className="rounded-full bg-black hover:bg-zinc-800">
                        Add New Card
                      </Button>
                    </div>
                    <CardDescription>
                      Manage your payment methods
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4">
                      {userData.paymentMethods.map((payment, index) => (
                        <motion.div
                          key={payment.id}
                          className={`rounded-xl border p-4 flex items-center justify-between ${
                            payment.isDefault
                              ? "border-amber-200 bg-amber-50/30"
                              : "border-zinc-100"
                          }`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <div className="flex items-center">
                            <div className="h-10 w-16 bg-zinc-50 rounded-md border border-zinc-100 flex items-center justify-center mr-4">
                              {payment.cardType === "Visa" && (
                                <Image
                                  src="/visa.svg"
                                  width={32}
                                  height={20}
                                  alt="Visa"
                                />
                              )}
                              {payment.cardType === "MasterCard" && (
                                <Image
                                  src="/mastercard.svg"
                                  width={32}
                                  height={20}
                                  alt="MasterCard"
                                />
                              )}
                            </div>

                            <div>
                              <p className="font-medium flex items-center">
                                {payment.cardType} •••• {payment.lastFour}
                                {payment.isDefault && (
                                  <Badge
                                    variant="outline"
                                    className="ml-2 bg-amber-50 text-amber-600 border-amber-100"
                                  >
                                    Default
                                  </Badge>
                                )}
                              </p>
                              <p className="text-sm text-zinc-500">
                                Expires {payment.expiryDate}
                              </p>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full h-8 w-8"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-more-vertical"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
                              {!payment.isDefault && (
                                <DropdownMenuItem>
                                  Set as Default
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>Edit Card</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-500 focus:text-red-500">
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-8">
                <Card className="bg-white border-zinc-100">
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences and notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        Email Preferences
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Order Confirmations</p>
                            <p className="text-sm text-zinc-500">
                              Receive emails when you place an order
                            </p>
                          </div>
                          <Switch id="order-emails" defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Shipping Updates</p>
                            <p className="text-sm text-zinc-500">
                              Receive emails about your shipment status
                            </p>
                          </div>
                          <Switch id="shipping-emails" defaultChecked={true} />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Newsletter</p>
                            <p className="text-sm text-zinc-500">
                              Stay updated with our latest products and
                              promotions
                            </p>
                          </div>
                          <Switch
                            id="newsletter"
                            defaultChecked={
                              userData.preferences.newsletterSubscribed
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Emails</p>
                            <p className="text-sm text-zinc-500">
                              Receive personalized offers and recommendations
                            </p>
                          </div>
                          <Switch
                            id="marketing"
                            defaultChecked={userData.preferences.marketingOptIn}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4">Security</h3>
                      <div className="space-y-4">
                        <Button variant="outline" className="rounded-full">
                          Change Password
                        </Button>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">
                              Two-Factor Authentication
                            </p>
                            <p className="text-sm text-zinc-500">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch id="2fa" defaultChecked={false} />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium mb-4 text-red-500">
                        Danger Zone
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between bg-red-50 border border-red-100 rounded-xl p-4">
                          <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-zinc-500">
                              Permanently delete your account and all data
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            className="bg-white border-red-200 hover:bg-red-50 text-red-500"
                          >
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
