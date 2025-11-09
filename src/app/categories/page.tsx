import Categories from "@/components/categories/Categories";
import { serializeDoc } from "@/utils/serializeDoc";
import { Product } from "@/utils/types";

export default async function CategoriesPage() {

  return (
    <>
      <Categories
        categories={[]}
        products={[]}
      />
    </>
  );
}
