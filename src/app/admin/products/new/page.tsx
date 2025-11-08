import connectToDB from "@/config/mongodb";
import PageHeader from "@/src/components/admin/PageHeader";
import ProductForm from "@/src/components/admin/ProductForm";
import { serializeDoc } from "@/src/utils/serializeDoc";
import CategoryModel from "@/models/Category"

export default async function NewProductPage() {
  await connectToDB();
  const categories = await CategoryModel.find({})
    .populate({
      path: "submenus",
      populate: {
        path: "items",
      },
    })
    .lean();
  const serializedCategories = serializeDoc(categories);

  return (
    <>
      <PageHeader title="افزودن محصول جدید" />
      <ProductForm categories={serializedCategories} />
    </>
  );
}
