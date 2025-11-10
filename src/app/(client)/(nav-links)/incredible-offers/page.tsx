import MarketOffers from "@/src/components/home/MarketOffers";
import Offers from "@/src/components/home/Offers";
import SelectedProducts from "@/src/components/home/SelectedProducts";
import IncredibleOffersCategoriesSlider from "@/src/components/incredible-offers/IncredibleOffersCategoriesSlider";
import IncredibleOffersProductsSlider from "@/src/components/incredible-offers/IncredibleOffersProductsSlider";
import { Category, Product } from "@/src/utils/types";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// 🧩 Mock Categories
const mockCategories: Category[] = [
  {
    _id: "1" as any,
    title: "موبایل",
    href: "/category/mobile",
    icon: "/icons/phone.svg",
    cover: ["/images/phone-cover.jpg"],
    hero: ["/images/hero-mobile.jpg"],
    banner: ["/images/banner-mobile.jpg"],
    submenus: [
      {
        _id: "s1" as any,
        title: "گوشی سامسونگ",
        href: "/category/mobile/samsung",
        items: [
          { _id: "i1" as any, title: "Galaxy S24", href: "/product/galaxy-s24" },
          { _id: "i2" as any, title: "Galaxy A55", href: "/product/galaxy-a55" },
        ],
      },
    ],
  },
  {
    _id: "2" as any,
    title: "لپ‌تاپ",
    href: "/category/laptop",
    icon: "/icons/laptop.svg",
    cover: ["/images/laptop-cover.jpg"],
    hero: ["/images/hero-laptop.jpg"],
    banner: ["/images/banner-laptop.jpg"],
    submenus: [],
  },
];

// 🧩 Mock Products
const mockProducts: Product[] = [
  {
    _id: "p1" as any,
    title: "گوشی موبایل سامسونگ مدل Galaxy S24 Ultra",
    thumbnail: "/images/galaxy-s24.jpg",
    price: 52000000,
    discount: 8,
    discount_price: 47800000,
    rating: 4.8,
    voter: 340,
    description: "گوشی پرچمدار سامسونگ با طراحی جدید و دوربین قدرتمند.",
    recommended_percent: 96,
    category: mockCategories[0],
    submenuId: "mobile",
    submenuItemId: "samsung",
  },
  {
    _id: "p2" as any,
    title: "لپ‌تاپ اپل MacBook Air M3 2024",
    thumbnail: "/images/macbook-air.jpg",
    price: 85000000,
    discount: 5,
    discount_price: 80750000,
    rating: 4.9,
    voter: 210,
    description: "لپ‌تاپ سبک و قدرتمند اپل با چیپ M3 و شارژدهی طولانی.",
    recommended_percent: 92,
    category: mockCategories[1],
    submenuId: "laptop",
    submenuItemId: "macbook",
  },
  {
    _id: "p3" as any,
    title: "هدفون بی‌سیم سونی WH-1000XM5",
    thumbnail: "/images/sony-headphone.jpg",
    price: 18000000,
    discount: 12,
    discount_price: 15840000,
    rating: 4.7,
    voter: 150,
    description: "هدفون نویزکنسلینگ فوق‌العاده از برند سونی.",
    recommended_percent: 89,
    category: mockCategories[0],
    submenuId: "accessories",
    submenuItemId: "headphones",
  },
];

export default async function IncredibleOffers() {
  // 🧮 Filter Discounted Products
  const discountProducts = mockProducts.filter((p) => (p.discount ?? 0) > 0);

  // 🧮 Sort by discount
  const sortedByDiscount = discountProducts
    .slice()
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0));

  // 🧮 Sort by rating (optional)
  const sortedByRating = discountProducts
    .slice()
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  return (
    <div className="flex flex-col gap-10">
      {/* HERO SECTION */}
      <div className="w-full">
        <div className="w-full h-16 bg-rose-500 flex items-center justify-center">
          <Image
            alt="incredible-offers"
            src="/incredible-offers/incredible-offers.svg"
            width={600}
            height={600}
          />
        </div>
        <Link href="/products/1">
          <Image
            alt="incredible-offers-banner"
            src="/incredible-offers/incredible-offers-banner.webp"
            width={1500}
            height={1500}
            className="w-full lg:h-80 h-64 object-cover"
            title="incredible-offers-banner"
          />
        </Link>
      </div>

      {/* PRODUCTS SLIDER */}
      <div className="relative lg:px-5 overflow-hidden bg-rose-600 lg:rounded-2xl py-4 lg:mx-3">
        <div className="absolute brightness-200 right-0 top-0 w-full bg-[url('/nav-links-svg.svg')] h-36 opacity-80"></div>
        <div className="flex items-center gap-2 mb-5 max-lg:mx-5">
          <Sparkles size={20} className="text-white" />
          <p className="font-irsansb text-white">
            <span className="relative">شگفت‌انگیز روز</span>
          </p>
        </div>
        <IncredibleOffersProductsSlider products={sortedByDiscount} />
      </div>

      {/* CATEGORIES SLIDER */}
      <IncredibleOffersCategoriesSlider categories={mockCategories} />

      {/* OFFERS */}
      <Offers products={sortedByRating} />

      {/* MARKET OFFERS */}
      <div className="-mt-5">
        <MarketOffers />
      </div>

      {/* SELECTED PRODUCTS */}
      <div className="-mt-10">
        <SelectedProducts products={mockProducts} />
      </div>
    </div>
  );
}
