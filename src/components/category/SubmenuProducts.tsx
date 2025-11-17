"use client";

import { Product } from "@/src/utils/types";
import ProductCard from "./ProductCard";
import SortingMenu from "./SortingMenu";
import { useMemo } from "react";

interface SubmenuProductsProps {
  products: Product[];
  sortingMenu: string;
  setSortingMenu: (value: string) => void;
  searchParams?: Record<string, string | undefined>;
}

export default function SubmenuProducts({
  products,
  sortingMenu,
  setSortingMenu,
  searchParams,
}: SubmenuProductsProps) {

  const sortedProducts = useMemo(() => {
    const list = [...products];

    switch (sortingMenu) {
      case "cheapest":
        return list.sort((a, b) => a.discount_price - b.discount_price);

      case "expensive":
        return list.sort((a, b) => b.discount_price - a.discount_price);

      case "visited":
        return list.sort((a, b) => b.likes - a.likes);

      case "newest":
        return list.sort((a, b) => {
          const getTimestamp = (id: string) =>
            parseInt(id.substring(0, 8), 16) * 1000 || 0;

          return getTimestamp(b._id.toString()) - getTimestamp(a._id.toString());
        });

      case "bestseller":
        return list.sort((a, b) => b.rating - a.rating);

      default:
        return list;
    }
  }, [products, sortingMenu]);

  return (
    <div className="col-span-9 max-lg:col-span-12 px-4">

      {/* Sorting Bar */}
      <div className="flex items-center border-complete-b-200 gap-4 sticky top-20 bg-neutral-000 lg:static">
        <div className="flex max-lg:flex-col justify-between lg:items-center grow text-sm">

          <SortingMenu
            sortingMenu={sortingMenu}
            setSortingMenu={setSortingMenu}
            searchParams={searchParams}
          />

          <div className="max-lg:w-full text-neutral-500 justify-between dark:text-neutral-300 whitespace-nowrap text-xs ellipsis-1 flex items-center gap-2">
            <p className="lg:hidden">همه کالاها</p>
            {products.length.toLocaleString()} کالا
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-12 mt-3">
        {sortedProducts.length > 0 ? (
          sortedProducts.map((product) => (
            <div
              key={product._id.toString()}
              className="col-span-12 md:col-span-6 lg:col-span-4"
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <div className="col-span-12 text-neutral-500 border-t p-5">
            هیچ محصولی برای نمایش وجود ندارد.
          </div>
        )}
      </div>
    </div>
  );
}
