"use client";

import { ProductImage } from "@/src/utils/types";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";

interface FullSizeImageProps {
  images: ProductImage[];
  activeId?: string;
  isOpen: string;
  onClose: () => void;
}

export default function FullSizeImage({
  images,
  activeId,
  isOpen,
  onClose,
}: FullSizeImageProps) {
  const [showAll, setShowAll] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  const initialIndex = useMemo(
    () => images.findIndex((img) => img._id.toString() === activeId),
    [images, activeId]
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-neutral-950 flex flex-col"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col h-full w-full"
      >
        {/* Close Button */}
        <button
          className="absolute top-5 left-8 text-3xl text-white"
          onClick={onClose}
        >
          &times;
        </button>

        {/* Main Swiper */}
        <Swiper
          slidesPerView={1}
          centeredSlides
          allowTouchMove
          navigation={{
            nextEl: ".fs-next",
            prevEl: ".fs-prev",
          }}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Thumbs, Navigation]}
          onSwiper={(swiper) => {
            if (initialIndex >= 0) swiper.slideTo(initialIndex);
          }}
          className="mt-20 md:w-96 w-full h-96 mx-auto bg-white rounded-lg overflow-hidden"
        >
          {/* Desktop Navigation */}
          <NavArrow className="fs-next left-2" icon={<ChevronLeft />} />
          <NavArrow className="fs-prev right-2" icon={<ChevronRight />} />

          {images.map((img) => (
            <SwiperSlide key={img._id.toString()} className="flex items-center">
              <Image
                src={img.url}
                width={500}
                height={500}
                alt="Product Image"
                className="w-full h-full object-cover rounded-xl"
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Thumbs + All Images Toggle */}
        <div className="flex items-center gap-4 px-5 mt-4">
          <button
            className="text-white text-center border rounded-lg p-2 w-16"
            onClick={() => setShowAll(true)}
          >
            <LayoutGrid size={20} className="mx-auto mb-1" />
            <span className="text-xs">همه تصاویر</span>
          </button>

          {/* Thumbs */}
          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[FreeMode, Navigation, Thumbs]}
            freeMode
            watchSlidesProgress
            spaceBetween={0}
            breakpoints={{
              0: { slidesPerView: 6 },
              800: { slidesPerView: 8 },
              1024: { slidesPerView: 18 },
            }}
            className="flex-1 h-20 bg-neutral-950"
          >
            {images.map((img) => (
              <SwiperSlide key={img._id.toString()}>
                <Image
                  src={img.url}
                  width={150}
                  height={150}
                  alt="Product Thumb"
                  className="w-full h-full object-cover bg-white rounded-md cursor-pointer"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* All Images */}
        {showAll && (
          <AllImagesGrid images={images} onClose={() => setShowAll(false)} />
        )}
      </div>
    </div>
  );
}

/* --- Components --- */

function NavArrow({
  className,
  icon,
}: {
  className?: string;
  icon: React.ReactNode;
}) {
  return (
    <div
      className={`hidden lg:flex absolute top-44 z-40 h-10 w-10 items-center justify-center bg-white rounded-full shadow cursor-pointer ${className}`}
    >
      {icon}
    </div>
  );
}

function AllImagesGrid({
  images,
  onClose,
}: {
  images: ProductImage[];
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-black z-50">
      <div className="flex justify-end p-5">
        <button className="text-3xl" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="max-w-5xl mx-auto overflow-y-scroll h-[85vh] p-5">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 flex justify-between text-neutral-600 dark:text-neutral-200 font-bold text-sm mb-3">
            <span>تصاویر رسمی</span>
            <span>{images.length} مورد</span>
          </div>

          {images.map((img) => (
            <Image
              key={img._id.toString()}
              src={img.url}
              width={350}
              height={350}
              alt="Product Image"
              className="lg:col-span-4 col-span-6 h-80 object-cover rounded-lg border"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
