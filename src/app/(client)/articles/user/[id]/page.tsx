
import ArticleCard from "@/components/article/ArticleCard";
import ScrollUp from "@/components/footer/ScrollUp";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationEllipsis } from "@/components/ui/pagination";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select";
import { Article } from "@/utils/types";
import { Library, ChevronLeft, ArrowUp } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const decodedID = decodeURIComponent(id.replaceAll("-", " "));

  return {
    title: { absolute: `${decodedID}, نویسنده در دیجی‌کالا مگ ` },
  };
}

const ARTICLES_PER_PAGE = 8;

export default async function AutorPage({
  params: { id },
  searchParams: { page = "1" },
}: {
  params: { id: string };
  searchParams: { page?: string };
}) {
  const decodedID = decodeURIComponent(id.replaceAll("-", " "));
  const currentPage = parseInt(page, 10) || 1;

  return (
    <div className="grid-cols-12 grid gap-5 px-4 py-4">
      <div className="shadow-sm text-white col-span-1 max-lg:hidden sticky top-32 right-7 w-16 h-16 flex items-center justify-center bg-sky-500">
        <Library size={35} />
      </div>

      {/* Article Content */}
      <div className="col-span-12 lg:col-span-11 py-8 lg:px-8">
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
                    <SelectItem value="apple">جدیدترین</SelectItem>
                    <SelectItem value="banana">پردیدگاه ترین</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-sm text-neutral-600 dark:text-neutral-100">
            <span className="text-neutral-700 dark:text-neutral-100">
            </span>
            مطلب موجود است.
          </div>
        </div>
        <div className="flex gap-5 flex-wrap">
          
        </div>

        <div className="mt-20">
          <Pagination>
           
          </Pagination>
        </div>
      </div>

      {/* ScrollUp Section */}
      <ScrollUp className="max-lg:hidden z-20 cursor-pointer text-white fixed bottom-10 right-9 w-12 h-14 rounded-md flex items-center justify-center bg-sky-400">
        <ArrowUp size={30} />
      </ScrollUp>
    </div>
  );
}
