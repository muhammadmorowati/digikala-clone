"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/components/ui/carousel";
import { Card, CardContent } from "@/src/components/ui/card";
import { Product } from "@/src/utils/types";
import Image from "next/image";
import Link from "next/link";

export default function IncredibleOffersProductsSlider({
  products,
}: {
  products: Product[];
}) {
  return (
    <Carousel
      opts={{
        align: "start",
        direction: "rtl",
      }}
      className="min-w-screen"
    >
      <CarouselContent>
        {products.map((product) => {
          // Fallbacks for image and price sanity
          const thumbnail = product.thumbnail ?? "/placeholder.png";
          const finalPrice = product.discount_price ?? product.price;
          const rating = product.rating ?? 0;

          return (
            <CarouselItem
              key={product._id.toString()}
              className="lg:pl-5 px-1 basis-[35rem] max-lg:basis-52"
            >
              <Card className="border-0 rounded-lg">
                <CardContent className="px-5 py-5">

                  {/* Offer label */}
                  <Image
                    alt="incredible-offers"
                    width={120}
                    height={120}
                    src="/incredible-offers/text.svg"
                  />

                  <div className="flex max-lg:flex-col gap-5 items-center mt-5 justify-between">
                    
                    {/* Product Thumbnail */}
                    <Link href={`/products/${product._id}`} className="shrink-0">
                      <Image
                        alt={product.title}
                        width={150}
                        height={150}
                        src={thumbnail}
                      />
                    </Link>

                    {/* Title + Rating + Prices */}
                    <div className="flex flex-col items-center justify-center p-2">

                      {/* Product Title */}
                      <Link
                        href={`/products/${product._id}`}
                        className="hidden lg:block h-16 text-[13px] text-neutral-800 dark:text-neutral-100 mb-5"
                      >
                        {product.title}
                      </Link>

                      <Link
                        href={`/products/${product._id}`}
                        className="lg:hidden h-10 text-[13px] text-neutral-800 dark:text-neutral-100 mb-5"
                      >
                        {product.title.slice(0, 30)}
                        {product.title.length > 30 ? "..." : ""}
                      </Link>

                      {/* Rating */}
                      <span className="mb-5 justify-end w-full flex items-center text-sm gap-1">
                        {rating}
                        <svg
                          height="13"
                          width="13"
                          viewBox="0 0 47.94 47.94"
                          fill="#ffbb00"
                        >
                          <path d="M26.285,2.486l5.407,10.956...Z" />
                        </svg>
                      </span>

                      {/* Price + Discount */}
                      <div className="flex justify-between items-start w-full text-left">

                        {/* Discount badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-white text-xs bg-red-600 ${
                            product.discount > 0 ? "visible" : "invisible"
                          }`}
                        >
                          %{product.discount}
                        </span>

                        {/* Prices */}
                        <div className="text-right">
                          <div className="text-sm font-bold dark:font-normal text-neutral-800 dark:text-white flex gap-1 items-center">
                            {finalPrice.toLocaleString()}
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              className="fill-neutral-600 dark:fill-neutral-300"
                            >
                              <path d="M9.696 17.76L9.48 16.776...Z" />
                            </svg>
                          </div>

                          {product.discount > 0 && (
                            <span className="text-neutral-400 dark:text-neutral-300 line-through text-sm">
                              {product.price.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          );
        })}
      </CarouselContent>

      {/* Controls */}
      <CarouselPrevious className="dark:!bg-neutral-900 transition-all !z-20 w-10 h-10 !hover:bg-rose-500 left-3 top-32 !opacity-100 !bg-white" />
      <CarouselNext className="dark:!bg-neutral-900 transition-all !z-20 w-10 h-10 !hover:bg-rose-500 right-3 top-32 !opacity-100 !bg-white" />
    </Carousel>
  );
}
