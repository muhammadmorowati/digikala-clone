import connectToDB from "@/config/mongodb";
import ArticleForm from "@/src/components/admin/ArticleForm";
import PageHeader from "@/src/components/admin/PageHeader";
import { serializeDoc } from "@/src/utils/serializeDoc";
import CategoryModel from "@/models/Category";


export default async function NewCategoryPage() {
  await connectToDB();
  const categories = await CategoryModel.find({}).lean();

  const serializedCategory = serializeDoc(categories);

  return (
    <>
      <PageHeader title="افزودن مقاله جدید" />
      <ArticleForm categories={serializedCategory} />
    </>
  );
}
