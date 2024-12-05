export interface Product {
  name: string;
  slug: string;
  category: string;
  images: string[];
  price: string;
  brand: string;
  rating: string;
  numReviews: number;
  stock: number;
  description: string;
  isFeatured?: boolean;
  banner?: string;
} 