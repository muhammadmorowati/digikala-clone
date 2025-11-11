import AdminTable from "@/src/components/admin/AdminTable";
import PageHeader from "@/src/components/admin/PageHeader";
import { Article } from "@/src/utils/types";
import { promises as fs } from "fs";
import path from "path";

const ARTICLES_FILE_PATH = path.join(process.cwd(), "data", "articles.json");

export default async function AdminArticlesPage() {
  let articles: Article[] = [];

  try {
    const data = await fs.readFile(ARTICLES_FILE_PATH, "utf8");
    const parsed = JSON.parse(data);
    if (Array.isArray(parsed)) articles = parsed;
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
          هنوز مقاله‌ای ثبت نشده است.
          <br />
          <span className="text-sm">
            برای افزودن مقاله جدید، از دکمه بالا استفاده کنید.
          </span>
        </div>
      )}
    </>
  );
}
