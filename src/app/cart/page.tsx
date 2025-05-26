import Link from "next/link";
import { Minus, Plus, ShoppingCart, Trash2, CreditCard, ArrowRight } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

// Mock cart data - replace with your actual data fetching logic
const cartItems = [
  {
    id: 1,
    title: "Хүүхдийн сэтгэл зүйн хөгжлийн онол",
    price: 25000,
    image: "/products/child-psychology-book.jpg",
    quantity: 1,
    category: "Номнууд",
    type: "PDF"
  },
  {
    id: 2,
    title: "Сэтгэл судлалын аргууд - Бүрэн багц",
    price: 75000,
    image: "/products/psychology-toolkit.jpg",
    quantity: 1,
    category: "Багц материал",
    type: "PDF + Видео"
  },
  {
    id: 3,
    title: "Өсвөр насны хүүхдийн хүмүүжил - Гарын авлага",
    price: 35000,
    image: "/products/adolescent-guide.jpg",
    quantity: 2,
    category: "Гарын авлага",
    type: "PDF"
  }
];

// Calculate cart totals
const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
const deliveryFee = 0; // Digital products have no delivery fee
const discount = 10000; // Example discount
const total = subtotal + deliveryFee - discount;

export default function ShoppingCartPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
          <ShoppingCart className="mr-2 h-8 w-8" /> Сагс
        </h1>
        <div className="flex text-sm breadcrumbs">
          <ul className="flex items-center space-x-2">
            <li><Link href="/" className="text-gray-500 hover:text-orange-500">Нүүр</Link></li>
            <li className="flex items-center gap-2 before:content-['/'] before:mx-2 before:text-gray-500">Сагс</li>
          </ul>
        </div>
      </div>

      {cartItems.length > 0 ? (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Таны сонгосон бүтээгдэхүүнүүд</CardTitle>
                  <div className="text-sm text-gray-500">{cartItems.length} бүтээгдэхүүн</div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row py-4 px-6">
                      <div className="md:w-1/4 mb-4 md:mb-0">
                        <div className="aspect-video md:aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.image || "/product-placeholder.jpg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="md:w-3/4 md:pl-6 flex flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium mb-1">
                              <Link href={`/product/${item.id}`} className="hover:text-orange-500">
                                {item.title}
                              </Link>
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="outline">{item.category}</Badge>
                              <Badge variant="secondary">{item.type}</Badge>
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-orange-500">
                            {item.price.toLocaleString()}₮
                          </div>
                        </div>
                        
                        <div className="mt-auto flex justify-between items-center">
                          <div className="flex items-center">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-full"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="mx-3 min-w-8 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 rounded-full"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Устгах
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t p-4">
                <Button variant="outline">
                  <Link href="/products" className="flex items-center">
                    Худалдан авалтаа үргэлжлүүлэх
                  </Link>
                </Button>
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600">
                  Сагс хоослох
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <Card className="sticky top-4">
              <CardHeader className="border-b">
                <CardTitle>Захиалгын дүн</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Нийт дүн:</span>
                    <span className="font-medium">{subtotal.toLocaleString()}₮</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Хүргэлтийн төлбөр:</span>
                    <span className="font-medium">{deliveryFee > 0 ? `${deliveryFee.toLocaleString()}₮` : 'Үнэгүй'}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Хөнгөлөлт:</span>
                      <span className="font-medium">-{discount.toLocaleString()}₮</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Нийт:</span>
                    <span className="text-orange-500">{total.toLocaleString()}₮</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="coupon" className="mb-2 block">Купон код</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="coupon" 
                        placeholder="Купон кодоо оруулна уу"
                        className="flex-1"
                      />
                      <Button variant="outline">Ашиглах</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2 border-t pt-6">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 flex justify-between items-center h-12">
                  <span>Худалдан авах</span>
                  <div className="flex items-center">
                    <span>{total.toLocaleString()}₮</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </Button>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Төлбөрийн нөхцөлүүд
                </Button>
                <div className="w-full text-center text-sm text-gray-500 mt-2">
                  Бид таны мэдээллийг хамгаалж, аюулгүй байдлыг бүрэн хангаж ажилладаг
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        // Empty cart view
        <Card className="text-center py-12">
          <CardContent className="flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Таны сагс хоосон байна</h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Та манай сайтаас бүтээгдэхүүнүүдээ сонгон сагсандаа нэмээрэй
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Link href="/products">Бүтээгдэхүүн үзэх</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Product Recommendations */}
      {cartItems.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Танд санал болгох</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((id) => (
              <Card key={id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-video relative">
                  <img 
                    src={`/products/recommended-${id}.jpg`}
                    alt="Recommended product"
                    className="object-cover w-full h-full"
                  />
                  <Badge className="absolute top-2 right-2 bg-orange-500">
                    Шинэ
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-base line-clamp-2">
                    <Link href={`/product/${id}`} className="hover:text-orange-600 transition-colors">
                      Хөгжлийн сэтгэл зүй - Гарын авлага {id}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-2 font-semibold text-orange-500">30,000₮</div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    Хүүхдийн хөгжлийн онцлог, хэрэгцээ, шаардлагыг тодорхойлсон иж бүрэн гарын авлага
                  </p>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button variant="outline" className="w-full">
                    Сагсанд нэмэх
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}