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

/** Generic JSON loader */
async function readJSON<T>(relativePath: string): Promise<T[]> {
  const filePath = path.join(process.cwd(), "data", relativePath);
  try {
    const fileContent = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContent) as T[];
  } catch (error) {
    console.error(`❌ Failed to read JSON file: ${relativePath}`, error);
    return [];
  }
}

/** Generate SEO metadata dynamically */
export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const products = await readJSON<Product>("products.json");
  const product = products.find((p) => p._id.toString() === id);

  return {
    title: product ? `قیمت و خرید ${product.title}` : "محصول یافت نشد",
    description: product?.description ?? "مشاهده جزئیات محصول در دیجی‌کالا",
    openGraph: product
      ? {
          title: product.title,
          description: product.description ?? "",
          images: [{ url: product.thumbnail ?? "/default-product.webp" }],
        }
      : undefined,
  };
}

/** Main product page */
export default async function ProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const products = await readJSON<Product>("products.json");
  const product = products.find((p) => p._id.toString() === id);

  if (!product) return notFound();

  const serializedProduct = serializeDoc(product);
  const category = serializedProduct.category as any;

  // Optional breadcrumb hierarchy
  const submenu: Submenu | undefined = category?.submenus?.[0];
  const item: SubmenuItem | undefined = submenu?.items?.[0];

  return (
    <div className="flex flex-col gap-10 px-4 py-4">
      {/* Mobile header */}
      <ProductPageMobileStickyHeader productId={id} />

      {/* Breadcrumb and Actions */}
      <div className="mb-4 flex items-center justify-between">
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

        {/* External Links (Desktop Only) */}
        <div className="hidden items-center gap-5 lg:flex">
          <Link
            href="https://pindo.ir"
            target="_blank"
            className="flex items-center gap-2 text-xs text-neutral-400"
          >
            <span>ثبت آگهی در پیندو</span>
            <Megaphone size={17} />
          </Link>
          <Link
            href="/landings/seller-introduction"
            target="_blank"
            className="flex items-center gap-2 text-xs text-neutral-400"
          >
            <span>فروش در دیجی‌کالا</span>
            <Store size={17} />
          </Link>
        </div>
      </div>

      {/* Main Product Details */}
      <ProductMain product={serializedProduct} />
    </div>
  );
}
