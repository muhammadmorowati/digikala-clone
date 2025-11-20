import SubmenuProductsMain from "@/src/components/category/SubmenuProductsMain";
import { Product, Category } from "@/src/utils/types";
import { Info } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";

// 🧩 Mock data for local testing (no DB)
const mockCategories: Category[] = [
  {
    _id: "1" as any,
    title: "موبایل",
    href: "/category/mobile",
    cover: ["/images/categories/mobile-cover.webp"],
    hero: ["/images/categories/mobile-hero.webp"],
    banner: ["/images/categories/mobile-banner.webp"],
    submenus: [
      {
        _id: "11" as any,
        title: "گوشی سامسونگ",
        href: "/category/mobile/samsung",
        items: [
          {
            _id: "111" as any,
            title: "Galaxy S24",
            href: "/category/mobile/samsung/galaxy-s24",
          },
        ],
      },
    ],
  },
  {
    _id: "2" as any,
    title: "لپ‌تاپ",
    href: "/category/laptop",
    cover: ["/images/categories/laptop-cover.webp"],
    hero: ["/images/categories/laptop-hero.webp"],
    banner: ["/images/categories/laptop-banner.webp"],
    submenus: []
  },
];

const mockProducts: Product[] = [
  {
    _id: "p1" as any,
    title: "گوشی سامسونگ Galaxy S24 Ultra",
    en_title: "Samsung Galaxy S24 Ultra",
    rating: 4.9,
    voter: 250,
    thumbnail: "/images/products/galaxy-s24.webp",
    price: 58999000,
    discount: 10,
    discount_price: 52999000,
    description: "قدرتمندترین گوشی سامسونگ با دوربین فوق‌العاده",
    recommended_percent: 95,
    guarantee: "۱۸ ماه گارانتی سامسونگ",
    categoryId: mockCategories[0]._id,
    submenuId: "11",
    submenuItemId: "111",
    images: [],
    features: [],
    colors: []
  },
  {
    _id: "p2" as any,
    title: "لپ‌تاپ ایسوس Vivobook 15",
    en_title: "Asus Vivobook 15",
    rating: 4.5,
    voter: 180,
    thumbnail: "/images/products/vivobook15.webp",
    price: 34999000,
    discount: 8,
    discount_price: 31999000,
    description: "لپ‌تاپی قدرتمند برای کار و تحصیل",
    recommended_percent: 90,
    guarantee: "۱۲ ماه گارانتی ایسوس",
    categoryId: mockCategories[1]._id,
    submenuId: "21",
    submenuItemId: "211",
    images: [],
    features: [],
    colors: []
  },
];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string };
}): Promise<Metadata> {
  return {
    title: searchParams?.q ? `جستجو: ${searchParams.q}` : "جستجو",
  };
}

export default async function SearchCategoryPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q ?? "").trim();

  // 🔍 Filter products by query
  const searchParamsResult = mockProducts.filter(
    (product) =>
      product.title.includes(q) ||
      (product.en_title?.toLowerCase().includes(q.toLowerCase()) ?? false)
  );

  // Find category for first match (if any)
  const category =   typeof searchParamsResult[0]?.categoryId === "object"
    ? (searchParamsResult[0].categoryId as Category)
    : null;
  const submenu = category?.submenus?.[0] || null;

  return (
    <div>
      {searchParamsResult.length > 0 ? (
        <div className="grid grid-cols-12 gap-5 lg:mt-10">
          <SubmenuProductsMain
            category={category}
            submenu={submenu}
            products={searchParamsResult}
            searchParams={searchParams}
          />
        </div>
      ) : (
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
      )}
    </div>
  );
}
