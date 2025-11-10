import Navbar from "./Navbar";
import Topbar from "./Topbar";
import { Category } from "@/src/utils/types";

// 🧩 Mock category data (instead of DB)
const mockCategories: Category[] = [
  {
    _id: "1" as any,
    title: "موبایل",
    icon: "/icons/mobile.svg",
    href: "/category/mobile",
    cover: ["/images/categories/mobile-cover.webp"],
    hero: ["/images/categories/mobile-hero.webp"],
    banner: ["/images/categories/mobile-banner.webp"],
    submenus: [
      {
        _id: "11" as any,
        title: "گوشی سامسونگ",
        href: "/category/mobile/samsung",
        items: [
          {
            _id: "111" as any,
            title: "Galaxy S24",
            href: "/category/mobile/samsung/galaxy-s24",
          },
          {
            _id: "112" as any,
            title: "Galaxy A55",
            href: "/category/mobile/samsung/galaxy-a55",
          },
        ],
      },
      {
        _id: "12" as any,
        title: "گوشی اپل",
        href: "/category/mobile/apple",
        items: [
          {
            _id: "121" as any,
            title: "iPhone 15 Pro",
            href: "/category/mobile/apple/iphone-15-pro",
          },
        ],
      },
    ],
  },
  {
    _id: "2" as any,
    title: "لپ‌تاپ",
    icon: "/icons/laptop.svg",
    href: "/category/laptop",
    cover: ["/images/categories/laptop-cover.webp"],
    hero: ["/images/categories/laptop-hero.webp"],
    banner: ["/images/categories/laptop-banner.webp"],
    submenus: [
      {
        _id: "21" as any,
        title: "ایسوس",
        href: "/category/laptop/asus",
        items: [
          {
            _id: "211" as any,
            title: "Vivobook 15",
            href: "/category/laptop/asus/vivobook15",
          },
        ],
      },
    ],
  },
];

export default function Header() {
  // 🧩 Use mock data instead of database
  const categories = mockCategories;

  return (
    <>
      <Topbar />
      <Navbar categories={categories} />
    </>
  );
}
