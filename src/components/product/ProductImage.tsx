"use client";

import Image from "next/image";
import { useState } from "react";
import FullSizeImage from "./FullSizeImage";
import ProductSlider from "./ProductSlider";
import { Product } from "@/src/utils/types";

export default function ProductImage({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(""); // string id of selected image

  const closeModal = () => setIsOpen("");

  if (!product) return null;

  const limitedImages = product.images?.slice(0, 5) ?? [];

  return (
    <div className="w-full col-span-4 max-lg:col-span-12 justify-center items-center">

      {/* Desktop */}
      <div className="max-lg:hidden overflow-hidden w-full">
        <Image
          alt={product.title}
          width={420}
          height={420}
          src={product.thumbnail}
          className="object-cover mb-5 rounded-lg w-full"
        />

        <div className="flex items-center gap-2">
          {limitedImages.map((img, index) => (
            <div
              key={index}
              onClick={() => setIsOpen(String(index))}
              className="cursor-pointer relative border rounded-lg overflow-hidden"
            >
              {index === 4 && (
                <div className="absolute inset-0 z-10 flex items-center justify-center top-3">
                  {[1, 2, 3].map((dot) => (
                    <span key={dot} className="text-3xl text-neutral-500">
                      .
                    </span>
                  ))}
                </div>
              )}

              <Image
                alt={`Product Image ${index}`}
                src={img}
                width={75}
                height={75}
                className={`h-16 object-cover ${index === 4 ? "blur-sm" : ""}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden w-full">
        <ProductSlider product={product} />
      </div>

      {/* Fullscreen Viewer */}
      <FullSizeImage
         images={product.images.map((url, index) => ({
    _id: index.toString(),
    url,
  }))}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </div>
  );
}
