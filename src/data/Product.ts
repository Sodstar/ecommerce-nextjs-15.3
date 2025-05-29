// Types
export interface Product {
  _id?: string;  // Add this property
  id: string;
  barcode?: string;
  code?: string;
  title: string;
  name?: string;
  price: number;
  image?: string;
  category?: string | { name?: string };
  brand?: string | { name?: string };
}

export interface CartItem extends Product {
  quantity: number;
}