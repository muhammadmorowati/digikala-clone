"use client";

import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function OrdersSearchbar() {
  const [search, setSearch] = useState("");

  return (
    <div className="relative w-full">
      <SearchIcon
        size={20}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />

      <input
        id="orders-search"
        type="text"
        autoComplete="off"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="جستجو در سفارش‌ها"
        className="w-full h-12 pr-12 pl-4 bg-gray-100 dark:bg-neutral-700 rounded-lg outline-none border-0 placeholder:text-sm"
      />
    </div>
  );
}
