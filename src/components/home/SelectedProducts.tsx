import { Product } from "@/src/utils/types";
import { BadgePercent } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SelectedProducts({ products }: { products: Product[] }) {
  // Filter products with discount
  const discountedProducts = products
    .filter((p) => p.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 18);

  return (
    <div className="border rounded-xl my-10 mx-3 overflow-hidden">
      <h2 className="text-center flex items-center justify-center gap-2 text-xl font-irsansb my-2">
        <BadgePercent className="text-red-600" />
        <span>منتخب محصولات تخفیف و حراج</span>
      </h2>

      <div className="grid grid-cols-12 mt-10">
        {discountedProducts.map((product) => {
          const finalPrice =
            product.price - (product.price * product.discount) / 100;

          return (
            <div
              key={product._id}
              className="xl:col-span-2 lg:col-span-3 md:col-span-4 col-span-6 border border-t-0 border-neutral-100 dark:border-neutral-800 p-2"
            >
              <Link
                href={`/products/${product._id}`}
                className="flex items-center justify-center flex-col gap-4"
              >
                <Image
                  alt={product.title}
                  width={150}
                  height={150}
                  src={product.thumbnail}
                />

                <div className="flex justify-between items-start w-full">
                  <span className="px-2 py-0.5 rounded-full text-white text-xs bg-red-600">
                    %{product.discount}
                  </span>

                  <div className="text-right">
                    <div className="text-sm font-bold text-neutral-800 dark:text-white flex gap-1 items-center">
                      {finalPrice.toLocaleString()}
                      <CurrencyIcon />
                    </div>

                    {product.discount > 0 && (
                      <span className="text-neutral-400 dark:text-neutral-600 line-through text-sm">
                        {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// extracted SVG for cleaner JSX
function CurrencyIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-neutral-600 dark:fill-neutral-300"
    >
      <path d="M9.696 17.76L9.48 16.776C9.96 16.712..." />
    </svg>
  );
}
