import { CartItem, Product } from "@/src/utils/types";
import Image from "next/image";
import Link from "next/link";

type Props = {
  product: Product | CartItem;
};

export default function ProductCard({ product }: Props) {
  const hasRating = "rating" in product && typeof product.rating === "number";
  const discount = product.discount ?? 0;
  const finalPrice = product.discount_price ?? product.price ?? 0;
  const originalPrice = product.price ?? 0;

  return (
    <div className="hover:shadow-md h-[25rem] hover:shadow-neutral-500 dark:hover:shadow-neutral-700 transition-all flex flex-col justify-center px-2 py-4 border border-neutral-100 dark:border-neutral-800">
      <Link href={`/products/${product._id}`} className="relative mb-5">
        <Image
          alt={product.title}
          width={200}
          height={200}
          src={product.thumbnail}
          className="mx-auto"
        />

        {/* Mobile Discount Badge */}
        {discount > 0 && (
          <span className="lg:hidden px-2 py-0.5 absolute bottom-0 left-0 rounded-full text-white text-xs bg-red-600">
            %{discount}
          </span>
        )}
      </Link>

      {/* Title (responsive combined) */}
      <Link
        href={`/products/${product._id}`}
        className="leading-7 h-10 text-[13px] text-gray-600 dark:text-gray-100 mb-6"
      >
        {product.title}
      </Link>

      {/* Rating */}
      {hasRating && (
        <span className="mb-5 justify-end w-full flex items-center text-sm gap-1">
          {product.rating}
          <Image
            src="/icons/star.svg"
            width={13}
            height={13}
            alt="rating star"
          />
        </span>
      )}

      {/* Prices section */}
      <div className="flex lg:justify-between max-lg:justify-end items-start w-full text-left">
        {/* Desktop Discount Badge */}
        {discount > 0 && (
          <span className="max-lg:hidden px-2 py-0.5 rounded-full text-white text-xs bg-red-600">
            %{discount}
          </span>
        )}

        <div className="text-right">
          <div className="text-sm font-bold dark:font-normal text-gray-800 dark:text-white flex gap-1 items-center">
            {finalPrice.toLocaleString()}

            {/* Your custom icon */}
            <Image
              src="/icons/toman.svg"
              alt="toman"
              width={18}
              height={18}
              className="fill-neutral-600 dark:fill-neutral-300"
            />
          </div>

          {discount !== 0 && (
            <span className="text-gray-400 dark:text-gray-300 line-through text-sm text-right">
              {originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
