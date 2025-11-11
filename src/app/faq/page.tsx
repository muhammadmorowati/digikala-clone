import FaqCategories from "@/src/components/faq/FaqCategories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Input } from "@/src/components/ui/input";
import MobileStickyHeader from "@/src/components/ui/MobileStickyHeader";
import { ChevronDown, FileQuestion } from "lucide-react";
import path from "path";
import { promises as fs } from "fs";

/** Utility: read FAQ data from JSON */
async function readFaqData() {
  const filePath = path.join(process.cwd(), "data", "pages", "faq.json");
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content);
}

export default async function Faq() {
  const { commonQuestions } = await readFaqData();

  return (
    <div>
      <MobileStickyHeader />

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-b from-neutral-200 to-white dark:from-neutral-700 dark:to-neutral-950">
        <div className="grayscale h-2/3 w-full bg-[url('/nav-links-svg.svg')] opacity-10 dark:opacity-60" />
        <div className="absolute top-10 left-0 right-0 mx-auto flex flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-sky-950">
            <FileQuestion size={22} className="text-sky-500" />
          </div>
          <h1 className="mt-10 mb-3 text-lg font-irsansb dark:text-white">
            موضوع پرسش شما چیست؟
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-300">
            موضوع مورد نظرتان را جست‌وجو کرده یا از دسته‌بندی زیر انتخاب کنید
          </p>
          <form className="mt-10">
            <Input
              type="text"
              placeholder="جستجوی موضوع"
              className="w-80 sm:w-96 lg:w-[35rem] py-6 dark:placeholder:text-neutral-600"
            />
          </form>
        </div>
      </section>

      {/* Content */}
      <main className="px-4 lg:px-20">
        <FaqCategories />

        {/* Common Questions */}
        <section className="py-14">
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-50 dark:bg-sky-950">
              <FileQuestion size={22} className="text-sky-500" />
            </div>
            <h2 className="mt-5 mb-10 text-lg font-irsansb">پرسش‌های متداول</h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {commonQuestions.map((item: { q: string; a: string }, index: number) => (
              <AccordionItem value={`item-${index + 1}`} key={index}>
                <AccordionTrigger className="py-6 text-right text-xs lg:text-sm leading-7 font-irsansb text-neutral-900">
                  {item.q}
                  <ChevronDown className="h-4 w-4 text-neutral-600 dark:text-neutral-200 shrink-0 transition-transform duration-200" />
                </AccordionTrigger>
                <AccordionContent className="text-base leading-7 text-neutral-600 dark:text-neutral-400">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </main>
    </div>
  );
}
