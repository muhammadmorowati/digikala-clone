import ArticleForm from "@/src/components/admin/ArticleForm";
import PageHeader from "@/src/components/admin/PageHeader";
import { Category } from "@/src/utils/types";

// 🧩 Mock Categories — replace with real data later
const mockCategories: Category[] = [
  {
    _id: "1" as any,
    title: "موبایل",
    href: "/category/mobile",
    cover: ["/images/categories/mobile-cover.webp"],
    hero: ["/images/categories/mobile-hero.webp"],
    banner: ["/images/categories/mobile-banner.webp"],
    submenus: [],
  },
  {
    _id: "2" as any,
    title: "لپ‌تاپ",
    href: "/category/laptop",
    cover: ["/images/categories/laptop-cover.webp"],
    hero: ["/images/categories/laptop-hero.webp"],
    banner: ["/images/categories/laptop-banner.webp"],
    submenus: [],
  },
  {
    _id: "3" as any,
    title: "لوازم خانگی",
    href: "/category/home-appliances",
    cover: ["/images/categories/home-appliances-cover.webp"],
    hero: ["/images/categories/home-appliances-hero.webp"],
    banner: ["/images/categories/home-appliances-banner.webp"],
    submenus: [],
  },
];

export default async function NewCategoryPage() {
  // ✅ No DB needed — using static mock data
  const categories = mockCategories;

  return (
    <>
      <PageHeader title="افزودن مقاله جدید" />
      <ArticleForm categories={categories} />
    </>
  );
}
