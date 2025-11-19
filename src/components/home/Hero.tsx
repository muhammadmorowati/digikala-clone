"use client";

import { hero } from "@/src/data/data";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

export default function Hero() {
  return (
    <Swiper
      className="lg:h-96 relative mt-5 cursor-default group"
      autoplay={{ delay: 5000 }}
      spaceBetween={0}
      slidesPerView={1}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      modules={[Navigation, Autoplay]}
    >
      {hero.map((item) => (
        <SwiperSlide key={item.title}>
          <Link href={item.href} target="_blank">
            <Image
              src={item.cover}
              width={4000}
              height={4000}
              alt={item.title}
              title={item.title}
              className="w-full h-full object-cover object-[60%] max-lg:h-52"
            />
          </Link>
        </SwiperSlide>
      ))}

      {/* Navigation buttons */}
      <div className="swiper-button-next bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 after:text-red-500 after:text-sm after:font-extrabold shadow-md !right-28 !top-80 !w-10 !h-10 !z-20"></div>
      <div className="swiper-button-prev bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 after:text-red-500 after:text-sm after:font-extrabold shadow-md !right-16 !top-80 !w-10 !h-10 !z-20"></div>
    </Swiper>
  );
}
