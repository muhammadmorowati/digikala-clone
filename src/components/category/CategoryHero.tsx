"use client";

import { Category } from "@/src/utils/types";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function CategoryHero({ category }: { category: Category }) {
  const heroImages = Array.isArray(category.hero) ? category.hero : [];

  // If no images, nothing to show
  if (!heroImages.length) return null;

  return (
    <div className="relative my-5 px-4 rounded-2xl">
      <Swiper
        className="cursor-default category-swiper lg:h-96 rounded-2xl"
        autoplay={{ delay: 3000 }}
        spaceBetween={0}
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: ".swiper-pagination",
        }}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        modules={[Pagination, Navigation]}
      >
        {heroImages.map((img, index) => (
          <SwiperSlide key={index}>
            <Link href={category.href || "#"}>
              <Image
                alt={`Hero Banner ${index + 1}`}
                width={1700}
                height={600}
                src={img}
                className="rounded-lg w-full h-full object-cover object-[60%] max-lg:h-52"
                priority={index === 0}
              />
            </Link>
          </SwiperSlide>
        ))}

        {/* Pagination bullets */}
        <div className="swiper-pagination"></div>

        {/* Next / Prev buttons */}
        <div className="swiper-button-next bg-white rounded-r-full shadow-md after:text-red-500 after:text-sm after:font-extrabold !left-0 !w-12 !h-12"></div>
        <div className="swiper-button-prev bg-white rounded-l-full shadow-md after:text-red-500 after:text-sm after:font-extrabold !right-0 !w-12 !h-12"></div>
      </Swiper>
    </div>
  );
}
