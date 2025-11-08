import connectToDB from "@/config/mongodb";
import Categories from "@/src/components/categories/Categories";
import { serializeDoc } from "@/src/utils/serializeDoc";
import { Product } from "@/src/utils/types";
import CategoryModel from "@/models/Category";
import ProductModel from "@/models/Product"

export default async function CategoriesPage() {
  await connectToDB();
  const categories = await CategoryModel.find({})
    .populate({
      path: "submenus",
      populate: {
        path: "items",
      },
    })
    .lean();

  const product: Product[] = await ProductModel.find({})
    .populate("images")
    .populate("colors")
    .populate("features")
    .populate({
      path: "category",
      populate: {
        path: "submenus",
        populate: {
          path: "items",
        },
      },
    })
    .lean();

  const serializedCategories = serializeDoc(categories);
  const serializedProduct = serializeDoc(product);

  return (
    <>
      <Categories
        categories={serializedCategories}
        products={serializedProduct}
      />
    </>
  );
}
