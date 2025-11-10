import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { Category } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default function AdminCategoriesPage() {
  return <CategoryTable />;
}

async function CategoryTable() {
  // Path to JSON file
  const categoriesPath = path.join(process.cwd(), "data", "categories.json");

  let categories: Category[] = [];

  try {
    const data = await fs.readFile(categoriesPath, "utf8");
    categories = JSON.parse(data);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read categories.json:", error);
    }
  }

  return (
    <>
      <PageHeader href="/admin/categories/new" title="دسته‌بندی‌ها" />
      {categories.length > 0 ? (
        <AdminTable categories={categories} />
      ) : (
        <div className="text-neutral-500 p-5 text-center">
          آیتمی برای نمایش وجود ندارد.
        </div>
      )}
    </>
  );
}
