import BestsellingMain from "@/src/components/best-selling/BestsellingMain";
import { Category, Product } from "@/src/utils/types";

// 🔹 داده‌های نمونه (در حالت واقعی، از فایل JSON یا API می‌گیری)
const mockCategories: Category[] = [
  {
    _id: "1",
    title: "موبایل",
    href: "/category/mobile",
    icon: "/icons/phone.svg",
    cover: ["/images/phone-cover.jpg"],
    hero: ["/images/hero-mobile.jpg"],
    banner: ["/images/banner-mobile.jpg"],
    submenus: [
      {
        _id: "s1",
        title: "گوشی سامسونگ",
        href: "/category/mobile/samsung",
        items: [
          { _id: "i1", title: "Galaxy S24", href: "/product/galaxy-s24" },
          { _id: "i2", title: "Galaxy A55", href: "/product/galaxy-a55" },
        ],
      },
    ],
  },
  {
    _id: "2",
    title: "لپ‌تاپ",
    href: "/category/laptop",
    icon: "/icons/laptop.svg",
    cover: ["/images/laptop-cover.jpg"],
    hero: ["/images/hero-laptop.jpg"],
    banner: ["/images/banner-laptop.jpg"],
    submenus: [],
  },
];

const mockProducts: Product[] = [
  {
    _id: "p1",
    title: "گوشی موبایل سامسونگ مدل Galaxy S24 Ultra",
    thumbnail: "/images/galaxy-s24.jpg",
    price: 52000000,
    discount: 8,
    discount_price: 47800000,
    rating: 4.8,
    voter: 340,
    description: "گوشی پرچمدار سامسونگ با طراحی جدید و دوربین قدرتمند.",
    recommended_percent: 96,
    category: mockCategories[0],
    submenuId: "mobile",
    submenuItemId: "samsung",
  },
];

export default async function BestsellingPage() {
  // 🔹 چون دیگه دیتابیس نداریم، فقط داده‌ها رو مرتب می‌کنیم
  const bestSellerProducts = mockProducts
    .slice()
    .sort(
      (a, b) =>
        (b.recommended_percent ?? 0) - (a.recommended_percent ?? 0)
    );

  const categories = mockCategories;

  return (
    <div className="mb-10">
      {/* Header */}
      <div className="relative h-36 w-full">
        <div className="bg-gradient-to-l h-0.5 absolute -bottom-0 left-0 w-1/2 from-[#e20000] to-[white] dark:to-[black]" />
        <div className="bg-gradient-to-r h-0.5 absolute -bottom-0 right-0 w-1/2 from-[#e20000] to-[white] dark:to-[black]" />
        <div className="absolute right-0 top-0 w-full bg-[url('/nav-links-svg.svg')] h-36 opacity-30" />
        <h1 className="absolute m-auto w-fit h-full pt-10 px-10 right-0 left-0 top-0 bottom-0 text-red-500 bg-white dark:bg-neutral-950 lg:text-4xl text-xl">
          پرفروش‌ترین‌ها
          <span className="absolute w-fit h-fit bottom-0 left-0 right-0 mx-auto text-base text-neutral-900 dark:text-white">
            ۳۰ روز گذشته
          </span>
        </h1>
      </div>

      {/* Main Component */}
      <BestsellingMain
        categories={categories}
        bestSellerProducts={bestSellerProducts}
      />
    </div>
  );
}
