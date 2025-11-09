import AdminTable from "@/components/admin/AdminTable";
import PageHeader from "@/components/admin/PageHeader";
import { serializeDoc } from "@/utils/serializeDoc";

export default function AdminCategoriesPage() {
  return <ProductTable />;
}

async function ProductTable() {

  return (
    <>
      <PageHeader href="/admin/categories/new" title="دسته‌بندی ها" />
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
    </>
  );
}
