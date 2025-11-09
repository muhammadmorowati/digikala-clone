import CategoryForm from "@/components/admin/CategoryForm";
import PageHeader from "@/components/admin/PageHeader";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {

  return (
    <>
      <PageHeader title="ویرایش دسته‌بندی" />
    </>
  );
}
