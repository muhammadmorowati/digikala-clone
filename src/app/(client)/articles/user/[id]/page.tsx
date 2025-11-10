import ArticleCard from "@/src/components/article/ArticleCard";
import ScrollUp from "@/src/components/footer/ScrollUp";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/src/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/src/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/src/components/ui/select";
import { Article } from "@/src/utils/types";
import { Library, ChevronLeft, ArrowUp } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";


// 🧩 Mock Articles
const mockArticles: Article[] = [
  {
    _id: "1" as any,
    title: "10 تکنولوژی جذاب موبایل در سال 2025",
    author: "علی رضایی",
    content: "<p>این مقاله درباره تکنولوژی‌های جدید در دنیای موبایل است...</p>",
    cover: "/images/articles/mobile-tech.webp",
    publishedAt: new Date("2025-10-20"),
    tags: ["موبایل", "فناوری"],
    source: "https://www.digikala.com/mag",
    readingTime: "5",
  },
  {
    _id: "2" as any,
    title: "راهنمای خرید لپ‌تاپ مخصوص برنامه‌نویسی",
    author: "علی رضایی",
    content: "<p>در این مقاله بهترین لپ‌تاپ‌های برنامه‌نویسی را بررسی می‌کنیم...</p>",
    cover: "/images/articles/laptop-guide.webp",
    publishedAt: new Date("2025-10-12"),
    tags: ["لپ‌تاپ", "راهنما"],
    source: "https://www.digikala.com/mag",
    readingTime: "7",
  },
  {
    _id: "3" as any,
    title: "بررسی گوشی Galaxy S24 Ultra",
    author: "مریم احمدی",
    content: "<p>گوشی جدید سامسونگ با امکانات فوق‌العاده معرفی شد...</p>",
    cover: "/images/articles/galaxy-s24.webp",
    publishedAt: new Date("2025-10-05"),
    tags: ["موبایل", "سامسونگ"],
    source: "https://www.digikala.com/mag",
    readingTime: "6",
  },
  {
    _id: "4" as any,
    title: "ترفندهای افزایش عمر باتری لپ‌تاپ",
    author: "علی رضایی",
    content: "<p>در این مقاله یاد می‌گیریم چطور عمر باتری لپ‌تاپ خود را افزایش دهیم...</p>",
    cover: "/images/articles/laptop-battery.webp",
    publishedAt: new Date("2025-09-28"),
    tags: ["لپ‌تاپ", "نکات مفید"],
    source: "https://www.digikala.com/mag",
    readingTime: "4",
  },
];

// 🧭 Metadata (static, uses author name)
export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const decodedID = decodeURIComponent(id.replaceAll("-", " "));
  return {
    title: { absolute: `${decodedID} • نویسنده در دیجی‌کالا مگ` },
  };
}

const ARTICLES_PER_PAGE = 8;

export default async function AuthorPage({
  params: { id },
  searchParams: { page = "1" },
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const decodedID = decodeURIComponent(id.replaceAll("-", " "));
  const currentPage = parseInt(page, 10) || 1;

  // ✨ Filter mock articles by author name
  const authorArticles = mockArticles.filter(
    (article) => article.author === decodedID
  );

  const totalArticles = authorArticles.length;
  const totalPages = Math.ceil(totalArticles / ARTICLES_PER_PAGE);

  // ✨ Apply pagination manually
  const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
  const paginatedArticles = authorArticles.slice(
    startIndex,
    startIndex + ARTICLES_PER_PAGE
  );

  return (
    <div className="grid-cols-12 grid gap-5 px-4 py-4">
      {/* Sidebar icon */}
      <div className="shadow-sm text-white col-span-1 max-lg:hidden sticky top-32 right-7 w-16 h-16 flex items-center justify-center bg-sky-500">
        <Library size={35} />
      </div>

      {/* Main content */}
      <div className="col-span-12 lg:col-span-11 py-8 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="text-xs">
              <BreadcrumbLink href="/articles">خانه</BreadcrumbLink>
            </BreadcrumbItem>
            <ChevronLeft className="text-red-500" size={15} />
            <BreadcrumbItem className="text-xs">
              <BreadcrumbPage>نویسنده: {decodedID}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Author Info */}
        <div className="shadow border rounded-md p-8 my-8">
          <div className="flex items-center gap-8">
            <Image
              alt="default_author_profile"
              width={60}
              height={60}
              src="/default_author.jpg"
              className="rounded-full"
            />
            <h1 className="text-3xl max-lg:text-2xl font-bold text-neutral-600 dark:text-neutral-100">
              {decodedID}
            </h1>
          </div>
        </div>

        {/* Sorting & Count */}
        <div className="mb-10 flex justify-between items-center">
          <div className="flex gap-3 items-center">
            <p className="text-neutral-500 text-sm">مرتب سازی:</p>
            <div className="border-b">
              <Select>
                <SelectTrigger
                  style={{ direction: "rtl" }}
                  className="sm:w-[180px] !border-none outline-none focus:ring-0 focus:ring-transparent"
                >
                  <SelectValue placeholder="جدیدترین" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="newest">جدیدترین</SelectItem>
                    <SelectItem value="mostViewed">پربازدیدترین</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-100">
            <span className="text-neutral-700 dark:text-neutral-100">
              {totalArticles}
            </span>{" "}
            مطلب موجود است.
          </div>
        </div>

        {/* Articles List */}
        <div className="flex gap-5 flex-wrap">
          {paginatedArticles.length > 0 ? (
            paginatedArticles.map((article) => (
              <ArticleCard key={article._id.toString()} article={article} />
            ))
          ) : (
            <div className="text-center w-full text-neutral-500">
              هیچ مقاله‌ای یافت نشد.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-20">
            <Pagination>
              <PaginationContent>
                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        href={`?page=${index + 1}`}
                        isActive={index + 1 === currentPage}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                {totalPages > 5 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href={`?page=${totalPages}`}>
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* ScrollUp */}
      <ScrollUp className="max-lg:hidden z-20 cursor-pointer text-white fixed bottom-10 right-9 w-12 h-14 rounded-md flex items-center justify-center bg-sky-400">
        <ArrowUp size={30} />
      </ScrollUp>
    </div>
  );
}
