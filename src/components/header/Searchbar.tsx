import SearchbarForm from "./SearchbarForm";
import { Product } from "@/src/utils/types";

// 🧩 Mock product data (for local development)
const mockProducts: Product[] = [
  {
    _id: "p1" as any,
    title: "گوشی سامسونگ Galaxy S24 Ultra",
    en_title: "Samsung Galaxy S24 Ultra",
    rating: 4.9,
    voter: 250,
    thumbnail: "/images/products/galaxy-s24.webp",
    price: 58999000,
    discount: 10,
    discount_price: 52999000,
    description: "قدرتمندترین گوشی سامسونگ با دوربین فوق‌العاده",
    recommended_percent: 95,
    guarantee: "۱۸ ماه گارانتی سامسونگ",
    category: {
      _id: "1" as any,
      title: "موبایل",
      href: "/category/mobile",
      cover: ["/images/categories/mobile-cover.webp"],
      hero: ["/images/categories/mobile-hero.webp"],
      banner: ["/images/categories/mobile-banner.webp"],
    },
    submenuId: "11",
    submenuItemId: "111",
  },
  {
    _id: "p2" as any,
    title: "لپ‌تاپ ایسوس Vivobook 15",
    en_title: "Asus Vivobook 15",
    rating: 4.5,
    voter: 180,
    thumbnail: "/images/products/vivobook15.webp",
    price: 34999000,
    discount: 8,
    discount_price: 31999000,
    description: "لپ‌تاپی قدرتمند برای کار و تحصیل",
    recommended_percent: 90,
    guarantee: "۱۲ ماه گارانتی ایسوس",
    category: {
      _id: "2" as any,
      title: "لپ‌تاپ",
      href: "/category/laptop",
      cover: ["/images/categories/laptop-cover.webp"],
      hero: ["/images/categories/laptop-hero.webp"],
      banner: ["/images/categories/laptop-banner.webp"],
    },
    submenuId: "21",
    submenuItemId: "211",
  },
];

export default function Searchbar({ placeholder }: { placeholder?: string }) {
  const products = mockProducts;

  return <SearchbarForm placeholder={placeholder} products={products} />;
}
