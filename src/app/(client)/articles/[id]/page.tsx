
import ScrollUp from "@/components/footer/ScrollUp";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { formatDateToPersian } from "@/utils/PersianFormatter"
import { Article } from "@/utils/types";
import { ArrowUp, ChevronLeft, Clock, Facebook, Instagram, Library, Linkedin, MessageCircle, Send, Timer, Twitter } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import parse from "html-react-parser"
import ArticleComment from "@/components/article/ArticleComment";


export default async function ArticlePage({
  params: { id },
}: {
  params: { id: string };
}) {
  
  const ArticlePublishedDate = (
    <span className="flex text-xs items-center text-neutral-400 gap-1">
      <Clock size={14} />
    </span>
  );

  return (
    <div className="grid-cols-12 grid gap-5 lg:px-4 py-4">
      <div className="lg:shadow-sm max-lg:hidden text-white col-span-1 sticky top-32 right-7 w-16 h-16 flex items-center justify-center bg-sky-500">
        <Library size={35} />
      </div>

      {/* Article Content */}
      <div className="col-span-12 lg:col-span-8 lg:border border-neutral-100 py-8 lg:px-8 px-4 rounded-md lg:shadow-md">
        <div>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="text-xs">
                <BreadcrumbLink href="/articles">خانه</BreadcrumbLink>
              </BreadcrumbItem>
              <ChevronLeft className="text-red-500" size={15} />
              <BreadcrumbItem className="text-xs gap-4 max-lg:overflow-x-auto hidden-scrollbar">
                <BreadcrumbPage></BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <Separator className="my-8" />

        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white leading-10 mb-8">
        </h1>
        <div className="text-sm text-neutral-600 mb-4 flex flex-wrap gap-y-3 itece justify-between">
          <div className="flex items-center gap-4 text-neutral-400">
            <Image
              alt="default_author_profile"
              width={40}
              height={40}
              src="/default_author.jpg"
              className="rounded-full"
            />
            <Link
              href={`/articles/user/`}
            >
            </Link>
          </div>
          {ArticlePublishedDate}
          <span className="text-neutral-400 flex items-center gap-1">
            زمان مورد نیاز برای مطالعه:  دقیقه
            <Timer size={14} />
          </span>
        </div>

        <div className="font-irsansb text-justify prose prose-lg dark:prose-invert max-w-none">
        </div>

        <div className="mt-6 text-blue-600 hover:underline">
          منبع: 
        </div>

        {/* Socials */}
        <div className="my-5 gap-5 flex items-end justify-end text-neutral-400">
          <div className="flex text-sm items-center gap-1">
            <span>0</span>
            <MessageCircle />
          </div>
          <span className="font-irsansb mx-3">|</span>
          <Link href="">
            <Send />
          </Link>
          <Link href="">
            <Instagram />
          </Link>

          <Link href="">
            <Linkedin />
          </Link>
          <Link href="">
            <Facebook />
          </Link>
          <Link href="">
            <Twitter />
          </Link>
        </div>
        <Separator className="my-10" />
        <div className="flex">
          <span className="text-neutral-600 ml-5">برچسب‌ها:</span>
          <div className="flex gap-3 max-lg:overflow-x-auto hidden-scrollbar">
              <span
                className="bg-neutral-100 dark:bg-neutral-800 whitespace-nowrap text-neutral-500 dark:text-neutral-400 text-[13px] font-medium px-3 py-1 rounded"
              >
                test
              </span>
          </div>
        </div>
        <Separator className="my-10" />

        <ArticleComment />
      </div>

      {/* Last Articles */}
      <div className="col-span-12 lg:col-span-3 lg:border bg-white p-4 py-8 lg:shadow-lg shadow-neutral-300 dark:border-0 dark:bg-neutral-800 dark:shadow-neutral-950">
        <h3 className="text-center text-neutral-700 font-vazirBold text-lg dark:text-white">
          آخرین پست ها
        </h3>
        <Separator className="my-5 opacity-50" />
        <div className="flex flex-col gap-5">
        
        </div>
      </div>

      {/* ScrollUp Section */}
      <ScrollUp className="z-20 cursor-pointer text-white fixed bottom-16 right-8 w-12 h-14 rounded-md flex items-center justify-center bg-sky-400">
        <ArrowUp size={30} />
      </ScrollUp>
    </div>
  );
}
