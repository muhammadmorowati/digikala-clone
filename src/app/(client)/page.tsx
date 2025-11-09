
import Articles from "@/components/home/Articles";
import { FirstBanner, MiddleBanner, LastBanner } from "@/components/home/Banner";
import Bestseller from "@/components/home/Bestseller";
import Brands from "@/components/home/Brands";
import Digiclub from "@/components/home/Digiclub";
import Hero from "@/components/home/Hero";
import MarketOffers from "@/components/home/MarketOffers";
import Offers from "@/components/home/Offers";
import ProductsCard from "@/components/home/ProductsCard";
import SelectedProducts from "@/components/home/SelectedProducts";
import Services from "@/components/home/Services";
import StorySlider from "@/components/home/StorySlider";
import FloatingSupermarketButton from "@/components/ui/FloatingSupermarketButton";
import FloatingSupportButton from "@/components/ui/FloatingSupportButton";
import { serializeDoc } from "@/utils/serializeDoc";
import { Article } from "@/utils/types";
import Link from "next/link";
import CategoriesPage from "@/components/home/CategoriesPage";

export default async function Home() {

  return (
    <>
      <StorySlider stories={[]} />
      <Hero />
      <Services />
      <Offers products={[]} />
      <MarketOffers />
      <FirstBanner />
      <CategoriesPage categories={[]} />
      <MiddleBanner />
      <Brands />
      <LastBanner />
      <ProductsCard
        cardNum={"first"}
        products={[]}
        categories={[]}
        submenus={[]}
      />
      <Digiclub />
      <Bestseller products={[]} title="پرفروش‌ترین کالاها" />
      <ProductsCard
        cardNum={"last"}
        products={[]}
        categories={[]}
        submenus={[]}
      />
      <Link href="/products/66e595067d54b0fb3e317fcd">
        <div className="bg-[url('/banner/hotdog-banner.webp')] bg-cover bg-left bg-no-repeat h-40 rounded-2xl mx-3 my-5"></div>
      </Link>
      <SelectedProducts products={[]} />
      <Bestseller
        products={[]}
        title="داغ ترین چند ساعت گذشته"
      />
      <Articles articles={[]} title="خواندنی‌ها" />
      <FloatingSupportButton />
      <FloatingSupermarketButton />
    </>
  );
}
