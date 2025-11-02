import connectToDB from "@/config/mongodb";
import PageHeader from "@/src/components/admin/PageHeader";
import UserUpdateForm from "@/src/components/admin/UserUpdateForm";
import { serializeDoc } from "@/src/utils/serializeDoc";


export default async function EditProductPage({
  params: { id },
}: {
  params: { id: string };
}) {
  await connectToDB();
  const user = await UserModel.findOne({ _id: id });
  const serializedUser = serializeDoc(user);

  if (!user) return <p>کاربر یافت نشد.</p>;

  return (
    <>
      <PageHeader title="ویرایش اطلاعات کاربر" />
      <UserUpdateForm user={serializedUser} />
    </>
  );
}
