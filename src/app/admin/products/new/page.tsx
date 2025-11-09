import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { serializeDoc } from "@/utils/serializeDoc";

export default async function NewProductPage() {

  return (
    <>
      <PageHeader title="افزودن محصول جدید" />
      <ProductForm categories={[]} />
    </>
  );
}
