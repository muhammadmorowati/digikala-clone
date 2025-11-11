import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import path from "path";
import { Product } from "@/src/utils/types";
import { readJSON } from "@/src/utils/fileUtils";

export default function AdminProductsPage() {
  return <ProductTable />;
}

async function ProductTable() {
  const filePath = path.join(process.cwd(), "data", "products.json");

  // Safely read products file
  let products: Product[] = [];
  try {
    products = await readJSON<Product>(filePath);
  } catch (error) {
    console.error("❌ Failed to load products.json:", error);
  }

  const hasProducts = products.length > 0;

  return (
    <>
      <PageHeader href="/admin/products/new" title="محصولات" />
      {hasProducts ? (
        <AdminTable products={products} />
      ) : (
        <div className="text-neutral-500 text-center p-5">
          آیتمی برای نمایش وجود ندارد.
        </div>
      )}
    </>
  );
}
