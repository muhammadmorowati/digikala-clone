import BreadcrumbContainer from "@/components/product/BreadcrumbContainer";
import ProductMain from "@/components/product/ProductMain";
import ProductPageMobileStickyHeader from "@/components/ui/ProductPageMobileStickyHeader";
import { serializeDoc } from "@/utils/serializeDoc";
import { Product, Submenu, SubmenuItem } from "@/utils/types";
import { Megaphone, Store } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {

  return (
    <div className="px-4 flex flex-col gap-10 py-4">
      <ProductPageMobileStickyHeader productId={id} />
      <div className="flex justify-between items-center mb-4">
        <nav className="grow min-w-0">
          <div className="breadcrumb-container flex overflow-x-auto overflow-y-hidden hide-scrollbar">
          
          </div>
        </nav>
        <div className="flex gap-5 items-center max-lg:hidden">
          <Link
            href="https://pindo.ir"
            target="_blank"
            className="gap-2 items-center flex text-xs text-neutral-400"
          >
            <span>ثبت آگهی در پیندو</span>
            <Megaphone size={17} />
          </Link>
          <Link
            href="/landings/seller-introduction"
            target="_blank"
            className="gap-2 items-center flex text-xs text-neutral-400"
          >
            <span>فروش در دیجی‌کالا</span>
            <Store size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}
