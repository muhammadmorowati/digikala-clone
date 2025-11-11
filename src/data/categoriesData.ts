import { Category } from "@/src/utils/types";

export const mockCategories: Category[] = [
  {
    _id: "1",
    title: "موبایل",
    href: "/category/mobile",
    cover: ["/images/categories/mobile-cover.webp"],
    hero: ["/images/categories/mobile-hero.webp"],
    banner: ["/images/categories/mobile-banner.webp"],
    submenus: [],
  },
  {
    _id: "2",
    title: "لپ‌تاپ",
    href: "/category/laptop",
    cover: ["/images/categories/laptop-cover.webp"],
    hero: ["/images/categories/laptop-hero.webp"],
    banner: ["/images/categories/laptop-banner.webp"],
    submenus: [],
  },
  {
    _id: "3",
    title: "لوازم خانگی",
    href: "/category/home-appliances",
    cover: ["/images/categories/home-appliances-cover.webp"],
    hero: ["/images/categories/home-appliances-hero.webp"],
    banner: ["/images/categories/home-appliances-banner.webp"],
    submenus: [],
  },
];
