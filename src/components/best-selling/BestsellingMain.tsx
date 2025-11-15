"use client";

import { Category, Product } from "@/src/utils/types";
import { Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ProductCard from "../category/ProductCard";

export default function BestsellingMain({
  categories,
  bestSellerProducts,
}: {
  categories: Category[];
  bestSellerProducts: Product[];
}) {
  const ALL = "0";

  const [activeCategory, setActiveCategory] = useState<string>(ALL);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(bestSellerProducts);

  useEffect(() => {
    if (activeCategory === ALL) {
      setFilteredProducts(bestSellerProducts);
      return;
    }

    // FILTER BY product.categoryId
    setFilteredProducts(
      bestSellerProducts.filter(
        (product) => product.categoryId?.toString() === activeCategory
      )
    );
  }, [activeCategory, bestSellerProducts]);

  return (
    <div className="px-4">
      {/* Category Filters */}
      <div className="flex items-center justify-center md:gap-x-5 gap-x-3 gap-y-3 flex-wrap my-20">
        <CategoryButton
          active={activeCategory === ALL}
          label="همه نوع کالا"
          onClick={() => setActiveCategory(ALL)}
        />

        {categories.map((category) => (
          <CategoryButton
            key={category._id}
            active={activeCategory === category._id.toString()}
            label={category.title}
            onClick={() => setActiveCategory(category._id.toString())}
          />
        ))}
      </div>

      <div className="grid grid-cols-12 mt-3">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="col-span-12 md:col-span-6 lg:col-span-3"
            >
              <ProductCard product={product} />
            </div>
          ))
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}

/* Category Button Component */
function CategoryButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-full px-3 sm:px-5 py-2 border 
        text-neutral-800 dark:text-neutral-300 dark:border-neutral-300
        sm:text-[15px] text-xs ${
          active
            ? "text-red-500 bg-red-50 border-red-500 dark:text-red-500 dark:border-red-500"
            : ""
        }`}
    >
      {label}
    </div>
  );
}

/* Empty State Component */
function EmptyState() {
  return (
    <div className="col-span-12 p-5 flex flex-col justify-center items-center">
      <Image
        src="/not-found-product.svg"
        alt="not-found-product"
        width={200}
        height={200}
      />
      <div className="border rounded-md py-5 pr-5 mt-5 w-96">
        <p className="text-neutral-800 mb-2 flex items-center gap-2">
          <Info size={18} className="text-yellow-600" />
          کالایی با این مشخصات پیدا نکردیم
        </p>
        <p className="text-sm text-neutral-500 mr-7">
          پیشنهاد می‌کنیم فیلترها را تغییر دهید
        </p>
      </div>
    </div>
  );
}
