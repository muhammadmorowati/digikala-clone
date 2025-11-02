import connectToDB from "@/config/mongodb";
import PageHeader from "@/src/components/admin/PageHeader";
import ProductForm from "@/src/components/admin/ProductForm";
import { serializeDoc } from "@/src/utils/serializeDoc";


export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  await connectToDB();
  const product = await ProductModel.findOne({ _id: id })
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

  const categories = await CategoryModel.find({})
    .populate({
      path: "submenus",
      populate: {
        path: "items",
      },
    })
    .lean();

  const serializedProduct = serializeDoc(product);
  const serializedCategories = serializeDoc(categories);

  return (
    <>
      <PageHeader title="ویرایش محصول" />
      <ProductForm
        product={serializedProduct}
        categories={serializedCategories}
      />
    </>
  );
}
