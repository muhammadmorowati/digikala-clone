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
  const productsFile = path.join(process.cwd(), "data", "products.json");
  const categoriesFile = path.join(process.cwd(), "data", "categories.json");

  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    const productsData = await fs.readFile(productsFile, "utf8");
    products = JSON.parse(productsData);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read products.json:", error);
    }
  }

  try {
    const categoriesData = await fs.readFile(categoriesFile, "utf8");
    categories = JSON.parse(categoriesData);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read categories.json:", error);
    }
  }

  // Find product by ID
  const product = products.find((p) => p._id === id);

  return (
    <>
      <PageHeader title="ویرایش محصول" />
      <ProductForm product={product} categories={categories} />
    </>
  );
}
