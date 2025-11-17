"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { descriptionParagraphs } from "@/src/data/description";

export default function Description() {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="relative overflow-hidden max-lg:mb-10">
      <h1 className="lg:text-xl mb-5 text-neutral-600 dark:text-white">
        <strong>فروشگاه اینترنتی دیجی‌کالا، بررسی، انتخاب و خرید آنلاین</strong>
      </h1>

      <div
        className={`text-xs leading-7 text-gray-600 dark:text-gray-300 transition-all ${
          showMore ? "line-clamp-none" : "line-clamp-3"
        }`}
      >
        {descriptionParagraphs.map((content, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: content }}
            className={`relative ${
              !showMore
                ? "after:absolute after:bg-gradient-to-t after:from-white after:to-white/50 dark:after:from-neutral-950 dark:after:to-neutral-950/50 after:w-full after:h-5 after:bottom-0 after:right-0"
                : ""
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setShowMore((p) => !p)}
        className="lg:text-sky-500 flex mt-3 lg:text-xs max-lg:text-neutral-400 items-center"
      >
        {showMore ? "بستن" : "مشاهده بیشتر"}
        <ChevronLeft size={15} />
      </button>
    </div>
  );
}
