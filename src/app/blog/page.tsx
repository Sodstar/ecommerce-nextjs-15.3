import Link from "next/link";
import { CalendarIcon, Clock, Filter, Tag, User } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const blogCategories = [
  { id: 1, name: "Сэтгэл судлал", count: 24 },
  { id: 2, name: "Хүмүүжил", count: 18 },
  { id: 3, name: "Хөгжил", count: 12 },
  { id: 4, name: "Судалгаа", count: 9 },
  { id: 5, name: "Гэр бүл", count: 15 },
];

const blogPosts = [
  {
    id: 1,
    title: "Хүүхдийн сэтгэл зүйн хөгжилд нөлөөлөх хүчин зүйлс",
    excerpt: "Хүүхдийн сэтгэл зүйн хөгжилд эцэг эхийн оролцоо, гэр бүлийн орчин хэрхэн нөлөөлдөг талаар судалгааны үр дүнгээс...",
    author: "Д. Болормаа",
    date: "2025-03-15",
    readTime: "8 минут",
    image: "/blog/child-development.jpg",
    categories: ["Сэтгэл судлал", "Хүмүүжил"],
    featured: true
  },
  {
    id: 2,
    title: "Сэтгэл зүйн эрүүл мэндийг хэрхэн хадгалах вэ?",
    excerpt: "Өдөр тутмын амьдралд сэтгэл зүйн эрүүл мэндээ хадгалахын тулд хэрэгжүүлж болох энгийн аргууд болон дасгалууд...",
    author: "Б. Сүхбаатар",
    date: "2025-03-10",
    readTime: "6 минут",
    image: "/blog/mental-health.jpg",
    categories: ["Сэтгэл судлал", "Хөгжил"]
  },
  {
    id: 3,
    title: "Судалгааны арга зүй: Тоон өгөгдөл цуглуулах аргууд",
    excerpt: "Сэтгэл судлалын судалгаанд хэрэглэгддэг тоон өгөгдөл цуглуулах арга зүй, анкет боловсруулах, ярилцлага хийх аргууд...",
    author: "Ж. Батхүү",
    date: "2025-02-28",
    readTime: "12 минут",
    image: "/blog/research-methods.jpg",
    categories: ["Судалгаа", "Сэтгэл судлал"]
  },
  {
    id: 4,
    title: "Гэр бүлийн харилцааг сайжруулах 5 арга",
    excerpt: "Гэр бүлийн харилцаанд үүсдэг түгээмэл бэрхшээл, тэдгээрийг даван туулах аргууд болон хос хоорондын харилцааг бэхжүүлэх зөвлөмжүүд...",
    author: "Н. Оюунцэцэг",
    date: "2025-02-20",
    readTime: "7 минут",
    image: "/blog/family-relationships.jpg",
    categories: ["Гэр бүл", "Сэтгэл судлал"]
  },
  {
    id: 5,
    title: "Өсвөр насны хүүхдийн сэтгэл зүйн онцлог",
    excerpt: "Өсвөр насны хүүхдийн сэтгэл зүйн онцлог шинж чанар, энэ үеийн хямралыг хэрхэн даван туулахад туслах арга замууд...",
    author: "М. Эрдэнэсувд",
    date: "2025-02-10",
    readTime: "9 минут",
    image: "/blog/adolescence.jpg", 
    categories: ["Хүмүүжил", "Хөгжил"]
  }
];

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content - Blog Posts */}
        <div className="md:w-3/4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Блог</h1>
            <p className="text-gray-600">
              Сэтгэл судлалын чиглэлээр бичигдсэн мэдээ, мэдээлэл, нийтлэлүүд
            </p>
          </div>

          {/* Featured Post - First post gets special treatment */}
          {blogPosts.filter(post => post.featured).map(post => (
            <Card key={post.id} className="mb-8 overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 h-64 md:h-auto relative">
                  <img 
                    src={post.image || '/blog/placeholder.jpg'}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="md:w-2/3 p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category, i) => (
                      <Badge key={i} variant="outline" className="bg-orange-50">
                        {category}
                      </Badge>
                    ))}
                  </div>
                  <CardTitle className="text-2xl mb-3">
                    <Link href={`/blog/${post.id}`} className="hover:text-orange-600 transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <User className="h-4 w-4 mr-1" />
                    <span className="mr-4">{post.author}</span>
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span className="mr-4">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                  <Button variant="outline" className="hover:bg-orange-50">
                    <Link href={`/blog/${post.id}`}>Цааш унших</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {/* Regular Blog Posts */}
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.filter(post => !post.featured).map(post => (
              <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 relative">
                  <img 
                    src={post.image || '/blog/placeholder.jpg'}
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    {post.categories.slice(0, 1).map((category, i) => (
                      <Badge key={i} className="bg-orange-500">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="line-clamp-2">
                    <Link href={`/blog/${post.id}`} className="hover:text-orange-600 transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-600 line-clamp-3 mb-3">
                    {post.excerpt}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between pt-3 border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime}</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="mr-2">Өмнөх</Button>
            <Button className="bg-orange-500 hover:bg-orange-600">1</Button>
            <Button variant="outline" className="mx-2">2</Button>
            <Button variant="outline">3</Button>
            <Button variant="outline" className="ml-2">Дараах</Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-1/4">
          {/* Search */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Хайлт</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input 
                  placeholder="Хайх утгаа оруулна уу..." 
                  className="pr-10"
                />
                <Button 
                  size="sm"
                  className="absolute right-0 top-0 h-full bg-orange-500 hover:bg-orange-600"
                >
                  Хайх
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Ангилалууд
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul>
                {blogCategories.map((category, i) => (
                  <li key={i}>
                    <Link 
                      href={`/blog/category/${category.id}`}
                      className={`flex justify-between items-center p-3 hover:bg-orange-50 ${
                        i !== blogCategories.length - 1 ? 'border-b' : ''
                      }`}
                    >
                      <span>{category.name}</span>
                      <Badge variant="outline">{category.count}</Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Сүүлийн нийтлэлүүд</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul>
                {blogPosts.slice(0, 3).map((post, i) => (
                  <li key={i}>
                    <Link 
                      href={`/blog/${post.id}`}
                      className={`block p-3 hover:bg-orange-50 ${
                        i !== 2 ? 'border-b' : ''
                      }`}
                    >
                      <div className="text-sm font-medium hover:text-orange-600">{post.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Шүүлтүүр
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Нийтлэгдсэн огноо</h4>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <input id="this-month" type="checkbox" className="mr-2" />
                    <label htmlFor="this-month" className="text-sm">Энэ сар</label>
                  </div>
                  <div className="flex items-center">
                    <input id="last-month" type="checkbox" className="mr-2" />
                    <label htmlFor="last-month" className="text-sm">Өнгөрсөн сар</label>
                  </div>
                  <div className="flex items-center">
                    <input id="this-year" type="checkbox" className="mr-2" />
                    <label htmlFor="this-year" className="text-sm">Энэ жил</label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Зохиогч</h4>
                <div className="space-y-1">
                  {Array.from(new Set(blogPosts.map(post => post.author))).map((author, i) => (
                    <div key={i} className="flex items-center">
                      <input id={`author-${i}`} type="checkbox" className="mr-2" />
                      <label htmlFor={`author-${i}`} className="text-sm">{author}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}