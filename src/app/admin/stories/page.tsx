import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import path from "path";
import { promises as fs } from "fs";
import { Story } from "@/src/utils/types";
import { readJSON } from "@/src/utils/fileUtils";

export default function StoriesPage() {
  return <StoriesTable />;
}

async function StoriesTable() {
  const filePath = path.join(process.cwd(), "data", "stories.json");
  const stories = await readJSON<Story>(filePath);

  return (
    <>
      <PageHeader title="داستان‌ها" href="/admin/stories/new" />
      {stories.length ? (
        <AdminTable stories={stories} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
