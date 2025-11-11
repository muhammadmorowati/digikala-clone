import PageHeader from "@/src/components/admin/PageHeader";
import ArticleForm from "@/src/components/admin/ArticleForm";
import { mockCategories, mockArticles } from "@/src/data/articlesData";

export default function EditArticlePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const article = mockArticles.find((a) => a._id === id);

  if (!article) {
    return (
      <div className="p-6 text-center text-red-600">
        مقاله‌ای با این شناسه یافت نشد.
      </div>
    );
  }

  return (
    <>
      <PageHeader title="ویرایش مقاله" />
      <ArticleForm article={article} categories={mockCategories} />
    </>
  );
}
