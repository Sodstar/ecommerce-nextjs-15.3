import Link from "next/link";
import { Download, File, FileText, Filter, Search, FileArchive, Clock, Package, ChevronDown, Eye, Tag } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock purchased items data - replace with your actual data fetching logic
const downloadableItems = [
  {
    id: "ORD-2025-0001",
    title: "Хүүхдийн сэтгэл зүйн хөгжлийн онол",
    price: 25000,
    purchaseDate: "2025-04-15",
    fileType: "PDF",
    fileSize: "15.2 MB",
    downloadCount: 2,
    maxDownloads: 5,
    expiryDate: "2025-07-15", // 3 months from purchase
    image: "/products/child-psychology-book.jpg",
    downloadUrl: "/downloads/child-psychology-theory.pdf"
  },
  {
    id: "ORD-2025-0002",
    title: "Сэтгэл судлалын аргууд - Бүрэн багц",
    price: 75000,
    purchaseDate: "2025-04-10",
    fileType: "ZIP",
    fileSize: "256 MB",
    downloadCount: 1,
    maxDownloads: 5,
    expiryDate: "2025-07-10",
    image: "/products/psychology-toolkit.jpg",
    downloadUrl: "/downloads/psychology-methods-bundle.zip"
  },
  {
    id: "ORD-2025-0003",
    title: "Өсвөр насны хүүхдийн хүмүүжил - Гарын авлага",
    price: 35000,
    purchaseDate: "2025-03-28",
    fileType: "PDF",
    fileSize: "22.8 MB",
    downloadCount: 0,
    maxDownloads: 5,
    expiryDate: "2025-06-28",
    image: "/products/adolescent-guide.jpg",
    downloadUrl: "/downloads/adolescent-parenting-guide.pdf"
  },
  {
    id: "ORD-2025-0004",
    title: "Гэр бүлийн харилцаа - Судалгааны багц",
    price: 45000,
    purchaseDate: "2025-03-15",
    fileType: "ZIP",
    fileSize: "187 MB",
    downloadCount: 3,
    maxDownloads: 5,
    expiryDate: "2025-06-15",
    image: "/products/family-relationship.jpg",
    downloadUrl: "/downloads/family-relationships-research.zip"
  },
  {
    id: "ORD-2025-0005",
    title: "Хүүхдийн тоглоомын сэтгэл зүй",
    price: 28000,
    purchaseDate: "2025-03-05",
    fileType: "PDF",
    fileSize: "18.5 MB",
    downloadCount: 5,
    maxDownloads: 5, // Reached max downloads
    expiryDate: "2025-06-05",
    image: "/products/child-play.jpg",
    downloadUrl: "/downloads/child-play-psychology.pdf"
  },
  {
    id: "ORD-2025-0006",
    title: "Сэтгэл зүйн эмчилгээний аргууд",
    price: 42000,
    purchaseDate: "2025-02-20",
    fileType: "PDF",
    fileSize: "24.7 MB",
    downloadCount: 1,
    maxDownloads: 5,
    expiryDate: "2025-02-20", // Expired
    image: "/products/therapy-methods.jpg",
    downloadUrl: "/downloads/therapy-methods.pdf"
  }
];

