import { Category, Product } from "@/src/utils/types";

export const mockCategories: Category[] = [
  {
    _id: "1",
    title: "موبایل",
    href: "/category/mobile",
    icon: "/icons/phone.svg",
    cover: ["/images/phone-cover.jpg"],
    hero: ["/images/hero-mobile.jpg"],
    banner: ["/images/banner-mobile.jpg"],
    submenus: [
      {
        _id: "s1",
        title: "گوشی سامسونگ",
        href: "/category/mobile/samsung",
        items: [
          { _id: "i1", title: "Galaxy S24", href: "/product/galaxy-s24" },
          { _id: "i2", title: "Galaxy A55", href: "/product/galaxy-a55" },
        ],
      },
    ],
  },
  {
    _id: "2",
    title: "لپ‌تاپ",
    href: "/category/laptop",
    icon: "/icons/laptop.svg",
    cover: ["/images/laptop-cover.jpg"],
    hero: ["/images/hero-laptop.jpg"],
    banner: ["/images/banner-laptop.jpg"],
    submenus: [],
  },
];

export const mockProducts: Product[] = [
  {
    _id: "p1",
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
];
