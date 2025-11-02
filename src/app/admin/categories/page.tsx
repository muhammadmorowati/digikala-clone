import connectToDB from "@/config/mongodb";
import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";


export default function AdminCategoriesPage() {
  return <ProductTable />;
}

async function ProductTable() {
  await connectToDB();
  const categories = await CategoryModel.find({})
    .populate({
      path: "submenus",
      populate: {
        path: "items",
      },
    })
    .lean();

  const serializedCategories = serializeDoc(categories);

  return (
    <>
      <PageHeader href="/admin/categories/new" title="دسته‌بندی ها" />
      {categories.length ? (
        <AdminTable categories={serializedCategories} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
