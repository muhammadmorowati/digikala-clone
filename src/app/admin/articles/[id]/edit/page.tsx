import ArticleForm from "@/components/admin/ArticleForm";
import PageHeader from "@/components/admin/PageHeader";
import { serializeDoc } from "@/utils/serializeDoc";


export default async function EditArticlePage({
  params: { id },
}: {
  params: { id: string };
}) {

  return (
    <>
      <PageHeader title="ویرایش مقاله" />
    </>
  );
}
