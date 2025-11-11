import MarketOffers from "@/src/components/home/MarketOffers";
import Offers from "@/src/components/home/Offers";
import SelectedProducts from "@/src/components/home/SelectedProducts";
import IncredibleOffersCategoriesSlider from "@/src/components/incredible-offers/IncredibleOffersCategoriesSlider";
import IncredibleOffersProductsSlider from "@/src/components/incredible-offers/IncredibleOffersProductsSlider";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { incredibleOfferCategories, incredibleOfferProducts } from "@/src/data/incredibleOffersData";

export default function IncredibleOffers() {
  const discountProducts = incredibleOfferProducts.filter(p => p.discount > 0);
  const sortedByDiscount = [...discountProducts].sort((a, b) => b.discount - a.discount);
  const sortedByRating = [...discountProducts].sort((a, b) => b.rating - a.rating);

  return (
    <div className="flex flex-col gap-10">
      <IncredibleOffersHero />

      <section className="relative lg:px-5 overflow-hidden bg-rose-600 lg:rounded-2xl py-4 lg:mx-3">
        <div className="absolute brightness-200 right-0 top-0 w-full bg-[url('/nav-links-svg.svg')] h-36 opacity-80"></div>
        <header className="flex items-center gap-2 mb-5 max-lg:mx-5">
          <Sparkles size={20} className="text-white" />
          <p className="font-irsansb text-white">
            <span>شگفت‌انگیز روز</span>
          </p>
        </header>
        <IncredibleOffersProductsSlider products={sortedByDiscount} />
      </section>

      <IncredibleOffersCategoriesSlider categories={incredibleOfferCategories} />
      <Offers products={sortedByRating} />
      <MarketOffers />
      <SelectedProducts products={incredibleOfferProducts} />
    </div>
  );
}

function IncredibleOffersHero() {
  return (
    <div className="w-full">
      <div className="w-full h-16 bg-rose-500 flex items-center justify-center">
        <Image
          alt="incredible-offers"
          src="/incredible-offers/incredible-offers.svg"
          width={600}
          height={600}
          priority
        />
      </div>
      <Link href="/products/1">
        <Image
          alt="incredible-offers-banner"
          src="/incredible-offers/incredible-offers-banner.webp"
          width={1500}
          height={1500}
          className="w-full lg:h-80 h-64 object-cover"
        />
      </Link>
    </div>
  );
}
