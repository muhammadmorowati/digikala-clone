import CategoryForm from "@/src/components/admin/CategoryForm";
import PageHeader from "@/src/components/admin/PageHeader";
import { Category } from "@/src/utils/types";
import { promises as fs } from "fs";
import { notFound } from "next/navigation";
import { CATEGORIES_FILE_PATH } from "@/src/utils/paths"; // ✅ shared path helper

export default async function EditCategoryPage({
  params: { id },
}: {
  params: { id: string };
}) {
  let categories: Category[] = [];

  try {
    const data = await fs.readFile(CATEGORIES_FILE_PATH, "utf8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) categories = parsed;
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read categories.json:", error);
    }
  }

  const category = categories.find((cat) => cat._id === id);

  if (!category) return notFound();

  return (
    <>
      <PageHeader title="ویرایش دسته‌بندی" />
      <CategoryForm category={category} />
    </>
  );
}
