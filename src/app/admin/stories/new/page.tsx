import PageHeader from "@/src/components/admin/PageHeader";
import StoryForm from "@/src/components/admin/StoryForm";


export default async function NewProductPage() {

  return (
    <>
      <PageHeader title="افزودن داستان جدید" />
      <StoryForm />
    </>
  );
}
