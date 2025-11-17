import { sortingMenuItems } from "@/src/data/data";
import { ArrowDownWideNarrow } from "lucide-react";
import Link from "next/link";

interface SearchParams {
  q?: string;
  [key: string]: string | undefined;
}

interface SortingMenuProps {
  sortingMenu: string;
  setSortingMenu: (selectedMenu: string) => void;
  searchParams?: SearchParams;
}

export default function SortingMenu({
  sortingMenu,
  setSortingMenu,
  searchParams,
}: SortingMenuProps) {
  
  // Build correct link href
  const getHref = (sortLabel: string) => {
    if (searchParams?.q) {
      return `/search?q=${encodeURIComponent(searchParams.q)}&sort=${sortLabel}`;
    }
    return `?sort=${sortLabel}`;
  };

  return (
    <div className="flex items-center gap-x-4 max-lg:hidden">
      {/* Title */}
      <div className="py-3 flex items-center grow">
        <ArrowDownWideNarrow size={20} className="ml-2 shrink-0" />
        <p className="text-neutral-800 dark:text-neutral-100 text-body2-strong whitespace-nowrap cursor-pointer">
          مرتب سازی:
        </p>
      </div>

      {/* Menu Items */}
      <div className="flex gap-5">
        {sortingMenuItems.map((item) => (
          <Link
            key={item.label}
            href={getHref(item.label)}
            shallow
            onClick={() => setSortingMenu(item.label)}
            className={[
              "cursor-pointer whitespace-nowrap text-body-2 text-neutral-500 dark:text-neutral-300",
              sortingMenu === item.label && "text-red-500 dark:text-red-500",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
