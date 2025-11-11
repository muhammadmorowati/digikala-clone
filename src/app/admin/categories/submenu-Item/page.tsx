import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { Submenu } from "@/src/utils/types";
import { promises as fs } from "fs";
import { SUBMENUS_FILE_PATH } from "@/src/utils/paths"; // ✅ centralized constant

export default async function SubmenuPage() {
  let submenus: Submenu[] = [];

  try {
    const data = await fs.readFile(SUBMENUS_FILE_PATH, "utf8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) submenus = parsed;
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
          هنوز زیرمجموعه‌ای ثبت نشده است.
        </div>
      )}
    </>
  );
}
