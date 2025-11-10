import CategoryForm from "@/src/components/admin/CategoryForm";
import PageHeader from "@/src/components/admin/PageHeader";
import { Category } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default async function EditCategoryPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const categoriesFilePath = path.join(process.cwd(), "data", "categories.json");

  let categories: Category[] = [];
  try {
    const data = await fs.readFile(categoriesFilePath, "utf8");
    categories = JSON.parse(data);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read categories.json:", error);
    }
  }

  // Find category by ID in mock data
  const category = categories.find((cat) => cat._id === id);

  return (
    <>
      <PageHeader title="ویرایش دسته‌بندی" />
      {category ? (
        <CategoryForm category={category} />
      ) : (
        <div className="text-neutral-500 p-5 text-center">
          دسته‌بندی مورد نظر پیدا نشد.
        </div>
      )}
    </>
  );
}
