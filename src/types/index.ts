export type BookCategory =
  | 'Fiction'
  | 'Non-Fiction'
  | 'Academic'
  | 'Technology'
  | "Children's Books"
  | 'Biography'
  | 'History'
  | 'Self-Help';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export type BookFormat = 'Paperback' | 'Hardcover' | 'E-Book' | 'Audiobook';

export interface BookReview {
  id: string;
  bookId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  price: number;
  discount: number; // percentage (e.g. 15 for 15% off)
  rating: number;
  reviewCount: number;
  description: string;
  synopsis?: string;
  coverImage: string;
  stockStatus: StockStatus;
  stockQuantity: number;
  isbn: string;
  publisher: string;
  publishedYear: number;
  pages: number;
  language: string;
  format: BookFormat;
  featured?: boolean;
  bestSeller?: boolean;
  dealOfTheDay?: boolean;
}

export interface CartItem {
  book: Book;
  quantity: number;
  selectedFormat: BookFormat;
}

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
  format: BookFormat;
}

export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: string;
  shippingFee: number;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'Credit Card' | 'PayPal' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending';
  createdAt: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  phone?: string;
  address?: ShippingAddress;
  createdAt: string;
}

export interface CategoryInfo {
  id: string;
  name: BookCategory;
  slug: string;
  description: string;
  image: string;
  iconName: string;
  bookCount?: number;
}

export interface FilterState {
  searchQuery: string;
  category: string; // 'all' or specific
  minPrice: number;
  maxPrice: number;
  minRating: number;
  stockStatus: 'all' | 'in-stock' | 'on-sale';
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc' | 'newest' | 'discount-desc';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}
