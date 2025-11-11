import PageHeader from "@/src/components/admin/PageHeader";
import ProductForm from "@/src/components/admin/ProductForm";
import { Category } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default async function NewProductPage() {
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
      <PageHeader title="افزودن محصول جدید" />
      <ProductForm categories={categories} />
    </>
  );
}
