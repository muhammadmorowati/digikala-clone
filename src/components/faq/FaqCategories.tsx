import { faqCategories } from "@/src/data/data";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function FaqCategories() {
  return (
    <div>
      {/* Header */}
      <div className="flex flex-col justify-center items-center">
        <div className="flex w-14 h-14 items-center bg-sky-50 dark:bg-sky-950 justify-center rounded-full">
          <LayoutDashboard size={22} className="text-sky-500" />
        </div>

        <h3 className="mt-5 mb-10 font-irsansb text-lg">
          دسته‌بندی پرسش‌ها
        </h3>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-12 border border-neutral-200 dark:border-neutral-900 rounded-md overflow-hidden">
        {faqCategories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.href}
            className="col-span-4 lg:col-span-2 flex flex-col items-center justify-center gap-3 p-4 border-r border-b border-neutral-200 dark:border-neutral-900 last:border-r-0"
          >
            <span className="text-neutral-400 dark:text-neutral-600">
              {cat.icon}
            </span>

            <span className="text-neutral-700 dark:text-neutral-100 text-xs text-center leading-5">
              {cat.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
