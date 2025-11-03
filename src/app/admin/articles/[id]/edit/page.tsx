import connectToDB from "@/config/mongodb";
import ArticleForm from "@/src/components/admin/ArticleForm";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";
import ArticleModel from "@/models/Article";
import CategoryModel from "@/models/Category";

export default async function EditArticlePage({
  params: { id },
}: {
  params: { id: string };
}) {
  await connectToDB();
  const article = await ArticleModel.findOne({ _id: id }).lean();
  const categories = await CategoryModel.find({}).lean();

  const serializedArticle = serializeDoc(article);
  const serializedCategory = serializeDoc(categories);

  return (
    <>
      <PageHeader title="ویرایش مقاله" />
      <ArticleForm
        article={serializedArticle}
        categories={serializedCategory}
      />
    </>
  );
}
