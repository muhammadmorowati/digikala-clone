import PageHeader from "@/components/admin/PageHeader";
import UserUpdateForm from "@/components/admin/UserUpdateForm";
import { serializeDoc } from "@/utils/serializeDoc";

export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {

  return (
    <>
      <PageHeader title="ویرایش اطلاعات کاربر" />
    </>
  );
}
