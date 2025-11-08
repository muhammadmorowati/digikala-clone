import connectToDB from "@/config/mongodb";
import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";
import StoryModel from "@/models/Story"

export default async function StoriesPage() {
  await connectToDB();
  const stories = await StoryModel.find({}).lean();
  const serializedStories = serializeDoc(stories);

  return (
    <>
      <PageHeader title="داستان ها" href="/admin/stories/new" />
      {stories.length ? (
        <AdminTable stories={serializedStories} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
