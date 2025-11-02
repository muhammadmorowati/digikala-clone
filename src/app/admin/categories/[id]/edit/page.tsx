import CategoryForm from "@/src/components/admin/CategoryForm";
import PageHeader from "@/src/components/admin/PageHeader";


export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const category = await CategoryModel.findOne({ _id: id });

  return (
    <>
      <PageHeader title="ویرایش دسته‌بندی" />
      <CategoryForm category={category} />
    </>
  );
}
