import Categories from "@/src/components/categories/Categories";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { Category, Product } from "@/src/utils/types";
import path from "path";
import { readJSON } from "@/src/utils/fileUtils";

// ─────────────────────────── Component ───────────────────────────
export default async function CategoriesPage() {
  // 🔹 Define data file paths
  const basePath = path.join(process.cwd(), "data");
  const categoriesFile = path.join(basePath, "categories.json");
  const productsFile = path.join(basePath, "products.json");

  // 🔹 Read JSON files (with fallbacks handled by readJSON)
  const [categories, products] = await Promise.all([
    readJSON<Category>(categoriesFile),
    readJSON<Product>(productsFile),
  ]);

  // 🔹 Serialize to prepare for client rendering (if needed)
  const serializedCategories = serializeDoc(categories);
  const serializedProducts = serializeDoc(products);

  // 🔹 Render
  return (
    <Categories
      categories={serializedCategories}
      products={serializedProducts}
    />
  );
}
