import PageHeader from "@/src/components/admin/PageHeader";
import ProductForm from "@/src/components/admin/ProductForm";
import { Product, Category } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const productsPath = path.join(process.cwd(), "data", "products.json");
  const categoriesPath = path.join(process.cwd(), "data", "categories.json");

  let products: Product[] = [];
  let categories: Category[] = [];

  // 🧩 Load products
  try {
    const data = await fs.readFile(productsPath, "utf8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) products = parsed;
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read products.json:", error);
    }
  }

  // 🧩 Load categories
  try {
    const data = await fs.readFile(categoriesPath, "utf8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) categories = parsed;
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read categories.json:", error);
    }
  }

  // 🧩 Find product by ID
  const product = products.find((p) => p._id === id);

  return (
    <>
      <PageHeader title="ویرایش محصول" />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
