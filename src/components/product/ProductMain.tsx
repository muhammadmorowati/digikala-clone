"use client";

import { Product } from "@/src/utils/types";
import { useEffect, useRef } from "react";
import FooterFaq from "../footer/FooterFaq";
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";
import ProductSeller from "./ProductSeller";
import ProductTab from "./ProductTab";

export default function ProductMain({ product }: { product: Product }) {
  const featureRef = useRef<HTMLDivElement>(null);

  // Safely add product to recent views
  const addRecentView = (productId: string) => {
    if (typeof window === "undefined") return; // SSR safety

    try {
      const existingViews: string[] =
        JSON.parse(localStorage.getItem("recentViews") || "[]");

      const updatedViews = [
        productId,
        ...existingViews.filter((id) => id !== productId),
      ].slice(0, 10);

      localStorage.setItem("recentViews", JSON.stringify(updatedViews));
    } catch (err) {
      console.error("Error updating recent views:", err);
    }
  };

  // Add this product to recent views once loaded
  useEffect(() => {
    if (product?._id) {
      addRecentView(product._id);
    }
  }, [product?._id]);

  if (!product) return null; // Safety guard

  return (
    <>
      <div className="grid grid-cols-12 gap-5">
        <ProductImage product={product} />
        <ProductInfo product={product} featureRef={featureRef} />
        <ProductSeller product={product} />
      </div>

      <div className="border-b-4 grayscale opacity-70">
        <hr />
        <FooterFaq featureRef={featureRef} />
      </div>

      <ProductTab product={product} />
    </>
  );
}
