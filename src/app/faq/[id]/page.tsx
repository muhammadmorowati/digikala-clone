import FaqCategories from "@/src/components/faq/FaqCategories";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import MobileStickyHeader from "@/src/components/ui/MobileStickyHeader";
import { ChevronDown } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";
import { promises as fs } from "fs";

interface FaqQuestion {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  title: string;
  icon: string;
  questions: FaqQuestion[];
}

/** Utility: Reads faq categories JSON file */
async function readFaqCategories(): Promise<FaqCategory[]> {
  const filePath = path.join(process.cwd(), "data", "faqCategories.json");
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as FaqCategory[];
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const categories = await readFaqCategories();
  const category = categories.find((c) => c.id === id);
  return {
    title: category?.title ?? "سؤالات متداول",
  };
}

export default async function FaqCategoryPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const categories = await readFaqCategories();
  const category = categories.find((c) => c.id === id);

  if (!category) return notFound();

  return (
    <div className="pb-14">
      <MobileStickyHeader />

      {/* Hero Section */}
      <section className="relative h-52 bg-gradient-to-b from-neutral-200 to-white dark:from-neutral-700 dark:to-neutral-950">
        <div className="grayscale h-2/3 w-full bg-[url('/nav-links-svg.svg')] opacity-10 dark:opacity-60" />
        <div className="absolute top-10 left-0 right-0 mx-auto flex flex-col items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white dark:bg-sky-950">
            <span className="text-neutral-400 text-2xl">{category.icon}</span>
          </div>
          <h1 className="mt-10 mb-3 text-lg font-irsansb dark:text-white">
            {category.title}
          </h1>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="px-4 lg:px-20 mt-6">
        <Accordion type="single" collapsible className="w-full">
          {category.questions.map((q, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger className="text-neutral-900 py-6 text-right text-xs lg:text-sm leading-7 font-irsansb">
                {q.q}
                <ChevronDown className="ml-2 h-4 w-4 text-neutral-600 dark:text-neutral-200 shrink-0 transition-transform duration-200" />
              </AccordionTrigger>
              <AccordionContent className="text-neutral-600 dark:text-neutral-400 text-sm leading-7">
                {q.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* Related Categories */}
        <div className="mt-10">
          <FaqCategories />
        </div>
      </section>
    </div>
  );
}
