import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { Category } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default async function AdminCategoriesPage() {
  const categoriesPath = path.join(process.cwd(), "data", "categories.json");

  let categories: Category[] = [];

  try {
    const data = await fs.readFile(categoriesPath, "utf8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) categories = parsed;
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
          هیچ موردی برای نمایش وجود ندارد.
        </div>
      )}
    </>
  );
}
