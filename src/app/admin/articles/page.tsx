import AdminTable from "@/components/admin/AdminTable";
import PageHeader from "@/components/admin/PageHeader";
import { serializeDoc } from "@/utils/serializeDoc";

export default function AdminArticlesPage() {
  return <ArticleTable />;
}

async function ArticleTable() {

  return (
    <>
      <PageHeader href="/admin/articles/new" title="مقالات" />

        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
    </>
  );
}
