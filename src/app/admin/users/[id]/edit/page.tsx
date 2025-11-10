import PageHeader from "@/src/components/admin/PageHeader";
import UserUpdateForm from "@/src/components/admin/UserUpdateForm";
import path from "path";
import { readJSON } from "@/src/utils/fileUtils";
import { User } from "@/src/utils/types";

export default async function EditUserPage({ params: { id } }: { params: { id: string } }) {
  const users = await readJSON<User>(path.join(process.cwd(), "data", "users.json"));
  const user = users.find((u) => u._id === id);

  if (!user) return <p>کاربر یافت نشد.</p>;

  return (
    <>
      <PageHeader title="ویرایش اطلاعات کاربر" />
      <UserUpdateForm user={user} />
    </>
  );
}
