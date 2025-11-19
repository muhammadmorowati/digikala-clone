import { Category, Product } from "@/src/utils/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/* ---------------------------
   🟦 Mock Category
---------------------------- */
const mockCategory: Category = {
  _id: "c1" as any,
  title: "کالای خوراکی و اساسی",
  href: "",
  icon: "",
  cover: [],
  hero: [],
  banner: [],
  submenus: [],
};

/* ---------------------------
   🟩 Mock Products
---------------------------- */
const mockProducts: Product[] = [
  {
    _id: "p1" as any,
    title: "برنج ایرانی ممتاز",
    price: 450000,
    discount: 25,
    thumbnail: "/mock/rice.jpg",
    categoryId: mockCategory._id,
    images: [],
    colors: [],
    features: [],
    description: "",
    submenuId: "",
    submenuItemId: "",
  },
  {
    _id: "p2" as any,
    title: "روغن سرخ‌کردنی",
    price: 250000,
    discount: 18,
    thumbnail: "/mock/oil.jpg",
    categoryId: mockCategory._id,
    images: [],
    colors: [],
    features: [],
    description: "",
    submenuId: "",
    submenuItemId: "",
  },
  {
    _id: "p3" as any,
    title: "چای سیاه لاهیجان",
    price: 190000,
    discount: 30,
    thumbnail: "/mock/tea.jpg",
    categoryId: mockCategory._id,
    images: [],
    colors: [],
    features: [],
    description: "",
    submenuId: "",
    submenuItemId: "",
  },
  {
    _id: "p4" as any,
    title: "قند شکسته",
    price: 120000,
    discount: 10,
    thumbnail: "/mock/sugar.jpg",
    categoryId: mockCategory._id,
    images: [],
    colors: [],
    features: [],
    description: "",
    submenuId: "",
    submenuItemId: "",
  },
];

/* ---------------------------
   🟧 Filter + Sort Discounted
---------------------------- */
const DiscountProducts = mockProducts
  .filter((p) => p.discount > 0)
  .sort((a, b) => b.discount - a.discount);

/* ---------------------------
   🟥 Main Component
---------------------------- */
export default function MarketOffers() {
  const topDiscount = DiscountProducts[0]?.discount || 0;

  return (
    <div className="bg-gray-200 dark:bg-stone-800 rounded-2xl py-4 lg:px-10 px-5 mx-3 mt-5 bg-[url('/offer-pattern.svg')] bg-left bg-no-repeat">
      <div className="flex max-lg:flex-col lg:items-center items-start justify-between gap-5 w-full">

        {/* 🔥 Header / Title */}
        <Link
          href="/fresh/incredible-offers"
          className="flex lg:items-center items-start lg:gap-5 gap-2 max-lg:flex-col"
        >
          <div className="flex items-center lg:gap-5">
            <Image
              alt="fresh incredible offers"
              width={50}
              height={50}
              src={"/fresh.webp"}
            />
            <span className="text-green-700 font-bold text-lg whitespace-nowrap">
              پیشنهاد شگفت‌انگیز سوپرمارکتی
            </span>
          </div>

          <div className="bg-green-600 whitespace-nowrap rounded-full text-white text-sm px-2 py-1">
            تا {topDiscount}% تخفیف
          </div>
        </Link>

        {/* 🛒 Product List */}
        <div className="flex items-center max-lg:w-full max-lg:justify-between gap-2">
          {/* Desktop */}
          <div className="flex items-center gap-1.5 max-lg:hidden">
            {DiscountProducts.slice(0, 4).map((product) => (
              <DiscountProductCard key={product._id.toString()} product={product} />
            ))}
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {DiscountProducts.slice(0, 3).map((product) => (
              <DiscountProductCard key={product._id.toString()} product={product} />
            ))}
          </div>

          <Link
            href="/fresh/incredible-offers"
            className="bg-white whitespace-nowrap rounded-full text-green-700 text-[13px] p-3 flex items-center gap-3"
          >
            <span className="max-lg:hidden">
              بیش از {DiscountProducts.length - 1} کالا
            </span>
            <ArrowLeft size={20} />
          </Link>
        </div>

      </div>
    </div>
  );
}

/* ---------------------------
   🟪 Product Card
---------------------------- */
function DiscountProductCard({ product }: { product: Product }) {
  return (
    <div className="relative bg-white w-[4.5rem] h-[4.5rem] rounded-full flex items-center justify-center shadow">
      <Link href={`/products/${product._id}`}>
        <Image
          width={50}
          height={50}
          alt={product.title}
          src={product.thumbnail}
          className="rounded-full w-14 h-14 object-contain"
        />
      </Link>
      <div className="absolute right-0 bottom-0 z-10 bg-red-600 text-white rounded-full px-1 py-0.5 text-xs">
        {product.discount}٪
      </div>
    </div>
  );
}
