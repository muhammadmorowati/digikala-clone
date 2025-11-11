import { Article, Category } from "@/src/utils/types";

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
];

export const mockArticles: Article[] = [
  {
    _id: "a1",
    title: "بررسی Galaxy S24 Ultra",
    content:
      "<p>پرچم‌دار جدید سامسونگ با دوربین فوق‌العاده معرفی شد...</p>",
    author: "علی رضایی",
    publishedAt: new Date("2025-10-01"),
    tags: ["موبایل", "سامسونگ"],
    source: "https://www.digikala.com/mag",
    readingTime: "6",
    cover: "/images/articles/galaxy-s24-article.webp",
    categoryId: "1",
  },
  {
    _id: "a2",
    title: "راهنمای خرید لپ‌تاپ در سال 2025",
    content:
      "<p>برای خرید لپ‌تاپ مناسب، باید به پردازنده و رم توجه کنید...</p>",
    author: "مریم احمدی",
    publishedAt: new Date("2025-09-15"),
    tags: ["لپ‌تاپ", "راهنما"],
    source: "https://www.digikala.com/mag",
    readingTime: "5",
    cover: "/images/articles/laptop-guide.webp",
    categoryId: "2",
  },
];
