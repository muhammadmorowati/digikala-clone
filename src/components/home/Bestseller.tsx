"use client";

import { Product } from "@/src/utils/types";
import { Flame } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";

// Helper: chunk products into arrays of 6
const chunkProducts = (items: Product[], size: number) => {
  const chunks: Product[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export default function Bestseller({
  title,
  products,
}: {
  title: string;
  products: Product[];
}) {
  // BEST SELLERS — sorted by recommendation
  const bestSellerProducts = [...products].sort(
    (a, b) => b.recommended_percent - a.recommended_percent
  );

  // TRENDING — sorted by ObjectId timestamp
  const trendProducts = [...products].sort((a, b) => {
    const aTimestamp = parseInt(a._id.toString().substring(0, 8), 16) * 1000;
    const bTimestamp = parseInt(b._id.toString().substring(0, 8), 16) * 1000;
    return bTimestamp - aTimestamp;
  });

  const selectedList = title.includes("پرفروش")
    ? bestSellerProducts
    : trendProducts;

  // Split into sections of 6 items per Swiper
  const sections = chunkProducts(selectedList, 6);

  return (
    <div className="border rounded-xl my-5 p-5 mx-3">
      {/* Title */}
      {title.includes("پرفروش") ? (
        <div className="flex justify-between items-center">
          <div></div>
          <h2 className="text-center flex items-center justify-center gap-2 text-xl font-irsansb my-2">
            <Flame className="text-orange-400" />
            <span>{title}</span>
          </h2>
          <Link href="/best-selling" className="text-sm text-sky-500">
            مشاهده همه
          </Link>
        </div>
      ) : (
        <h2 className="text-center flex items-center justify-center gap-2 text-xl font-irsansb my-2">
          <Flame className="text-orange-400" />
          <span>{title}</span>
        </h2>
      )}

      {/* Dynamic Swipers */}
      {sections.map((group, groupIndex) => (
        <Swiper
          key={groupIndex}
          className="mt-10"
          spaceBetween={20}
          breakpoints={{
            0: { slidesPerView: 1, spaceBetween: 10 },
            600: { slidesPerView: 2, spaceBetween: 10 },
            800: { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 20 },
          }}
        >
          {group.map((product, index) => (
            <SwiperSlide key={product._id} className="flex flex-col gap-5">
              <SwiperLink
                product={product}
                index={groupIndex * 6 + index}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      ))}
    </div>
  );
}

const SwiperLink = ({
  product,
  index,
}: {
  product: Product;
  index: number;
}) => {
  return (
    <Link
      href={`/products/${product._id}`}
      className="flex items-center gap-4"
    >
      <Image
        alt={product.title}
        width={100}
        height={100}
        src={product.thumbnail}
      />

      <div className="flex items-center gap-4">
        <p className="text-sky-500 text-2xl font-bold">{index + 1}</p>
        <p className="text-xs leading-6 h-20 border-b pb-7 text-gray-500 dark:text-gray-200">
          {product.title.slice(0, 50)}
          {product.title.length > 50 ? "..." : ""}
        </p>
      </div>
    </Link>
  );
};
