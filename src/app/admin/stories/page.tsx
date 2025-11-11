import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import path from "path";
import { Story } from "@/src/utils/types";
import { readJSON } from "@/src/utils/fileUtils";

export default function StoriesPage() {
  return <StoriesTable />;
}

async function StoriesTable() {
  const filePath = path.join(process.cwd(), "data", "stories.json");

  let stories: Story[] = [];
  try {
    stories = await readJSON<Story>(filePath);
  } catch (error) {
    console.error("❌ Failed to load stories.json:", error);
  }

  const hasStories = stories.length > 0;

  return (
    <>
      <PageHeader title="داستان‌ها" href="/admin/stories/new" />
      {hasStories ? (
        <AdminTable stories={stories} />
      ) : (
        <div className="text-neutral-500 text-center p-5">
          آیتمی برای نمایش وجود ندارد.
        </div>
      )}
    </>
  );
}
