import connectToDB from "@/config/mongodb";
import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";


export default function AdminArticlesPage() {
  return <ArticleTable />;
}

async function ArticleTable() {
  await connectToDB();
  const articles = await ArticleModel.find({}).lean();
  const serializedArticles = serializeDoc(articles);

  return (
    <>
      <PageHeader href="/admin/articles/new" title="مقالات" />
      {articles.length ? (
        <AdminTable articles={serializedArticles} />
      ) : (
        <div className="text-neutral-500">آیتمی برای نمایش وجود ندارد.</div>
      )}
    </>
  );
}
