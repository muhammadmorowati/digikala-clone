import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { Article } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

export default async function AdminArticlesPage() {
  const articlesFilePath = path.join(process.cwd(), "data", "articles.json");

  let articles: Article[] = [];

  try {
    const data = await fs.readFile(articlesFilePath, "utf8");
    articles = JSON.parse(data);
  } catch (error: any) {
    if (error.code !== "ENOENT") {
      console.error("❌ Failed to read articles.json:", error);
    }
  }

  return (
    <>
      <PageHeader href="/admin/articles/new" title="مقالات" />
      {articles.length > 0 ? (
        <AdminTable articles={articles} />
      ) : (
        <div className="text-neutral-500 p-5 text-center">
          آیتمی برای نمایش وجود ندارد.
        </div>
      )}
    </>
  );
}
