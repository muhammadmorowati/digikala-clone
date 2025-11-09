
import NotFound from "@/app/not-found";
import { serializeDoc } from "@/utils/serializeDoc";
import { Category, Product } from "@/utils/types";
import Image from "next/image";
import Link from "next/link";
import Articles from "../home/Articles";
import Bestseller from "../home/Bestseller";
import Brands from "../home/Brands";
import Offers from "../home/Offers";
import SelectedProducts from "../home/SelectedProducts";
import CategoryHero from "./CategoryHero";

export default async function CategoryProducts({ id }: { id: string }) {

  return (
    <div className="space-y-10">


      {/* Shopping by category */}
        <div>
          <h3 className="font-irsansb text-lg text-center">
            خرید بر اساس دسته‌بندی
          </h3>
          <div className="mt-10 px-4 flex gap-10 items-center lg:justify-center flex-wrap">                 
          </div>
        </div>

      <Brands />

      {/* Banners */}
      <div className="grid grid-cols-12 gap-4 mx-3">
        
      </div>

      <Bestseller
        products={[]}
        title="پرفروش‌ترین کالاها"
      />
      <div>
        <Image
          alt="زنگ تفریح دیجی‌کالا"
          title="زنگ تفریح دیجی‌کالا"
          width={2000}
          height={500}
          src="/069665291f9d877a19922f0c741e7620ad85cf6b_1725653469.gif"
        />
      </div>
    </div>
  );
}
