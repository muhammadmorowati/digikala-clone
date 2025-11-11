import NotFound from "@/src/app/not-found";
import { Category, Product, Article } from "@/src/utils/types";
import Image from "next/image";
import Link from "next/link";
import Articles from "../home/Articles";
import Bestseller from "../home/Bestseller";
import Brands from "../home/Brands";
import Offers from "../home/Offers";
import SelectedProducts from "../home/SelectedProducts";
import CategoryHero from "./CategoryHero";

export default function CategoryProducts({ id }: { id: string }) {
  // 🧩 Mock category data — now includes `cover` and `hero`
  const mockCategory: Category = {
    _id: "category1",
    title: "لوازم تحریر",
    href: `/category/${id}`,
    cover: ["/banners/category-cover.jpg"],
    hero: ["/banners/category-hero.jpg"],
    banner: ["/banners/banner1.jpg", "/banners/banner2.jpg"],
    submenus: [
      {
        _id: "submenu1",
        title: "دفتر و کاغذ",
        href: "/category/stationery/paper",
        items: [
          { _id: "item1", title: "دفتر", href: "/category/stationery/paper/notebooks" },
          { _id: "item2", title: "کاغذ", href: "/category/stationery/paper/sheets" },
        ],
      },
      {
        _id: "submenu2",
        title: "نوشت‌افزار",
        href: "/category/stationery/pen",
        items: [
          { _id: "item3", title: "خودکار", href: "/category/stationery/pen/ballpen" },
          { _id: "item4", title: "مداد", href: "/category/stationery/pen/pencil" },
        ],
      },
    ],
  };

  // 🛍️ Mock products — removed unsupported `href`
  const mockProducts: Product[] = [
    {
      _id: "product1",
      title: "دفتر 80 برگ",
      price: 25000,
      discount: 10,
       discount_price: 22500,
      thumbnail: "/products/notebook.jpg",
      category: mockCategory,
      submenuId: "submenu1",
      description: "",
      submenuItemId: ""
    },
    {
      _id: "product2",
      title: "خودکار آبی",
      price: 15000,
      discount: 0,
       discount_price: 15000,
      thumbnail: "/products/pen.jpg",
      category: mockCategory,
      submenuId: "submenu2",
      description: "",
      submenuItemId: ""
    },
  ];

  // 📰 Mock articles — removed unsupported `image` and `href`
  const mockArticles: Article[] = [
    {
      _id: "article1",
      title: "چطور دفتر مناسب انتخاب کنیم؟",
      content: "راهنمای انتخاب دفتر و کاغذ مناسب برای شما.",
      categoryId: "category1",
      author: "",
      publishedAt: undefined,
      tags: [],
      source: "",
      readingTime: "",
      cover: ""
    },
  ];

  if (!mockCategory) return NotFound();

  const categoryProducts = mockProducts.filter(
    (product) =>  typeof product.category !== "string" &&
    product.category.href === `/category/${id}`
  );

  const discountProducts = categoryProducts.filter((p) => p.discount > 0);
  const offerProducts = discountProducts
    .slice()
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 12);

  const submenuProductImages = mockCategory.submenus.map((submenu) => {
    const firstProduct = categoryProducts.find(
      (product) => product.submenuId === submenu._id
    );
    return firstProduct?.thumbnail || "";
  });

  return (
    <div className="space-y-10">
      <CategoryHero category={mockCategory} />
      <Offers products={offerProducts} />

      {mockCategory.submenus.length > 0 && (
        <div>
          <h3 className="font-irsansb text-lg text-center">
            خرید بر اساس دسته‌بندی
          </h3>
          <div className="mt-10 px-4 flex gap-10 items-center lg:justify-center flex-wrap">
            {mockCategory.submenus.map((submenu, index) =>
              submenuProductImages[index] ? (
                <div key={submenu._id}>
                  <Link
                    href={submenu.href}
                    className="relative mb-5 flex flex-col items-center gap-2"
                  >
                    <Image
                      alt={submenu.title}
                      width={120}
                      height={120}
                      src={submenuProductImages[index]}
                    />
                    <p className="text-sm">{submenu.title}</p>
                  </Link>
                </div>
              ) : null
            )}
          </div>
        </div>
      )}

      <Brands />

      <div className="grid grid-cols-12 gap-4 mx-3">
        {mockCategory.banner?.map((item, index) => (
          <div className="col-span-6 max-lg:col-span-12" key={index}>
            <Link href="#">
              <Image
                width={1700}
                height={1700}
                className="rounded-xl object-cover w-full"
                src={item}
                alt={`Banner ${index + 1}`}
              />
            </Link>
          </div>
        ))}
      </div>

      <Bestseller products={categoryProducts} title="پرفروش‌ترین کالاها" />

      <div>
        <Image
          alt="زنگ تفریح دیجی‌کالا"
          title="زنگ تفریح دیجی‌کالا"
          width={2000}
          height={500}
          src="/069665291f9d877a19922f0c741e7620ad85cf6b_1725653469.gif"
        />
      </div>

      <SelectedProducts products={categoryProducts} />

      {mockArticles.length > 0 && (
        <Articles articles={mockArticles} title="مطالب مرتبط" />
      )}
    </div>
  );
}
