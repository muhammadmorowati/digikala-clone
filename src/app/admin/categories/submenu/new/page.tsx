import CategorySubmenuForm from "@/src/components/admin/CategorySubmenuForm";
import PageHeader from "@/src/components/admin/PageHeader";


export default function NewSubmenuPage() {
  return (
    <>
      <PageHeader title="افزودن زیر مجموعه دسته‌بندی" />
      <CategorySubmenuForm />
    </>
  );
}
