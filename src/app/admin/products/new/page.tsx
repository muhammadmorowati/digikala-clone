import PageHeader from "@/src/components/admin/PageHeader";
import ProductForm from "@/src/components/admin/ProductForm";
import { Category } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default async function NewProductPage() {
  const categoriesFile = path.join(process.cwd(), "data", "categories.json");

  let categories: Category[] = [];

  try {
    const data = await fs.readFile(categoriesFile, "utf8");
    categories = JSON.parse(data);
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
