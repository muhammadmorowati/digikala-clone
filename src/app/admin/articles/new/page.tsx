import PageHeader from "@/src/components/admin/PageHeader";
import ArticleForm from "@/src/components/admin/ArticleForm";
import { mockCategories } from "@/src/data/categoriesData";

export default function NewArticlePage() {
  return (
    <>
      <PageHeader title="افزودن مقاله جدید" />
      <ArticleForm categories={mockCategories} />
    </>
  );
}
