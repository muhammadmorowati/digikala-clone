import AdminTable from "@/components/admin/AdminTable";
import PageHeader from "@/components/admin/PageHeader";
import { serializeDoc } from "@/utils/serializeDoc";

export default async function StoriesPage() {

  return (
    <>
      <PageHeader title="داستان ها" href="/admin/stories/new" />

        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
    </>
  );
}
