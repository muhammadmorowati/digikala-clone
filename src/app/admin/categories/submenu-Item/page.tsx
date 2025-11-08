import connectToDB from "@/config/mongodb";
import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";
import SubmenuItemModel from "@/models/SubmenuItem"

export default function SubmenuItemPage() {
  return <SubmenuItemTable />;
}

async function SubmenuItemTable() {
  await connectToDB();
  const submenuItems = await SubmenuItemModel.find({}).lean();
  const serializedSubmenuItems = serializeDoc(submenuItems);

  return (
    <>
      <PageHeader
        title="آیتم های زیرمجموعه دسته‌بندی ها"
        href="/admin/categories/submenu-Item/new"
      />
      {submenuItems.length ? (
        <AdminTable submenuItems={serializedSubmenuItems} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
