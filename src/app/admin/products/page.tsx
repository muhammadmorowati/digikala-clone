import connectToDB from "@/config/mongodb";
import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";


export default function AdminProductsPage() {
  return <ProductTable />;
}

async function ProductTable() {
  await connectToDB();
  const products = await ProductModel.find({}).lean();
  const serializedProducts = serializeDoc(products);

  return (
    <>
      <PageHeader href="/admin/products/new" title="محصولات" />
      {products.length ? (
        <AdminTable products={serializedProducts} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
