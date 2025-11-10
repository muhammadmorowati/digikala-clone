import BreadcrumbContainer from "@/src/components/product/BreadcrumbContainer";
import ProductMain from "@/src/components/product/ProductMain";
import ProductPageMobileStickyHeader from "@/src/components/ui/ProductPageMobileStickyHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { Product, Submenu, SubmenuItem } from "@/src/utils/types";
import { Megaphone, Store } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import { promises as fs } from "fs";

async function readJSON<T>(file: string): Promise<T[]> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const products = await readJSON<Product>(filePath);
  const product = products.find((p) => p._id.toString() === id);

  if (!product) return { title: "محصول یافت نشد" };

  return {
    title: { absolute: `قیمت و خرید ${product.title}` },
  };
}

export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const products = await readJSON<Product>(filePath);
  const product = products.find((p) => p._id.toString() === id);

  if (!product) return notFound();

  const serializedProduct = serializeDoc(product);
  const category = serializedProduct.category as any;

  // 🧭 Simulate submenu hierarchy for breadcrumb (optional)
  const submenu: Submenu | undefined = category?.submenus?.[0];
  const item: SubmenuItem | undefined = submenu?.items?.[0];

  return (
    <div className="px-4 flex flex-col gap-10 py-4">
      <ProductPageMobileStickyHeader productId={id} />
      <div className="flex justify-between items-center mb-4">
        <nav className="grow min-w-0">
          <div className="breadcrumb-container flex overflow-x-auto overflow-y-hidden hide-scrollbar">
            <BreadcrumbContainer
              title={serializedProduct.title}
              category={category}
              submenu={submenu}
              item={item}
            />
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

      <ProductMain product={serializedProduct} />
    </div>
  );
}
