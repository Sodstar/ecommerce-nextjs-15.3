import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarIcon, Clock, Tag, User, ChevronLeft, Share2, BookmarkPlus, Heart, MessageCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Import the mock data from the parent blog page
// In a real application, you would fetch this data from your API or database
import { blogPosts, blogCategories } from "./_data";

export default function BlogPostPage({ params }: { params: { id: string } }) {
  // Find the blog post with the matching ID
  const post = blogPosts.find(post => post.id.toString() === params.id);
  
  // If the post doesn't exist, return a 404 page
  if (!post) {
    notFound();
  }

  // Find related posts (same categories)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id) // Exclude current post
    .filter(p => p.categories.some(cat => post.categories.includes(cat))) // Find posts with matching categories
    .slice(0, 3); // Limit to 3 related posts

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content - Blog Post */}
        <div className="md:w-3/4">
          {/* Breadcrumbs Navigation */}
          <div className="flex items-center mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-orange-500">Нүүр</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-orange-500">Блог</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{post.title}</span>
          </div>

          {/* Post Header */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category, i) => (
                <Badge key={i} variant="outline" className="bg-orange-50">
                  <Link href={`/blog/category/${category}`}>
                    {category}
                  </Link>
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.image || '/blog/placeholder.jpg'} 
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <p>
              Хүүхдийн сэтгэл зүйн хөгжилд эцэг эхийн оролцоо, гэр бүлийн орчин хэрхэн нөлөөлдөг талаар судалгааны үр дүнг танилцуулж байна. Энэхүү судалгааг сүүлийн 5 жилийн хугацаанд хийсэн бөгөөд 3-12 насны 500 гаруй хүүхдийг хамруулсан.
            </p>
            
            <h2>Гэр бүлийн орчны нөлөө</h2>
            <p>
              Судалгаанаас харахад гэр бүлийн орчин нь хүүхдийн сэтгэл зүйн хөгжилд хамгийн их нөлөө үзүүлдэг гол хүчин зүйл болох нь тогтоогдсон. Тухайлбал:
            </p>
            <ul>
              <li>Эцэг эхийн халуун дулаан, ойр дотно харилцаа хүүхдийн сэтгэл зүйн эрүүл мэндэд эерэгээр нөлөөлдөг</li>
              <li>Гэр бүлийн гишүүдийн хооронд үүссэн зөрчил, хүчирхийллийн уур амьсгал хүүхдийн сэтгэл зүйн хөгжилд сөргөөр нөлөөлдөг</li>
              <li>Хүүхдийн үзэл бодолд хүндэтгэлтэй хандах нь тэдний өөртөө итгэх итгэлийг нэмэгдүүлдэг</li>
            </ul>
            
            <h2>Эцэг эхийн оролцоо</h2>
            <p>
              Эцэг эхийн идэвхтэй оролцоо нь хүүхдийн сэтгэл зүйн хөгжилд чухал нөлөө үзүүлдэг. Тухайлбал:
            </p>
            <ul>
              <li>Хүүхэдтэйгээ чанартай цаг өнгөрүүлэх нь тэдний танин мэдэхүйн болон нийгмийн харилцааны чадварыг сайжруулдаг</li>
              <li>Эцэг эхийн дэмжлэг нь хүүхдийн сэтгэл хөдлөлөө зохицуулах чадварыг хөгжүүлэхэд тусалдаг</li>
              <li>Хүүхдэд зохистой хязгаар тогтоож өгөх нь тэдний өөрийгөө хянах чадварыг нэмэгдүүлдэг</li>
            </ul>
            
            <blockquote>
              "Хүүхдийн сэтгэл зүйн хөгжилд гэр бүлийн орчин болон эцэг эхийн оролцоо нь онцгой чухал нөлөөтэй. Эцэг эхчүүд хүүхдийнхээ сэтгэл зүйн эрүүл мэндэд анхаарал хандуулж, тэдэнтэй харилцах, ойлголцох нь чухал юм."
            </blockquote>
            
            <h2>Дүгнэлт</h2>
            <p>
              Хүүхдийн сэтгэл зүйн хөгжилд нөлөөлөх хүчин зүйлсийг судлах нь тэдний эрүүл мэндийг дэмжих, асрамж халамжийг сайжруулахад чухал ач холбогдолтой. Эцэг эхчүүд хүүхдийнхээ сэтгэл зүйн хэрэгцээг ойлгож, дэмжлэг үзүүлэх нь тэдний ирээдүйн амжилт, аз жаргалтай амьдралын үндэс суурь болно.
            </p>
          </div>

          {/* Social Sharing and Interaction */}
          <div className="flex justify-between items-center py-4 border-t border-b mb-8">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>123</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>12</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <BookmarkPlus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Author Bio */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={`/authors/${post.author.split(' ')[0].toLowerCase()}.jpg`} />
                  <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg mb-1">{post.author}</h3>
                  <p className="text-sm text-gray-600 mb-3">Сэтгэл судлаач, Зөвлөх</p>
                  <p className="text-sm">
                    {post.author} нь сэтгэл судлалын чиглэлээр 10 гаруй жил ажиллаж байгаа туршлагатай мэргэжилтэн бөгөөд хүүхдийн сэтгэл зүй, гэр бүлийн харилцаа, хүмүүжлийн асуудлаар судалгаа хийж, нийтлэл бичдэг.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Холбоотой нийтлэлүүд</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((relatedPost, i) => (
                <Card key={i} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-40 relative">
                    <img 
                      src={relatedPost.image || '/blog/placeholder.jpg'}
                      alt={relatedPost.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-base line-clamp-2">
                      <Link href={`/blog/${relatedPost.id}`} className="hover:text-orange-600 transition-colors">
                        {relatedPost.title}
                      </Link>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <p className="text-sm text-gray-500">
                      {new Date(relatedPost.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Back to Blog */}
          <div className="flex justify-center">
            <Button variant="outline" className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <Link href="/blog">Бүх нийтлэл рүү буцах</Link>
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="md:w-1/4">
          {/* Author */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Зохиогч</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarImage src={`/authors/${post.author.split(' ')[0].toLowerCase()}.jpg`} />
                <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <h3 className="font-bold mb-1">{post.author}</h3>
              <p className="text-sm text-gray-600 mb-3">Сэтгэл судлаач, Зөвлөх</p>
              <Button variant="outline" size="sm" className="w-full">Бүх нийтлэлүүд</Button>
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

          {/* Popular Posts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Эрэлттэй нийтлэлүүд</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul>
                {blogPosts.slice(0, 4).map((post, i) => (
                  <li key={i} className={i !== 3 ? 'border-b' : ''}>
                    <Link href={`/blog/${post.id}`} className="flex items-start p-3 hover:bg-orange-50">
                      <div className="flex-shrink-0 h-16 w-16 mr-3">
                        <img 
                          src={post.image || '/blog/placeholder.jpg'}
                          alt={post.title}
                          className="object-cover w-full h-full rounded"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium line-clamp-2 hover:text-orange-600">
                          {post.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Tags Cloud */}
          <Card>
            <CardHeader>
              <CardTitle>Түлхүүр үгс</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {['Хүүхэд', 'Эцэг эх', 'Гэр бүл', 'Хөгжил', 'Сэтгэл зүй', 'Хүмүүжил', 'Судалгаа', 'Арга зүй', 'Өсвөр нас', 'Зөвлөгөө', 'Боловсрол', 'Чадвар'].map((tag, i) => (
                  <Badge key={i} variant="secondary" className="hover:bg-orange-100 cursor-pointer">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}