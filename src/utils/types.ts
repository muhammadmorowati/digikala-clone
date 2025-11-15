// Shared
export type ObjectId = string;

// -----------------------------
// 📍 Location / Address
// -----------------------------
export interface Location {
  latitude: number;
  longitude: number;
}

export interface Address {
  province?: string;
  city?: string;
  street?: string;
  plate?: string;
  unit?: string;
  postalcode?: string;
}

// -----------------------------
// 👤 User
// -----------------------------
export interface User {
  _id: ObjectId;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  password: string;
  role: "USER" | "ADMIN";
  address?: Address;
  idNumber?: string;
  job?: string;

  // Static system optional fields
  createdAt?: string;
  updatedAt?: string;
  refreshToken?: string;
}

// -----------------------------
// 📄 Auth Form States
// -----------------------------
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

// -----------------------------
// 🏙️ Provinces / Cities
// -----------------------------
export interface City {
  id: number;
  title: string;
  slug: string;
  province_id: number;
  latitude: number;
  longitude: number;
}

// -----------------------------
// 📰 Stories
// -----------------------------
export interface Story {
  _id: string;
  title: string;
  cover: string;
  post: string;
}

// -----------------------------
// ❓ FAQ Types
// -----------------------------
export interface GuaranteeQuestion {
  q: string;
  a: string;
}

export interface PaymentQuestion {
  q: string;
  a: string;
}

export interface ReturnQuestion {
  q: string;
  a: string;
}

// -----------------------------
// 🛒 Product (STATIC MODE)
// -----------------------------
export interface Feature {
  key: string;
  value: string;
}

export interface Color {
  name: string;
  hex: string;
}

export interface ProductImage {
  url: string;
}

export interface Product {
  _id: ObjectId;
  title: string;
  en_title?: string;

  rating?: number;
  voter?: number;
  sizes?: string[];

  price: number;
  discount?: number;
  discount_price?: number;

  description: string;
  guarantee?: string;

  recommended_percent?: number;
  likes?: number;

  thumbnail: string;
  images: string[];

  features: Feature[];
  colors: Color[];

  categoryId: string;
  submenuId?: string;
  submenuItemId?: string;

  comments?: Comment[];
  questions?: Question[];

  createdAt?: string;
  updatedAt?: string;
}

// -----------------------------
// 👇 Category / Submenu
// -----------------------------
export interface SubmenuItem {
  _id: ObjectId;
  title: string;
  href: string;
}

export interface Submenu {
  _id: ObjectId;
  title: string;
  href: string;
  items: SubmenuItem[];
}

export interface Category {
  _id: ObjectId;
  title: string;
  href: string;

  icon?: string;
  description?: string;

  cover: string[];
  hero: string[];
  banner: string[];

  submenus: Submenu[];
}

// -----------------------------
// 💬 Product Comments / Questions
// -----------------------------
export interface Question {
  _id: ObjectId;
  username: string;
  body: string;
  email: string;
  date: string;
}

// -----------------------------
// 🧾 Orders (STATIC MODE)
// -----------------------------
export interface Order {
  _id: ObjectId;
  totalAmount: number;
  date: string;
  status: string;
  productIds: string[];
  userId: string;
}

// -----------------------------
// 📰 Articles
// -----------------------------
export interface Article {
  _id: ObjectId;
  title: string;
  content: string;
  author: string;
  publishedAt: string;
  tags: string[];
  source: string;
  readingTime: string;
  cover: string;
  categoryId?: ObjectId;
  comment?: any[];
}

// -----------------------------
// 🛒 Cart Item
// -----------------------------
export interface CartItem {
  _id: ObjectId;
  title: string;
  thumbnail: string;
  guarantee: string;
  price: number;
  discount_price: number;
  discount: number;
  count: number;
}

// -----------------------------
// 🚚 Shipping
// -----------------------------
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
