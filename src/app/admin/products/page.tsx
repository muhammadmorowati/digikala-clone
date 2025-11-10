import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import path from "path";
import { promises as fs } from "fs";
import { Product } from "@/src/utils/types";
import { readJSON } from "@/src/utils/fileUtils";

export default function AdminProductsPage() {
  return <ProductTable />;
}

async function ProductTable() {
  const filePath = path.join(process.cwd(), "data", "products.json");
  const products = await readJSON<Product>(filePath);

  return (
    <>
      <PageHeader href="/admin/products/new" title="محصولات" />
      {products.length ? (
        <AdminTable products={products} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
