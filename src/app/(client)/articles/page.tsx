import ArticleCard from "@/src/components/article/ArticleCard";
import ScrollUp from "@/src/components/footer/ScrollUp";
import { Article } from "@/src/utils/types";
import { Library, ArrowUp } from "lucide-react";

// 🧩 Mock Articles
const mockArticles: Article[] = [
  {
    _id: "1" as any,
    title: "10 تکنولوژی جذاب موبایل در سال 2025",
    author: "علی رضایی",
    content: "<p>در این مقاله جدیدترین فناوری‌های موبایل را مرور می‌کنیم...</p>",
    cover: "/images/articles/mobile-tech.webp",
    publishedAt: "2025-10-20",
    tags: ["موبایل", "فناوری"],
    source: "https://www.digikala.com/mag",
    readingTime: "5",
  },
  {
    _id: "2" as any,
    title: "بررسی لپ‌تاپ‌های مخصوص برنامه‌نویسی",
    author: "مریم احمدی",
    content: "<p>بهترین لپ‌تاپ‌ها برای توسعه‌دهندگان در سال 2025...</p>",
    cover: "/images/articles/laptop-guide.webp",
    publishedAt: "2025-10-15",
    tags: ["لپ‌تاپ", "راهنما"],
    source: "https://www.digikala.com/mag",
    readingTime: "6",
  },
  {
    _id: "3" as any,
    title: "ترفندهایی برای افزایش عمر باتری گوشی",
    author: "علی رضایی",
    content: "<p>با چند روش ساده می‌توانید عمر باتری موبایل خود را بیشتر کنید...</p>",
    cover: "/images/articles/battery-tips.webp",
    publishedAt: "2025-09-29",
    tags: ["باتری", "موبایل", "نکات"],
    source: "https://www.digikala.com/mag",
    readingTime: "4",
  },
];

export default async function ArticlesPage() {
  // No database connection — just static data
  const articles = mockArticles;

  return (
    <div>
      <div className="grid-cols-12 lg:grid gap-5 px-4 py-4 flex items-start justify-between">
        {/* Sidebar icon */}
        <div className="shadow-sm text-white col-span-1 max-lg:hidden sticky top-32 right-7 w-16 h-16 flex items-center justify-center bg-sky-500">
          <Library size={35} />
        </div>

        {/* Articles List */}
        <div className="col-span-12 lg:col-span-11 lg:border border-neutral-100 py-8 lg:px-8 rounded-md lg:shadow-md">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-8">
            مقالات
          </h1>

          <div className="flex gap-5 flex-wrap">
            {articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article._id.toString()} article={article} />
              ))
            ) : (
              <div className="text-neutral-500 text-center w-full">
                مقاله‌ای یافت نشد.
              </div>
            )}
          </div>
        </div>

        {/* ScrollUp Section */}
        <ScrollUp className="max-lg:hidden z-20 cursor-pointer text-white fixed bottom-10 right-9 w-12 h-14 rounded-md flex items-center justify-center bg-sky-400">
          <ArrowUp size={30} />
        </ScrollUp>
      </div>
    </div>
  );
}
