import { Category, Product, Submenu } from "@/src/utils/types";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardItem {
  title: string;
  href: string;
  products: Product[];
}

interface ProductCardProps {
  item: ProductCardItem;
  index: number;
}

export default function ProductsCard({
  products,
  submenus,
  categories,
  cardNum,
}: {
  products: Product[];
  submenus: Submenu[];
  categories: Category[];
  cardNum: string;
}) {
  // SUBMENUS FOR FIRST CARD
  const mobileSubmenu = submenus.find(
    (submenu) => submenu.title === "برندهای مختلف گوشی موبایل"
  );
  const gadgetSubmenu = submenus.find(
    (submenu) => submenu.title === "ساعت و مچ بند هوشمند"
  );
  const electronicSubmenu = submenus.find(
    (submenu) => submenu.title === "لوازم جانبی موبایل"
  );

  // CATEGORIES FOR FIRST CARD
  const stationeryCategory = categories.find(
    (category) => category.title === "کتاب، لوازم تحریر و هنر"
  );

  // CATEGORIES FOR LAST CARD
  const supermarketCategory = categories.find(
    (category) => category.title === "کالای خوراکی و اساسی"
  );
  const electronicCategory = categories.find(
    (category) => category.title === "کالای دیجیتال"
  );
  const homeCategory = categories.find(
    (category) => category.title === "خانه و آشپزخانه"
  );
  const apparelCategory = categories.find(
    (category) => category.title === "مد و پوشاک"
  );

  // FILTER PRODUCTS
  const mobileProducts = products.filter(
    (p) => p.submenuId === mobileSubmenu?._id.toString()
  );

  const mobileAccessoriesProducts = products.filter(
    (p) => p.submenuId === electronicSubmenu?._id.toString()
  );

  const gadgetProducts = products.filter(
    (p) => p.submenuId === gadgetSubmenu?._id.toString()
  );

  const stationeryProducts = products.filter(
    (p) => p.categoryId === stationeryCategory?._id.toString()
  );

  const supermarketProducts = products.filter(
    (p) => p.categoryId === supermarketCategory?._id.toString()
  );

  const electronicProducts = products.filter(
    (p) => p.categoryId === electronicCategory?._id.toString()
  );

  const homeProducts = products.filter(
    (p) => p.categoryId === homeCategory?._id.toString()
  );

  const apparelProducts = products.filter(
    (p) => p.categoryId === apparelCategory?._id.toString()
  );

  const firstProductCards: ProductCardItem[] = [
    {
      title: "گوشی موبایل",
      href: "/category/mobile/mobile-brands",
      products: mobileProducts,
    },
    {
      title: "لوازم جانبی موبایل",
      href: "/category/mobile/mobile-accessories",
      products: mobileAccessoriesProducts,
    },
    {
      title: "ساعت و مچ بند هوشمند",
      href: "/category/mobile/wearable-gadget",
      products: gadgetProducts,
    },
    {
      title: "لوازم تحریر",
      href: "/category/book-and-media",
      products: stationeryProducts,
    },
  ];

  const lastProductCards: ProductCardItem[] = [
    {
      title: "کالاهای سوپرمارکتی",
      href: "/category/food-beverage",
      products: supermarketProducts,
    },
    {
      title: "لپ تاپ و کالای دیجیتال",
      href: "/category/electronic-devices",
      products: electronicProducts,
    },
    {
      title: "خانه و آشپزخانه",
      href: "/category/home-and-kitchen",
      products: homeProducts,
    },
    {
      title: "مد و پوشاک",
      href: "/category/apparel",
      products: apparelProducts,
    },
  ];

  const selectedCards =
    cardNum === "first" ? firstProductCards : lastProductCards;

  return (
    <div className="border rounded-xl my-5 mx-3 overflow-hidden">
      <div className="border-l">
        <div className="grid grid-cols-12">
          {selectedCards.map((item, index) => (
            <ProductCard key={index} item={item} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ item }: ProductCardProps) {
  return (
    <div className="col-span-3 max-lg:col-span-12 border-l p-5">
      <h3 className="font-irsansb text-neutral-800 dark:text-white">
        {item.title}
      </h3>

      <small className="text-neutral-500 dark:text-neutral-400 text-xs">
        بر اساس سلیقه شما
      </small>

      <div className="grid grid-cols-12 mt-5">
        {item.products.slice(0, 4).map((product, index) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="col-span-6"
          >
            <Image
              alt={product.title}
              width={500}
              height={500}
              src={product.thumbnail}
              className={`p-2 ${
                index === 0 && "border-b border-l"
              } ${index === 1 && "border-b"} ${
                index === 2 && "border-l"
              }`}
            />
          </Link>
        ))}
      </div>

      <button className="text-xs mt-5 text-sky-500 flex justify-center w-full">
        <Link href={item.href} className="flex items-center">
          مشاهده <ChevronLeft size={20} />
        </Link>
      </button>
    </div>
  );
}
