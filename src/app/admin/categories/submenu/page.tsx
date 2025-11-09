import AdminTable from "@/components/admin/AdminTable";
import PageHeader from "@/components/admin/PageHeader";

export default function SubmenuPage() {
  return <SubmenuTable />;
}

async function SubmenuTable() {

  return (
    <>
      <PageHeader
        title="زیرمجموعه دسته‌بندی ها"
        href="/admin/categories/submenu/new"
      />

        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
    </>
  );
}