export default function OrderDownloadsPage() {
  // Get current date for expiry calculations
  const currentDate = new Date();
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
          <Download className="mr-2 h-8 w-8" /> Таны татаж авах материалууд
        </h1>
        <div className="flex text-sm breadcrumbs">
          <ul className="flex items-center space-x-2">
            <li><Link href="/" className="text-gray-500 hover:text-orange-500">Нүүр</Link></li>
            <li className="flex items-center gap-2 before:content-['/'] before:mx-2 before:text-gray-500">
              <Link href="/account" className="text-gray-500 hover:text-orange-500">Хэрэглэгчийн профайл</Link>
            </li>
            <li className="flex items-center gap-2 before:content-['/'] before:mx-2 before:text-gray-500">Татаж авах</li>
          </ul>
        </div>
      </div>

      <Tabs defaultValue="downloads" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="downloads" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Татаж авах материалууд
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center">
            <Package className="h-4 w-4 mr-2" />
            Захиалгын түүх
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="downloads">
          <div className="flex flex-col space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="p-4 flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Материал хайх..." 
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Файлын төрөл" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Бүгд</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="zip">ZIP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="recent">
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Эрэмбэлэх" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Хамгийн шинэ</SelectItem>
                      <SelectItem value="oldest">Хамгийн хуучин</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Downloads List */}
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Таны худалдан авсан материалууд</CardTitle>
                  <div className="text-sm text-gray-500">{downloadableItems.length} материал</div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {downloadableItems.map((item) => {
                    // Calculate if the item is expired
                    const expiryDate = new Date(item.expiryDate);
                    const isExpired = currentDate > expiryDate;
                    
                    // Check if max downloads reached
                    const isMaxDownloadsReached = item.downloadCount >= item.maxDownloads;
                    
                    // Determine item status
                    let status = "available";
                    let statusText = "Татах боломжтой";
                    let statusColor = "text-green-600 bg-green-50";
                    
                    if (isExpired) {
                      status = "expired";
                      statusText = "Хугацаа дууссан";
                      statusColor = "text-red-600 bg-red-50";
                    } else if (isMaxDownloadsReached) {
                      status = "max-reached";
                      statusText = "Татах хязгаар дууссан";
                      statusColor = "text-orange-600 bg-orange-50";
                    }
                    
                    // File type icon
                    const fileIcon = item.fileType === "PDF" 
                      ? <FileText className="h-5 w-5 text-red-500" />
                      : <FileArchive className="h-5 w-5 text-blue-500" />;
                    
                    return (
                      <div key={item.id} className="flex flex-col md:flex-row py-4 px-6">
                        <div className="md:w-1/6 mb-4 md:mb-0">
                          <div className="aspect-video md:aspect-square bg-gray-100 rounded-md overflow-hidden">
                            <img
                              src={item.image || "/product-placeholder.jpg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="md:w-5/6 md:pl-6 flex flex-col">
                          <div className="flex flex-col md:flex-row justify-between gap-4">
                            <div>
                              <h3 className="font-medium mb-1">
                                <Link href={`/product/${item.id.split('-').pop()}`} className="hover:text-orange-500">
                                  {item.title}
                                </Link>
                              </h3>
                              <div className="flex flex-wrap gap-2 mb-3">
                                <Badge variant="outline" className="flex items-center gap-1">
                                  {fileIcon} {item.fileType}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <File className="h-4 w-4" /> {item.fileSize}
                                </Badge>
                                <Badge variant="outline" className="flex items-center gap-1">
                                  <Tag className="h-4 w-4" /> {item.price.toLocaleString()}₮
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>Худалдан авсан: {new Date(item.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>Хүчинтэй хугацаа: {new Date(item.expiryDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <Badge className={`${statusColor} mb-2`}>
                                {statusText}
                              </Badge>
                              <div className="text-sm text-gray-500">
                                Татсан тоо: {item.downloadCount}/{item.maxDownloads}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Button 
                              className="bg-orange-500 hover:bg-orange-600"
                              disabled={isExpired || isMaxDownloadsReached}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Татаж авах
                            </Button>
                            <Button variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              Дэлгэрэнгүй
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                  <span>Бусад үйлдлүүд</span>
                                  <ChevronDown className="h-4 w-4 ml-2" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>
                                  Тусламж хүсэх
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Үнэлгээ өгөх
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  Татах хязгаар нэмэх
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* No Downloads View - shown when the list is empty */}
            {downloadableItems.length === 0 && (
              <Card className="text-center py-12">
                <CardContent className="flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                    <Download className="h-12 w-12 text-gray-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Таны татаж авах материал байхгүй байна</h2>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Та манай сайтаас дижитал материал худалдан авч, энд татаж авах боломжтой
                  </p>
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Link href="/products">Бүтээгдэхүүн үзэх</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        {/* Orders History Tab */}
        <TabsContent value="orders">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Захиалгын түүх</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Захиалгын дугаар
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Огноо
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дүн
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Төлбөрийн арга
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Төлөв
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Үйлдэл
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {downloadableItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.purchaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.price.toLocaleString()}₮
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Банкны шилжүүлэг
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className="bg-green-50 text-green-600">
                          Амжилттай
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/order/detail/${item.id}`} className="text-orange-500 hover:text-orange-600">
                          Дэлгэрэнгүй
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-gray-500">
                Нийт: {downloadableItems.length} захиалга
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Өмнөх</Button>
                <Button variant="outline" size="sm" className="bg-orange-50">1</Button>
                <Button variant="outline" size="sm">Дараах</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Download Information */}
      <div className="mt-12 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Татаж авах материалын талаарх мэдээлэл</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            Манай сайтаас худалдан авсан дижитал материалыг дараах нөхцөлтэйгөөр татаж авах боломжтой:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Нэг материалыг хамгийн ихдээ 5 удаа татаж авах боломжтой</li>
            <li>Материал худалдан авснаас хойш 3 сарын хугацаанд татаж авах боломжтой</li>
            <li>Татаж авсан материалыг зөвхөн хувийн хэрэгцээнд ашиглах зөвшөөрөлтэй</li>
            <li>Материалыг олшруулах, хуваалцах, борлуулахыг хориглоно</li>
          </ul>
          <p>
            Хэрэв танд материал татаж авахтай холбоотой асуудал гарвал <Link href="/support" className="text-orange-500 hover:underline">энд</Link> дарж тусламж авна уу.
          </p>
        </div>
      </div>
    </div>
  );
}