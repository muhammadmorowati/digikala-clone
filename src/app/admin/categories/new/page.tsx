import CategoryForm from "@/src/components/admin/CategoryForm";
import PageHeader from "@/src/components/admin/PageHeader";


export default function NewCategoryPage() {
  return (
    <>
      <PageHeader title="افزودن دسته‌بندی جدید" />
      <CategoryForm />
    </>
  );
}
