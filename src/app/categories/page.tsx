import Categories from "@/src/components/categories/Categories";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { Category, Product } from "@/src/utils/types";
import path from "path";
import { promises as fs } from "fs";

async function readJSON<T>(file: string): Promise<T[]> {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data) as T[];
  } catch {
    return [];
  }
}

export default async function CategoriesPage() {
  // 🔹 Read data from JSON files instead of database
  const categoriesFile = path.join(process.cwd(), "data", "categories.json");
  const productsFile = path.join(process.cwd(), "data", "products.json");

  const categories = await readJSON<Category>(categoriesFile);
  const products = await readJSON<Product>(productsFile);

  const serializedCategories = serializeDoc(categories);
  const serializedProduct = serializeDoc(products);

  return (
    <>
      <Categories
        categories={serializedCategories}
        products={serializedProduct}
      />
    </>
  );
}
