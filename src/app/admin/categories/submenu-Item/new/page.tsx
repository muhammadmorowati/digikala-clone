import CategorySubmenuItemForm from "@/src/components/admin/CategorySubmenuItemForm";
import PageHeader from "@/src/components/admin/PageHeader";


export default async function NewSubmenuPage() {
  return (
    <>
      <PageHeader title="افزودن آیتم زیرمجموعه دسته‌بندی" />
      <CategorySubmenuItemForm />
    </>
  );
}
