
export interface Address {
  province?: string;
  city?: string;
  street?: string;
  plate?: string;
  unit?: string;
  postalcode?: string;
}

export interface User {
  _id: Object;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  password: string;
  address?: Address;
  idNumber?: string;
  job?: string;
  role: "USER" | "ADMIN";
}

export interface RegisterFormState {
  errors: {
    name?: string[];
    email?: string[];
    phone?: string[];
    password?: string[];
    general?: string[];
  };
  success: boolean;
}

export interface LoginFormState {
  errors: {
    email?: string[];
    password?: string[];
    general?: string[];
  };
  success: boolean;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface City {
  id: number;
  title: string;
  slug: string;
  province_id: number;
  latitude: number;
  longitude: number;
}
[];

export interface Story {
  _id: string;
  title: string;
  cover: string;
  post: string;
}

export interface Product {
  _id: Object;
  title: string;
  en_title?: string;
  rating?: number;
  voter?: number;
  sizes?: string;
  thumbnail: string;
  price: number;
  discount?: number;
  discount_price?: number;
  description: string;
  recommended_percent?: number;
  guarantee?: string;
  likes?: number;
  comments?: Comment[];
  questions?: Question[];
  features?: Feature[];
  colors?: Color[];
  images?: ProductImage[];
  category: Category;
  submenuId: string;
  submenuItemId: string;
}
export interface ProductImage {
  _id: Object;
  url: string;
  productId?: Object;
}
export interface Category {
  _id: Object;
  title: string;
  icon?: string;
  cover: string[];
  hero: string[];
  banner: string[];
  href: string;
  description?: string;
  product?: Product;
  submenus: Submenu[];
}
export interface Submenu {
  _id: Object;
  title: string;
  href: string;
  categoryId?: Object;
  items: SubmenuItem[];
}
export interface SubmenuItem {
  _id: Object;
  title: string;
  href: string;
  submenuId?: Object;
}
export interface Question {
  _id: Object;
  username: string;
  body: string;
  email: string;
  date: Date;
  productId: Object;
}
export interface Feature {
  key: string;
  value: string;
  productId: Object;
}
export interface Color {
  name: string;
  hex: string;
  productId: Object;
}
export interface Order {
  _id: Object;
  totalAmount: number;
  date: Date;
  status: string;
  productId: Object;
  userId: Object;
}
export interface Article {
  _id: Object;
  title: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  source: string;
  readingTime: string;
  cover: string;
  categoryId?: Object;
}

export interface CartItem {
  _id: Object;
  title: string;
  thumbnail: string;
  guarantee: string;
  price: number;
  discount_price: number;
  discount: number;
  count: number;
}

export interface ShippingFormState {
  errors: {
    address?: string[];
    plate?: string[];
    street?: string[];
    postalcode?: string[];
    name?: string[];
    phone?: string[];
    general?: string[];
  };
  success: boolean;
}
