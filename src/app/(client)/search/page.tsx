
import SubmenuProductsMain from "@/components/category/SubmenuProductsMain";
import { serializeDoc } from "@/utils/serializeDoc";
import { Product, Category } from "@/utils/types";
import { Info } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

type WithId<T> = T & { _id: string };
type ProductWithPopulated = WithId<Product> & { category: WithId<Category> };

export async function generateMetadata(
  { searchParams }: { searchParams: { q?: string } }
): Promise<Metadata> {
  return {
    title: searchParams?.q ?? "جستجو",
  };
}

export default async function SearchCategoryPage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
  };
  }) {

  return (
    <div>
        <div className="col-span-12 p-5 flex flex-col justify-center items-center">
          <Image
            src="/not-found-product.svg"
            alt="not-found-product"
            width={200}
            height={200}
          />
          <div className="border rounded-md py-5 pr-5 mt-5 w-96">
            <p className="text-neutral-800 mb-2 flex items-center gap-2">
              <Info size={18} className="text-yellow-600" />
              کالایی با این مشخصات پیدا نکردیم
            </p>
            <p className="text-sm text-neutral-500 mr-7">
              پیشنهاد می‌کنیم فیلترها را تغییر دهید
            </p>
          </div>
        </div>
    </div>
  );
}
