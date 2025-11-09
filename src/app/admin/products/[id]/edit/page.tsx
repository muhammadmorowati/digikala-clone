import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { serializeDoc } from "@/utils/serializeDoc";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {

  return (
    <>
      <PageHeader title="ویرایش محصول" />
    </>
  );
}
