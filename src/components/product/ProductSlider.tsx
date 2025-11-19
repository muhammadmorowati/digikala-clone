"use client";

import Image from "next/image";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import OfferSkeleton from "../skeleton/OfferSkeleton";
import { Product } from "@/src/utils/types";

export default function ProductSlider({ product }: { product: Product }) {
  const loading = false;

  return (
    <div className="relative">
      <Swiper
        centeredSlides
        slidesPerView={1}
        spaceBetween={0}
        modules={[Pagination]}
        pagination={{ dynamicBullets: true, el: ".swiper-pagination" }}
        className="cursor-default product-swiper"
      >
        {/* Loading skeleton */}
        {loading && (
          <SwiperSlide>
            <OfferSkeleton />
          </SwiperSlide>
        )}

        {/* Thumbnail */}
        {product.thumbnail && (
          <SwiperSlide className="!flex items-center py-5 justify-center w-full">
            <Image
              alt="Product Thumbnail"
              width={300}
              height={300}
              src={product.thumbnail}
              className="object-cover"
            />
          </SwiperSlide>
        )}

        {/* Images (string[]) */}
        {product.images?.map((img: string, index: number) => (
          <SwiperSlide
            key={index}
            className="!flex items-center py-5 justify-center w-full"
          >
            <Image
              alt={`Product Image ${index}`}
              width={300}
              height={300}
              src={img}
              className="object-cover"
            />
          </SwiperSlide>
        ))}

        <div className="swiper-pagination"></div>
      </Swiper>
    </div>
  );
}
