
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    image: string;
    author: string;
    sales: number;
    rating: number;
  }
  
  interface Category {
    id: string;
    name: string;
    icon: string;
    count: number;
  }
  
  export const featuredProducts: Product[] = [
    {
      id: '1',
      title: 'Premium UI Kit',
      description: 'A comprehensive UI kit with 300+ components for modern web applications',
      price: 49.99,
      category: 'UI Kits',
      image: '/api/placeholder/600/400',
      author: 'DesignLab',
      sales: 1240,
      rating: 4.8
    },
    {
      id: '2',
      title: 'eCommerce Template',
      description: 'Complete Next.js template for online stores with shopping cart functionality',
      price: 79.99,
      category: 'Templates',
      image: '/api/placeholder/600/400',
      author: 'WebCrafters',
      sales: 856,
      rating: 4.9
    },
    {
      id: '3',
      title: 'Icon Pack Pro',
      description: '1000+ vector icons in multiple styles and formats',
      price: 29.99,
      category: 'Icons',
      image: '/api/placeholder/600/400',
      author: 'IconWorks',
      sales: 2150,
      rating: 4.7
    },
    {
      id: '4',
      title: 'Digital Marketing Toolkit',
      description: 'Social media templates, ad designs, and email templates for marketers',
      price: 59.99,
      category: 'Marketing',
      image: '/api/placeholder/600/400',
      author: 'GrowthGurus',
      sales: 785,
      rating: 4.6
    },
    {
      id: '5',
      title: 'Photography Preset Collection',
      description: 'Professional Lightroom presets for portrait and landscape photography',
      price: 39.99,
      category: 'Photography',
      image: '/api/placeholder/600/400',
      author: 'LensLegends',
      sales: 1560,
      rating: 4.8
    },
    {
      id: '6',
      title: 'Font Bundle',
      description: '25 premium fonts for branding, web design, and print projects',
      price: 69.99,
      category: 'Fonts',
      image: '/api/placeholder/600/400',
      author: 'TypeFoundry',
      sales: 920,
      rating: 4.7
    }
  ];
  
  export const categories: Category[] = [
    { id: '1', name: 'Айдас, уур бухимдал, ганцаардлыг үнэлэх', icon: '😡', count: 24 },
    { id: '2', name: 'Анги хамт олныг судлах', icon: '🏫', count: 98 },
    { id: '3', name: 'Донтолт хамаарлыг судлах', icon: '🫩', count: 50 },
    { id: '4', name: 'Мэргэжил сонголт', icon: '💼', count: 87 },
    { id: '5', name: 'Танин мэдэхүйн процесс ', icon: '💡', count: 23 },
    { id: '6', name: 'Хувь хүний онцлог', icon: '🧍', count: 12 },
    { id: '7', name: 'Сэтгэл хөдлөлийн оюун ухаан /EQ/', icon: '😄', count: 78 },
  ];