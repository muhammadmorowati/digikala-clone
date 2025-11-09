import AdminTable from "@/components/admin/AdminTable";
import PageHeader from "@/components/admin/PageHeader";
import { serializeDoc } from "@/utils/serializeDoc";

export default function SubmenuItemPage() {
  return <SubmenuItemTable />;
}

async function SubmenuItemTable() {

  return (
    <>
      <PageHeader
        title="آیتم های زیرمجموعه دسته‌بندی ها"
        href="/admin/categories/submenu-Item/new"
      />

        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
    </>
  );
}
