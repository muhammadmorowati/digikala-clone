import ArticleForm from "@/src/components/admin/ArticleForm";
import PageHeader from "@/src/components/admin/PageHeader";
import { Article, Category } from "@/src/utils/types";

// 🧩 Mock data for articles and categories
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
];

const mockArticles: Article[] = [
  {
    _id: "a1" as any,
    title: "بررسی Galaxy S24 Ultra",
    content:
      "<p>پرچم‌دار جدید سامسونگ با دوربین فوق‌العاده معرفی شد...</p>",
    author: "علی رضایی",
    publishedAt: new Date("2025-10-01"),
    tags: ["موبایل", "سامسونگ"],
    source: "https://www.digikala.com/mag",
    readingTime: "6",
    cover: "/images/articles/galaxy-s24-article.webp",
    categoryId: "1" as any,
  },
  {
    _id: "a2" as any,
    title: "راهنمای خرید لپ‌تاپ در سال 2025",
    content: "<p>برای خرید لپ‌تاپ مناسب، باید به پردازنده و رم توجه کنید...</p>",
    author: "مریم احمدی",
    publishedAt: new Date("2025-09-15"),
    tags: ["لپ‌تاپ", "راهنما"],
    source: "https://www.digikala.com/mag",
    readingTime: "5",
    cover: "/images/articles/laptop-guide.webp",
    categoryId: "2" as any,
  },
];

export default async function EditArticlePage({
  params: { id },
}: {
  params: { id: string };
}) {
  // Find article by id (mock)
  const article = mockArticles.find((a) => a._id.toString() === id);

  // Handle article not found
  if (!article) {
    return (
      <div className="p-6 text-center text-red-600">
        مقاله‌ای با این شناسه یافت نشد.
      </div>
    );
  }

  return (
    <>
      <PageHeader title="ویرایش مقاله" />
      <ArticleForm article={article} categories={mockCategories} />
    </>
  );
}
