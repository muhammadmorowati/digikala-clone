import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { Submenu } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default function SubmenuPage() {
  return <SubmenuTable />;
}

async function SubmenuTable() {
  const submenusFilePath = path.join(process.cwd(), "data", "submenus.json");

  let submenus: Submenu[] = [];

  try {
    const data = await fs.readFile(submenusFilePath, "utf8");
    submenus = JSON.parse(data);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read submenus.json:", error);
    }
  }

  return (
    <>
      <PageHeader
        title="زیرمجموعه دسته‌بندی‌ها"
        href="/admin/categories/submenu/new"
      />
      {submenus.length > 0 ? (
        <AdminTable submenus={submenus} />
      ) : (
        <div className="text-neutral-500 p-5 text-center">
          آیتمی برای نمایش وجود ندارد.
        </div>
      )}
    </>
  );
}
