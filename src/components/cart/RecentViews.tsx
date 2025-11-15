"use client";

import { Product } from "@/src/utils/types";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface RecentViewsProps {
  products: Product[];
}

export default function RecentViews({ products }: RecentViewsProps) {
  const [recentViewProducts, setRecentViewProducts] = useState<Product[]>([]);

  const getRecentViews = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem("recentViews") || "[]");
    } catch {
      return [];
    }
  };

  useEffect(() => {
    const recentViewIds = getRecentViews();

    if (!Array.isArray(recentViewIds)) return;

    const filtered = products.filter((p) =>
      recentViewIds.includes(p._id.toString())
    );

    setRecentViewProducts(filtered);
  }, [products]);

  if (recentViewProducts.length === 0) return null;

  return (
    <div className="relative mt-10 rounded-2xl">
      <Swiper
        className="cursor-default divide-x-2 category-swiper rounded-2xl"
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Pagination, Navigation]}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3.5 },
          1024: { slidesPerView: 5 },
          1100: { slidesPerView: 5.7 },
        }}
      >
        {recentViewProducts.map((product) => (
          <SwiperSlide key={product._id} className="border-l">
            <RecentProductCard product={product} />
          </SwiperSlide>
        ))}

        {/* Navigation Buttons */}
        <div className="hidden lg:block">
          <div className="swiper-button-next bg-white rounded-full after:text-neutral-500 border after:!text-sm after:!font-extrabold shadow-md !left-3 !top-1/2 !w-10 !h-10"></div>
          <div className="swiper-button-prev bg-white rounded-full after:text-neutral-500 border after:!text-sm after:!font-extrabold shadow-md !right-3 !top-1/2 !w-10 !h-10"></div>
        </div>
      </Swiper>
    </div>
  );
}

/* ------------------- Sub-component ------------------- */

const RecentProductCard = ({ product }: { product: Product }) => {
  const discountVisible = product.discount > 0;

  return (
    <div className="flex flex-col h-72 items-center p-2">
      <Link href={`/products/${product._id}`} className="relative mb-5">
        <Image src={product.thumbnail} alt={product.title} width={140} height={140} />

        {/* Mobile discount badge */}
        <span
          className={`lg:hidden px-2 py-0.5 absolute bottom-0 left-0 rounded-full text-white text-xs bg-red-600 ${
            discountVisible ? "visible" : "invisible"
          }`}
        >
          %{product.discount}
        </span>
      </Link>

      {/* Title (different limit per breakpoint) */}
      <Link
        href={`/products/${product._id}`}
        className="max-lg:hidden h-10 text-[13px] text-gray-600 dark:text-gray-100 mb-5"
      >
        {truncate(product.title, 36)}
      </Link>

      <Link
        href={`/products/${product._id}`}
        className="lg:hidden h-10 text-[13px] text-gray-600 dark:text-gray-100 mb-5"
      >
        {truncate(product.title, 30)}
      </Link>

      {/* Price Section */}
      <div className="flex lg:justify-between max-lg:justify-end items-start w-full text-left">
        {/* Desktop discount badge */}
        <span
          className={`max-lg:hidden px-2 py-0.5 rounded-full text-white text-xs bg-red-600 ${
            discountVisible ? "visible" : "invisible"
          }`}
        >
          %{product.discount}
        </span>

        <div className="text-right">
          <div className="text-sm font-bold dark:font-normal text-gray-800 dark:text-white flex gap-1 items-center">
            {product.discount_price.toLocaleString()}
            <CurrencySvg />
          </div>

          {discountVisible && (
            <span className="text-gray-400 dark:text-gray-300 line-through text-sm text-right">
              {product.price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const truncate = (text: string, max: number) =>
  text.length > max ? text.slice(0, max) + "..." : text;

const CurrencySvg = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    className="fill-neutral-600 dark:fill-neutral-300"
  >
    {/* SVG path unchanged */}
  </svg>
);
