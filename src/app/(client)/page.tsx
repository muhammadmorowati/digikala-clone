import Articles from "@/src/components/home/Articles";
import {
  FirstBanner,
  MiddleBanner,
  LastBanner,
} from "@/src/components/home/Banner";
import Bestseller from "@/src/components/home/Bestseller";
import Brands from "@/src/components/home/Brands";
import Digiclub from "@/src/components/home/Digiclub";
import Hero from "@/src/components/home/Hero";
import MarketOffers from "@/src/components/home/MarketOffers";
import Offers from "@/src/components/home/Offers";
import ProductsCard from "@/src/components/home/ProductsCard";
import SelectedProducts from "@/src/components/home/SelectedProducts";
import Services from "@/src/components/home/Services";
import StorySlider from "@/src/components/home/StorySlider";
import FloatingSupermarketButton from "@/src/components/ui/FloatingSupermarketButton";
import FloatingSupportButton from "@/src/components/ui/FloatingSupportButton";
import Link from "next/link";
import CategoriesPage from "@/src/components/home/CategoriesPage";
import { Article, Product, Category, Submenu, Story } from "@/src/utils/types";

// 🧩 Mock Data — replace these with static imports later if needed
const mockStories: Story[] = [
  {
    _id: "s1" as any,
    title: "محصول جدید سامسونگ",
    cover: "/images/stories/samsung-story.webp",
    post: "/products/galaxy-s24",
  },
  {
    _id: "s2" as any,
    title: "لپ‌تاپ‌های جدید ایسوس",
    cover: "/images/stories/asus-story.webp",
    post: "/products/vivobook15",
  },
];

const mockCategories: Category[] = [
  {
    _id: "c1" as any,
    title: "موبایل",
    href: "/category/mobile",
    cover: ["/images/categories/mobile-cover.webp"],
    hero: ["/images/categories/mobile-hero.webp"],
    banner: ["/images/categories/mobile-banner.webp"],
    submenus: [],
  },
  {
    _id: "c2" as any,
    title: "لپ‌تاپ",
    href: "/category/laptop",
    cover: ["/images/categories/laptop-cover.webp"],
    hero: ["/images/categories/laptop-hero.webp"],
    banner: ["/images/categories/laptop-banner.webp"],
    submenus: [],
  },
];

const mockSubmenus: Submenu[] = [
  {
    _id: "sm1" as any,
    title: "گوشی سامسونگ",
    href: "/category/mobile/samsung",
    items: [
      {
        _id: "i1" as any,
        title: "Galaxy S24 Ultra",
        href: "/category/mobile/samsung/galaxy-s24-ultra",
      },
    ],
  },
];

const mockProducts: Product[] = [
  {
    _id: "p1" as any,
    title: "گوشی سامسونگ Galaxy S24 Ultra",
    en_title: "Samsung Galaxy S24 Ultra",
    rating: 4.9,
    voter: 120,
    thumbnail: "/images/products/galaxy-s24.webp",
    price: 58990000,
    discount: 10,
    discount_price: 52990000,
    description: "قدرتمندترین گوشی سامسونگ در سال 2025",
    recommended_percent: 95,
    guarantee: "۱۸ ماه گارانتی سامسونگ",
    categoryId: mockCategories[0]._id,
    submenuId: "sm1",
    submenuItemId: "i1",
    images: [],
    features: [],
    colors: []
  },
  {
    _id: "p2" as any,
    title: "لپ‌تاپ ایسوس Vivobook 15",
    en_title: "Asus Vivobook 15",
    rating: 4.6,
    voter: 85,
    thumbnail: "/images/products/vivobook15.webp",
    price: 34990000,
    discount: 5,
    discount_price: 32990000,
    description: "لپ‌تاپی مناسب برای کارهای روزمره و برنامه‌نویسی",
    recommended_percent: 89,
    guarantee: "۱۲ ماه گارانتی ایسوس",
    categoryId: mockCategories[1]._id,
    submenuId: "",
    submenuItemId: "",
    images: [],
    features: [],
    colors: []
  },
  {
    _id: "p3" as any,
    title: "تلویزیون LG OLED55C3",
    en_title: "LG OLED C3",
    rating: 4.7,
    voter: 90,
    thumbnail: "/images/products/lg-oled55c3.webp",
    price: 69990000,
    discount: 12,
    discount_price: 61590000,
    description: "تلویزیون هوشمند 55 اینچ OLED از LG",
    recommended_percent: 92,
    guarantee: "۲۴ ماه گارانتی گلدیران",
    categoryId: mockCategories[0]._id,
    submenuId: "",
    submenuItemId: "",
    images: [],
    features: [],
    colors: []
  },
];

const mockArticles: Article[] = [
  {
    _id: "a1" as any,
    title: "بررسی Galaxy S24 Ultra",
    author: "علی رضایی",
    content: "<p>گوشی Galaxy S24 Ultra پرچم‌دار جدید سامسونگ است...</p>",
    publishedAt: "2025-10-01",
    tags: ["موبایل", "سامسونگ"],
    source: "https://www.digikala.com/mag",
    readingTime: "5",
    cover: "/images/articles/galaxy-s24-article.webp",
  },
  {
    _id: "a2" as any,
    title: "راهنمای خرید لپ‌تاپ در سال 2025",
    author: "مریم احمدی",
    content: "<p>برای انتخاب لپ‌تاپ مناسب باید به چند نکته توجه کنید...</p>",
    publishedAt: "2025-09-15",
    tags: ["لپ‌تاپ", "راهنما"],
    source: "https://www.digikala.com/mag",
    readingTime: "6",
    cover: "/images/articles/laptop-guide.webp",
  },
];

export default async function Home() {
  // 🧠 Mocked instead of DB
  const stories = mockStories;
  const categories = mockCategories;
  const products = mockProducts;
  const submenus = mockSubmenus;
  const articles = mockArticles;

  // 🛒 Discount Products
  const discountProducts = products.filter((product) => (product.discount ?? 0) > 0);
  const offerProducts = discountProducts
    .slice()
    .sort((a, b) => b.discount! - a.discount!)
    .slice(0, 12);

  // 📰 Sort Articles by published date
  const sortedArticles = articles
    .slice()
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() -
        new Date(a.publishedAt).getTime()
    );

  return (
    <>
      <StorySlider stories={stories} />
      <Hero />
      <Services />
      <Offers products={offerProducts} />
      <MarketOffers />
      <FirstBanner />
      <CategoriesPage categories={categories} />
      <MiddleBanner />
      <Brands />
      <LastBanner />
      <ProductsCard
        cardNum="first"
        products={products}
        categories={categories}
        submenus={submenus}
      />
      <Digiclub />
      <Bestseller products={products} title="پرفروش‌ترین کالاها" />
      <ProductsCard
        cardNum="last"
        products={products}
        categories={categories}
        submenus={submenus}
      />
      <Link href="/products/66e595067d54b0fb3e317fcd">
        <div className="bg-[url('/banner/hotdog-banner.webp')] bg-cover bg-left bg-no-repeat h-40 rounded-2xl mx-3 my-5"></div>
      </Link>
      <SelectedProducts products={products} />
      <Bestseller products={products} title="داغ‌ترین چند ساعت گذشته" />
      <Articles articles={sortedArticles} title="خواندنی‌ها" />
      <FloatingSupportButton />
      <FloatingSupermarketButton />
    </>
  );
}
