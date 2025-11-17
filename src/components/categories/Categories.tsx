"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/src/components/ui/accordion";
import { Category, Product, Submenu, SubmenuItem } from "@/src/utils/types";
import { ChevronDown, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Categories({
  categories = [],
  products = [],
}: {
  categories: Category[];
  products: Product[];
}) {
  const router = useRouter();

  // Keep selected category stable + avoid re-running find()
  const defaultCategory = useMemo(
    () => categories.find((c) => c.title === "موبایل") || categories[0] || null,
    [categories]
  );

  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(defaultCategory);

  const clickHandler = (id: string) => {
    const found = categories.find((c) => c._id.toString() === id);
    if (found) setSelectedCategory(found);
  };

  // Get first product image for submenu item
  const submenuProductImages = (item: SubmenuItem) => {
    const product = products.find(
      (p) => p.submenuItemId === item._id.toString()
    );
    return product?.thumbnail || "/placeholder.png";
  };

  // Redirect if screen width >= 1024px
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const handle = (e: MediaQueryListEvent) => {
      if (e.matches) router.push("/");
    };

    if (mq.matches) router.push("/");

    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, [router]);

  return (
    <div className="pb-12 grid grid-cols-12 bg-white dark:bg-neutral-950 shadow-sm">

      {/* Sidebar Categories */}
      <div className="sm:max-h-[30rem] max-h-[600px] overflow-y-auto categories_sidebar bg-neutral-100 border dark:border-neutral-600 dark:bg-neutral-800 sm:col-span-2 col-span-3">
        {categories.map((category) => {
          const isActive = selectedCategory?._id === category._id;

          return (
            <div key={category._id} onClick={() => clickHandler(category._id)}>
              <div
                className={`cursor-pointer py-3 px-1 text-xs flex flex-col items-center gap-2 border-b dark:border-b-neutral-700 transition-all ${
                  isActive
                    ? "text-red-500 bg-white dark:bg-neutral-900"
                    : "text-neutral-600 dark:text-neutral-100"
                }`}
              >
                <Image
                  alt={category.title}
                  width={18}
                  height={18}
                  src={category.icon}
                  className="dark:invert"
                />
                {category.title}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submenus */}
      <div className="sm:col-span-10 col-span-9 p-4">
        <h2 className="text-sky-500 text-sm flex items-center gap-1">
          <Link
            href={selectedCategory?.href || "/"}
            className="flex items-center"
          >
            همه محصولات {selectedCategory?.title}
            <ChevronLeft size={15} />
          </Link>
        </h2>

        <div className="mt-5 flex flex-col">
          <Accordion type="single" collapsible className="w-full lg:hidden mb-5">
            {selectedCategory?.submenus?.length ? (
              selectedCategory.submenus.map((menu: Submenu, i: number) => (
                <AccordionItem key={i} value={`item-${i + 1}`}>
                  <AccordionTrigger className="text-xs font-irsansb text-neutral-800 dark:text-neutral-100">
                    {menu.title}
                    <ChevronDown className="h-4 w-4 text-neutral-600 dark:text-neutral-200" />
                  </AccordionTrigger>

                  <div className="grid grid-cols-3">
                    {menu.items?.map((item: SubmenuItem, index: number) => {
                      const noLink = item.href === "";
                      const borderFix = (index + 1) % 3 === 0;

                      return (
                        <AccordionContent
                          key={item._id}
                          className={`text-xs flex flex-col items-center justify-center gap-2 text-neutral-700 dark:text-neutral-300 border dark:border-neutral-500 ${
                            noLink ? "h-20" : ""
                          } ${borderFix ? "border-l-0" : ""}`}
                        >
                          <Link
                            href={item.href || "#"}
                            className="text-center flex flex-col items-center"
                          >
                            <div className="rounded-full w-16 h-16 flex items-center justify-center border border-neutral-900 dark:bg-white">
                              <Image
                                alt={item.title}
                                width={60}
                                height={60}
                                src={submenuProductImages(item)}
                                className="object-cover rounded-full"
                              />
                            </div>
                            {item.title}
                          </Link>
                        </AccordionContent>
                      );
                    })}
                  </div>
                </AccordionItem>
              ))
            ) : (
              <p className="text-neutral-500 text-sm mr-5 my-5">
                محصولی برای{" "}
                <span className="text-red-500 font-irsansb">
                  {selectedCategory?.title}
                </span>{" "}
                یافت نشد.
              </p>
            )}
          </Accordion>
        </div>
      </div>

    </div>
  );
}
