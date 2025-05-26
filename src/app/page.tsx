import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, ChevronRight, Download, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { featuredProducts } from "@/data/dummies";
import { getAllCategories } from "@/actions/category-action";
import { getFilteredProducts } from "@/actions/product-action";
import CategoriesSection from "@/components/category-section";

export default async function Home() {
  const categories = await getAllCategories();
  const limit = 4;
  let featuredProducts = await getFilteredProducts({ limit });
  if (typeof featuredProducts === "string") {
    featuredProducts = JSON.parse(featuredProducts);
  }
  if (!Array.isArray(featuredProducts)) {
    featuredProducts = [];
  }
  return (
    <div>
      <section className="bg-gradient-to-r from-orange-400 to-green-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Дуут шувуу - Сэтгэл зүйн төв
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Манай сэтгэл судлалын төв нь судалгааны аргуудыг бусадтай
                хуваалцах, сэтгэл зүйн хүрээн хэрэглэх бараа бүтээгдэхүүн
                түгээх. хэрэгцээт зөвөлгөө нийлэл болон сэтгэл зүйн зөвөлгөөний
                үйлчилгээ үзүүлдэг.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-blue-50 cursor-pointer"
                >
                  Судалгааны аргууд
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-gray-600 border-white hover:text-orange-600 cursor-pointer"
                >
                  Холбоо барих
                </Button>
              </div>
            </div>
            <div className="hidden md:flex justify-end  absolute right-0">
              <img
                src="/banner-bg.png"
                alt="Digital marketplace illustration"
                className="rounded-lg w-[320px] h-auto"
              />
            </div>
          </div>
        </div>
      </section>
      <CategoriesSection categories={categories} />

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Шинээр нэмэгдсэн</h2>
            <Link
              href="/products"
              className="text-orange-500 hover:text-orange-600 flex items-center font-semibold"
            >
              Бүгд <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any, i: number) => (
              <Card
                key={i}
                className="overflow-hidden hover:shadow-lg transition-shadow pt-0"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="aspect-video relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                    <Badge className="absolute top-2 right-2">
                      {product.category.name}
                    </Badge>
                  </div>
                </Link>

                <CardHeader className="min-h-[30px]">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      <Link
                        href={`/product/${product.id}`}
                        className="hover:text-orange-600 transition-colors"
                      >
                        {product.title}
                      </Link>
                    </CardTitle>
                    <div className="text-lg font-bold text-orange-500">
                      {product.price}₮
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 line-clamp-2">
                    {product.shortDescription}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between border-t pt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Download className="h-4 w-4 mr-1" />
                    {product.sales} PDF
                  </div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {/* <span className="text-sm ml-1">{product.rating}</span> */}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Яагаад биднийг сонох вэ{" "}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-4 mb-4 rounded-full">
                <Shield className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Аюулгүй дамжуулалт</h3>
              <p className="text-gray-600">
                Манай системээр дамжигдах бүх мэдээлэл нь шифрлэгдсэн бөгөөд
                таны хувийн мэдээллийг хамгаалах зорилгоор аюулгүй байдлын
                стандартуудыг дагаж мөрддөг.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-4 mb-4 rounded-full">
                <Download className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Татаж авах</h3>
              <p className="text-gray-600">
                Та манай платформоос худалдан авсан бүтээгдэхүүнээ шууд татаж
                авах боломжтой. Бид таны цагийг хэмнэхийн тулд хялбаршуулсан үйл
                явцыг санал болгож байна.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-orange-100 p-4 mb-4 rounded-full">
                <Award className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                Төлбөрийн хялбар шийдэл
              </h3>
              <p className="text-gray-600">
                Бид олон төрлийн төлбөрийн аргыг дэмждэг. Та qPay болон
                SocialPay ашиглан төлбөрөө хийх боломжтой.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
