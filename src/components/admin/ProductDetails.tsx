import { Product } from "@/src/utils/types";
import Image from "next/image";
import { notFound } from "next/navigation";

interface ProductDetailsProps {
  product?: Product | null;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  // Handle missing product safely
  if (!product) return notFound();

  const { title, thumbnail, price, discount, description } = product;

  return (
    <div className="px-4 overflow-y-auto h-96">
      <div className="flex flex-col items-center">

        {/* Product Image */}
        <Image
          width={300}
          height={300}
          alt={title}
          src={thumbnail}
          className="object-contain"
        />

        {/* Price + Discount */}
        <div className="relative bg-gray-800 text-white px-3 py-1 rounded-xl my-4 flex items-center justify-center">
          <p className="text-lg">{price?.toLocaleString()} تومان</p>

          {discount > 0 && (
            <span className="absolute -top-2 -left-5 -rotate-12 bg-red-500 text-sm text-white rounded-full px-2">
              %{discount}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm text-justify leading-6">
          {description}
        </p>
      </div>
    </div>
  );
}
